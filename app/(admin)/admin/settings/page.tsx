import AdminHeader from "@/components/admin/AdminHeader";
import { createAdminClient } from "@/lib/supabase/server";
import {
  Settings, Shield, Globe, Bell, Database,
  Mail, Key, Zap, ChevronRight, AlertCircle,
} from "lucide-react";

export default async function AdminSettingsPage() {
  const admin = await createAdminClient();
  const { data: { user } } = await admin.auth.getUser();
  const { data: profile } = await admin
    .from("profiles")
    .select("first_name, last_name, role")
    .eq("id", user?.id ?? "")
    .returns<{ first_name: string | null; last_name: string | null; role: string | null }[]>()
    .maybeSingle();

  const adminName = [profile?.first_name, profile?.last_name].filter(Boolean).join(" ") || "Super Admin";

  const settingsSections = [
    {
      title: "Platform Identity",
      icon: Globe,
      color: "text-violet-400",
      bg: "bg-violet-600/20",
      items: [
        { label: "Platform Name", value: "Vorynto AI", type: "text" },
        { label: "Support Email", value: "support@vorynto.ai", type: "email" },
        { label: "Platform URL", value: "https://vorynto.ai", type: "url" },
        { label: "Default Timezone", value: "UTC", type: "text" },
      ],
    },
    {
      title: "Security",
      icon: Shield,
      color: "text-amber-400",
      bg: "bg-amber-600/20",
      items: [
        { label: "Session Timeout (minutes)", value: "1440", type: "number" },
        { label: "Max Login Attempts", value: "5", type: "number" },
        { label: "Require 2FA for Super Admins", value: "Enabled", type: "toggle" },
        { label: "IP Allowlist", value: "Disabled", type: "toggle" },
      ],
    },
    {
      title: "Email Configuration",
      icon: Mail,
      color: "text-cyan-400",
      bg: "bg-cyan-600/20",
      items: [
        { label: "SMTP Host", value: "smtp.resend.com", type: "text" },
        { label: "SMTP Port", value: "587", type: "number" },
        { label: "From Address", value: "noreply@vorynto.ai", type: "email" },
        { label: "From Name", value: "Vorynto AI", type: "text" },
      ],
    },
    {
      title: "Notifications",
      icon: Bell,
      color: "text-emerald-400",
      bg: "bg-emerald-600/20",
      items: [
        { label: "New Client Sign-up", value: "Email + Slack", type: "text" },
        { label: "Payment Failure", value: "Email", type: "text" },
        { label: "Support Ticket Opened", value: "Email", type: "text" },
        { label: "System Errors", value: "Email + Slack", type: "text" },
      ],
    },
  ];

  return (
    <div>
      <AdminHeader
        title="Admin Settings"
        subtitle="Configure platform-wide settings and defaults"
        breadcrumb="Platform Management"
        action={
          <button className="btn-primary text-sm py-2 px-4 flex items-center gap-1.5">
            <Settings className="w-4 h-4" />
            Save All Changes
          </button>
        }
      />

      <div className="p-6 space-y-6">
        {/* Admin profile card */}
        <div className="glass-card p-5 flex items-center gap-4 border-amber-500/15 bg-gradient-to-br from-amber-600/5 to-transparent">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center shrink-0">
            <Zap className="w-6 h-6 text-white" />
          </div>
          <div>
            <div className="text-base font-bold text-white">{adminName}</div>
            <div className="text-xs text-amber-400 font-medium">Super Administrator · Full Platform Access</div>
            <div className="text-xs text-white/30 mt-0.5">{user?.email}</div>
          </div>
          <button className="ml-auto btn-secondary text-xs py-1.5 px-3 flex items-center gap-1.5">
            <Key className="w-3.5 h-3.5" /> Change Password
          </button>
        </div>

        {/* Coming soon banner */}
        <div className="glass-card p-4 flex items-center gap-3 border-amber-500/15">
          <AlertCircle className="w-4 h-4 text-amber-400 shrink-0" />
          <p className="text-sm text-white/50">
            These settings are read-only previews. Full editing functionality — including SMTP config, webhook URLs, and security policies — is coming in the next platform update.
          </p>
        </div>

        {/* Settings grid */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          {settingsSections.map((section) => (
            <div key={section.title} className="glass-card overflow-hidden">
              <div className="flex items-center gap-2.5 p-5 border-b border-white/5">
                <div className={`w-8 h-8 rounded-xl ${section.bg} flex items-center justify-center shrink-0`}>
                  <section.icon className={`w-4 h-4 ${section.color}`} />
                </div>
                <h2 className="text-sm font-semibold text-white">{section.title}</h2>
              </div>
              <div className="divide-y divide-white/5">
                {section.items.map((item) => (
                  <div key={item.label} className="flex items-center justify-between px-5 py-3.5 hover:bg-white/2 transition-colors">
                    <span className="text-sm text-white/50">{item.label}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-white/80">{item.value}</span>
                      <ChevronRight className="w-3.5 h-3.5 text-white/15" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Danger zone */}
        <div className="glass-card p-5 border-red-500/20">
          <div className="flex items-center gap-2 mb-4">
            <AlertCircle className="w-4 h-4 text-red-400" />
            <h2 className="text-sm font-semibold text-red-400">Danger Zone</h2>
          </div>
          <div className="space-y-3">
            {[
              { label: "Flush All Sessions", desc: "Immediately log out all users across all clients" },
              { label: "Reset Platform Cache", desc: "Clear all cached data and force a fresh reload" },
              { label: "Export All Data", desc: "Download a full backup of all client and user data" },
            ].map((action) => (
              <div key={action.label} className="flex items-center justify-between p-3 rounded-xl bg-red-500/5 border border-red-500/10">
                <div>
                  <div className="text-sm font-medium text-white">{action.label}</div>
                  <div className="text-xs text-white/30 mt-0.5">{action.desc}</div>
                </div>
                <button className="px-3 py-1.5 text-xs border border-red-500/30 text-red-400 rounded-lg hover:bg-red-500/10 transition-all shrink-0 ml-4">
                  {action.label.split(" ")[0]}
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* System info */}
        <div className="glass-card p-5">
          <div className="flex items-center gap-2 mb-4">
            <Database className="w-4 h-4 text-white/30" />
            <h2 className="text-sm font-semibold text-white">System Information</h2>
          </div>
          <div className="grid grid-cols-2 xl:grid-cols-4 gap-4 text-xs">
            {[
              { label: "Framework", value: "Next.js 15 App Router" },
              { label: "Database", value: "Supabase (PostgreSQL)" },
              { label: "Auth", value: "Supabase Auth + SSR" },
              { label: "Deployment", value: "Vercel Edge" },
            ].map((i) => (
              <div key={i.label} className="p-3 rounded-xl bg-white/3 border border-white/5">
                <div className="text-white/30 mb-1">{i.label}</div>
                <div className="text-white/70 font-medium">{i.value}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
