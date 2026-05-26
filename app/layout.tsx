import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Vorynto AI - Multi-Tenant AI Agent Platform",
    template: "%s | Vorynto AI",
  },
  description:
    "Transform your business with Vorynto AI. All-in-one platform for AI CRM, WhatsApp Bot, Bulk Campaigns, AI Website Builder, Voice Bot, Meta Ads & more.",
  keywords: [
    "AI CRM",
    "WhatsApp AI bot",
    "bulk campaigns",
    "AI website builder",
    "voice bot",
    "meta ads",
    "AI automation",
    "multi-tenant SaaS",
  ],
  authors: [{ name: "Vorynto AI" }],
  creator: "Vorynto AI",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://vorynto.ai",
    siteName: "Vorynto AI",
    title: "Vorynto AI - Multi-Tenant AI Agent Platform",
    description:
      "Transform your business with the all-in-one AI platform. CRM, WhatsApp Bot, Campaigns, Website Builder, Voice Bot & more.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Vorynto AI",
    description: "All-in-one AI Agent Platform for modern businesses",
    creator: "@voryntoai",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={inter.variable} suppressHydrationWarning>
      <body className="antialiased bg-dark-900 text-white">
        {children}
      </body>
    </html>
  );
}
