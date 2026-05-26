import Header from "@/components/dashboard/Header";
import { FileText, Edit3, Eye, Plus, Globe, Home, Info, Phone } from "lucide-react";

const pages = [
  { slug: "home", title: "Home Page", icon: Home, lastUpdated: "2025-05-20", status: "published", sections: 8 },
  { slug: "features", title: "Features Page", icon: Globe, lastUpdated: "2025-05-18", status: "published", sections: 9 },
  { slug: "pricing", title: "Pricing Page", icon: FileText, lastUpdated: "2025-05-22", status: "published", sections: 4 },
  { slug: "about", title: "About Us", icon: Info, lastUpdated: "2025-05-15", status: "published", sections: 6 },
  { slug: "contact", title: "Contact Page", icon: Phone, lastUpdated: "2025-05-10", status: "published", sections: 3 },
  { slug: "blog", title: "Blog", icon: FileText, lastUpdated: "2025-05-25", status: "draft", sections: 0 },
];

export default function AdminContentPage() {
  return (
    <div>
      <Header
        title="CMS Content"
        subtitle="Manage marketing website pages and content"
        action={
          <button className="btn-primary text-sm py-2 px-4">
            <Plus className="w-4 h-4" />
            New Page
          </button>
        }
      />

      <div className="p-6 space-y-6">
        {/* Pages grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {pages.map((page) => (
            <div key={page.slug} className="glass-card p-5">
              <div className="flex items-start justify-between mb-4">
                <div className="w-10 h-10 rounded-xl bg-violet-600/20 flex items-center justify-center">
                  <page.icon className="w-5 h-5 text-violet-400" />
                </div>
                <span className={`text-xs px-2.5 py-1 rounded-full border capitalize ${
                  page.status === "published"
                    ? "text-emerald-400 bg-emerald-500/10 border-emerald-500/20"
                    : "text-white/30 bg-white/5 border-white/10"
                }`}>
                  {page.status}
                </span>
              </div>
              <h3 className="text-sm font-semibold text-white mb-1">{page.title}</h3>
              <div className="flex items-center gap-3 text-xs text-white/30 mb-4">
                <span>/{page.slug}</span>
                <span>·</span>
                <span>{page.sections} sections</span>
                <span>·</span>
                <span>{page.lastUpdated}</span>
              </div>
              <div className="flex gap-2">
                <button className="flex-1 flex items-center justify-center gap-1.5 py-2 text-xs border border-white/10 text-white/40 rounded-lg hover:bg-white/5 transition-all">
                  <Eye className="w-3.5 h-3.5" />
                  Preview
                </button>
                <button className="flex-1 flex items-center justify-center gap-1.5 py-2 text-xs border border-violet-500/30 text-violet-400 rounded-lg hover:bg-violet-600/10 transition-all">
                  <Edit3 className="w-3.5 h-3.5" />
                  Edit
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Content editor panel */}
        <div className="glass-card p-6">
          <h2 className="text-base font-semibold text-white mb-5">Homepage Hero Content</h2>
          <div className="space-y-4 max-w-2xl">
            <div>
              <label className="block text-sm font-medium text-white/60 mb-1.5">Hero Headline</label>
              <input type="text" defaultValue="Your Business on Autopilot with AI" className="input-dark text-lg font-bold" />
            </div>
            <div>
              <label className="block text-sm font-medium text-white/60 mb-1.5">Hero Sub-headline</label>
              <textarea rows={3} defaultValue="One platform to run your entire business with AI. CRM, WhatsApp automation, bulk campaigns, AI website builder, voice bots, Meta ads — all in one place." className="input-dark resize-none" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-white/60 mb-1.5">Primary CTA Text</label>
                <input type="text" defaultValue="Start Free 14-Day Trial" className="input-dark" />
              </div>
              <div>
                <label className="block text-sm font-medium text-white/60 mb-1.5">Primary CTA Link</label>
                <input type="text" defaultValue="/signup" className="input-dark" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-white/60 mb-1.5">Trust Line (below CTA)</label>
              <input type="text" defaultValue="No credit card required · Cancel anytime · Setup in 5 minutes" className="input-dark" />
            </div>
            <div className="flex gap-3 pt-2">
              <button className="btn-secondary text-sm py-2 px-5">Preview Changes</button>
              <button className="btn-primary text-sm py-2 px-5">Publish Changes</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
