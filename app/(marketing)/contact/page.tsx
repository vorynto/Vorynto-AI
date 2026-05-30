import type { Metadata } from "next";
import ContactPageContent from "@/components/marketing/ContactPageContent";

export const metadata: Metadata = {
  title: "Contact Us - Vorynto AI",
  description: "Get in touch with Vorynto AI. We are here to help you succeed.",
};

export default function ContactPage() {
  return <ContactPageContent />;
}
