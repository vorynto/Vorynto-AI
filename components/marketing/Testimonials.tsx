"use client";

import { Star, Quote } from "lucide-react";

const testimonials = [
  {
    name: "Sarah Chen",
    role: "CEO, TechRetail Pro",
    avatar: "SC",
    avatarColor: "from-violet-500 to-purple-600",
    rating: 5,
    quote:
      "Vorynto AI completely transformed our customer engagement. Our WhatsApp bot handles 80% of inquiries automatically, and the CRM integration means nothing falls through the cracks. Revenue is up 35% since we started.",
    company: "TechRetail Pro",
    metric: "+35% Revenue",
  },
  {
    name: "Michael Okonkwo",
    role: "Marketing Director, SwiftGrow Agency",
    avatar: "MO",
    avatarColor: "from-cyan-500 to-blue-600",
    rating: 5,
    quote:
      "The bulk campaign feature is insane. We manage campaigns for 50+ clients from one dashboard. The AI writes better copy than our team and sends at the perfect time. Our clients see 4x engagement rates.",
    company: "SwiftGrow Agency",
    metric: "4x Engagement",
  },
  {
    name: "Priya Sharma",
    role: "Founder, MedConsult India",
    avatar: "PS",
    avatarColor: "from-emerald-500 to-teal-600",
    rating: 5,
    quote:
      "As a healthcare provider, we needed HIPAA-compliant AI that could handle patient queries 24/7. Vorynto AI's voice bot books appointments and answers FAQs. We have reduced receptionist costs by 60%.",
    company: "MedConsult India",
    metric: "-60% Support Cost",
  },
  {
    name: "James Rodriguez",
    role: "E-commerce Owner, LuxBrand",
    avatar: "JR",
    avatarColor: "from-amber-500 to-orange-600",
    rating: 5,
    quote:
      "Meta Ads AI is a game changer. It manages my Facebook and Instagram campaigns autonomously — tests creatives, adjusts budgets, and scales winning ads. My ROAS went from 2.1x to 5.8x in 3 months.",
    company: "LuxBrand",
    metric: "5.8x ROAS",
  },
  {
    name: "Emma Thompson",
    role: "Operations Manager, FastDeliver Co.",
    avatar: "ET",
    avatarColor: "from-pink-500 to-rose-600",
    rating: 5,
    quote:
      "We use Vorynto AI for SMS order updates, WhatsApp customer support, and email newsletters. Managing everything from one place saves us 20 hours a week. The AI support team is incredibly responsive.",
    company: "FastDeliver Co.",
    metric: "20hrs/week saved",
  },
  {
    name: "David Kim",
    role: "SaaS Founder, Buildbase",
    avatar: "DK",
    avatarColor: "from-indigo-500 to-purple-600",
    rating: 5,
    quote:
      "The AI Website Builder got our landing page live in 30 minutes. Then the AI chatbot started capturing leads immediately. The SEO tools helped us rank on page 1 within 6 weeks. Absolutely worth every penny.",
    company: "Buildbase",
    metric: "Page 1 in 6 weeks",
  },
];

export default function Testimonials() {
  return (
    <section className="section-padding overflow-hidden">
      <div className="container-max px-4 sm:px-6">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-1 mb-4">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="w-5 h-5 text-amber-400 fill-amber-400" />
            ))}
            <span className="ml-2 text-white/50 text-sm">4.9/5 from 2,000+ reviews</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4">
            Businesses Love{" "}
            <span className="gradient-text">Vorynto AI</span>
          </h2>
          <p className="text-lg text-white/50 max-w-xl mx-auto">
            Join thousands of businesses already transforming their operations with AI automation.
          </p>
        </div>

        {/* Testimonials grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((t, i) => (
            <div key={t.name} className="glass-card-hover p-6 flex flex-col">
              {/* Quote icon */}
              <Quote className="w-8 h-8 text-violet-500/30 mb-4" />

              {/* Stars */}
              <div className="flex gap-1 mb-4">
                {[...Array(t.rating)].map((_, j) => (
                  <Star key={j} className="w-4 h-4 text-amber-400 fill-amber-400" />
                ))}
              </div>

              {/* Quote text */}
              <p className="text-white/60 text-sm leading-relaxed flex-1 mb-6">
                &ldquo;{t.quote}&rdquo;
              </p>

              {/* Footer */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div
                    className={`w-10 h-10 rounded-full bg-gradient-to-br ${t.avatarColor} flex items-center justify-center text-white text-sm font-bold`}
                  >
                    {t.avatar}
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-white">{t.name}</div>
                    <div className="text-xs text-white/40">{t.role}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-xs font-bold text-emerald-400">{t.metric}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
