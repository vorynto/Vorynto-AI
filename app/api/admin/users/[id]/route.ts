import { NextRequest, NextResponse } from "next/server";
import { createClient, createAdminClient } from "@/lib/supabase/server";
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyDb = { from: (t: string) => any };

async function requireSuperAdmin() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;
  const { data: p } = await supabase.from("profiles").select("role").eq("id", user.id)
    .returns<{ role: string | null }[]>().maybeSingle();
  return p?.role === "super_admin" ? user : null;
}

/** PATCH /api/admin/users/[id] — update role or status */
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await requireSuperAdmin();
  if (!user) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const { id } = await params;
  const body = await request.json() as { role?: string; is_active?: boolean };

  const admin = await createAdminClient();
  const db = admin as unknown as AnyDb;
  const { error } = await db.from("profiles").update({
    ...body,
    updated_at: new Date().toISOString(),
  }).eq("id", id);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}

/** DELETE /api/admin/users/[id] — deactivate (soft delete) */
export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await requireSuperAdmin();
  if (!user) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const { id } = await params;
  const admin = await createAdminClient();
  const db = admin as unknown as AnyDb;
  await db.from("profiles").update({ is_active: false }).eq("id", id);
  return NextResponse.json({ ok: true });
}
