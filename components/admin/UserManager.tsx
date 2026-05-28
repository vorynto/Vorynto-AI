"use client";

import { useState, useTransition } from "react";
import {
  Search, UserPlus, Shield, Building2, MoreHorizontal,
  X, Save, Loader2, CheckCircle2, ChevronDown, Trash2,
} from "lucide-react";

type User = {
  id: string;
  first_name: string | null;
  last_name: string | null;
  role: string | null;
  is_active: boolean | null;
  last_seen: string | null;
  tenant_id: string | null;
  tenants: { name: string } | null;
};

interface Props {
  initialUsers: User[];
}

const ROLES = ["super_admin", "tenant_admin", "tenant_user"] as const;

const roleConfig: Record<string, { label: string; color: string; bg: string; border: string }> = {
  super_admin: { label: "Super Admin", color: "text-amber-400", bg: "bg-amber-500/10", border: "border-amber-500/20" },
  tenant_admin: { label: "Client Admin", color: "text-violet-400", bg: "bg-violet-500/10", border: "border-violet-500/20" },
  tenant_user: { label: "User", color: "text-white/50", bg: "bg-white/5", border: "border-white/10" },
};

const avatarColors = [
  "from-violet-500 to-purple-600", "from-cyan-500 to-blue-600",
  "from-emerald-500 to-teal-600", "from-amber-500 to-orange-600",
  "from-pink-500 to-rose-600", "from-indigo-500 to-purple-600",
];

function relativeTime(ts: string | null) {
  if (!ts) return "—";
  const diff = Date.now() - new Date(ts).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1) return "Just now";
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  return `${Math.floor(h / 24)}d ago`;
}

