import type { Metadata } from "next";
import {
  Users, MessageSquare, Mail, Globe, Mic, BarChart3,
  Search, Shield, ArrowRight, CheckCircle2, Zap,
} from "lucide-react";
import Link from "next/link";
import CTA from "@/components/marketing/CTA";

export const metadata: Metadata = {
  title: "Features - Vorynto AI",
  description:
    "Explore all Vorynto AI features: CRM, WhatsApp Bot, Bulk Campaigns, AI Website Builder, Voice Bot, Meta Ads, SEO & more.",
};

const featureSections = [
  {
    id: "crm",
    icon: Users,
    color: "violet",
    iconBg: "bg-violet-600/20",
    iconColor: "text-violet-400",
    badge: "AI CRM",
    title: "Intelligent CRM That Sells for You",
    description:
      "Stop managing spreadsheets. Vorynto AI CRM uses AI to score leads, predict deal outcomes, draft follow-up messages, and tell your team exactly who to call next.",
    features: [
      "AI-powered lead scoring and qualification",
      "Visual deal pipeline with drag-and-drop stages",
      "Automated follow-up sequences via email, SMS & WhatsApp",
      "AI conversation summaries after every interaction",
      "Contact activity timeline and interaction history",
      "Team collaboration with role-based access",
      "Custom fields and tags for segmentation",
      "CSV import and CRM migration support",
    ],
    image: null,
    imageAlt: "CRM Dashboard",
  },
  {
    id: "whatsapp",
    icon: MessageSquare,
    color: "emerald",
    iconBg: "bg-emerald-600/20",
    iconColor: "text-emerald-400",
    badge: "WhatsApp AI Bot",
    title: "WhatsApp Business AI That Never Sleeps",
    description:
      "Connect your WhatsApp Business API and deploy an AI agent that handles customer inquiries, books appointments, processes orders, and qualifies leads 24/7.",
    features: [
      "Official WhatsApp Business API integration",
      "GPT-4 powered contextual conversations",
      "Custom AI persona with your brand voice",
      "Smart human handoff when AI can't resolve",
      "Appointment booking and calendar sync",
      "Order status updates and tracking",
      "Multi-language support (50+ languages)",
      "Conversation analytics and insights",
    ],
    image: null,
    imageAlt: "WhatsApp Bot",
  },
  {
    id: "campaigns",
    icon: Mail,
    color: "cyan",
    iconBg: "bg-cyan-600/20",
    iconColor: "text-cyan-400",
    badge: "Bulk Campaigns",
    title: "Send Millions of Messages with AI Precision",
    description:
      "Create and send personalized bulk campaigns via WhatsApp, SMS, and Email. AI writes your copy, finds the best send time, and tracks every metric.",
    features: [
      "Omnichannel: WhatsApp, SMS & Email campaigns",
      "AI-generated personalized message content",
      "Smart audience segmentation based on behavior",
      "A/B testing for subject lines and content",
      "Optimal send time prediction with AI",
      "Delivery reports and engagement analytics",
      "Template library with approval management",
      "Unsubscribe and compliance management",
    ],
    image: null,
    imageAlt: "Campaign Dashboard",
  },
  {
    id: "website-builder",
    icon: Globe,
    color: "amber",
    iconBg: "bg-amber-600/20",
    iconColor: "text-amber-400",
    badge: "AI Website Builder",
    title: "Build Your Website with AI in Minutes",
    description:
      "Describe your business, and Vorynto AI generates a complete, mobile-responsive website with content, images, and SEO — no designers or developers needed.",
    features: [
      "AI website generation from business description",
      "100+ pre-built industry templates",
      "Drag-and-drop visual editor",
      "Custom domain connection",
      "Built-in SSL and CDN hosting",
      "SEO metadata and sitemap generation",
      "Mobile-responsive design",
      "One-click chatbot integration",
    ],
    image: null,
    imageAlt: "Website Builder",
  },
  {
    id: "voice-bot",
    icon: Mic,
    color: "pink",
    iconBg: "bg-pink-600/20",
    iconColor: "text-pink-400",
    badge: "Voice Bot",
    title: "AI Voice Agents for Phone and Web",
    description:
      "Deploy conversational AI voice bots that handle inbound calls, web conversations, and support tickets with natural, human-like voice interactions.",
    features: [
      "Natural language voice conversations",
      "Phone number integration (inbound & outbound)",
      "Web voice widget for your website",
      "Custom scripts and conversation flows",
      "Call recording and transcription",
      "Integration with your CRM",
      "Appointment booking via voice",
      "Multilingual voice support",
    ],
    image: null,
    imageAlt: "Voice Bot",
  },
  {
    id: "meta-ads",
    icon: BarChart3,
    color: "blue",
    iconBg: "bg-blue-600/20",
    iconColor: "text-blue-400",
    badge: "Meta Ads AI",
    title: "Let AI Manage Your Meta Ad Campaigns",
    description:
      "Connect your Facebook and Instagram ad accounts. Vorynto AI creates, tests, and optimizes your campaigns automatically to maximize ROAS.",
    features: [
      "Facebook & Instagram campaign management",
      "AI ad creative generation (text + visuals)",
      "Automated A/B testing at scale",
      "Smart budget allocation across campaigns",
      "Audience targeting optimization",
      "Conversion tracking and attribution",
      "Lookalike audience creation",
      "Performance reports and insights",
    ],
    image: null,
    imageAlt: "Meta Ads",
  },
  {
    id: "seo",
    icon: Search,
    color: "teal",
    iconBg: "bg-teal-600/20",
    iconColor: "text-teal-400",
    badge: "AI SEO",
    title: "Dominate Search Rankings with AI",
    description:
      "Audit your website, track keywords, generate SEO-optimized content, and get actionable AI recommendations to outrank your competitors.",
    features: [
      "Full website SEO audit with scoring",
      "Keyword rank tracking and analysis",
      "AI SEO content generation",
      "Competitor analysis and gap discovery",
      "Backlink monitoring",
      "Schema markup generation",
      "Core Web Vitals monitoring",
      "Monthly SEO performance reports",
    ],
    image: null,
    imageAlt: "SEO Dashboard",
  },
  {
    id: "chatbot",
    icon: Shield,
    color: "indigo",
    iconBg: "bg-indigo-600/20",
    iconColor: "text-indigo-400",
    badge: "Website Chatbot",
    title: "24/7 AI Chatbot for Your Website",
    description:
      "Embed a powerful AI chatbot on any website in minutes. It captures leads, answers questions, and routes visitors — fully trained on your business.",
    features: [
      "Single line embed code for any website",
      "Train on your documents, FAQs, and website",
      "Lead capture and CRM sync",
      "Custom branding and widget design",
      "Conversation history and analytics",
      "Email/Slack notifications for hot leads",
      "GDPR-compliant data handling",
      "Live chat handoff to human agents",
    ],
    image: null,
    imageAlt: "Website Chatbot",
  },
];

