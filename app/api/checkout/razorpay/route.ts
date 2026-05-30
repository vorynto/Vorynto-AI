/**
 * POST /api/checkout/razorpay
 *
 * Creates a Razorpay order (one-time) or subscription (recurring) for the
 * current tenant's plan upgrade. Also upserts a payment_orders row so we
 * can track the transaction.
 *
 * Body: { planId, billingCycle: "monthly" | "yearly", mode: "order" | "subscription" }
 * Response: { orderId?, subscriptionId?, keyId, amount, currency, tenantName, email }
 */

import { NextRequest, NextResponse } from "next/server";
import { createClient, createAdminClient } from "@/lib/supabase/server";
import { getCurrentTenantId } from "@/lib/tenant-keys";
import {
  getRazorpayConfig,
  createRazorpayOrder,
  createRazorpaySubscription,
  createRazorpayCustomer,
} from "@/lib/razorpay";
import type { Database } from "@/types/supabase";

type Plan = Database["public"]["Tables"]["subscription_plans"]["Row"];
type Tenant = Database["public"]["Tables"]["tenants"]["Row"];

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyDb = { from: (t: string) => any };

interface CheckoutBody {
  planId: string;
  billingCycle: "monthly" | "yearly";
  mode?: "order" | "subscription";
}

export async function POST(request: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const tenantId = await getCurrentTenantId(user.id);
  if (!tenantId) return NextResponse.json({ error: "No tenant found" }, { status: 400 });

  const body = await request.json() as CheckoutBody;
  const { planId, billingCycle, mode = "order" } = body;

  if (!planId || !billingCycle) {
    return NextResponse.json({ error: "planId and billingCycle are required" }, { status: 422 });
  }

  // Fetch plan
  const admin = await createAdminClient();
  const { data: plan } = await admin
    .from("subscription_plans")
    .select("*")
    .eq("id", planId)
    .eq("is_active", true)
    .returns<Plan[]>()
    .maybeSingle();

  if (!plan) return NextResponse.json({ error: "Plan not found or inactive" }, { status: 404 });

  // Fetch tenant info
  const { data: tenant } = await admin
    .from("tenants")
    .select("name, email")
    .eq("id", tenantId)
    .returns<Pick<Tenant, "name" | "email">[]>()
    .maybeSingle();

  // Get Razorpay config
  const rzpConfig = await getRazorpayConfig();
  if (!rzpConfig.isConfigured) {
    return NextResponse.json({ error: "Razorpay is not configured. Contact support." }, { status: 503 });
  }

  const priceUSD = billingCycle === "yearly" ? plan.price_yearly : plan.price_monthly;
  // Convert USD → INR paise (approx; replace with live FX or store INR prices in DB)
  // For now we store prices in USD so multiply by 8300 paise/dollar as fallback
  // If you store INR directly, just use priceUSD * 100 (paise)
  const currency = plan.currency?.toUpperCase() ?? "INR";
  const amountPaise = currency === "INR"
    ? Math.round(priceUSD * 100)           // price is already INR
    : Math.round(priceUSD * 8300);         // rough USD→INR conversion

  const receipt = `rcpt_${tenantId.slice(0, 8)}_${Date.now()}`;
  const db = admin as unknown as AnyDb;

  try {
    if (mode === "subscription") {
      // ── Recurring subscription ─────────────────────────────────
      const razorpayPlanId = billingCycle === "yearly"
        ? plan.razorpay_plan_id_yearly
        : plan.razorpay_plan_id_monthly;

      if (!razorpayPlanId) {
        return NextResponse.json(
          { error: `No Razorpay plan ID configured for ${plan.name} (${billingCycle}). Set it in Admin → Plans.` },
          { status: 422 }
        );
      }

      // Create / reuse Razorpay customer
      let rzpCustomerId: string | undefined;
      if (tenant?.email) {
        try {
          const customer = await createRazorpayCustomer(
            tenant.name ?? user.email ?? "Customer",
            tenant.email ?? user.email!,
            undefined
          );
          rzpCustomerId = customer.id;
        } catch {
          // Non-fatal — subscription can proceed without customer
        }
      }

      const sub = await createRazorpaySubscription(
        razorpayPlanId,
        billingCycle === "yearly" ? 12 : 120, // total billing cycles
        rzpCustomerId,
        { tenant_id: tenantId, plan_slug: plan.slug }
      );

      // Store payment order record
      await db.from("payment_orders").insert({
        tenant_id: tenantId,
        plan_id: planId,
        razorpay_subscription_id: sub.id,
        amount: amountPaise,
        currency,
        billing_cycle: billingCycle,
        status: "created",
        notes: { mode: "subscription", plan_name: plan.name },
      });

      return NextResponse.json({
        mode: "subscription",
        subscriptionId: sub.id,
        shortUrl: sub.short_url,
        keyId: rzpConfig.keyId,
        amount: amountPaise,
        currency,
        planName: plan.name,
        tenantName: tenant?.name ?? "",
        email: tenant?.email ?? user.email ?? "",
      });

    } else {
      // ── One-time order ─────────────────────────────────────────
      const order = await createRazorpayOrder(
        amountPaise,
        currency,
        receipt,
        { tenant_id: tenantId, plan_id: planId, billing_cycle: billingCycle }
      );

      // Store payment order record
      await db.from("payment_orders").insert({
        tenant_id: tenantId,
        plan_id: planId,
        razorpay_order_id: order.id,
        amount: amountPaise,
        currency,
        billing_cycle: billingCycle,
        status: "created",
        notes: { mode: "order", plan_name: plan.name, receipt },
      });

      return NextResponse.json({
        mode: "order",
        orderId: order.id,
        keyId: rzpConfig.keyId,
        amount: amountPaise,
        currency,
        planName: plan.name,
        tenantName: tenant?.name ?? "",
        email: tenant?.email ?? user.email ?? "",
      });
    }
  } catch (err) {
    console.error("[checkout/razorpay]", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Checkout failed" },
      { status: 500 }
    );
  }
}
