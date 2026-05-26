import type { Metadata } from "next";
import Hero from "@/components/marketing/Hero";
import Features from "@/components/marketing/Features";
import HowItWorks from "@/components/marketing/HowItWorks";
import Pricing from "@/components/marketing/Pricing";
import Testimonials from "@/components/marketing/Testimonials";
import CTA from "@/components/marketing/CTA";

export const metadata: Metadata = {
  title: "Vorynto AI - Multi-Tenant AI Agent Platform",
  description:
    "Transform your business with Vorynto AI. CRM, WhatsApp AI Bot, Bulk Campaigns, AI Website Builder, Voice Bot, Meta Ads & SEO — all in one platform.",
};

export default function HomePage() {
  return (
    <>
      <Hero />
      <Features />
      <HowItWorks />
      <Testimonials />
      <Pricing />
      <CTA />
    </>
  );
}
