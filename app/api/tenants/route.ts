import { NextRequest, NextResponse } from "next/server";
import { createClient, createAdminClient } from "@/lib/supabase/server";
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyDb = { from: (t: string) => any };

/** POST /api/tenants — Create a tenant for the signed-in user and link them to it.
 *  Called at the end of onboarding step 1 (Company Info).
 *  Body: { companyName, website?, industry?, teamSize?, phone?, country? }
 */
export async function POST(request: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await request.json() as {
    companyName?: string;
    website?: string;
    industry?: string;
    teamSize?: string;
    phone?: string;
    country?: string;
  };

  if (!body.companyName?.trim()) {
    return NextResponse.json({ error: "companyName is required" }, { status: 422 });
  }

  const admin = await createAdminClient();
  const db = admin as unknown as AnyDb;

  // Check if user already has a tenant — idempotent
  const { data: existingProfile } = await admin
    .from("profiles")
    .select("tenant_id")
    .eq("id", user.id)
    .returns<{ tenant_id: string | null }[]>()
    .maybeSingle();

  if (existingProfile?.tenant_id) {
    // Already has a tenant — update its details and return
    await db.from("tenants").update({
      name: body.companyName.trim(),
      domain: body.website?.trim() || null,
      phone: body.phone?.trim() || null,
      country: body.country?.trim() || null,
      updated_at: new Date().toISOString(),
    }).eq("id", existingProfile.tenant_id);

    return NextResponse.json({ ok: true, tenantId: existingProfile.tenant_id });
  }

  // Generate a URL-safe slug from the company name
  const slug = body.companyName
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 50);

  // Ensure slug is unique by appending a short random suffix if needed
  const { data: existing } = await admin
    .from("tenants")
    .select("slug")
    .eq("slug", slug)
    .returns<{ slug: string }[]>()
    .maybeSingle();

  const finalSlug = existing
    ? `${slug}-${Math.random().toString(36).slice(2, 6)}`
    : slug;

  // Create the tenant (use AnyDb to bypass PostgREST v14 insert type inference)
  const { data: tenant, error: tenantError } = await (db.from("tenants").insert({
    name: body.companyName.trim(),
    slug: finalSlug,
    email: user.email ?? null,
    domain: body.website?.trim() || null,
    phone: body.phone?.trim() || null,
    country: body.country?.trim() || null,
    created_by: user.id,
    is_active: true,
    is_setup_complete: false,
  }).select("id").maybeSingle()) as { data: { id: string } | null; error: { message: string } | null };

  if (tenantError || !tenant?.id) {
    return NextResponse.json(
      { error: tenantError?.message ?? "Failed to create tenant" },
      { status: 500 }
    );
  }

  // Link user profile to the new tenant and make them tenant_admin
  const { error: profileError } = await db.from("profiles").update({
    tenant_id: tenant.id,
    role: "tenant_admin",
    updated_at: new Date().toISOString(),
  }).eq("id", user.id);

  if (profileError) {
    // Roll back: delete the tenant we just created
    await db.from("tenants").delete().eq("id", tenant.id);
    return NextResponse.json({ error: "Failed to link user to tenant" }, { status: 500 });
  }

  return NextResponse.json({ ok: true, tenantId: tenant.id }, { status: 201 });
}