const colorMap: Record<string, { badge: string; check: string }> = {
  violet: { badge: "bg-violet-500/10 border-violet-500/20 text-violet-300", check: "text-violet-400" },
  emerald: { badge: "bg-emerald-500/10 border-emerald-500/20 text-emerald-300", check: "text-emerald-400" },
  cyan: { badge: "bg-cyan-500/10 border-cyan-500/20 text-cyan-300", check: "text-cyan-400" },
  amber: { badge: "bg-amber-500/10 border-amber-500/20 text-amber-300", check: "text-amber-400" },
  pink: { badge: "bg-pink-500/10 border-pink-500/20 text-pink-300", check: "text-pink-400" },
  blue: { badge: "bg-blue-500/10 border-blue-500/20 text-blue-300", check: "text-blue-400" },
  teal: { badge: "bg-teal-500/10 border-teal-500/20 text-teal-300", check: "text-teal-400" },
  indigo: { badge: "bg-indigo-500/10 border-indigo-500/20 text-indigo-300", check: "text-indigo-400" },
};

export default function FeaturesPage() {
  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="pt-32 pb-16 text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-glow-gradient" />
        <div className="container-max px-4 sm:px-6 relative">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-violet-500/20 bg-violet-500/10 text-violet-300 text-sm mb-6">
            <Zap className="w-4 h-4" />
            <span>8 AI-powered modules, 1 unified platform</span>
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-4">
            Features Built for{" "}
            <span className="gradient-text">Modern Business</span>
          </h1>
          <p className="text-xl text-white/50 max-w-2xl mx-auto mb-8">
            Every tool your business needs to attract, engage, and retain customers —
            all powered by AI and seamlessly integrated.
          </p>
          <Link href="/signup" className="btn-primary text-base py-3.5 px-8">
            Start Free Trial
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>

      {/* Feature sections */}
      <div className="space-y-0">
        {featureSections.map((section, i) => {
          const colors = colorMap[section.color] || colorMap.violet;
          const isReverse = i % 2 === 1;

          return (
            <section
              key={section.id}
              id={section.id}
              className="section-padding border-t border-white/5"
            >
              <div className="container-max px-4 sm:px-6">
                <div className={`flex flex-col ${isReverse ? "lg:flex-row-reverse" : "lg:flex-row"} gap-12 lg:gap-20 items-center`}>
                  {/* Content */}
                  <div className="flex-1">
                    <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full border text-sm font-medium mb-4 ${colors.badge}`}>
                      <section.icon className="w-4 h-4" />
                      {section.badge}
                    </div>
                    <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
                      {section.title}
                    </h2>
                    <p className="text-lg text-white/50 mb-8 leading-relaxed">
                      {section.description}
                    </p>
                    <ul className="space-y-3 mb-8">
                      {section.features.map((f) => (
                        <li key={f} className="flex items-center gap-3 text-sm text-white/70">
                          <CheckCircle2 className={`w-4 h-4 ${colors.check} shrink-0`} />
                          {f}
                        </li>
                      ))}
                    </ul>
                    <Link href="/signup" className="btn-primary inline-flex items-center gap-2">
                      Get Started
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>

                  {/* Visual placeholder */}
                  <div className="flex-1 w-full">
                    <div className="glass-card aspect-video flex items-center justify-center border border-white/10">
                      <div className="text-center">
                        <div className={`w-20 h-20 rounded-2xl ${section.iconBg} flex items-center justify-center mx-auto mb-4`}>
                          <section.icon className={`w-10 h-10 ${section.iconColor}`} />
                        </div>
                        <p className="text-white/30 text-sm">{section.badge} Preview</p>
                      </div>
                    </div>
                  </div>
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
