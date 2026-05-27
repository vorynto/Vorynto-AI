import { NextResponse } from "next/server";
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

/** GET /api/admin/tenants — list all tenants with subscription info */
export async function GET() {
  const user = await requireSuperAdmin();
  if (!user) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const admin = await createAdminClient();
  const { data, error } = await admin
    .from("tenants")
    .select("id, name, slug, email, is_active, is_setup_complete, created_at, country, subscriptions(status, subscription_plans(name, slug))")
    .order("created_at", { ascending: false })
    .returns<{
      id: string;
      name: string;
      slug: string;
      email: string | null;
      is_active: boolean | null;
      is_setup_complete: boolean | null;
      created_at: string | null;
      country: string | null;
      subscriptions: { status: string | null; subscription_plans: { name: string; slug: string } | null }[];
    }[]>();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}
