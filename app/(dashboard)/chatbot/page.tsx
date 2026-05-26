import Header from "@/components/dashboard/Header";
import StatsCard from "@/components/dashboard/StatsCard";
import { Shield, MessageSquare, Users, TrendingUp, Plus, Copy, CheckCircle2 } from "lucide-react";

export default function ChatbotPage() {
  return (
    <div>
      <Header
        title="Website AI Chatbot"
        subtitle="Embed AI chatbot on any website"
        action={
          <button className="btn-primary text-sm py-2 px-4">
            <Plus className="w-4 h-4" />
            New Chatbot
          </button>
        }
      />
      <div className="p-6 space-y-6">
        <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
          <StatsCard title="Conversations" value="892" change={32} icon={MessageSquare} iconColor="text-violet-400" iconBg="bg-violet-600/20" />
          <StatsCard title="Leads Captured" value="124" change={18} icon={Users} iconColor="text-emerald-400" iconBg="bg-emerald-600/20" />
          <StatsCard title="Resolution Rate" value="71%" change={5} icon={CheckCircle2} iconColor="text-cyan-400" iconBg="bg-cyan-600/20" />
          <StatsCard title="Avg Response" value="1.2s" change={-15} icon={TrendingUp} iconColor="text-amber-400" iconBg="bg-amber-600/20" />
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          {/* Config */}
          <div className="glass-card p-6">
            <h2 className="text-base font-semibold text-white mb-5 flex items-center gap-2">
              <Shield className="w-4 h-4 text-violet-400" />
              Chatbot Configuration
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-white/60 mb-1.5">Bot Name</label>
                <input type="text" defaultValue="Vorynto Support Bot" className="input-dark" />
              </div>
              <div>
                <label className="block text-sm font-medium text-white/60 mb-1.5">Welcome Message</label>
                <textarea rows={2} defaultValue="Hi there! 👋 I'm your AI assistant. How can I help you today?" className="input-dark resize-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-white/60 mb-1.5">Primary Color</label>
                <div className="flex items-center gap-3">
                  <input type="color" defaultValue="#7c3aed" className="w-10 h-10 rounded-lg border border-white/10 cursor-pointer bg-transparent" />
                  <span className="text-sm text-white/40">#7c3aed</span>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-white/60 mb-1.5">Position</label>
                <div className="flex gap-2">
                  {["Bottom Right", "Bottom Left", "Center"].map((pos, i) => (
                    <button key={pos} className={`flex-1 py-2 px-3 text-xs rounded-lg border transition-all ${i === 0 ? "bg-violet-600/20 border-violet-500/30 text-violet-300" : "border-white/10 text-white/30 hover:border-white/20"}`}>
                      {pos}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-white/60 mb-1.5">Training Source</label>
                <div className="space-y-2">
                  {["Website URL crawl", "PDF / documents", "FAQ text", "Custom Q&A"].map((src) => (
                    <div key={src} className="flex items-center justify-between p-3 rounded-lg bg-white/3 border border-white/5">
                      <span className="text-sm text-white/60">{src}</span>
                      <button className="text-xs text-violet-400 hover:text-violet-300">Add</button>
                    </div>
                  ))}
                </div>
              </div>
              <button className="btn-primary w-full text-sm py-2">Save & Deploy</button>
            </div>
          </div>

          {/* Embed code */}
          <div className="space-y-4">
            <div className="glass-card p-6">
              <h2 className="text-base font-semibold text-white mb-4">Embed Code</h2>
              <p className="text-sm text-white/40 mb-4">Add this snippet before the closing <code className="text-violet-400">&lt;/body&gt;</code> tag of your website.</p>
              <div className="relative bg-[#050810] rounded-xl p-4 font-mono text-xs border border-white/5">
                <code className="text-violet-300 leading-relaxed">
                  {`<script>\n  window.VoryntoConfig = {\n    botId: 'bot_abc123xyz',\n    apiKey: 'vk_live_...',\n  };\n</script>\n<script src="https://cdn.vorynto.ai/chatbot.js" async></script>`}
                </code>
                <button className="absolute top-3 right-3 flex items-center gap-1.5 text-xs text-white/30 hover:text-white/60 transition-colors">
                  <Copy className="w-3.5 h-3.5" />
                  Copy
                </button>
              </div>
            </div>

            {/* Preview */}
            <div className="glass-card p-6">
              <h2 className="text-base font-semibold text-white mb-4">Widget Preview</h2>
              <div className="relative bg-[#050810] rounded-xl p-6 border border-white/5 min-h-48 flex items-end justify-end">
                <div className="absolute bottom-6 right-6">
                  <div className="w-72 rounded-2xl bg-[#0a0d1a] border border-violet-500/20 overflow-hidden shadow-2xl shadow-violet-500/20">
                    <div className="p-3 bg-violet-600 flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center text-xs">🤖</div>
                      <span className="text-xs font-medium text-white">Vorynto Support Bot</span>
                      <span className="ml-auto w-2 h-2 bg-emerald-400 rounded-full" />
                    </div>
                    <div className="p-3 space-y-2 min-h-24">
                      <div className="bg-white/5 rounded-xl px-3 py-2 text-xs text-white/60 w-fit">
                        Hi there! 👋 How can I help you today?
                      </div>
                    </div>
                    <div className="p-3 border-t border-white/5">
                      <div className="flex items-center gap-2 bg-white/5 rounded-xl px-3 py-2">
                        <input type="text" placeholder="Type a message..." className="bg-transparent text-xs text-white/40 placeholder:text-white/20 outline-none flex-1" readOnly />
                        <button className="text-violet-400">→</button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
