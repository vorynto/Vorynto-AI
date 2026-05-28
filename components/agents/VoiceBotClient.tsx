"use client";

import { useState } from "react";
import { mutationClient } from "@/lib/supabase/client";
import { useRealtimeTable } from "@/lib/hooks/useRealtimeTable";
import StatsCard from "@/components/dashboard/StatsCard";
import {
  Mic, Phone, Clock, TrendingUp, Play, Save,
  Check, Settings, Wifi, WifiOff, Plus,
} from "lucide-react";

type VoiceBotConfig = {
  id: string;
  tenant_id: string;
  name: string;
  voice_id: string | null;
  language: string | null;
  greeting_message: string | null;
  phone_number: string | null;
  system_prompt: string | null;
  is_active: boolean | null;
};

type VoiceCall = {
  id: string;
  tenant_id: string;
  caller_number: string;
  duration_seconds: number | null;
  outcome: string | null;
  sentiment: string | null;
  called_at: string | null;
};

type Props = {
  tenantId: string;
  initialConfig: VoiceBotConfig | null;
  initialCalls: VoiceCall[];
};

const sentimentStyle: Record<string, string> = {
  positive: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
  neutral: "text-amber-400 bg-amber-500/10 border-amber-500/20",
  negative: "text-red-400 bg-red-500/10 border-red-500/20",
};

function fmtDuration(s: number | null) {
  if (!s) return "—";
  const m = Math.floor(s / 60);
  const sec = s % 60;
  return `${m}:${sec.toString().padStart(2, "0")}`;
}

function timeAgo(ts: string | null) {
  if (!ts) return "—";
  const diff = Date.now() - new Date(ts).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1) return "just now";
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  return `${Math.floor(h / 24)}d ago`;
}

