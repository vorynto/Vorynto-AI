"use client";

import {
  Users, MessageSquare, Mail, Globe, Mic, BarChart3,
  Search, Shield, Zap, ArrowRight, CheckCircle2,
} from "lucide-react";
import Link from "next/link";

const features = [
  {
    icon: Users,
    color: "violet",
    gradient: "from-violet-600/20 to-purple-600/10",
    border: "border-violet-500/20",
    iconBg: "bg-violet-600/20",
    iconColor: "text-violet-400",
    title: "AI CRM",
    description:
      "Intelligent customer relationship management with AI-powered insights, deal predictions, and automated follow-ups.",
    highlights: ["Contact & deal pipeline", "AI lead scoring", "Auto follow-ups", "Team collaboration"],
  },
  {
    icon: MessageSquare,
    color: "emerald",
    gradient: "from-emerald-600/20 to-green-600/10",
    border: "border-emerald-500/20",
    iconBg: "bg-emerald-600/20",
    iconColor: "text-emerald-400",
    title: "WhatsApp AI Bot",
    description:
      "24/7 WhatsApp Business API chatbot powered by AI. Handles queries, books appointments, and qualifies leads automatically.",
    highlights: ["Business API integration", "AI conversation flow", "Human handoff", "Multi-language support"],
  },
  {
    icon: Mail,
    color: "cyan",
    gradient: "from-cyan-600/20 to-blue-600/10",
    border: "border-cyan-500/20",
    iconBg: "bg-cyan-600/20",
    iconColor: "text-cyan-400",
    title: "Bulk Campaigns",
    description:
      "Send personalized bulk WhatsApp, SMS, and Email campaigns at scale with AI-generated content and smart segmentation.",
    highlights: ["WhatsApp, SMS & Email", "AI content generation", "Smart segmentation", "Analytics & reports"],
  },
  {
    icon: Globe,
    color: "amber",
    gradient: "from-amber-600/20 to-orange-600/10",
    border: "border-amber-500/20",
    iconBg: "bg-amber-600/20",
    iconColor: "text-amber-400",
    title: "AI Website Builder",
    description:
      "Generate stunning websites in minutes with AI. No coding required — just describe your business and watch your site come alive.",
    highlights: ["AI page generation", "Custom domain", "SEO optimized", "Mobile responsive"],
  },
  {
    icon: Mic,
    color: "pink",
    gradient: "from-pink-600/20 to-rose-600/10",
    border: "border-pink-500/20",
    iconBg: "bg-pink-600/20",
    iconColor: "text-pink-400",
    title: "Conversational Voice Bot",
    description:
      "Deploy AI voice agents that handle phone calls, web conversations, and customer support with human-like conversations.",
    highlights: ["Natural voice AI", "Phone & web calls", "Custom scripts", "Call recordings"],
  },
  {
    icon: BarChart3,
    color: "blue",
    gradient: "from-blue-600/20 to-indigo-600/10",
    border: "border-blue-500/20",
    iconBg: "bg-blue-600/20",
    iconColor: "text-blue-400",
    title: "Meta Ads Integration",
    description:
      "Connect your Facebook and Instagram ad accounts. AI optimizes campaigns, generates creatives, and manages budgets automatically.",
    highlights: ["FB & Instagram ads", "AI creative generation", "Budget optimization", "Conversion tracking"],
  },
  {
    icon: Search,
    color: "teal",
    gradient: "from-teal-600/20 to-cyan-600/10",
    border: "border-teal-500/20",
    iconBg: "bg-teal-600/20",
    iconColor: "text-teal-400",
    title: "AI SEO Tools",
    description:
      "Audit your website, generate SEO-optimized content, track rankings, and get AI recommendations to dominate search results.",
    highlights: ["Site audit & scoring", "Keyword tracking", "AI content writing", "Competitor analysis"],
  },
  {
    icon: Shield,
    color: "red",
    gradient: "from-red-600/20 to-rose-600/10",
    border: "border-red-500/20",
    iconBg: "bg-red-600/20",
    iconColor: "text-red-400",
    title: "Website AI Chatbot",
    description:
      "Embed an intelligent chatbot on any website. Capture leads, answer FAQs, and route visitors 24/7 with zero manual effort.",
    highlights: ["Easy embed code", "Custom training", "Lead capture", "CRM integration"],
  },
];

export default function Features() {
  return (
    <section id="features" className="section-padding">
      <div className="container-max px-4 sm:px-6">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-violet-500/20 bg-violet-500/10 text-violet-300 text-sm mb-4">
            <Zap className="w-4 h-4" />
            <span>Everything you need in one platform</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4">
            AI Tools that{" "}
            <span className="gradient-text">Actually Work</span>
          </h2>
          <p className="text-lg text-white/50 max-w-2xl mx-auto">
            Stop juggling 10 different tools. Vorynto AI gives your business a unified
            AI command center with everything connected and working together.
          </p>
        </div>

        {/* Features grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {features.map((feature, i) => (
            <div
              key={feature.title}
              className={`glass-card-hover p-6 bg-gradient-to-br ${feature.gradient} ${
                i === 0 ? "md:col-span-2" : ""
              }`}
            >
              <div
                className={`w-11 h-11 rounded-xl ${feature.iconBg} flex items-center justify-center mb-4`}
              >
                <feature.icon className={`w-5 h-5 ${feature.iconColor}`} />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">
                {feature.title}
              </h3>
              <p className="text-sm text-white/50 mb-4 leading-relaxed">
                {feature.description}
              </p>
              <ul className="space-y-1.5">
                {feature.highlights.map((h) => (
                  <li key={h} className="flex items-center gap-2 text-xs text-white/60">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    {h}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center mt-12">
          <Link href="/features" className="btn-secondary inline-flex items-center gap-2">
            Explore All Features
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
