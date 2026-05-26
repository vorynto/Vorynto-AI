import Header from "@/components/dashboard/Header";
import { Building2, Key, Shield, Users, MessageSquare, BarChart3, ToggleRight, ToggleLeft, CheckCircle2, XCircle } from "lucide-react";

// This page manages a specific tenant's account settings
// In a real app, the [tenantId] would be a dynamic route

const tenantInfo = {
  name: "TechCorp Inc.",
  email: "admin@techcorp.com",
  plan: "Growth",
  slug: "techcorp",
  isActive: true,
  isSetupComplete: true,
  apiKeys: [
    { provider: "WhatsApp Business API", key: "wbp_***********************abc123", isVerified: true, provider_icon: "💬" },
    { provider: "Meta Ads", key: "EAABc***********************xyz", isVerified: false, provider_icon: "📘" },
    { provider: "OpenAI", key: "sk-***********************proj", isVerified: true, provider_icon: "🤖" },
  ],
  features: [
    { key: "crm", label: "AI CRM", isEnabled: true, usageLimit: 5000, usageCount: 2847 },
    { key: "whatsapp", label: "WhatsApp Bot", isEnabled: true, usageLimit: null, usageCount: null },
    { key: "campaigns", label: "Bulk Campaigns", isEnabled: true, usageLimit: 10000, usageCount: 6200 },
    { key: "website_builder", label: "AI Website Builder", isEnabled: true, usageLimit: null, usageCount: null },
    { key: "voice_bot", label: "Voice Bot", isEnabled: true, usageLimit: 100, usageCount: 78 },
    { key: "meta_ads", label: "Meta Ads Integration", isEnabled: false, usageLimit: null, usageCount: null },
    { key: "seo", label: "AI SEO", isEnabled: true, usageLimit: null, usageCount: null },
    { key: "chatbot", label: "Website Chatbot", isEnabled: true, usageLimit: null, usageCount: null },
  ],
  users: [
    { name: "Sarah Johnson", email: "sarah@techcorp.com", role: "tenant_admin" },
    { name: "Mark Davis", email: "mark@techcorp.com", role: "tenant_user" },
    { name: "Lisa Chen", email: "lisa@techcorp.com", role: "tenant_user" },
  ],
};

export default function AdminAccountsPage() {
  return (
    <div>
      <Header
        title="Account Management"
        subtitle={`Managing: ${tenantInfo.name}`}
        action={
          <button className="btn-primary text-sm py-2 px-4">
            <Shield className="w-4 h-4" />
            Login as Tenant
          </button>
        }
      />

      <div className="p-6 space-y-6">
        {/* Tenant info card */}
        <div className="glass-card p-6 bg-gradient-to-br from-violet-600/10 to-transparent border-violet-500/20">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-violet-600/20 flex items-center justify-center text-2xl font-bold text-violet-400">
                {tenantInfo.name[0]}
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">{tenantInfo.name}</h2>
                <p className="text-sm text-white/40">{tenantInfo.email}</p>
                <div className="flex items-center gap-2 mt-2">
                  <span className="text-xs px-2.5 py-1 rounded-full bg-violet-600/20 border border-violet-500/20 text-violet-400">
                    {tenantInfo.plan} Plan
                  </span>
                  <span className="text-xs px-2.5 py-1 rounded-full bg-emerald-600/20 border border-emerald-500/20 text-emerald-400">
                    Active
                  </span>
                  {tenantInfo.isSetupComplete && (
                    <span className="flex items-center gap-1 text-xs text-white/30">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                      Setup Complete
                    </span>
                  )}
                </div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-white">$149</div>
              <div className="text-xs text-white/30">per month</div>
              <div className="text-xs text-white/20 mt-1">Renews Jun 26, 2025</div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          {/* Feature access control */}
          <div className="glass-card p-6">
            <h2 className="text-base font-semibold text-white mb-4 flex items-center gap-2">
              <Shield className="w-4 h-4 text-violet-400" />
              Feature Access Control
            </h2>
            <div className="space-y-3">
              {tenantInfo.features.map((feature) => (
                <div key={feature.key} className="flex items-center justify-between p-3 rounded-xl bg-white/3 border border-white/5">
                  <div className="flex items-center gap-2">
                    {feature.isEnabled ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    ) : (
                      <XCircle className="w-4 h-4 text-white/20" />
                    )}
                    <div>
                      <div className="text-sm text-white">{feature.label}</div>
                      {feature.usageLimit && feature.usageCount !== null && (
                        <div className="text-xs text-white/30 mt-0.5">
                          {feature.usageCount.toLocaleString()} / {feature.usageLimit.toLocaleString()} used
                        </div>
                      )}
                    </div>
                  </div>
                  {feature.isEnabled ? (
                    <ToggleRight className="w-7 h-7 text-emerald-400 cursor-pointer hover:opacity-80" />
                  ) : (
                    <ToggleLeft className="w-7 h-7 text-white/20 cursor-pointer hover:text-white/40" />
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-6">
            {/* API Keys */}
            <div className="glass-card p-6">
              <h2 className="text-base font-semibold text-white mb-4 flex items-center gap-2">
                <Key className="w-4 h-4 text-violet-400" />
                API Keys & Integrations
              </h2>
              <div className="space-y-3">
                {tenantInfo.apiKeys.map((key) => (
                  <div key={key.provider} className="p-3 rounded-xl bg-white/3 border border-white/5">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span>{key.provider_icon}</span>
                        <span className="text-sm font-medium text-white">{key.provider}</span>
                      </div>
                      {key.isVerified ? (
                        <span className="flex items-center gap-1 text-xs text-emerald-400">
                          <CheckCircle2 className="w-3 h-3" />
                          Verified
                        </span>
                      ) : (
                        <span className="flex items-center gap-1 text-xs text-amber-400">
                          <XCircle className="w-3 h-3" />
                          Not verified
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <code className="text-xs text-white/30 font-mono flex-1 truncate">{key.key}</code>
                      <button className="text-xs text-violet-400 hover:text-violet-300">Update</button>
                    </div>
                  </div>
                ))}
                <button className="w-full py-2 text-xs border border-dashed border-white/10 text-white/30 rounded-xl hover:border-violet-500/30 hover:text-violet-400 transition-all">
                  + Add API Key
                </button>
              </div>
            </div>

            {/* Tenant users */}
            <div className="glass-card p-6">
              <h2 className="text-base font-semibold text-white mb-4 flex items-center gap-2">
                <Users className="w-4 h-4 text-violet-400" />
                Tenant Users
              </h2>
              <div className="space-y-2">
                {tenantInfo.users.map((user) => (
                  <div key={user.email} className="flex items-center justify-between p-3 rounded-xl bg-white/3">
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-lg bg-violet-600/20 flex items-center justify-center text-xs font-bold text-violet-400">
                        {user.name[0]}
                      </div>
                      <div>
                        <div className="text-sm text-white">{user.name}</div>
                        <div className="text-xs text-white/30">{user.email}</div>
                      </div>
                    </div>
                    <span className={`text-xs px-2 py-0.5 rounded-full border ${user.role === "tenant_admin" ? "border-violet-500/20 bg-violet-500/10 text-violet-400" : "border-white/10 bg-white/5 text-white/30"}`}>
                      {user.role === "tenant_admin" ? "Admin" : "User"}
                    </span>
                  </div>
                ))}
              </div>
              <button className="w-full mt-3 py-2 text-xs border border-dashed border-white/10 text-white/30 rounded-xl hover:border-violet-500/30 hover:text-violet-400 transition-all">
                + Invite User to Tenant
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