export default function VoiceBotClient({ tenantId, initialConfig, initialCalls }: Props) {
  const { data: calls, connected } = useRealtimeTable<VoiceCall>(
    "voice_calls", tenantId, initialCalls
  );

  const [config, setConfig] = useState<VoiceBotConfig>(
    initialConfig ?? {
      id: "",
      tenant_id: tenantId,
      name: "Aria — Your AI Assistant",
      voice_id: "alloy",
      language: "en-US",
      greeting_message: "Hello! Thank you for calling. I'm Aria, your AI assistant. How can I help you today?",
      phone_number: "",
      system_prompt: "You are a helpful voice assistant for this business.",
      is_active: false,
    }
  );
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const totalCalls = calls.length;
  const avgDuration = calls.length
    ? Math.round(calls.reduce((a, c) => a + (c.duration_seconds ?? 0), 0) / calls.length)
    : 0;
  const resolvedCalls = calls.filter((c) => c.outcome && !c.outcome.includes("Transfer")).length;
  const resolutionRate = totalCalls ? Math.round((resolvedCalls / totalCalls) * 100) : 0;

  async function saveConfig() {
    setSaving(true);
    const db = mutationClient();
    if (config.id) {
      await db
        .from("voice_bot_configs")
        .update({
          name: config.name,
          voice_id: config.voice_id,
          language: config.language,
          greeting_message: config.greeting_message,
          phone_number: config.phone_number,
          system_prompt: config.system_prompt,
          is_active: config.is_active,
        })
        .eq("id", config.id);
    } else {
      const { data } = await db
        .from("voice_bot_configs")
        .insert({
          tenant_id: tenantId,
          name: config.name,
          voice_id: config.voice_id ?? "alloy",
          language: config.language ?? "en-US",
          greeting_message: config.greeting_message,
          phone_number: config.phone_number,
          system_prompt: config.system_prompt,
          is_active: true,
        })
        .select()
        .maybeSingle();
      if (data) setConfig({ ...config, id: (data as VoiceBotConfig).id });
    }
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  return (
    <div>
      <div className="p-6 space-y-6">
        {/* Stats */}
        <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
          <StatsCard title="Total Calls" value={totalCalls.toString()} icon={Phone} iconColor="text-pink-400" iconBg="bg-pink-600/20" />
          <StatsCard title="Avg Duration" value={fmtDuration(avgDuration)} icon={Clock} iconColor="text-violet-400" iconBg="bg-violet-600/20" />
          <StatsCard title="Resolution Rate" value={`${resolutionRate}%`} icon={TrendingUp} iconColor="text-emerald-400" iconBg="bg-emerald-600/20" />
          <StatsCard title="Minutes Used" value={`${Math.round(calls.reduce((a, c) => a + (c.duration_seconds ?? 0), 0) / 60)}`} icon={Mic} iconColor="text-cyan-400" iconBg="bg-cyan-600/20" />
        </div>

        {/* Live indicator */}
        <div className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/3 border border-white/5 w-fit">
          {connected ? (
            <><Wifi className="w-3.5 h-3.5 text-emerald-400" /><span className="text-xs text-emerald-400">Live — new calls appear instantly</span></>
          ) : (
            <><WifiOff className="w-3.5 h-3.5 text-white/20" /><span className="text-xs text-white/30">Connecting…</span></>
          )}
        </div>

        {/* Config */}
        <div className="glass-card p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-base font-semibold text-white">Voice Bot Configuration</h2>
            <div className="flex items-center gap-2">
              <span className={`px-2.5 py-1 rounded-full text-xs border ${config.is_active ? "text-emerald-400 bg-emerald-500/10 border-emerald-500/20" : "text-white/30 border-white/10"}`}>
                {config.is_active ? "Active" : "Inactive"}
              </span>
              <button className="flex items-center gap-1.5 px-3 py-1.5 border border-white/10 rounded-lg text-xs text-white/50 hover:bg-white/5 transition-all">
                <Settings className="w-3.5 h-3.5" />
                Advanced
              </button>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-white/60 mb-1.5">Bot Name</label>
                <input
                  type="text"
                  value={config.name}
                  onChange={(e) => setConfig({ ...config, name: e.target.value })}
                  className="input-dark"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-white/60 mb-1.5">Voice</label>
                <select
                  value={config.voice_id ?? "alloy"}
                  onChange={(e) => setConfig({ ...config, voice_id: e.target.value })}
                  className="input-dark bg-[#0f172a]"
                >
                  <option value="alloy">Alloy (Neutral)</option>
                  <option value="nova">Nova (Female)</option>
                  <option value="onyx">Onyx (Male)</option>
                  <option value="shimmer">Shimmer (Female, warm)</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-white/60 mb-1.5">Language</label>
                <select
                  value={config.language ?? "en-US"}
                  onChange={(e) => setConfig({ ...config, language: e.target.value })}
                  className="input-dark bg-[#0f172a]"
                >
                  <option value="en-US">English (US)</option>
                  <option value="en-GB">English (UK)</option>
                  <option value="es">Spanish</option>
                  <option value="hi">Hindi</option>
                  <option value="ar">Arabic</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-white/60 mb-1.5">Phone Number</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="+1 (555) 000-0000"
                    value={config.phone_number ?? ""}
                    onChange={(e) => setConfig({ ...config, phone_number: e.target.value })}
                    className="input-dark flex-1"
                  />
                  {config.phone_number && (
                    <button className="px-3 py-2 text-xs border border-emerald-500/30 text-emerald-400 rounded-lg hover:bg-emerald-600/10 transition-all whitespace-nowrap">
                      Active
                    </button>
                  )}
                </div>
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-white/60 mb-1.5">Greeting Message</label>
                <textarea
                  rows={3}
                  value={config.greeting_message ?? ""}
                  onChange={(e) => setConfig({ ...config, greeting_message: e.target.value })}
                  className="input-dark resize-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-white/60 mb-1.5">System Prompt</label>
                <textarea
                  rows={4}
                  value={config.system_prompt ?? ""}
                  onChange={(e) => setConfig({ ...config, system_prompt: e.target.value })}
                  className="input-dark resize-none text-xs"
                  placeholder="You are a helpful voice assistant..."
                />
              </div>
            </div>
          </div>
          <div className="flex gap-3 mt-5">
            <button className="btn-secondary flex items-center gap-2 text-sm py-2 px-4">
              <Play className="w-4 h-4" />
              Test Voice
            </button>
            <button onClick={saveConfig} disabled={saving} className="btn-primary text-sm py-2 px-4 flex items-center gap-2">
              {saved ? <><Check className="w-4 h-4" /> Saved!</> : saving ? "Saving…" : <><Save className="w-4 h-4" /> Save Configuration</>}
            </button>
          </div>
        </div>

        {/* Call logs */}
        <div className="glass-card p-6">
          <h2 className="text-base font-semibold text-white mb-5">
            Call Logs
            {calls.length > 0 && <span className="ml-2 text-xs text-white/30 font-normal">({calls.length} total)</span>}
          </h2>
          {calls.length === 0 ? (
            <div className="py-10 text-center">
              <Phone className="w-10 h-10 text-white/10 mx-auto mb-3" />
              <p className="text-sm text-white/30">No calls yet — they will appear here in realtime</p>
            </div>
          ) : (
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/5">
                  {["Caller", "Duration", "Outcome", "Sentiment", "Time", ""].map((h) => (
                    <th key={h} className="text-left py-2 px-3 text-xs font-medium text-white/30 first:pl-0">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {calls.map((call) => (
                  <tr key={call.id} className="hover:bg-white/2 transition-colors">
                    <td className="py-3 pl-0 pr-3">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-lg bg-pink-600/20 flex items-center justify-center">
                          <Phone className="w-3.5 h-3.5 text-pink-400" />
                        </div>
                        <span className="text-sm text-white">{call.caller_number}</span>
                      </div>
                    </td>
                    <td className="py-3 px-3 text-sm text-white/60">{fmtDuration(call.duration_seconds)}</td>
                    <td className="py-3 px-3 text-sm text-white/70">{call.outcome ?? "—"}</td>
                    <td className="py-3 px-3">
                      <span className={`px-2.5 py-1 rounded-full text-xs border capitalize ${sentimentStyle[call.sentiment ?? "neutral"]}`}>
                        {call.sentiment ?? "neutral"}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-xs text-white/30">{timeAgo(call.called_at)}</td>
                    <td className="py-3 px-3">
                      <button className="flex items-center gap-1 text-xs text-violet-400 hover:text-violet-300 transition-colors">
                        <Play className="w-3 h-3" /> Play
                      </button>
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
