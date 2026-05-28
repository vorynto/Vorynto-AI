"use client";

import { useState } from "react";
import { mutationClient } from "@/lib/supabase/client";
import { useRealtimeTable } from "@/lib/hooks/useRealtimeTable";
import StatsCard from "@/components/dashboard/StatsCard";
import {
  Users, UserPlus, TrendingUp, Target, Search, Filter,
  MoreHorizontal, Mail, Phone, MessageSquare, X, Wifi, WifiOff,
} from "lucide-react";

type Contact = {
  id: string;
  tenant_id: string;
  first_name: string | null;
  last_name: string | null;
  company: string | null;
  email: string | null;
  phone: string | null;
  status: string | null;
  source: string | null;
  tags: string[] | null;
  last_contact_at: string | null;
  created_at: string | null;
};

type Deal = {
  id: string;
  tenant_id: string;
  title: string;
  value: number | null;
  stage: string | null;
  probability: number | null;
  contact_id: string | null;
  created_at: string | null;
};

type Props = {
  tenantId: string;
  initialContacts: Contact[];
  initialDeals: Deal[];
};

const stages = [
  { key: "lead", name: "Lead", color: "bg-violet-600/20 border-violet-500/20 text-violet-300" },
  { key: "qualified", name: "Qualified", color: "bg-blue-600/20 border-blue-500/20 text-blue-300" },
  { key: "proposal", name: "Proposal", color: "bg-cyan-600/20 border-cyan-500/20 text-cyan-300" },
  { key: "negotiation", name: "Negotiation", color: "bg-amber-600/20 border-amber-500/20 text-amber-300" },
  { key: "won", name: "Won", color: "bg-emerald-600/20 border-emerald-500/20 text-emerald-300" },
];

function contactName(c: Contact) {
  return [c.first_name, c.last_name].filter(Boolean).join(" ") || c.email || "Unknown";
}

function timeAgo(ts: string | null) {
  if (!ts) return "—";
  const diff = Date.now() - new Date(ts).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  return `${Math.floor(h / 24)}d ago`;
}

