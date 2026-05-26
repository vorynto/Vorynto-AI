import Header from "@/components/dashboard/Header";
import { Globe, Plus, Eye, Edit3, Trash2, ExternalLink, CheckCircle2 } from "lucide-react";

const websites = [
  { name: "Acme Corp Main Site", url: "acmecorp.vorynto.site", status: "published", pages: 8, lastEdit: "2h ago", template: "Business Pro" },
  { name: "Product Landing Page", url: "launch.acmecorp.com", status: "published", pages: 3, lastEdit: "1d ago", template: "SaaS Launch" },
  { name: "Blog & Resources", url: "blog.acmecorp.com", status: "draft", pages: 12, lastEdit: "3d ago", template: "Content Hub" },
];

const templates = [
  { name: "Business Pro", category: "Business", preview: "🏢", desc: "Professional business website" },
  { name: "SaaS Launch", category: "SaaS", preview: "🚀", desc: "High-converting product pages" },
  { name: "E-commerce", category: "Shop", preview: "🛍️", desc: "Online store with catalog" },
  { name: "Restaurant", category: "Food", preview: "🍽️", desc: "Menu, reservations & delivery" },
  { name: "Portfolio", category: "Creative", preview: "🎨", desc: "Showcase your work" },
  { name: "Real Estate", category: "Property", preview: "🏠", desc: "Listings and inquiry forms" },
];

export default function WebsiteBuilderPage() {
  return (
    <div>
      <Header
        title="AI Website Builder"
        subtitle="Build and manage websites with AI"
        action={
          <button className="btn-primary text-sm py-2 px-4">
            <Plus className="w-4 h-4" />
            New Website
          </button>
        }
      />
      <div className="p-6 space-y-6">
        {/* AI Generate prompt */}
        <div className="glass-card p-6 bg-gradient-to-br from-amber-600/10 to-transparent border-amber-500/20">
          <h2 className="text-base font-semibold text-white mb-2">⚡ Generate with AI</h2>
          <p className="text-sm text-white/40 mb-4">Describe your business and let AI create your complete website in seconds.</p>
          <div className="flex gap-3">
            <input
              type="text"
              placeholder="e.g., 'I run a digital marketing agency in Dubai specializing in social media and SEO...'"
              className="input-dark flex-1"
            />
            <button className="btn-primary text-sm py-2 px-5 whitespace-nowrap">Generate Website</button>
          </div>
        </div>

        {/* Existing websites */}
        <div className="space-y-3">
          <h2 className="text-base font-semibold text-white">Your Websites</h2>
          {websites.map((site) => (
            <div key={site.name} className="glass-card p-5 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-violet-600/20 flex items-center justify-center">
                  <Globe className="w-6 h-6 text-violet-400" />
                </div>
                <div>
                  <div className="text-sm font-semibold text-white">{site.name}</div>
                  <div className="flex items-center gap-3 mt-1">
                    <a href="#" className="text-xs text-violet-400 hover:text-violet-300 flex items-center gap-1">
                      {site.url}
                      <ExternalLink className="w-3 h-3" />
                    </a>
                    <span className="text-xs text-white/30">·</span>
                    <span className="text-xs text-white/30">{site.pages} pages</span>
                    <span className="text-xs text-white/30">·</span>
                    <span className="text-xs text-white/30">Edited {site.lastEdit}</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className={`flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full border ${site.status === "published" ? "border-emerald-500/20 bg-emerald-500/10 text-emerald-400" : "border-white/10 bg-white/3 text-white/30"}`}>
                  {site.status === "published" && <CheckCircle2 className="w-3 h-3" />}
                  {site.status}
                </span>
                <button className="flex items-center gap-1.5 px-3 py-1.5 text-xs border border-white/10 text-white/50 rounded-lg hover:bg-white/5 transition-all">
                  <Eye className="w-3.5 h-3.5" />
                  Preview
                </button>
                <button className="flex items-center gap-1.5 px-3 py-1.5 text-xs border border-violet-500/30 text-violet-400 rounded-lg hover:bg-violet-600/10 transition-all">
                  <Edit3 className="w-3.5 h-3.5" />
                  Edit
                </button>
                <button className="w-8 h-8 rounded-lg hover:bg-red-500/10 flex items-center justify-center text-white/20 hover:text-red-400 transition-all">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Templates */}
        <div>
          <h2 className="text-base font-semibold text-white mb-4">Start from Template</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-6 gap-3">
            {templates.map((t) => (
              <button key={t.name} className="glass-card-hover p-4 text-center group">
                <div className="text-3xl mb-2">{t.preview}</div>
                <div className="text-xs font-semibold text-white mb-0.5">{t.name}</div>
                <div className="text-xs text-white/30">{t.category}</div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
