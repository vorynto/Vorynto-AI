import type { Metadata } from "next";
import Link from "next/link";
import { Zap, Target, Shield, Users, ArrowRight, Globe } from "lucide-react";
import CTA from "@/components/marketing/CTA";

export const metadata: Metadata = {
  title: "About Us - Vorynto AI",
  description: "Learn about Vorynto AI and our mission to democratize AI automation for businesses worldwide.",
};

const values = [
  {
    icon: Target,
    title: "Customer First",
    description: "Every feature we build starts with one question: does this help our customers win? We obsess over outcomes, not features.",
    color: "text-violet-400",
    bg: "bg-violet-600/20",
  },
  {
    icon: Shield,
    title: "Trust & Security",
    description: "Enterprise-grade security, data privacy, and compliance are non-negotiable. Your data belongs to you.",
    color: "text-emerald-400",
    bg: "bg-emerald-600/20",
  },
  {
    icon: Zap,
    title: "Speed of Innovation",
    description: "AI moves fast. We move faster. Our team ships meaningful updates weekly so you are always ahead of the curve.",
    color: "text-cyan-400",
    bg: "bg-cyan-600/20",
  },
  {
    icon: Globe,
    title: "Global Impact",
    description: "We are building for businesses everywhere — from solo entrepreneurs in Lagos to enterprises in London.",
    color: "text-amber-400",
    bg: "bg-amber-600/20",
  },
];

const team = [
  { name: "Alex Rivera", role: "CEO & Co-founder", avatar: "AR", gradient: "from-violet-500 to-purple-600" },
  { name: "Priya Patel", role: "CTO & Co-founder", avatar: "PP", gradient: "from-cyan-500 to-blue-600" },
  { name: "James Osei", role: "Head of Product", avatar: "JO", gradient: "from-emerald-500 to-teal-600" },
  { name: "Sofia Chen", role: "Head of AI", avatar: "SC", gradient: "from-pink-500 to-rose-600" },
  { name: "Marcus Williams", role: "Head of Sales", avatar: "MW", gradient: "from-amber-500 to-orange-600" },
  { name: "Aisha Mohammed", role: "Head of Customer Success", avatar: "AM", gradient: "from-indigo-500 to-purple-600" },
];

const milestones = [
  { year: "2022", title: "Founded", description: "Vorynto AI was born with a vision to make enterprise AI accessible to every business." },
  { year: "2023", title: "First 1,000 Customers", description: "Reached our first 1,000 paying customers and launched WhatsApp AI Bot and CRM." },
  { year: "2024", title: "Series A Funding", description: "Raised $8M Series A to accelerate product development and global expansion." },
  { year: "2025", title: "10,000+ Businesses", description: "Now serving 10,000+ businesses across 50+ countries with our full AI platform." },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen pt-20">
      {/* Hero */}
      <section className="section-padding relative overflow-hidden">
        <div className="absolute inset-0 bg-glow-gradient" />
        <div className="container-max px-4 sm:px-6 relative text-center max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-violet-500/20 bg-violet-500/10 text-violet-300 text-sm mb-6">
            <Users className="w-4 h-4" />
            <span>The team behind Vorynto AI</span>
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6">
            We are on a Mission to{" "}
            <span className="gradient-text">Democratize AI</span>{" "}
            for Every Business
          </h1>
          <p className="text-xl text-white/50 max-w-2xl mx-auto leading-relaxed">
            Founded in 2022, Vorynto AI exists to give every business — regardless of size or budget —
            access to the same AI automation that Fortune 500 companies use.
          </p>
        </div>
      </section>

      {/* Stats */}
      <section className="section-padding border-t border-white/5">
        <div className="container-max px-4 sm:px-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { value: "10,000+", label: "Businesses powered" },
              { value: "50+", label: "Countries served" },
              { value: "50M+", label: "Messages sent/month" },
              { value: "$50M+", label: "Revenue generated for clients" },
            ].map((stat) => (
              <div key={stat.label} className="glass-card p-6 text-center">
                <div className="text-3xl font-bold gradient-text mb-2">{stat.value}</div>
                <div className="text-sm text-white/40">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="section-padding border-t border-white/5">
        <div className="container-max px-4 sm:px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">Our Values</h2>
            <p className="text-white/50 max-w-xl mx-auto">
              Everything we do is guided by these core principles.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((v) => (
              <div key={v.title} className="glass-card-hover p-6">
                <div className={`w-12 h-12 rounded-xl ${v.bg} flex items-center justify-center mb-4`}>
                  <v.icon className={`w-6 h-6 ${v.color}`} />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">{v.title}</h3>
                <p className="text-sm text-white/50 leading-relaxed">{v.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="section-padding border-t border-white/5">
        <div className="container-max px-4 sm:px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">Meet the Team</h2>
            <p className="text-white/50 max-w-xl mx-auto">
              A diverse team of AI researchers, engineers, and business experts united by one mission.
            </p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {team.map((member) => (
              <div key={member.name} className="text-center">
                <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${member.gradient} flex items-center justify-center mx-auto mb-3 text-white font-bold text-lg`}>
                  {member.avatar}
                </div>
                <div className="text-sm font-semibold text-white">{member.name}</div>
                <div className="text-xs text-white/40 mt-0.5">{member.role}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="section-padding border-t border-white/5">
        <div className="container-max px-4 sm:px-6 max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">Our Journey</h2>
          </div>
          <div className="relative">
            <div className="absolute left-8 top-0 bottom-0 w-px bg-gradient-to-b from-violet-500/50 to-transparent" />
            <div className="space-y-8">
              {milestones.map((m) => (
                <div key={m.year} className="flex gap-6">
                  <div className="w-16 h-16 rounded-xl bg-violet-600/20 border border-violet-500/20 flex items-center justify-center shrink-0 text-violet-400 font-bold text-sm z-10">
                    {m.year}
                  </div>
                  <div className="glass-card p-5 flex-1">
                    <h3 className="text-base font-semibold text-white mb-1">{m.title}</h3>
                    <p className="text-sm text-white/50">{m.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <CTA />
    </div>
  );
}
