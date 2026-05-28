"use client";

import { useState } from "react";
import { mutationClient } from "@/lib/supabase/client";
import { useRealtimeTable } from "@/lib/hooks/useRealtimeTable";
import StatsCard from "@/components/dashboard/StatsCard";
import {
  Search, TrendingUp, AlertCircle, Globe, Plus,
  ArrowUp, ArrowDown, Minus, Wifi, WifiOff, Loader2,
} from "lucide-react";

type SEOProject = {
  id: string;
  tenant_id: string;
  name: string;
  website_url: string;
  audit_score: number | null;
  last_audit_at: string | null;
  target_keywords: string[] | null;
  is_active: boolean | null;
};

type SEOKeyword = {
  id: string;
  tenant_id: string;
  project_id: string;
  keyword: string;
  current_position: number | null;
  change_7d: number | null;
  monthly_volume: number | null;
  difficulty: number | null;
  updated_at: string | null;
};

type Props = {
  tenantId: string;
  initialProjects: SEOProject[];
  initialKeywords: SEOKeyword[];
};

const issues = [
  { type: "error", count: 0, label: "Broken internal links" },
  { type: "warning", count: 0, label: "Missing meta descriptions" },
  { type: "warning", count: 0, label: "Images missing alt text" },
  { type: "info", count: 0, label: "Pages with thin content" },
];

