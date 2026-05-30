"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { CheckCircle2, Zap, ArrowRight } from "lucide-react";
import { viewportConfig, EASE } from "@/lib/animations";

const plans = [
  {
    name: "Starter",
    slug: "starter",
    price: { monthly: 49, yearly: 41 },
    description: "Perfect for small businesses getting started with AI automation",
    popular: false,
    features: [
      "AI CRM (500 contacts)",
      "WhatsApp AI Chatbot",
      "1,000 campaign messages/month",
      "Website AI Chatbot",
      "Basic analytics",
      "Email support",
      "3 team members",
      "SSL & hosting included",
    ],
  },
  {
    name: "Growth",
    slug: "growth",
    price: { monthly: 149, yearly: 124 },
    description: "Scale your business with advanced AI tools and integrations",
    popular: true,
    features: [
      "AI CRM (5,000 contacts)",
      "WhatsApp AI Bot + Business API",
      "10,000 campaign messages/month",
      "AI Website Builder",
      "Voice Bot (100 min/month)",
      "Meta Ads Integration",
      "AI SEO Tools",
      "Advanced analytics",
      "Priority support",
      "10 team members",
      "Custom domain",
    ],
  },
  {
    name: "Enterprise",
    slug: "enterprise",
    price: { monthly: 399, yearly: 332 },
    description: "Unlimited AI power for large organizations with custom needs",
    popular: false,
    features: [
      "Unlimited contacts",
      "All features included",
      "Unlimited campaigns",
      "Custom AI model training",
      "Dedicated Voice Bot number",
      "White-label option",
      "Custom integrations",
      "Unlimited team members",
      "Dedicated account manager",
      "24/7 priority support",
      "SLA guarantee",
      "On-premise option",
    ],
  },
];

