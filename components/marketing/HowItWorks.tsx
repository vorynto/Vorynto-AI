import { ShoppingCart, Settings, Zap, TrendingUp } from "lucide-react";

const steps = [
  {
    step: "01",
    icon: ShoppingCart,
    title: "Choose Your Plan",
    description:
      "Browse our AI tool packages and pick the plan that fits your business. Purchase in under 2 minutes with our secure checkout.",
    color: "violet",
  },
  {
    step: "02",
    icon: Settings,
    title: "Auto-Setup Your AI Agent",
    description:
      "After purchase, tell us about your business. Our system automatically configures your AI agent with your company details, branding, and integrations.",
    color: "cyan",
  },
  {
    step: "03",
    icon: Zap,
    title: "Connect Your Channels",
    description:
      "Link your WhatsApp Business, Meta Ads, email provider, and more. Our guided setup wizard makes it quick — or let our team handle it for you.",
    color: "emerald",
  },
  {
    step: "04",
    icon: TrendingUp,
    title: "Grow on Autopilot",
    description:
      "Your AI agents work 24/7 — engaging customers, sending campaigns, managing CRM, and optimizing ads while you focus on what matters.",
    color: "amber",
  },
];

const colorMap = {
  violet: { text: "text-violet-400", bg: "bg-violet-600/20", border: "border-violet-500/30", step: "text-violet-300" },
  cyan: { text: "text-cyan-400", bg: "bg-cyan-600/20", border: "border-cyan-500/30", step: "text-cyan-300" },
  emerald: { text: "text-emerald-400", bg: "bg-emerald-600/20", border: "border-emerald-500/30", step: "text-emerald-300" },
  amber: { text: "text-amber-400", bg: "bg-amber-600/20", border: "border-amber-500/30", step: "text-amber-300" },
};

export default function HowItWorks() {
  return (
    <section className="section-padding relative">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
      <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

      <div className="container-max px-4 sm:px-6">
        <div className="text-center mb-14">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4">
            Up and Running in{" "}
            <span className="gradient-text">5 Minutes</span>
          </h2>
          <p className="text-lg text-white/50 max-w-xl mx-auto">
            From purchase to fully operational AI agent — we have automated every step.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((step, index) => {
            const colors = colorMap[step.color as keyof typeof colorMap];
            return (
              <div key={step.step} className="relative">
                {/* Connector line */}
                {index < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-8 left-full w-full h-px bg-gradient-to-r from-white/20 to-transparent z-0 translate-x-4" />
                )}

                <div className="glass-card p-6 relative z-10 h-full">
                  {/* Step number */}
                  <div className={`text-5xl font-black ${colors.step} opacity-20 mb-4 leading-none`}>
                    {step.step}
                  </div>

                  {/* Icon */}
                  <div className={`w-12 h-12 rounded-xl ${colors.bg} border ${colors.border} flex items-center justify-center mb-4`}>
                    <step.icon className={`w-6 h-6 ${colors.text}`} />
                  </div>

                  {/* Content */}
                  <h3 className="text-lg font-semibold text-white mb-2">{step.title}</h3>
                  <p className="text-sm text-white/50 leading-relaxed">{step.description}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
