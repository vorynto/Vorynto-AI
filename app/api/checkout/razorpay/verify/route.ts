/**
 * POST /api/checkout/razorpay/verify
 *
 * Called client-side after the Razorpay modal closes with a success response.
 * Verifies the payment signature, marks the order as paid in our DB,
 * and activates the subscription for the tenant.
 *
 * Body: {
 *   razorpay_order_id?,
 *   razorpay_payment_id,
 *   razorpay_subscription_id?,
 *   razorpay_signature
 * }
 */

import { NextRequest, NextResponse } from "next/server";
import { createClient, createAdminClient } from "@/lib/supabase/server";
import { getCurrentTenantId } from "@/lib/tenant-keys";
import { getRazorpayConfig, verifyPaymentSignature } from "@/lib/razorpay";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyDb = { from: (t: string) => any };

interface VerifyBody {
  razorpay_order_id?: string;
  razorpay_payment_id: string;
  razorpay_subscription_id?: string;
  razorpay_signature: string;
}

export async function POST(request: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const tenantId = await getCurrentTenantId(user.id);
  if (!tenantId) return NextResponse.json({ error: "No tenant" }, { status: 400 });

  const body = await request.json() as VerifyBody;
  const { razorpay_order_id, razorpay_payment_id, razorpay_subscription_id, razorpay_signature } = body;

  if (!razorpay_payment_id || !razorpay_signature) {
    return NextResponse.json({ error: "Missing payment_id or signature" }, { status: 422 });
  }

  const rzpConfig = await getRazorpayConfig();
  if (!rzpConfig.isConfigured) {
    return NextResponse.json({ error: "Payment gateway not configured" }, { status: 503 });
  }

  // Verify signature
  const referenceId = razorpay_order_id ?? razorpay_subscription_id ?? "";
  const isValid = verifyPaymentSignature(
    referenceId,
    razorpay_payment_id,
    rzpConfig.keySecret,
    razorpay_signature
  );

  if (!isValid) {
    return NextResponse.json({ error: "Invalid payment signature" }, { status: 400 });
  }

  const admin = await createAdminClient();
  const db = admin as unknown as AnyDb;
  const now = new Date().toISOString();

  // Update payment_orders row
  const matchField = razorpay_order_id ? "razorpay_order_id" : "razorpay_subscription_id";
  const matchValue = razorpay_order_id ?? razorpay_subscription_id;

  if (matchValue) {
    await db.from("payment_orders")
      .update({
        status: "paid",
        razorpay_payment_id,
        razorpay_signature,
        captured_at: now,
        updated_at: now,
      })
      .eq(matchField, matchValue)
      .eq("tenant_id", tenantId);
  }

  // Fetch the order to activate subscription
  let planId: string | null = null;
  let billingCycle = "monthly";

  if (matchValue) {
    const { data: order } = await admin
      .from("payment_orders")
      .select("plan_id, billing_cycle")
      .eq(matchField, matchValue)
      .eq("tenant_id", tenantId)
      .returns<{ plan_id: string | null; billing_cycle: string }[]>()
      .maybeSingle();

    if (order) {
      planId = order.plan_id;
      billingCycle = order.billing_cycle;
    }
  }

  // Activate / upsert subscription
  if (planId) {
    const periodEnd = new Date(now);
    if (billingCycle === "yearly") {
      periodEnd.setFullYear(periodEnd.getFullYear() + 1);
    } else {
      periodEnd.setMonth(periodEnd.getMonth() + 1);
    }

    const { data: existingSub } = await admin
      .from("subscriptions")
      .select("id")
      .eq("tenant_id", tenantId)
      .returns<{ id: string }[]>()
      .maybeSingle();

    const subPayload: Record<string, unknown> = {
      plan_id: planId,
      status: "active",
      billing_cycle: billingCycle,
      current_period_start: now,
      current_period_end: periodEnd.toISOString(),
      updated_at: now,
    };
    if (razorpay_subscription_id) subPayload.razorpay_subscription_id = razorpay_subscription_id;

    if (existingSub) {
      await db.from("subscriptions").update(subPayload).eq("id", existingSub.id);
    } else {
      await db.from("subscriptions").insert({ ...subPayload, tenant_id: tenantId, created_at: now });
    }
  }

  return NextResponse.json({ ok: true, paymentId: razorpay_payment_id });
}
