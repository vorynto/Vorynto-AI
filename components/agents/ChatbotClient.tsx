"use client";

import { useState, useEffect } from "react";
import { mutationClient } from "@/lib/supabase/client";
import { useRealtimeTable } from "@/lib/hooks/useRealtimeTable";
import StatsCard from "@/components/dashboard/StatsCard";
import {
  Shield, MessageSquare, Users, TrendingUp, CheckCircle2,
  Copy, Check, Wifi, WifiOff, Save, Plus,
} from "lucide-react";

type ChatbotConfig = {
  id: string;
  tenant_id: string;
  name: string;
  welcome_message: string | null;
  system_prompt: string | null;
  primary_color: string | null;
  position: string | null;
  is_active: boolean | null;
  ai_model: string | null;
};

type Session = {
  id: string;
  tenant_id: string;
  is_resolved: boolean | null;
  lead_captured: boolean | null;
  message_count: number | null;
  started_at: string | null;
};

type Props = {
  tenantId: string;
  initialConfigs: ChatbotConfig[];
  initialSessions: Session[];
};

export default function ChatbotClient({ tenantId, initialConfigs, initialSessions }: Props) {
  const { data: sessions, connected } = useRealtimeTable<Session>(
    "chatbot_sessions", tenantId, initialSessions
  );

  const [configs, setConfigs] = useState(initialConfigs);
  const [activeConfig, setActiveConfig] = useState<ChatbotConfig | null>(
    initialConfigs[0] ?? null
  );
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [copied, setCopied] = useState(false);

  const totalSessions = sessions.length;
  const resolved = sessions.filter((s) => s.is_resolved).length;
  const leads = sessions.filter((s) => s.lead_captured).length;
  const avgMessages = sessions.length
    ? Math.round(sessions.reduce((a, s) => a + (s.message_count ?? 0), 0) / sessions.length)
    : 0;

  async function saveConfig() {
    if (!activeConfig) return;
    setSaving(true);
    const db = mutationClient();
    if (activeConfig.id) {
      await db
        .from("chatbot_configs")
        .update({
          name: activeConfig.name,
          welcome_message: activeConfig.welcome_message,
          system_prompt: activeConfig.system_prompt,
          primary_color: activeConfig.primary_color,
          position: activeConfig.position,
          is_active: activeConfig.is_active,
        })
        .eq("id", activeConfig.id);
    } else {
      const { data } = await db
        .from("chatbot_configs")
        .insert({
          tenant_id: tenantId,
          name: activeConfig.name,
          welcome_message: activeConfig.welcome_message,
          system_prompt: activeConfig.system_prompt,
          primary_color: activeConfig.primary_color ?? "#7c3aed",
          position: activeConfig.position ?? "bottom-right",
          is_active: true,
        })
        .select()
        .maybeSingle();
      if (data) {
        setConfigs((prev) => [...prev, data as ChatbotConfig]);
        setActiveConfig(data as ChatbotConfig);
      }
    }
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  async function createNew() {
    setActiveConfig({
      id: "",
      tenant_id: tenantId,
      name: "New AI Chatbot",
      welcome_message: "Hi there! 👋 How can I help you today?",
      system_prompt: "You are a helpful AI assistant for this business.",
      primary_color: "#7c3aed",
      position: "bottom-right",
      is_active: true,
      ai_model: "gpt-4o",
    });
  }

  function copyEmbed() {
    if (!activeConfig?.id) return;
    const code = `<script>\n  window.VoryntoConfig = {\n    botId: '${activeConfig.id}',\n  };\n</script>\n<script src="https://cdn.vorynto.ai/chatbot.js" async></script>`;
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div>
      <div className="p-6 space-y-6">
        {/* Stats */}
        <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
          <StatsCard title="Sessions Today" value={totalSessions.toString()} icon={MessageSquare} iconColor="text-violet-400" iconBg="bg-violet-600/20" />
          <StatsCard title="Leads Captured" value={leads.toString()} icon={Users} iconColor="text-emerald-400" iconBg="bg-emerald-600/20" />
          <StatsCard title="Resolution Rate" value={totalSessions ? `${Math.round((resolved / totalSessions) * 100)}%` : "—"} icon={CheckCircle2} iconColor="text-cyan-400" iconBg="bg-cyan-600/20" />
          <StatsCard title="Avg Messages" value={avgMessages.toString()} icon={TrendingUp} iconColor="text-amber-400" iconBg="bg-amber-600/20" />
        </div>

        {/* Live status bar */}
        <div className="flex items-center justify-between px-4 py-2.5 rounded-xl bg-white/3 border border-white/5">
          <div className="flex items-center gap-2">
            {connected ? (
              <><Wifi className="w-3.5 h-3.5 text-emerald-400" /><span className="text-xs text-emerald-400">Live — sessions updating in realtime</span></>
            ) : (
              <><WifiOff className="w-3.5 h-3.5 text-white/20" /><span className="text-xs text-white/30">Connecting to realtime…</span></>
            )}
          </div>
          <button onClick={createNew} className="flex items-center gap-1.5 text-xs text-violet-400 hover:text-violet-300 transition-colors">
            <Plus className="w-3.5 h-3.5" /> New Chatbot
          </button>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          {/* Config editor */}
          <div className="glass-card p-6">
            <h2 className="text-base font-semibold text-white mb-5 flex items-center gap-2">
              <Shield className="w-4 h-4 text-violet-400" />
              {activeConfig ? `Configure: ${activeConfig.name}` : "No chatbot configured"}
            </h2>

            {activeConfig ? (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-white/60 mb-1.5">Bot Name</label>
                  <input
                    type="text"
                    value={activeConfig.name}
                    onChange={(e) => setActiveConfig({ ...activeConfig, name: e.target.value })}
                    className="input-dark"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-white/60 mb-1.5">Welcome Message</label>
                  <textarea
                    rows={2}
                    value={activeConfig.welcome_message ?? ""}
                    onChange={(e) => setActiveConfig({ ...activeConfig, welcome_message: e.target.value })}
                    className="input-dark resize-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-white/60 mb-1.5">AI System Prompt</label>
                  <textarea
                    rows={3}
                    value={activeConfig.system_prompt ?? ""}
                    onChange={(e) => setActiveConfig({ ...activeConfig, system_prompt: e.target.value })}
                    className="input-dark resize-none text-xs"
                    placeholder="You are a helpful AI assistant for this business..."
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-white/60 mb-1.5">Primary Color</label>
                  <div className="flex items-center gap-3">
                    <input
                      type="color"
                      value={activeConfig.primary_color ?? "#7c3aed"}
                      onChange={(e) => setActiveConfig({ ...activeConfig, primary_color: e.target.value })}
                      className="w-10 h-10 rounded-lg border border-white/10 cursor-pointer bg-transparent"
                    />
                    <span className="text-sm text-white/40">{activeConfig.primary_color}</span>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-white/60 mb-1.5">Position</label>
                  <div className="flex gap-2">
                    {["bottom-right", "bottom-left", "center"].map((pos) => (
                      <button
                        key={pos}
                        onClick={() => setActiveConfig({ ...activeConfig, position: pos })}
                        className={`flex-1 py-2 px-3 text-xs rounded-lg border transition-all capitalize ${
                          activeConfig.position === pos
                            ? "bg-violet-600/20 border-violet-500/30 text-violet-300"
                            : "border-white/10 text-white/30 hover:border-white/20"
                        }`}
                      >
                        {pos.replace("-", " ")}
                      </button>
                    ))}
                  </div>
                </div>
                <button
                  onClick={saveConfig}
                  disabled={saving}
                  className="btn-primary w-full text-sm py-2 flex items-center justify-center gap-2"
                >
                  {saved ? <><Check className="w-4 h-4" /> Saved!</> : saving ? "Saving…" : <><Save className="w-4 h-4" /> Save & Deploy</>}
                </button>
              </div>
            ) : (
              <div className="py-8 text-center">
                <p className="text-sm text-white/30 mb-4">No chatbots configured yet</p>
                <button onClick={createNew} className="btn-primary text-sm py-2 px-4">
                  <Plus className="w-4 h-4" /> Create First Chatbot
                </button>
              </div>
            )}
          </div>

          {/* Embed code + preview */}
          <div className="space-y-4">
            <div className="glass-card p-6">
              <h2 className="text-base font-semibold text-white mb-4">Embed Code</h2>
              <p className="text-sm text-white/40 mb-4">
                Add this snippet before the closing <code className="text-violet-400">&lt;/body&gt;</code> tag.
              </p>
              <div className="relative bg-[#050810] rounded-xl p-4 font-mono text-xs border border-white/5">
                <code className="text-violet-300 leading-relaxed whitespace-pre">
                  {activeConfig?.id
                    ? `<script>\n  window.VoryntoConfig = {\n    botId: '${activeConfig.id}',\n  };\n</script>\n<script src="https://cdn.vorynto.ai/chatbot.js" async></script>`
                    : "// Save your chatbot configuration first"}
                </code>
                <button
                  onClick={copyEmbed}
                  disabled={!activeConfig?.id}
                  className="absolute top-3 right-3 flex items-center gap-1.5 text-xs text-white/30 hover:text-white/60 transition-colors disabled:opacity-30"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  {copied ? "Copied!" : "Copy"}
                </button>
              </div>
            </div>

            {/* Widget preview */}
            <div className="glass-card p-6">
              <h2 className="text-base font-semibold text-white mb-4">Widget Preview</h2>
              <div className="relative bg-[#050810] rounded-xl p-6 border border-white/5 min-h-48 flex items-end justify-end">
                <div className="absolute bottom-6 right-6">
                  <div
                    className="w-72 rounded-2xl overflow-hidden shadow-2xl border"
                    style={{
                      background: "#0a0d1a",
                      borderColor: `${activeConfig?.primary_color ?? "#7c3aed"}33`,
                      boxShadow: `0 0 40px ${activeConfig?.primary_color ?? "#7c3aed"}22`,
                    }}
                  >
                    <div
                      className="p-3 flex items-center gap-2"
                      style={{ background: activeConfig?.primary_color ?? "#7c3aed" }}
                    >
                      <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center text-xs">🤖</div>
                      <span className="text-xs font-medium text-white">{activeConfig?.name ?? "AI Chatbot"}</span>
                      <span className="ml-auto w-2 h-2 bg-emerald-400 rounded-full" />
                    </div>
                    <div className="p-3 space-y-2 min-h-16">
                      <div className="bg-white/5 rounded-xl px-3 py-2 text-xs text-white/60 w-fit">
                        {activeConfig?.welcome_message ?? "Hi! How can I help you?"}
                      </div>
                    </div>
                    <div className="p-3 border-t border-white/5">
                      <div className="flex items-center gap-2 bg-white/5 rounded-xl px-3 py-2">
                        <input type="text" placeholder="Type a message..." className="bg-transparent text-xs text-white/40 placeholder:text-white/20 outline-none flex-1" readOnly />
                        <span style={{ color: activeConfig?.primary_color ?? "#7c3aed" }}>→</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Recent sessions */}
        {sessions.length > 0 && (
          <div className="glass-card p-6">
            <h2 className="text-base font-semibold text-white mb-4">Recent Sessions</h2>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/5">
                    {["Session ID", "Started", "Messages", "Lead", "Status"].map((h) => (
                      <th key={h} className="text-left py-2 px-3 text-xs font-medium text-white/30 first:pl-0">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {sessions.slice(0, 10).map((s) => (
                    <tr key={s.id} className="hover:bg-white/2 transition-colors">
                      <td className="py-3 pl-0 pr-3 text-xs font-mono text-white/50">{s.id.slice(0, 8)}…</td>
                      <td className="py-3 px-3 text-xs text-white/50">
                        {s.started_at ? new Date(s.started_at).toLocaleString() : "—"}
                      </td>
                      <td className="py-3 px-3 text-sm text-white/70">{s.message_count ?? 0}</td>
                      <td className="py-3 px-3">
                        {s.lead_captured ? (
                          <span className="text-xs text-emerald-400 flex items-center gap-1"><CheckCircle2 className="w-3 h-3" /> Yes</span>
                        ) : (
                          <span className="text-xs text-white/30">—</span>
                        )}
                      </td>
                      <td className="py-3 px-3">
                        <span className={`px-2.5 py-1 rounded-full text-xs border ${s.is_resolved ? "text-emerald-400 bg-emerald-500/10 border-emerald-500/20" : "text-amber-400 bg-amber-500/10 border-amber-500/20"}`}>
                          {s.is_resolved ? "Resolved" : "Open"}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
