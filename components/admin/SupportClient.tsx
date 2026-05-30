"use client";

import { useState } from "react";
import {
  Headphones, MessageSquare, Clock, CheckCircle2,
  AlertCircle, ChevronRight, User, Building2,
  Search, Filter, X,
} from "lucide-react";

type Ticket = {
  id: string;
  tenant_id: string;
  title: string;
  description: string | null;
  status: "open" | "in_progress" | "resolved" | "closed" | null;
  priority: "low" | "medium" | "high" | "urgent" | null;
  category: string | null;
  created_at: string | null;
  updated_at: string | null;
  assigned_to: string | null;
  resolved_at: string | null;
  tenant_name: string | null;
  tenant_email: string | null;
};

interface Props {
  initialTickets: Ticket[];
}

const statusConfig: Record<string, { label: string; color: string; bg: string; border: string }> = {
  open: { label: "Open", color: "text-amber-400", bg: "bg-amber-500/10", border: "border-amber-500/20" },
  in_progress: { label: "In Progress", color: "text-violet-400", bg: "bg-violet-500/10", border: "border-violet-500/20" },
  resolved: { label: "Resolved", color: "text-emerald-400", bg: "bg-emerald-500/10", border: "border-emerald-500/20" },
  closed: { label: "Closed", color: "text-white/30", bg: "bg-white/5", border: "border-white/10" },
};

const priorityConfig: Record<string, { label: string; color: string }> = {
  urgent: { label: "Urgent", color: "text-red-400" },
  high: { label: "High", color: "text-orange-400" },
  medium: { label: "Medium", color: "text-amber-400" },
  low: { label: "Low", color: "text-white/40" },
};

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

