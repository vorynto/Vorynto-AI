"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { ShoppingCart, Settings, Zap, TrendingUp, ArrowRight } from "lucide-react";
import { viewportConfig, EASE } from "@/lib/animations";

const steps = [
  {
    step: "01",
    icon: ShoppingCart,
    time: "~2 min",
    title: "Choose Your Plan",
    description:
      "Browse our AI tool packages and pick the plan that fits your business. Secure checkout in under 2 minutes.",
  },
  {
    step: "02",
    icon: Settings,
    time: "~5 min",
    title: "Auto-Setup Your AI",
    description:
      "Tell us about your business. Our system automatically configures your AI agent with your company details, branding, and integrations.",
  },
  {
    step: "03",
    icon: Zap,
    time: "~10 min",
    title: "Connect Your Channels",
    description:
      "Link WhatsApp Business, Meta Ads, email, and more. Guided wizard or let our team handle it for you.",
  },
  {
    step: "04",
    icon: TrendingUp,
    time: "Always",
    title: "Grow on Autopilot",
    description:
      "Your AI agents work 24/7 — engaging customers, managing CRM, sending campaigns, and optimizing ads.",
  },
];

export default function HowItWorks() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });
  const lineProgress = useTransform(scrollYProgress, [0.1, 0.7], ["0%", "100%"]);

  return (
    <section className="py-24 relative overflow-hidden" style={{ background: "#ebebeb" }} ref={containerRef}>
      <div className="container-max px-4 sm:px-6">
        {/* Header */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={viewportConfig}
          transition={{ duration: 0.75, ease: EASE }}
        >
          <div className="section-badge mb-5 inline-flex">
            <span>●</span> How It Works
          </div>
          <h2 className="text-4xl sm:text-5xl font-black text-[#1a1a1a] mb-4 leading-tight">
            Up and Running in{" "}
            <span className="gradient-text-coral">Minutes</span>
          </h2>
          <p className="text-lg text-[#666] max-w-xl mx-auto">
            From signup to a fully operational AI business — we've automated every step of the setup.
          </p>
        </motion.div>

        {/* Steps grid */}
        <div className="relative">
          {/* Animated connector line (desktop) */}
          <div className="hidden lg:block absolute top-[52px] left-[14%] right-[14%] h-[2px] bg-black/6 overflow-hidden rounded-full">
            <motion.div
              className="h-full rounded-full"
              style={{ width: lineProgress, background: "#e8533b" }}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {steps.map((step, i) => (
              <motion.div
                key={step.step}
                className="relative"
                initial={{ opacity: 0, y: 36 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={viewportConfig}
                transition={{ duration: 0.6, delay: i * 0.1, ease: EASE }}
              >
                <motion.div
                  className="light-card p-6 h-full group relative overflow-hidden"
                  whileHover={{ y: -6, boxShadow: "0 12px 40px rgba(0,0,0,0.10)" }}
                  transition={{ duration: 0.25 }}
                >
                  {/* Large faded number background */}
                  <span
                    className="absolute -right-1 -bottom-3 text-8xl font-black leading-none select-none pointer-events-none"
                    style={{ color: "rgba(0,0,0,0.04)" }}
                  >
                    {step.step}
                  </span>

                  {/* Icon square */}
                  <motion.div
                    className="w-14 h-14 rounded-2xl flex items-center justify-center mb-5 relative z-10"
                    style={{ background: "#e8533b" }}
                    whileHover={{ scale: 1.08, rotate: 8 }}
                    transition={{ type: "spring", stiffness: 280, damping: 18 }}
                  >
                    <step.icon className="w-7 h-7 text-white" />
                  </motion.div>

                  {/* Time pill */}
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-black/5 text-[11px] font-bold text-[#666] mb-3">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#e8533b]" />
                    {step.time}
                  </div>

                  <h3 className="text-lg font-black text-[#1a1a1a] mb-2 relative z-10">{step.title}</h3>
                  <p className="text-sm text-[#666] leading-relaxed relative z-10">{step.description}</p>
                </motion.div>

                {/* Arrow connector between cards (desktop) */}
                {i < steps.length - 1 && (
                  <div className="hidden lg:flex absolute top-[52px] -right-3 z-20 w-6 items-center justify-center">
                    <ArrowRight className="w-4 h-4 text-[#ccc]" />
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
