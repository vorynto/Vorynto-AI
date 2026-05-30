"use client";

import { motion } from "framer-motion";
import {
  Users, MessageSquare, Mail, Globe, Mic, BarChart3,
  Search, Shield, ArrowRight, CheckCircle2, Zap,
} from "lucide-react";
import Link from "next/link";
import CTA from "@/components/marketing/CTA";
import { viewportConfig, EASE } from "@/lib/animations";

const featureSections = [
  {
    id: "crm", icon: Users, color: "#7c3aed", bg: "#f5f0ff",
    badge: "AI CRM",
    title: "Intelligent CRM That Sells for You",
    description: "Stop managing spreadsheets. Vorynto AI CRM uses AI to score leads, predict deal outcomes, draft follow-up messages, and tell your team exactly who to call next.",
    features: ["AI-powered lead scoring and qualification", "Visual deal pipeline with drag-and-drop stages", "Automated follow-up sequences via email, SMS & WhatsApp", "AI conversation summaries after every interaction", "Contact activity timeline and interaction history", "Team collaboration with role-based access", "Custom fields and tags for segmentation", "CSV import and CRM migration support"],
  },
  {
    id: "whatsapp", icon: MessageSquare, color: "#10b981", bg: "#f0fdf6",
    badge: "WhatsApp AI Bot",
    title: "WhatsApp Business AI That Never Sleeps",
    description: "Connect your WhatsApp Business API and deploy an AI agent that handles customer inquiries, books appointments, processes orders, and qualifies leads 24/7.",
    features: ["Official WhatsApp Business API integration", "GPT-4 powered contextual conversations", "Custom AI persona with your brand voice", "Smart human handoff when AI can't resolve", "Appointment booking and calendar sync", "Order status updates and tracking", "Multi-language support (50+ languages)", "Conversation analytics and insights"],
  },
  {
    id: "campaigns", icon: Mail, color: "#0891b2", bg: "#ecfeff",
    badge: "Bulk Campaigns",
    title: "Send Millions of Messages with AI Precision",
    description: "Create and send personalized bulk campaigns via WhatsApp, SMS, and Email. AI writes your copy, finds the best send time, and tracks every metric.",
    features: ["Omnichannel: WhatsApp, SMS & Email campaigns", "AI-generated personalized message content", "Smart audience segmentation based on behavior", "A/B testing for subject lines and content", "Optimal send time prediction with AI", "Delivery reports and engagement analytics", "Template library with approval management", "Unsubscribe and compliance management"],
  },
  {
    id: "website-builder", icon: Globe, color: "#d97706", bg: "#fffbeb",
    badge: "AI Website Builder",
    title: "Build Your Website with AI in Minutes",
    description: "Describe your business, and Vorynto AI generates a complete, mobile-responsive website with content, images, and SEO — no designers or developers needed.",
    features: ["AI website generation from business description", "100+ pre-built industry templates", "Drag-and-drop visual editor", "Custom domain connection", "Built-in SSL and CDN hosting", "SEO metadata and sitemap generation", "Mobile-responsive design", "One-click chatbot integration"],
  },
  {
    id: "voice-bot", icon: Mic, color: "#db2777", bg: "#fdf2f8",
    badge: "Voice Bot",
    title: "AI Voice Agents for Phone and Web",
    description: "Deploy conversational AI voice bots that handle inbound calls, web conversations, and support tickets with natural, human-like voice interactions.",
    features: ["Natural language voice conversations", "Phone number integration (inbound & outbound)", "Web voice widget for your website", "Custom scripts and conversation flows", "Call recording and transcription", "Integration with your CRM", "Appointment booking via voice", "Multilingual voice support"],
  },
  {
    id: "meta-ads", icon: BarChart3, color: "#2563eb", bg: "#eff6ff",
    badge: "Meta Ads AI",
    title: "Let AI Manage Your Meta Ad Campaigns",
    description: "Connect your Facebook and Instagram ad accounts. Vorynto AI creates, tests, and optimizes your campaigns automatically to maximize ROAS.",
    features: ["Facebook & Instagram campaign management", "AI ad creative generation (text + visuals)", "Automated A/B testing at scale", "Smart budget allocation across campaigns", "Audience targeting optimization", "Conversion tracking and attribution", "Lookalike audience creation", "Performance reports and insights"],
  },
  {
    id: "seo", icon: Search, color: "#0d9488", bg: "#f0fdfa",
    badge: "AI SEO",
    title: "Dominate Search Rankings with AI",
    description: "Audit your website, track keywords, generate SEO-optimized content, and get actionable AI recommendations to outrank your competitors.",
    features: ["Full website SEO audit with scoring", "Keyword rank tracking and analysis", "AI SEO content generation", "Competitor analysis and gap discovery", "Backlink monitoring", "Schema markup generation", "Core Web Vitals monitoring", "Monthly SEO performance reports"],
  },
  {
    id: "chatbot", icon: Shield, color: "#e8533b", bg: "#fff5f3",
    badge: "Website Chatbot",
    title: "24/7 AI Chatbot for Your Website",
    description: "Embed a powerful AI chatbot on any website in minutes. It captures leads, answers questions, and routes visitors — fully trained on your business.",
    features: ["Single line embed code for any website", "Train on your documents, FAQs, and website", "Lead capture and CRM sync", "Custom branding and widget design", "Conversation history and analytics", "Email/Slack notifications for hot leads", "GDPR-compliant data handling", "Live chat handoff to human agents"],
  },
];

