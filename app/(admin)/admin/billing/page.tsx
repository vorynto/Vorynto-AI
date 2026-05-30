import AdminHeader from "@/components/admin/AdminHeader";
import BillingClient from "@/components/admin/BillingClient";
import { createAdminClient } from "@/lib/supabase/server";
import { getRazorpayConfig, maskPlatformKey } from "@/lib/razorpay";
import { DollarSign } from "lucide-react";

export default async function AdminBillingPage() {
  const admin = await createAdminClient();

  // Recent payment orders with joins
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
    .limit(200)
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

  // Compute stats server-side
  const all = orders ?? [];
  const paid = all.filter((o) => o.status === "paid");
  const thisMonth = new Date();
  thisMonth.setDate(1); thisMonth.setHours(0, 0, 0, 0);

  const mrr = paid
    .filter((o) => o.billing_cycle === "monthly" && new Date(o.captured_at ?? o.created_at) >= thisMonth)
    .reduce((s, o) => s + o.amount, 0);

  const arr = paid
    .filter((o) => o.billing_cycle === "yearly" && new Date(o.captured_at ?? o.created_at) >= thisMonth)
    .reduce((s, o) => s + o.amount, 0);

  const stats = {
    totalOrders: all.length,
    paidOrders: paid.length,
    failedOrders: all.filter((o) => o.status === "failed").length,
    mrr,
    arr,
    totalRevenue: paid.reduce((s, o) => s + o.amount, 0),
  };

  // Razorpay config status (no secret exposed)
  const rzpFull = await getRazorpayConfig();
  const rzpConfig = {
    keyId: maskPlatformKey(rzpFull.keyId),
    isConfigured: rzpFull.isConfigured,
    isLive: rzpFull.isLive,
  };

  return (
    <div>
      <AdminHeader
        title="Billing & Payments"
        subtitle="Razorpay subscription revenue from all clients"
        breadcrumb="Platform Management"
        action={
          <a
            href="https://dashboard.razorpay.com"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-secondary text-sm py-2 px-4 flex items-center gap-1.5"
          >
            <DollarSign className="w-4 h-4" />
            Razorpay Dashboard →
          </a>
        }
      />
      <BillingClient orders={all} stats={stats} rzpConfig={rzpConfig} />
    </div>
  );
}
