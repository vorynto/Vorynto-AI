import Header from "@/components/dashboard/Header";
import StatsCard from "@/components/dashboard/StatsCard";
import { Search, TrendingUp, AlertCircle, CheckCircle2, Plus, Globe, ArrowUp, ArrowDown, Minus } from "lucide-react";

const keywords = [
  { keyword: "AI CRM software", position: 4, change: 2, volume: 8100, difficulty: 62 },
  { keyword: "WhatsApp business bot", position: 7, change: -1, volume: 22000, difficulty: 45 },
  { keyword: "bulk WhatsApp campaign", position: 2, change: 5, volume: 5400, difficulty: 38 },
  { keyword: "AI website builder", position: 12, change: 8, volume: 40500, difficulty: 72 },
  { keyword: "voice bot for business", position: 9, change: 0, volume: 3200, difficulty: 41 },
];

const issues = [
  { type: "error", count: 3, label: "Broken internal links" },
  { type: "warning", count: 8, label: "Missing meta descriptions" },
  { type: "warning", count: 5, label: "Images missing alt text" },
  { type: "info", count: 12, label: "Pages with thin content" },
];

export default function SEOPage() {
  return (
    <div>
      <Header
        title="AI SEO"
        subtitle="Audit, track, and improve your search rankings"
        action={
          <button className="btn-primary text-sm py-2 px-4">
            <Plus className="w-4 h-4" />
            Add Project
          </button>
        }
      />
      <div className="p-6 space-y-6">
        <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
          <StatsCard title="SEO Score" value="82/100" change={5} icon={Search} iconColor="text-violet-400" iconBg="bg-violet-600/20" />
          <StatsCard title="Keywords Tracked" value="47" change={12} icon={TrendingUp} iconColor="text-emerald-400" iconBg="bg-emerald-600/20" />
          <StatsCard title="Avg Position" value="6.4" change={2.1} icon={Globe} iconColor="text-cyan-400" iconBg="bg-cyan-600/20" />
          <StatsCard title="Issues Found" value="28" change={-8} icon={AlertCircle} iconColor="text-amber-400" iconBg="bg-amber-600/20" />
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          {/* Score gauge */}
          <div className="glass-card p-6 text-center">
            <h2 className="text-sm font-semibold text-white mb-4">Site Health Score</h2>
            <div className="relative w-36 h-36 mx-auto mb-4">
              <svg viewBox="0 0 120 120" className="w-full h-full -rotate-90">
                <circle cx="60" cy="60" r="50" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="12" />
                <circle cx="60" cy="60" r="50" fill="none" stroke="url(#scoreGrad)" strokeWidth="12"
                  strokeDasharray={`${2 * Math.PI * 50 * 0.82} ${2 * Math.PI * 50 * 0.18}`} strokeLinecap="round" />
                <defs>
                  <linearGradient id="scoreGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#7c3aed" />
                    <stop offset="100%" stopColor="#06b6d4" />
                  </linearGradient>
                </defs>
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <div>
                  <div className="text-3xl font-bold gradient-text">82</div>
                  <div className="text-xs text-white/30">/ 100</div>
                </div>
              </div>
            </div>
            <div className="text-xs text-emerald-400 mb-4">Good · Improved from 77</div>
            <div className="space-y-2">
              {[
                { label: "Performance", score: 88 },
                { label: "SEO", score: 82 },
                { label: "Accessibility", score: 91 },
                { label: "Best Practices", score: 75 },
              ].map((s) => (
                <div key={s.label} className="flex items-center gap-2">
                  <span className="text-xs text-white/40 w-24 text-left">{s.label}</span>
                  <div className="flex-1 h-1.5 bg-white/10 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-violet-600 to-cyan-500 rounded-full" style={{ width: `${s.score}%` }} />
                  </div>
                  <span className="text-xs text-white/60 w-8 text-right">{s.score}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Issues */}
          <div className="glass-card p-6">
            <h2 className="text-sm font-semibold text-white mb-4">Site Issues</h2>
            <div className="space-y-3">
              {issues.map((issue) => (
                <div key={issue.label} className="flex items-center justify-between p-3 rounded-xl bg-white/3">
                  <div className="flex items-center gap-2">
                    {issue.type === "error" ? (
                      <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
                    ) : issue.type === "warning" ? (
                      <AlertCircle className="w-4 h-4 text-amber-400 shrink-0" />
                    ) : (
                      <CheckCircle2 className="w-4 h-4 text-blue-400 shrink-0" />
                    )}
                    <span className="text-sm text-white/60">{issue.label}</span>
                  </div>
                  <span className={`text-sm font-bold ${issue.type === "error" ? "text-red-400" : issue.type === "warning" ? "text-amber-400" : "text-blue-400"}`}>
                    {issue.count}
                  </span>
                </div>
              ))}
            </div>
            <button className="btn-primary w-full mt-4 text-sm py-2">Fix with AI</button>
          </div>

          {/* AI content suggestions */}
          <div className="glass-card p-6">
            <h2 className="text-sm font-semibold text-white mb-4">AI Content Ideas</h2>
            <div className="space-y-3">
              {[
                "10 Ways AI CRM Boosts Sales Productivity",
                "WhatsApp Business API: Complete Setup Guide 2025",
                "How to Run Bulk WhatsApp Campaigns Legally",
                "Voice Bots vs Live Chat: Which Converts Better?",
              ].map((idea, i) => (
                <div key={i} className="p-3 rounded-xl bg-white/3 border border-white/5 hover:border-violet-500/20 cursor-pointer transition-all group">
                  <p className="text-xs text-white/60 group-hover:text-white/80 transition-colors">{idea}</p>
                  <div className="flex items-center gap-1 mt-2 text-xs text-violet-400 opacity-0 group-hover:opacity-100 transition-opacity">
                    Generate content →
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Keywords table */}
        <div className="glass-card p-6">
          <h2 className="text-base font-semibold text-white mb-5">Keyword Rankings</h2>
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/5">
                {["Keyword", "Position", "Change", "Monthly Volume", "Difficulty"].map((h) => (
                  <th key={h} className="text-left py-2 px-3 text-xs font-medium text-white/30 first:pl-0">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {keywords.map((kw) => (
                <tr key={kw.keyword} className="hover:bg-white/2 transition-colors">
                  <td className="py-3 pl-0 pr-3 text-sm text-white">{kw.keyword}</td>
                  <td className="py-3 px-3 text-sm font-bold text-white">#{kw.position}</td>
                  <td className="py-3 px-3">
                    <div className={`flex items-center gap-1 text-xs font-medium ${kw.change > 0 ? "text-emerald-400" : kw.change < 0 ? "text-red-400" : "text-white/30"}`}>
                      {kw.change > 0 ? <ArrowUp className="w-3 h-3" /> : kw.change < 0 ? <ArrowDown className="w-3 h-3" /> : <Minus className="w-3 h-3" />}
                      {Math.abs(kw.change)}
                    </div>
                  </td>
                  <td className="py-3 px-3 text-sm text-white/50">{kw.volume.toLocaleString()}</td>
                  <td className="py-3 px-3">
                    <div className="flex items-center gap-2">
                      <div className="w-16 h-1.5 bg-white/10 rounded-full overflow-hidden">
                        <div className={`h-full rounded-full ${kw.difficulty > 65 ? "bg-red-500" : kw.difficulty > 45 ? "bg-amber-500" : "bg-emerald-500"}`} style={{ width: `${kw.difficulty}%` }} />
                      </div>
                      <span className="text-xs text-white/40">{kw.difficulty}</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
