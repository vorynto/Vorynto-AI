"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Zap, MessageSquare, BarChart3, Globe } from "lucide-react";
import { viewportConfig, EASE } from "@/lib/animations";

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12, delayChildren: 0.1 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.65, ease: EASE } },
};

// Floating tool icons for the CTA background
const bgIcons = [
  { icon: "💬", top: "10%", left: "6%", delay: 0.3, size: "w-12 h-12" },
  { icon: "📊", top: "15%", right: "8%", delay: 0.6, size: "w-10 h-10" },
  { icon: "🤖", bottom: "18%", left: "9%", delay: 0.5, size: "w-11 h-11" },
  { icon: "🌐", bottom: "12%", right: "6%", delay: 0.4, size: "w-10 h-10" },
  { icon: "🎙️", top: "40%", left: "3%", delay: 0.8, size: "w-9 h-9" },
  { icon: "🔍", top: "35%", right: "3%", delay: 0.7, size: "w-9 h-9" },
];

export default function CTA() {
  return (
    <section className="py-16 sm:py-20" style={{ background: "#ffffff" }}>
      <div className="container-max px-4 sm:px-6">
        <motion.div
          className="relative overflow-hidden rounded-[32px] p-10 sm:p-16 text-center"
          style={{ background: "#1a1a1a" }}
          initial={{ opacity: 0, scale: 0.97 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={viewportConfig}
          transition={{ duration: 0.8, ease: EASE }}
        >
          {/* Coral glow orb */}
          <motion.div
            className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-72 rounded-full blur-3xl pointer-events-none"
            style={{ background: "radial-gradient(circle, rgba(232,83,59,0.18) 0%, transparent 70%)" }}
            animate={{ scale: [1, 1.12, 1], opacity: [0.7, 1, 0.7] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          />

          {/* Subtle grid */}
          <div
            className="absolute inset-0 opacity-[0.06] pointer-events-none"
            style={{
              backgroundImage: `linear-gradient(rgba(255,255,255,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.3) 1px, transparent 1px)`,
              backgroundSize: "40px 40px",
            }}
          />

          {/* Floating icons */}
          {bgIcons.map((ic, i) => (
            <motion.div
              key={i}
              className={`absolute ${ic.size} bg-white/6 rounded-2xl flex items-center justify-center text-xl hidden lg:flex border border-white/8`}
              style={{ top: ic.top, left: (ic as any).left, bottom: (ic as any).bottom, right: (ic as any).right }}
              initial={{ opacity: 0, scale: 0.5 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={viewportConfig}
              transition={{ delay: ic.delay, duration: 0.5, ease: EASE }}
              animate={{ y: [0, -6, 0] }}
            >
              {ic.icon}
            </motion.div>
          ))}

          {/* Content */}
          <motion.div
            className="relative z-10"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={viewportConfig}
          >
            {/* Badge */}
            <motion.div variants={itemVariants}>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/15 text-white/80 text-sm font-semibold mb-6"
                style={{ background: "rgba(232,83,59,0.12)" }}>
                <Zap className="w-4 h-4 text-[#e8533b]" />
                Start free — no credit card required
              </div>
            </motion.div>

            {/* Headline */}
            <motion.h2
              variants={itemVariants}
              className="text-4xl sm:text-5xl lg:text-6xl font-black text-white mb-4 leading-[1.06]"
            >
              Ready to Transform{" "}
              <span className="gradient-text-coral">Your Business?</span>
            </motion.h2>

            {/* Sub */}
            <motion.p
              variants={itemVariants}
              className="text-lg text-white/50 max-w-xl mx-auto mb-10"
            >
              Join 10,000+ businesses using Vorynto AI to automate customer engagement,
              generate more leads, and scale without limits.
            </motion.p>

            {/* Stats */}
            <motion.div
              variants={itemVariants}
              className="flex flex-wrap items-center justify-center gap-8 mb-10"
            >
              {[
                { value: "10,000+", label: "Businesses" },
                { value: "50M+", label: "Messages/mo" },
                { value: "99.9%", label: "Uptime" },
              ].map((s) => (
                <div key={s.label} className="text-center">
                  <div className="text-2xl font-black gradient-text-coral">{s.value}</div>
                  <div className="text-xs text-white/30 mt-0.5 font-medium">{s.label}</div>
                </div>
              ))}
            </motion.div>

            {/* Buttons */}
            <motion.div
              variants={itemVariants}
              className="flex flex-col sm:flex-row items-center justify-center gap-4"
            >
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }}>
                <Link href="/signup" className="btn-coral flex items-center gap-2 text-base py-4 px-10">
                  <Zap className="w-5 h-5" />
                  Get Started Free
                </Link>
              </motion.div>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }}>
                <Link
                  href="/contact"
                  className="flex items-center gap-2 text-base font-bold text-white/70 hover:text-white transition-colors py-4 px-6 rounded-full border border-white/15 hover:border-white/30"
                >
                  Talk to Sales
                  <ArrowRight className="w-5 h-5" />
                </Link>
              </motion.div>
            </motion.div>

            <motion.p
              variants={itemVariants}
              className="text-sm text-white/25 mt-6"
            >
              14-day free trial · No credit card · Cancel anytime
            </motion.p>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
