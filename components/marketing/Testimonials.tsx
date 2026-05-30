"use client";

import { motion } from "framer-motion";
import { Star, Quote } from "lucide-react";
import { viewportConfig, EASE } from "@/lib/animations";

const testimonials = [
  {
    name: "Sarah Chen",
    role: "CEO, TechRetail Pro",
    avatar: "SC",
    avatarBg: "#7c3aed",
    rating: 5,
    quote:
      "Vorynto AI completely transformed our customer engagement. Our WhatsApp bot handles 80% of inquiries automatically, and the CRM integration means nothing falls through the cracks. Revenue is up 35% since we started.",
    metric: "+35% Revenue",
    metricBg: "#f0fdf6",
    metricColor: "#15803d",
  },
  {
    name: "Michael Okonkwo",
    role: "Marketing Director, SwiftGrow Agency",
    avatar: "MO",
    avatarBg: "#0891b2",
    rating: 5,
    quote:
      "The bulk campaign feature is insane. We manage 50+ clients from one dashboard. The AI writes better copy than our team and sends at the perfect time. Our clients see 4x engagement rates.",
    metric: "4× Engagement",
    metricBg: "#ecfeff",
    metricColor: "#0e7490",
  },
  {
    name: "Priya Sharma",
    role: "Founder, MedConsult India",
    avatar: "PS",
    avatarBg: "#10b981",
    rating: 5,
    quote:
      "As a healthcare provider, we needed AI that could handle patient queries 24/7. Vorynto AI's voice bot books appointments and answers FAQs. We've reduced receptionist costs by 60%.",
    metric: "−60% Support Cost",
    metricBg: "#fffbeb",
    metricColor: "#b45309",
  },
  {
    name: "James Rodriguez",
    role: "E-commerce Owner, LuxBrand",
    avatar: "JR",
    avatarBg: "#f97316",
    rating: 5,
    quote:
      "Meta Ads AI is a game changer. It manages my Facebook and Instagram campaigns autonomously — tests creatives, adjusts budgets, and scales winning ads. My ROAS went from 2.1× to 5.8× in 3 months.",
    metric: "5.8× ROAS",
    metricBg: "#fff5f3",
    metricColor: "#e8533b",
  },
  {
    name: "Emma Thompson",
    role: "Operations Manager, FastDeliver Co.",
    avatar: "ET",
    avatarBg: "#db2777",
    rating: 5,
    quote:
      "We use Vorynto AI for SMS order updates, WhatsApp support, and email newsletters. Managing everything from one place saves us 20 hours a week. The AI support team is incredibly responsive.",
    metric: "20 hrs/week saved",
    metricBg: "#fdf2f8",
    metricColor: "#9d174d",
  },
  {
    name: "David Kim",
    role: "SaaS Founder, Buildbase",
    avatar: "DK",
    avatarBg: "#4f46e5",
    rating: 5,
    quote:
      "The AI Website Builder got our landing page live in 30 minutes. Then the chatbot started capturing leads immediately. SEO tools helped us rank on page 1 within 6 weeks. Absolutely worth every penny.",
    metric: "Page 1 in 6 weeks",
    metricBg: "#f5f0ff",
    metricColor: "#6d28d9",
  },
];

const row1 = [...testimonials.slice(0, 3), ...testimonials.slice(0, 3)];
const row2 = [...testimonials.slice(3), ...testimonials.slice(3)];

function TestimonialCard({ t }: { t: typeof testimonials[0] }) {
  return (
    <div className="w-80 shrink-0 light-card p-6 flex flex-col mx-2 hover:shadow-lg transition-shadow duration-300 cursor-default">
      <Quote className="w-7 h-7 mb-3" style={{ color: "#e8533b", opacity: 0.3 }} />
      <div className="flex gap-0.5 mb-3">
        {Array.from({ length: t.rating }).map((_, j) => (
          <Star key={j} className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
        ))}
      </div>
      <p className="text-[#555] text-sm leading-relaxed flex-1 mb-4">
        &ldquo;{t.quote}&rdquo;
      </p>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div
            className="w-9 h-9 rounded-full flex items-center justify-center text-white text-xs font-bold"
            style={{ background: t.avatarBg }}
          >
            {t.avatar}
          </div>
          <div>
            <div className="text-sm font-bold text-[#1a1a1a] leading-tight">{t.name}</div>
            <div className="text-xs text-[#999] leading-tight">{t.role}</div>
          </div>
        </div>
        <div
          className="text-xs font-bold px-2.5 py-1 rounded-full"
          style={{ background: t.metricBg, color: t.metricColor }}
        >
          {t.metric}
        </div>
      </div>
    </div>
  );
}

export default function Testimonials() {
  return (
    <section className="py-24 overflow-hidden" style={{ background: "#f5f5f5" }}>
      <div className="container-max px-4 sm:px-6">
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={viewportConfig}
          transition={{ duration: 0.75, ease: EASE }}
        >
          <div className="section-badge mb-5 inline-flex">
            <span>●</span> Testimonials
          </div>
          <div className="flex items-center justify-center gap-1 mb-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={viewportConfig}
                transition={{ delay: i * 0.07, type: "spring", stiffness: 300 }}
              >
                <Star className="w-5 h-5 text-amber-400 fill-amber-400" />
              </motion.div>
            ))}
            <span className="ml-2 text-[#666] text-sm font-medium">4.9/5 from 2,000+ reviews</span>
          </div>
          <h2 className="text-4xl sm:text-5xl font-black text-[#1a1a1a] mb-4">
            Businesses Love{" "}
            <span className="gradient-text-coral">Vorynto AI</span>
          </h2>
          <p className="text-lg text-[#666] max-w-xl mx-auto">
            Thousands of businesses are already transforming their operations with our AI platform.
          </p>
        </motion.div>
      </div>

      {/* Full-bleed marquee */}
      <div className="relative">
        <div className="absolute left-0 top-0 bottom-0 w-28 sm:w-44 z-10 pointer-events-none" style={{ background: "linear-gradient(to right, #f5f5f5, transparent)" }} />
        <div className="absolute right-0 top-0 bottom-0 w-28 sm:w-44 z-10 pointer-events-none" style={{ background: "linear-gradient(to left, #f5f5f5, transparent)" }} />

        <div className="space-y-4">
          <div className="flex overflow-hidden">
            <motion.div
              className="flex"
              animate={{ x: ["0%", "-50%"] }}
              transition={{ duration: 32, repeat: Infinity, ease: "linear" }}
            >
              {row1.map((t, i) => <TestimonialCard key={`r1-${i}`} t={t} />)}
            </motion.div>
          </div>
          <div className="flex overflow-hidden">
            <motion.div
              className="flex"
              animate={{ x: ["-50%", "0%"] }}
              transition={{ duration: 36, repeat: Infinity, ease: "linear" }}
            >
              {row2.map((t, i) => <TestimonialCard key={`r2-${i}`} t={t} />)}
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
