import Header from "@/components/dashboard/Header";
import StatsCard from "@/components/dashboard/StatsCard";
import { createAdminClient } from "@/lib/supabase/server";
import { createClient } from "@/lib/supabase/server";
import { getCurrentTenantId } from "@/lib/tenant-keys";
import {
  Users, MessageSquare, Mail, TrendingUp,
  Bot, Mic, BarChart3, ArrowRight, CheckCircle2, Clock,
  Search, Globe,
} from "lucide-react";
import Link from "next/link";

const colorMap: Record<string, { text: string; bg: string; dot: string }> = {
  emerald: { text: "text-emerald-400", bg: "bg-emerald-600/20", dot: "bg-emerald-400" },
  violet: { text: "text-violet-400", bg: "bg-violet-600/20", dot: "bg-violet-400" },
  pink: { text: "text-pink-400", bg: "bg-pink-600/20", dot: "bg-pink-400" },
  blue: { text: "text-blue-400", bg: "bg-blue-600/20", dot: "bg-blue-400" },
  cyan: { text: "text-cyan-400", bg: "bg-cyan-600/20", dot: "bg-cyan-400" },
  amber: { text: "text-amber-400", bg: "bg-amber-600/20", dot: "bg-amber-400" },
};

const stageColors: Record<string, string> = {
  lead: "bg-violet-600/15 text-violet-300 border-violet-500/20",
  qualified: "bg-blue-600/15 text-blue-300 border-blue-500/20",
  proposal: "bg-cyan-600/15 text-cyan-300 border-cyan-500/20",
  negotiation: "bg-amber-600/15 text-amber-300 border-amber-500/20",
  won: "bg-emerald-600/15 text-emerald-300 border-emerald-500/20",
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

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const tenantId = user ? await getCurrentTenantId(user.id) : null;
  const admin = await createAdminClient();

  type Contact = { id: string; created_at: string | null };
  type Campaign = { id: string; status: string | null; sent_count: number | null };
  type Deal = { id: string; title: string; value: number | null; stage: string | null; probability: number | null };
  type Activity = { id: string; type: string; title: string | null; created_at: string | null };
  type WaConv = { id: string; is_resolved: boolean | null; is_ai_active: boolean | null };
  type ChatbotCfg = { id: string; name: string; is_active: boolean | null };

  let contactList: Contact[] = [];
  let campaignList: Campaign[] = [];
  let dealList: Deal[] = [];
  let activityList: Activity[] = [];
  let waConvList: WaConv[] = [];
  let chatbotList: ChatbotCfg[] = [];

  if (tenantId) {
    const [c, ca, d, ac, wa, cb] = await Promise.all([
      admin.from("crm_contacts").select("id, created_at").eq("tenant_id", tenantId)
        .returns<Contact[]>(),
      admin.from("campaigns").select("id, status, sent_count").eq("tenant_id", tenantId)
        .returns<Campaign[]>(),
      admin.from("crm_deals").select("id, title, value, stage, probability")
        .eq("tenant_id", tenantId).not("stage", "in", "(won,lost)")
        .order("value", { ascending: false }).limit(5).returns<Deal[]>(),
      admin.from("crm_activities").select("id, type, title, created_at")
        .eq("tenant_id", tenantId).order("created_at", { ascending: false })
        .limit(6).returns<Activity[]>(),
      admin.from("whatsapp_conversations").select("id, is_resolved, is_ai_active")
        .eq("tenant_id", tenantId).returns<WaConv[]>(),
      admin.from("chatbot_configs").select("id, name, is_active")
        .eq("tenant_id", tenantId).returns<ChatbotCfg[]>(),
    ]);
    contactList = c.data ?? [];
    campaignList = ca.data ?? [];
    dealList = d.data ?? [];
    activityList = ac.data ?? [];
    waConvList = wa.data ?? [];
    chatbotList = cb.data ?? [];
  }

  const now = new Date();
  const thisMonthContacts = contactList.filter((c) => {
    if (!c.created_at) return false;
    const d = new Date(c.created_at);
    return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
  }).length;

  const activeCampaigns = campaignList.filter((c) => c.status === "sending" || c.status === "scheduled").length;
  const totalMessagesSent = campaignList.reduce((s, c) => s + (c.sent_count ?? 0), 0);
  const pipelineValue = dealList.reduce((s, d) => s + (d.value ?? 0), 0);
  const activeWa = waConvList.filter((c) => !c.is_resolved).length;
  const aiHandled = waConvList.filter((c) => c.is_ai_active).length;

  const stats = [
    { title: "Total Contacts", value: contactList.length.toLocaleString(), change: thisMonthContacts, changeLabel: "added this month", icon: Users, iconColor: "text-violet-400", iconBg: "bg-violet-600/20" },
    { title: "Messages Sent", value: totalMessagesSent.toLocaleString(), change: activeCampaigns, changeLabel: "campaigns active", icon: MessageSquare, iconColor: "text-emerald-400", iconBg: "bg-emerald-600/20" },
    { title: "Pipeline Value", value: pipelineValue >= 1000000 ? `$${(pipelineValue / 1000000).toFixed(1)}M` : `$${pipelineValue.toLocaleString()}`, change: dealList.length, changeLabel: "open deals", icon: TrendingUp, iconColor: "text-amber-400", iconBg: "bg-amber-600/20" },
    { title: "Active Campaigns", value: activeCampaigns.toString(), change: campaignList.length, changeLabel: "total campaigns", icon: Mail, iconColor: "text-cyan-400", iconBg: "bg-cyan-600/20" },
  ];

  const aiModules = [
    { name: "WhatsApp Bot", status: activeWa > 0 ? "active" : "idle", metric: `${activeWa} active · ${aiHandled} AI-handled`, icon: MessageSquare, color: "emerald", href: "/whatsapp" },
    { name: "Website Chatbot", status: chatbotList.some((c) => c.is_active) ? "active" : "idle", metric: `${chatbotList.length} chatbot(s)`, icon: Bot, color: "violet", href: "/chatbot" },
    { name: "Voice Bot", status: "idle", metric: "Manage voice calls", icon: Mic, color: "pink", href: "/voice-bot" },
    { name: "Bulk Campaigns", status: activeCampaigns > 0 ? "active" : "idle", metric: `${campaignList.length} campaigns total`, icon: BarChart3, color: "blue", href: "/campaigns" },
    { name: "AI SEO", status: "active", metric: "Projects & keywords", icon: Search, color: "cyan", href: "/seo" },
    { name: "Website Builder", status: "active", metric: "AI-powered sites", icon: Globe, color: "amber", href: "/website-builder" },
  ];

  const activityIcons: Record<string, { icon: typeof MessageSquare; color: string }> = {
    call: { icon: Mic, color: "text-pink-400" },
    email: { icon: Mail, color: "text-cyan-400" },
    meeting: { icon: Users, color: "text-violet-400" },
    note: { icon: MessageSquare, color: "text-amber-400" },
    task: { icon: CheckCircle2, color: "text-emerald-400" },
  };

  return (
    <div>
      <Header
        title="Dashboard"
        subtitle="Welcome back! Here is your business at a glance."
        action={
          <Link href="/campaigns" className="btn-primary text-sm py-2 px-4">
            <Mail className="w-4 h-4" />
            New Campaign
          </Link>
        }
      />

      <div className="p-6 space-y-6">
        {/* Stats grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
          {stats.map((stat) => (
            <StatsCard key={stat.title} {...stat} />
          ))}
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          {/* AI Modules + Pipeline chart */}
          <div className="xl:col-span-2 space-y-4">
            <div className="glass-card p-6">
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-base font-semibold text-white">AI Modules</h2>
                <Link href="/settings" className="text-xs text-violet-400 hover:text-violet-300 flex items-center gap-1">
                  Configure <ArrowRight className="w-3 h-3" />
                </Link>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {aiModules.map((module) => {
                  const colors = colorMap[module.color];
                  return (
                    <Link
                      key={module.name}
                      href={module.href}
                      className="flex items-center justify-between p-4 rounded-xl bg-white/3 hover:bg-white/5 border border-white/5 hover:border-white/10 transition-all group"
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-9 h-9 rounded-xl ${colors.bg} flex items-center justify-center shrink-0`}>
                          <module.icon className={`w-4 h-4 ${colors.text}`} />
                        </div>
                        <div>
                          <div className="text-sm font-medium text-white">{module.name}</div>
                          <div className="flex items-center gap-1.5 mt-0.5">
                            <span className={`w-1.5 h-1.5 rounded-full ${module.status === "active" ? colors.dot + " animate-pulse" : "bg-white/20"}`} />
                            <span className="text-xs text-white/40">{module.metric}</span>
                          </div>
                        </div>
                      </div>
                      <ArrowRight className="w-4 h-4 text-white/20 group-hover:text-white/40 transition-colors" />
                    </Link>
                  );
                })}
              </div>
            </div>

            {/* Pipeline bar chart */}
            <div className="glass-card p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-base font-semibold text-white">Deal Pipeline</h2>
                <span className="text-xs text-white/40">{dealList.length} open · ${pipelineValue.toLocaleString()} total</span>
              </div>
              {dealList.length > 0 ? (
                <div className="flex gap-2 items-end h-28">
                  {dealList.map((deal) => {
                    const maxVal = Math.max(...dealList.map((d) => d.value ?? 0), 1);
                    const pct = Math.max(12, Math.round(((deal.value ?? 0) / maxVal) * 100));
                    return (
                      <div key={deal.id} className="flex-1 flex flex-col items-center gap-1.5">
                        <div
                          className="w-full rounded-t-md"
                          style={{ height: `${pct}%`, background: "linear-gradient(to top, rgba(124,58,237,0.8), rgba(6,182,212,0.3))" }}
                        />
                        <span className="text-[10px] text-white/30 truncate w-full text-center">{deal.title.split(" ")[0]}</span>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="h-28 flex items-center justify-center">
                  <p className="text-sm text-white/20">No open deals yet — <Link href="/crm" className="text-violet-400 hover:underline">add deals in CRM</Link></p>
                </div>
              )}
            </div>
          </div>

          {/* Activity feed */}
          <div>
            <div className="glass-card p-6 h-full">
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-base font-semibold text-white">CRM Activity</h2>
                <Link href="/crm" className="text-xs text-violet-400 hover:text-violet-300">View all</Link>
              </div>

              {activityList.length === 0 ? (
                <div className="py-8 text-center">
                  <Clock className="w-8 h-8 text-white/10 mx-auto mb-2" />
                  <p className="text-xs text-white/30">No activity yet</p>
                  <Link href="/crm" className="text-xs text-violet-400 mt-2 inline-block">Start logging activity →</Link>
                </div>
              ) : (
                <div className="space-y-4">
                  {activityList.map((activity) => {
                    const cfg = activityIcons[activity.type] ?? activityIcons.note;
                    return (
                      <div key={activity.id} className="flex items-start gap-3">
                        <div className="w-7 h-7 rounded-lg bg-white/5 flex items-center justify-center shrink-0 mt-0.5">
                          <cfg.icon className={`w-3.5 h-3.5 ${cfg.color}`} />
                        </div>
                        <div className="flex-1">
                          <p className="text-xs text-white/60 leading-relaxed capitalize">{activity.title ?? activity.type}</p>
                          <div className="flex items-center gap-1 mt-1 text-xs text-white/25">
                            <Clock className="w-3 h-3" />
                            {timeAgo(activity.created_at)}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              <div className="mt-6 pt-4 border-t border-white/5">
                <p className="text-xs font-medium text-white/40 mb-3">Quick Actions</p>
                <div className="space-y-2">
                  {[
                    { label: "Create new campaign", href: "/campaigns" },
                    { label: "Add CRM contact", href: "/crm" },
                    { label: "Review WhatsApp chats", href: "/whatsapp" },
                  ].map((action) => (
                    <Link key={action.label} href={action.href} className="flex items-center justify-between py-2 px-3 rounded-lg hover:bg-white/5 transition-colors group">
                      <span className="text-xs text-white/50 group-hover:text-white/70">{action.label}</span>
                      <ArrowRight className="w-3 h-3 text-white/20 group-hover:text-white/40" />
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Top deals table */}
        <div className="glass-card p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-base font-semibold text-white">Top Deals in Pipeline</h2>
            <Link href="/crm" className="text-xs text-violet-400 hover:text-violet-300 flex items-center gap-1">
              Open CRM <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          {dealList.length === 0 ? (
            <div className="py-8 text-center">
              <TrendingUp className="w-10 h-10 text-white/10 mx-auto mb-3" />
              <p className="text-sm text-white/30 mb-2">No open deals yet</p>
              <Link href="/crm" className="text-xs text-violet-400 hover:text-violet-300">Add your first deal in CRM →</Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/5">
                    {["Deal", "Value", "Stage", "Probability"].map((h) => (
                      <th key={h} className="text-left py-2 px-3 text-xs font-medium text-white/30 first:pl-0">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {dealList.map((deal) => (
                    <tr key={deal.id} className="hover:bg-white/2 transition-colors">
                      <td className="py-3 pl-0 pr-3">
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 rounded-lg bg-violet-600/20 flex items-center justify-center text-xs font-semibold text-violet-400">
                            {deal.title[0].toUpperCase()}
                          </div>
                          <span className="text-sm text-white truncate max-w-48">{deal.title}</span>
                        </div>
                      </td>
                      <td className="py-3 px-3 text-sm font-semibold text-white">
                        {deal.value != null ? `$${deal.value.toLocaleString()}` : "—"}
                      </td>
                      <td className="py-3 px-3">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-medium border capitalize ${stageColors[deal.stage ?? "lead"] ?? stageColors.lead}`}>
                          {deal.stage ?? "Lead"}
                        </span>
                      </td>
                      <td className="py-3 px-3">
                        {deal.probability != null ? (
                          <div className="flex items-center gap-2">
                            <div className="flex-1 h-1.5 bg-white/10 rounded-full overflow-hidden w-24">
                              <div className="h-full bg-gradient-to-r from-violet-600 to-cyan-500 rounded-full" style={{ width: `${deal.probability}%` }} />
                            </div>
                            <span className="text-xs text-white/40">{deal.probability}%</span>
                          </div>
                        ) : <span className="text-xs text-white/30">—</span>}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
