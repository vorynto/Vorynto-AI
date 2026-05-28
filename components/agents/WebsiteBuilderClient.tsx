"use client";

import { useState } from "react";
import { mutationClient } from "@/lib/supabase/client";
import { useRealtimeTable } from "@/lib/hooks/useRealtimeTable";
import {
  Globe, Plus, Eye, Edit3, Trash2, ExternalLink, CheckCircle2,
  Loader2, Wifi, WifiOff, Zap,
} from "lucide-react";

type Website = {
  id: string;
  tenant_id: string;
  name: string;
  subdomain: string | null;
  custom_domain: string | null;
  template_id: string | null;
  is_published: boolean | null;
  published_at: string | null;
  created_at: string | null;
  updated_at: string | null;
};

type Props = {
  tenantId: string;
  initialWebsites: Website[];
};

const templates = [
  { id: "business-pro", name: "Business Pro", category: "Business", preview: "🏢", desc: "Professional business website" },
  { id: "saas-launch", name: "SaaS Launch", category: "SaaS", preview: "🚀", desc: "High-converting product pages" },
  { id: "ecommerce", name: "E-commerce", category: "Shop", preview: "🛍️", desc: "Online store with catalog" },
  { id: "restaurant", name: "Restaurant", category: "Food", preview: "🍽️", desc: "Menu, reservations & delivery" },
  { id: "portfolio", name: "Portfolio", category: "Creative", preview: "🎨", desc: "Showcase your work" },
  { id: "real-estate", name: "Real Estate", category: "Property", preview: "🏠", desc: "Listings and inquiry forms" },
];