export default function SupportClient({ initialTickets }: Props) {
  const [tickets] = useState<Ticket[]>(initialTickets);
  const [filter, setFilter] = useState("All");
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<Ticket | null>(null);

  const filtered = tickets.filter((t) => {
    const matchesFilter = filter === "All" || (t.status ?? "open").toLowerCase() === filter.toLowerCase();
    const q = search.toLowerCase();
    const matchesSearch = !q || t.title.toLowerCase().includes(q) || (t.tenant_name ?? "").toLowerCase().includes(q);
    return matchesFilter && matchesSearch;
  });

  const open = tickets.filter((t) => t.status === "open").length;
  const inProgress = tickets.filter((t) => t.status === "in_progress").length;
  const resolved = tickets.filter((t) => t.status === "resolved").length;
  const urgent = tickets.filter((t) => t.priority === "urgent" || t.priority === "high").length;

  return (
    <div className="p-6 space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        {[
          { label: "Total Tickets", value: tickets.length, icon: MessageSquare, color: "text-violet-400", bg: "bg-violet-600/20" },
          { label: "Open", value: open, icon: AlertCircle, color: "text-amber-400", bg: "bg-amber-600/20" },
          { label: "In Progress", value: inProgress, icon: Clock, color: "text-violet-400", bg: "bg-violet-600/20" },
          { label: "Resolved", value: resolved, icon: CheckCircle2, color: "text-emerald-400", bg: "bg-emerald-600/20" },
        ].map((s) => (
          <div key={s.label} className="glass-card p-5">
            <div className={`w-9 h-9 rounded-xl ${s.bg} flex items-center justify-center mb-3`}>
              <s.icon className={`w-4 h-4 ${s.color}`} />
            </div>
            <div className="text-2xl font-bold text-white">{s.value}</div>
            <div className="text-xs text-white/40 mt-0.5">{s.label}</div>
          </div>
        ))}
      </div>

      {urgent > 0 && (
        <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-red-500/5 border border-red-500/15">
          <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
          <p className="text-sm text-white/70">
            <span className="text-red-400 font-semibold">{urgent} ticket{urgent > 1 ? "s" : ""}</span> marked high or urgent priority require attention.
          </p>
        </div>
      )}

      {/* Ticket list */}
      <div className="glass-card overflow-hidden">
        <div className="p-5 border-b border-white/5 flex flex-wrap items-center gap-3 justify-between">
          <div className="flex items-center gap-2 flex-wrap">
            {["All", "Open", "In_progress", "Resolved", "Closed"].map((s) => (
              <button
                key={s}
                onClick={() => setFilter(s)}
                className={`px-3 py-1.5 rounded-lg text-xs transition-all ${
                  filter === s
                    ? "bg-amber-500/15 text-amber-400 border border-amber-500/25"
                    : "text-white/30 hover:text-white/60 hover:bg-white/5"
                }`}
              >
                {s.replace("_", " ")}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 bg-white/5 border border-white/5 rounded-lg">
            <Search className="w-3.5 h-3.5 text-white/30" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search tickets..."
              className="bg-transparent text-sm text-white/60 placeholder:text-white/25 outline-none w-40"
            />
          </div>
        </div>

        {filtered.length === 0 ? (
          <div className="py-16 text-center">
            <Headphones className="w-10 h-10 text-white/10 mx-auto mb-3" />
            <p className="text-sm text-white/30">
              {tickets.length === 0
                ? "No support tickets yet — tickets submitted by clients will appear here"
                : "No tickets match your filters"}
            </p>
          </div>
        ) : (
          <div className="divide-y divide-white/5">
            {filtered.map((ticket) => {
              const status = statusConfig[ticket.status ?? "open"] ?? statusConfig.open;
              const priority = priorityConfig[ticket.priority ?? "low"] ?? priorityConfig.low;
              return (
                <div
                  key={ticket.id}
                  onClick={() => setSelected(ticket)}
                  className="flex items-center justify-between px-5 py-4 hover:bg-white/2 transition-colors cursor-pointer group"
                >
                  <div className="flex items-start gap-3 flex-1 min-w-0">
                    <div className="w-8 h-8 rounded-xl bg-amber-600/20 flex items-center justify-center shrink-0 mt-0.5">
                      <Headphones className="w-4 h-4 text-amber-400" />
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 mb-0.5">
                        <span className="text-[10px] text-white/25 font-mono">#{ticket.id.slice(0, 8)}</span>
                        <span className={`text-[10px] font-semibold ${priority.color}`}>{priority.label}</span>
                        {ticket.category && (
                          <span className="text-[10px] text-white/25 capitalize">{ticket.category}</span>
                        )}
                      </div>
                      <div className="text-sm font-medium text-white truncate">{ticket.title}</div>
                      <div className="flex items-center gap-3 mt-1 text-xs text-white/30">
                        {ticket.tenant_name && (
                          <span className="flex items-center gap-1">
                            <Building2 className="w-3 h-3" /> {ticket.tenant_name}
                          </span>
                        )}
                        {ticket.tenant_email && (
                          <span className="flex items-center gap-1">
                            <User className="w-3 h-3" /> {ticket.tenant_email}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 shrink-0 ml-4">
                    <div className="text-right">
                      <div className="text-xs text-white/20">Opened {timeAgo(ticket.created_at)}</div>
                      {ticket.updated_at && ticket.updated_at !== ticket.created_at && (
                        <div className="text-xs text-white/15">Updated {timeAgo(ticket.updated_at)}</div>
                      )}
                    </div>
                    <span className={`px-2.5 py-1 rounded-full text-xs border ${status.color} ${status.bg} ${status.border}`}>
                      {status.label}
                    </span>
                    <ChevronRight className="w-4 h-4 text-white/20 group-hover:text-amber-400 transition-colors" />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Ticket detail modal */}
      {selected && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
          onClick={(e) => e.target === e.currentTarget && setSelected(null)}
        >
          <div className="glass-card w-full max-w-lg">
            <div className="flex items-center justify-between p-6 border-b border-white/5">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-amber-600/20 flex items-center justify-center">
                  <Headphones className="w-4 h-4 text-amber-400" />
                </div>
                <div>
                  <h2 className="text-sm font-bold text-white">{selected.title}</h2>
                  <p className="text-xs text-white/30 font-mono">#{selected.id.slice(0, 8)}</p>
                </div>
              </div>
              <button onClick={() => setSelected(null)} className="text-white/30 hover:text-white/60">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div className="flex gap-3 flex-wrap">
                <span className={`px-2.5 py-1 rounded-full text-xs border ${(statusConfig[selected.status ?? "open"] ?? statusConfig.open).color} ${(statusConfig[selected.status ?? "open"] ?? statusConfig.open).bg} ${(statusConfig[selected.status ?? "open"] ?? statusConfig.open).border}`}>
                  {(statusConfig[selected.status ?? "open"] ?? statusConfig.open).label}
                </span>
                <span className={`text-xs font-semibold ${(priorityConfig[selected.priority ?? "low"] ?? priorityConfig.low).color}`}>
                  {(priorityConfig[selected.priority ?? "low"] ?? priorityConfig.low).label} Priority
                </span>
                {selected.category && (
                  <span className="px-2 py-0.5 text-xs text-white/40 bg-white/5 border border-white/5 rounded-full capitalize">
                    {selected.category}
                  </span>
                )}
              </div>

              {selected.description && (
                <div>
                  <p className="text-xs font-medium text-white/40 mb-1.5">Description</p>
                  <p className="text-sm text-white/70 leading-relaxed">{selected.description}</p>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4 text-xs">
                {selected.tenant_name && (
                  <div>
                    <p className="text-white/40 mb-0.5">Client</p>
                    <p className="text-white font-medium">{selected.tenant_name}</p>
                  </div>
                )}
                {selected.tenant_email && (
                  <div>
                    <p className="text-white/40 mb-0.5">Email</p>
                    <p className="text-white font-medium">{selected.tenant_email}</p>
                  </div>
                )}
                <div>
                  <p className="text-white/40 mb-0.5">Opened</p>
                  <p className="text-white font-medium">{selected.created_at ? new Date(selected.created_at).toLocaleDateString() : "—"}</p>
                </div>
                {selected.resolved_at && (
                  <div>
                    <p className="text-white/40 mb-0.5">Resolved</p>
                    <p className="text-emerald-400 font-medium">{new Date(selected.resolved_at).toLocaleDateString()}</p>
                  </div>
                )}
              </div>
            </div>

            <div className="flex gap-3 p-6 pt-0">
              <button onClick={() => setSelected(null)} className="btn-secondary flex-1 text-sm py-2">Close</button>
              <button className="btn-primary flex-1 text-sm py-2">Mark Resolved</button>
            </div>
          </div>
        </div>
      )}

      {/* Coming soon note */}
      <div className="glass-card p-5 flex items-center gap-3" style={{ borderColor: "rgba(245,158,11,0.15)" }}>
        <div className="w-8 h-8 rounded-xl bg-amber-500/15 flex items-center justify-center shrink-0">
          <AlertCircle className="w-4 h-4 text-amber-400" />
        </div>
        <div>
          <div className="text-sm font-medium text-white">Full ticket management coming soon</div>
          <div className="text-xs text-white/30 mt-0.5">
            Reply, assignment, SLA tracking, and email notifications will be available in the next platform update.
          </div>
        </div>
      </div>
    </div>
  );
}
