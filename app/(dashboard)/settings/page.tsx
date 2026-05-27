import Header from "@/components/dashboard/Header";
import ApiKeysManager from "@/components/settings/ApiKeysManager";
import { createClient, createAdminClient } from "@/lib/supabase/server";
import { maskKey, getCurrentTenantId } from "@/lib/tenant-keys";
import {
  User, Bell, Shield, Key, CreditCard, Globe,
  CheckCircle2, AlertCircle, Building2,
} from "lucide-react";

export default async function SettingsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  let initialKeys: Record<string, Record<string, { id: string; masked: string; saved: boolean; verified: boolean }>> = {};
  let profile: { first_name: string | null; last_name: string | null; phone: string | null } | null = null;

  if (user) {
    // Load profile
    const { data: profileData } = await supabase
      .from("profiles")
      .select("first_name, last_name, phone")
      .eq("id", user.id)
      .returns<{ first_name: string | null; last_name: string | null; phone: string | null }[]>()
      .maybeSingle();
    profile = profileData;

    // Load tenant API keys (admin client so RLS doesn't block)
    const tenantId = await getCurrentTenantId(user.id);
    if (tenantId) {
      const admin = await createAdminClient();
      const { data: rows } = await admin
        .from("tenant_api_keys")
        .select("id, provider, key_name, encrypted_value, is_verified")
        .eq("tenant_id", tenantId)
        .returns<{
          id: string;
          provider: string;
          key_name: string;
          encrypted_value: string;
          is_verified: boolean | null;
        }[]>();

      for (const row of rows ?? []) {
        if (!initialKeys[row.provider]) initialKeys[row.provider] = {};
        initialKeys[row.provider][row.key_name] = {
          id: row.id,
          masked: maskKey(row.encrypted_value),
          saved: true,
          verified: row.is_verified ?? false,
        };
      }
    }
  }

  return (
    <div>
      <Header title="Settings" subtitle="Manage your account, integrations, and preferences" />

      <div className="p-6 space-y-8">

        {/* ── Profile ──────────────────────────────────────────── */}
        <section className="glass-card p-6">
          <h2 className="text-base font-semibold text-white mb-5 flex items-center gap-2">
            <User className="w-4 h-4 text-violet-400" />
            Profile Settings
          </h2>
          <div className="flex items-start gap-6">
            <div>
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-violet-500 to-purple-700 flex items-center justify-center text-2xl font-bold text-white mb-3">
                {profile?.first_name?.[0]?.toUpperCase() ?? user?.email?.[0]?.toUpperCase() ?? "U"}
              </div>
              <button className="text-xs text-violet-400 hover:text-violet-300 text-center w-full">
                Change photo
              </button>
            </div>
            <div className="flex-1 grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-white/60 mb-1.5">First name</label>
                <input type="text" defaultValue={profile?.first_name ?? ""} placeholder="John" className="input-dark" />
              </div>
              <div>
                <label className="block text-sm font-medium text-white/60 mb-1.5">Last name</label>
                <input type="text" defaultValue={profile?.last_name ?? ""} placeholder="Smith" className="input-dark" />
              </div>
              <div>
                <label className="block text-sm font-medium text-white/60 mb-1.5">Email</label>
                <input type="email" defaultValue={user?.email ?? ""} disabled className="input-dark opacity-50 cursor-not-allowed" />
              </div>
              <div>
                <label className="block text-sm font-medium text-white/60 mb-1.5">Phone</label>
                <input type="tel" defaultValue={profile?.phone ?? ""} placeholder="+1 555-0100" className="input-dark" />
              </div>
            </div>
          </div>
          <div className="flex justify-end mt-4">
            <button className="btn-primary text-sm py-2 px-5">Save Changes</button>
          </div>
        </section>

        {/* ── Company ──────────────────────────────────────────── */}
        <section className="glass-card p-6">
          <h2 className="text-base font-semibold text-white mb-5 flex items-center gap-2">
            <Building2 className="w-4 h-4 text-violet-400" />
            Company Settings
          </h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-white/60 mb-1.5">Company name</label>
              <input type="text" placeholder="Acme Corp" className="input-dark" />
            </div>
            <div>
              <label className="block text-sm font-medium text-white/60 mb-1.5">Website</label>
              <input type="url" placeholder="https://yoursite.com" className="input-dark" />
            </div>
            <div>
              <label className="block text-sm font-medium text-white/60 mb-1.5">Industry</label>
              <select className="input-dark bg-[#0f172a]">
                <option>E-commerce</option><option>Healthcare</option>
                <option>Real Estate</option><option>Technology</option><option>Other</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-white/60 mb-1.5">Country</label>
              <select className="input-dark bg-[#0f172a]">
                <option>United States</option><option>United Kingdom</option>
                <option>India</option><option>Canada</option><option>Australia</option><option>Other</option>
              </select>
            </div>
          </div>
          <div className="flex justify-end mt-4">
            <button className="btn-primary text-sm py-2 px-5">Save Changes</button>
          </div>
        </section>

        {/* ── API Keys & Integrations ───────────────────────────── */}
        <section>
          <div className="mb-4">
            <h2 className="text-base font-semibold text-white flex items-center gap-2">
              <Key className="w-4 h-4 text-violet-400" />
              API Keys &amp; Integrations
            </h2>
            <p className="text-xs text-white/40 mt-1">
              Your keys are encrypted at rest and never shared. Vorynto AI only charges the platform fee — you pay AI providers directly.
            </p>
          </div>

          {/* Architecture callout */}
          <div className="mb-5 p-4 rounded-xl bg-violet-600/10 border border-violet-500/20 flex gap-3">
            <AlertCircle className="w-4 h-4 text-violet-400 shrink-0 mt-0.5" />
            <div className="text-xs text-white/60 leading-relaxed">
              <strong className="text-white">Bring Your Own API Keys</strong> — Each AI feature uses your personal API keys
              so you have full ownership, usage visibility, and cost control. OpenAI GPT-4o calls, WhatsApp messages,
              SMS, and emails are billed by those providers at their standard rates.
              <strong className="text-white"> Vorynto AI charges only its platform subscription.</strong>
            </div>
          </div>

          <ApiKeysManager initialKeys={initialKeys} />
        </section>

        {/* ── Notifications ────────────────────────────────────── */}
        <section className="glass-card p-6">
          <h2 className="text-base font-semibold text-white mb-5 flex items-center gap-2">
            <Bell className="w-4 h-4 text-violet-400" />
            Notifications
          </h2>
          <div className="space-y-3">
            {[
              { label: "New lead assigned to me", desc: "Get notified when a contact is assigned" },
              { label: "Campaign completed", desc: "Confirmation when bulk campaigns finish sending" },
              { label: "WhatsApp message received", desc: "Real-time alerts for incoming messages" },
              { label: "AI response errors", desc: "Alert when an AI feature fails due to a missing or invalid key" },
            ].map((item) => (
              <label key={item.label} className="flex items-center justify-between p-3 rounded-xl bg-white/3 border border-white/5 cursor-pointer hover:bg-white/5 transition-colors">
                <div>
                  <div className="text-sm font-medium text-white">{item.label}</div>
                  <div className="text-xs text-white/40">{item.desc}</div>
                </div>
                <div className="w-10 h-5 bg-violet-600 rounded-full relative">
                  <div className="w-3.5 h-3.5 bg-white rounded-full absolute right-0.5 top-0.5 shadow" />
                </div>
              </label>
            ))}
          </div>
        </section>

        {/* ── Security ─────────────────────────────────────────── */}
        <section className="glass-card p-6">
          <h2 className="text-base font-semibold text-white mb-5 flex items-center gap-2">
            <Shield className="w-4 h-4 text-violet-400" />
            Security &amp; Access
          </h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-white/60 mb-1.5">Current password</label>
              <input type="password" placeholder="••••••••••" className="input-dark max-w-sm" />
            </div>
            <div className="grid grid-cols-2 gap-4 max-w-sm">
              <div>
                <label className="block text-sm font-medium text-white/60 mb-1.5">New password</label>
                <input type="password" placeholder="••••••••••" className="input-dark" />
              </div>
              <div>
                <label className="block text-sm font-medium text-white/60 mb-1.5">Confirm password</label>
                <input type="password" placeholder="••••••••••" className="input-dark" />
              </div>
            </div>
            <div className="flex gap-3">
              <button className="btn-primary text-sm py-2 px-5">Update Password</button>
              <button className="btn-secondary text-sm py-2 px-5">Enable 2FA</button>
            </div>
          </div>
        </section>

        {/* ── Billing ──────────────────────────────────────────── */}
        <section className="glass-card p-6 bg-gradient-to-br from-violet-600/10 to-transparent border-violet-500/20">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-semibold text-white mb-1 flex items-center gap-2">
                <CreditCard className="w-4 h-4 text-violet-400" />
                Billing &amp; Subscription
              </h2>
              <p className="text-sm text-white/40">
                Platform fee only — API usage is billed directly by each provider
              </p>
            </div>
            <div className="flex gap-2">
              <button className="btn-secondary text-sm py-2 px-4">View Invoices</button>
              <button className="btn-primary text-sm py-2 px-4">Upgrade Plan</button>
            </div>
          </div>
          <div className="mt-4 p-4 rounded-xl bg-white/3 border border-white/5">
            <div className="flex items-center justify-between mb-3">
              <div>
                <span className="text-white font-semibold">Growth Plan</span>
                <span className="ml-2 text-white/40 text-sm">· $149 / month</span>
              </div>
              <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/20 flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" /> Active
              </span>
            </div>
            <div className="grid grid-cols-3 gap-4">
              {[
                { label: "Contacts", value: "2,847 / 5,000", pct: 57 },
                { label: "Campaign messages", value: "6,200 / 10,000", pct: 62 },
                { label: "Voice minutes", value: "78 / 100", pct: 78 },
              ].map((u) => (
                <div key={u.label}>
                  <div className="flex justify-between text-xs text-white/40 mb-1">
                    <span>{u.label}</span><span>{u.value}</span>
                  </div>
                  <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${u.pct > 80 ? "bg-amber-500" : "bg-gradient-to-r from-violet-600 to-cyan-500"}`}
                      style={{ width: `${u.pct}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
          <p className="text-xs text-white/30 mt-3 flex items-center gap-1.5">
            <Globe className="w-3 h-3 shrink-0" />
            OpenAI, WhatsApp, Twilio, and email provider costs are billed separately by those providers — not by Vorynto AI.
          </p>
        </section>

      </div>
    </div>
  );
}
