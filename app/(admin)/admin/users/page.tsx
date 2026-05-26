import Header from "@/components/dashboard/Header";
import { Users, UserPlus, Search, Shield, Building2, MoreHorizontal, CheckCircle2 } from "lucide-react";

const users = [
  { name: "Sarah Johnson", email: "sarah@techcorp.com", tenant: "TechCorp Inc.", role: "tenant_admin", status: "active", lastSeen: "2m ago", avatar: "SJ" },
  { name: "Marcus Lee", email: "marcus@retailplus.com", tenant: "RetailPlus Co.", role: "tenant_user", status: "active", lastSeen: "1h ago", avatar: "ML" },
  { name: "Dr. Priya Sharma", email: "priya@medconsult.in", tenant: "MedConsult India", role: "tenant_admin", status: "active", lastSeen: "3h ago", avatar: "PS" },
  { name: "Admin User", email: "admin@vorynto.ai", tenant: "—", role: "super_admin", status: "active", lastSeen: "Now", avatar: "AU" },
  { name: "Emma Wilson", email: "emma@startupx.io", tenant: "StartupX", role: "tenant_admin", status: "inactive", lastSeen: "5d ago", avatar: "EW" },
  { name: "James Okafor", email: "james@fastdeliver.com", tenant: "FastDeliver LLC", role: "tenant_user", status: "active", lastSeen: "2d ago", avatar: "JO" },
];

const roleConfig: Record<string, { label: string; color: string; bg: string; border: string }> = {
  super_admin: { label: "Super Admin", color: "text-amber-400", bg: "bg-amber-500/10", border: "border-amber-500/20" },
  tenant_admin: { label: "Tenant Admin", color: "text-violet-400", bg: "bg-violet-500/10", border: "border-violet-500/20" },
  tenant_user: { label: "User", color: "text-white/50", bg: "bg-white/5", border: "border-white/10" },
};

const avatarColors = ["from-violet-500 to-purple-600", "from-cyan-500 to-blue-600", "from-emerald-500 to-teal-600", "from-amber-500 to-orange-600", "from-pink-500 to-rose-600", "from-indigo-500 to-purple-600"];

export default function AdminUsersPage() {
  return (
    <div>
      <Header
        title="Users"
        subtitle="Manage all users across all tenant accounts"
        action={
          <button className="btn-primary text-sm py-2 px-4">
            <UserPlus className="w-4 h-4" />
            Invite User
          </button>
        }
      />

      <div className="p-6 space-y-6">
        {/* Stats */}
        <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
          {[
            { label: "Total Users", value: "48,920", icon: Users, color: "text-violet-400", bg: "bg-violet-600/20" },
            { label: "Super Admins", value: "3", icon: Shield, color: "text-amber-400", bg: "bg-amber-600/20" },
            { label: "Tenant Admins", value: "10,284", icon: Building2, color: "text-emerald-400", bg: "bg-emerald-600/20" },
            { label: "Active Today", value: "8,491", icon: CheckCircle2, color: "text-cyan-400", bg: "bg-cyan-600/20" },
          ].map((s) => (
            <div key={s.label} className="glass-card p-4">
              <div className={`w-9 h-9 rounded-xl ${s.bg} flex items-center justify-center mb-3`}>
                <s.icon className={`w-4 h-4 ${s.color}`} />
              </div>
              <div className="text-xl font-bold text-white">{s.value}</div>
              <div className="text-xs text-white/40 mt-0.5">{s.label}</div>
            </div>
          ))}
        </div>

        {/* Users table */}
        <div className="glass-card overflow-hidden">
          <div className="p-5 border-b border-white/5 flex items-center justify-between gap-3">
            <h2 className="text-sm font-semibold text-white shrink-0">All Users</h2>
            <div className="flex items-center gap-2 flex-1 max-w-sm">
              <div className="flex items-center gap-2 px-3 py-1.5 bg-white/5 border border-white/5 rounded-lg flex-1">
                <Search className="w-4 h-4 text-white/30" />
                <input type="text" placeholder="Search users..." className="bg-transparent text-sm text-white/60 placeholder:text-white/30 outline-none flex-1" />
              </div>
              <select className="input-dark text-xs py-1.5 w-28 bg-[#0a0d1a]">
                <option>All Roles</option>
                <option>Super Admin</option>
                <option>Tenant Admin</option>
                <option>User</option>
              </select>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/5">
                  {["User", "Tenant", "Role", "Status", "Last Seen", "Actions"].map((h) => (
                    <th key={h} className="text-left py-3 px-4 text-xs font-medium text-white/30 first:pl-5">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {users.map((user, i) => {
                  const role = roleConfig[user.role];
                  return (
                    <tr key={user.email} className="hover:bg-white/2 transition-colors">
                      <td className="py-3.5 pl-5 pr-4">
                        <div className="flex items-center gap-2.5">
                          <div className={`w-8 h-8 rounded-xl bg-gradient-to-br ${avatarColors[i % avatarColors.length]} flex items-center justify-center text-xs font-bold text-white`}>
                            {user.avatar}
                          </div>
                          <div>
                            <div className="text-sm font-medium text-white">{user.name}</div>
                            <div className="text-xs text-white/30">{user.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="py-3.5 px-4 text-sm text-white/50">{user.tenant}</td>
                      <td className="py-3.5 px-4">
                        <span className={`px-2.5 py-1 rounded-full text-xs border ${role.color} ${role.bg} ${role.border}`}>
                          {role.label}
                        </span>
                      </td>
                      <td className="py-3.5 px-4">
                        <div className={`flex items-center gap-1.5 text-xs ${user.status === "active" ? "text-emerald-400" : "text-white/30"}`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${user.status === "active" ? "bg-emerald-400" : "bg-white/20"}`} />
                          {user.status}
                        </div>
                      </td>
                      <td className="py-3.5 px-4 text-xs text-white/30">{user.lastSeen}</td>
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-1">
                          <button className="px-2.5 py-1.5 text-xs border border-white/10 text-white/40 rounded-lg hover:bg-white/5 transition-all">
                            Impersonate
                          </button>
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
        </div>
      </div>
    </div>
  );
}
