import { NextRequest, NextResponse } from "next/server";
import { createClient, createAdminClient } from "@/lib/supabase/server";
import type { Database } from "@/types/supabase";

type PlanInsert = Database["public"]["Tables"]["subscription_plans"]["Insert"];
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

/** GET /api/admin/plans — list all plans */
export async function GET() {
  const user = await requireSuperAdmin();
  if (!user) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const admin = await createAdminClient();
  const { data, error } = await admin
    .from("subscription_plans")
    .select("*")
    .order("sort_order", { ascending: true })
    .returns<Database["public"]["Tables"]["subscription_plans"]["Row"][]>();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

/** POST /api/admin/plans — create a plan */
export async function POST(request: NextRequest) {
  const user = await requireSuperAdmin();
  if (!user) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const body = await request.json() as Partial<PlanInsert>;
  if (!body.name || !body.slug) {
    return NextResponse.json({ error: "name and slug are required" }, { status: 422 });
  }

  const admin = await createAdminClient();
  const db = admin as unknown as AnyDb;
  const insertData: PlanInsert = {
    name: body.name,
    slug: body.slug,
    description: body.description ?? null,
    price_monthly: body.price_monthly ?? 0,
    price_yearly: body.price_yearly ?? 0,
    features: body.features ?? [],
    feature_limits: body.feature_limits ?? {},
    is_active: body.is_active ?? true,
    is_featured: body.is_featured ?? false,
    sort_order: body.sort_order ?? 99,
    razorpay_plan_id_monthly: body.razorpay_plan_id_monthly ?? null,
    razorpay_plan_id_yearly: body.razorpay_plan_id_yearly ?? null,
  };

  const { data, error } = await db
    .from("subscription_plans")
    .insert(insertData)
    .select("*")
    .single() as { data: Database["public"]["Tables"]["subscription_plans"]["Row"] | null; error: { message: string } | null };

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data, { status: 201 });
}
