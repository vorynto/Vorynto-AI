import type { Metadata } from "next";
import { Mail, Phone, MapPin, MessageSquare, Clock, Zap } from "lucide-react";

export const metadata: Metadata = {
  title: "Contact Us - Vorynto AI",
  description: "Get in touch with Vorynto AI. We are here to help you succeed.",
};

const contactMethods = [
  {
    icon: Mail,
    title: "Email Us",
    description: "Our team typically responds within 2 hours",
    value: "hello@vorynto.ai",
    href: "mailto:hello@vorynto.ai",
    color: "text-violet-400",
    bg: "bg-violet-600/20",
  },
  {
    icon: MessageSquare,
    title: "Live Chat",
    description: "Chat with us directly on WhatsApp",
    value: "+1 (888) VORYNTO",
    href: "https://wa.me/18888676968",
    color: "text-emerald-400",
    bg: "bg-emerald-600/20",
  },
  {
    icon: Clock,
    title: "Support Hours",
    description: "Priority support available",
    value: "24/7 for Enterprise",
    href: null,
    color: "text-cyan-400",
    bg: "bg-cyan-600/20",
  },
  {
    icon: MapPin,
    title: "Headquarters",
    description: "Visit us",
    value: "San Francisco, CA, USA",
    href: null,
    color: "text-amber-400",
    bg: "bg-amber-600/20",
  },
];

export default function ContactPage() {
  return (
    <div className="min-h-screen pt-20">
      {/* Hero */}
      <section className="section-padding relative overflow-hidden">
        <div className="absolute inset-0 bg-glow-gradient" />
        <div className="container-max px-4 sm:px-6 relative text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-violet-500/20 bg-violet-500/10 text-violet-300 text-sm mb-6">
            <Zap className="w-4 h-4" />
            <span>We typically respond in under 2 hours</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4">
            Get in <span className="gradient-text">Touch</span>
          </h1>
          <p className="text-xl text-white/50 max-w-xl mx-auto">
            Have a question? Want a demo? Need help with your account? Our team is here to help.
          </p>
        </div>
      </section>

      <section className="section-padding">
        <div className="container-max px-4 sm:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-5xl mx-auto">
            {/* Contact form */}
            <div>
              <h2 className="text-2xl font-bold text-white mb-2">Send us a message</h2>
              <p className="text-white/40 text-sm mb-6">
                Fill out the form and we will get back to you within 2 business hours.
              </p>

              <form className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-white/60 mb-1.5">
                      First name
                    </label>
                    <input
                      type="text"
                      placeholder="John"
                      className="input-dark"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-white/60 mb-1.5">
                      Last name
                    </label>
                    <input
                      type="text"
                      placeholder="Smith"
                      className="input-dark"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-white/60 mb-1.5">
                    Work email
                  </label>
                  <input
                    type="email"
                    placeholder="john@company.com"
                    className="input-dark"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-white/60 mb-1.5">
                    Company
                  </label>
                  <input
                    type="text"
                    placeholder="Acme Corp"
                    className="input-dark"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-white/60 mb-1.5">
                    Reason for contact
                  </label>
                  <select className="input-dark bg-[#0f172a]">
                    <option>Sales inquiry</option>
                    <option>Technical support</option>
                    <option>Partnership</option>
                    <option>Billing question</option>
                    <option>Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-white/60 mb-1.5">
                    Message
                  </label>
                  <textarea
                    rows={5}
                    placeholder="Tell us how we can help..."
                    className="input-dark resize-none"
                  />
                </div>

                <button type="submit" className="btn-primary w-full">
                  Send Message
                </button>
              </form>
            </div>

            {/* Contact info */}
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-white mb-2">Other ways to reach us</h2>
                <p className="text-white/40 text-sm mb-6">
                  Choose the channel that works best for you.
                </p>
              </div>

              <div className="space-y-4">
                {contactMethods.map((method) => (
                  <div key={method.title} className="glass-card p-5 flex items-start gap-4">
                    <div className={`w-11 h-11 rounded-xl ${method.bg} flex items-center justify-center shrink-0`}>
                      <method.icon className={`w-5 h-5 ${method.color}`} />
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold text-white">{method.title}</h3>
                      <p className="text-xs text-white/40 mb-1">{method.description}</p>
                      {method.href ? (
                        <a
                          href={method.href}
                          className={`text-sm font-medium ${method.color} hover:opacity-80 transition-opacity`}
                        >
                          {method.value}
                        </a>
                      ) : (
                        <span className="text-sm text-white/60">{method.value}</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Office hours */}
              <div className="glass-card p-6 bg-gradient-to-br from-violet-600/10 to-transparent border-violet-500/20">
                <h3 className="text-base font-semibold text-white mb-3">Support Hours</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between text-white/60">
                    <span>Monday - Friday</span>
                    <span className="text-white">9AM - 8PM UTC</span>
                  </div>
                  <div className="flex justify-between text-white/60">
                    <span>Saturday</span>
                    <span className="text-white">10AM - 5PM UTC</span>
                  </div>
                  <div className="flex justify-between text-white/60">
                    <span>Enterprise</span>
                    <span className="text-emerald-400">24/7 Support</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
