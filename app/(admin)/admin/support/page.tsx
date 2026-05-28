import AdminHeader from "@/components/admin/AdminHeader";
import {
  Headphones, MessageSquare, Clock, CheckCircle2,
  AlertCircle, ChevronRight, User, Building2,
} from "lucide-react";

// Placeholder support tickets — in production this would load from a support_tickets table
const tickets = [
  {
    id: "TKT-0001",
    subject: "WhatsApp bot not sending messages",
    tenant: "TechCorp Inc.",
    email: "admin@techcorp.com",
    status: "open",
    priority: "high",
    created: "2 hours ago",
    lastReply: "1 hour ago",
  },
  {
    id: "TKT-0002",
    subject: "How to configure SMTP for email campaigns?",
    tenant: "RetailPlus Co.",
    email: "ops@retailplus.com",
    status: "pending",
    priority: "medium",
    created: "5 hours ago",
    lastReply: "4 hours ago",
  },
  {
    id: "TKT-0003",
    subject: "Chatbot responses are incorrect",
    tenant: "MedConsult India",
    email: "info@medconsult.in",
    status: "open",
    priority: "medium",
    created: "1 day ago",
    lastReply: "6 hours ago",
  },
  {
    id: "TKT-0004",
    subject: "Request to upgrade plan to Enterprise",
    tenant: "StartupX",
    email: "founder@startupx.io",
    status: "resolved",
    priority: "low",
    created: "3 days ago",
    lastReply: "2 days ago",
  },
  {
    id: "TKT-0005",
    subject: "Unable to import contacts CSV",
    tenant: "FastDeliver LLC",
    email: "admin@fastdeliver.com",
    status: "open",
    priority: "high",
    created: "30 minutes ago",
    lastReply: "—",
  },
];

const statusConfig: Record<string, { label: string; color: string; bg: string; border: string }> = {
  open: { label: "Open", color: "text-amber-400", bg: "bg-amber-500/10", border: "border-amber-500/20" },
  pending: { label: "Pending", color: "text-violet-400", bg: "bg-violet-500/10", border: "border-violet-500/20" },
  resolved: { label: "Resolved", color: "text-emerald-400", bg: "bg-emerald-500/10", border: "border-emerald-500/20" },
  closed: { label: "Closed", color: "text-white/30", bg: "bg-white/5", border: "border-white/10" },
};

const priorityConfig: Record<string, { label: string; color: string }> = {
  high: { label: "High", color: "text-red-400" },
  medium: { label: "Medium", color: "text-amber-400" },
  low: { label: "Low", color: "text-white/40" },
};

export default function AdminSupportPage() {
  const open = tickets.filter((t) => t.status === "open").length;
  const pending = tickets.filter((t) => t.status === "pending").length;
  const resolved = tickets.filter((t) => t.status === "resolved").length;

  return (
    <div>
      <AdminHeader
        title="Support Tickets"
        subtitle="Handle inbound support requests from clients"
        breadcrumb="Platform Management"
      />

      <div className="p-6 space-y-6">
        {/* Stats */}
        <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
          {[
            { label: "Total Tickets", value: tickets.length, icon: MessageSquare, color: "text-violet-400", bg: "bg-violet-600/20" },
            { label: "Open", value: open, icon: AlertCircle, color: "text-amber-400", bg: "bg-amber-600/20" },
            { label: "Pending Reply", value: pending, icon: Clock, color: "text-violet-400", bg: "bg-violet-600/20" },
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

        {/* Tickets list */}
        <div className="glass-card overflow-hidden">
          <div className="p-5 border-b border-white/5 flex items-center justify-between">
            <h2 className="text-sm font-semibold text-white">All Tickets</h2>
            <div className="flex items-center gap-2">
              {["All", "Open", "Pending", "Resolved"].map((s) => (
                <button
                  key={s}
                  className={`px-3 py-1.5 rounded-lg text-xs transition-all ${s === "All" ? "bg-amber-500/15 text-amber-400 border border-amber-500/25" : "text-white/30 hover:text-white/60 hover:bg-white/5"}`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
          <div className="divide-y divide-white/5">
            {tickets.map((ticket) => {
              const status = statusConfig[ticket.status] ?? statusConfig.open;
              const priority = priorityConfig[ticket.priority] ?? priorityConfig.low;
              return (
                <div
                  key={ticket.id}
                  className="flex items-center justify-between px-5 py-4 hover:bg-white/2 transition-colors cursor-pointer group"
                >
                  <div className="flex items-start gap-3 flex-1 min-w-0">
                    <div className="w-8 h-8 rounded-xl bg-amber-600/20 flex items-center justify-center shrink-0 mt-0.5">
                      <Headphones className="w-4 h-4 text-amber-400" />
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 mb-0.5">
                        <span className="text-[10px] text-white/25 font-mono">{ticket.id}</span>
                        <span className={`text-[10px] font-semibold ${priority.color}`}>{priority.label} Priority</span>
                      </div>
                      <div className="text-sm font-medium text-white truncate">{ticket.subject}</div>
                      <div className="flex items-center gap-3 mt-1 text-xs text-white/30">
                        <span className="flex items-center gap-1">
                          <Building2 className="w-3 h-3" /> {ticket.tenant}
                        </span>
                        <span className="flex items-center gap-1">
                          <User className="w-3 h-3" /> {ticket.email}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 shrink-0 ml-4">
                    <div className="text-right">
                      <div className="text-xs text-white/20">Opened {ticket.created}</div>
                      {ticket.lastReply !== "—" && (
                        <div className="text-xs text-white/15">Last reply {ticket.lastReply}</div>
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
        </div>

        {/* Coming soon note */}
        <div className="glass-card p-5 flex items-center gap-3 border-amber-500/15">
          <div className="w-8 h-8 rounded-xl bg-amber-500/15 flex items-center justify-center shrink-0">
            <AlertCircle className="w-4 h-4 text-amber-400" />
          </div>
          <div>
            <div className="text-sm font-medium text-white">Support System Coming Soon</div>
            <div className="text-xs text-white/30 mt-0.5">
              Full ticket management with replies, assignments, SLA tracking, and email notifications will be available in the next update. Sample data shown above.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
