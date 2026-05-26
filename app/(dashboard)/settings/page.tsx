import Header from "@/components/dashboard/Header";
import { Settings, User, Bell, Shield, Key, CreditCard, Globe, Palette, ChevronRight, CheckCircle2 } from "lucide-react";

const settingSections = [
  {
    id: "profile",
    icon: User,
    title: "Profile",
    description: "Update your name, photo, and contact info",
  },
  {
    id: "company",
    icon: Globe,
    title: "Company Settings",
    description: "Manage your company details, logo, and branding",
  },
  {
    id: "notifications",
    icon: Bell,
    title: "Notifications",
    description: "Configure email and push notification preferences",
  },
  {
    id: "security",
    icon: Shield,
    title: "Security & Access",
    description: "Password, 2FA, and session management",
  },
  {
    id: "api-keys",
    icon: Key,
    title: "API Keys & Integrations",
    description: "Manage WhatsApp, Meta, Twilio, and other integrations",
  },
  {
    id: "billing",
    icon: CreditCard,
    title: "Billing & Subscription",
    description: "Manage your plan, payment method, and invoices",
  },
];

const integrations = [
  { name: "WhatsApp Business API", status: "connected", provider: "Meta", icon: "💬" },
  { name: "Facebook & Instagram Ads", status: "disconnected", provider: "Meta", icon: "📘" },
  { name: "OpenAI GPT-4o", status: "connected", provider: "OpenAI", icon: "🤖" },
  { name: "Twilio SMS", status: "disconnected", provider: "Twilio", icon: "📱" },
  { name: "Resend Email", status: "connected", provider: "Resend", icon: "📧" },
  { name: "Stripe Payments", status: "connected", provider: "Stripe", icon: "💳" },
];

export default function SettingsPage() {
  return (
    <div>
      <Header title="Settings" subtitle="Manage your account, integrations, and preferences" />

      <div className="p-6 space-y-6">
        {/* Settings sections */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {settingSections.map((section) => (
            <button key={section.id} className="glass-card-hover p-5 text-left flex items-center justify-between group">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-violet-600/20 flex items-center justify-center">
                  <section.icon className="w-5 h-5 text-violet-400" />
                </div>
                <div>
                  <div className="text-sm font-semibold text-white">{section.title}</div>
                  <div className="text-xs text-white/40 mt-0.5">{section.description}</div>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-white/20 group-hover:text-white/40 transition-colors" />
            </button>
          ))}
        </div>

        {/* Profile settings */}
        <div className="glass-card p-6">
          <h2 className="text-base font-semibold text-white mb-5 flex items-center gap-2">
            <User className="w-4 h-4 text-violet-400" />
            Profile Settings
          </h2>
          <div className="flex items-start gap-6">
            <div>
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-violet-500 to-purple-700 flex items-center justify-center text-2xl font-bold text-white mb-3">
                U
              </div>
              <button className="text-xs text-violet-400 hover:text-violet-300 text-center w-full">Change photo</button>
            </div>
            <div className="flex-1 grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-white/60 mb-1.5">First name</label>
                <input type="text" defaultValue="John" className="input-dark" />
              </div>
              <div>
                <label className="block text-sm font-medium text-white/60 mb-1.5">Last name</label>
                <input type="text" defaultValue="Smith" className="input-dark" />
              </div>
              <div>
                <label className="block text-sm font-medium text-white/60 mb-1.5">Email</label>
                <input type="email" defaultValue="john@company.com" className="input-dark" />
              </div>
              <div>
                <label className="block text-sm font-medium text-white/60 mb-1.5">Phone</label>
                <input type="tel" defaultValue="+1 555-0100" className="input-dark" />
              </div>
            </div>
          </div>
          <div className="flex justify-end mt-4">
            <button className="btn-primary text-sm py-2 px-5">Save Changes</button>
          </div>
        </div>

        {/* Integrations */}
        <div className="glass-card p-6">
          <h2 className="text-base font-semibold text-white mb-5 flex items-center gap-2">
            <Key className="w-4 h-4 text-violet-400" />
            Connected Integrations
          </h2>
          <div className="space-y-3">
            {integrations.map((intg) => (
              <div key={intg.name} className="flex items-center justify-between p-4 rounded-xl bg-white/3 border border-white/5">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{intg.icon}</span>
                  <div>
                    <div className="text-sm font-medium text-white">{intg.name}</div>
                    <div className="text-xs text-white/40">by {intg.provider}</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  {intg.status === "connected" ? (
                    <div className="flex items-center gap-1.5 text-xs text-emerald-400">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Connected
                    </div>
                  ) : (
                    <button className="px-3 py-1.5 text-xs font-medium border border-violet-500/30 text-violet-300 rounded-lg hover:bg-violet-600/10 transition-all">
                      Connect
                    </button>
                  )}
                  {intg.status === "connected" && (
                    <button className="px-3 py-1.5 text-xs font-medium border border-white/10 text-white/40 rounded-lg hover:bg-white/5 transition-all">
                      Configure
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Subscription info */}
        <div className="glass-card p-6 bg-gradient-to-br from-violet-600/10 to-transparent border-violet-500/20">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-semibold text-white mb-1 flex items-center gap-2">
                <CreditCard className="w-4 h-4 text-violet-400" />
                Current Plan: <span className="text-violet-400">Growth</span>
              </h2>
              <p className="text-sm text-white/40">$149/month · Renews June 26, 2025 · 10 team members</p>
            </div>
            <div className="flex gap-2">
              <button className="btn-secondary text-sm py-2 px-4">View Invoices</button>
              <button className="btn-primary text-sm py-2 px-4">Upgrade Plan</button>
            </div>
          </div>
          <div className="mt-4 grid grid-cols-3 gap-4">
            {[
              { label: "Contacts used", value: "2,847 / 5,000", pct: 57 },
              { label: "Campaign messages", value: "6,200 / 10,000", pct: 62 },
              { label: "Voice minutes", value: "78 / 100", pct: 78 },
            ].map((usage) => (
              <div key={usage.label}>
                <div className="flex justify-between text-xs text-white/40 mb-1">
                  <span>{usage.label}</span>
                  <span>{usage.value}</span>
                </div>
                <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full ${usage.pct > 80 ? "bg-amber-500" : "bg-gradient-to-r from-violet-600 to-cyan-500"}`}
                    style={{ width: `${usage.pct}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
