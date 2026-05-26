import Header from "@/components/dashboard/Header";
import StatsCard from "@/components/dashboard/StatsCard";
import {
  Building2, Users, CreditCard, TrendingUp,
  ArrowRight, AlertCircle, CheckCircle2, Clock,
} from "lucide-react";
import Link from "next/link";

const recentTenants = [
  { name: "TechCorp Inc.", plan: "Growth", status: "active", contacts: 2847, created: "2025-05-20", country: "🇺🇸" },
  { name: "RetailPlus Co.", plan: "Starter", status: "active", contacts: 421, created: "2025-05-19", country: "🇬🇧" },
  { name: "MedConsult India", plan: "Enterprise", status: "active", contacts: 8920, created: "2025-05-17", country: "🇮🇳" },
  { name: "FastDeliver LLC", plan: "Growth", status: "trialing", contacts: 150, created: "2025-05-25", country: "🇦🇺" },
  { name: "StartupX", plan: "Starter", status: "past_due", contacts: 89, created: "2025-04-30", country: "🇩🇪" },
];

const statusConfig: Record<string, string> = {
  active: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
  trialing: "text-violet-400 bg-violet-500/10 border-violet-500/20",
  past_due: "text-red-400 bg-red-500/10 border-red-500/20",
  canceled: "text-white/30 bg-white/5 border-white/10",
};

const planConfig: Record<string, string> = {
  Starter: "text-cyan-400",
  Growth: "text-violet-400",
  Enterprise: "text-amber-400",
};

const systemAlerts = [
  { type: "warning", message: "3 tenants have past-due subscriptions requiring attention", time: "Now" },
  { type: "info", message: "FastDeliver LLC trial expires in 3 days — follow up opportunity", time: "1h ago" },
  { type: "success", message: "New enterprise tenant MedConsult setup completed successfully", time: "2h ago" },
];

export default function AdminDashboardPage() {
  return (
    <div>
      <Header
        title="Super Admin Dashboard"
        subtitle="Manage all tenants, users, and platform settings"
        action={
          <Link href="/admin/tenants" className="btn-primary text-sm py-2 px-4">
            <Building2 className="w-4 h-4" />
            Manage Tenants
          </Link>
        }
      />

      <div className="p-6 space-y-6">
        {/* Stats */}
        <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
          <StatsCard title="Total Tenants" value="10,284" change={8.5} icon={Building2} iconColor="text-violet-400" iconBg="bg-violet-600/20" />
          <StatsCard title="Total Users" value="48,920" change={12.3} icon={Users} iconColor="text-emerald-400" iconBg="bg-emerald-600/20" />
          <StatsCard title="MRR" value="$284,510" change={18.7} icon={CreditCard} iconColor="text-amber-400" iconBg="bg-amber-600/20" />
          <StatsCard title="Churn Rate" value="2.1%" change={-0.4} icon={TrendingUp} iconColor="text-cyan-400" iconBg="bg-cyan-600/20" />
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          {/* Recent tenants */}
          <div className="xl:col-span-2 glass-card p-6">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-base font-semibold text-white">Recent Tenants</h2>
              <Link href="/admin/tenants" className="text-xs text-violet-400 hover:text-violet-300 flex items-center gap-1">
                View all <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/5">
                    {["Company", "Plan", "Status", "Contacts", "Joined", ""].map((h) => (
                      <th key={h} className="text-left py-2 px-2 text-xs font-medium text-white/30 first:pl-0">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {recentTenants.map((t) => (
                    <tr key={t.name} className="hover:bg-white/2 transition-colors">
                      <td className="py-3 pl-0 pr-2">
                        <div className="flex items-center gap-2">
                          <span className="text-base">{t.country}</span>
                          <span className="text-sm font-medium text-white">{t.name}</span>
                        </div>
                      </td>
                      <td className="py-3 px-2">
                        <span className={`text-xs font-semibold ${planConfig[t.plan] || "text-white/50"}`}>{t.plan}</span>
                      </td>
                      <td className="py-3 px-2">
                        <span className={`px-2 py-0.5 rounded-full text-xs border capitalize ${statusConfig[t.status]}`}>
                          {t.status.replace("_", " ")}
                        </span>
                      </td>
                      <td className="py-3 px-2 text-xs text-white/50">{t.contacts.toLocaleString()}</td>
                      <td className="py-3 px-2 text-xs text-white/30">{t.created}</td>
                      <td className="py-3 px-2">
                        <Link href={`/admin/accounts/${t.name.toLowerCase().replace(/\s+/g, "-")}`} className="text-xs text-violet-400 hover:text-violet-300 flex items-center gap-1">
                          Manage <ArrowRight className="w-3 h-3" />
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* System alerts */}
          <div className="glass-card p-6">
            <h2 className="text-base font-semibold text-white mb-5 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-amber-400" />
              Alerts & Notifications
            </h2>
            <div className="space-y-3">
              {systemAlerts.map((alert, i) => (
                <div key={i} className={`p-3 rounded-xl border text-xs leading-relaxed ${
                  alert.type === "warning" ? "border-amber-500/20 bg-amber-500/10 text-amber-300"
                  : alert.type === "success" ? "border-emerald-500/20 bg-emerald-500/10 text-emerald-300"
                  : "border-blue-500/20 bg-blue-500/10 text-blue-300"
                }`}>
                  <div className="flex items-start gap-2">
                    {alert.type === "success" ? (
                      <CheckCircle2 className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                    ) : (
                      <AlertCircle className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                    )}
                    <div>
                      <p>{alert.message}</p>
                      <div className="flex items-center gap-1 mt-1.5 opacity-60">
                        <Clock className="w-3 h-3" />
                        {alert.time}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Plan distribution */}
            <div className="mt-6 pt-4 border-t border-white/5">
              <h3 className="text-xs font-medium text-white/40 mb-3">Plan Distribution</h3>
              <div className="space-y-2">
                {[
                  { plan: "Enterprise", count: 1284, pct: 12, color: "bg-amber-500" },
                  { plan: "Growth", count: 4820, pct: 47, color: "bg-violet-500" },
                  { plan: "Starter", count: 4180, pct: 41, color: "bg-cyan-500" },
                ].map((p) => (
                  <div key={p.plan} className="flex items-center gap-2 text-xs">
                    <span className="text-white/40 w-16">{p.plan}</span>
                    <div className="flex-1 h-1.5 bg-white/10 rounded-full overflow-hidden">
                      <div className={`h-full ${p.color} rounded-full`} style={{ width: `${p.pct}%` }} />
                    </div>
                    <span className="text-white/40 w-12 text-right">{p.count.toLocaleString()}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Quick actions */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { label: "Create Tenant", desc: "Manually onboard a company", href: "/admin/tenants/new", icon: "🏢" },
            { label: "Manage Plans", desc: "Edit subscription pricing", href: "/admin/plans", icon: "💳" },
            { label: "Edit Website Content", desc: "Update marketing pages", href: "/admin/content", icon: "📄" },
            { label: "View Support Tickets", desc: "Help customers with issues", href: "/admin/support", icon: "🎧" },
          ].map((action) => (
            <Link key={action.label} href={action.href} className="glass-card-hover p-4 flex flex-col gap-2">
              <span className="text-2xl">{action.icon}</span>
              <div className="text-sm font-semibold text-white">{action.label}</div>
              <div className="text-xs text-white/40">{action.desc}</div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
