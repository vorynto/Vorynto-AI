"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Eye, EyeOff, CheckCircle2, ArrowRight } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

const plans = [
  { value: "starter", label: "Starter — $49/mo" },
  { value: "growth", label: "Growth — $149/mo (Most Popular)" },
  { value: "enterprise", label: "Enterprise — $399/mo" },
];

export default function SignupForm() {
  const searchParams = useSearchParams();
  const defaultPlan = searchParams.get("plan") || "growth";

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    companyName: "",
    plan: defaultPlan,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const router = useRouter();

  async function handleSignup(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const supabase = createClient();

    const { data, error } = await supabase.auth.signUp({
      email: formData.email,
      password: formData.password,
      options: {
        data: {
          first_name: formData.firstName,
          last_name: formData.lastName,
          company_name: formData.companyName,
          plan: formData.plan,
        },
      },
    });

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    if (data.user) {
      setSuccess(true);
      setTimeout(() => router.push("/onboarding"), 1500);
    }
    setLoading(false);
  }

  if (success) {
    return (
      <div className="w-full max-w-lg text-center">
        <div className="glass-card p-10 border border-white/10">
          <div className="w-16 h-16 rounded-full bg-emerald-500/20 flex items-center justify-center mx-auto mb-4">
            <CheckCircle2 className="w-8 h-8 text-emerald-400" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">Account Created!</h2>
          <p className="text-white/40 text-sm">Setting up your AI workspace...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-lg">
      <div className="glass-card p-8 border border-white/10">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-white mb-1">Start Your Free Trial</h1>
          <p className="text-white/40 text-sm">14 days free · No credit card required</p>
        </div>

        <form onSubmit={handleSignup} className="space-y-4">
          {error && (
            <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
              {error}
            </div>
          )}

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-white/60 mb-1.5">First name</label>
              <input type="text" value={formData.firstName} onChange={(e) => setFormData({ ...formData, firstName: e.target.value })} placeholder="John" required className="input-dark" />
            </div>
            <div>
              <label className="block text-sm font-medium text-white/60 mb-1.5">Last name</label>
              <input type="text" value={formData.lastName} onChange={(e) => setFormData({ ...formData, lastName: e.target.value })} placeholder="Smith" required className="input-dark" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-white/60 mb-1.5">Company name</label>
            <input type="text" value={formData.companyName} onChange={(e) => setFormData({ ...formData, companyName: e.target.value })} placeholder="Acme Corp" required className="input-dark" />
          </div>

          <div>
            <label className="block text-sm font-medium text-white/60 mb-1.5">Work email</label>
            <input type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} placeholder="you@company.com" required className="input-dark" />
          </div>

          <div>
            <label className="block text-sm font-medium text-white/60 mb-1.5">Password</label>
            <div className="relative">
              <input type={showPassword ? "text" : "password"} value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })} placeholder="Minimum 8 characters" minLength={8} required className="input-dark pr-10" />
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60">
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-white/60 mb-1.5">Select plan</label>
            <select value={formData.plan} onChange={(e) => setFormData({ ...formData, plan: e.target.value })} className="input-dark bg-[#0f172a]">
              {plans.map((p) => (<option key={p.value} value={p.value}>{p.label}</option>))}
            </select>
          </div>

          <div className="flex items-start gap-2.5 text-sm text-white/40">
            <input type="checkbox" required className="mt-0.5" />
            <span>I agree to the <Link href="/terms" className="text-violet-400">Terms of Service</Link> and <Link href="/privacy" className="text-violet-400">Privacy Policy</Link></span>
          </div>

          <button type="submit" disabled={loading} className="btn-primary w-full disabled:opacity-50">
            {loading ? "Creating account..." : "Create Free Account"}
            {!loading && <ArrowRight className="w-4 h-4" />}
          </button>
        </form>

        <p className="text-center text-sm text-white/40 mt-6">
          Already have an account?{" "}
          <Link href="/login" className="text-violet-400 hover:text-violet-300 font-medium">Sign in</Link>
        </p>
      </div>
    </div>
  );
}
