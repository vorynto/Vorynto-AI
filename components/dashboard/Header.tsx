"use client";

import { Bell, Search, ChevronDown } from "lucide-react";

interface HeaderProps {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
}

export default function Header({ title, subtitle, action }: HeaderProps) {
  return (
    <header className="flex items-center justify-between h-16 px-6 border-b border-white/5 bg-[#0a0d1a]/50 backdrop-blur-sm">
      <div>
        <h1 className="text-lg font-semibold text-white">{title}</h1>
        {subtitle && <p className="text-xs text-white/40">{subtitle}</p>}
      </div>

      <div className="flex items-center gap-3">
        {action}

        {/* Search */}
        <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-white/5 border border-white/5 rounded-lg hover:border-white/10 transition-colors">
          <Search className="w-4 h-4 text-white/30" />
          <input
            type="text"
            placeholder="Search..."
            className="bg-transparent text-sm text-white/60 placeholder:text-white/30 outline-none w-36"
          />
        </div>

        {/* Notifications */}
        <button className="relative w-9 h-9 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center transition-colors">
          <Bell className="w-4 h-4 text-white/60" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-violet-500 rounded-full" />
        </button>

        {/* User avatar */}
        <button className="flex items-center gap-2 pl-2 pr-3 py-1.5 bg-white/5 hover:bg-white/8 border border-white/5 rounded-lg transition-colors">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-violet-500 to-purple-700 flex items-center justify-center text-xs font-bold text-white">
            U
          </div>
          <ChevronDown className="w-3.5 h-3.5 text-white/40" />
        </button>
      </div>
    </header>
  );
}
