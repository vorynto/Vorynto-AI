"use client";

import { useState } from "react";
import { mutationClient } from "@/lib/supabase/client";
import { useRealtimeTable } from "@/lib/hooks/useRealtimeTable";
import StatsCard from "@/components/dashboard/StatsCard";
import {
  Mail, Send, Users, BarChart3, Plus, MessageSquare, Phone,
  Filter, Eye, MoreHorizontal, Wifi, WifiOff, X,
} from "lucide-react";

type Campaign = {
  id: string;
  tenant_id: string;
  name: string;
  type: string;
  status: string | null;
  total_recipients: number | null;
  sent_count: number | null;
  opened_count: number | null;
  clicked_count: number | null;
  scheduled_at: string | null;
  sent_at: string | null;
  created_at: string | null;
};

type Props = {
  tenantId: string;
  initialCampaigns: Campaign[];
};

const typeConfig = {
  email: { icon: Mail, color: "text-cyan-400", bg: "bg-cyan-600/20", label: "Email" },
  whatsapp: { icon: MessageSquare, color: "text-emerald-400", bg: "bg-emerald-600/20", label: "WhatsApp" },
  sms: { icon: Phone, color: "text-amber-400", bg: "bg-amber-600/20", label: "SMS" },
};

const statusStyle: Record<string, string> = {
  sent: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  sending: "bg-blue-500/10 text-blue-400 border-blue-500/20",
  scheduled: "bg-violet-500/10 text-violet-400 border-violet-500/20",
  draft: "bg-white/5 text-white/40 border-white/10",
  paused: "bg-amber-500/10 text-amber-400 border-amber-500/20",
  failed: "bg-red-500/10 text-red-400 border-red-500/20",
};

