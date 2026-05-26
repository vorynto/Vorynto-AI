import Header from "@/components/dashboard/Header";
import StatsCard from "@/components/dashboard/StatsCard";
import { Mic, Phone, Clock, TrendingUp, Plus, Play, Pause, Settings } from "lucide-react";

const callLogs = [
  { caller: "+1 (555) 234-5678", duration: "4:32", outcome: "Appointment Booked", time: "10 min ago", sentiment: "positive" },
  { caller: "+44 20 7946 0958", duration: "2:18", outcome: "Inquiry Resolved", time: "1h ago", sentiment: "positive" },
  { caller: "+91 98765 43210", duration: "1:45", outcome: "Transferred to Human", time: "2h ago", sentiment: "neutral" },
  { caller: "+63 917 123 4567", duration: "6:12", outcome: "Support Ticket Created", time: "3h ago", sentiment: "negative" },
  { caller: "+234 80 123 4567", duration: "3:44", outcome: "Appointment Booked", time: "5h ago", sentiment: "positive" },
];

const sentimentConfig: Record<string, string> = {
  positive: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
  neutral: "text-amber-400 bg-amber-500/10 border-amber-500/20",
  negative: "text-red-400 bg-red-500/10 border-red-500/20",
};

export default function VoiceBotPage() {
  return (
    <div>
      <Header
        title="Voice Bot"
        subtitle="AI-powered voice conversations for phone and web"
        action={
          <button className="btn-primary text-sm py-2 px-4">
            <Plus className="w-4 h-4" />
            Configure Voice Bot
          </button>
        }
      />
      <div className="p-6 space-y-6">
        <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
          <StatsCard title="Calls This Month" value="156" change={28} icon={Phone} iconColor="text-pink-400" iconBg="bg-pink-600/20" />
          <StatsCard title="Avg Duration" value="3:42" change={5} icon={Clock} iconColor="text-violet-400" iconBg="bg-violet-600/20" />
          <StatsCard title="Resolution Rate" value="78%" change={12} icon={TrendingUp} iconColor="text-emerald-400" iconBg="bg-emerald-600/20" />
          <StatsCard title="Minutes Used" value="78/100" icon={Mic} iconColor="text-cyan-400" iconBg="bg-cyan-600/20" />
        </div>

        {/* Voice bot config */}
        <div className="glass-card p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-base font-semibold text-white">Voice Bot Configuration</h2>
            <button className="flex items-center gap-1.5 px-3 py-1.5 border border-white/10 rounded-lg text-xs text-white/50 hover:bg-white/5 transition-all">
              <Settings className="w-3.5 h-3.5" />
              Settings
            </button>
          </div>
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-white/60 mb-1.5">Bot Name</label>
                <input type="text" defaultValue="Aria — Your AI Assistant" className="input-dark" />
              </div>
              <div>
                <label className="block text-sm font-medium text-white/60 mb-1.5">Voice</label>
                <select className="input-dark bg-[#0f172a]">
                  <option>Alloy (Neutral)</option>
                  <option>Nova (Female)</option>
                  <option>Onyx (Male)</option>
                  <option>Shimmer (Female, warm)</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-white/60 mb-1.5">Language</label>
                <select className="input-dark bg-[#0f172a]">
                  <option>English (US)</option>
                  <option>English (UK)</option>
                  <option>Spanish</option>
                  <option>Hindi</option>
                  <option>Arabic</option>
                </select>
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-white/60 mb-1.5">Greeting Message</label>
                <textarea
                  rows={3}
                  defaultValue="Hello! Thank you for calling. I'm Aria, your AI assistant. How can I help you today?"
                  className="input-dark resize-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-white/60 mb-1.5">Phone Number</label>
                <div className="flex gap-2">
                  <input type="text" placeholder="+1 (555) 000-0000" defaultValue="+1 (555) 123-4567" className="input-dark flex-1" />
                  <button className="px-3 py-2 text-xs border border-emerald-500/30 text-emerald-400 rounded-lg hover:bg-emerald-600/10 transition-all whitespace-nowrap">Active</button>
                </div>
              </div>
            </div>
          </div>
          <div className="flex gap-3 mt-5">
            <button className="btn-secondary flex items-center gap-2 text-sm py-2 px-4">
              <Play className="w-4 h-4" />
              Test Voice
            </button>
            <button className="btn-primary text-sm py-2 px-4">Save Configuration</button>
          </div>
        </div>

        {/* Call logs */}
        <div className="glass-card p-6">
          <h2 className="text-base font-semibold text-white mb-5">Recent Call Logs</h2>
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/5">
                {["Caller", "Duration", "Outcome", "Sentiment", "Time", ""].map((h) => (
                  <th key={h} className="text-left py-2 px-3 text-xs font-medium text-white/30 first:pl-0">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {callLogs.map((log) => (
                <tr key={log.caller + log.time} className="hover:bg-white/2 transition-colors">
                  <td className="py-3 pl-0 pr-3">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-lg bg-pink-600/20 flex items-center justify-center">
                        <Phone className="w-3.5 h-3.5 text-pink-400" />
                      </div>
                      <span className="text-sm text-white">{log.caller}</span>
                    </div>
                  </td>
                  <td className="py-3 px-3 text-sm text-white/60">{log.duration}</td>
                  <td className="py-3 px-3 text-sm text-white/70">{log.outcome}</td>
                  <td className="py-3 px-3">
                    <span className={`px-2.5 py-1 rounded-full text-xs border capitalize ${sentimentConfig[log.sentiment]}`}>
                      {log.sentiment}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-xs text-white/30">{log.time}</td>
                  <td className="py-3 px-3">
                    <button className="flex items-center gap-1 text-xs text-violet-400 hover:text-violet-300 transition-colors">
                      <Play className="w-3 h-3" />
                      Play
                    </button>
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
