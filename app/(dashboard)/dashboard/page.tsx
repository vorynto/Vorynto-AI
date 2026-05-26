import Header from "@/components/dashboard/Header";
import StatsCard from "@/components/dashboard/StatsCard";
import {
  Users, MessageSquare, Mail, TrendingUp,
  Bot, Mic, BarChart3, ArrowRight, CheckCircle2, Clock,
} from "lucide-react";
import Link from "next/link";

const stats = [
  {
    title: "Total Contacts",
    value: "12,847",
    change: 12.5,
    changeLabel: "vs last month",
    icon: Users,
    iconColor: "text-violet-400",
    iconBg: "bg-violet-600/20",
  },
  {
    title: "Messages Sent",
    value: "45,291",
    change: 8.3,
    changeLabel: "this month",
    icon: MessageSquare,
    iconColor: "text-emerald-400",
    iconBg: "bg-emerald-600/20",
  },
  {
    title: "Active Campaigns",
    value: "7",
    change: 2,
    changeLabel: "running now",
    icon: Mail,
    iconColor: "text-cyan-400",
    iconBg: "bg-cyan-600/20",
  },
  {
    title: "Revenue Tracked",
    value: "$284,510",
    change: 24.8,
    changeLabel: "from CRM deals",
    icon: TrendingUp,
    iconColor: "text-amber-400",
    iconBg: "bg-amber-600/20",
  },
];

const recentActivity = [
  { icon: MessageSquare, text: "WhatsApp bot handled 124 conversations", time: "2m ago", color: "text-emerald-400" },
  { icon: Users, text: "15 new contacts added from campaign", time: "18m ago", color: "text-violet-400" },
  { icon: Mail, text: "Email campaign 'Summer Sale' sent to 2,450 contacts", time: "1h ago", color: "text-cyan-400" },
  { icon: BarChart3, text: "Meta Ads budget auto-optimized — ROAS improved 12%", time: "3h ago", color: "text-blue-400" },
  { icon: Mic, text: "Voice bot completed 8 appointment bookings", time: "5h ago", color: "text-pink-400" },
];

const aiModules = [
  { name: "WhatsApp Bot", status: "active", conversations: 1240, icon: MessageSquare, color: "emerald", href: "/whatsapp" },
  { name: "Website Chatbot", status: "active", conversations: 892, icon: Bot, color: "violet", href: "/chatbot" },
  { name: "Voice Bot", status: "active", conversations: 156, icon: Mic, color: "pink", href: "/voice-bot" },
  { name: "Meta Ads AI", status: "active", conversations: 8, icon: BarChart3, color: "blue", href: "/meta-ads" },
];

const colorMap: Record<string, { text: string; bg: string; dot: string }> = {
  emerald: { text: "text-emerald-400", bg: "bg-emerald-600/20", dot: "bg-emerald-400" },
  violet: { text: "text-violet-400", bg: "bg-violet-600/20", dot: "bg-violet-400" },
  pink: { text: "text-pink-400", bg: "bg-pink-600/20", dot: "bg-pink-400" },
  blue: { text: "text-blue-400", bg: "bg-blue-600/20", dot: "bg-blue-400" },
};

