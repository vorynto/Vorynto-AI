import type { Metadata } from "next";
import FeaturesPageContent from "@/components/marketing/FeaturesPageContent";

export const metadata: Metadata = {
  title: "Features - Vorynto AI",
  description:
    "Explore all Vorynto AI features: CRM, WhatsApp Bot, Bulk Campaigns, AI Website Builder, Voice Bot, Meta Ads, SEO & more.",
};

export default function FeaturesPage() {
  return <FeaturesPageContent />;
}
