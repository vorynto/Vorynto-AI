import { NextRequest, NextResponse } from "next/server";
import { createClient, createAdminClient } from "@/lib/supabase/server";
import type { Database } from "@/types/supabase";

type PlanUpdate = Database["public"]["Tables"]["subscription_plans"]["Update"];
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyDb = { from: (t: string) => any };

async function requireSuperAdmin() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;
  const { data: profile } = await supabase
    .from("profiles").select("role").eq("id", user.id)
    .returns<{ role: string | null }[]>().maybeSingle();
  return profile?.role === "super_admin" ? user : null;
}

/** PATCH /api/admin/plans/[id] — update a plan */
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await requireSuperAdmin();
  if (!user) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const { id } = await params;
  const body = await request.json() as Partial<PlanUpdate>;

  const admin = await createAdminClient();
  const db = admin as unknown as AnyDb;

  const { data, error } = await db
    .from("subscription_plans")
    .update({ ...body, updated_at: new Date().toISOString() })
    .eq("id", id)
    .select("*")
    .single() as { data: Database["public"]["Tables"]["subscription_plans"]["Row"] | null; error: { message: string } | null };

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

/** DELETE /api/admin/plans/[id] — delete a plan */
export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await requireSuperAdmin();
  if (!user) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const { id } = await params;
  const admin = await createAdminClient();
  const db = admin as unknown as AnyDb;

  const { error } = await db.from("subscription_plans").delete().eq("id", id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
