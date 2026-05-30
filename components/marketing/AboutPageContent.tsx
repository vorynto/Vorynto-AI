"use client";

import { useRef, useEffect, useState } from "react";
import { motion } from "framer-motion";
import { gsap } from "gsap";
import Link from "next/link";
import { Zap, Target, Shield, Users, ArrowRight, Globe } from "lucide-react";
import CTA from "@/components/marketing/CTA";
import { viewportConfig, staggerContainer, EASE } from "@/lib/animations";

const values = [
  { icon: Target, color: "#7c3aed", bg: "#f5f0ff", title: "Customer First", description: "Every feature we build starts with one question: does this help our customers win? We obsess over outcomes, not features." },
  { icon: Shield, color: "#10b981", bg: "#f0fdf6", title: "Trust & Security", description: "Enterprise-grade security, data privacy, and compliance are non-negotiable. Your data belongs to you." },
  { icon: Zap, color: "#e8533b", bg: "#fff5f3", title: "Speed of Innovation", description: "AI moves fast. We move faster. Our team ships meaningful updates weekly so you are always ahead of the curve." },
  { icon: Globe, color: "#d97706", bg: "#fffbeb", title: "Global Impact", description: "We are building for businesses everywhere — from solo entrepreneurs in Lagos to enterprises in London." },
];

const team = [
  { name: "Alex Rivera", role: "CEO & Co-founder", avatar: "AR", bg: "#7c3aed" },
  { name: "Priya Patel", role: "CTO & Co-founder", avatar: "PP", bg: "#0891b2" },
  { name: "James Osei", role: "Head of Product", avatar: "JO", bg: "#10b981" },
  { name: "Sofia Chen", role: "Head of AI", avatar: "SC", bg: "#db2777" },
  { name: "Marcus Williams", role: "Head of Sales", avatar: "MW", bg: "#d97706" },
  { name: "Aisha Mohammed", role: "Head of Customer Success", avatar: "AM", bg: "#4f46e5" },
];

const milestones = [
  { year: "2022", title: "Founded", description: "Vorynto AI was born with a vision to make enterprise AI accessible to every business." },
  { year: "2023", title: "First 1,000 Customers", description: "Reached our first 1,000 paying customers and launched WhatsApp AI Bot and CRM." },
  { year: "2024", title: "Series A Funding", description: "Raised $8M Series A to accelerate product development and global expansion." },
  { year: "2025", title: "10,000+ Businesses", description: "Now serving 10,000+ businesses across 50+ countries with our full AI platform." },
];

function StatCounter({ value, label }: { value: string; label: string }) {
  const nodeRef = useRef<HTMLDivElement>(null);
  const [hasAnimated, setHasAnimated] = useState(false);
  const [display, setDisplay] = useState("0");
  const match = value.match(/^([^0-9]*)(\d+\.?\d*)(.*)/);
  const prefix = match?.[1] ?? "";
  const num = parseFloat(match?.[2] ?? "0");
  const suffix = match?.[3] ?? "";

  useEffect(() => {
    const el = nodeRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !hasAnimated) {
        setHasAnimated(true);
        observer.disconnect();
        const obj = { val: 0 };
        gsap.to(obj, {
          val: num, duration: 2, ease: "power2.out",
          onUpdate: () => {
            setDisplay(num % 1 !== 0 ? obj.val.toFixed(1) : Math.floor(obj.val).toLocaleString());
          },
        });
      }
    }, { threshold: 0.5 });
    observer.observe(el);
    return () => observer.disconnect();
  }, [num, hasAnimated]);

  return (
    <motion.div
      ref={nodeRef}
      className="light-card p-6 text-center"
      whileHover={{ y: -4, boxShadow: "0 8px 30px rgba(0,0,0,0.09)" }}
      transition={{ duration: 0.2 }}
    >
      <div className="text-3xl font-black gradient-text-coral mb-2">{prefix}{display}{suffix}</div>
      <div className="text-sm font-medium text-[#999]">{label}</div>
    </motion.div>
  );
}

