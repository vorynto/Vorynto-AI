"use client";

import { useRef, useEffect, useState } from "react";
import { motion, useSpring, useMotionValue } from "framer-motion";
import { gsap } from "gsap";
import Link from "next/link";
import { ArrowRight, Play, TrendingUp, MessageSquare, Bot, Zap, Globe, BarChart3, Search } from "lucide-react";
import { EASE } from "@/lib/animations";

// ─── GSAP Counter ─────────────────────────────────────────────────────────────
function Counter({
  to,
  suffix = "",
  prefix = "",
  decimals = 0,
}: {
  to: number;
  suffix?: string;
  prefix?: string;
  decimals?: number;
}) {
  const nodeRef = useRef<HTMLSpanElement>(null);
  const [triggered, setTriggered] = useState(false);

  useEffect(() => {
    const el = nodeRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting && !triggered) { setTriggered(true); observer.disconnect(); } },
      { threshold: 0.5 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [triggered]);

  useEffect(() => {
    if (!triggered || !nodeRef.current) return;
    const node = nodeRef.current;
    const obj = { val: 0 };
    const tween = gsap.to(obj, {
      val: to, duration: 2.2, ease: "power2.out",
      onUpdate: () => {
        node.textContent = prefix + (decimals > 0 ? obj.val.toFixed(decimals) : Math.floor(obj.val).toLocaleString()) + suffix;
      },
    });
    return () => { tween.kill(); };
  }, [triggered, to, suffix, prefix, decimals]);

  return <span ref={nodeRef}>{prefix}0{suffix}</span>;
}

// ─── Floating tool icons ───────────────────────────────────────────────────────
const floatingIcons = [
  { icon: "💬", label: "WhatsApp", top: "12%", left: "5%", delay: 0.2, rotate: -8 },
  { icon: "🤝", label: "CRM", top: "8%", left: "80%", delay: 0.5, rotate: 6 },
  { icon: "📢", label: "Campaigns", top: "38%", left: "2%", delay: 0.8, rotate: 4 },
  { icon: "🌐", label: "Website", top: "60%", left: "88%", delay: 0.3, rotate: -5 },
  { icon: "🎙️", label: "Voice Bot", top: "72%", left: "4%", delay: 1.0, rotate: 7 },
  { icon: "📊", label: "Meta Ads", top: "20%", left: "90%", delay: 0.6, rotate: -6 },
  { icon: "🔍", label: "SEO", top: "80%", left: "82%", delay: 0.9, rotate: 5 },
  { icon: "🤖", label: "AI Chat", top: "50%", left: "93%", delay: 0.4, rotate: -4 },
];

function FloatingIcon({ icon, label, top, left, delay, rotate }: typeof floatingIcons[0]) {
  return (
    <motion.div
      className="absolute hidden xl:flex flex-col items-center gap-1 z-10"
      style={{ top, left }}
      initial={{ opacity: 0, scale: 0.5, rotate }}
      animate={{ opacity: 1, scale: 1, rotate: 0 }}
      transition={{ delay, duration: 0.6, ease: EASE }}
    >
      <motion.div
        className="w-12 h-12 bg-white rounded-2xl shadow-lg shadow-black/8 flex items-center justify-center text-2xl border border-black/5"
        animate={{ y: [0, -6, 0] }}
        transition={{ duration: 3 + delay * 0.5, repeat: Infinity, ease: "easeInOut", delay: delay * 0.3 }}
        whileHover={{ scale: 1.15, y: -8 }}
      >
        {icon}
      </motion.div>
      <span className="text-[10px] font-semibold text-[#888] tracking-wide">{label}</span>
    </motion.div>
  );
}

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.11, delayChildren: 0.1 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.75, ease: EASE } },
};

const dashboardVariants = {
  hidden: { opacity: 0, y: 50, scale: 0.96 },
  visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 1.1, ease: EASE, delay: 0.5 } },
};

