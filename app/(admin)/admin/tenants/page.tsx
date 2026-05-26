import Header from "@/components/dashboard/Header";
import { Building2, Plus, Search, Filter, Eye, Settings, MoreHorizontal, CheckCircle2, XCircle } from "lucide-react";
import Link from "next/link";

const tenants = [
  { id: "t_001", name: "TechCorp Inc.", slug: "techcorp", email: "admin@techcorp.com", plan: "Growth", status: "active", users: 8, contacts: 2847, setupComplete: true, country: "US", created: "2025-05-20" },
  { id: "t_002", name: "RetailPlus Co.", slug: "retailplus", email: "ops@retailplus.com", plan: "Starter", status: "active", users: 2, contacts: 421, setupComplete: true, country: "GB", created: "2025-05-19" },
  { id: "t_003", name: "MedConsult India", slug: "medconsult", email: "info@medconsult.in", plan: "Enterprise", status: "active", users: 22, contacts: 8920, setupComplete: true, country: "IN", created: "2025-05-17" },
  { id: "t_004", name: "FastDeliver LLC", slug: "fastdeliver", email: "admin@fastdeliver.com", plan: "Growth", status: "trialing", users: 3, contacts: 150, setupComplete: false, country: "AU", created: "2025-05-25" },
  { id: "t_005", name: "StartupX", slug: "startupx", email: "founder@startupx.io", plan: "Starter", status: "past_due", users: 1, contacts: 89, setupComplete: true, country: "DE", created: "2025-04-30" },
  { id: "t_006", name: "LuxBrand UAE", slug: "luxbrand", email: "admin@luxbrand.ae", plan: "Growth", status: "active", users: 5, contacts: 1240, setupComplete: true, country: "AE", created: "2025-05-10" },
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

const flagEmoji: Record<string, string> = {
  US: "🇺🇸", GB: "🇬🇧", IN: "🇮🇳", AU: "🇦🇺", DE: "🇩🇪", AE: "🇦🇪",
};

export default function AdminTenantsPage() {
  return (
    <div>
      <Header
        title="Tenants"
        subtitle="Manage all customer company accounts"
        action={
          <button className="btn-primary text-sm py-2 px-4">
            <Plus className="w-4 h-4" />
            Create Tenant
          </button>
        }
      />

      <div className="p-6 space-y-6">
        {/* Filters */}
        <div className="glass-card p-4 flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-1.5 bg-white/5 border border-white/5 rounded-lg flex-1 min-w-48">
            <Search className="w-4 h-4 text-white/30" />
            <input type="text" placeholder="Search tenants by name, email, or plan..." className="bg-transparent text-sm text-white/60 placeholder:text-white/30 outline-none flex-1" />
          </div>
          <select className="input-dark text-sm py-1.5 w-32 bg-[#0a0d1a]">
            <option>All Plans</option>
            <option>Starter</option>
            <option>Growth</option>
            <option>Enterprise</option>
          </select>
          <select className="input-dark text-sm py-1.5 w-36 bg-[#0a0d1a]">
            <option>All Statuses</option>
            <option>Active</option>
            <option>Trialing</option>
            <option>Past Due</option>
            <option>Canceled</option>
          </select>
          <button className="flex items-center gap-1.5 px-3 py-1.5 border border-white/10 rounded-lg text-xs text-white/50 hover:bg-white/5 transition-all">
            <Filter className="w-3.5 h-3.5" />
            More Filters
          </button>
        </div>

        {/* Tenants table */}
        <div className="glass-card overflow-hidden">
          <div className="p-5 border-b border-white/5 flex items-center justify-between">
            <h2 className="text-sm font-semibold text-white">All Tenants ({tenants.length})</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/5">
                  {["Company", "Plan", "Status", "Users", "Contacts", "Setup", "Joined", "Actions"].map((h) => (
                    <th key={h} className="text-left py-3 px-4 text-xs font-medium text-white/30 first:pl-5">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {tenants.map((tenant) => (
                  <tr key={tenant.id} className="hover:bg-white/2 transition-colors group">
                    <td className="py-3.5 pl-5 pr-4">
                      <div className="flex items-center gap-2.5">
                        <div className="w-9 h-9 rounded-xl bg-violet-600/20 flex items-center justify-center text-sm font-bold text-violet-400">
                          {tenant.name[0]}
                        </div>
                        <div>
                          <div className="text-sm font-medium text-white flex items-center gap-1.5">
                            {flagEmoji[tenant.country]} {tenant.name}
                          </div>
                          <div className="text-xs text-white/30">{tenant.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className={`text-xs font-semibold ${planConfig[tenant.plan] || "text-white/50"}`}>{tenant.plan}</span>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className={`px-2 py-0.5 rounded-full text-xs border capitalize ${statusConfig[tenant.status]}`}>
                        {tenant.status.replace("_", " ")}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-sm text-white/60">{tenant.users}</td>
                    <td className="py-3.5 px-4 text-sm text-white/60">{tenant.contacts.toLocaleString()}</td>
                    <td className="py-3.5 px-4">
                      {tenant.setupComplete ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      ) : (
                        <XCircle className="w-4 h-4 text-amber-400" />
                      )}
                    </td>
                    <td className="py-3.5 px-4 text-xs text-white/30">{tenant.created}</td>
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-1">
                        <Link
                          href={`/admin/accounts/${tenant.slug}`}
                          className="flex items-center gap-1 px-2.5 py-1.5 text-xs border border-violet-500/30 text-violet-400 rounded-lg hover:bg-violet-600/10 transition-all"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          Manage
                        </Link>
                        <button className="w-8 h-8 rounded-lg hover:bg-white/5 flex items-center justify-center text-white/20 hover:text-white/40 transition-all">
                          <MoreHorizontal className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