export default function FeaturesPageContent() {
  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="pt-32 pb-16 text-center relative overflow-hidden" style={{ background: "#ebebeb" }}>
        <motion.div
          className="absolute top-0 right-0 w-[600px] h-[500px] rounded-full blur-3xl pointer-events-none"
          style={{ background: "radial-gradient(circle, rgba(232,83,59,0.08) 0%, transparent 70%)" }}
        />
        <div className="container-max px-4 sm:px-6 relative z-10">
          <motion.div initial={{ opacity: 0, y: 28 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease: EASE }}>
            <div className="section-badge mb-6 inline-flex">
              <Zap className="w-3.5 h-3.5" />
              <span>8 AI-powered modules, 1 unified platform</span>
            </div>
          </motion.div>
          <motion.h1
            className="text-4xl sm:text-5xl lg:text-7xl font-black text-[#1a1a1a] mb-4 leading-tight"
            initial={{ opacity: 0, y: 28 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1, ease: EASE }}
          >
            Features Built for{" "}
            <span className="gradient-text-coral">Modern Business</span>
          </motion.h1>
          <motion.p
            className="text-xl text-[#666] max-w-2xl mx-auto mb-8"
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
          >
            Every tool your business needs to attract, engage, and retain customers —
            all powered by AI and seamlessly integrated.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}
            className="inline-block"
          >
            <Link href="/signup" className="btn-coral inline-flex items-center gap-2">
              Start Free Trial <ArrowRight className="w-5 h-5" />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Feature sections */}
      <div>
        {featureSections.map((section, i) => {
          const isReverse = i % 2 === 1;
          const sectionBg = i % 2 === 0 ? "#ffffff" : "#f5f5f5";
          return (
            <section
              key={section.id}
              id={section.id}
              className="py-20 relative overflow-hidden"
              style={{ background: sectionBg, borderTop: "1px solid rgba(0,0,0,0.06)" }}
            >
              <div className="container-max px-4 sm:px-6">
                <div className={`flex flex-col ${isReverse ? "lg:flex-row-reverse" : "lg:flex-row"} gap-12 lg:gap-20 items-center`}>
                  {/* Content */}
                  <motion.div
                    className="flex-1"
                    initial={{ opacity: 0, x: isReverse ? 40 : -40 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={viewportConfig}
                    transition={{ duration: 0.75, ease: EASE }}
                  >
                    <div
                      className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-bold mb-5"
                      style={{ background: section.bg, color: section.color }}
                    >
                      <section.icon className="w-3.5 h-3.5" />
                      {section.badge}
                    </div>
                    <h2 className="text-3xl sm:text-4xl font-black text-[#1a1a1a] mb-4 leading-tight">{section.title}</h2>
                    <p className="text-lg text-[#666] mb-8 leading-relaxed">{section.description}</p>
                    <motion.ul
                      className="space-y-3 mb-8"
                      initial="hidden" whileInView="visible" viewport={viewportConfig}
                      variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.06 } } }}
                    >
                      {section.features.map((f) => (
                        <motion.li
                          key={f}
                          className="flex items-center gap-3 text-sm text-[#555]"
                          variants={{ hidden: { opacity: 0, x: -14 }, visible: { opacity: 1, x: 0, transition: { duration: 0.35 } } }}
                        >
                          <CheckCircle2 className="w-4 h-4 shrink-0" style={{ color: section.color }} />
                          {f}
                        </motion.li>
                      ))}
                    </motion.ul>
                    <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }} className="inline-block">
                      <Link href="/signup" className="btn-dark inline-flex items-center gap-2">
                        Get Started <ArrowRight className="w-4 h-4" />
                      </Link>
                    </motion.div>
                  </motion.div>

                  {/* Visual */}
                  <motion.div
                    className="flex-1 w-full"
                    initial={{ opacity: 0, x: isReverse ? -40 : 40 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={viewportConfig}
                    transition={{ duration: 0.75, ease: EASE, delay: 0.1 }}
                  >
                    <motion.div
                      className="light-card aspect-video flex items-center justify-center relative overflow-hidden"
                      whileHover={{ y: -4, boxShadow: "0 16px 48px rgba(0,0,0,0.10)" }}
                      transition={{ duration: 0.25 }}
                    >
                      <motion.div
                        className="absolute inset-0 opacity-30 pointer-events-none"
                        style={{ background: `radial-gradient(circle at 50% 30%, ${section.bg}, transparent 70%)` }}
                        animate={{ opacity: [0.2, 0.4, 0.2] }}
                        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                      />
                      <div className="text-center relative z-10">
                        <motion.div
                          className="w-20 h-20 rounded-3xl flex items-center justify-center mx-auto mb-4"
                          style={{ background: section.bg }}
                          animate={{ y: [0, -8, 0] }}
                          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                          whileHover={{ scale: 1.15, rotate: 5 }}
                        >
                          <section.icon className="w-10 h-10" style={{ color: section.color }} />
                        </motion.div>
                        <p className="text-[#999] text-sm font-medium">{section.badge}</p>
                      </div>
                    </motion.div>
                  </motion.div>
                </div>
              </div>
            </section>
          );
        })}
      </div>
      <CTA />
    </div>
  );
}
