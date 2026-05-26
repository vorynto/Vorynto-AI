import Link from "next/link";
import { Zap, Twitter, Linkedin, Youtube, Github, Mail, Phone, MapPin } from "lucide-react";

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
    <footer className="relative border-t border-white/5 bg-[#050810]">
      {/* Top gradient line */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-violet-500/50 to-transparent" />

      <div className="container-max px-4 sm:px-6 py-16">
        {/* Top section */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 mb-16">
          {/* Brand */}
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center gap-2.5 mb-4">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-violet-600 to-purple-800 flex items-center justify-center">
                <Zap className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold">
                <span className="gradient-text">Vorynto</span>
                <span className="text-white"> AI</span>
              </span>
            </Link>
            <p className="text-white/50 text-sm leading-relaxed mb-6 max-w-xs">
              The all-in-one AI agent platform for modern businesses. Automate,
              engage, and grow with the power of artificial intelligence.
            </p>
            <div className="space-y-2.5">
              <div className="flex items-center gap-2 text-white/40 text-sm">
                <Mail className="w-4 h-4 text-violet-400" />
                <span>hello@vorynto.ai</span>
              </div>
              <div className="flex items-center gap-2 text-white/40 text-sm">
                <Phone className="w-4 h-4 text-violet-400" />
                <span>+1 (888) VORYNTO</span>
              </div>
              <div className="flex items-center gap-2 text-white/40 text-sm">
                <MapPin className="w-4 h-4 text-violet-400" />
                <span>San Francisco, CA, USA</span>
              </div>
            </div>
            <div className="flex items-center gap-3 mt-6">
              {socials.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={s.label}
                  className="w-9 h-9 rounded-lg bg-white/5 hover:bg-violet-600/20 border border-white/5 hover:border-violet-500/30 flex items-center justify-center transition-all group"
                >
                  <s.icon className="w-4 h-4 text-white/50 group-hover:text-violet-400 transition-colors" />
                </a>
              ))}
            </div>
          </div>

          {/* Links */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h4 className="text-sm font-semibold text-white mb-4">{category}</h4>
              <ul className="space-y-2.5">
                {links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-white/40 hover:text-white/80 transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="border-t border-white/5 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-white/30">
            © 2025 Vorynto AI. All rights reserved.
          </p>
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              All systems operational
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
