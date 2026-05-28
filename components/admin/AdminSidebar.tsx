"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard, Users, Building2, CreditCard,
  FileText, Settings, Zap, Shield, LogOut, Headphones,
  ChevronRight,
} from "lucide-react";
import { useRouter } from "next/navigation";

const navItems = [
  { label: "Overview", href: "/admin", icon: LayoutDashboard },
  { label: "Clients", href: "/admin/tenants", icon: Building2 },
  { label: "Users", href: "/admin/users", icon: Users },
  { label: "Subscription Plans", href: "/admin/plans", icon: CreditCard },
  { label: "CMS Content", href: "/admin/content", icon: FileText },
  { label: "Support Tickets", href: "/admin/support", icon: Headphones },
  { label: "Admin Settings", href: "/admin/settings", icon: Settings },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();

  async function handleLogout() {
    const { createClient } = await import("@/lib/supabase/client");
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/login");
  }

  return (
    <aside className="w-60 flex flex-col bg-[#040609] border-r border-amber-500/10 shrink-0">
      {/* Brand */}
      <div className="p-4 border-b border-amber-500/10">
        <div className="flex items-center gap-2.5 mb-3">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center shrink-0">
            <Zap className="w-4 h-4 text-white" />
          </div>
          <div>
            <div className="text-sm font-bold text-white">Vorynto <span className="text-amber-400">Admin</span></div>
            <div className="text-[10px] text-amber-500/60 font-medium tracking-wider uppercase">Super Admin Panel</div>
          </div>
        </div>
        <div className="flex items-center gap-1.5 px-2 py-1.5 rounded-lg bg-amber-500/10 border border-amber-500/20">
          <Shield className="w-3 h-3 text-amber-400" />
          <span className="text-[11px] text-amber-400 font-semibold">Full Platform Access</span>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 p-3 space-y-0.5 overflow-y-auto">
        {navItems.map((item) => {
          const isActive =
            item.href === "/admin"
              ? pathname === "/admin"
              : pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-medium transition-all group ${
                isActive
                  ? "bg-amber-500/15 text-amber-300 border border-amber-500/25"
                  : "text-white/40 hover:text-white/80 hover:bg-white/5"
              }`}
            >
              <item.icon className={`w-4 h-4 shrink-0 ${isActive ? "text-amber-400" : "text-white/30 group-hover:text-white/60"}`} />
              <span className="flex-1">{item.label}</span>
              {isActive && <ChevronRight className="w-3 h-3 text-amber-400/50" />}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="p-3 border-t border-amber-500/10 space-y-1">
        <div className="px-3 py-2 rounded-xl bg-white/3 border border-white/5 mb-2">
          <div className="text-xs text-white/60 font-medium">Logged in as</div>
          <div className="text-xs text-amber-400 font-semibold mt-0.5">Super Administrator</div>
        </div>
        <button
          onClick={handleLogout}
          className="flex items-center gap-2.5 w-full px-3 py-2 rounded-xl text-sm text-white/30 hover:text-red-400 hover:bg-red-500/10 transition-all"
        >
          <LogOut className="w-4 h-4 shrink-0" />
          <span>Log out</span>
        </button>
      </div>
    </aside>
  );
}
