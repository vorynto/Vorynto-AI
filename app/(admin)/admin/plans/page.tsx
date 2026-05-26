import Header from "@/components/dashboard/Header";
import { CreditCard, Plus, Edit3, ToggleLeft, ToggleRight, CheckCircle2, Users } from "lucide-react";

const plans = [
  {
    id: "plan_starter",
    name: "Starter",
    slug: "starter",
    price_monthly: 49,
    price_yearly: 490,
    currency: "USD",
    is_active: true,
    is_featured: false,
    tenant_count: 4180,
    features: ["AI CRM (500 contacts)", "WhatsApp AI Chatbot", "1,000 campaign messages/mo", "Website AI Chatbot", "Email support", "3 team members"],
    limits: { contacts: 500, campaigns_per_month: 1000, chatbot_conversations: 500, team_members: 3 },
  },
  {
    id: "plan_growth",
    name: "Growth",
    slug: "growth",
    price_monthly: 149,
    price_yearly: 1490,
    currency: "USD",
    is_active: true,
    is_featured: true,
    tenant_count: 4820,
    features: ["AI CRM (5,000 contacts)", "WhatsApp AI Bot + API", "10,000 campaign messages/mo", "AI Website Builder", "Voice Bot (100 mins/mo)", "Meta Ads Integration", "AI SEO Tools", "Priority support", "10 team members"],
    limits: { contacts: 5000, campaigns_per_month: 10000, chatbot_conversations: 5000, team_members: 10, voice_minutes: 100 },
  },
  {
    id: "plan_enterprise",
    name: "Enterprise",
    slug: "enterprise",
    price_monthly: 399,
    price_yearly: 3990,
    currency: "USD",
    is_active: true,
    is_featured: false,
    tenant_count: 1284,
    features: ["Unlimited contacts", "All features included", "Unlimited campaigns", "Custom AI training", "Dedicated Voice Bot", "White-label option", "Custom integrations", "24/7 priority support", "Dedicated account manager"],
    limits: { contacts: -1, campaigns_per_month: -1, chatbot_conversations: -1, team_members: -1, voice_minutes: -1 },
  },
];

export default function AdminPlansPage() {
  return (
    <div>
      <Header
        title="Subscription Plans"
        subtitle="Create and manage pricing plans for tenants"
        action={
          <button className="btn-primary text-sm py-2 px-4">
            <Plus className="w-4 h-4" />
            Create Plan
          </button>
        }
      />

      <div className="p-6 space-y-6">
        {/* Plans grid */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          {plans.map((plan) => (
            <div key={plan.id} className={`glass-card p-6 relative ${plan.is_featured ? "border-violet-500/30 bg-gradient-to-b from-violet-600/5 to-transparent" : ""}`}>
              {plan.is_featured && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-violet-600 text-white text-xs font-semibold">
                  Most Popular
                </div>
              )}

              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-lg font-bold text-white">{plan.name}</h3>
                  <div className="flex items-center gap-1.5 mt-1 text-xs text-white/40">
                    <Users className="w-3.5 h-3.5" />
                    {plan.tenant_count.toLocaleString()} tenants
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {plan.is_active ? (
                    <ToggleRight className="w-7 h-7 text-emerald-400 cursor-pointer" />
                  ) : (
                    <ToggleLeft className="w-7 h-7 text-white/30 cursor-pointer" />
                  )}
                </div>
              </div>

              {/* Pricing */}
              <div className="mb-4">
                <div className="flex items-end gap-1">
                  <span className="text-3xl font-bold text-white">${plan.price_monthly}</span>
                  <span className="text-white/40 text-sm mb-1">/mo</span>
                </div>
                <div className="text-xs text-white/30 mt-0.5">
                  ${plan.price_yearly}/yr · Save ${(plan.price_monthly * 12 - plan.price_yearly).toFixed(0)}/yr
                </div>
              </div>

              {/* Features */}
              <ul className="space-y-1.5 mb-5">
                {plan.features.slice(0, 5).map((f) => (
                  <li key={f} className="flex items-center gap-2 text-xs text-white/50">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    {f}
                  </li>
                ))}
                {plan.features.length > 5 && (
                  <li className="text-xs text-white/30 pl-5">+{plan.features.length - 5} more features</li>
                )}
              </ul>

              {/* Limits */}
              <div className="mb-5 p-3 rounded-lg bg-white/3 border border-white/5 space-y-1">
                <div className="text-xs font-medium text-white/40 mb-2">Feature Limits</div>
                {Object.entries(plan.limits).map(([key, val]) => (
                  <div key={key} className="flex justify-between text-xs">
                    <span className="text-white/30 capitalize">{key.replace(/_/g, " ")}</span>
                    <span className="text-white/60 font-medium">{val === -1 ? "Unlimited" : val.toLocaleString()}</span>
                  </div>
                ))}
              </div>

              {/* Actions */}
              <div className="flex gap-2">
                <button className="flex-1 btn-secondary text-xs py-2 flex items-center justify-center gap-1.5">
                  <Edit3 className="w-3.5 h-3.5" />
                  Edit Plan
                </button>
                <button className="flex-1 btn-primary text-xs py-2">
                  View Tenants
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Plan editor panel */}
        <div className="glass-card p-6">
          <h2 className="text-base font-semibold text-white mb-5 flex items-center gap-2">
            <CreditCard className="w-4 h-4 text-violet-400" />
            Create / Edit Plan
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-white/60 mb-1.5">Plan Name</label>
                <input type="text" placeholder="e.g., Professional" className="input-dark" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-white/60 mb-1.5">Monthly Price ($)</label>
                  <input type="number" placeholder="99" className="input-dark" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-white/60 mb-1.5">Yearly Price ($)</label>
                  <input type="number" placeholder="990" className="input-dark" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-white/60 mb-1.5">Description</label>
                <textarea rows={2} placeholder="Plan description..." className="input-dark resize-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-white/60 mb-1.5">Stripe Price ID (Monthly)</label>
                <input type="text" placeholder="price_..." className="input-dark font-mono text-xs" />
              </div>
            </div>
            <div className="space-y-4">
              <div className="text-sm font-medium text-white/60 mb-1">Feature Limits</div>
              {[
                { key: "contacts", label: "Max Contacts" },
                { key: "campaigns_per_month", label: "Campaign Messages/mo" },
                { key: "team_members", label: "Team Members" },
                { key: "chatbot_conversations", label: "Chatbot Conversations/mo" },
                { key: "voice_minutes", label: "Voice Bot Minutes/mo" },
              ].map((limit) => (
                <div key={limit.key} className="flex items-center gap-3">
                  <label className="text-sm text-white/40 w-48">{limit.label}</label>
                  <input type="number" placeholder="-1 for unlimited" className="input-dark flex-1 text-sm" />
                </div>
              ))}
            </div>
          </div>
          <div className="flex gap-3 mt-5">
            <button className="btn-secondary text-sm py-2 px-5">Cancel</button>
            <button className="btn-primary text-sm py-2 px-5">Save Plan</button>
          </div>
        </div>
      </div>
    </div>
  );
}