export default function AboutPageContent() {
  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="pt-32 pb-16 text-center relative overflow-hidden" style={{ background: "#ebebeb" }}>
        <motion.div
          className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full blur-3xl pointer-events-none"
          style={{ background: "radial-gradient(circle, rgba(232,83,59,0.08) 0%, transparent 70%)" }}
        />
        <div className="container-max px-4 sm:px-6 relative z-10 max-w-4xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 28 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease: EASE }}>
            <div className="section-badge mb-6 inline-flex">
              <Users className="w-3.5 h-3.5" />
              <span>The team behind Vorynto AI</span>
            </div>
          </motion.div>
          <motion.h1
            className="text-4xl sm:text-5xl lg:text-7xl font-black text-[#1a1a1a] mb-6 leading-tight"
            initial={{ opacity: 0, y: 28 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1, ease: EASE }}
          >
            We're on a Mission to{" "}
            <span className="gradient-text-coral">Democratize AI</span>{" "}
            for Every Business
          </motion.h1>
          <motion.p
            className="text-xl text-[#666] max-w-2xl mx-auto leading-relaxed"
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
          >
            Founded in 2022, Vorynto AI exists to give every business — regardless of size or budget —
            access to the same AI automation that Fortune 500 companies use.
          </motion.p>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16" style={{ background: "#ffffff", borderTop: "1px solid rgba(0,0,0,0.06)" }}>
        <div className="container-max px-4 sm:px-6">
          <motion.div
            className="grid grid-cols-2 lg:grid-cols-4 gap-5"
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={viewportConfig}
          >
            {[
              { value: "10,000+", label: "Businesses powered" },
              { value: "50+", label: "Countries served" },
              { value: "50M+", label: "Messages sent/month" },
              { value: "$50M+", label: "Revenue generated for clients" },
            ].map((stat) => (
              <StatCounter key={stat.label} value={stat.value} label={stat.label} />
            ))}
          </motion.div>
        </div>
      </section>

      {/* Values */}
      <section className="py-20" style={{ background: "#f5f5f5", borderTop: "1px solid rgba(0,0,0,0.06)" }}>
        <div className="container-max px-4 sm:px-6">
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 28 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={viewportConfig} transition={{ duration: 0.7, ease: EASE }}
          >
            <div className="section-badge mb-4 inline-flex"><span>●</span> Our Values</div>
            <h2 className="text-3xl sm:text-4xl font-black text-[#1a1a1a] mb-3">What Drives Us</h2>
            <p className="text-[#666] max-w-xl mx-auto">Everything we do is guided by these core principles.</p>
          </motion.div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {values.map((v, i) => (
              <motion.div
                key={v.title}
                className="light-card p-6 group"
                initial={{ opacity: 0, y: 28 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={viewportConfig}
                transition={{ delay: i * 0.1, duration: 0.6, ease: EASE }}
                whileHover={{ y: -6, boxShadow: "0 12px 40px rgba(0,0,0,0.09)" }}
              >
                <motion.div
                  className="w-12 h-12 rounded-2xl flex items-center justify-center mb-4"
                  style={{ background: v.bg }}
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <v.icon className="w-6 h-6" style={{ color: v.color }} />
                </motion.div>
                <h3 className="text-base font-bold text-[#1a1a1a] mb-2">{v.title}</h3>
                <p className="text-sm text-[#666] leading-relaxed">{v.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-20" style={{ background: "#ffffff", borderTop: "1px solid rgba(0,0,0,0.06)" }}>
        <div className="container-max px-4 sm:px-6">
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 28 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={viewportConfig} transition={{ duration: 0.7 }}
          >
            <div className="section-badge mb-4 inline-flex"><span>●</span> Our Team</div>
            <h2 className="text-3xl sm:text-4xl font-black text-[#1a1a1a] mb-3">Meet the Team</h2>
            <p className="text-[#666] max-w-xl mx-auto">
              A diverse team of AI researchers, engineers, and business experts united by one mission.
            </p>
          </motion.div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-5">
            {team.map((member, i) => (
              <motion.div
                key={member.name}
                className="text-center"
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={viewportConfig}
                transition={{ delay: i * 0.08, duration: 0.5, type: "spring", stiffness: 200 }}
                whileHover={{ y: -6 }}
              >
                <motion.div
                  className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-3 text-white font-bold text-lg shadow-md"
                  style={{ background: member.bg }}
                  whileHover={{ scale: 1.1, rotate: 3 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  {member.avatar}
                </motion.div>
                <div className="text-sm font-bold text-[#1a1a1a]">{member.name}</div>
                <div className="text-xs text-[#999] mt-0.5">{member.role}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-20" style={{ background: "#ebebeb", borderTop: "1px solid rgba(0,0,0,0.06)" }}>
        <div className="container-max px-4 sm:px-6 max-w-3xl mx-auto">
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 28 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={viewportConfig} transition={{ duration: 0.7 }}
          >
            <div className="section-badge mb-4 inline-flex"><span>●</span> Our Story</div>
            <h2 className="text-3xl sm:text-4xl font-black text-[#1a1a1a]">Our Journey</h2>
          </motion.div>
          <div className="relative">
            <motion.div
              className="absolute left-8 top-0 bottom-0 w-[2px] rounded-full"
              style={{ background: "#e8533b" }}
              initial={{ scaleY: 0, transformOrigin: "top" }}
              whileInView={{ scaleY: 1 }}
              viewport={viewportConfig}
              transition={{ duration: 1.2, ease: EASE }}
            />
            <div className="space-y-6">
              {milestones.map((m, i) => (
                <motion.div
                  key={m.year}
                  className="flex gap-6"
                  initial={{ opacity: 0, x: -28 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={viewportConfig}
                  transition={{ delay: i * 0.12, duration: 0.55, ease: EASE }}
                >
                  <motion.div
                    className="w-16 h-16 rounded-2xl flex items-center justify-center shrink-0 font-black text-sm z-10"
                    style={{ background: "#e8533b", color: "#ffffff" }}
                    whileHover={{ scale: 1.08 }}
                  >
                    {m.year}
                  </motion.div>
                  <motion.div
                    className="light-card p-5 flex-1"
                    whileHover={{ x: 4, boxShadow: "0 8px 24px rgba(0,0,0,0.08)" }}
                    transition={{ duration: 0.2 }}
                  >
                    <h3 className="text-base font-bold text-[#1a1a1a] mb-1">{m.title}</h3>
                    <p className="text-sm text-[#666]">{m.description}</p>
                  </motion.div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <CTA />
    </div>
  );
}
