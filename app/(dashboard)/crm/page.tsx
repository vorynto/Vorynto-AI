import Header from "@/components/dashboard/Header";
import StatsCard from "@/components/dashboard/StatsCard";
import { Users, UserPlus, TrendingUp, Target, Search, Filter, MoreHorizontal, Mail, Phone, MessageSquare } from "lucide-react";

const contacts = [
  { name: "Sarah Johnson", company: "TechCorp Inc.", email: "sarah@techcorp.com", phone: "+1 555-0101", status: "active", source: "Website", tags: ["hot-lead", "enterprise"], lastContact: "2h ago" },
  { name: "Marcus Lee", company: "RetailPlus", email: "marcus@retailplus.com", phone: "+1 555-0102", status: "active", source: "WhatsApp", tags: ["follow-up"], lastContact: "1d ago" },
  { name: "Emma Wilson", company: "StartupX", email: "emma@startupx.io", phone: "+1 555-0103", status: "active", source: "Meta Ads", tags: ["new"], lastContact: "3d ago" },
  { name: "David Kim", company: "BigBrand Ltd", email: "david@bigbrand.com", phone: "+1 555-0104", status: "inactive", source: "Referral", tags: ["vip"], lastContact: "1w ago" },
  { name: "Priya Sharma", company: "FinTech Pro", email: "priya@fintechpro.com", phone: "+91 98765-43210", status: "active", source: "Campaign", tags: ["warm-lead"], lastContact: "5h ago" },
];

const stages = [
  { name: "Lead", count: 84, value: "$124,500", color: "bg-violet-600/20 border-violet-500/20 text-violet-300" },
  { name: "Qualified", count: 32, value: "$89,000", color: "bg-blue-600/20 border-blue-500/20 text-blue-300" },
  { name: "Proposal", count: 18, value: "$245,000", color: "bg-cyan-600/20 border-cyan-500/20 text-cyan-300" },
  { name: "Negotiation", count: 9, value: "$312,000", color: "bg-amber-600/20 border-amber-500/20 text-amber-300" },
  { name: "Won", count: 127, value: "$1.2M", color: "bg-emerald-600/20 border-emerald-500/20 text-emerald-300" },
];

export default function CRMPage() {
  return (
    <div>
      <Header
        title="AI CRM"
        subtitle="Manage contacts, deals, and customer relationships"
        action={
          <button className="btn-primary text-sm py-2 px-4">
            <UserPlus className="w-4 h-4" />
            Add Contact
          </button>
        }
      />

      <div className="p-6 space-y-6">
        {/* Stats */}
        <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
          <StatsCard title="Total Contacts" value="12,847" change={12.5} icon={Users} iconColor="text-violet-400" iconBg="bg-violet-600/20" />
          <StatsCard title="New This Month" value="284" change={8.2} icon={UserPlus} iconColor="text-emerald-400" iconBg="bg-emerald-600/20" />
          <StatsCard title="Open Deals" value="143" change={5.1} icon={Target} iconColor="text-amber-400" iconBg="bg-amber-600/20" />
          <StatsCard title="Win Rate" value="68%" change={3.2} icon={TrendingUp} iconColor="text-cyan-400" iconBg="bg-cyan-600/20" />
        </div>

        {/* Pipeline stages */}
        <div className="glass-card p-5">
          <h2 className="text-sm font-semibold text-white mb-4">Deal Pipeline</h2>
          <div className="grid grid-cols-5 gap-3">
            {stages.map((stage) => (
              <div key={stage.name} className={`border rounded-xl p-4 ${stage.color}`}>
                <div className="text-xs font-semibold mb-3">{stage.name}</div>
                <div className="text-2xl font-bold text-white mb-0.5">{stage.count}</div>
                <div className="text-xs opacity-70">{stage.value}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Contacts table */}
        <div className="glass-card p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-base font-semibold text-white">Contacts</h2>
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-2 px-3 py-1.5 bg-white/5 border border-white/5 rounded-lg">
                <Search className="w-4 h-4 text-white/30" />
                <input type="text" placeholder="Search contacts..." className="bg-transparent text-sm text-white/60 placeholder:text-white/30 outline-none w-40" />
              </div>
              <button className="flex items-center gap-1.5 px-3 py-1.5 border border-white/10 rounded-lg text-xs text-white/50 hover:bg-white/5 transition-all">
                <Filter className="w-3.5 h-3.5" />
                Filter
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/5">
                  {["Contact", "Email", "Phone", "Source", "Tags", "Last Contact", ""].map((h) => (
                    <th key={h} className="text-left py-2 px-3 text-xs font-medium text-white/30 first:pl-0">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {contacts.map((contact) => (
                  <tr key={contact.email} className="hover:bg-white/2 transition-colors group">
                    <td className="py-3 pl-0 pr-3">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-xl bg-violet-600/20 flex items-center justify-center text-xs font-bold text-violet-400">
                          {contact.name[0]}
                        </div>
                        <div>
                          <div className="text-sm font-medium text-white">{contact.name}</div>
                          <div className="text-xs text-white/40">{contact.company}</div>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-3 text-xs text-white/50">{contact.email}</td>
                    <td className="py-3 px-3 text-xs text-white/50">{contact.phone}</td>
                    <td className="py-3 px-3 text-xs text-white/50">{contact.source}</td>
                    <td className="py-3 px-3">
                      <div className="flex gap-1 flex-wrap">
                        {contact.tags.map((tag) => (
                          <span key={tag} className="px-2 py-0.5 rounded-full text-xs bg-white/5 text-white/40 border border-white/5">
                            {tag}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="py-3 px-3 text-xs text-white/40">{contact.lastContact}</td>
                    <td className="py-3 px-3">
                      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button className="w-7 h-7 rounded-lg hover:bg-white/5 flex items-center justify-center text-white/40 hover:text-white/60 transition-colors" title="Email">
                          <Mail className="w-3.5 h-3.5" />
                        </button>
                        <button className="w-7 h-7 rounded-lg hover:bg-white/5 flex items-center justify-center text-white/40 hover:text-white/60 transition-colors" title="WhatsApp">
                          <MessageSquare className="w-3.5 h-3.5" />
                        </button>
                        <button className="w-7 h-7 rounded-lg hover:bg-white/5 flex items-center justify-center text-white/40 hover:text-white/60 transition-colors" title="Call">
                          <Phone className="w-3.5 h-3.5" />
                        </button>
                        <button className="w-7 h-7 rounded-lg hover:bg-white/5 flex items-center justify-center text-white/40 hover:text-white/60 transition-colors">
                          <MoreHorizontal className="w-3.5 h-3.5" />
                        </button>
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