export default function CampaignsClient({ tenantId, initialCampaigns }: Props) {
  const { data: campaigns, connected } = useRealtimeTable<Campaign>(
    "campaigns", tenantId, initialCampaigns
  );

  const [filter, setFilter] = useState("All");
  const [showCreate, setShowCreate] = useState(false);
  const [creating, setCreating] = useState(false);
  const [newCampaign, setNewCampaign] = useState({
    name: "",
    type: "email",
    subject: "",
    content: "",
  });

  const totalSent = campaigns.reduce((s, c) => s + (c.sent_count ?? 0), 0);
  const totalOpened = campaigns.reduce((s, c) => s + (c.opened_count ?? 0), 0);
  const totalRecipients = campaigns.reduce((s, c) => s + (c.total_recipients ?? 0), 0);
  const totalClicked = campaigns.reduce((s, c) => s + (c.clicked_count ?? 0), 0);
  const avgOpenRate = totalSent > 0 ? ((totalOpened / totalSent) * 100).toFixed(1) : "—";

  const filtered = filter === "All"
    ? campaigns
    : campaigns.filter((c) => (c.status ?? "").toLowerCase() === filter.toLowerCase());

  async function createCampaign() {
    if (!newCampaign.name.trim()) return;
    setCreating(true);
    const db = mutationClient();
    await db.from("campaigns").insert({
      tenant_id: tenantId,
      name: newCampaign.name,
      type: newCampaign.type as "email" | "whatsapp" | "sms",
      subject: newCampaign.subject,
      content: newCampaign.content,
      status: "draft",
      total_recipients: 0,
      sent_count: 0,
      opened_count: 0,
      clicked_count: 0,
    });
    setNewCampaign({ name: "", type: "email", subject: "", content: "" });
    setShowCreate(false);
    setCreating(false);
  }

  return (
    <div>
      <div className="p-6 space-y-6">
        {/* Stats */}
        <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
          <StatsCard title="Messages Sent" value={totalSent.toLocaleString()} icon={Send} iconColor="text-violet-400" iconBg="bg-violet-600/20" />
          <StatsCard title="Avg Open Rate" value={avgOpenRate !== "—" ? `${avgOpenRate}%` : "—"} icon={Eye} iconColor="text-emerald-400" iconBg="bg-emerald-600/20" />
          <StatsCard title="Recipients Reached" value={totalRecipients.toLocaleString()} icon={Users} iconColor="text-cyan-400" iconBg="bg-cyan-600/20" />
          <StatsCard title="Click Rate" value={totalSent > 0 ? `${((totalClicked / totalSent) * 100).toFixed(1)}%` : "—"} icon={BarChart3} iconColor="text-amber-400" iconBg="bg-amber-600/20" />
        </div>

        {/* Campaign type quick create */}
        <div className="grid grid-cols-3 gap-4">
          {[
            { type: "email", label: "Email Campaign", desc: "Rich HTML emails with analytics", color: "from-cyan-600/20", iconColor: "text-cyan-400", bg: "bg-cyan-600/20" },
            { type: "whatsapp", label: "WhatsApp Broadcast", desc: "Personalized WhatsApp messages", color: "from-emerald-600/20", iconColor: "text-emerald-400", bg: "bg-emerald-600/20" },
            { type: "sms", label: "SMS Campaign", desc: "High-deliverability text messages", color: "from-amber-600/20", iconColor: "text-amber-400", bg: "bg-amber-600/20" },
          ].map((t) => {
            const cfg = typeConfig[t.type as keyof typeof typeConfig];
            return (
              <button
                key={t.type}
                onClick={() => { setNewCampaign({ ...newCampaign, type: t.type }); setShowCreate(true); }}
                className={`glass-card-hover p-5 text-left bg-gradient-to-br ${t.color} to-transparent`}
              >
                <div className={`w-10 h-10 rounded-xl ${t.bg} flex items-center justify-center mb-3`}>
                  <cfg.icon className={`w-5 h-5 ${t.iconColor}`} />
                </div>
                <div className="text-sm font-semibold text-white mb-1">{t.label}</div>
                <div className="text-xs text-white/40">{t.desc}</div>
              </button>
            );
          })}
        </div>

        {/* Create campaign form */}
        {showCreate && (
          <div className="glass-card p-5 border-violet-500/20">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-white">New Campaign</h3>
              <button onClick={() => setShowCreate(false)} className="text-white/30 hover:text-white/60">
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-white/40 mb-1">Campaign Name</label>
                  <input
                    type="text"
                    placeholder="Summer Sale 2026"
                    value={newCampaign.name}
                    onChange={(e) => setNewCampaign({ ...newCampaign, name: e.target.value })}
                    className="input-dark text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs text-white/40 mb-1">Type</label>
                  <select
                    value={newCampaign.type}
                    onChange={(e) => setNewCampaign({ ...newCampaign, type: e.target.value })}
                    className="input-dark bg-[#0f172a] text-sm"
                  >
                    <option value="email">Email</option>
                    <option value="whatsapp">WhatsApp</option>
                    <option value="sms">SMS</option>
                  </select>
                </div>
              </div>
              {newCampaign.type === "email" && (
                <div>
                  <label className="block text-xs text-white/40 mb-1">Subject Line</label>
                  <input
                    type="text"
                    placeholder="Your exclusive offer inside 🎁"
                    value={newCampaign.subject}
                    onChange={(e) => setNewCampaign({ ...newCampaign, subject: e.target.value })}
                    className="input-dark text-sm"
                  />
                </div>
              )}
              <div>
                <label className="block text-xs text-white/40 mb-1">Message Content</label>
                <textarea
                  rows={3}
                  placeholder="Write your message here..."
                  value={newCampaign.content}
                  onChange={(e) => setNewCampaign({ ...newCampaign, content: e.target.value })}
                  className="input-dark resize-none text-sm"
                />
              </div>
              <div className="flex gap-3">
                <button onClick={createCampaign} disabled={creating || !newCampaign.name} className="btn-primary text-sm py-2 px-4">
                  {creating ? "Creating…" : "Save as Draft"}
                </button>
                <button onClick={() => setShowCreate(false)} className="btn-secondary text-sm py-2 px-4">Cancel</button>
              </div>
            </div>
          </div>
        )}

        {/* Campaign table */}
        <div className="glass-card p-6">
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-2">
              <h2 className="text-base font-semibold text-white">All Campaigns</h2>
              {connected ? (
                <span className="flex items-center gap-1 text-xs text-emerald-400">
                  <Wifi className="w-3 h-3" /> Live
                </span>
              ) : (
                <span className="flex items-center gap-1 text-xs text-white/20">
                  <WifiOff className="w-3 h-3" />
                </span>
              )}
            </div>
            <div className="flex items-center gap-2">
              {["All", "Sending", "Scheduled", "Sent", "Draft"].map((s) => (
                <button
                  key={s}
                  onClick={() => setFilter(s)}
                  className={`px-3 py-1.5 rounded-lg text-xs transition-all ${
                    filter === s
                      ? "bg-violet-600/20 text-violet-300 border border-violet-500/30"
                      : "text-white/30 hover:text-white/60 hover:bg-white/5"
                  }`}
                >
                  {s}
                </button>
              ))}
              <button className="flex items-center gap-1.5 px-3 py-1.5 border border-white/10 rounded-lg text-xs text-white/50 hover:bg-white/5 transition-all">
                <Filter className="w-3.5 h-3.5" /> Filter
              </button>
            </div>
          </div>

          {filtered.length === 0 ? (
            <div className="py-10 text-center">
              <Mail className="w-10 h-10 text-white/10 mx-auto mb-3" />
              <p className="text-sm text-white/30">
                {filter !== "All" ? `No ${filter.toLowerCase()} campaigns` : "No campaigns yet — create your first one above"}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/5">
                    {["Campaign", "Type", "Status", "Recipients", "Sent", "Opened", "Clicked", "Date", ""].map((h) => (
                      <th key={h} className="text-left py-2 px-3 text-xs font-medium text-white/30 first:pl-0">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {filtered.map((c) => {
                    const type = typeConfig[c.type as keyof typeof typeConfig] ?? typeConfig.email;
                    const openRate = (c.sent_count ?? 0) > 0
                      ? `${(((c.opened_count ?? 0) / (c.sent_count ?? 1)) * 100).toFixed(1)}%` : "—";
                    const clickRate = (c.sent_count ?? 0) > 0
                      ? `${(((c.clicked_count ?? 0) / (c.sent_count ?? 1)) * 100).toFixed(1)}%` : "—";
                    return (
                      <tr key={c.id} className="hover:bg-white/2 transition-colors">
                        <td className="py-3 pl-0 pr-3 text-sm font-medium text-white max-w-[200px] truncate">{c.name}</td>
                        <td className="py-3 px-3">
                          <div className={`flex items-center gap-1.5 w-fit px-2.5 py-1 rounded-full ${type.bg}`}>
                            <type.icon className={`w-3 h-3 ${type.color}`} />
                            <span className={`text-xs ${type.color}`}>{type.label}</span>
                          </div>
                        </td>
                        <td className="py-3 px-3">
                          <span className={`px-2.5 py-1 rounded-full text-xs border capitalize ${statusStyle[c.status ?? "draft"]}`}>
                            {c.status ?? "draft"}
                          </span>
                        </td>
                        <td className="py-3 px-3 text-sm text-white/60">{(c.total_recipients ?? 0).toLocaleString()}</td>
                        <td className="py-3 px-3 text-sm text-white/60">{(c.sent_count ?? 0).toLocaleString()}</td>
                        <td className="py-3 px-3 text-sm text-white/60">{openRate}</td>
                        <td className="py-3 px-3 text-sm text-white/60">{clickRate}</td>
                        <td className="py-3 px-3 text-xs text-white/40">
                          {(c.sent_at ?? c.scheduled_at ?? c.created_at)
                            ? new Date(c.sent_at ?? c.scheduled_at ?? c.created_at!).toLocaleDateString()
                            : "—"}
                        </td>
                        <td className="py-3 px-3">
                          <button className="w-7 h-7 rounded-lg hover:bg-white/5 flex items-center justify-center text-white/30 hover:text-white/60 transition-colors">
                            <MoreHorizontal className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
