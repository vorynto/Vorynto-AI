import Link from "next/link";
import { ArrowRight, Zap } from "lucide-react";

export default function CTA() {
  return (
    <section className="section-padding">
      <div className="container-max px-4 sm:px-6">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-violet-900/60 via-purple-900/40 to-[#080b14] border border-violet-500/20 p-10 sm:p-16 text-center">
          {/* Glow orbs */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-64 bg-violet-600/20 blur-3xl rounded-full" />
          <div className="absolute bottom-0 right-1/4 w-64 h-48 bg-cyan-500/10 blur-3xl rounded-full" />

          {/* Content */}
          <div className="relative z-10">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-violet-400/30 bg-violet-500/10 text-violet-300 text-sm font-medium mb-6">
              <Zap className="w-4 h-4" />
              Start free — no credit card required
            </div>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4">
              Ready to Transform Your Business?
            </h2>
            <p className="text-lg text-white/50 max-w-xl mx-auto mb-10">
              Join 10,000+ businesses using Vorynto AI to automate customer engagement,
              generate more leads, and scale without limits.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/signup" className="btn-primary text-base py-4 px-10">
                <Zap className="w-5 h-5" />
                Get Started Free
              </Link>
              <Link href="/contact" className="btn-secondary text-base py-4 px-10 group">
                Talk to Sales
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>

            <p className="text-sm text-white/30 mt-6">
              14-day free trial · No credit card · Cancel anytime
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
