"use client";

import { useState } from "react";
import { useRealtimeTable } from "@/lib/hooks/useRealtimeTable";
import StatsCard from "@/components/dashboard/StatsCard";
import {
  BarChart3, DollarSign, TrendingUp, Target,
  Plus, Link2, LinkIcon, Wifi, WifiOff, Edit2, PauseCircle, PlayCircle,
} from "lucide-react";
import { mutationClient } from "@/lib/supabase/client";

type MetaConfig = {
  id: string;
  tenant_id: string;
  is_connected: boolean | null;
  account_name: string | null;
  ad_account_id: string | null;
};

type MetaCampaign = {
  id: string;
  tenant_id: string;
  name: string;
  platform: string | null;
  budget: number | null;
  spent: number | null;
  impressions: number | null;
  clicks: number | null;
  conversions: number | null;
  roas: number | null;
  status: string | null;
  created_at: string | null;
};

type Props = {
  tenantId: string;
  initialConfig: MetaConfig | null;
  initialCampaigns: MetaCampaign[];
};

const statusStyle: Record<string, string> = {
  active: "border-emerald-500/20 text-emerald-400 bg-emerald-500/10",
  paused: "border-amber-500/20 text-amber-400 bg-amber-500/10",
  completed: "border-white/10 text-white/30 bg-white/5",
  draft: "border-violet-500/20 text-violet-400 bg-violet-500/10",
};

