"use client";

import { useState } from "react";
import Link from "next/link";
import { CheckCircle2, Zap, Star, ArrowRight } from "lucide-react";

const plans = [
  {
    name: "Starter",
    slug: "starter",
    price: { monthly: 49, yearly: 41 },
    description: "Perfect for small businesses getting started with AI automation",
    color: "violet",
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
    cta: "Start Free Trial",
    popular: false,
  },
  {
    name: "Growth",
    slug: "growth",
    price: { monthly: 149, yearly: 124 },
    description: "Scale your business with advanced AI tools and integrations",
    color: "cyan",
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
    cta: "Start Free Trial",
    popular: true,
  },
  {
    name: "Enterprise",
    slug: "enterprise",
    price: { monthly: 399, yearly: 332 },
    description: "Unlimited AI power for large organizations with custom requirements",
    color: "amber",
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
      "On-premise deployment option",
    ],
    cta: "Contact Sales",
    popular: false,
  },
];

export default function Pricing() {
  const [yearly, setYearly] = useState(false);

  return (
    <section id="pricing" className="section-padding relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-radial from-violet-900/10 to-transparent" />

      <div className="container-max px-4 sm:px-6 relative">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-violet-500/20 bg-violet-500/10 text-violet-300 text-sm mb-4">
            <Star className="w-4 h-4" />
            <span>Simple, transparent pricing</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4">
            Choose Your{" "}
            <span className="gradient-text">Growth Plan</span>
          </h2>
          <p className="text-lg text-white/50 max-w-xl mx-auto mb-8">
            Start for free. No credit card required. Upgrade when you are ready to scale.
          </p>

          {/* Billing toggle */}
          <div className="inline-flex items-center gap-3 p-1 rounded-xl bg-white/5 border border-white/10">
            <button
              onClick={() => setYearly(false)}
              className={`px-5 py-2 rounded-lg text-sm font-medium transition-all ${
                !yearly ? "bg-violet-600 text-white shadow-lg" : "text-white/50 hover:text-white"
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setYearly(true)}
              className={`px-5 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${
                yearly ? "bg-violet-600 text-white shadow-lg" : "text-white/50 hover:text-white"
              }`}
            >
              Yearly
              <span className="text-xs bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded-full border border-emerald-500/20">
                Save 17%
              </span>
            </button>
          </div>
        </div>

        {/* Plans grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`relative glass-card p-7 flex flex-col ${
                plan.popular
                  ? "border-violet-500/40 bg-gradient-to-b from-violet-600/10 to-transparent shadow-2xl shadow-violet-500/10"
                  : "border-white/8"
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <div className="flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-gradient-to-r from-violet-600 to-purple-600 text-white text-xs font-semibold shadow-lg shadow-violet-500/30">
                    <Zap className="w-3.5 h-3.5" />
                    Most Popular
                  </div>
                </div>
              )}

              <div className="mb-6">
                <h3 className="text-xl font-bold text-white mb-1">{plan.name}</h3>
                <p className="text-sm text-white/40">{plan.description}</p>
              </div>

              <div className="mb-6">
                <div className="flex items-end gap-2">
                  <span className="text-5xl font-bold text-white">
                    ${yearly ? plan.price.yearly : plan.price.monthly}
                  </span>
                  <span className="text-white/40 mb-2">/month</span>
                </div>
                {yearly && (
                  <p className="text-xs text-emerald-400 mt-1">
                    Billed yearly — save ${(plan.price.monthly - plan.price.yearly) * 12}/year
                  </p>
                )}
              </div>

              <ul className="space-y-2.5 mb-8 flex-1">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-2.5 text-sm">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span className="text-white/70">{feature}</span>
                  </li>
                ))}
              </ul>

              <Link
                href={plan.slug === "enterprise" ? "/contact" : "/signup?plan=" + plan.slug}
                className={`w-full text-center py-3 rounded-xl font-semibold text-sm transition-all flex items-center justify-center gap-2 ${
                  plan.popular
                    ? "btn-primary"
                    : "btn-secondary"
                }`}
              >
                {plan.cta}
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          ))}
        </div>

        {/* Enterprise note */}
        <div className="text-center mt-10">
          <p className="text-sm text-white/40">
            All plans include 14-day free trial · No setup fees · Cancel anytime
          </p>
          <p className="text-sm text-white/30 mt-2">
            Need a custom plan?{" "}
            <Link href="/contact" className="text-violet-400 hover:text-violet-300">
              Talk to our team
            </Link>
          </p>
        </div>
      </div>
    </section>
  );
}
