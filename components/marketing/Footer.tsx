"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Zap, Twitter, Linkedin, Youtube, Github, Mail, Phone, MapPin } from "lucide-react";
import { viewportConfig, EASE } from "@/lib/animations";

const footerLinks = {
  Product: [
    { label: "Features", href: "/features" },
    { label: "Pricing", href: "/pricing" },
    { label: "Changelog", href: "/changelog" },
    { label: "Roadmap", href: "/roadmap" },
    { label: "API Docs", href: "/docs" },
  ],
  Solutions: [
    { label: "AI CRM", href: "/features#crm" },
    { label: "WhatsApp Bot", href: "/features#whatsapp" },
    { label: "Bulk Campaigns", href: "/features#campaigns" },
    { label: "AI Website Builder", href: "/features#website-builder" },
    { label: "Voice Bot", href: "/features#voice-bot" },
    { label: "Meta Ads AI", href: "/features#meta-ads" },
  ],
  Company: [
    { label: "About Us", href: "/about" },
    { label: "Blog", href: "/blog" },
    { label: "Careers", href: "/careers" },
    { label: "Partners", href: "/partners" },
    { label: "Contact", href: "/contact" },
  ],
  Legal: [
    { label: "Privacy Policy", href: "/privacy" },
    { label: "Terms of Service", href: "/terms" },
    { label: "Cookie Policy", href: "/cookies" },
    { label: "GDPR", href: "/gdpr" },
    { label: "Security", href: "/security" },
  ],
};

const socials = [
  { icon: Twitter, href: "https://twitter.com/voryntoai", label: "Twitter" },
  { icon: Linkedin, href: "https://linkedin.com/company/vorynto-ai", label: "LinkedIn" },
  { icon: Youtube, href: "https://youtube.com/@voryntoai", label: "YouTube" },
  { icon: Github, href: "https://github.com/vorynto", label: "GitHub" },
];

export default function Footer() {
  return (
    <footer className="relative" style={{ background: "#f0f0f0", borderTop: "1px solid rgba(0,0,0,0.08)" }}>
      <div className="container-max px-4 sm:px-6 py-16">
        {/* Top section */}
        <motion.div
          className="grid grid-cols-1 lg:grid-cols-5 gap-12 mb-14"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={viewportConfig}
          transition={{ duration: 0.7, ease: EASE }}
        >
          {/* Brand */}
          <div className="lg:col-span-2">
            <motion.div whileHover={{ scale: 1.03 }} className="inline-block mb-4">
              <Link href="/" className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-[#e8533b] flex items-center justify-center shadow-md shadow-[#e8533b]/25">
                  <Zap className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold text-[#1a1a1a]">
                  Vorynto<span className="text-[#e8533b]"> AI</span>
                </span>
              </Link>
            </motion.div>
            <p className="text-[#666] text-sm leading-relaxed mb-6 max-w-xs">
              The all-in-one AI agent platform for modern businesses. Automate,
              engage, and grow with the power of artificial intelligence.
            </p>
            <div className="space-y-2.5">
              {[
                { Icon: Mail, text: "hello@vorynto.ai" },
                { Icon: Phone, text: "+1 (888) VORYNTO" },
                { Icon: MapPin, text: "San Francisco, CA, USA" },
              ].map(({ Icon, text }) => (
                <motion.div
                  key={text}
                  className="flex items-center gap-2 text-[#888] text-sm"
                  whileHover={{ x: 3, color: "#1a1a1a" }}
                  transition={{ duration: 0.18 }}
                >
                  <Icon className="w-4 h-4 text-[#e8533b]" />
                  <span>{text}</span>
                </motion.div>
              ))}
            </div>

            {/* Socials */}
            <div className="flex items-center gap-2.5 mt-6">
              {socials.map((s) => (
                <motion.a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={s.label}
                  className="w-9 h-9 rounded-xl bg-white border border-black/8 flex items-center justify-center transition-colors hover:border-[#e8533b]/30 hover:bg-[#e8533b]/5"
                  whileHover={{ scale: 1.12, y: -2 }}
                  whileTap={{ scale: 0.92 }}
                >
                  <s.icon className="w-4 h-4 text-[#888] hover:text-[#e8533b]" />
                </motion.a>
              ))}
            </div>
          </div>

          {/* Links */}
          {Object.entries(footerLinks).map(([category, links], ci) => (
            <motion.div
              key={category}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={viewportConfig}
              transition={{ delay: ci * 0.08, duration: 0.55, ease: EASE }}
            >
              <h4 className="text-sm font-bold text-[#1a1a1a] mb-4">{category}</h4>
              <ul className="space-y-2.5">
                {links.map((link) => (
                  <li key={link.label}>
                    <motion.div whileHover={{ x: 3 }} transition={{ duration: 0.18 }}>
                      <Link
                        href={link.href}
                        className="text-sm text-[#888] hover:text-[#e8533b] transition-colors font-medium"
                      >
                        {link.label}
                      </Link>
                    </motion.div>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </motion.div>

        {/* Bottom bar */}
        <motion.div
          className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4"
          style={{ borderTop: "1px solid rgba(0,0,0,0.08)" }}
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={viewportConfig}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <p className="text-sm text-[#aaa]">
            © 2025 Vorynto AI. All rights reserved.
          </p>
          <div className="flex items-center gap-2">
            <motion.span
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-semibold"
              animate={{ opacity: [0.7, 1, 0.7] }}
              transition={{ duration: 2.5, repeat: Infinity }}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              All systems operational
            </motion.span>
          </div>
        </motion.div>
      </div>
    </footer>
  );
}
