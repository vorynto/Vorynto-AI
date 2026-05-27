"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Search, Filter, Eye, MoreHorizontal,
  CheckCircle2, XCircle, Building2, ArrowRight,
  Globe, Users,
} from "lucide-react";

type Tenant = {
  id: string;
  name: string;
  slug: string;
  email: string | null;
  phone: string | null;
  country: string | null;
  is_active: boolean | null;
  is_setup_complete: boolean | null;
  created_at: string | null;
  subscriptions: {
    status: string | null;
    subscription_plans: { name: string; slug: string } | null;
  }[];
};

interface Props {
  initialTenants: Tenant[];
}

const subStatusColors: Record<string, string> = {
  active: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
  trialing: "text-violet-400 bg-violet-500/10 border-violet-500/20",
  past_due: "text-red-400 bg-red-500/10 border-red-500/20",
  canceled: "text-white/30 bg-white/5 border-white/10",
  paused: "text-amber-400 bg-amber-500/10 border-amber-500/20",
};

const tenantStatusColors = {
  active: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
  inactive: "text-white/30 bg-white/5 border-white/10",
};

const avatarColors = [
  "bg-violet-600/20 text-violet-400",
  "bg-cyan-600/20 text-cyan-400",
  "bg-emerald-600/20 text-emerald-400",
  "bg-amber-600/20 text-amber-400",
  "bg-pink-600/20 text-pink-400",
  "bg-indigo-600/20 text-indigo-400",
];

function formatDate(ts: string | null) {
  if (!ts) return "—";
  return new Date(ts).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

export default function TenantManager({ initialTenants }: Props) {
  const [tenants] = useState<Tenant[]>(initialTenants);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const filtered = tenants.filter((t) => {
    const q = search.toLowerCase();
    const matchesSearch = !q ||
      t.name.toLowerCase().includes(q) ||
      (t.email ?? "").toLowerCase().includes(q) ||
      t.slug.toLowerCase().includes(q);
    const isActive = t.is_active !== false;
    const matchesStatus =
      statusFilter === "all" ||
      (statusFilter === "active" && isActive) ||
      (statusFilter === "inactive" && !isActive);
    return matchesSearch && matchesStatus;
  });

  const stats = {
    total: tenants.length,
    active: tenants.filter((t) => t.is_active !== false).length,
    setupComplete: tenants.filter((t) => t.is_setup_complete).length,
    withSub: tenants.filter((t) => t.subscriptions?.length > 0).length,
  };

  return (
    <div className="p-6 space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        {[
          { label: "Total Tenants", value: stats.total, icon: Building2, color: "text-violet-400", bg: "bg-violet-600/20" },
          { label: "Active Tenants", value: stats.active, icon: CheckCircle2, color: "text-emerald-400", bg: "bg-emerald-600/20" },
          { label: "Setup Complete", value: stats.setupComplete, icon: Globe, color: "text-cyan-400", bg: "bg-cyan-600/20" },
          { label: "With Subscription", value: stats.withSub, icon: Users, color: "text-amber-400", bg: "bg-amber-600/20" },
        ].map((s) => (
          <div key={s.label} className="glass-card p-5">
            <div className={`w-9 h-9 rounded-xl ${s.bg} flex items-center justify-center mb-3`}>
              <s.icon className={`w-4 h-4 ${s.color}`} />
            </div>
            <div className="text-2xl font-bold text-white">{s.value.toLocaleString()}</div>
            <div className="text-xs text-white/40 mt-0.5">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="glass-card p-4 flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-2 px-3 py-1.5 bg-white/5 border border-white/5 rounded-lg flex-1 min-w-48">
          <Search className="w-4 h-4 text-white/30 shrink-0" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, email, or slug..."
            className="bg-transparent text-sm text-white/60 placeholder:text-white/30 outline-none flex-1 min-w-0"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="input-dark text-sm py-1.5 w-36 bg-[#0a0d1a]"
        >
          <option value="all">All Statuses</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>
        <div className="flex items-center gap-1.5 px-3 py-1.5 border border-white/10 rounded-lg text-xs text-white/30">
          <Filter className="w-3.5 h-3.5" />
          {filtered.length} of {tenants.length} shown
        </div>
      </div>

      {/* Tenants table */}
      <div className="glass-card overflow-hidden">
        <div className="p-5 border-b border-white/5 flex items-center justify-between">
          <h2 className="text-sm font-semibold text-white">
            All Tenants <span className="text-white/30 font-normal">({filtered.length})</span>
          </h2>
        </div>

        {filtered.length === 0 ? (
          <div className="p-10 text-center">
            <Building2 className="w-8 h-8 text-white/10 mx-auto mb-2" />
            <p className="text-sm text-white/30">
              {search || statusFilter !== "all" ? "No tenants match your filters" : "No tenants yet"}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/5">
                  {["Company", "Plan", "Sub Status", "Active", "Setup", "Joined", "Actions"].map((h) => (
                    <th key={h} className="text-left py-3 px-4 text-xs font-medium text-white/30 first:pl-5">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filtered.map((tenant, i) => {
                  const sub = tenant.subscriptions?.[0];
                  const planName = sub?.subscription_plans?.name ?? "—";
                  const subStatus = sub?.status ?? null;
                  const isActive = tenant.is_active !== false;

                  return (
                    <tr key={tenant.id} className="hover:bg-white/2 transition-colors group">
                      <td className="py-3.5 pl-5 pr-4">
                        <div className="flex items-center gap-2.5">
                          <div className={`w-9 h-9 rounded-xl ${avatarColors[i % avatarColors.length]} flex items-center justify-center text-sm font-bold shrink-0`}>
                            {tenant.name[0]}
                          </div>
                          <div>
                            <div className="text-sm font-medium text-white">{tenant.name}</div>
                            <div className="text-xs text-white/30">{tenant.email ?? tenant.slug}</div>
                          </div>
                        </div>
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="text-xs font-semibold text-violet-400">
                          {planName}
                        </span>
                      </td>
                      <td className="py-3.5 px-4">
                        {subStatus ? (
                          <span className={`px-2 py-0.5 rounded-full text-xs border capitalize ${subStatusColors[subStatus] ?? "text-white/30 bg-white/5 border-white/10"}`}>
                            {subStatus.replace("_", " ")}
                          </span>
                        ) : (
                          <span className="text-xs text-white/20">—</span>
                        )}
                      </td>
                      <td className="py-3.5 px-4">
                        <span className={`px-2 py-0.5 rounded-full text-xs border ${isActive ? tenantStatusColors.active : tenantStatusColors.inactive}`}>
                          {isActive ? "Active" : "Inactive"}
                        </span>
                      </td>
                      <td className="py-3.5 px-4">
                        {tenant.is_setup_complete ? (
                          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                        ) : (
                          <XCircle className="w-4 h-4 text-amber-400/60" />
                        )}
                      </td>
                      <td className="py-3.5 px-4 text-xs text-white/30">{formatDate(tenant.created_at)}</td>
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-1">
                          <Link
                            href={`/admin/accounts?tenant=${tenant.id}`}
                            className="flex items-center gap-1 px-2.5 py-1.5 text-xs border border-amber-500/30 text-amber-400 rounded-lg hover:bg-amber-600/10 transition-all"
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
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
