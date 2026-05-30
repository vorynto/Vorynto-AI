/**
 * GET  /api/admin/billing        — summary stats + recent payment_orders
 * POST /api/admin/billing/config — save platform Razorpay keys
 */

import { NextRequest, NextResponse } from "next/server";
import { createClient, createAdminClient } from "@/lib/supabase/server";
import { savePlatformSettings } from "@/lib/razorpay";

async function assertSuperAdmin() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;
  const admin = await createAdminClient();
  const { data: profile } = await admin
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .returns<{ role: string | null }[]>()
    .maybeSingle();
  if (profile?.role !== "super_admin") return null;
  return user;
}

export async function GET() {
  const user = await assertSuperAdmin();
  if (!user) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const admin = await createAdminClient();

  // Recent payment orders with tenant name
  const { data: orders } = await admin
    .from("payment_orders")
    .select(`
      id, amount, currency, billing_cycle, status,
      razorpay_order_id, razorpay_payment_id, razorpay_subscription_id,
      created_at, captured_at,
      tenants(name, email),
      subscription_plans(name, slug)
    `)
    .order("created_at", { ascending: false })
    .limit(100)
    .returns<{
      id: string;
      amount: number;
      currency: string;
      billing_cycle: string;
      status: string;
      razorpay_order_id: string | null;
      razorpay_payment_id: string | null;
      razorpay_subscription_id: string | null;
      created_at: string;
      captured_at: string | null;
      tenants: { name: string; email: string } | null;
      subscription_plans: { name: string; slug: string } | null;
    }[]>();

  // Aggregate stats from paid orders
  const paid = (orders ?? []).filter((o) => o.status === "paid");
  const thisMonth = new Date();
  thisMonth.setDate(1);
  thisMonth.setHours(0, 0, 0, 0);

  const mrr = paid
    .filter((o) => o.billing_cycle === "monthly" && new Date(o.captured_at ?? o.created_at) >= thisMonth)
    .reduce((s, o) => s + o.amount, 0);

  const arr = paid
    .filter((o) => o.billing_cycle === "yearly" && new Date(o.captured_at ?? o.created_at) >= thisMonth)
    .reduce((s, o) => s + o.amount, 0);

  const totalRevenue = paid.reduce((s, o) => s + o.amount, 0);

  return NextResponse.json({
    orders: orders ?? [],
    stats: {
      totalOrders: (orders ?? []).length,
      paidOrders: paid.length,
      failedOrders: (orders ?? []).filter((o) => o.status === "failed").length,
      mrr,
      arr,
      totalRevenue,
    },
  });
}

export async function POST(request: NextRequest) {
  const user = await assertSuperAdmin();
  if (!user) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const body = await request.json() as {
    razorpay_key_id?: string;
    razorpay_key_secret?: string;
    razorpay_webhook_secret?: string;
  };

  const entries: { key: string; value: string }[] = [];
  if (body.razorpay_key_id !== undefined)
    entries.push({ key: "razorpay_key_id", value: body.razorpay_key_id });
  if (body.razorpay_key_secret !== undefined)
    entries.push({ key: "razorpay_key_secret", value: body.razorpay_key_secret });
  if (body.razorpay_webhook_secret !== undefined)
    entries.push({ key: "razorpay_webhook_secret", value: body.razorpay_webhook_secret });

  if (entries.length === 0)
    return NextResponse.json({ error: "No fields to update" }, { status: 422 });

  await savePlatformSettings(entries, user.id);
  return NextResponse.json({ ok: true });
}
