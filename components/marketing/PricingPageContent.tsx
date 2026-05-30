"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { HelpCircle, CheckCircle2, XCircle, ChevronDown } from "lucide-react";
import Pricing from "@/components/marketing/Pricing";
import CTA from "@/components/marketing/CTA";
import { viewportConfig, EASE } from "@/lib/animations";

const faqs = [
  { q: "Is there a free trial?", a: "Yes! All plans include a 14-day free trial. No credit card required to start. You can explore all features before deciding to upgrade." },
  { q: "Can I change my plan anytime?", a: "Absolutely. You can upgrade, downgrade, or cancel your subscription at any time from your dashboard settings. Changes take effect immediately." },
  { q: "What happens when I exceed my limits?", a: "We will notify you when you are approaching your limits. You can upgrade your plan or purchase add-on credits without losing service." },
  { q: "Do you offer refunds?", a: "We offer a 30-day money-back guarantee on all paid plans. If you are not satisfied, contact support and we will process a full refund." },
  { q: "Is WhatsApp Business API included?", a: "The WhatsApp API connection is included in Growth and Enterprise plans. You will need to apply for your own WhatsApp Business Account via Meta, or our team can assist you." },
  { q: "Can the super admin manage multiple companies?", a: "Yes. The super admin panel allows full management of all tenant accounts including setup, API key configuration, feature toggles, and user access control." },
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
    return value
      ? <CheckCircle2 className="w-5 h-5 text-emerald-500 mx-auto" />
      : <XCircle className="w-4 h-4 mx-auto" style={{ color: "rgba(0,0,0,0.15)" }} />;
  }
  return <span className="text-sm text-[#555] font-medium">{value}</span>;
}

function FAQItem({ faq, index }: { faq: typeof faqs[0]; index: number }) {
  const [open, setOpen] = useState(false);
  return (
    <motion.div
      className="light-card overflow-hidden"
      initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }}
      viewport={viewportConfig} transition={{ delay: index * 0.06, duration: 0.45 }}
    >
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between p-6 text-left"
      >
        <h3 className="text-base font-bold text-[#1a1a1a] pr-4">{faq.q}</h3>
        <motion.div animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.25 }} className="shrink-0">
          <ChevronDown className="w-5 h-5 text-[#aaa]" />
        </motion.div>
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.28, ease: EASE }}
          >
            <div className="px-6 pb-5">
              <div className="h-px mb-4" style={{ background: "rgba(0,0,0,0.06)" }} />
              <p className="text-sm text-[#666] leading-relaxed">{faq.a}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default function PricingPageContent() {
  return (
    <div className="min-h-screen pt-20">
      <Pricing />

      {/* Comparison table */}
      <section className="py-20" style={{ background: "#ffffff", borderTop: "1px solid rgba(0,0,0,0.06)" }}>
        <div className="container-max px-4 sm:px-6">
          <motion.div
            className="text-center mb-10"
            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={viewportConfig} transition={{ duration: 0.6 }}
          >
            <div className="section-badge mb-4 inline-flex"><span>●</span> Full Comparison</div>
            <h2 className="text-3xl font-black text-[#1a1a1a]">Plan Comparison</h2>
          </motion.div>
          <motion.div
            className="overflow-x-auto rounded-3xl border border-black/6 bg-white shadow-sm"
            initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={viewportConfig} transition={{ duration: 0.6, delay: 0.1 }}
          >
            <table className="w-full">
              <thead>
                <tr style={{ borderBottom: "1px solid rgba(0,0,0,0.07)" }}>
                  <th className="text-left py-4 px-6 text-sm font-bold text-[#999] w-1/2">Feature</th>
                  {[{ name: "Starter", highlight: false }, { name: "Growth", highlight: true }, { name: "Enterprise", highlight: false }].map(({ name, highlight }) => (
                    <th key={name} className="py-4 px-4 text-center">
                      <span className={`text-sm font-black ${highlight ? "text-[#e8533b]" : "text-[#1a1a1a]"}`}>{name}</span>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {comparisonFeatures.map((feature, i) => (
                  <motion.tr
                    key={feature.name}
                    className="hover:bg-black/[0.02] transition-colors"
                    style={{ borderBottom: i < comparisonFeatures.length - 1 ? "1px solid rgba(0,0,0,0.05)" : "none" }}
                    initial={{ opacity: 0 }} whileInView={{ opacity: 1 }}
                    viewport={viewportConfig} transition={{ delay: i * 0.025 }}
                  >
                    <td className="py-3.5 px-6 text-sm text-[#555] font-medium">{feature.name}</td>
                    <td className="py-3.5 px-4 text-center"><CellValue value={feature.starter} /></td>
                    <td className="py-3.5 px-4 text-center" style={{ background: "rgba(232,83,59,0.03)", borderLeft: "1px solid rgba(232,83,59,0.08)", borderRight: "1px solid rgba(232,83,59,0.08)" }}>
                      <CellValue value={feature.growth} />
                    </td>
                    <td className="py-3.5 px-4 text-center"><CellValue value={feature.enterprise} /></td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </motion.div>
        </div>
      </section>

      {/* FAQs */}
      <section className="py-20" style={{ background: "#f5f5f5", borderTop: "1px solid rgba(0,0,0,0.06)" }}>
        <div className="container-max px-4 sm:px-6 max-w-3xl mx-auto">
          <motion.div
            className="text-center mb-10"
            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={viewportConfig} transition={{ duration: 0.6 }}
          >
            <div className="section-badge mb-4 inline-flex">
              <HelpCircle className="w-3.5 h-3.5" />
              <span>FAQ</span>
            </div>
            <h2 className="text-3xl font-black text-[#1a1a1a]">Frequently Asked Questions</h2>
          </motion.div>
          <div className="space-y-3">
            {faqs.map((faq, i) => <FAQItem key={faq.q} faq={faq} index={i} />)}
          </div>
        </div>
      </section>

      <CTA />
    </div>
  );
}
