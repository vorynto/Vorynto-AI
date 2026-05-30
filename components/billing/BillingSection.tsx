"use client";

/**
 * BillingSection — shown in the client Settings page.
 *
 * If the tenant has an active subscription → shows current plan status,
 * usage, period end, and a list of other plans to upgrade/downgrade to.
 *
 * If no subscription → shows all available plans with a "Subscribe" button
 * that opens the Razorpay payment modal.
 */

import { useState } from "react";
import {
  CreditCard, CheckCircle2, Star, Globe,
  CalendarDays, ArrowUpCircle, AlertCircle,
} from "lucide-react";
import RazorpayCheckout from "./RazorpayCheckout";
import type { Database } from "@/types/supabase";

type Plan = Database["public"]["Tables"]["subscription_plans"]["Row"];
type Subscription = Database["public"]["Tables"]["subscriptions"]["Row"];

interface Props {
  plans: Plan[];
  currentSubscription: (Subscription & { plan: Plan | null }) | null;
  razorpayReady: boolean;
}

const PLAN_GRADIENTS = [
  "from-cyan-600/10 border-cyan-500/20",
  "from-violet-600/10 border-violet-500/20",
  "from-amber-600/10 border-amber-500/20",
  "from-emerald-600/10 border-emerald-500/20",
  "from-pink-600/10 border-pink-500/20",
];
const PLAN_COLORS = ["text-cyan-400", "text-violet-400", "text-amber-400", "text-emerald-400", "text-pink-400"];

function formatPrice(plan: Plan, cycle: "monthly" | "yearly") {
  const price = cycle === "yearly" ? plan.price_yearly : plan.price_monthly;
  const currency = plan.currency?.toUpperCase() ?? "INR";
  if (currency === "INR") return `₹${price.toLocaleString("en-IN")}`;
  return `$${price}`;
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-IN", {
    day: "numeric", month: "long", year: "numeric",
  });
}