export default function WebsiteBuilderClient({ tenantId, initialWebsites }: Props) {
  const { data: websites, connected } = useRealtimeTable<Website>(
    "website_builder_projects", tenantId, initialWebsites
  );

  const [aiPrompt, setAiPrompt] = useState("");
  const [generating, setGenerating] = useState(false);
  const [showCreate, setShowCreate] = useState(false);
  const [newSite, setNewSite] = useState({ name: "", template_id: "" });
  const [creating, setCreating] = useState(false);
  const [publishing, setPublishing] = useState<string | null>(null);

  async function generateWithAI() {
    if (!aiPrompt.trim()) return;
    setGenerating(true);
    // In production: call AI API to generate website structure
    await new Promise((r) => setTimeout(r, 2500));
    const db = mutationClient();
    const name = aiPrompt.split(" ").slice(0, 4).join(" ");
    await db.from("website_builder_projects").insert({
      tenant_id: tenantId,
      name,
      subdomain: name.toLowerCase().replace(/\s+/g, "-").slice(0, 30),
      template_id: "ai-generated",
      is_published: false,
      page_data: { ai_prompt: aiPrompt, generated_at: new Date().toISOString() },
    });
    setAiPrompt("");
    setGenerating(false);
  }

  async function createFromTemplate(templateId: string) {
    setCreating(true);
    const template = templates.find((t) => t.id === templateId);
    const db = mutationClient();
    await db.from("website_builder_projects").insert({
      tenant_id: tenantId,
      name: `${template?.name ?? "New"} Website`,
      subdomain: `site-${Date.now()}`,
      template_id: templateId,
      is_published: false,
    });
    setCreating(false);
  }

  async function togglePublish(id: string, current: boolean | null) {
    setPublishing(id);
    const db = mutationClient();
    await db.from("website_builder_projects").update({
      is_published: !current,
      published_at: !current ? new Date().toISOString() : null,
    }).eq("id", id);
    setPublishing(null);
  }

  async function deleteWebsite(id: string) {
    const db = mutationClient();
    await db.from("website_builder_projects").delete().eq("id", id);
  }

  return (
    <div>
      <div className="p-6 space-y-6">
        {/* AI Generate */}
        <div className="glass-card p-6 bg-gradient-to-br from-amber-600/10 to-transparent border-amber-500/20">
          <div className="flex items-center gap-2 mb-2">
            <Zap className="w-4 h-4 text-amber-400" />
            <h2 className="text-base font-semibold text-white">Generate with AI</h2>
          </div>
          <p className="text-sm text-white/40 mb-4">
            Describe your business and let AI create your complete website in seconds.
          </p>
          <div className="flex gap-3">
            <input
              type="text"
              placeholder="e.g., 'I run a digital marketing agency in Dubai specializing in social media and SEO...'"
              value={aiPrompt}
              onChange={(e) => setAiPrompt(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && generateWithAI()}
              className="input-dark flex-1"
            />
            <button
              onClick={generateWithAI}
              disabled={generating || !aiPrompt.trim()}
              className="btn-primary text-sm py-2 px-5 whitespace-nowrap flex items-center gap-2"
            >
              {generating ? <><Loader2 className="w-4 h-4 animate-spin" /> Generating…</> : "Generate Website"}
            </button>
          </div>
        </div>

        {/* Live status */}
        <div className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/3 border border-white/5 w-fit">
          {connected ? (
            <><Wifi className="w-3.5 h-3.5 text-emerald-400" /><span className="text-xs text-emerald-400">Live — websites update in realtime</span></>
          ) : (
            <><WifiOff className="w-3.5 h-3.5 text-white/20" /><span className="text-xs text-white/30">Connecting…</span></>
          )}
        </div>

        {/* Existing websites */}
        {websites.length > 0 && (
          <div className="space-y-3">
            <h2 className="text-base font-semibold text-white">Your Websites</h2>
            {websites.map((site) => {
              const url = site.custom_domain ?? (site.subdomain ? `${site.subdomain}.vorynto.site` : null);
              return (
                <div key={site.id} className="glass-card p-5 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-violet-600/20 flex items-center justify-center">
                      <Globe className="w-6 h-6 text-violet-400" />
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-white">{site.name}</div>
                      <div className="flex items-center gap-3 mt-1">
                        {url && (
                          <a href={`https://${url}`} target="_blank" rel="noopener noreferrer" className="text-xs text-violet-400 hover:text-violet-300 flex items-center gap-1">
                            {url}
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        )}
                        {site.template_id && (
                          <>
                            <span className="text-xs text-white/30">·</span>
                            <span className="text-xs text-white/30 capitalize">{site.template_id.replace("-", " ")}</span>
                          </>
                        )}
                        {site.updated_at && (
                          <>
                            <span className="text-xs text-white/30">·</span>
                            <span className="text-xs text-white/30">Updated {new Date(site.updated_at).toLocaleDateString()}</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full border ${site.is_published ? "border-emerald-500/20 bg-emerald-500/10 text-emerald-400" : "border-white/10 bg-white/3 text-white/30"}`}>
                      {site.is_published && <CheckCircle2 className="w-3 h-3" />}
                      {site.is_published ? "Published" : "Draft"}
                    </span>
                    <button className="flex items-center gap-1.5 px-3 py-1.5 text-xs border border-white/10 text-white/50 rounded-lg hover:bg-white/5 transition-all">
                      <Eye className="w-3.5 h-3.5" /> Preview
                    </button>
                    <button className="flex items-center gap-1.5 px-3 py-1.5 text-xs border border-violet-500/30 text-violet-400 rounded-lg hover:bg-violet-600/10 transition-all">
                      <Edit3 className="w-3.5 h-3.5" /> Edit
                    </button>
                    <button
                      onClick={() => togglePublish(site.id, site.is_published)}
                      disabled={publishing === site.id}
                      className={`px-3 py-1.5 text-xs rounded-lg transition-all border ${site.is_published ? "border-amber-500/20 text-amber-400 hover:bg-amber-600/10" : "border-emerald-500/20 text-emerald-400 hover:bg-emerald-600/10"}`}
                    >
                      {publishing === site.id ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : site.is_published ? "Unpublish" : "Publish"}
                    </button>
                    <button
                      onClick={() => deleteWebsite(site.id)}
                      className="w-8 h-8 rounded-lg hover:bg-red-500/10 flex items-center justify-center text-white/20 hover:text-red-400 transition-all"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Templates */}
        <div>
          <h2 className="text-base font-semibold text-white mb-4">Start from Template</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-6 gap-3">
            {templates.map((t) => (
              <button
                key={t.id}
                onClick={() => createFromTemplate(t.id)}
                disabled={creating}
                className="glass-card-hover p-4 text-center group"
              >
                <div className="text-3xl mb-2">{t.preview}</div>
                <div className="text-xs font-semibold text-white mb-0.5">{t.name}</div>
                <div className="text-xs text-white/30">{t.category}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Empty state */}
        {websites.length === 0 && (
          <div className="glass-card p-10 text-center">
            <Globe className="w-12 h-12 text-white/10 mx-auto mb-3" />
            <p className="text-sm text-white/30 mb-2">No websites yet</p>
            <p className="text-xs text-white/20">Use AI generation above or pick a template to get started</p>
          </div>
        )}
      </div>
    </div>
  );
}
