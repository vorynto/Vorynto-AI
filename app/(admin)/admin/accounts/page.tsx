import AdminHeader from "@/components/admin/AdminHeader";
import { createAdminClient } from "@/lib/supabase/server";
import {
  Key, Shield, Users, CheckCircle2, XCircle,
  Building2, ArrowRight, AlertCircle,
} from "lucide-react";
import Link from "next/link";

// Quick-access overview of all tenants with their API keys and feature status.
// For full tenant drill-down, navigate from /admin/tenants → Manage.

export default async function AdminAccountsPage() {
  const admin = await createAdminClient();

  const { data: tenants } = await admin
    .from("tenants")
    .select(`
      id, name, slug, email, is_active, is_setup_complete,
      subscriptions(status, subscription_plans(name)),
      tenant_api_keys(provider, key_name, is_active)
    `)
    .order("created_at", { ascending: false })
    .returns<{
      id: string;
      name: string;
      slug: string;
      email: string | null;
      is_active: boolean | null;
      is_setup_complete: boolean | null;
      subscriptions: { status: string | null; subscription_plans: { name: string } | null }[];
      tenant_api_keys: { provider: string; key_name: string; is_active: boolean | null }[];
    }[]>();

  const list = tenants ?? [];

  return (
    <div>
      <AdminHeader
        title="Account Overview"
        subtitle="Platform-wide view of client API key setup and integration status"
        breadcrumb="Platform Management"
      />

      <div className="p-6 space-y-6">
        {/* Summary */}
        <div className="grid grid-cols-2 xl:grid-cols-3 gap-4">
          {[
            { label: "Total Accounts", value: list.length, icon: Building2, color: "text-violet-400", bg: "bg-violet-600/20" },
            { label: "Keys Configured", value: list.filter((t) => t.tenant_api_keys.length > 0).length, icon: Key, color: "text-amber-400", bg: "bg-amber-600/20" },
            { label: "Setup Incomplete", value: list.filter((t) => !t.is_setup_complete).length, icon: AlertCircle, color: "text-red-400", bg: "bg-red-600/20" },
          ].map((s) => (
            <div key={s.label} className="glass-card p-5">
              <div className={`w-9 h-9 rounded-xl ${s.bg} flex items-center justify-center mb-3`}>
                <s.icon className={`w-4 h-4 ${s.color}`} />
              </div>
              <div className="text-2xl font-bold text-white">{s.value}</div>
              <div className="text-xs text-white/40 mt-0.5">{s.label}</div>
            </div>
          ))}
        </div>

        {/* Accounts grid */}
        {list.length === 0 ? (
          <div className="glass-card p-10 text-center">
            <Building2 className="w-10 h-10 text-white/10 mx-auto mb-3" />
            <p className="text-sm text-white/30">No client accounts yet</p>
            <Link href="/admin/tenants" className="mt-4 inline-flex items-center gap-1.5 text-xs text-amber-400 hover:text-amber-300">
              Go to Clients <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
            {list.map((tenant, i) => {
              const sub = tenant.subscriptions?.[0];
              const planName = sub?.subscription_plans?.name ?? "No Plan";
              const subStatus = sub?.status ?? null;
              const isActive = tenant.is_active !== false;
              const keys = tenant.tenant_api_keys ?? [];
              const activeKeys = keys.filter((k) => k.is_active !== false);
              const providers = [...new Set(activeKeys.map((k) => k.provider))];

              const avatarColors = [
                "bg-violet-600/20 text-violet-400", "bg-cyan-600/20 text-cyan-400",
                "bg-emerald-600/20 text-emerald-400", "bg-amber-600/20 text-amber-400",
                "bg-pink-600/20 text-pink-400", "bg-indigo-600/20 text-indigo-400",
              ];

              const providerIcons: Record<string, string> = {
                openai: "🤖", whatsapp: "💬", twilio: "📞", smtp: "📧", meta: "📘",
              };

              return (
                <div key={tenant.id} className="glass-card p-5">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-xl ${avatarColors[i % avatarColors.length]} flex items-center justify-center text-lg font-bold shrink-0`}>
                        {tenant.name[0]}
                      </div>
                      <div>
                        <div className="text-sm font-bold text-white">{tenant.name}</div>
                        <div className="text-xs text-white/30">{tenant.email ?? tenant.slug}</div>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-1">
                      <span className={`px-2 py-0.5 rounded-full text-xs border ${isActive ? "text-emerald-400 bg-emerald-500/10 border-emerald-500/20" : "text-white/30 bg-white/5 border-white/10"}`}>
                        {isActive ? "Active" : "Inactive"}
                      </span>
                      <span className="text-[10px] text-violet-400 font-semibold">{planName}</span>
                    </div>
                  </div>

                  {/* API Key providers */}
                  <div className="mb-4">
                    <div className="text-[10px] text-white/30 font-semibold uppercase tracking-wider mb-2 flex items-center gap-1.5">
                      <Key className="w-3 h-3" />
                      API Keys ({activeKeys.length} configured)
                    </div>
                    {providers.length === 0 ? (
                      <div className="flex items-center gap-1.5 text-xs text-amber-400/70">
                        <AlertCircle className="w-3.5 h-3.5" />
                        No API keys configured
                      </div>
                    ) : (
                      <div className="flex flex-wrap gap-1.5">
                        {providers.map((p) => (
                          <span key={p} className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-white/5 border border-white/10 text-xs text-white/60">
                            {providerIcons[p] ?? "🔑"} {p}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Setup status */}
                  <div className="flex items-center justify-between">
                    <div className={`flex items-center gap-1.5 text-xs ${tenant.is_setup_complete ? "text-emerald-400" : "text-amber-400"}`}>
                      {tenant.is_setup_complete ? (
                        <><CheckCircle2 className="w-3.5 h-3.5" /> Setup Complete</>
                      ) : (
                        <><XCircle className="w-3.5 h-3.5" /> Setup Incomplete</>
                      )}
                    </div>
                    <Link
                      href={`/admin/tenants`}
                      className="flex items-center gap-1 text-xs text-amber-400 hover:text-amber-300 transition-colors"
                    >
                      Manage <ArrowRight className="w-3 h-3" />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
