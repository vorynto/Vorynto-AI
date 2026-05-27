import Header from "@/components/dashboard/Header";
import StatsCard from "@/components/dashboard/StatsCard";
import { createClient } from "@/lib/supabase/server";
import { getCurrentTenantId, hasRequiredKeys } from "@/lib/tenant-keys";
import { Mail, Send, Users, BarChart3, Plus, MessageSquare, Phone, Filter, Eye, MoreHorizontal, AlertTriangle, ArrowRight } from "lucide-react";
import Link from "next/link";

const campaigns = [
  { name: "Summer Sale Announcement", type: "email", status: "sent", recipients: 12450, sent: 12450, opened: 5490, clicked: 1820, date: "2025-05-20" },
  { name: "WhatsApp Flash Deal", type: "whatsapp", status: "sending", recipients: 3200, sent: 2100, opened: 2050, clicked: 890, date: "2025-05-26" },
  { name: "SMS Reminder - Appointment", type: "sms", status: "scheduled", recipients: 845, sent: 0, opened: 0, clicked: 0, date: "2025-05-27" },
  { name: "Product Launch Email", type: "email", status: "draft", recipients: 0, sent: 0, opened: 0, clicked: 0, date: "2025-05-28" },
  { name: "Re-engagement Campaign", type: "whatsapp", status: "paused", recipients: 5600, sent: 3200, opened: 3100, clicked: 1200, date: "2025-05-15" },
];

const typeConfig = {
  email: { icon: Mail, color: "text-cyan-400", bg: "bg-cyan-600/20", label: "Email" },
  whatsapp: { icon: MessageSquare, color: "text-emerald-400", bg: "bg-emerald-600/20", label: "WhatsApp" },
  sms: { icon: Phone, color: "text-amber-400", bg: "bg-amber-600/20", label: "SMS" },
};

const statusConfig: Record<string, string> = {
  sent: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  sending: "bg-blue-500/10 text-blue-400 border-blue-500/20",
  scheduled: "bg-violet-500/10 text-violet-400 border-violet-500/20",
  draft: "bg-white/5 text-white/40 border-white/10",
  paused: "bg-amber-500/10 text-amber-400 border-amber-500/20",
};

