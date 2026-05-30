"use client";

/**
 * RazorpayCheckout
 *
 * Renders a "Subscribe / Pay Now" button for a given plan.
 * On click it:
 *   1. Calls POST /api/checkout/razorpay to create an order / subscription
 *   2. Loads the Razorpay JS SDK (injected once per page)
 *   3. Opens the Razorpay payment modal
 *   4. On success → calls POST /api/checkout/razorpay/verify (signature check)
 *   5. Triggers onSuccess callback so the parent can refresh state
 */

import { useState } from "react";
import { Loader2, CreditCard, CheckCircle2, AlertCircle } from "lucide-react";

/* ─── Razorpay window typings ─────────────────────────────────── */

declare global {
  interface Window {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    Razorpay: new (options: RazorpayOptions) => RazorpayInstance;
  }
}

interface RazorpayOptions {
  key: string;
  amount?: number;
  currency?: string;
  name: string;
  description?: string;
  order_id?: string;
  subscription_id?: string;
  prefill?: { name?: string; email?: string; contact?: string };
  theme?: { color?: string };
  handler?: (response: RazorpaySuccessResponse) => void;
  modal?: { ondismiss?: () => void };
}

interface RazorpaySuccessResponse {
  razorpay_payment_id: string;
  razorpay_order_id?: string;
  razorpay_subscription_id?: string;
  razorpay_signature: string;
}

interface RazorpayInstance {
  open(): void;
  close(): void;
}

/* ─── Props ───────────────────────────────────────────────────── */

interface Props {
  planId: string;
  planName: string;
  billingCycle: "monthly" | "yearly";
  /** Price shown on the button, e.g. "₹2,499" */
  displayPrice: string;
  /** "order" for one-time, "subscription" for recurring */
  mode?: "order" | "subscription";
  onSuccess?: (paymentId: string) => void;
  className?: string;
}

/* ─── SDK loader ──────────────────────────────────────────────── */

function loadRazorpaySDK(): Promise<void> {
  return new Promise((resolve, reject) => {
    if (window.Razorpay) { resolve(); return; }
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error("Failed to load Razorpay SDK"));
    document.body.appendChild(script);
  });
}

/* ─── Component ───────────────────────────────────────────────── */

export default function RazorpayCheckout({
  planId,
  planName,
  billingCycle,
  displayPrice,
  mode = "order",
  onSuccess,
  className = "",
}: Props) {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  async function handleCheckout() {
    setStatus("loading");
    setErrorMsg("");

    try {
      // 1. Create order / subscription on server
      const res = await fetch("/api/checkout/razorpay", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ planId, billingCycle, mode }),
      });
      const data = await res.json() as {
        orderId?: string;
        subscriptionId?: string;
        shortUrl?: string;
        keyId: string;
        amount: number;
        currency: string;
        planName: string;
        tenantName: string;
        email: string;
        error?: string;
      };

      if (!res.ok || data.error) {
        throw new Error(data.error ?? "Could not initiate payment");
      }

      // 2. Load Razorpay SDK
      await loadRazorpaySDK();

      // 3. Open checkout modal
      await new Promise<void>((resolve, reject) => {
        const options: RazorpayOptions = {
          key: data.keyId,
          amount: data.amount,
          currency: data.currency,
          name: "Vorynto AI",
          description: `${planName} — ${billingCycle === "yearly" ? "Annual" : "Monthly"} Plan`,
          prefill: {
            name: data.tenantName,
            email: data.email,
          },
          theme: { color: "#7c3aed" },
          modal: {
            ondismiss: () => {
              setStatus("idle");
              reject(new Error("dismissed"));
            },
          },
          handler: async (response) => {
            try {
              // 4. Verify signature server-side
              const verifyRes = await fetch("/api/checkout/razorpay/verify", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  razorpay_order_id: response.razorpay_order_id,
                  razorpay_payment_id: response.razorpay_payment_id,
                  razorpay_subscription_id: response.razorpay_subscription_id,
                  razorpay_signature: response.razorpay_signature,
                }),
              });
              const verifyData = await verifyRes.json() as { ok?: boolean; error?: string };
              if (!verifyData.ok) throw new Error(verifyData.error ?? "Payment verification failed");
              setStatus("success");
              onSuccess?.(response.razorpay_payment_id);
              resolve();
            } catch (err) {
              setStatus("error");
              setErrorMsg(err instanceof Error ? err.message : "Verification failed");
              reject(err);
            }
          },
        };

        // Attach order_id or subscription_id
        if (mode === "subscription" && data.subscriptionId) {
          options.subscription_id = data.subscriptionId;
          delete options.amount; // not needed for subscriptions
        } else if (data.orderId) {
          options.order_id = data.orderId;
        }

        const rzp = new window.Razorpay(options);
        rzp.open();
      });

    } catch (err) {
      if (err instanceof Error && err.message !== "dismissed") {
        setStatus("error");
        setErrorMsg(err.message);
      }
    }
  }

  if (status === "success") {
    return (
      <div className={`flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-500/15 border border-emerald-500/25 text-emerald-400 text-sm font-semibold ${className}`}>
        <CheckCircle2 className="w-4 h-4 shrink-0" />
        Payment successful!
      </div>
    );
  }

  return (
    <div className={`flex flex-col gap-2 ${className}`}>
      <button
        onClick={handleCheckout}
        disabled={status === "loading"}
        className="btn-primary text-sm py-2.5 px-6 flex items-center justify-center gap-2 disabled:opacity-60"
      >
        {status === "loading" ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : (
          <CreditCard className="w-4 h-4" />
        )}
        {status === "loading"
          ? "Opening payment..."
          : `Pay ${displayPrice} — ${billingCycle === "yearly" ? "Yearly" : "Monthly"}`}
      </button>
      {status === "error" && errorMsg && (
        <div className="flex items-center gap-1.5 text-xs text-red-400">
          <AlertCircle className="w-3.5 h-3.5 shrink-0" />
          {errorMsg}
        </div>
      )}
    </div>
  );
}
