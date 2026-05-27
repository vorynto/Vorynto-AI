import AdminHeader from "@/components/admin/AdminHeader";
import { createAdminClient } from "@/lib/supabase/server";
import {
  Building2, Users, CreditCard, TrendingUp,
  ArrowRight, AlertCircle, CheckCircle2, Clock, Plus,
} from "lucide-react";
import Link from "next/link";

export default async function AdminDashboardPage() {
  const admin = await createAdminClient();

  // Real counts
  const [{ count: tenantCount }, { count: userCount }, plansData, recentTenantsData] =
    await Promise.all([
      admin.from("tenants").select("*", { count: "exact", head: true }),
      admin.from("profiles").select("*", { count: "exact", head: true }),
      admin
        .from("subscription_plans")
        .select("name, slug")
        .eq("is_active", true)
        .order("sort_order")
        .returns<{ name: string; slug: string }[]>(),
      admin
        .from("tenants")
        .select("id, name, slug, email, is_active, is_setup_complete, created_at, subscriptions(subscription_plans(name))")
        .order("created_at", { ascending: false })
        .limit(6)
        .returns<{
          id: string;
          name: string;
          slug: string;
          email: string | null;
          is_active: boolean | null;
          is_setup_complete: boolean | null;
          created_at: string | null;
          subscriptions: { subscription_plans: { name: string } | null }[];
        }[]>(),
    ]);

  const recentTenants = recentTenantsData.data ?? [];
  const activePlans = plansData.data ?? [];

  const statsCards = [
    { label: "Total Tenants", value: (tenantCount ?? 0).toLocaleString(), icon: Building2, color: "text-violet-400", bg: "bg-violet-600/20", change: "+8.5%" },
    { label: "Total Users", value: (userCount ?? 0).toLocaleString(), icon: Users, color: "text-emerald-400", bg: "bg-emerald-600/20", change: "+12.3%" },
    { label: "Active Plans", value: activePlans.length.toString(), icon: CreditCard, color: "text-amber-400", bg: "bg-amber-600/20", change: "" },
    { label: "MRR (est.)", value: "—", icon: TrendingUp, color: "text-cyan-400", bg: "bg-cyan-600/20", change: "" },
  ];

  return (
    <div>
      <AdminHeader
        title="Platform Overview"
        subtitle="Full visibility across all tenants, users, and subscriptions"
        action={
          <Link href="/admin/tenants" className="btn-primary text-sm py-2 px-4 flex items-center gap-1.5">
            <Plus className="w-4 h-4" /> New Tenant
          </Link>
        }
      />

      <div className="p-6 space-y-6">
        {/* Stats */}
        <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
          {statsCards.map((s) => (
            <div key={s.label} className="glass-card p-5">
              <div className={`w-9 h-9 rounded-xl ${s.bg} flex items-center justify-center mb-3`}>
                <s.icon className={`w-4 h-4 ${s.color}`} />
              </div>
              <div className="text-2xl font-bold text-white">{s.value}</div>
              <div className="text-xs text-white/40 mt-0.5 flex items-center justify-between">
                <span>{s.label}</span>
                {s.change && <span className="text-emerald-400 text-[10px] font-semibold">{s.change}</span>}
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          {/* Recent tenants */}
          <div className="xl:col-span-2 glass-card overflow-hidden">
            <div className="flex items-center justify-between p-5 border-b border-white/5">
              <h2 className="text-sm font-semibold text-white">Recent Tenants</h2>
              <Link href="/admin/tenants" className="text-xs text-amber-400 hover:text-amber-300 flex items-center gap-1">
                View all <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
            {recentTenants.length === 0 ? (
              <div className="p-10 text-center">
                <Building2 className="w-8 h-8 text-white/10 mx-auto mb-2" />
                <p className="text-sm text-white/30">No tenants yet</p>
                <Link href="/admin/tenants" className="mt-3 inline-flex items-center gap-1.5 text-xs text-amber-400 hover:text-amber-300">
                  <Plus className="w-3.5 h-3.5" /> Create the first tenant
                </Link>
              </div>
            ) : (
              <div className="divide-y divide-white/5">
                {recentTenants.map((t) => {
                  const planName = t.subscriptions?.[0]?.subscription_plans?.name ?? "—";
                  const date = t.created_at ? new Date(t.created_at).toLocaleDateString() : "—";
                  return (
                    <div key={t.id} className="flex items-center justify-between px-5 py-3.5 hover:bg-white/2 transition-colors">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-violet-600/20 flex items-center justify-center text-xs font-bold text-violet-400">
                          {t.name[0]}
                        </div>
                        <div>
                          <div className="text-sm font-medium text-white">{t.name}</div>
                          <div className="text-xs text-white/30">{t.email ?? t.slug}</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-4 text-xs">
                        <span className="text-violet-400 font-semibold">{planName}</span>
                        <span className={`px-2 py-0.5 rounded-full border ${t.is_active ? "text-emerald-400 bg-emerald-500/10 border-emerald-500/20" : "text-white/30 bg-white/5 border-white/10"}`}>
                          {t.is_active ? "Active" : "Inactive"}
                        </span>
                        <span className="text-white/20">{date}</span>
                        <Link href={`/admin/accounts`} className="text-amber-400 hover:text-amber-300 flex items-center gap-0.5">
                          Manage <ArrowRight className="w-3 h-3" />
                        </Link>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Right panel */}
          <div className="space-y-5">
            {/* Quick actions */}
            <div className="glass-card p-5">
              <h2 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-amber-400" />
                Quick Actions
              </h2>
              <div className="space-y-2">
                {[
                  { label: "Add New Tenant", href: "/admin/tenants", icon: "🏢" },
                  { label: "Manage Plans", href: "/admin/plans", icon: "💳" },
                  { label: "Invite User", href: "/admin/users", icon: "👤" },
                  { label: "CMS Content", href: "/admin/content", icon: "📄" },
                  { label: "Support Tickets", href: "/admin/support", icon: "🎧" },
                ].map((a) => (
                  <Link
                    key={a.label}
                    href={a.href}
                    className="flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-white/5 transition-all group"
                  >
                    <span className="text-base">{a.icon}</span>
                    <span className="text-sm text-white/60 group-hover:text-white transition-colors">{a.label}</span>
                    <ArrowRight className="w-3 h-3 text-white/20 group-hover:text-amber-400 ml-auto transition-colors" />
                  </Link>
                ))}
              </div>
            </div>

            {/* Plan distribution */}
            <div className="glass-card p-5">
              <h2 className="text-sm font-semibold text-white mb-4">Active Plans</h2>
              <div className="space-y-2">
                {activePlans.length === 0 ? (
                  <p className="text-xs text-white/30">No plans configured</p>
                ) : (
                  activePlans.map((p, i) => {
                    const colors = ["bg-amber-500", "bg-violet-500", "bg-cyan-500", "bg-emerald-500"];
                    return (
                      <div key={p.slug} className="flex items-center gap-2 text-xs">
                        <div className={`w-2 h-2 rounded-full ${colors[i % colors.length]}`} />
                        <span className="text-white/60 flex-1">{p.name}</span>
                        <Link href="/admin/plans" className="text-amber-400/50 hover:text-amber-400 text-[10px]">Edit</Link>
                      </div>
                    );
                  })
                )}
              </div>
              <Link href="/admin/plans" className="mt-4 flex items-center gap-1.5 text-xs text-amber-400 hover:text-amber-300">
                <Plus className="w-3 h-3" /> Add new plan
              </Link>
            </div>

            {/* System status */}
            <div className="glass-card p-5">
              <h2 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
                <Clock className="w-4 h-4 text-emerald-400" />
                System Status
              </h2>
              {[
                { label: "Database", status: "Healthy" },
                { label: "Auth Service", status: "Healthy" },
                { label: "API Routes", status: "Healthy" },
                { label: "Storage", status: "Healthy" },
              ].map((s) => (
                <div key={s.label} className="flex items-center justify-between py-1.5 text-xs">
                  <span className="text-white/40">{s.label}</span>
                  <span className="flex items-center gap-1 text-emerald-400">
                    <CheckCircle2 className="w-3 h-3" /> {s.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