export default function Hero() {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springX = useSpring(mouseX, { stiffness: 30, damping: 20 });
  const springY = useSpring(mouseY, { stiffness: 30, damping: 20 });

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      mouseX.set((e.clientX / window.innerWidth - 0.5) * 30);
      mouseY.set((e.clientY / window.innerHeight - 0.5) * 30);
    };
    window.addEventListener("mousemove", handler);
    return () => window.removeEventListener("mousemove", handler);
  }, [mouseX, mouseY]);

  const bars = [38, 55, 48, 72, 65, 88, 70, 82, 94, 85, 90, 100];

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden pt-20" style={{ background: "#ebebeb" }}>
      {/* Blob backgrounds */}
      <motion.div
        className="absolute top-0 right-0 w-[700px] h-[700px] rounded-full blur-3xl pointer-events-none"
        style={{ background: "radial-gradient(circle, rgba(232,83,59,0.10) 0%, transparent 70%)", x: springX, y: springY }}
      />
      <motion.div
        className="absolute bottom-0 left-0 w-[500px] h-[500px] rounded-full blur-3xl pointer-events-none"
        style={{ background: "radial-gradient(circle, rgba(99,102,241,0.06) 0%, transparent 70%)" }}
      />

      {/* Floating tool icons */}
      {floatingIcons.map((fi) => <FloatingIcon key={fi.label} {...fi} />)}

      {/* Main content */}
      <div className="container-max px-4 sm:px-6 relative z-10 py-16 w-full">
        <motion.div
          className="text-center max-w-4xl mx-auto"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Badge */}
          <motion.div variants={itemVariants} className="mb-6">
            <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-white shadow-sm border border-black/6 text-sm font-semibold text-[#555]">
              <span className="w-2 h-2 rounded-full bg-[#e8533b] animate-pulse" />
              Trusted by 10,000+ growing businesses
              <span className="text-[#e8533b]">→</span>
            </div>
          </motion.div>

          {/* Headline */}
          <motion.h1
            variants={itemVariants}
            className="text-5xl sm:text-6xl lg:text-7xl xl:text-8xl font-black tracking-tight text-[#1a1a1a] mb-6 leading-[1.05]"
          >
            Your Business on{" "}
            <span className="relative inline-block">
              <span className="gradient-text-coral">Autopilot</span>
              <motion.span
                className="absolute -bottom-1 left-0 right-0 h-[3px] rounded-full"
                style={{ background: "#e8533b" }}
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: 1.0, delay: 0.9, ease: EASE }}
              />
            </span>
            {" "}with AI
          </motion.h1>

          {/* Sub */}
          <motion.p
            variants={itemVariants}
            className="text-lg sm:text-xl text-[#666] max-w-2xl mx-auto mb-10 leading-relaxed"
          >
            One platform — CRM, WhatsApp automation, bulk campaigns, AI website builder,
            voice bots, Meta ads and SEO.{" "}
            <span className="font-semibold text-[#1a1a1a]">Zero code required.</span>
          </motion.p>

          {/* CTAs */}
          <motion.div
            variants={itemVariants}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-5"
          >
            <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}>
              <Link href="/signup" className="btn-coral flex items-center gap-2">
                <Zap className="w-4 h-4" />
                Start Free 14-Day Trial
              </Link>
            </motion.div>
            <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}>
              <button className="btn-outline-light flex items-center gap-2 group">
                <span className="w-8 h-8 rounded-full bg-black/8 group-hover:bg-black/12 flex items-center justify-center transition-colors">
                  <Play className="w-3 h-3 ml-0.5 text-[#1a1a1a]" />
                </span>
                Watch Demo
              </button>
            </motion.div>
          </motion.div>

          <motion.p variants={itemVariants} className="text-sm text-[#999] mb-14">
            No credit card · Setup in 5 min · Cancel anytime
          </motion.p>

          {/* Stats */}
          <motion.div
            variants={itemVariants}
            className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-3xl mx-auto mb-16"
          >
            {[
              { to: 10000, suffix: "+", label: "Businesses" },
              { to: 50, suffix: "M+", label: "Messages/mo" },
              { to: 99.9, suffix: "%", label: "Uptime SLA", decimals: 1 },
              { to: 4.9, suffix: "/5", label: "Rating", decimals: 1 },
            ].map((s) => (
              <motion.div
                key={s.label}
                className="light-card py-4 px-3 text-center"
                whileHover={{ y: -3, boxShadow: "0 8px 24px rgba(0,0,0,0.09)" }}
                transition={{ duration: 0.2 }}
              >
                <div className="text-2xl sm:text-3xl font-black text-[#1a1a1a] mb-0.5">
                  <Counter to={s.to} suffix={s.suffix} decimals={s.decimals} />
                </div>
                <div className="text-xs font-medium text-[#999]">{s.label}</div>
              </motion.div>
            ))}
          </motion.div>

          {/* Dashboard preview */}
          <motion.div variants={dashboardVariants} className="relative max-w-5xl mx-auto">
            {/* Floating badges */}
            <motion.div
              className="absolute -top-4 -right-2 sm:-right-6 z-20 hidden sm:flex items-center gap-2 px-3 py-2 rounded-2xl bg-white shadow-lg border border-black/6 text-xs font-semibold text-[#1a1a1a]"
              animate={{ y: [0, -5, 0] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            >
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              AI Active · 1,240 messages today
            </motion.div>
            <motion.div
              className="absolute -bottom-4 -left-2 sm:-left-6 z-20 hidden sm:flex items-center gap-2 px-3 py-2 rounded-2xl bg-white shadow-lg border border-black/6 text-xs font-semibold text-[#1a1a1a]"
              animate={{ y: [0, 5, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 1 }}
            >
              <TrendingUp className="w-3.5 h-3.5 text-[#e8533b]" />
              +24% conversions this week
            </motion.div>

            {/* Browser frame */}
            <div className="light-card overflow-hidden" style={{ boxShadow: "0 24px 80px rgba(0,0,0,0.10), 0 4px 20px rgba(0,0,0,0.06)" }}>
              {/* Browser chrome */}
              <div className="flex items-center gap-2 px-4 py-3 border-b border-black/6 bg-[#f8f8f8]">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-red-400" />
                  <div className="w-3 h-3 rounded-full bg-yellow-400" />
                  <div className="w-3 h-3 rounded-full bg-green-400" />
                </div>
                <div className="flex-1 mx-4 bg-black/5 rounded-lg h-6 flex items-center px-3">
                  <span className="text-xs text-[#999]">app.vorynto.ai/dashboard</span>
                </div>
                <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-600">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  Live
                </div>
              </div>

              {/* Dashboard */}
              <div className="p-5 bg-[#f5f5f5]">
                <div className="flex gap-4">
                  {/* Sidebar */}
                  <div className="hidden sm:flex flex-col gap-1 w-44 shrink-0">
                    {["Dashboard", "AI CRM", "WhatsApp", "Campaigns", "Voice Bot", "Meta Ads", "SEO"].map((item, i) => (
                      <motion.div
                        key={item}
                        initial={{ opacity: 0, x: -16 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.9 + i * 0.06, duration: 0.35 }}
                        className={`px-3 py-2 rounded-xl text-xs font-semibold cursor-pointer transition-colors ${
                          i === 0
                            ? "bg-[#e8533b] text-white shadow-sm"
                            : "text-[#888] hover:text-[#1a1a1a] hover:bg-white/60"
                        }`}
                      >
                        {item}
                      </motion.div>
                    ))}
                  </div>

                  {/* Main */}
                  <div className="flex-1 space-y-4">
                    {/* Stat cards */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      {[
                        { label: "Total Contacts", value: "12,847", trend: "+12.5%", color: "text-emerald-600" },
                        { label: "Messages Sent", value: "45,291", trend: "+18.2%", color: "text-emerald-600" },
                        { label: "Active Deals", value: "284", trend: "+8.9%", color: "text-emerald-600" },
                        { label: "Conversion Rate", value: "24.8%", trend: "+3.1%", color: "text-emerald-600" },
                      ].map((card, i) => (
                        <motion.div
                          key={card.label}
                          className="bg-white rounded-2xl p-3 border border-black/5"
                          initial={{ opacity: 0, y: 16 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 1.0 + i * 0.08, duration: 0.4 }}
                        >
                          <div className="text-xs text-[#999] mb-1 font-medium">{card.label}</div>
                          <div className="text-xl font-black text-[#1a1a1a]">{card.value}</div>
                          <div className={`text-xs font-semibold mt-0.5 ${card.color}`}>↑ {card.trend}</div>
                        </motion.div>
                      ))}
                    </div>

                    {/* Chart */}
                    <motion.div
                      className="bg-white rounded-2xl p-4 h-36 border border-black/5"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 1.2 }}
                    >
                      <div className="text-xs font-semibold text-[#999] mb-2">Message Volume</div>
                      <div className="flex gap-1 items-end h-24">
                        {bars.map((h, i) => (
                          <motion.div
                            key={i}
                            className="flex-1 rounded-t-lg"
                            style={{ background: `linear-gradient(to top, #e8533b, #f97316)` }}
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: `${h}%`, opacity: 0.85 }}
                            transition={{ delay: 1.25 + i * 0.04, duration: 0.4, ease: EASE }}
                          />
                        ))}
                      </div>
                    </motion.div>

                    {/* Bots status */}
                    <div className="grid grid-cols-3 gap-3">
                      {[
                        { icon: MessageSquare, label: "WhatsApp Bot", msgs: "1,240", color: "bg-emerald-50 text-emerald-600" },
                        { icon: Bot, label: "Website Chatbot", msgs: "892", color: "bg-blue-50 text-blue-600" },
                        { icon: Zap, label: "Voice Bot", msgs: "156", color: "bg-orange-50 text-orange-600" },
                      ].map((bot, i) => (
                        <motion.div
                          key={bot.label}
                          className="bg-white rounded-2xl p-3 flex items-center gap-2 border border-black/5"
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: 1.4 + i * 0.1 }}
                        >
                          <div className={`w-8 h-8 rounded-xl ${bot.color} flex items-center justify-center shrink-0`}>
                            <bot.icon className="w-4 h-4" />
                          </div>
                          <div>
                            <div className="text-[11px] font-bold text-[#1a1a1a] leading-tight">{bot.label}</div>
                            <div className="text-[11px] font-semibold text-emerald-600">{bot.msgs} msgs</div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