export default async function CampaignsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const tenantId = user ? await getCurrentTenantId(user.id) : null;

  const [hasWhatsApp, hasTwilio, hasSmtp] = tenantId
    ? await Promise.all([
        hasRequiredKeys(tenantId, "whatsapp", ["access_token", "phone_number_id"]),
        hasRequiredKeys(tenantId, "twilio", ["account_sid", "auth_token"]),
        hasRequiredKeys(tenantId, "smtp", ["host", "user", "pass"]),
      ])
    : [false, false, false];

  const missingProviders = [
    !hasWhatsApp && { label: "WhatsApp", desc: "WhatsApp campaigns", href: "/settings" },
    !hasTwilio && { label: "Twilio", desc: "SMS campaigns", href: "/settings" },
    !hasSmtp && { label: "Email (SMTP)", desc: "Email campaigns", href: "/settings" },
  ].filter(Boolean) as { label: string; desc: string; href: string }[];
  return (
    <div>
      {missingProviders.length > 0 && (
        <div className="mx-6 mt-6 p-4 rounded-xl border border-amber-500/20 bg-amber-500/5 flex gap-3">
          <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="text-sm font-semibold text-white mb-1">Some campaign channels are not configured</p>
            <p className="text-xs text-white/50 mb-3">
              Add the missing API keys in Settings to unlock all campaign types:
            </p>
            <div className="flex flex-wrap gap-2 mb-3">
              {missingProviders.map((p) => (
                <span key={p.label} className="px-2 py-0.5 text-[11px] rounded-md bg-white/5 border border-white/10 text-white/50">
                  {p.label} — {p.desc}
                </span>
              ))}
            </div>
            <Link href="/settings" className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-500/10 border border-amber-500/20 text-xs font-semibold text-amber-300 hover:bg-amber-500/20 transition-all">
              Configure in Settings <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      )}
      <Header
        title="Bulk Campaigns"
        subtitle="WhatsApp, SMS & Email campaigns at scale"
        action={
          <button className="btn-primary text-sm py-2 px-4">
            <Plus className="w-4 h-4" />
            New Campaign
          </button>
        }
      />

      <div className="p-6 space-y-6">
        {/* Stats */}
        <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
          <StatsCard title="Messages Sent" value="45,291" change={8.3} icon={Send} iconColor="text-violet-400" iconBg="bg-violet-600/20" />
          <StatsCard title="Avg Open Rate" value="44.1%" change={3.2} icon={Eye} iconColor="text-emerald-400" iconBg="bg-emerald-600/20" />
          <StatsCard title="Recipients Reached" value="21,645" change={15} icon={Users} iconColor="text-cyan-400" iconBg="bg-cyan-600/20" />
          <StatsCard title="Click Rate" value="14.6%" change={2.1} icon={BarChart3} iconColor="text-amber-400" iconBg="bg-amber-600/20" />
        </div>

        {/* Campaign type quick create */}
        <div className="grid grid-cols-3 gap-4">
          {[
            { type: "email", label: "Email Campaign", desc: "Rich HTML emails with analytics", color: "from-cyan-600/20", iconColor: "text-cyan-400", bg: "bg-cyan-600/20" },
            { type: "whatsapp", label: "WhatsApp Broadcast", desc: "Personalized WhatsApp messages", color: "from-emerald-600/20", iconColor: "text-emerald-400", bg: "bg-emerald-600/20" },
            { type: "sms", label: "SMS Campaign", desc: "High-deliverability text messages", color: "from-amber-600/20", iconColor: "text-amber-400", bg: "bg-amber-600/20" },
          ].map((t) => {
            const config = typeConfig[t.type as keyof typeof typeConfig];
            return (
              <button key={t.type} className={`glass-card-hover p-5 text-left bg-gradient-to-br ${t.color} to-transparent`}>
                <div className={`w-10 h-10 rounded-xl ${t.bg} flex items-center justify-center mb-3`}>
                  <config.icon className={`w-5 h-5 ${t.iconColor}`} />
                </div>
                <div className="text-sm font-semibold text-white mb-1">{t.label}</div>
                <div className="text-xs text-white/40">{t.desc}</div>
              </button>
            );
          })}
        </div>

        {/* Campaigns table */}
        <div className="glass-card p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-base font-semibold text-white">All Campaigns</h2>
            <button className="flex items-center gap-1.5 px-3 py-1.5 border border-white/10 rounded-lg text-xs text-white/50 hover:bg-white/5 transition-all">
              <Filter className="w-3.5 h-3.5" />
              Filter
            </button>
          </div>

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
                {campaigns.map((c) => {
                  const type = typeConfig[c.type as keyof typeof typeConfig];
                  return (
                    <tr key={c.name} className="hover:bg-white/2 transition-colors">
                      <td className="py-3 pl-0 pr-3 text-sm font-medium text-white max-w-[200px] truncate">{c.name}</td>
                      <td className="py-3 px-3">
                        <div className={`flex items-center gap-1.5 w-fit px-2.5 py-1 rounded-full ${type.bg}`}>
                          <type.icon className={`w-3 h-3 ${type.color}`} />
                          <span className={`text-xs ${type.color}`}>{type.label}</span>
                        </div>
                      </td>
                      <td className="py-3 px-3">
                        <span className={`px-2.5 py-1 rounded-full text-xs border capitalize ${statusConfig[c.status]}`}>
                          {c.status}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-sm text-white/60">{c.recipients.toLocaleString()}</td>
                      <td className="py-3 px-3 text-sm text-white/60">{c.sent.toLocaleString()}</td>
                      <td className="py-3 px-3 text-sm text-white/60">
                        {c.opened > 0 ? `${((c.opened / c.sent) * 100).toFixed(1)}%` : "—"}
                      </td>
                      <td className="py-3 px-3 text-sm text-white/60">
                        {c.clicked > 0 ? `${((c.clicked / c.sent) * 100).toFixed(1)}%` : "—"}
                      </td>
                      <td className="py-3 px-3 text-xs text-white/40">{c.date}</td>
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
        </div>
      </div>
    </div>
  );
}
