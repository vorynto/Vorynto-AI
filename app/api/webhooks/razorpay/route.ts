/**
 * POST /api/webhooks/razorpay
 *
 * Handles Razorpay webhook events to confirm/fail payments and update
 * the subscriptions + payment_orders tables accordingly.
 *
 * Configure this URL in Razorpay Dashboard → Settings → Webhooks:
 *   https://your-domain.com/api/webhooks/razorpay
 *
 * Subscribed events:
 *   payment.captured, payment.failed,
 *   subscription.activated, subscription.completed,
 *   subscription.cancelled, subscription.halted
 */

import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/server";
import { getRazorpayConfig, verifyWebhookSignature } from "@/lib/razorpay";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyDb = { from: (t: string) => any };

interface RazorpayWebhookPayload {
  entity: string;
  account_id: string;
  event: string;
  contains: string[];
  payload: {
    payment?: {
      entity: {
        id: string;
        order_id?: string;
        subscription_id?: string;
        amount: number;
        currency: string;
        status: string;
        captured: boolean;
        error_description?: string;
        notes?: Record<string, string>;
      };
    };
    subscription?: {
      entity: {
        id: string;
        plan_id: string;
        status: string;
        current_start?: number;
        current_end?: number;
        customer_id?: string;
        notes?: Record<string, string>;
      };
    };
  };
}

export async function POST(request: NextRequest) {
  const rawBody = await request.text();
  const signature = request.headers.get("x-razorpay-signature") ?? "";

  // Verify signature
  const rzpConfig = await getRazorpayConfig();
  if (rzpConfig.webhookSecret) {
    if (!verifyWebhookSignature(rawBody, signature, rzpConfig.webhookSecret)) {
      return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
    }
  }

  let payload: RazorpayWebhookPayload;
  try {
    payload = JSON.parse(rawBody) as RazorpayWebhookPayload;
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const admin = await createAdminClient();
  const db = admin as unknown as AnyDb;
  const event = payload.event;

  try {
    // ── Payment captured ─────────────────────────────────────────
    if (event === "payment.captured") {
      const payment = payload.payload.payment?.entity;
      if (!payment) return NextResponse.json({ ok: true });

      const orderId = payment.order_id;
      const subscriptionId = payment.subscription_id;

      // Update payment_orders row to paid
      if (orderId) {
        await db.from("payment_orders")
          .update({
            status: "paid",
            razorpay_payment_id: payment.id,
            captured_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          })
          .eq("razorpay_order_id", orderId);

        // Fetch the order to get tenant + plan info
        const { data: order } = await admin
          .from("payment_orders")
          .select("tenant_id, plan_id, billing_cycle")
          .eq("razorpay_order_id", orderId)
          .returns<{ tenant_id: string; plan_id: string; billing_cycle: string }[]>()
          .maybeSingle();

        if (order) {
          await activateSubscription(db, order.tenant_id, order.plan_id, order.billing_cycle, undefined, payment.id);
        }
      }

      if (subscriptionId) {
        await db.from("payment_orders")
          .update({
            status: "paid",
            razorpay_payment_id: payment.id,
            captured_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          })
          .eq("razorpay_subscription_id", subscriptionId);
      }
    }

    // ── Payment failed ───────────────────────────────────────────
    else if (event === "payment.failed") {
      const payment = payload.payload.payment?.entity;
      if (!payment) return NextResponse.json({ ok: true });

      if (payment.order_id) {
        await db.from("payment_orders")
          .update({
            status: "failed",
            error_description: payment.error_description ?? "Payment failed",
            updated_at: new Date().toISOString(),
          })
          .eq("razorpay_order_id", payment.order_id);
      }
    }

    // ── Subscription activated ───────────────────────────────────
    else if (event === "subscription.activated") {
      const sub = payload.payload.subscription?.entity;
      if (!sub) return NextResponse.json({ ok: true });

      // Find related payment_order to get tenant + plan
      const { data: order } = await admin
        .from("payment_orders")
        .select("tenant_id, plan_id, billing_cycle")
        .eq("razorpay_subscription_id", sub.id)
        .returns<{ tenant_id: string; plan_id: string; billing_cycle: string }[]>()
        .maybeSingle();

      if (order) {
        await activateSubscription(
          db,
          order.tenant_id,
          order.plan_id,
          order.billing_cycle,
          sub.id,
          undefined,
          sub.customer_id,
          sub.current_start
            ? new Date(sub.current_start * 1000).toISOString()
            : undefined,
          sub.current_end
            ? new Date(sub.current_end * 1000).toISOString()
            : undefined
        );
      }
    }

    // ── Subscription cancelled / halted ──────────────────────────
    else if (event === "subscription.cancelled" || event === "subscription.halted") {
      const sub = payload.payload.subscription?.entity;
      if (!sub) return NextResponse.json({ ok: true });

      await db.from("subscriptions")
        .update({
          status: event === "subscription.halted" ? "past_due" : "canceled",
          canceled_at: event === "subscription.cancelled" ? new Date().toISOString() : null,
          updated_at: new Date().toISOString(),
        })
        .eq("razorpay_subscription_id", sub.id);
    }

    // ── Subscription completed ───────────────────────────────────
    else if (event === "subscription.completed") {
      const sub = payload.payload.subscription?.entity;
      if (!sub) return NextResponse.json({ ok: true });

      await db.from("subscriptions")
        .update({ status: "canceled", updated_at: new Date().toISOString() })
        .eq("razorpay_subscription_id", sub.id);
    }

    return NextResponse.json({ ok: true });

  } catch (err) {
    console.error("[webhook/razorpay]", event, err);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}

/** Upsert a subscription row to status=active for a tenant. */
async function activateSubscription(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  db: AnyDb,
  tenantId: string,
  planId: string,
  billingCycle: string,
  razorpaySubId?: string,
  razorpayPaymentId?: string,
  razorpayCustomerId?: string,
  periodStart?: string,
  periodEnd?: string
) {
  const now = new Date().toISOString();

  // Check if subscription already exists for tenant
  const admin = await createAdminClient();
  const { data: existing } = await admin
    .from("subscriptions")
    .select("id")
    .eq("tenant_id", tenantId)
    .returns<{ id: string }[]>()
    .maybeSingle();

  const updatePayload: Record<string, unknown> = {
    plan_id: planId,
    status: "active",
    billing_cycle: billingCycle,
    current_period_start: periodStart ?? now,
    current_period_end: periodEnd ?? getNextPeriodEnd(billingCycle, now),
    updated_at: now,
  };
  if (razorpaySubId) updatePayload.razorpay_subscription_id = razorpaySubId;
  if (razorpayCustomerId) updatePayload.razorpay_customer_id = razorpayCustomerId;

  if (existing) {
    await db.from("subscriptions").update(updatePayload).eq("id", existing.id);
  } else {
    await db.from("subscriptions").insert({
      ...updatePayload,
      tenant_id: tenantId,
      created_at: now,
    });
  }

  // Optionally log the payment ID on the order row
  if (razorpayPaymentId) {
    await db.from("payment_orders")
      .update({ status: "paid", captured_at: now, updated_at: now })
      .eq("razorpay_payment_id", razorpayPaymentId);
  }
}

function getNextPeriodEnd(billingCycle: string, from: string): string {
  const d = new Date(from);
  if (billingCycle === "yearly") {
    d.setFullYear(d.getFullYear() + 1);
  } else {
    d.setMonth(d.getMonth() + 1);
  }
  return d.toISOString();
}
