"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard, Users, MessageSquare, Mail, Globe,
  Mic, BarChart3, Search, Settings, Zap, ChevronLeft,
  ChevronRight, LogOut, Bell, Shield,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

const navItems = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "AI CRM", href: "/crm", icon: Users },
  { label: "WhatsApp Bot", href: "/whatsapp", icon: MessageSquare },
  { label: "Campaigns", href: "/campaigns", icon: Mail },
  { label: "Website Builder", href: "/website-builder", icon: Globe },
  { label: "Chatbot", href: "/chatbot", icon: Shield },
  { label: "Voice Bot", href: "/voice-bot", icon: Mic },
  { label: "Meta Ads", href: "/meta-ads", icon: BarChart3 },
  { label: "AI SEO", href: "/seo", icon: Search },
];

const bottomItems = [
  { label: "Notifications", href: "/notifications", icon: Bell },
  { label: "Settings", href: "/settings", icon: Settings },
];

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  async function handleLogout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/login");
  }

  return (
    <aside
      className={`flex flex-col bg-[#0a0d1a] border-r border-white/5 transition-all duration-300 relative ${
        collapsed ? "w-16" : "w-60"
      }`}
    >
      <div className={`flex items-center gap-2.5 p-4 border-b border-white/5 ${collapsed ? "justify-center" : ""}`}>
        <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-violet-600 to-purple-800 flex items-center justify-center shrink-0">
          <Zap className="w-4 h-4 text-white" />
        </div>
        {!collapsed && (
          <span className="font-bold text-sm">
            <span className="gradient-text">Vorynto</span>
            <span className="text-white"> AI</span>
          </span>
        )}
      </div>

      <nav className="flex-1 p-3 space-y-0.5 overflow-y-auto">
        {navItems.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
          return (
            <Link
              key={item.href}
              href={item.href}
              title={collapsed ? item.label : undefined}
              className={`sidebar-link ${isActive ? "active" : ""} ${collapsed ? "justify-center px-2" : ""}`}
            >
              <item.icon className="w-4 h-4 shrink-0" />
              {!collapsed && <span>{item.label}</span>}
            </Link>
          );
        })}
      </nav>

      <div className="p-3 border-t border-white/5 space-y-0.5">
        {bottomItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            title={collapsed ? item.label : undefined}
            className={`sidebar-link ${collapsed ? "justify-center px-2" : ""}`}
          >
            <item.icon className="w-4 h-4 shrink-0" />
            {!collapsed && <span>{item.label}</span>}
          </Link>
        ))}
        <button
          onClick={handleLogout}
          title={collapsed ? "Log out" : undefined}
          className={`sidebar-link w-full hover:text-red-400 hover:bg-red-500/10 ${collapsed ? "justify-center px-2" : ""}`}
        >
          <LogOut className="w-4 h-4 shrink-0" />
          {!collapsed && <span>Log out</span>}
        </button>
      </div>

      <button
        onClick={() => setCollapsed(!collapsed)}
        className="absolute -right-3 top-6 w-6 h-6 rounded-full bg-[#0f172a] border border-white/10 flex items-center justify-center hover:bg-violet-600/20 hover:border-violet-500/30 transition-all"
      >
        {collapsed ? (
          <ChevronRight className="w-3 h-3 text-white/40" />
        ) : (
          <ChevronLeft className="w-3 h-3 text-white/40" />
        )}
      </button>
    </aside>
  );
}