export default function SEOClient({ tenantId, initialProjects, initialKeywords }: Props) {
  const { data: projects, connected } = useRealtimeTable<SEOProject>(
    "seo_projects", tenantId, initialProjects
  );
  const { data: keywords } = useRealtimeTable<SEOKeyword>(
    "seo_keywords", tenantId, initialKeywords
  );

  const [selectedProject, setSelectedProject] = useState<SEOProject | null>(
    initialProjects[0] ?? null
  );
  const [showAdd, setShowAdd] = useState(false);
  const [newProject, setNewProject] = useState({ name: "", website_url: "" });
  const [adding, setAdding] = useState(false);
  const [auditing, setAuditing] = useState(false);

  const projectKeywords = keywords.filter((k) => k.project_id === selectedProject?.id);
  const avgPosition = projectKeywords.length
    ? Math.round(projectKeywords.reduce((a, k) => a + (k.current_position ?? 0), 0) / projectKeywords.length)
    : 0;
  const score = selectedProject?.audit_score ?? 0;

  async function addProject() {
    if (!newProject.name.trim() || !newProject.website_url.trim()) return;
    setAdding(true);
    const db = mutationClient();
    const { data } = await db
      .from("seo_projects")
      .insert({
        tenant_id: tenantId,
        name: newProject.name,
        website_url: newProject.website_url,
        is_active: true,
      })
      .select()
      .maybeSingle();
    if (data) setSelectedProject(data as SEOProject);
    setNewProject({ name: "", website_url: "" });
    setShowAdd(false);
    setAdding(false);
  }

  async function runAudit() {
    if (!selectedProject) return;
    setAuditing(true);
    // Simulate audit — in production this calls your SEO API
    await new Promise((r) => setTimeout(r, 2000));
    const db = mutationClient();
    const fakeScore = Math.floor(Math.random() * 30) + 65;
    await db
      .from("seo_projects")
      .update({ audit_score: fakeScore, last_audit_at: new Date().toISOString() })
      .eq("id", selectedProject.id);
    setAuditing(false);
  }

  return (
    <div>
      <div className="p-6 space-y-6">
        {/* Stats */}
        <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
          <StatsCard title="SEO Score" value={score ? `${score}/100` : "—"} icon={Search} iconColor="text-violet-400" iconBg="bg-violet-600/20" />
          <StatsCard title="Keywords Tracked" value={projectKeywords.length.toString()} icon={TrendingUp} iconColor="text-emerald-400" iconBg="bg-emerald-600/20" />
          <StatsCard title="Avg Position" value={avgPosition ? `#${avgPosition}` : "—"} icon={Globe} iconColor="text-cyan-400" iconBg="bg-cyan-600/20" />
          <StatsCard title="Issues Found" value={issues.reduce((a, i) => a + i.count, 0).toString()} icon={AlertCircle} iconColor="text-amber-400" iconBg="bg-amber-600/20" />
        </div>

        {/* Projects bar */}
        <div className="flex items-center gap-3 flex-wrap">
          {projects.map((p) => (
            <button
              key={p.id}
              onClick={() => setSelectedProject(p)}
              className={`flex items-center gap-2 px-3 py-2 rounded-xl text-sm transition-all ${
                selectedProject?.id === p.id
                  ? "bg-violet-600/20 border border-violet-500/30 text-violet-300"
                  : "border border-white/10 text-white/40 hover:border-white/20 hover:text-white/60"
              }`}
            >
              <Globe className="w-3.5 h-3.5" />
              {p.name}
              {p.audit_score && (
                <span className={`text-xs font-bold ${p.audit_score >= 80 ? "text-emerald-400" : p.audit_score >= 60 ? "text-amber-400" : "text-red-400"}`}>
                  {p.audit_score}
                </span>
              )}
            </button>
          ))}
          <button
            onClick={() => setShowAdd(!showAdd)}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm border border-dashed border-white/10 text-white/30 hover:border-violet-500/30 hover:text-violet-400 transition-all"
          >
            <Plus className="w-3.5 h-3.5" /> Add Project
          </button>
          <div className="ml-auto flex items-center gap-1.5">
            {connected ? (
              <><Wifi className="w-3.5 h-3.5 text-emerald-400" /><span className="text-xs text-emerald-400">Live</span></>
            ) : (
              <><WifiOff className="w-3.5 h-3.5 text-white/20" /><span className="text-xs text-white/30">Offline</span></>
            )}
          </div>
        </div>

        {/* Add project form */}
        {showAdd && (
          <div className="glass-card p-4 border-violet-500/20">
            <div className="flex gap-3">
              <input
                type="text"
                placeholder="Project name (e.g. Main Website)"
                value={newProject.name}
                onChange={(e) => setNewProject({ ...newProject, name: e.target.value })}
                className="input-dark text-sm flex-1"
              />
              <input
                type="url"
                placeholder="https://yoursite.com"
                value={newProject.website_url}
                onChange={(e) => setNewProject({ ...newProject, website_url: e.target.value })}
                className="input-dark text-sm flex-1"
              />
              <button onClick={addProject} disabled={adding} className="btn-primary text-sm py-2 px-4 whitespace-nowrap">
                {adding ? "Adding…" : "Add Project"}
              </button>
            </div>
          </div>
        )}

        {selectedProject ? (
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
            {/* Score gauge */}
            <div className="glass-card p-6 text-center">
              <h2 className="text-sm font-semibold text-white mb-4">Site Health Score</h2>
              <div className="relative w-36 h-36 mx-auto mb-4">
                <svg viewBox="0 0 120 120" className="w-full h-full -rotate-90">
                  <circle cx="60" cy="60" r="50" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="12" />
                  <circle
                    cx="60" cy="60" r="50" fill="none" stroke="url(#scoreGrad)" strokeWidth="12"
                    strokeDasharray={`${2 * Math.PI * 50 * (score / 100)} ${2 * Math.PI * 50 * (1 - score / 100)}`}
                    strokeLinecap="round"
                  />
                  <defs>
                    <linearGradient id="scoreGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#7c3aed" />
                      <stop offset="100%" stopColor="#06b6d4" />
                    </linearGradient>
                  </defs>
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div>
                    <div className="text-3xl font-bold gradient-text">{score || "?"}</div>
                    <div className="text-xs text-white/30">/ 100</div>
                  </div>
                </div>
              </div>
              <div className={`text-xs mb-4 ${score >= 80 ? "text-emerald-400" : score >= 60 ? "text-amber-400" : "text-red-400"}`}>
                {score >= 80 ? "Good" : score >= 60 ? "Needs improvement" : "Poor"}
                {selectedProject.last_audit_at && ` · Audited ${new Date(selectedProject.last_audit_at).toLocaleDateString()}`}
              </div>
              <button
                onClick={runAudit}
                disabled={auditing}
                className="btn-primary w-full text-sm py-2 flex items-center justify-center gap-2"
              >
                {auditing ? <><Loader2 className="w-4 h-4 animate-spin" /> Auditing…</> : "Run Audit"}
              </button>
            </div>

            {/* Issues */}
            <div className="glass-card p-6">
              <h2 className="text-sm font-semibold text-white mb-4">Site Issues</h2>
              <div className="space-y-3">
                {issues.map((issue) => (
                  <div key={issue.label} className="flex items-center justify-between p-3 rounded-xl bg-white/3">
                    <div className="flex items-center gap-2">
                      <AlertCircle className={`w-4 h-4 shrink-0 ${issue.type === "error" ? "text-red-400" : issue.type === "warning" ? "text-amber-400" : "text-blue-400"}`} />
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

            {/* AI content ideas */}
            <div className="glass-card p-6">
              <h2 className="text-sm font-semibold text-white mb-4">AI Content Ideas</h2>
              <div className="space-y-3">
                {[
                  "10 Ways AI CRM Boosts Sales Productivity",
                  "WhatsApp Business API: Complete Setup Guide",
                  "How to Run Bulk Campaigns Legally",
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
        ) : null}

        {/* Keywords table */}
        <div className="glass-card p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-base font-semibold text-white">
              Keyword Rankings
              {selectedProject && <span className="ml-2 text-xs text-white/30 font-normal">— {selectedProject.name}</span>}
            </h2>
          </div>
          {projectKeywords.length === 0 ? (
            <div className="py-10 text-center">
              <Search className="w-10 h-10 text-white/10 mx-auto mb-3" />
              <p className="text-sm text-white/30">
                {selectedProject ? "No keywords tracked yet" : "Select a project to view keywords"}
              </p>
            </div>
          ) : (
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/5">
                  {["Keyword", "Position", "Change", "Monthly Volume", "Difficulty"].map((h) => (
                    <th key={h} className="text-left py-2 px-3 text-xs font-medium text-white/30 first:pl-0">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {projectKeywords.map((kw) => (
                  <tr key={kw.id} className="hover:bg-white/2 transition-colors">
                    <td className="py-3 pl-0 pr-3 text-sm text-white">{kw.keyword}</td>
                    <td className="py-3 px-3 text-sm font-bold text-white">
                      {kw.current_position ? `#${kw.current_position}` : "—"}
                    </td>
                    <td className="py-3 px-3">
                      <div className={`flex items-center gap-1 text-xs font-medium ${(kw.change_7d ?? 0) > 0 ? "text-emerald-400" : (kw.change_7d ?? 0) < 0 ? "text-red-400" : "text-white/30"}`}>
                        {(kw.change_7d ?? 0) > 0 ? <ArrowUp className="w-3 h-3" /> : (kw.change_7d ?? 0) < 0 ? <ArrowDown className="w-3 h-3" /> : <Minus className="w-3 h-3" />}
                        {Math.abs(kw.change_7d ?? 0)}
                      </div>
                    </td>
                    <td className="py-3 px-3 text-sm text-white/50">{(kw.monthly_volume ?? 0).toLocaleString()}</td>
                    <td className="py-3 px-3">
                      <div className="flex items-center gap-2">
                        <div className="w-16 h-1.5 bg-white/10 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full ${(kw.difficulty ?? 0) > 65 ? "bg-red-500" : (kw.difficulty ?? 0) > 45 ? "bg-amber-500" : "bg-emerald-500"}`}
                            style={{ width: `${kw.difficulty ?? 0}%` }}
                          />
                        </div>
                        <span className="text-xs text-white/40">{kw.difficulty ?? 0}</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
