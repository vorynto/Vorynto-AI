"use client";

import Link from "next/link";
import { ArrowRight, Play, Sparkles, Zap, Bot, MessageSquare } from "lucide-react";

const stats = [
  { value: "10,000+", label: "Businesses powered" },
  { value: "50M+", label: "Messages sent/mo" },
  { value: "99.9%", label: "Uptime SLA" },
  { value: "4.9/5", label: "Customer rating" },
];

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden pt-20">
      {/* Background effects */}
      <div className="absolute inset-0 bg-hero-gradient" />
      <div className="absolute inset-0 bg-glow-gradient" />

      {/* Animated grid */}
      <div
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage: `linear-gradient(rgba(124,58,237,0.15) 1px, transparent 1px), linear-gradient(90deg, rgba(124,58,237,0.15) 1px, transparent 1px)`,
          backgroundSize: "60px 60px",
        }}
      />

      {/* Floating orbs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-violet-600/10 rounded-full blur-3xl animate-pulse-slow" />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-cyan-500/8 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: "2s" }} />

      <div className="container-max px-4 sm:px-6 relative z-10 py-20">
        <div className="text-center max-w-5xl mx-auto">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-violet-500/30 bg-violet-500/10 text-violet-300 text-sm font-medium mb-8 backdrop-blur-sm">
            <Sparkles className="w-4 h-4" />
            <span>Introducing Vorynto AI — The Future of Business Automation</span>
            <ArrowRight className="w-4 h-4" />
          </div>

          {/* Headline */}
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight mb-6 leading-tight">
            <span className="text-white">Your Business on</span>
            <br />
            <span className="gradient-text">Autopilot with AI</span>
          </h1>

          {/* Sub-headline */}
          <p className="text-xl text-white/60 max-w-3xl mx-auto mb-10 leading-relaxed">
            One platform to run your entire business with AI. CRM, WhatsApp automation,
            bulk campaigns, AI website builder, voice bots, Meta ads — all in one place.
            <span className="text-violet-400 font-medium"> No code required.</span>
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
            <Link href="/signup" className="btn-primary text-base py-3.5 px-8">
              <Zap className="w-5 h-5" />
              Start Free 14-Day Trial
            </Link>
            <button className="btn-secondary text-base py-3.5 px-8 group">
              <Play className="w-5 h-5 group-hover:text-violet-400 transition-colors" />
              Watch Demo
            </button>
          </div>

          {/* Trust indicators */}
          <p className="text-sm text-white/30 mb-12">
            No credit card required · Cancel anytime · Setup in 5 minutes
          </p>

          {/* Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 max-w-3xl mx-auto mb-16">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-2xl sm:text-3xl font-bold gradient-text mb-1">
                  {stat.value}
                </div>
                <div className="text-xs text-white/40">{stat.label}</div>
              </div>
            ))}
          </div>

          {/* Dashboard preview */}
          <div className="relative max-w-5xl mx-auto">
            {/* Glow effect behind dashboard */}
            <div className="absolute inset-0 bg-gradient-radial from-violet-600/20 to-transparent blur-3xl" />

            <div className="relative glass-card overflow-hidden border border-white/10">
              {/* Browser chrome */}
              <div className="flex items-center gap-2 px-4 py-3 border-b border-white/5 bg-white/2">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-red-500/60" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500/60" />
                  <div className="w-3 h-3 rounded-full bg-green-500/60" />
                </div>
                <div className="flex-1 mx-4 bg-white/5 rounded-md h-6 flex items-center px-3">
                  <span className="text-xs text-white/30">app.vorynto.ai/dashboard</span>
                </div>
              </div>

              {/* Dashboard content mockup */}
              <div className="p-6 bg-[#0a0d1a]/80">
                <div className="flex gap-4">
                  {/* Sidebar */}
                  <div className="hidden sm:flex flex-col gap-1 w-48 shrink-0">
                    {["Dashboard", "AI CRM", "WhatsApp", "Campaigns", "Voice Bot", "Meta Ads", "SEO"].map((item, i) => (
                      <div
                        key={item}
                        className={`px-3 py-2 rounded-lg text-xs font-medium ${
                          i === 0
                            ? "bg-violet-600/20 text-violet-300 border border-violet-500/20"
                            : "text-white/30"
                        }`}
                      >
                        {item}
                      </div>
                    ))}
                  </div>

                  {/* Main content */}
                  <div className="flex-1 space-y-4">
                    {/* Stats row */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      {[
                        { label: "Total Contacts", value: "12,847", color: "violet" },
                        { label: "Messages Sent", value: "45,291", color: "cyan" },
                        { label: "Active Deals", value: "284", color: "emerald" },
                        { label: "Conversion Rate", value: "24.8%", color: "amber" },
                      ].map((card) => (
                        <div key={card.label} className="glass-card p-3">
                          <div className="text-xs text-white/40 mb-1">{card.label}</div>
                          <div className="text-xl font-bold text-white">{card.value}</div>
                          <div className="text-xs text-emerald-400 mt-1">↑ 12.5%</div>
                        </div>
                      ))}
                    </div>

                    {/* Chart placeholder */}
                    <div className="glass-card p-4 h-40 flex items-center justify-center">
                      <div className="flex gap-1 items-end h-28 w-full">
                        {[40, 65, 50, 80, 70, 90, 75, 85, 95, 88, 92, 100].map((h, i) => (
                          <div
                            key={i}
                            className="flex-1 rounded-t-sm opacity-80"
                            style={{
                              height: `${h}%`,
                              background: `linear-gradient(to top, rgba(124,58,237,0.8), rgba(6,182,212,0.4))`,
                            }}
                          />
                        ))}
                      </div>
                    </div>

                    {/* Active bots */}
                    <div className="grid grid-cols-3 gap-3">
                      {[
                        { icon: MessageSquare, label: "WhatsApp Bot", status: "Active", msgs: "1,240" },
                        { icon: Bot, label: "Website Chatbot", status: "Active", msgs: "892" },
                        { icon: Zap, label: "Voice Bot", status: "Active", msgs: "156" },
                      ].map((bot) => (
                        <div key={bot.label} className="glass-card p-3 flex items-center gap-2">
                          <div className="w-8 h-8 rounded-lg bg-violet-600/20 flex items-center justify-center">
                            <bot.icon className="w-4 h-4 text-violet-400" />
                          </div>
                          <div>
                            <div className="text-xs font-medium text-white">{bot.label}</div>
                            <div className="text-xs text-emerald-400">{bot.msgs} msgs</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