export default function Pricing() {
  const [yearly, setYearly] = useState(false);

  return (
    <section id="pricing" className="py-24 overflow-hidden" style={{ background: "#ebebeb" }}>
      <div className="container-max px-4 sm:px-6">
        {/* Header */}
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={viewportConfig}
          transition={{ duration: 0.75, ease: EASE }}
        >
          <div className="section-badge mb-5 inline-flex">
            <span>●</span> Pricing Plans
          </div>
          <h2 className="text-4xl sm:text-5xl font-black text-[#1a1a1a] mb-4 leading-tight">
            Simple, Transparent{" "}
            <span className="gradient-text-coral">Pricing</span>
          </h2>
          <p className="text-lg text-[#666] max-w-xl mx-auto mb-8">
            Start for free — no credit card required. Upgrade when you're ready to scale.
          </p>

          {/* Toggle */}
          <div className="inline-flex items-center gap-1 p-1 rounded-2xl bg-white border border-black/8 shadow-sm">
            <button
              onClick={() => setYearly(false)}
              className={`relative px-5 py-2.5 rounded-xl text-sm font-bold transition-all duration-200 ${
                !yearly ? "text-white" : "text-[#666] hover:text-[#1a1a1a]"
              }`}
            >
              {!yearly && (
                <motion.div
                  layoutId="billing-pill"
                  className="absolute inset-0 bg-[#1a1a1a] rounded-xl"
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                />
              )}
              <span className="relative">Monthly</span>
            </button>
            <button
              onClick={() => setYearly(true)}
              className={`relative px-5 py-2.5 rounded-xl text-sm font-bold transition-all duration-200 flex items-center gap-2 ${
                yearly ? "text-white" : "text-[#666] hover:text-[#1a1a1a]"
              }`}
            >
              {yearly && (
                <motion.div
                  layoutId="billing-pill"
                  className="absolute inset-0 bg-[#1a1a1a] rounded-xl"
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                />
              )}
              <span className="relative">Yearly</span>
              <span className="relative text-xs font-bold px-2 py-0.5 rounded-full" style={{ background: "#dcfce7", color: "#15803d" }}>
                Save 17%
              </span>
            </button>
          </div>
        </motion.div>

        {/* Plans */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 max-w-5xl mx-auto">
          {plans.map((plan, i) => (
            <motion.div
              key={plan.name}
              className={`relative flex flex-col rounded-3xl overflow-hidden ${
                plan.popular
                  ? "shadow-2xl shadow-[#e8533b]/15"
                  : "light-card"
              }`}
              style={plan.popular ? {
                background: "#1a1a1a",
                border: "none",
              } : {}}
              initial={{ opacity: 0, y: 36 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={viewportConfig}
              transition={{ duration: 0.6, delay: i * 0.1, ease: EASE }}
              whileHover={{ y: -6, transition: { duration: 0.22 } }}
            >
              {plan.popular && (
                <div className="absolute top-0 left-0 right-0 h-1 rounded-t-3xl" style={{ background: "#e8533b" }} />
              )}

              <div className="p-7 flex flex-col flex-1">
                {/* Popular badge */}
                {plan.popular && (
                  <motion.div
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold mb-4 self-start"
                    style={{ background: "rgba(232,83,59,0.15)", color: "#e8533b" }}
                    animate={{ scale: [1, 1.03, 1] }}
                    transition={{ duration: 2.5, repeat: Infinity }}
                  >
                    <Zap className="w-3 h-3" /> Most Popular
                  </motion.div>
                )}

                <h3 className={`text-xl font-black mb-1 ${plan.popular ? "text-white" : "text-[#1a1a1a]"}`}>
                  {plan.name}
                </h3>
                <p className={`text-sm mb-6 ${plan.popular ? "text-white/50" : "text-[#888]"}`}>
                  {plan.description}
                </p>

                {/* Price */}
                <div className="mb-6">
                  <div className="flex items-end gap-1.5">
                    <AnimatePresence mode="wait">
                      <motion.span
                        key={yearly ? "y" : "m"}
                        className={`text-5xl font-black ${plan.popular ? "text-white" : "text-[#1a1a1a]"}`}
                        initial={{ opacity: 0, y: -16 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 16 }}
                        transition={{ duration: 0.22 }}
                      >
                        ${yearly ? plan.price.yearly : plan.price.monthly}
                      </motion.span>
                    </AnimatePresence>
                    <span className={`mb-2 font-medium ${plan.popular ? "text-white/40" : "text-[#bbb]"}`}>/mo</span>
                  </div>
                  {yearly && (
                    <motion.p
                      className="text-xs font-semibold text-emerald-500 mt-1"
                      initial={{ opacity: 0, y: -6 }}
                      animate={{ opacity: 1, y: 0 }}
                    >
                      Save ${(plan.price.monthly - plan.price.yearly) * 12}/year
                    </motion.p>
                  )}
                </div>

                {/* Features */}
                <ul className="space-y-2.5 mb-8 flex-1">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-2.5 text-sm">
                      <CheckCircle2
                        className={`w-4 h-4 shrink-0 mt-0.5 ${plan.popular ? "text-[#e8533b]" : "text-emerald-500"}`}
                      />
                      <span className={plan.popular ? "text-white/75" : "text-[#555]"}>{feature}</span>
                    </li>
                  ))}
                </ul>

                {/* CTA */}
                <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                  <Link
                    href={plan.slug === "enterprise" ? "/contact" : `/signup?plan=${plan.slug}`}
                    className={`w-full text-center py-3.5 rounded-2xl font-bold text-sm flex items-center justify-center gap-2 transition-all ${
                      plan.popular
                        ? "bg-[#e8533b] text-white hover:bg-[#d44730] shadow-lg shadow-[#e8533b]/30"
                        : "bg-[#1a1a1a] text-white hover:bg-[#2d2d2d]"
                    }`}
                  >
                    {plan.slug === "enterprise" ? "Contact Sales" : "Start Free Trial"}
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </motion.div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Footer note */}
        <motion.p
          className="text-center text-sm text-[#999] mt-8"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={viewportConfig}
          transition={{ delay: 0.4 }}
        >
          All plans include a 14-day free trial · No setup fees · Cancel anytime ·{" "}
          <Link href="/contact" className="text-[#e8533b] hover:underline font-medium">
            Need custom pricing?
          </Link>
        </motion.p>
      </div>
    </section>
  );
}