export default function DashboardPage() {
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
          {/* AI Modules status */}
          <div className="xl:col-span-2">
            <div className="glass-card p-6">
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-base font-semibold text-white">Active AI Modules</h2>
                <Link href="/settings" className="text-xs text-violet-400 hover:text-violet-300 flex items-center gap-1">
                  Manage <ArrowRight className="w-3 h-3" />
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
                        <div className={`w-9 h-9 rounded-xl ${colors.bg} flex items-center justify-center`}>
                          <module.icon className={`w-4 h-4 ${colors.text}`} />
                        </div>
                        <div>
                          <div className="text-sm font-medium text-white">{module.name}</div>
                          <div className="flex items-center gap-1.5 mt-0.5">
                            <span className={`w-1.5 h-1.5 rounded-full ${colors.dot} animate-pulse`} />
                            <span className="text-xs text-white/40">{module.conversations} interactions today</span>
                          </div>
                        </div>
                      </div>
                      <ArrowRight className="w-4 h-4 text-white/20 group-hover:text-white/40 transition-colors" />
                    </Link>
                  );
                })}
              </div>
            </div>

            {/* Revenue chart placeholder */}
            <div className="glass-card p-6 mt-4">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-base font-semibold text-white">Revenue Pipeline</h2>
                <div className="flex gap-2">
                  {["7d", "30d", "90d"].map((range, i) => (
                    <button
                      key={range}
                      className={`px-2.5 py-1 text-xs rounded-lg transition-colors ${
                        i === 1 ? "bg-violet-600/20 text-violet-300" : "text-white/30 hover:text-white/60"
                      }`}
                    >
                      {range}
                    </button>
                  ))}
                </div>
              </div>
              {/* Chart bars */}
              <div className="flex gap-1.5 items-end h-36">
                {[55, 72, 48, 85, 68, 92, 76, 88, 94, 71, 83, 100, 89, 95, 78].map((h, i) => (
                  <div
                    key={i}
                    className="flex-1 rounded-t-sm transition-all hover:opacity-80"
                    style={{
                      height: `${h}%`,
                      background: `linear-gradient(to top, rgba(124,58,237,0.8), rgba(6,182,212,0.3))`,
                    }}
                  />
                ))}
              </div>
              <div className="flex justify-between mt-2 text-xs text-white/30">
                <span>2 weeks ago</span>
                <span>Today</span>
              </div>
            </div>
          </div>

          {/* Activity feed */}
          <div>
            <div className="glass-card p-6 h-full">
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-base font-semibold text-white">Recent Activity</h2>
                <button className="text-xs text-violet-400 hover:text-violet-300">View all</button>
              </div>
              <div className="space-y-4">
                {recentActivity.map((activity, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <div className="w-7 h-7 rounded-lg bg-white/5 flex items-center justify-center shrink-0 mt-0.5">
                      <activity.icon className={`w-3.5 h-3.5 ${activity.color}`} />
                    </div>
                    <div className="flex-1">
                      <p className="text-xs text-white/60 leading-relaxed">{activity.text}</p>
                      <div className="flex items-center gap-1 mt-1 text-xs text-white/25">
                        <Clock className="w-3 h-3" />
                        {activity.time}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Quick actions */}
              <div className="mt-6 pt-4 border-t border-white/5">
                <p className="text-xs font-medium text-white/40 mb-3">Quick Actions</p>
                <div className="space-y-2">
                  {[
                    { label: "Create new campaign", href: "/campaigns" },
                    { label: "Add CRM contact", href: "/crm" },
                    { label: "Review chatbot conversations", href: "/whatsapp" },
                  ].map((action) => (
                    <Link
                      key={action.label}
                      href={action.href}
                      className="flex items-center justify-between py-2 px-3 rounded-lg hover:bg-white/5 transition-colors group"
                    >
                      <span className="text-xs text-white/50 group-hover:text-white/70">{action.label}</span>
                      <ArrowRight className="w-3 h-3 text-white/20 group-hover:text-white/40" />
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* CRM quick view */}
        <div className="glass-card p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-base font-semibold text-white">Top Deals in Pipeline</h2>
            <Link href="/crm" className="text-xs text-violet-400 hover:text-violet-300 flex items-center gap-1">
              Open CRM <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/5">
                  {["Contact", "Company", "Deal Value", "Stage", "Probability", "Status"].map((h) => (
                    <th key={h} className="text-left py-2 px-3 text-xs font-medium text-white/30 first:pl-0">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {[
                  { contact: "Sarah Johnson", company: "TechCorp Inc.", value: "$45,000", stage: "Proposal", prob: 70 },
                  { contact: "Marcus Lee", company: "RetailPlus", value: "$28,500", stage: "Negotiation", prob: 85 },
                  { contact: "Emma Wilson", company: "StartupX", value: "$12,000", stage: "Qualified", prob: 40 },
                  { contact: "David Kim", company: "BigBrand Ltd", value: "$95,000", stage: "Proposal", prob: 60 },
                ].map((deal) => (
                  <tr key={deal.contact} className="hover:bg-white/2 transition-colors">
                    <td className="py-3 pl-0 pr-3">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-lg bg-violet-600/20 flex items-center justify-center text-xs font-semibold text-violet-400">
                          {deal.contact[0]}
                        </div>
                        <span className="text-sm text-white">{deal.contact}</span>
                      </div>
                    </td>
                    <td className="py-3 px-3 text-sm text-white/50">{deal.company}</td>
                    <td className="py-3 px-3 text-sm font-semibold text-white">{deal.value}</td>
                    <td className="py-3 px-3">
                      <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-violet-600/15 text-violet-300 border border-violet-500/20">
                        {deal.stage}
                      </span>
                    </td>
                    <td className="py-3 px-3">
                      <div className="flex items-center gap-2">
                        <div className="flex-1 h-1.5 bg-white/10 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-violet-600 to-cyan-500 rounded-full"
                            style={{ width: `${deal.prob}%` }}
                          />
                        </div>
                        <span className="text-xs text-white/40">{deal.prob}%</span>
                      </div>
                    </td>
                    <td className="py-3 px-3">
                      <div className="flex items-center gap-1.5 text-xs text-emerald-400">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        Active
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
