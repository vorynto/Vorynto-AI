/**
 * Server-side Razorpay helpers for platform-level subscription billing.
 *
 * These are the PLATFORM's Razorpay keys (used to collect subscription fees
 * from tenants). They are stored in the `platform_settings` table, separate
 * from tenant-owned keys in `tenant_api_keys`.
 *
 * Key IDs:
 *   razorpay_key_id         — rzp_live_... or rzp_test_...
 *   razorpay_key_secret     — never exposed to client
 *   razorpay_webhook_secret — for verifying webhook signatures
 */

import { createAdminClient } from "@/lib/supabase/server";
import crypto from "crypto";

export interface RazorpayConfig {
  keyId: string;
  keySecret: string;
  webhookSecret: string;
  isConfigured: boolean;
  isLive: boolean;
}

/** Fetch Razorpay config from platform_settings. Returns empty strings if not set. */
export async function getRazorpayConfig(): Promise<RazorpayConfig> {
  const admin = await createAdminClient();
  const { data: rows } = await admin
    .from("platform_settings")
    .select("key, value")
    .in("key", ["razorpay_key_id", "razorpay_key_secret", "razorpay_webhook_secret"])
    .returns<{ key: string; value: string }[]>();

  const map: Record<string, string> = {};
  for (const row of rows ?? []) map[row.key] = row.value;

  const keyId = map["razorpay_key_id"] ?? "";
  const keySecret = map["razorpay_key_secret"] ?? "";
  const webhookSecret = map["razorpay_webhook_secret"] ?? "";

  return {
    keyId,
    keySecret,
    webhookSecret,
    isConfigured: Boolean(keyId && keySecret),
    isLive: keyId.startsWith("rzp_live_"),
  };
}

/** Save one or more platform settings. Admin-only. */
export async function savePlatformSettings(
  entries: { key: string; value: string }[],
  userId: string
): Promise<void> {
  const admin = await createAdminClient();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const db = admin as unknown as { from: (t: string) => any };
  for (const entry of entries) {
    await db.from("platform_settings").upsert(
      { key: entry.key, value: entry.value, updated_by: userId, updated_at: new Date().toISOString() },
      { onConflict: "key" }
    );
  }
}

/** Mask a key for display — show last 4 chars only. */
export function maskPlatformKey(value: string): string {
  if (!value) return "";
  if (value.length <= 4) return "••••";
  return "••••••••••" + value.slice(-4);
}

/** Verify a Razorpay webhook signature. */
export function verifyWebhookSignature(
  rawBody: string,
  receivedSignature: string,
  secret: string
): boolean {
  const expectedSignature = crypto
    .createHmac("sha256", secret)
    .update(rawBody)
    .digest("hex");
  return expectedSignature === receivedSignature;
}

/** Verify a payment signature after order capture. */
export function verifyPaymentSignature(
  orderId: string,
  paymentId: string,
  secret: string,
  receivedSignature: string
): boolean {
  const body = `${orderId}|${paymentId}`;
  const expectedSignature = crypto
    .createHmac("sha256", secret)
    .update(body)
    .digest("hex");
  return expectedSignature === receivedSignature;
}

/** Make an authenticated Razorpay API call. */
export async function razorpayFetch(
  path: string,
  options: RequestInit = {},
  config?: RazorpayConfig
): Promise<Response> {
  const cfg = config ?? (await getRazorpayConfig());
  const credentials = Buffer.from(`${cfg.keyId}:${cfg.keySecret}`).toString("base64");
  return fetch(`https://api.razorpay.com/v1${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Basic ${credentials}`,
      ...(options.headers ?? {}),
    },
  });
}

/** Create a Razorpay order (one-time payment). Amount in paise. */
export async function createRazorpayOrder(
  amountPaise: number,
  currency: string,
  receipt: string,
  notes?: Record<string, string>
): Promise<{ id: string; amount: number; currency: string; receipt: string }> {
  const res = await razorpayFetch("/orders", {
    method: "POST",
    body: JSON.stringify({ amount: amountPaise, currency, receipt, notes: notes ?? {} }),
  });
  if (!res.ok) {
    const err = await res.json() as { error?: { description?: string } };
    throw new Error(err.error?.description ?? "Failed to create Razorpay order");
  }
  return res.json() as Promise<{ id: string; amount: number; currency: string; receipt: string }>;
}

/** Create a Razorpay subscription (recurring). */
export async function createRazorpaySubscription(
  planId: string,
  totalCount: number,
  customerId?: string,
  notes?: Record<string, string>
): Promise<{ id: string; plan_id: string; status: string; short_url: string }> {
  const body: Record<string, unknown> = {
    plan_id: planId,
    total_count: totalCount,
    notes: notes ?? {},
  };
  if (customerId) body.customer_id = customerId;

  const res = await razorpayFetch("/subscriptions", {
    method: "POST",
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const err = await res.json() as { error?: { description?: string } };
    throw new Error(err.error?.description ?? "Failed to create Razorpay subscription");
  }
  return res.json() as Promise<{ id: string; plan_id: string; status: string; short_url: string }>;
}

/** Create a Razorpay customer. */
export async function createRazorpayCustomer(
  name: string,
  email: string,
  contact?: string
): Promise<{ id: string; name: string; email: string }> {
  const res = await razorpayFetch("/customers", {
    method: "POST",
    body: JSON.stringify({ name, email, contact: contact ?? "", fail_existing: "0" }),
  });
  if (!res.ok) {
    const err = await res.json() as { error?: { description?: string } };
    throw new Error(err.error?.description ?? "Failed to create Razorpay customer");
  }
  return res.json() as Promise<{ id: string; name: string; email: string }>;
}