export default function UserManager({ initialUsers }: Props) {
  const [users, setUsers] = useState<User[]>(initialUsers);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const [modal, setModal] = useState(false);
  const [form, setForm] = useState({ first_name: "", last_name: "", email: "", role: "tenant_user" });
  const [saving, setSaving] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [msg, setMsg] = useState<{ type: "ok" | "err"; text: string } | null>(null);

  const filtered = users.filter((u) => {
    const name = `${u.first_name ?? ""} ${u.last_name ?? ""}`.toLowerCase();
    const tenant = u.tenants?.name?.toLowerCase() ?? "";
    const q = search.toLowerCase();
    const matchesSearch = !q || name.includes(q) || tenant.includes(q);
    const matchesRole = roleFilter === "all" || u.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  const stats = {
    total: users.length,
    superAdmins: users.filter((u) => u.role === "super_admin").length,
    tenantAdmins: users.filter((u) => u.role === "tenant_admin").length,
    active: users.filter((u) => u.is_active !== false).length,
  };

  async function createUser() {
    if (!form.email) { setMsg({ type: "err", text: "Email is required" }); return; }
    setSaving(true);
    setMsg(null);
    startTransition(async () => {
      try {
        const res = await fetch("/api/admin/users", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        });
        const data = await res.json() as { ok?: boolean; id?: string; error?: string };
        if (!res.ok) throw new Error(data.error ?? "Failed to create user");
        // Reload from server
        const list = await fetch("/api/admin/users").then((r) => r.json()) as User[];
        setUsers(list);
        setMsg({ type: "ok", text: `User ${form.email} created successfully` });
        setModal(false);
        setForm({ first_name: "", last_name: "", email: "", role: "tenant_user" });
      } catch (err) {
        setMsg({ type: "err", text: err instanceof Error ? err.message : "Failed" });
      } finally {
        setSaving(false);
      }
    });
  }

  async function changeRole(id: string, role: string) {
    const res = await fetch(`/api/admin/users/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ role }),
    });
    if (res.ok) {
      setUsers((prev) => prev.map((u) => u.id === id ? { ...u, role } : u));
    }
    setOpenMenu(null);
  }

  async function deactivateUser(id: string) {
    if (!confirm("Deactivate this user? They will lose access immediately.")) return;
    const res = await fetch(`/api/admin/users/${id}`, { method: "DELETE" });
    if (res.ok) {
      setUsers((prev) => prev.map((u) => u.id === id ? { ...u, is_active: false } : u));
    }
    setOpenMenu(null);
  }

  async function reactivateUser(id: string) {
    const res = await fetch(`/api/admin/users/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ is_active: true }),
    });
    if (res.ok) {
      setUsers((prev) => prev.map((u) => u.id === id ? { ...u, is_active: true } : u));
    }
    setOpenMenu(null);
  }

  return (
    <div className="p-6 space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        {[
          { label: "Total Users", value: stats.total, icon: CheckCircle2, color: "text-violet-400", bg: "bg-violet-600/20" },
          { label: "Super Admins", value: stats.superAdmins, icon: Shield, color: "text-amber-400", bg: "bg-amber-600/20" },
          { label: "Client Admins", value: stats.tenantAdmins, icon: Building2, color: "text-emerald-400", bg: "bg-emerald-600/20" },
          { label: "Active Users", value: stats.active, icon: UserPlus, color: "text-cyan-400", bg: "bg-cyan-600/20" },
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

      {/* Toast */}
      {msg && (
        <div className={`p-3 rounded-xl text-sm flex items-center justify-between ${msg.type === "ok" ? "bg-emerald-500/10 border border-emerald-500/20 text-emerald-400" : "bg-red-500/10 border border-red-500/20 text-red-400"}`}>
          {msg.text}
          <button onClick={() => setMsg(null)}><X className="w-4 h-4" /></button>
        </div>
      )}

      {/* Users table */}
      <div className="glass-card overflow-hidden">
        <div className="p-5 border-b border-white/5 flex items-center justify-between gap-3 flex-wrap">
          <h2 className="text-sm font-semibold text-white shrink-0">
            All Users <span className="text-white/30 font-normal">({filtered.length})</span>
          </h2>
          <div className="flex items-center gap-2 flex-1 min-w-48 flex-wrap">
            <div className="flex items-center gap-2 px-3 py-1.5 bg-white/5 border border-white/5 rounded-lg flex-1">
              <Search className="w-4 h-4 text-white/30 shrink-0" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by name or tenant..."
                className="bg-transparent text-sm text-white/60 placeholder:text-white/30 outline-none flex-1 min-w-0"
              />
            </div>
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="input-dark text-xs py-1.5 w-32 bg-[#0a0d1a]"
            >
              <option value="all">All Roles</option>
              {ROLES.map((r) => (
                <option key={r} value={r}>{roleConfig[r]?.label ?? r}</option>
              ))}
            </select>
            <button
              onClick={() => { setModal(true); setMsg(null); }}
              className="btn-primary text-xs py-1.5 px-3 flex items-center gap-1.5 shrink-0"
            >
              <UserPlus className="w-3.5 h-3.5" /> Add User
            </button>
          </div>
        </div>

        {filtered.length === 0 ? (
          <div className="p-10 text-center">
            <UserPlus className="w-8 h-8 text-white/10 mx-auto mb-2" />
            <p className="text-sm text-white/30">
              {search || roleFilter !== "all" ? "No users match your filters" : "No users yet"}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/5">
                  {["User", "Client", "Role", "Status", "Last Seen", "Actions"].map((h) => (
                    <th key={h} className="text-left py-3 px-4 text-xs font-medium text-white/30 first:pl-5">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filtered.map((user, i) => {
                  const role = roleConfig[user.role ?? "tenant_user"] ?? roleConfig.tenant_user;
                  const fullName = [user.first_name, user.last_name].filter(Boolean).join(" ") || "Unnamed User";
                  const initials = [user.first_name?.[0], user.last_name?.[0]].filter(Boolean).join("") || "?";
                  const isActive = user.is_active !== false;
                  return (
                    <tr key={user.id} className="hover:bg-white/2 transition-colors">
                      <td className="py-3.5 pl-5 pr-4">
                        <div className="flex items-center gap-2.5">
                          <div className={`w-8 h-8 rounded-xl bg-gradient-to-br ${avatarColors[i % avatarColors.length]} flex items-center justify-center text-xs font-bold text-white shrink-0`}>
                            {initials}
                          </div>
                          <div>
                            <div className="text-sm font-medium text-white">{fullName}</div>
                            <div className="text-xs text-white/30">{user.id.slice(0, 8)}…</div>
                          </div>
                        </div>
                      </td>
                      <td className="py-3.5 px-4 text-sm text-white/50">
                        {user.tenants?.name ?? <span className="text-white/20">—</span>}
                      </td>
                      <td className="py-3.5 px-4">
                        <span className={`px-2.5 py-1 rounded-full text-xs border ${role.color} ${role.bg} ${role.border}`}>
                          {role.label}
                        </span>
                      </td>
                      <td className="py-3.5 px-4">
                        <div className={`flex items-center gap-1.5 text-xs ${isActive ? "text-emerald-400" : "text-white/30"}`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${isActive ? "bg-emerald-400" : "bg-white/20"}`} />
                          {isActive ? "Active" : "Inactive"}
                        </div>
                      </td>
                      <td className="py-3.5 px-4 text-xs text-white/30">{relativeTime(user.last_seen)}</td>
                      <td className="py-3.5 px-4 relative">
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => setOpenMenu(openMenu === user.id ? null : user.id)}
                            className="w-8 h-8 rounded-lg hover:bg-white/5 flex items-center justify-center text-white/20 hover:text-white/60 transition-all"
                          >
                            <MoreHorizontal className="w-4 h-4" />
                          </button>
                          {openMenu === user.id && (
                            <div className="absolute right-4 top-10 z-20 bg-[#0d1117] border border-white/10 rounded-xl shadow-2xl py-1.5 min-w-48">
                              <div className="px-3 py-1.5 text-[10px] text-white/30 font-semibold uppercase tracking-wider">Change Role</div>
                              {ROLES.map((r) => (
                                <button
                                  key={r}
                                  onClick={() => changeRole(user.id, r)}
                                  className={`w-full text-left px-3 py-2 text-sm hover:bg-white/5 transition-colors flex items-center justify-between ${user.role === r ? "text-amber-400" : "text-white/60"}`}
                                >
                                  {roleConfig[r]?.label}
                                  {user.role === r && <CheckCircle2 className="w-3.5 h-3.5" />}
                                </button>
                              ))}
                              <div className="border-t border-white/5 mt-1 pt-1">
                                {isActive ? (
                                  <button
                                    onClick={() => deactivateUser(user.id)}
                                    className="w-full text-left px-3 py-2 text-sm text-red-400 hover:bg-red-500/10 transition-colors flex items-center gap-2"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" /> Deactivate
                                  </button>
                                ) : (
                                  <button
                                    onClick={() => reactivateUser(user.id)}
                                    className="w-full text-left px-3 py-2 text-sm text-emerald-400 hover:bg-emerald-500/10 transition-colors flex items-center gap-2"
                                  >
                                    <CheckCircle2 className="w-3.5 h-3.5" /> Reactivate
                                  </button>
                                )}
                              </div>
                            </div>
                          )}
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

      {/* ── Create User Modal ──────────────────────────────── */}
      {modal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4" onClick={(e) => e.target === e.currentTarget && setModal(false)}>
          <div className="glass-card w-full max-w-md">
            <div className="flex items-center justify-between p-6 border-b border-white/5">
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <UserPlus className="w-4 h-4 text-amber-400" />
                Create New User
              </h2>
              <button onClick={() => setModal(false)} className="text-white/30 hover:text-white/60">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-white/50 mb-1.5">First Name</label>
                  <input
                    type="text"
                    value={form.first_name}
                    onChange={(e) => setForm((f) => ({ ...f, first_name: e.target.value }))}
                    placeholder="John"
                    className="input-dark"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-white/50 mb-1.5">Last Name</label>
                  <input
                    type="text"
                    value={form.last_name}
                    onChange={(e) => setForm((f) => ({ ...f, last_name: e.target.value }))}
                    placeholder="Doe"
                    className="input-dark"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-white/50 mb-1.5">Email Address *</label>
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                  placeholder="user@company.com"
                  className="input-dark"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-white/50 mb-1.5">Role</label>
                <div className="relative">
                  <select
                    value={form.role}
                    onChange={(e) => setForm((f) => ({ ...f, role: e.target.value }))}
                    className="input-dark appearance-none w-full pr-8"
                  >
                    {ROLES.map((r) => (
                      <option key={r} value={r}>{roleConfig[r]?.label}</option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30 pointer-events-none" />
                </div>
                <p className="text-xs text-white/25 mt-1">Default password: ChangeMe@2025! (user should change on first login)</p>
              </div>

              {msg && (
                <div className={`p-3 rounded-xl text-sm ${msg.type === "ok" ? "bg-emerald-500/10 border border-emerald-500/20 text-emerald-400" : "bg-red-500/10 border border-red-500/20 text-red-400"}`}>
                  {msg.text}
                </div>
              )}
            </div>

            <div className="flex gap-3 p-6 pt-0">
              <button onClick={() => setModal(false)} className="btn-secondary flex-1 text-sm py-2.5">Cancel</button>
              <button
                onClick={createUser}
                disabled={saving || isPending}
                className="btn-primary flex-1 text-sm py-2.5 flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                Create User
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
