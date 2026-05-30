import type { Metadata } from "next";
import AboutPageContent from "@/components/marketing/AboutPageContent";

export const metadata: Metadata = {
  title: "About Us - Vorynto AI",
  description: "Learn about Vorynto AI and our mission to democratize AI automation for businesses worldwide.",
};

export default function AboutPage() {
  return <AboutPageContent />;
}
