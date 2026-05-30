"use client";

import { useState, useTransition } from "react";
import {
  CheckCircle2, XCircle, Clock, RefreshCw, Eye, EyeOff,
  Save, Loader2, AlertCircle, TrendingUp, CreditCard,
  IndianRupee, BarChart3,
} from "lucide-react";

/* ─── Types ─────────────────────────────────────────────────────── */

interface PaymentOrder {
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
}

interface Stats {
  totalOrders: number;
  paidOrders: number;
  failedOrders: number;
  mrr: number;
  arr: number;
  totalRevenue: number;
}

interface RazorpayConfig {
  keyId: string;
  isConfigured: boolean;
  isLive: boolean;
}

interface Props {
  orders: PaymentOrder[];
  stats: Stats;
  rzpConfig: RazorpayConfig;
}

/* ─── Helpers ────────────────────────────────────────────────────── */

function formatAmount(paise: number, currency = "INR") {
  const amount = paise / 100;
  if (currency === "INR") return `₹${amount.toLocaleString("en-IN")}`;
  return `$${amount.toLocaleString()}`;
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-IN", {
    day: "2-digit", month: "short", year: "numeric",
  });
}

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, { icon: React.ReactNode; cls: string }> = {
    paid: {
      icon: <CheckCircle2 className="w-3 h-3" />,
      cls: "bg-emerald-500/15 text-emerald-400 border-emerald-500/20",
    },
    created: {
      icon: <Clock className="w-3 h-3" />,
      cls: "bg-amber-500/10 text-amber-400 border-amber-500/20",
    },
    failed: {
      icon: <XCircle className="w-3 h-3" />,
      cls: "bg-red-500/10 text-red-400 border-red-500/20",
    },
    refunded: {
      icon: <RefreshCw className="w-3 h-3" />,
      cls: "bg-blue-500/10 text-blue-400 border-blue-500/20",
    },
    cancelled: {
      icon: <XCircle className="w-3 h-3" />,
      cls: "bg-white/5 text-white/30 border-white/10",
    },
  };
  const badge = map[status] ?? map.created;
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-bold rounded-full border ${badge.cls}`}>
      {badge.icon}
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
}

/* ─── Component ─────────────────────────────────────────────────── */

export default function BillingClient({ orders: initialOrders, stats: initialStats, rzpConfig }: Props) {
  const [orders] = useState<PaymentOrder[]>(initialOrders);
  const [stats] = useState<Stats>(initialStats);
  const [activeTab, setActiveTab] = useState<"all" | "paid" | "failed" | "created">("all");
  const [search, setSearch] = useState("");

  // Razorpay config form
  const [keyId, setKeyId] = useState("");
  const [keySecret, setKeySecret] = useState("");
  const [webhookSecret, setWebhookSecret] = useState("");
  const [showSecret, setShowSecret] = useState(false);
  const [configMsg, setConfigMsg] = useState<{ type: "ok" | "err"; text: string } | null>(null);
  const [isSaving, startSaving] = useTransition();

  const filtered = orders.filter((o) => {
    if (activeTab !== "all" && o.status !== activeTab) return false;
    if (search) {
      const q = search.toLowerCase();
      return (
        (o.tenants?.name ?? "").toLowerCase().includes(q) ||
        (o.tenants?.email ?? "").toLowerCase().includes(q) ||
        (o.subscription_plans?.name ?? "").toLowerCase().includes(q) ||
        (o.razorpay_order_id ?? "").toLowerCase().includes(q) ||
        (o.razorpay_payment_id ?? "").toLowerCase().includes(q)
      );
    }
    return true;
  });

  async function saveConfig() {
    if (!keyId && !keySecret && !webhookSecret) {
      setConfigMsg({ type: "err", text: "Enter at least one field to update." });
      return;
    }
    setConfigMsg(null);
    startSaving(async () => {
      const body: Record<string, string> = {};
      if (keyId.trim()) body.razorpay_key_id = keyId.trim();
      if (keySecret.trim()) body.razorpay_key_secret = keySecret.trim();
      if (webhookSecret.trim()) body.razorpay_webhook_secret = webhookSecret.trim();

      try {
        const res = await fetch("/api/admin/billing", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        });
        const data = await res.json() as { ok?: boolean; error?: string };
        if (!data.ok) throw new Error(data.error ?? "Save failed");
        setConfigMsg({ type: "ok", text: "Razorpay credentials saved. Changes take effect immediately." });
        setKeyId(""); setKeySecret(""); setWebhookSecret("");
      } catch (err) {
        setConfigMsg({ type: "err", text: err instanceof Error ? err.message : "Failed" });
      }
    });
  }

  const statCards = [
    { label: "Total Revenue", value: formatAmount(stats.totalRevenue), icon: IndianRupee, color: "text-emerald-400", bg: "bg-emerald-600/10" },
    { label: "MRR (this month)", value: formatAmount(stats.mrr), icon: TrendingUp, color: "text-violet-400", bg: "bg-violet-600/10" },
    { label: "Annual Payments", value: formatAmount(stats.arr), icon: BarChart3, color: "text-cyan-400", bg: "bg-cyan-600/10" },
    { label: "Paid Orders", value: `${stats.paidOrders} / ${stats.totalOrders}`, icon: CreditCard, color: "text-amber-400", bg: "bg-amber-600/10" },
  ];

  const tabs: { id: typeof activeTab; label: string; count: number }[] = [
    { id: "all", label: "All", count: orders.length },
    { id: "paid", label: "Paid", count: orders.filter((o) => o.status === "paid").length },
    { id: "created", label: "Pending", count: orders.filter((o) => o.status === "created").length },
    { id: "failed", label: "Failed", count: orders.filter((o) => o.status === "failed").length },
  ];

  return (
    <div className="p-6 space-y-6">

      {/* ── Stats ─────────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        {statCards.map((card) => (
          <div key={card.label} className={`glass-card p-5 border-amber-500/10 ${card.bg}`}>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-white/40 font-medium">{card.label}</span>
              <card.icon className={`w-4 h-4 ${card.color}`} />
            </div>
            <div className={`text-2xl font-bold ${card.color}`}>{card.value}</div>
          </div>
        ))}
      </div>

      {/* ── Razorpay Config ──────────────────────────────────────── */}
      <div className="glass-card overflow-hidden border-amber-500/10">
        <div className="flex items-center gap-3 p-5 border-b border-white/5">
          <div className="w-8 h-8 rounded-xl bg-sky-600/20 flex items-center justify-center text-base">💳</div>
          <div>
            <h2 className="text-sm font-bold text-white">Platform Razorpay Configuration</h2>
            <p className="text-xs text-white/40 mt-0.5">
              These keys are used to collect subscription fees from your customers.
            </p>
          </div>
          <div className="ml-auto flex items-center gap-2">
            {rzpConfig.isConfigured ? (
              <>
                <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/20 flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" /> Connected
                </span>
                <span className={`px-2 py-0.5 text-[10px] font-bold rounded-full border flex items-center gap-1 ${rzpConfig.isLive ? "bg-violet-500/10 text-violet-400 border-violet-500/20" : "bg-amber-500/10 text-amber-400 border-amber-500/20"}`}>
                  {rzpConfig.isLive ? "Live Mode" : "Test Mode"}
                </span>
              </>
            ) : (
              <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-red-500/10 text-red-400 border border-red-500/20 flex items-center gap-1">
                <AlertCircle className="w-3 h-3" /> Not Configured
              </span>
            )}
          </div>
        </div>

        <div className="p-5 space-y-4">
          {rzpConfig.isConfigured && (
            <div className="p-3 rounded-xl bg-white/3 border border-white/5 text-xs text-white/50 font-mono">
              Current Key ID: <span className="text-white/70">{rzpConfig.keyId}</span>
            </div>
          )}

          <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-medium text-white/50 mb-1.5">
                Key ID <span className="text-white/20">(leave blank to keep existing)</span>
              </label>
              <input
                type="text"
                value={keyId}
                onChange={(e) => setKeyId(e.target.value)}
                placeholder="rzp_live_xxxxxxxxxxxx"
                className="input-dark font-mono text-sm"
              />
              <p className="text-[11px] text-white/25 mt-1">Use rzp_test_... for test mode</p>
            </div>
            <div>
              <label className="block text-xs font-medium text-white/50 mb-1.5">Key Secret</label>
              <div className="relative">
                <input
                  type={showSecret ? "text" : "password"}
                  value={keySecret}
                  onChange={(e) => setKeySecret(e.target.value)}
                  placeholder="••••••••••••••••••••••••"
                  className="input-dark font-mono text-sm pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowSecret(!showSecret)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60"
                >
                  {showSecret ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
            <div>
              <label className="block text-xs font-medium text-white/50 mb-1.5">Webhook Secret</label>
              <input
                type="password"
                value={webhookSecret}
                onChange={(e) => setWebhookSecret(e.target.value)}
                placeholder="••••••••••••••••••••••••"
                className="input-dark font-mono text-sm"
              />
            </div>
          </div>

          <div className="flex items-center justify-between pt-1">
            {configMsg ? (
              <div className={`flex items-center gap-1.5 text-sm ${configMsg.type === "ok" ? "text-emerald-400" : "text-red-400"}`}>
                {configMsg.type === "ok"
                  ? <CheckCircle2 className="w-4 h-4" />
                  : <AlertCircle className="w-4 h-4" />}
                {configMsg.text}
              </div>
            ) : (
              <div className="text-xs text-white/30 flex items-center gap-1.5">
                <AlertCircle className="w-3.5 h-3.5 text-amber-400/60" />
                Webhook URL:
                <code className="text-white/50 font-mono">https://your-domain.com/api/webhooks/razorpay</code>
              </div>
            )}
            <button
              onClick={saveConfig}
              disabled={isSaving}
              className="btn-primary text-sm py-2 px-5 flex items-center gap-2 disabled:opacity-50"
            >
              {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              Save Credentials
            </button>
          </div>
        </div>
      </div>

      {/* ── Payments Table ───────────────────────────────────────── */}
      <div className="glass-card overflow-hidden border-amber-500/10">
        <div className="flex items-center justify-between p-5 border-b border-white/5">
          <h2 className="text-sm font-bold text-white">Payment History</h2>
          <div className="flex items-center gap-3">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search client, plan, order ID..."
              className="input-dark text-xs py-2 w-56"
            />
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-white/5">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-5 py-3 text-xs font-semibold transition-colors flex items-center gap-2 ${
                activeTab === tab.id
                  ? "text-amber-400 border-b-2 border-amber-400 bg-amber-500/5"
                  : "text-white/30 hover:text-white/60"
              }`}
            >
              {tab.label}
              {tab.count > 0 && (
                <span className={`px-1.5 py-0.5 rounded-full text-[10px] font-bold ${
                  activeTab === tab.id ? "bg-amber-500/20 text-amber-400" : "bg-white/5 text-white/30"
                }`}>
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </div>

        {filtered.length === 0 ? (
          <div className="p-12 text-center">
            <CreditCard className="w-8 h-8 text-white/10 mx-auto mb-3" />
            <p className="text-sm text-white/30">No payment records found.</p>
            <p className="text-xs text-white/20 mt-1">
              {!rzpConfig.isConfigured
                ? "Configure your Razorpay credentials above to start accepting payments."
                : "Payments will appear here once customers subscribe."}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/5">
                  {["Client", "Plan", "Amount", "Cycle", "Status", "Razorpay ID", "Date"].map((h) => (
                    <th key={h} className="px-5 py-3 text-left text-[11px] font-semibold text-white/30 uppercase tracking-wide">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((order) => (
                  <tr key={order.id} className="border-b border-white/3 hover:bg-white/2 transition-colors">
                    <td className="px-5 py-3.5">
                      <div className="font-medium text-white text-sm">{order.tenants?.name ?? "—"}</div>
                      <div className="text-xs text-white/30">{order.tenants?.email ?? ""}</div>
                    </td>
                    <td className="px-5 py-3.5">
                      <span className="text-white/70 text-sm">{order.subscription_plans?.name ?? "—"}</span>
                    </td>
                    <td className="px-5 py-3.5">
                      <span className="font-semibold text-white">{formatAmount(order.amount, order.currency)}</span>
                    </td>
                    <td className="px-5 py-3.5">
                      <span className="capitalize text-white/50 text-xs">{order.billing_cycle}</span>
                    </td>
                    <td className="px-5 py-3.5">
                      <StatusBadge status={order.status} />
                    </td>
                    <td className="px-5 py-3.5">
                      <code className="text-[11px] text-white/30 font-mono">
                        {order.razorpay_payment_id ?? order.razorpay_order_id ?? order.razorpay_subscription_id ?? "—"}
                      </code>
                    </td>
                    <td className="px-5 py-3.5">
                      <span className="text-white/40 text-xs">{formatDate(order.captured_at ?? order.created_at)}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
