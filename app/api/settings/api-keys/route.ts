import { NextRequest, NextResponse } from "next/server";
import { createClient, createAdminClient } from "@/lib/supabase/server";
import { getCurrentTenantId, maskKey } from "@/lib/tenant-keys";
import type { Database } from "@/types/supabase";

// Scoped escape hatch: PostgREST v14 inference breaks update/insert builders
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyDb = { from: (t: string) => any };

type ApiKeyUpdate = Database["public"]["Tables"]["tenant_api_keys"]["Update"];
type ApiKeyInsert = Database["public"]["Tables"]["tenant_api_keys"]["Insert"];

/** GET /api/settings/api-keys
 *  Returns all saved API keys for the current tenant (with masked values).
 *  Shape: { provider: { key_name: { id, masked, saved: true, verified } } }
 */
export async function GET() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const tenantId = await getCurrentTenantId(user.id);
  if (!tenantId) return NextResponse.json({ error: "No tenant" }, { status: 400 });

  const admin = await createAdminClient();
  const { data: rows } = await admin
    .from("tenant_api_keys")
    .select("id, provider, key_name, encrypted_value, is_verified, verified_at")
    .eq("tenant_id", tenantId)
    .returns<{
      id: string;
      provider: string;
      key_name: string;
      encrypted_value: string;
      is_verified: boolean | null;
      verified_at: string | null;
    }[]>();

  // Build nested map: provider → key_name → metadata (never expose raw value)
  const result: Record<string, Record<string, {
    id: string; masked: string; saved: boolean; verified: boolean;
  }>> = {};

  for (const row of rows ?? []) {
    if (!result[row.provider]) result[row.provider] = {};
    result[row.provider][row.key_name] = {
      id: row.id,
      masked: maskKey(row.encrypted_value),
      saved: true,
      verified: row.is_verified ?? false,
    };
  }

  return NextResponse.json(result);
}

/** POST /api/settings/api-keys — Upsert one API key.
 *  Body: { provider, key_name, value }
 */
export async function POST(request: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const tenantId = await getCurrentTenantId(user.id);
  if (!tenantId) return NextResponse.json({ error: "No tenant" }, { status: 400 });

  const body = await request.json() as { provider?: string; key_name?: string; value?: string };
  const { provider, key_name, value } = body;

  if (!provider || !key_name || !value?.trim()) {
    return NextResponse.json({ error: "provider, key_name, and value are required" }, { status: 422 });
  }

  const admin = await createAdminClient();
  const db = admin as unknown as AnyDb;

  // Check if a row already exists for this provider+key_name
  const { data: existing } = await admin
    .from("tenant_api_keys")
    .select("id")
    .eq("tenant_id", tenantId)
    .eq("provider", provider)
    .eq("key_name", key_name)
    .returns<{ id: string }[]>()
    .maybeSingle();

  if (existing) {
    const updateData: ApiKeyUpdate = {
      encrypted_value: value.trim(),
      is_verified: false,
      verified_at: null,
      updated_at: new Date().toISOString(),
    };
    await db.from("tenant_api_keys").update(updateData).eq("id", existing.id);
  } else {
    const insertData: ApiKeyInsert = {
      tenant_id: tenantId,
      provider,
      key_name,
      encrypted_value: value.trim(),
      created_by: user.id,
      is_verified: false,
    };
    await db.from("tenant_api_keys").insert(insertData);
  }

  return NextResponse.json({ ok: true, masked: maskKey(value.trim()) });
}