export default function BillingSection({ plans, currentSubscription, razorpayReady }: Props) {
  const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">("monthly");
  const [successPlan, setSuccessPlan] = useState<string | null>(null);

  const activePlan = currentSubscription?.plan;
  const isActive = currentSubscription?.status === "active";
  const periodEnd = currentSubscription?.current_period_end;

  return (
    <section className="space-y-5">
      {/* ── Section header ────────────────────────────────────── */}
      <div>
        <h2 className="text-base font-semibold text-white flex items-center gap-2">
          <CreditCard className="w-4 h-4 text-violet-400" />
          Billing &amp; Subscription
        </h2>
        <p className="text-xs text-white/40 mt-1">
          Platform subscription fee — API usage is billed separately by each provider.
        </p>
      </div>

      {/* ── Current plan status ───────────────────────────────── */}
      {isActive && activePlan ? (
        <div className="glass-card p-5 border-violet-500/20 bg-gradient-to-br from-violet-600/5 to-transparent">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-violet-600/20 flex items-center justify-center">
                <CheckCircle2 className="w-5 h-5 text-violet-400" />
              </div>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-base font-bold text-white">{activePlan.name}</span>
                  <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/20 flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" /> Active
                  </span>
                  {currentSubscription.billing_cycle && (
                    <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-white/5 text-white/40 border border-white/10 capitalize">
                      {currentSubscription.billing_cycle}
                    </span>
                  )}
                </div>
                <div className="text-xs text-white/40 mt-1">
                  {activePlan.description}
                </div>
              </div>
            </div>
            <div className="text-right shrink-0">
              <div className="text-xl font-bold text-white">
                {currentSubscription.billing_cycle === "yearly"
                  ? `₹${activePlan.price_yearly.toLocaleString("en-IN")}/yr`
                  : `₹${activePlan.price_monthly.toLocaleString("en-IN")}/mo`}
              </div>
              {periodEnd && (
                <div className="text-xs text-white/30 mt-1 flex items-center gap-1 justify-end">
                  <CalendarDays className="w-3 h-3" />
                  Renews {formatDate(periodEnd)}
                </div>
              )}
            </div>
          </div>

          {/* Feature limits bars */}
          {activePlan.feature_limits && Object.keys(activePlan.feature_limits as object).length > 0 && (
            <div className="mt-4 pt-4 border-t border-white/5 grid grid-cols-3 gap-4">
              {Object.entries(activePlan.feature_limits as Record<string, number>)
                .slice(0, 3)
                .map(([key, limit]) => (
                  <div key={key}>
                    <div className="flex justify-between text-xs text-white/40 mb-1">
                      <span className="capitalize">{key.replace(/_/g, " ")}</span>
                      <span>{limit === -1 ? "Unlimited" : limit.toLocaleString()}</span>
                    </div>
                    <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                      <div className="h-full w-0 rounded-full bg-gradient-to-r from-violet-600 to-cyan-500" />
                    </div>
                  </div>
                ))}
            </div>
          )}

          <p className="text-xs text-white/25 mt-4 flex items-center gap-1.5">
            <Globe className="w-3 h-3 shrink-0" />
            OpenAI, WhatsApp, Twilio, and email provider costs are billed separately by those providers.
          </p>
        </div>
      ) : (
        <div className="glass-card p-5 border-dashed border-amber-500/20 flex items-center gap-4">
          <AlertCircle className="w-5 h-5 text-amber-400 shrink-0" />
          <div>
            <div className="text-sm font-semibold text-white">No active subscription</div>
            <div className="text-xs text-white/40 mt-0.5">Choose a plan below to get started.</div>
          </div>
        </div>
      )}

      {/* ── Billing cycle toggle ──────────────────────────────── */}
      {plans.length > 0 && (
        <>
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-white flex items-center gap-2">
              <ArrowUpCircle className="w-4 h-4 text-violet-400" />
              {isActive ? "Change Plan" : "Choose a Plan"}
            </h3>
            <div className="flex items-center gap-1 p-1 rounded-xl bg-white/5 border border-white/10">
              <button
                onClick={() => setBillingCycle("monthly")}
                className={`px-4 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                  billingCycle === "monthly"
                    ? "bg-violet-600 text-white"
                    : "text-white/40 hover:text-white/70"
                }`}
              >
                Monthly
              </button>
              <button
                onClick={() => setBillingCycle("yearly")}
                className={`px-4 py-1.5 text-xs font-semibold rounded-lg transition-all flex items-center gap-1.5 ${
                  billingCycle === "yearly"
                    ? "bg-violet-600 text-white"
                    : "text-white/40 hover:text-white/70"
                }`}
              >
                Yearly
                <span className="px-1.5 py-0.5 text-[9px] font-bold rounded-full bg-emerald-500/20 text-emerald-400">
                  Save ~20%
                </span>
              </button>
            </div>
          </div>

          {/* ── Plans grid ─────────────────────────────────────── */}
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
            {plans.map((plan, i) => {
              const isCurrent = activePlan?.id === plan.id;
              const paymentSuccess = successPlan === plan.id;
              const gradient = PLAN_GRADIENTS[i % PLAN_GRADIENTS.length];
              const color = PLAN_COLORS[i % PLAN_COLORS.length];
              const hasRazorpayId = billingCycle === "yearly"
                ? Boolean(plan.razorpay_plan_id_yearly)
                : Boolean(plan.razorpay_plan_id_monthly);

              return (
                <div
                  key={plan.id}
                  className={`glass-card p-6 relative bg-gradient-to-b ${gradient} ${
                    isCurrent ? "ring-1 ring-violet-500/30" : ""
                  } ${plan.is_featured ? "border-violet-500/40" : ""}`}
                >
                  {plan.is_featured && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-violet-600 text-white text-xs font-bold flex items-center gap-1 whitespace-nowrap">
                      <Star className="w-3 h-3" /> Most Popular
                    </div>
                  )}
                  {isCurrent && (
                    <div className="absolute -top-3 right-4 px-3 py-0.5 rounded-full bg-emerald-600 text-white text-xs font-bold flex items-center gap-1 whitespace-nowrap">
                      <CheckCircle2 className="w-3 h-3" /> Current Plan
                    </div>
                  )}

                  <h3 className={`text-lg font-bold mb-1 ${color}`}>{plan.name}</h3>
                  <p className="text-xs text-white/30 mb-4 min-h-8">{plan.description}</p>

                  <div className="mb-4">
                    <div className="text-2xl font-bold text-white">
                      {formatPrice(plan, billingCycle)}
                      <span className="text-sm font-normal text-white/30">
                        /{billingCycle === "yearly" ? "yr" : "mo"}
                      </span>
                    </div>
                    {billingCycle === "yearly" && (
                      <div className="text-xs text-emerald-400 mt-0.5">
                        ≈ {formatPrice(plan, "monthly")}/mo billed annually
                      </div>
                    )}
                  </div>

                  <ul className="space-y-1.5 mb-5">
                    {((plan.features as string[]) ?? []).slice(0, 5).map((f) => (
                      <li key={f} className="flex items-start gap-2 text-xs text-white/50">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                        {f}
                      </li>
                    ))}
                    {((plan.features as string[]) ?? []).length > 5 && (
                      <li className="text-xs text-white/25 pl-5">
                        +{((plan.features as string[]) ?? []).length - 5} more features
                      </li>
                    )}
                  </ul>

                  {/* CTA */}
                  {isCurrent ? (
                    <div className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-sm text-white/40 font-medium">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      Active Plan
                    </div>
                  ) : paymentSuccess ? (
                    <div className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-500/15 border border-emerald-500/20 text-sm text-emerald-400 font-semibold">
                      <CheckCircle2 className="w-4 h-4" />
                      Payment successful!
                    </div>
                  ) : razorpayReady ? (
                    <RazorpayCheckout
                      planId={plan.id}
                      planName={plan.name}
                      billingCycle={billingCycle}
                      displayPrice={formatPrice(plan, billingCycle)}
                      mode={hasRazorpayId ? "subscription" : "order"}
                      onSuccess={() => setSuccessPlan(plan.id)}
                      className="w-full"
                    />
                  ) : (
                    <div className="flex items-center gap-1.5 text-xs text-white/30 justify-center p-2.5 rounded-xl bg-white/3 border border-white/5">
                      <AlertCircle className="w-3.5 h-3.5 text-amber-400/60" />
                      Payment not configured — contact admin
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {!razorpayReady && (
            <p className="text-xs text-white/25 flex items-center gap-1.5">
              <AlertCircle className="w-3.5 h-3.5 text-amber-400/50 shrink-0" />
              Online payments are not yet available. Contact support to upgrade your plan.
            </p>
          )}
        </>
      )}
    </section>
  );
}
