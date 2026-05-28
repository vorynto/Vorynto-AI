import { NextResponse } from "next/server";
import { createClient, createAdminClient } from "@/lib/supabase/server";
import { getCurrentTenantId } from "@/lib/tenant-keys";
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyDb = { from: (t: string) => any };

/** POST /api/tenants/complete — Mark the current tenant's setup as complete. */
export async function POST() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const tenantId = await getCurrentTenantId(user.id);
  if (!tenantId) return NextResponse.json({ error: "No tenant" }, { status: 400 });

  const admin = await createAdminClient();
  const db = admin as unknown as AnyDb;
  await db.from("tenants").update({
    is_setup_complete: true,
    updated_at: new Date().toISOString(),
  }).eq("id", tenantId);

  return NextResponse.json({ ok: true });
}
