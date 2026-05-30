"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Mail, Phone, MapPin, MessageSquare, Clock, Zap } from "lucide-react";
import { viewportConfig, EASE } from "@/lib/animations";

const contactMethods = [
  { icon: Mail, title: "Email Us", description: "Our team typically responds within 2 hours", value: "hello@vorynto.ai", href: "mailto:hello@vorynto.ai", color: "#7c3aed", bg: "#f5f0ff" },
  { icon: MessageSquare, title: "Live Chat", description: "Chat with us directly on WhatsApp", value: "+1 (888) VORYNTO", href: "https://wa.me/18888676968", color: "#10b981", bg: "#f0fdf6" },
  { icon: Clock, title: "Support Hours", description: "Priority support available", value: "24/7 for Enterprise", href: null, color: "#0891b2", bg: "#ecfeff" },
  { icon: MapPin, title: "Headquarters", description: "Visit us", value: "San Francisco, CA, USA", href: null, color: "#d97706", bg: "#fffbeb" },
];

export default function ContactPageContent() {
  const [submitted, setSubmitted] = useState(false);

  const inputClass = "w-full px-4 py-3 rounded-xl border border-black/10 bg-white text-[#1a1a1a] placeholder-[#bbb] text-sm font-medium outline-none transition-all focus:border-[#e8533b] focus:ring-2 focus:ring-[#e8533b]/10";

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="pt-32 pb-16 text-center relative overflow-hidden" style={{ background: "#ebebeb" }}>
        <motion.div
          className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full blur-3xl pointer-events-none"
          style={{ background: "radial-gradient(circle, rgba(232,83,59,0.08) 0%, transparent 70%)" }}
        />
        <div className="container-max px-4 sm:px-6 relative z-10">
          <motion.div initial={{ opacity: 0, y: 28 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease: EASE }}>
            <div className="section-badge mb-6 inline-flex">
              <Zap className="w-3.5 h-3.5" />
              <span>We typically respond in under 2 hours</span>
            </div>
          </motion.div>
          <motion.h1
            className="text-4xl sm:text-5xl lg:text-7xl font-black text-[#1a1a1a] mb-4 leading-tight"
            initial={{ opacity: 0, y: 28 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1, ease: EASE }}
          >
            Get in <span className="gradient-text-coral">Touch</span>
          </motion.h1>
          <motion.p
            className="text-xl text-[#666] max-w-xl mx-auto"
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
          >
            Have a question? Want a demo? Need help with your account? Our team is here to help.
          </motion.p>
        </div>
      </section>

      {/* Form + Contact info */}
      <section className="py-20" style={{ background: "#ffffff", borderTop: "1px solid rgba(0,0,0,0.06)" }}>
        <div className="container-max px-4 sm:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-5xl mx-auto">
            {/* Form */}
            <motion.div
              initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }}
              viewport={viewportConfig} transition={{ duration: 0.75, ease: EASE }}
            >
              <h2 className="text-2xl font-black text-[#1a1a1a] mb-1">Send us a message</h2>
              <p className="text-[#888] text-sm mb-6">We'll get back to you within 2 business hours.</p>

              {submitted ? (
                <motion.div
                  className="light-card p-10 text-center"
                  initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
                >
                  <div className="w-16 h-16 rounded-2xl bg-[#fff5f3] flex items-center justify-center mx-auto mb-4">
                    <Mail className="w-8 h-8 text-[#e8533b]" />
                  </div>
                  <h3 className="text-xl font-black text-[#1a1a1a] mb-2">Message Sent!</h3>
                  <p className="text-[#666] text-sm">We'll be in touch shortly. Check your inbox.</p>
                </motion.div>
              ) : (
                <motion.form
                  className="space-y-4"
                  onSubmit={(e) => { e.preventDefault(); setSubmitted(true); }}
                  initial="hidden" whileInView="visible" viewport={viewportConfig}
                  variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.07 } } }}
                >
                  <motion.div
                    className="grid grid-cols-2 gap-3"
                    variants={{ hidden: { opacity: 0, y: 10 }, visible: { opacity: 1, y: 0, transition: { duration: 0.35 } } }}
                  >
                    <div>
                      <label className="block text-xs font-bold text-[#666] mb-1.5 uppercase tracking-wide">First name</label>
                      <input type="text" placeholder="John" className={inputClass} />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-[#666] mb-1.5 uppercase tracking-wide">Last name</label>
                      <input type="text" placeholder="Smith" className={inputClass} />
                    </div>
                  </motion.div>
                  {[
                    { label: "Work email", type: "email", placeholder: "john@company.com" },
                    { label: "Company", type: "text", placeholder: "Acme Corp" },
                  ].map(({ label, type, placeholder }) => (
                    <motion.div
                      key={label}
                      variants={{ hidden: { opacity: 0, y: 10 }, visible: { opacity: 1, y: 0, transition: { duration: 0.35 } } }}
                    >
                      <label className="block text-xs font-bold text-[#666] mb-1.5 uppercase tracking-wide">{label}</label>
                      <input type={type} placeholder={placeholder} className={inputClass} />
                    </motion.div>
                  ))}
                  <motion.div
                    variants={{ hidden: { opacity: 0, y: 10 }, visible: { opacity: 1, y: 0, transition: { duration: 0.35 } } }}
                  >
                    <label className="block text-xs font-bold text-[#666] mb-1.5 uppercase tracking-wide">Reason for contact</label>
                    <select className={inputClass} style={{ background: "white" }}>
                      <option>Sales inquiry</option>
                      <option>Technical support</option>
                      <option>Partnership</option>
                      <option>Billing question</option>
                      <option>Other</option>
                    </select>
                  </motion.div>
                  <motion.div
                    variants={{ hidden: { opacity: 0, y: 10 }, visible: { opacity: 1, y: 0, transition: { duration: 0.35 } } }}
                  >
                    <label className="block text-xs font-bold text-[#666] mb-1.5 uppercase tracking-wide">Message</label>
                    <textarea rows={5} placeholder="Tell us how we can help..." className={`${inputClass} resize-none`} />
                  </motion.div>
                  <motion.div
                    variants={{ hidden: { opacity: 0, y: 10 }, visible: { opacity: 1, y: 0, transition: { duration: 0.35 } } }}
                    whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                  >
                    <button type="submit" className="btn-coral w-full">Send Message</button>
                  </motion.div>
                </motion.form>
              )}
            </motion.div>

            {/* Contact info */}
            <motion.div
              className="space-y-5"
              initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }}
              viewport={viewportConfig} transition={{ duration: 0.75, ease: EASE, delay: 0.1 }}
            >
              <div>
                <h2 className="text-2xl font-black text-[#1a1a1a] mb-1">Other ways to reach us</h2>
                <p className="text-[#888] text-sm mb-5">Choose the channel that works best for you.</p>
              </div>
              <div className="space-y-3">
                {contactMethods.map((method, i) => (
                  <motion.div
                    key={method.title}
                    className="light-card p-5 flex items-start gap-4 group"
                    initial={{ opacity: 0, y: 18 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={viewportConfig}
                    transition={{ delay: i * 0.08, duration: 0.45 }}
                    whileHover={{ x: 4, boxShadow: "0 8px 24px rgba(0,0,0,0.08)" }}
                  >
                    <motion.div
                      className="w-11 h-11 rounded-2xl flex items-center justify-center shrink-0"
                      style={{ background: method.bg }}
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      transition={{ type: "spring", stiffness: 300 }}
                    >
                      <method.icon className="w-5 h-5" style={{ color: method.color }} />
                    </motion.div>
                    <div>
                      <h3 className="text-sm font-bold text-[#1a1a1a]">{method.title}</h3>
                      <p className="text-xs text-[#999] mb-1">{method.description}</p>
                      {method.href ? (
                        <a href={method.href} className="text-sm font-semibold hover:underline" style={{ color: method.color }}>
                          {method.value}
                        </a>
                      ) : (
                        <span className="text-sm text-[#555] font-medium">{method.value}</span>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Hours card */}
              <motion.div
                className="light-card p-6"
                style={{ borderLeft: "3px solid #e8533b" }}
                initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={viewportConfig} transition={{ delay: 0.4, duration: 0.45 }}
              >
                <h3 className="text-base font-bold text-[#1a1a1a] mb-3">Support Hours</h3>
                <div className="space-y-2 text-sm">
                  {[
                    { day: "Monday – Friday", hours: "9AM – 8PM UTC" },
                    { day: "Saturday", hours: "10AM – 5PM UTC" },
                    { day: "Enterprise", hours: "24/7 Support", highlight: true },
                  ].map(({ day, hours, highlight }) => (
                    <div key={day} className="flex justify-between">
                      <span className="text-[#666]">{day}</span>
                      <span className={highlight ? "font-bold text-emerald-600" : "font-medium text-[#1a1a1a]"}>{hours}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}
