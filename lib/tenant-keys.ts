/**
 * Server-side helpers for fetching tenant-owned API keys.
 *
 * Architecture: Each tenant manages their own API keys for AI services
 * (OpenAI, WhatsApp, Twilio, SMTP, Meta Ads). Vorynto AI only charges a
 * platform subscription fee — it never holds shared API keys for these services.
 *
 * Keys are stored per-row in `tenant_api_keys`:
 *   provider  | key_name          | encrypted_value
 *   ----------|-------------------|----------------
 *   openai    | api_key           | sk-...
 *   whatsapp  | access_token      | EAAx...
 *   whatsapp  | phone_number_id   | 12345678
 *   twilio    | account_sid       | ACxx...
 *   ...
 *
 * TODO: Add server-side AES-256 encryption before storing encrypted_value.
 *       For now, Supabase RLS ensures only the owning tenant can read its keys.
 */

import { createAdminClient } from "@/lib/supabase/server";

export type Provider = "openai" | "whatsapp" | "twilio" | "smtp" | "meta" | "razorpay";

/**
 * Fetch a single API key value for a tenant.
 * Returns null if the key has not been configured.
 */
export async function getTenantApiKey(
  tenantId: string,
  provider: Provider,
  keyName: string
): Promise<string | null> {
  const supabase = await createAdminClient();
  const { data } = await supabase
    .from("tenant_api_keys")
    .select("encrypted_value")
    .eq("tenant_id", tenantId)
    .eq("provider", provider)
    .eq("key_name", keyName)
    .returns<{ encrypted_value: string }[]>()
    .maybeSingle();

  return data?.encrypted_value ?? null;
}

/**
 * Fetch all keys for a provider as a key→value map.
 * E.g. { access_token: "EAAx...", phone_number_id: "12345" }
 */
export async function getTenantProviderKeys(
  tenantId: string,
  provider: Provider
): Promise<Record<string, string>> {
  const supabase = await createAdminClient();
  const { data } = await supabase
    .from("tenant_api_keys")
    .select("key_name, encrypted_value")
    .eq("tenant_id", tenantId)
    .eq("provider", provider)
    .returns<{ key_name: string; encrypted_value: string }[]>();

  if (!data) return {};
  return Object.fromEntries(data.map((k) => [k.key_name, k.encrypted_value]));
}

/**
 * Get the current user's tenant_id from their profile.
 * Used in API route handlers that need the tenant context.
 */
export async function getCurrentTenantId(userId: string): Promise<string | null> {
  const supabase = await createAdminClient();
  const { data } = await supabase
    .from("profiles")
    .select("tenant_id")
    .eq("id", userId)
    .returns<{ tenant_id: string | null }[]>()
    .maybeSingle();

  return data?.tenant_id ?? null;
}

/**
 * Check whether a tenant has the minimum required key(s) for a feature.
 */
export async function hasRequiredKeys(
  tenantId: string,
  provider: Provider,
  requiredKeys: string[]
): Promise<boolean> {
  const supabase = await createAdminClient();
  const { data } = await supabase
    .from("tenant_api_keys")
    .select("key_name")
    .eq("tenant_id", tenantId)
    .eq("provider", provider)
    .in("key_name", requiredKeys)
    .returns<{ key_name: string }[]>();

  if (!data) return false;
  return requiredKeys.every((k) => data.some((d) => d.key_name === k));
}

/** Mask a key value for display — show only last 4 characters. */
export function maskKey(value: string): string {
  if (!value || value.length <= 4) return "••••";
  return "••••••••••••" + value.slice(-4);
}
