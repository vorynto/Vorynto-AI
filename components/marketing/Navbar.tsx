"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, ChevronDown, Zap } from "lucide-react";
import { EASE } from "@/lib/animations";

const navLinks = [
  {
    label: "Features",
    href: "/features",
    dropdown: [
      { label: "AI CRM", href: "/features#crm", icon: "🤝" },
      { label: "WhatsApp AI Bot", href: "/features#whatsapp", icon: "💬" },
      { label: "Bulk Campaigns", href: "/features#campaigns", icon: "📢" },
      { label: "AI Website Builder", href: "/features#website-builder", icon: "🌐" },
      { label: "Voice Bot", href: "/features#voice-bot", icon: "🎙️" },
      { label: "Meta Ads AI", href: "/features#meta-ads", icon: "📊" },
      { label: "AI SEO", href: "/features#seo", icon: "🔍" },
    ],
  },
  { label: "Pricing", href: "/pricing" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
];

const dropdownVariants = {
  hidden: { opacity: 0, y: -6, scale: 0.97 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.18, ease: EASE },
  },
  exit: { opacity: 0, y: -6, scale: 0.97, transition: { duration: 0.12 } },
};

const dropdownItemVariants = {
  hidden: { opacity: 0, x: -8 },
  visible: (i: number) => ({
    opacity: 1,
    x: 0,
    transition: { delay: i * 0.04, duration: 0.18 },
  }),
};

const mobileMenuVariants = {
  hidden: { opacity: 0, height: 0 },
  visible: { opacity: 1, height: "auto", transition: { duration: 0.28, ease: EASE } },
  exit: { opacity: 0, height: 0, transition: { duration: 0.2 } },
};

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 24);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <motion.nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-white/95 backdrop-blur-xl shadow-[0_2px_20px_rgba(0,0,0,0.08)] border-b border-black/5"
          : "bg-transparent"
      }`}
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: EASE }}
    >
      <div className="container-max px-4 sm:px-6">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}>
            <Link href="/" className="flex items-center gap-2.5 group">
              <motion.div
                className="w-9 h-9 rounded-xl bg-[#e8533b] flex items-center justify-center shadow-md shadow-[#e8533b]/30"
                whileHover={{ rotate: [0, -10, 10, 0], transition: { duration: 0.4 } }}
              >
                <Zap className="w-5 h-5 text-white" />
              </motion.div>
              <span className="text-xl font-bold tracking-tight text-[#1a1a1a]">
                Vorynto<span className="text-[#e8533b]"> AI</span>
              </span>
            </Link>
          </motion.div>

          {/* Desktop Nav */}
          <div className="hidden lg:flex items-center gap-1">
            {navLinks.map((link, i) => (
              <div
                key={link.label}
                className="relative"
                onMouseEnter={() => link.dropdown && setActiveDropdown(link.label)}
                onMouseLeave={() => setActiveDropdown(null)}
              >
                <motion.div
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 + i * 0.07, duration: 0.4 }}
                >
                  <Link
                    href={link.href}
                    className="flex items-center gap-1 px-4 py-2 rounded-xl text-sm font-medium text-[#444] hover:text-[#1a1a1a] hover:bg-black/5 transition-all duration-200"
                  >
                    {link.label}
                    {link.dropdown && (
                      <ChevronDown
                        className={`w-3.5 h-3.5 transition-transform duration-200 ${
                          activeDropdown === link.label ? "rotate-180" : ""
                        }`}
                      />
                    )}
                  </Link>
                </motion.div>

                <AnimatePresence>
                  {link.dropdown && activeDropdown === link.label && (
                    <motion.div
                      className="absolute top-full left-0 pt-2 w-64"
                      variants={dropdownVariants}
                      initial="hidden"
                      animate="visible"
                      exit="exit"
                    >
                      <div className="light-card p-2 shadow-xl shadow-black/10">
                        {link.dropdown.map((item, j) => (
                          <motion.div
                            key={item.label}
                            custom={j}
                            variants={dropdownItemVariants}
                            initial="hidden"
                            animate="visible"
                          >
                            <Link
                              href={item.href}
                              className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-[#e8533b]/5 transition-colors group"
                            >
                              <span className="text-lg">{item.icon}</span>
                              <span className="text-sm font-medium text-[#555] group-hover:text-[#1a1a1a] transition-colors">
                                {item.label}
                              </span>
                            </Link>
                          </motion.div>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>

          {/* CTA */}
          <motion.div
            className="hidden lg:flex items-center gap-3"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
          >
            <Link
              href="/login"
              className="px-4 py-2 text-sm font-medium text-[#555] hover:text-[#1a1a1a] transition-colors"
            >
              Log in
            </Link>
            <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}>
              <Link href="/signup" className="btn-coral text-sm py-2.5 px-5">
                Get Started Free
              </Link>
            </motion.div>
          </motion.div>

          {/* Mobile Toggle */}
          <motion.button
            onClick={() => setIsOpen(!isOpen)}
            className="lg:hidden p-2 rounded-xl hover:bg-black/5 transition-colors"
            whileTap={{ scale: 0.92 }}
          >
            <AnimatePresence mode="wait">
              {isOpen ? (
                <motion.div
                  key="close"
                  initial={{ rotate: -90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: 90, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <X className="w-5 h-5 text-[#1a1a1a]" />
                </motion.div>
              ) : (
                <motion.div
                  key="menu"
                  initial={{ rotate: 90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: -90, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <Menu className="w-5 h-5 text-[#1a1a1a]" />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.button>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              className="lg:hidden pb-5 border-t border-black/6 mt-1 pt-4 space-y-1 overflow-hidden bg-white/90 backdrop-blur-xl rounded-b-2xl px-2"
              variants={mobileMenuVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              {navLinks.map((link, i) => (
                <motion.div
                  key={link.label}
                  initial={{ opacity: 0, x: -16 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.06 }}
                >
                  <Link
                    href={link.href}
                    onClick={() => setIsOpen(false)}
                    className="block px-4 py-2.5 text-sm font-medium text-[#444] hover:text-[#1a1a1a] hover:bg-black/5 rounded-xl transition-all"
                  >
                    {link.label}
                  </Link>
                  {link.dropdown && (
                    <div className="ml-4 mt-1 space-y-0.5">
                      {link.dropdown.map((item) => (
                        <Link
                          key={item.label}
                          href={item.href}
                          onClick={() => setIsOpen(false)}
                          className="flex items-center gap-2.5 px-4 py-2 text-sm text-[#666] hover:text-[#1a1a1a] hover:bg-black/5 rounded-xl transition-all"
                        >
                          <span className="text-base">{item.icon}</span>
                          <span>{item.label}</span>
                        </Link>
                      ))}
                    </div>
                  )}
                </motion.div>
              ))}
              <motion.div
                className="pt-3 flex flex-col gap-2 border-t border-black/6 mt-2"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.28 }}
              >
                <Link
                  href="/login"
                  className="w-full text-center px-4 py-2.5 text-sm font-medium text-[#555] hover:text-[#1a1a1a] border border-black/10 rounded-xl hover:bg-black/5 transition-all"
                >
                  Log in
                </Link>
                <Link href="/signup" className="btn-coral text-sm text-center w-full">
                  Get Started Free
                </Link>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.nav>
  );
}
