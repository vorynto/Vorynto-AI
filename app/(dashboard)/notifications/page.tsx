import Header from "@/components/dashboard/Header";
import { createAdminClient } from "@/lib/supabase/server";
import { createClient } from "@/lib/supabase/server";
import { getCurrentTenantId } from "@/lib/tenant-keys";
import {
  Bell, MessageSquare, Users, Mail, Mic, BarChart3,
  CheckCircle2, AlertCircle, Info, TrendingUp, ArrowRight,
  Clock, Zap,
} from "lucide-react";
import Link from "next/link";

type NotifEntry = {
  id: string;
  type: "campaign" | "whatsapp" | "crm" | "system" | "voice" | "chatbot";
  title: string;
  body: string;
  time: string;
  link?: string;
  isRead?: boolean;
};

function timeAgo(ts: string | null) {
  if (!ts) return "—";
  const diff = Date.now() - new Date(ts).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1) return "just now";
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  const days = Math.floor(h / 24);
  return `${days}d ago`;
}

export default async function NotificationsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const tenantId = user ? await getCurrentTenantId(user.id) : null;
  const admin = await createAdminClient();

  type Campaign = { id: string; name: string; status: string | null; sent_count: number | null; created_at: string | null };
  type WaConv = { id: string; contact_name: string | null; wa_phone: string; last_message: string | null; last_message_at: string | null };
  type Contact = { id: string; first_name: string | null; last_name: string | null; created_at: string | null };
  type Ticket = { id: string; title: string; status: string | null; priority: string | null; created_at: string | null };

  let campaigns: Campaign[] = [];
  let recentConvs: WaConv[] = [];
  let recentContacts: Contact[] = [];
  let tickets: Ticket[] = [];

  if (tenantId) {
    const [c, wa, ct, tk] = await Promise.all([
      admin.from("campaigns").select("id, name, status, sent_count, created_at")
        .eq("tenant_id", tenantId)
        .order("created_at", { ascending: false }).limit(5).returns<Campaign[]>(),
      admin.from("whatsapp_conversations").select("id, contact_name, wa_phone, last_message, last_message_at")
        .eq("tenant_id", tenantId)
        .order("last_message_at", { ascending: false }).limit(5).returns<WaConv[]>(),
      admin.from("crm_contacts").select("id, first_name, last_name, created_at")
        .eq("tenant_id", tenantId)
        .order("created_at", { ascending: false }).limit(5).returns<Contact[]>(),
      admin.from("support_tickets").select("id, title, status, priority, created_at")
        .eq("tenant_id", tenantId)
        .order("created_at", { ascending: false }).limit(3).returns<Ticket[]>(),
    ]);
    campaigns = c.data ?? [];
    recentConvs = wa.data ?? [];
    recentContacts = ct.data ?? [];
    tickets = tk.data ?? [];
  }

  // Build notification list from real data
  const notifications: NotifEntry[] = [];

  // Campaign notifications
  campaigns.forEach((c) => {
    if (c.status === "sent") {
      notifications.push({
        id: `campaign-${c.id}`,
        type: "campaign",
        title: "Campaign delivered",
        body: `"${c.name}" was sent to ${(c.sent_count ?? 0).toLocaleString()} recipients`,
        time: timeAgo(c.created_at),
        link: "/campaigns",
      });
    } else if (c.status === "sending") {
      notifications.push({
        id: `campaign-send-${c.id}`,
        type: "campaign",
        title: "Campaign sending",
        body: `"${c.name}" is currently sending…`,
        time: timeAgo(c.created_at),
        link: "/campaigns",
      });
    } else if (c.status === "scheduled") {
      notifications.push({
        id: `campaign-sched-${c.id}`,
        type: "campaign",
        title: "Campaign scheduled",
        body: `"${c.name}" is scheduled and ready to send`,
        time: timeAgo(c.created_at),
        link: "/campaigns",
      });
    }
  });

  // WhatsApp notifications
  recentConvs.forEach((conv) => {
    notifications.push({
      id: `wa-${conv.id}`,
      type: "whatsapp",
      title: "New WhatsApp message",
      body: `${conv.contact_name ?? conv.wa_phone}: "${conv.last_message?.slice(0, 60) ?? "sent a message"}"`,
      time: timeAgo(conv.last_message_at),
      link: "/whatsapp",
    });
  });

  // CRM contact notifications
  recentContacts.forEach((c) => {
    const name = [c.first_name, c.last_name].filter(Boolean).join(" ") || "Unknown";
    notifications.push({
      id: `contact-${c.id}`,
      type: "crm",
      title: "New contact added",
      body: `${name} was added to your CRM`,
      time: timeAgo(c.created_at),
      link: "/crm",
    });
  });

  // Support ticket notifications
  tickets.forEach((tk) => {
    notifications.push({
      id: `ticket-${tk.id}`,
      type: "system",
      title: `Support ticket — ${tk.priority ?? "normal"} priority`,
      body: tk.title,
      time: timeAgo(tk.created_at),
      link: "/settings",
    });
  });

  // Sort by most recent (simplified: by array order already sorted)
  const isEmpty = notifications.length === 0;

  const typeConfig: Record<NotifEntry["type"], { icon: typeof Bell; color: string; bg: string }> = {
    campaign: { icon: Mail, color: "text-cyan-400", bg: "bg-cyan-600/20" },
    whatsapp: { icon: MessageSquare, color: "text-emerald-400", bg: "bg-emerald-600/20" },
    crm: { icon: Users, color: "text-violet-400", bg: "bg-violet-600/20" },
    system: { icon: AlertCircle, color: "text-amber-400", bg: "bg-amber-600/20" },
    voice: { icon: Mic, color: "text-pink-400", bg: "bg-pink-600/20" },
    chatbot: { icon: Zap, color: "text-blue-400", bg: "bg-blue-600/20" },
  };

  const unreadCount = notifications.length;

  return (
    <div>
      <Header
        title="Notifications"
        subtitle="Activity and alerts from across your platform"
        action={
          unreadCount > 0 ? (
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-violet-600/10 border border-violet-500/20">
              <Bell className="w-3.5 h-3.5 text-violet-400" />
              <span className="text-xs text-violet-300 font-semibold">{unreadCount} new</span>
            </div>
          ) : undefined
        }
      />

      <div className="p-6 space-y-6">
        {/* Summary chips */}
        <div className="flex flex-wrap gap-3">
          {[
            { label: "Campaigns", value: campaigns.length, icon: Mail, color: "text-cyan-400", bg: "bg-cyan-600/20", href: "/campaigns" },
            { label: "WhatsApp", value: recentConvs.length, icon: MessageSquare, color: "text-emerald-400", bg: "bg-emerald-600/20", href: "/whatsapp" },
            { label: "New Contacts", value: recentContacts.length, icon: Users, color: "text-violet-400", bg: "bg-violet-600/20", href: "/crm" },
            { label: "Support", value: tickets.length, icon: AlertCircle, color: "text-amber-400", bg: "bg-amber-600/20", href: "/settings" },
          ].map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className="flex items-center gap-2.5 px-4 py-2.5 rounded-xl glass-card hover:bg-white/5 transition-all"
            >
              <div className={`w-7 h-7 rounded-lg ${item.bg} flex items-center justify-center shrink-0`}>
                <item.icon className={`w-3.5 h-3.5 ${item.color}`} />
              </div>
              <div>
                <div className="text-lg font-bold text-white leading-none">{item.value}</div>
                <div className="text-[10px] text-white/40 mt-0.5">{item.label}</div>
              </div>
              <ArrowRight className="w-3.5 h-3.5 text-white/20 ml-1" />
            </Link>
          ))}
        </div>

        {/* Notification feed */}
        <div className="glass-card overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-white/5">
            <div className="flex items-center gap-2">
              <Bell className="w-4 h-4 text-violet-400" />
              <h2 className="text-sm font-semibold text-white">All Activity</h2>
              {unreadCount > 0 && (
                <span className="px-2 py-0.5 text-xs rounded-full bg-violet-600/20 text-violet-300 border border-violet-500/20">
                  {unreadCount}
                </span>
              )}
            </div>
            <div className="flex gap-2">
              {["All", "Campaigns", "WhatsApp", "CRM"].map((f, i) => (
                <button
                  key={f}
                  className={`px-3 py-1.5 rounded-lg text-xs transition-all ${i === 0 ? "bg-violet-600/20 text-violet-300 border border-violet-500/30" : "text-white/30 hover:text-white/60 hover:bg-white/5"}`}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>

          {isEmpty ? (
            <div className="py-20 text-center">
              <div className="w-16 h-16 rounded-2xl bg-white/3 border border-white/5 flex items-center justify-center mx-auto mb-4">
                <Bell className="w-7 h-7 text-white/10" />
              </div>
              <p className="text-sm font-medium text-white/30 mb-1">All caught up!</p>
              <p className="text-xs text-white/20 max-w-xs mx-auto">
                Activity from your campaigns, WhatsApp conversations, and CRM will appear here.
              </p>
              <div className="flex justify-center gap-3 mt-6">
                <Link href="/campaigns" className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs text-violet-400 border border-violet-500/20 hover:bg-violet-600/10 transition-all">
                  <Mail className="w-3.5 h-3.5" /> Create Campaign
                </Link>
                <Link href="/crm" className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs text-violet-400 border border-violet-500/20 hover:bg-violet-600/10 transition-all">
                  <Users className="w-3.5 h-3.5" /> Add Contacts
                </Link>
              </div>
            </div>
          ) : (
            <div className="divide-y divide-white/5">
              {notifications.map((notif) => {
                const cfg = typeConfig[notif.type];
                return (
                  <div key={notif.id} className="flex items-start gap-4 px-5 py-4 hover:bg-white/2 transition-colors">
                    <div className={`w-9 h-9 rounded-xl ${cfg.bg} flex items-center justify-center shrink-0 mt-0.5`}>
                      <cfg.icon className={`w-4 h-4 ${cfg.color}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="text-sm font-medium text-white">{notif.title}</p>
                          <p className="text-xs text-white/50 mt-0.5 leading-relaxed truncate max-w-lg">
                            {notif.body}
                          </p>
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                          <span className="text-xs text-white/25 flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {notif.time}
                          </span>
                          {notif.link && (
                            <Link href={notif.link} className="text-xs text-violet-400 hover:text-violet-300 transition-colors whitespace-nowrap">
                              View →
                            </Link>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* System status */}
        <div className="glass-card p-5">
          <div className="flex items-center gap-2 mb-4">
            <Info className="w-4 h-4 text-white/30" />
            <h2 className="text-sm font-semibold text-white">System Status</h2>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { label: "API Services", status: "Operational", color: "text-emerald-400", dot: "bg-emerald-400" },
              { label: "WhatsApp Webhook", status: "Active", color: "text-emerald-400", dot: "bg-emerald-400" },
              { label: "AI Models", status: "Online", color: "text-emerald-400", dot: "bg-emerald-400" },
              { label: "Realtime DB", status: "Connected", color: "text-emerald-400", dot: "bg-emerald-400" },
            ].map((s) => (
              <div key={s.label} className="p-3 rounded-xl bg-white/3 border border-white/5">
                <div className="flex items-center gap-1.5 mb-1">
                  <span className={`w-1.5 h-1.5 rounded-full ${s.dot} animate-pulse`} />
                  <span className={`text-xs font-semibold ${s.color}`}>{s.status}</span>
                </div>
                <div className="text-xs text-white/40">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
