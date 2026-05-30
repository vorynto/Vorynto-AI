"use client";

import { motion } from "framer-motion";
import {
  Users, MessageSquare, Mail, Globe, Mic, BarChart3, Search, Shield,
  ArrowRight, Zap,
} from "lucide-react";
import Link from "next/link";
import { viewportConfig, EASE } from "@/lib/animations";

const features = [
  {
    num: "01",
    icon: Users,
    color: "#7c3aed",
    bg: "#f5f0ff",
    title: "AI CRM",
    description: "Intelligent pipeline management with AI lead scoring, deal predictions, and automated follow-ups that close more deals.",
    tags: ["Lead Scoring", "Auto Follow-ups", "Pipeline AI", "Team Collab"],
  },
  {
    num: "02",
    icon: MessageSquare,
    color: "#10b981",
    bg: "#f0fdf6",
    title: "WhatsApp AI Bot",
    description: "24/7 WhatsApp Business API chatbot that handles queries, books appointments, and qualifies leads automatically.",
    tags: ["Business API", "AI Conversations", "Human Handoff", "Multi-language"],
  },
  {
    num: "03",
    icon: Mail,
    color: "#0891b2",
    bg: "#ecfeff",
    title: "Bulk Campaigns",
    description: "Send personalized bulk WhatsApp, SMS, and Email campaigns at scale with AI-generated content and smart segmentation.",
    tags: ["WhatsApp + SMS", "AI Copywriting", "Smart Segments", "Analytics"],
  },
  {
    num: "04",
    icon: Globe,
    color: "#d97706",
    bg: "#fffbeb",
    title: "AI Website Builder",
    description: "Generate stunning, SEO-optimized websites in minutes with AI. Just describe your business and watch it come alive.",
    tags: ["AI Generation", "Custom Domain", "SEO Optimized", "Mobile-First"],
  },
  {
    num: "05",
    icon: Mic,
    color: "#db2777",
    bg: "#fdf2f8",
    title: "Voice Bot",
    description: "Deploy AI voice agents that handle phone calls and web conversations with natural, human-like interactions.",
    tags: ["Natural Voice AI", "Phone & Web", "Custom Scripts", "Call Recording"],
  },
  {
    num: "06",
    icon: BarChart3,
    color: "#2563eb",
    bg: "#eff6ff",
    title: "Meta Ads AI",
    description: "Connect Facebook & Instagram ads. AI optimizes campaigns, generates creatives, and manages budgets automatically.",
    tags: ["FB + Instagram", "AI Creatives", "Budget AI", "Conversion Tracking"],
  },
  {
    num: "07",
    icon: Search,
    color: "#0d9488",
    bg: "#f0fdfa",
    title: "AI SEO Tools",
    description: "Audit your website, generate optimized content, track rankings, and dominate search results with AI recommendations.",
    tags: ["Site Audit", "Keyword Tracking", "AI Content", "Competitor Analysis"],
  },
  {
    num: "08",
    icon: Shield,
    color: "#e8533b",
    bg: "#fff5f3",
    title: "Website Chatbot",
    description: "Embed an intelligent chatbot on any website. Capture leads, answer FAQs, and route visitors 24/7 effortlessly.",
    tags: ["Easy Embed", "Custom Training", "Lead Capture", "CRM Sync"],
  },
];

export default function Features() {
  return (
    <section id="features" className="py-24 overflow-hidden" style={{ background: "#ffffff" }}>
      <div className="container-max px-4 sm:px-6">
        <div className="lg:grid lg:grid-cols-5 lg:gap-16 lg:items-start">

          {/* Left sticky column */}
          <div className="lg:col-span-2 lg:sticky lg:top-28 mb-12 lg:mb-0">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={viewportConfig}
              transition={{ duration: 0.7, ease: EASE }}
            >
              <div className="section-badge mb-5">
                <span>●</span> Our AI Tools
              </div>
              <h2 className="text-4xl sm:text-5xl font-black text-[#1a1a1a] leading-[1.08] mb-5">
                Everything Your Business Needs in{" "}
                <span className="gradient-text-coral">One Place</span>
              </h2>
              <p className="text-[#666] text-lg leading-relaxed mb-8">
                Stop juggling 10 different subscriptions. Vorynto AI unifies all your AI tools
                into a single command center — connected, automated, and always on.
              </p>
              <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}>
                <Link href="/features" className="btn-coral inline-flex items-center gap-2">
                  Explore All Features
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </motion.div>

              {/* Mini stat cards */}
              <div className="mt-10 grid grid-cols-2 gap-3">
                {[
                  { value: "8", label: "AI Modules", icon: Zap },
                  { value: "1", label: "Unified Dashboard", icon: Shield },
                ].map((s) => (
                  <div key={s.label} className="light-card p-4 flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-[#fff5f3] flex items-center justify-center shrink-0">
                      <s.icon className="w-4 h-4 text-[#e8533b]" />
                    </div>
                    <div>
                      <div className="text-xl font-black text-[#1a1a1a]">{s.value}</div>
                      <div className="text-xs text-[#999] font-medium">{s.label}</div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Right scrolling cards */}
          <div className="lg:col-span-3 space-y-4">
            {features.map((f, i) => (
              <motion.div
                key={f.title}
                className="light-card p-6 group cursor-pointer relative overflow-hidden"
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.55, delay: i * 0.06, ease: EASE }}
                whileHover={{ y: -2, boxShadow: "0 8px 32px rgba(0,0,0,0.09)" }}
              >
                {/* Large faded number */}
                <span
                  className="absolute right-5 top-1/2 -translate-y-1/2 text-8xl font-black leading-none select-none pointer-events-none"
                  style={{ color: "rgba(0,0,0,0.04)" }}
                >
                  {f.num}
                </span>

                <div className="flex items-start gap-4 relative z-10">
                  {/* Icon */}
                  <motion.div
                    className="w-12 h-12 rounded-2xl flex items-center justify-center shrink-0"
                    style={{ background: f.bg }}
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  >
                    <f.icon className="w-6 h-6" style={{ color: f.color }} />
                  </motion.div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-bold text-[#1a1a1a] mb-1">{f.title}</h3>
                    <p className="text-sm text-[#666] leading-relaxed mb-3">{f.description}</p>
                    {/* Tags */}
                    <div className="flex flex-wrap gap-1.5">
                      {f.tags.map((tag) => (
                        <span
                          key={tag}
                          className="px-2.5 py-1 rounded-full text-[11px] font-semibold text-[#555] border border-black/8"
                          style={{ background: "#f5f5f5" }}
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Arrow */}
                  <motion.div
                    className="shrink-0 w-8 h-8 rounded-xl bg-black/4 flex items-center justify-center group-hover:bg-[#e8533b] transition-colors duration-300"
                    initial={false}
                  >
                    <ArrowRight className="w-4 h-4 text-[#999] group-hover:text-white transition-colors duration-300" />
                  </motion.div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