export default function CRMClient({ tenantId, initialContacts, initialDeals }: Props) {
  const { data: contacts, connected } = useRealtimeTable<Contact>(
    "crm_contacts", tenantId, initialContacts
  );
  const { data: deals } = useRealtimeTable<Deal>(
    "crm_deals", tenantId, initialDeals
  );

  const [search, setSearch] = useState("");
  const [showAdd, setShowAdd] = useState(false);
  const [saving, setSaving] = useState(false);
  const [newContact, setNewContact] = useState({
    first_name: "", last_name: "", company: "", email: "", phone: "", source: "",
  });

  const filtered = contacts.filter(
    (c) => !search || contactName(c).toLowerCase().includes(search.toLowerCase()) ||
      (c.company ?? "").toLowerCase().includes(search.toLowerCase()) ||
      (c.email ?? "").toLowerCase().includes(search.toLowerCase())
  );

  const activeContacts = contacts.filter((c) => c.status === "active").length;
  const newThisMonth = contacts.filter((c) => {
    if (!c.created_at) return false;
    const d = new Date(c.created_at);
    const now = new Date();
    return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
  }).length;
  const openDeals = deals.filter((d) => d.stage !== "won" && d.stage !== "lost").length;

  async function addContact() {
    if (!newContact.email && !newContact.phone) return;
    setSaving(true);
    const db = mutationClient();
    await db.from("crm_contacts").insert({
      tenant_id: tenantId,
      first_name: newContact.first_name || null,
      last_name: newContact.last_name || null,
      company: newContact.company || null,
      email: newContact.email || null,
      phone: newContact.phone || null,
      source: newContact.source || null,
      status: "active",
    });
    setNewContact({ first_name: "", last_name: "", company: "", email: "", phone: "", source: "" });
    setShowAdd(false);
    setSaving(false);
  }

  return (
    <div>
      <div className="p-6 space-y-6">
        {/* Stats */}
        <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
          <StatsCard title="Total Contacts" value={contacts.length.toLocaleString()} icon={Users} iconColor="text-violet-400" iconBg="bg-violet-600/20" />
          <StatsCard title="New This Month" value={newThisMonth.toString()} icon={UserPlus} iconColor="text-emerald-400" iconBg="bg-emerald-600/20" />
          <StatsCard title="Open Deals" value={openDeals.toString()} icon={Target} iconColor="text-amber-400" iconBg="bg-amber-600/20" />
          <StatsCard title="Active Contacts" value={activeContacts.toString()} icon={TrendingUp} iconColor="text-cyan-400" iconBg="bg-cyan-600/20" />
        </div>

        {/* Deal Pipeline */}
        <div className="glass-card p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold text-white flex items-center gap-2">
              Deal Pipeline
              {connected ? (
                <span className="flex items-center gap-1 text-xs text-emerald-400"><Wifi className="w-3 h-3" /> Live</span>
              ) : (
                <span className="flex items-center gap-1 text-xs text-white/20"><WifiOff className="w-3 h-3" /></span>
              )}
            </h2>
          </div>
          <div className="grid grid-cols-5 gap-3">
            {stages.map((stage) => {
              const stageDeals = deals.filter((d) => d.stage === stage.key);
              const stageValue = stageDeals.reduce((a, d) => a + (d.value ?? 0), 0);
              return (
                <div key={stage.key} className={`border rounded-xl p-4 ${stage.color}`}>
                  <div className="text-xs font-semibold mb-3">{stage.name}</div>
                  <div className="text-2xl font-bold text-white mb-0.5">{stageDeals.length}</div>
                  <div className="text-xs opacity-70">
                    {stageValue >= 1000000 ? `$${(stageValue / 1000000).toFixed(1)}M` : `$${stageValue.toLocaleString()}`}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Contacts table */}
        <div className="glass-card p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-base font-semibold text-white">Contacts</h2>
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-2 px-3 py-1.5 bg-white/5 border border-white/5 rounded-lg">
                <Search className="w-4 h-4 text-white/30" />
                <input
                  type="text"
                  placeholder="Search contacts..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="bg-transparent text-sm text-white/60 placeholder:text-white/30 outline-none w-40"
                />
              </div>
              <button className="flex items-center gap-1.5 px-3 py-1.5 border border-white/10 rounded-lg text-xs text-white/50 hover:bg-white/5 transition-all">
                <Filter className="w-3.5 h-3.5" /> Filter
              </button>
              <button
                onClick={() => setShowAdd(!showAdd)}
                className="btn-primary text-xs py-1.5 px-3 flex items-center gap-1.5"
              >
                <UserPlus className="w-3.5 h-3.5" /> Add Contact
              </button>
            </div>
          </div>

          {/* Add contact form */}
          {showAdd && (
            <div className="mb-5 p-4 rounded-xl bg-violet-600/5 border border-violet-500/15">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-semibold text-white">Add New Contact</h3>
                <button onClick={() => setShowAdd(false)} className="text-white/30 hover:text-white/60">
                  <X className="w-4 h-4" />
                </button>
              </div>
              <div className="grid grid-cols-3 gap-3 mb-3">
                <input type="text" placeholder="First name" value={newContact.first_name} onChange={(e) => setNewContact({ ...newContact, first_name: e.target.value })} className="input-dark text-sm" />
                <input type="text" placeholder="Last name" value={newContact.last_name} onChange={(e) => setNewContact({ ...newContact, last_name: e.target.value })} className="input-dark text-sm" />
                <input type="text" placeholder="Company" value={newContact.company} onChange={(e) => setNewContact({ ...newContact, company: e.target.value })} className="input-dark text-sm" />
                <input type="email" placeholder="Email" value={newContact.email} onChange={(e) => setNewContact({ ...newContact, email: e.target.value })} className="input-dark text-sm" />
                <input type="tel" placeholder="Phone" value={newContact.phone} onChange={(e) => setNewContact({ ...newContact, phone: e.target.value })} className="input-dark text-sm" />
                <select value={newContact.source} onChange={(e) => setNewContact({ ...newContact, source: e.target.value })} className="input-dark bg-[#0f172a] text-sm">
                  <option value="">Source</option>
                  <option value="Website">Website</option>
                  <option value="WhatsApp">WhatsApp</option>
                  <option value="Campaign">Campaign</option>
                  <option value="Meta Ads">Meta Ads</option>
                  <option value="Referral">Referral</option>
                </select>
              </div>
              <button onClick={addContact} disabled={saving} className="btn-primary text-sm py-2 px-4">
                {saving ? "Adding…" : "Add Contact"}
              </button>
            </div>
          )}

          {filtered.length === 0 ? (
            <div className="py-10 text-center">
              <Users className="w-10 h-10 text-white/10 mx-auto mb-3" />
              <p className="text-sm text-white/30">
                {search ? "No contacts match your search" : "No contacts yet — add your first one above"}
              </p>
            </div>
          ) : (
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
                  {filtered.map((contact) => (
                    <tr key={contact.id} className="hover:bg-white/2 transition-colors group">
                      <td className="py-3 pl-0 pr-3">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-xl bg-violet-600/20 flex items-center justify-center text-xs font-bold text-violet-400">
                            {contactName(contact)[0].toUpperCase()}
                          </div>
                          <div>
                            <div className="text-sm font-medium text-white">{contactName(contact)}</div>
                            <div className="text-xs text-white/40">{contact.company ?? "—"}</div>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-3 text-xs text-white/50">{contact.email ?? "—"}</td>
                      <td className="py-3 px-3 text-xs text-white/50">{contact.phone ?? "—"}</td>
                      <td className="py-3 px-3 text-xs text-white/50">{contact.source ?? "—"}</td>
                      <td className="py-3 px-3">
                        <div className="flex gap-1 flex-wrap">
                          {(contact.tags ?? []).map((tag) => (
                            <span key={tag} className="px-2 py-0.5 rounded-full text-xs bg-white/5 text-white/40 border border-white/5">
                              {tag}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="py-3 px-3 text-xs text-white/40">{timeAgo(contact.last_contact_at ?? contact.created_at)}</td>
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
          )}
        </div>
      </div>
    </div>
  );
}
