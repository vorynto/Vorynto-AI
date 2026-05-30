import type { Metadata } from "next";
import PricingPageContent from "@/components/marketing/PricingPageContent";

export const metadata: Metadata = {
  title: "Pricing - Vorynto AI",
  description: "Simple, transparent pricing for Vorynto AI. Start free, scale as you grow.",
};

export default function PricingPage() {
  return <PricingPageContent />;
}
