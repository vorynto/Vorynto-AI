import type { Metadata } from "next";
import Pricing from "@/components/marketing/Pricing";
import CTA from "@/components/marketing/CTA";
import { HelpCircle, CheckCircle2, XCircle } from "lucide-react";

export const metadata: Metadata = {
  title: "Pricing - Vorynto AI",
  description: "Simple, transparent pricing for Vorynto AI. Start free, scale as you grow.",
};

const faqs = [
  {
    q: "Is there a free trial?",
    a: "Yes! All plans include a 14-day free trial. No credit card required to start. You can explore all features before deciding to upgrade.",
  },
  {
    q: "Can I change my plan anytime?",
    a: "Absolutely. You can upgrade, downgrade, or cancel your subscription at any time from your dashboard settings. Changes take effect immediately.",
  },
  {
    q: "What happens when I exceed my limits?",
    a: "We will notify you when you are approaching your limits. You can upgrade your plan or purchase add-on credits without losing service.",
  },
  {
    q: "Do you offer refunds?",
    a: "We offer a 30-day money-back guarantee on all paid plans. If you are not satisfied, contact support and we will process a full refund.",
  },
  {
    q: "Is WhatsApp Business API included?",
    a: "The WhatsApp API connection is included in Growth and Enterprise plans. You will need to apply for your own WhatsApp Business Account via Meta, or our team can assist you.",
  },
  {
    q: "Can the super admin manage multiple companies?",
    a: "Yes. The super admin panel allows full management of all tenant accounts including setup, API key configuration, feature toggles, and user access control.",
  },
];

const comparisonFeatures = [
  { name: "AI CRM contacts", starter: "500", growth: "5,000", enterprise: "Unlimited" },
  { name: "WhatsApp AI Bot", starter: true, growth: true, enterprise: true },
  { name: "Campaign messages/month", starter: "1,000", growth: "10,000", enterprise: "Unlimited" },
  { name: "AI Website Builder", starter: false, growth: true, enterprise: true },
  { name: "Voice Bot minutes/month", starter: false, growth: "100", enterprise: "Unlimited" },
  { name: "Meta Ads Integration", starter: false, growth: true, enterprise: true },
  { name: "AI SEO Tools", starter: false, growth: true, enterprise: true },
  { name: "Team members", starter: "3", growth: "10", enterprise: "Unlimited" },
  { name: "Custom domain", starter: false, growth: true, enterprise: true },
  { name: "White-label", starter: false, growth: false, enterprise: true },
  { name: "Dedicated account manager", starter: false, growth: false, enterprise: true },
  { name: "SLA guarantee", starter: false, growth: false, enterprise: true },
];

function CellValue({ value }: { value: string | boolean }) {
  if (typeof value === "boolean") {
    return value ? (
      <CheckCircle2 className="w-5 h-5 text-emerald-400 mx-auto" />
    ) : (
      <XCircle className="w-5 h-5 text-white/20 mx-auto" />
    );
  }
  return <span className="text-sm text-white/70">{value}</span>;
}

export default function PricingPage() {
  return (
    <div className="min-h-screen pt-20">
      <Pricing />

      {/* Comparison table */}
      <section className="section-padding border-t border-white/5">
        <div className="container-max px-4 sm:px-6">
          <h2 className="text-2xl sm:text-3xl font-bold text-white text-center mb-10">
            Plan Comparison
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="text-left py-4 pr-6 text-sm font-medium text-white/40 w-1/2">Feature</th>
                  {["Starter", "Growth", "Enterprise"].map((plan) => (
                    <th key={plan} className="py-4 px-4 text-center">
                      <span className={`text-sm font-semibold ${plan === "Growth" ? "text-violet-400" : "text-white"}`}>
                        {plan}
                      </span>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {comparisonFeatures.map((feature) => (
                  <tr key={feature.name} className="hover:bg-white/2 transition-colors">
                    <td className="py-3.5 pr-6 text-sm text-white/60">{feature.name}</td>
                    <td className="py-3.5 px-4 text-center">
                      <CellValue value={feature.starter} />
                    </td>
                    <td className="py-3.5 px-4 text-center bg-violet-600/5 border-x border-violet-500/10">
                      <CellValue value={feature.growth} />
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <CellValue value={feature.enterprise} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* FAQs */}
      <section className="section-padding border-t border-white/5">
        <div className="container-max px-4 sm:px-6 max-w-3xl mx-auto">
          <div className="flex items-center gap-3 mb-10">
            <HelpCircle className="w-6 h-6 text-violet-400" />
            <h2 className="text-2xl sm:text-3xl font-bold text-white">
              Frequently Asked Questions
            </h2>
          </div>
          <div className="space-y-4">
            {faqs.map((faq) => (
              <div key={faq.q} className="glass-card p-6">
                <h3 className="text-base font-semibold text-white mb-2">{faq.q}</h3>
                <p className="text-sm text-white/50 leading-relaxed">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <CTA />
    </div>
  );
}
