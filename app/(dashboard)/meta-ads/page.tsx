import Header from "@/components/dashboard/Header";
import StatsCard from "@/components/dashboard/StatsCard";
import { BarChart3, DollarSign, TrendingUp, Target, Plus, Link2 } from "lucide-react";

const campaigns = [
  { name: "Summer Collection - Retargeting", platform: "Instagram", budget: 150, spent: 92.40, impressions: 45200, clicks: 1840, conversions: 38, roas: 5.2, status: "active" },
  { name: "Lead Gen - B2B Decision Makers", platform: "Facebook", budget: 200, spent: 200, impressions: 68000, clicks: 2100, conversions: 52, roas: 4.1, status: "completed" },
  { name: "App Install Campaign", platform: "Instagram", budget: 100, spent: 41.20, impressions: 22000, clicks: 890, conversions: 18, roas: 3.8, status: "active" },
  { name: "Brand Awareness - Q2", platform: "Facebook", budget: 500, spent: 320.80, impressions: 185000, clicks: 4200, conversions: 91, roas: 6.1, status: "active" },
];

export default function MetaAdsPage() {
  return (
    <div>
      <Header
        title="Meta Ads AI"
        subtitle="AI-managed Facebook & Instagram ad campaigns"
        action={
          <button className="btn-primary text-sm py-2 px-4">
            <Plus className="w-4 h-4" />
            Create Campaign
          </button>
        }
      />
      <div className="p-6 space-y-6">
        {/* Connect CTA if not connected */}
        <div className="glass-card p-6 bg-gradient-to-br from-blue-600/10 to-transparent border border-blue-500/20">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-600/20 flex items-center justify-center">
                <span className="text-xl">📘</span>
              </div>
              <div>
                <h3 className="text-sm font-semibold text-white">Meta Ads Account</h3>
                <p className="text-xs text-white/40">Connect your Facebook & Instagram ad account to enable AI management</p>
              </div>
            </div>
            <button className="btn-primary text-sm py-2 px-4">
              <Link2 className="w-4 h-4" />
              Connect Meta
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
          <StatsCard title="Total Ad Spend" value="$654.40" change={-5.2} icon={DollarSign} iconColor="text-violet-400" iconBg="bg-violet-600/20" />
          <StatsCard title="Avg ROAS" value="4.8x" change={18.3} icon={TrendingUp} iconColor="text-emerald-400" iconBg="bg-emerald-600/20" />
          <StatsCard title="Conversions" value="199" change={12.5} icon={Target} iconColor="text-cyan-400" iconBg="bg-cyan-600/20" />
          <StatsCard title="Total Impressions" value="320.2K" change={22} icon={BarChart3} iconColor="text-amber-400" iconBg="bg-amber-600/20" />
        </div>

        <div className="glass-card p-6">
          <h2 className="text-base font-semibold text-white mb-5">Active Campaigns</h2>
          <div className="space-y-3">
            {campaigns.map((c) => (
              <div key={c.name} className="p-4 rounded-xl bg-white/3 border border-white/5 hover:border-white/10 transition-all">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <div className="text-sm font-medium text-white">{c.name}</div>
                    <div className="text-xs text-white/40 mt-0.5 flex items-center gap-2">
                      <span>{c.platform}</span>
                      <span className={`px-2 py-0.5 rounded-full border text-xs ${c.status === "active" ? "border-emerald-500/20 text-emerald-400 bg-emerald-500/10" : "border-white/10 text-white/30"}`}>
                        {c.status}
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-bold text-emerald-400">{c.roas}x ROAS</div>
                    <div className="text-xs text-white/30">${c.spent.toFixed(2)} / ${c.budget}</div>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-4 text-xs text-white/40">
                  <div><span className="text-white/60">{c.impressions.toLocaleString()}</span> impressions</div>
                  <div><span className="text-white/60">{c.clicks.toLocaleString()}</span> clicks</div>
                  <div><span className="text-white/60">{c.conversions}</span> conversions</div>
                </div>
                <div className="mt-3 h-1.5 bg-white/10 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-blue-600 to-violet-500 rounded-full" style={{ width: `${(c.spent / c.budget) * 100}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
