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

/** GET /api/admin/users — list all users with profile + tenant info */
export async function GET() {
  const user = await requireSuperAdmin();
  if (!user) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const admin = await createAdminClient();
  const { data, error } = await admin
    .from("profiles")
    .select("id, first_name, last_name, role, is_active, last_seen, tenant_id, tenants(name)")
    .order("created_at", { ascending: false })
    .returns<{
      id: string;
      first_name: string | null;
      last_name: string | null;
      role: string | null;
      is_active: boolean | null;
      last_seen: string | null;
      tenant_id: string | null;
      tenants: { name: string } | null;
    }[]>();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

/** POST /api/admin/users — create a user in Supabase Auth + set role */
export async function POST(request: NextRequest) {
  const adminUser = await requireSuperAdmin();
  if (!adminUser) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const body = await request.json() as {
    email?: string;
    password?: string;
    role?: string;
    first_name?: string;
    last_name?: string;
  };

  if (!body.email) return NextResponse.json({ error: "email is required" }, { status: 422 });

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

  // Create auth user
  const authRes = await fetch(`${supabaseUrl}/auth/v1/admin/users`, {
    method: "POST",
    headers: {
      apikey: serviceKey,
      Authorization: `Bearer ${serviceKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email: body.email,
      password: body.password ?? "ChangeMe@2025!",
      email_confirm: true,
      user_metadata: {
        first_name: body.first_name ?? "",
        last_name: body.last_name ?? "",
      },
    }),
  });

  const authData = await authRes.json() as { id?: string; error?: string; msg?: string };
  if (!authRes.ok || !authData.id) {
    return NextResponse.json({ error: authData.msg ?? authData.error ?? "Auth creation failed" }, { status: 500 });
  }

  // Upsert profile with correct role
  const admin = await createAdminClient();
  const db = admin as unknown as AnyDb;
  await db.from("profiles").upsert({
    id: authData.id,
    first_name: body.first_name ?? "",
    last_name: body.last_name ?? "",
    role: body.role ?? "tenant_user",
    is_active: true,
  });

  return NextResponse.json({ ok: true, id: authData.id }, { status: 201 });
}
