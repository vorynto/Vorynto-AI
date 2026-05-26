"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard, Users, Building2, CreditCard,
  FileText, Settings, Zap, Shield, LogOut, Headphones,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

const adminNavItems = [
  { label: "Overview", href: "/admin", icon: LayoutDashboard },
  { label: "Tenants", href: "/admin/tenants", icon: Building2 },
  { label: "Users", href: "/admin/users", icon: Users },
  { label: "Subscription Plans", href: "/admin/plans", icon: CreditCard },
  { label: "CMS Content", href: "/admin/content", icon: FileText },
  { label: "Support Tickets", href: "/admin/support", icon: Headphones },
  { label: "Settings", href: "/admin/settings", icon: Settings },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();

  async function handleLogout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/login");
  }

  return (
    <aside className="w-56 flex flex-col bg-[#050810] border-r border-white/5">
      <div className="p-4 border-b border-white/5">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-violet-600 to-purple-800 flex items-center justify-center">
            <Zap className="w-4 h-4 text-white" />
          </div>
          <div>
            <div className="text-sm font-bold gradient-text">Vorynto AI</div>
            <div className="flex items-center gap-1">
              <Shield className="w-3 h-3 text-amber-400" />
              <span className="text-xs text-amber-400 font-medium">Super Admin</span>
            </div>
          </div>
        </div>
      </div>

      <nav className="flex-1 p-3 space-y-0.5">
        {adminNavItems.map((item) => {
          const isActive = pathname === item.href || (item.href !== "/admin" && pathname.startsWith(item.href));
          return (
            <Link key={item.href} href={item.href} className={`sidebar-link ${isActive ? "active" : ""}`}>
              <item.icon className="w-4 h-4 shrink-0" />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="p-3 border-t border-white/5">
        <Link href="/dashboard" className="sidebar-link text-xs text-white/30">
          <Zap className="w-4 h-4" />
          <span>Back to Dashboard</span>
        </Link>
        <button onClick={handleLogout} className="sidebar-link w-full hover:text-red-400 hover:bg-red-500/10 text-xs text-white/30">
          <LogOut className="w-4 h-4" />
          <span>Log out</span>
        </button>
      </div>
    </aside>
  );
}