export default function MetaAdsClient({ tenantId, initialConfig, initialCampaigns }: Props) {
  const { data: campaigns, connected } = useRealtimeTable<MetaCampaign>(
    "meta_ad_campaigns", tenantId, initialCampaigns
  );

  const [config] = useState<MetaConfig | null>(initialConfig);
  const [showCreate, setShowCreate] = useState(false);
  const [newCampaign, setNewCampaign] = useState({
    name: "",
    platform: "facebook",
    budget: "",
    status: "draft",
  });
  const [creating, setCreating] = useState(false);

  const totalSpend = campaigns.reduce((s, c) => s + (c.spent ?? 0), 0);
  const totalConversions = campaigns.reduce((s, c) => s + (c.conversions ?? 0), 0);
  const avgRoas = campaigns.length
    ? campaigns.reduce((s, c) => s + (c.roas ?? 0), 0) / campaigns.filter((c) => c.roas).length
    : 0;
  const totalImpressions = campaigns.reduce((s, c) => s + (c.impressions ?? 0), 0);

  async function createCampaign() {
    if (!newCampaign.name.trim()) return;
    setCreating(true);
    const db = mutationClient();
    await db.from("meta_ad_campaigns").insert({
      tenant_id: tenantId,
      name: newCampaign.name,
      platform: newCampaign.platform,
      budget: parseFloat(newCampaign.budget) || 0,
      status: "draft",
      spent: 0,
      impressions: 0,
      clicks: 0,
      conversions: 0,
      roas: 0,
    });
    setNewCampaign({ name: "", platform: "facebook", budget: "", status: "draft" });
    setShowCreate(false);
    setCreating(false);
  }

  async function toggleStatus(id: string, current: string | null) {
    const db = mutationClient();
    const next = current === "active" ? "paused" : "active";
    await db.from("meta_ad_campaigns").update({ status: next }).eq("id", id);
  }

  return (
    <div>
      <div className="p-6 space-y-6">
        {/* Meta connection card */}
        <div className={`glass-card p-6 bg-gradient-to-br border ${config?.is_connected ? "from-emerald-600/10 border-emerald-500/20" : "from-blue-600/10 border-blue-500/20"} to-transparent`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${config?.is_connected ? "bg-emerald-600/20" : "bg-blue-600/20"}`}>
                <span className="text-xl">📘</span>
              </div>
              <div>
                <h3 className="text-sm font-semibold text-white">Meta Ads Account</h3>
                <p className="text-xs text-white/40">
                  {config?.is_connected
                    ? `Connected · ${config.account_name ?? config.ad_account_id ?? "Meta Account"}`
                    : "Connect your Facebook & Instagram ad account"}
                </p>
              </div>
            </div>
            <button className={`btn-primary text-sm py-2 px-4 ${config?.is_connected ? "btn-secondary" : ""}`}>
              {config?.is_connected ? <><LinkIcon className="w-4 h-4" /> Reconnect</> : <><Link2 className="w-4 h-4" /> Connect Meta</>}
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
          <StatsCard title="Total Ad Spend" value={`$${totalSpend.toFixed(2)}`} icon={DollarSign} iconColor="text-violet-400" iconBg="bg-violet-600/20" />
          <StatsCard title="Avg ROAS" value={avgRoas ? `${avgRoas.toFixed(1)}x` : "—"} icon={TrendingUp} iconColor="text-emerald-400" iconBg="bg-emerald-600/20" />
          <StatsCard title="Conversions" value={totalConversions.toString()} icon={Target} iconColor="text-cyan-400" iconBg="bg-cyan-600/20" />
          <StatsCard title="Impressions" value={totalImpressions > 1000 ? `${(totalImpressions / 1000).toFixed(1)}K` : totalImpressions.toString()} icon={BarChart3} iconColor="text-amber-400" iconBg="bg-amber-600/20" />
        </div>

        {/* Realtime indicator */}
        <div className="flex items-center justify-between px-4 py-2.5 rounded-xl bg-white/3 border border-white/5">
          <div className="flex items-center gap-2">
            {connected ? (
              <><Wifi className="w-3.5 h-3.5 text-emerald-400" /><span className="text-xs text-emerald-400">Live — campaign stats update in realtime</span></>
            ) : (
              <><WifiOff className="w-3.5 h-3.5 text-white/20" /><span className="text-xs text-white/30">Connecting…</span></>
            )}
          </div>
          <button
            onClick={() => setShowCreate(!showCreate)}
            className="flex items-center gap-1.5 text-xs text-violet-400 hover:text-violet-300 transition-colors"
          >
            <Plus className="w-3.5 h-3.5" /> New Campaign
          </button>
        </div>

        {/* Create campaign form */}
        {showCreate && (
          <div className="glass-card p-5 border-violet-500/20">
            <h3 className="text-sm font-semibold text-white mb-4">Create Campaign</h3>
            <div className="grid grid-cols-3 gap-4 mb-4">
              <div>
                <label className="block text-xs text-white/40 mb-1">Campaign Name</label>
                <input
                  type="text"
                  placeholder="Summer Sale 2026"
                  value={newCampaign.name}
                  onChange={(e) => setNewCampaign({ ...newCampaign, name: e.target.value })}
                  className="input-dark text-sm"
                />
              </div>
              <div>
                <label className="block text-xs text-white/40 mb-1">Platform</label>
                <select
                  value={newCampaign.platform}
                  onChange={(e) => setNewCampaign({ ...newCampaign, platform: e.target.value })}
                  className="input-dark bg-[#0f172a] text-sm"
                >
                  <option value="facebook">Facebook</option>
                  <option value="instagram">Instagram</option>
                  <option value="both">Both</option>
                </select>
              </div>
              <div>
                <label className="block text-xs text-white/40 mb-1">Daily Budget ($)</label>
                <input
                  type="number"
                  placeholder="100"
                  value={newCampaign.budget}
                  onChange={(e) => setNewCampaign({ ...newCampaign, budget: e.target.value })}
                  className="input-dark text-sm"
                />
              </div>
            </div>
            <div className="flex gap-3">
              <button onClick={createCampaign} disabled={creating || !newCampaign.name} className="btn-primary text-sm py-2 px-4">
                {creating ? "Creating…" : "Create Campaign"}
              </button>
              <button onClick={() => setShowCreate(false)} className="btn-secondary text-sm py-2 px-4">Cancel</button>
            </div>
          </div>
        )}

        {/* Campaigns list */}
        <div className="glass-card p-6">
          <h2 className="text-base font-semibold text-white mb-5">
            All Campaigns
            {campaigns.length > 0 && <span className="ml-2 text-xs text-white/30 font-normal">({campaigns.length})</span>}
          </h2>
          {campaigns.length === 0 ? (
            <div className="py-10 text-center">
              <BarChart3 className="w-10 h-10 text-white/10 mx-auto mb-3" />
              <p className="text-sm text-white/30 mb-3">No campaigns yet</p>
              <button onClick={() => setShowCreate(true)} className="btn-primary text-sm py-2 px-4 inline-flex items-center gap-1.5">
                <Plus className="w-4 h-4" /> Create First Campaign
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {campaigns.map((c) => (
                <div key={c.id} className="p-4 rounded-xl bg-white/3 border border-white/5 hover:border-white/10 transition-all">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <div className="text-sm font-medium text-white">{c.name}</div>
                      <div className="text-xs text-white/40 mt-0.5 flex items-center gap-2">
                        <span className="capitalize">{c.platform ?? "facebook"}</span>
                        <span className={`px-2 py-0.5 rounded-full border text-xs ${statusStyle[c.status ?? "draft"]}`}>
                          {c.status ?? "draft"}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="text-right">
                        <div className="text-sm font-bold text-emerald-400">{c.roas ? `${c.roas}x ROAS` : "—"}</div>
                        <div className="text-xs text-white/30">${(c.spent ?? 0).toFixed(2)} / ${c.budget ?? 0}</div>
                      </div>
                      <button
                        onClick={() => toggleStatus(c.id, c.status)}
                        className="w-8 h-8 rounded-lg hover:bg-white/5 flex items-center justify-center text-white/30 hover:text-white/60 transition-colors"
                      >
                        {c.status === "active" ? <PauseCircle className="w-4 h-4" /> : <PlayCircle className="w-4 h-4" />}
                      </button>
                      <button className="w-8 h-8 rounded-lg hover:bg-white/5 flex items-center justify-center text-white/30 hover:text-white/60 transition-colors">
                        <Edit2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-4 text-xs text-white/40 mb-3">
                    <div><span className="text-white/60">{(c.impressions ?? 0).toLocaleString()}</span> impressions</div>
                    <div><span className="text-white/60">{(c.clicks ?? 0).toLocaleString()}</span> clicks</div>
                    <div><span className="text-white/60">{c.conversions ?? 0}</span> conversions</div>
                  </div>
                  {c.budget && (
                    <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-blue-600 to-violet-500 rounded-full transition-all"
                        style={{ width: `${Math.min(((c.spent ?? 0) / c.budget) * 100, 100)}%` }}
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
