"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Building2, Upload, Globe, Key, CheckCircle2, ArrowRight,
  MessageSquare, BarChart3, ChevronRight, Zap, Eye, EyeOff,
  AlertCircle, ExternalLink,
} from "lucide-react";

const steps = [
  { id: 1, title: "Company Info", icon: Building2, description: "Tell us about your business" },
  { id: 2, title: "Brand Setup", icon: Upload, description: "Upload your logo and set colors" },
  { id: 3, title: "Integrations", icon: Key, description: "Connect your tools" },
  { id: 4, title: "Launch", icon: Zap, description: "Your AI is ready!" },
];

export default function OnboardingPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    companyName: "",
    website: "",
    industry: "",
    teamSize: "",
    phone: "",
    country: "",
    primaryColor: "#7c3aed",
  });

  const [apiKeys, setApiKeys] = useState({
    openai_api_key: "",
    wa_access_token: "",
    wa_phone_number_id: "",
    twilio_account_sid: "",
    twilio_auth_token: "",
    smtp_host: "",
    smtp_user: "",
    smtp_pass: "",
  });

  const [showKey, setShowKey] = useState<Record<string, boolean>>({});
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  function toggleShow(field: string) {
    setShowKey((prev) => ({ ...prev, [field]: !prev[field] }));
  }

  async function createTenant() {
    const res = await fetch("/api/tenants", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        companyName: formData.companyName,
        website: formData.website,
        industry: formData.industry,
        teamSize: formData.teamSize,
        phone: formData.phone,
        country: formData.country,
      }),
    });
    const data = await res.json() as { ok?: boolean; error?: string };
    if (!res.ok) throw new Error(data.error ?? "Failed to create tenant");
  }

  async function saveApiKeys() {
    const keyMap: { provider: string; key_name: string; value: string }[] = [
      { provider: "openai", key_name: "api_key", value: apiKeys.openai_api_key },
      { provider: "whatsapp", key_name: "access_token", value: apiKeys.wa_access_token },
      { provider: "whatsapp", key_name: "phone_number_id", value: apiKeys.wa_phone_number_id },
      { provider: "twilio", key_name: "account_sid", value: apiKeys.twilio_account_sid },
      { provider: "twilio", key_name: "auth_token", value: apiKeys.twilio_auth_token },
      { provider: "smtp", key_name: "host", value: apiKeys.smtp_host },
      { provider: "smtp", key_name: "user", value: apiKeys.smtp_user },
      { provider: "smtp", key_name: "pass", value: apiKeys.smtp_pass },
    ].filter((k) => k.value.trim());

    await Promise.all(
      keyMap.map((k) =>
        fetch("/api/settings/api-keys", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(k),
        })
      )
    );
  }

  async function markSetupComplete() {
    await fetch("/api/tenants/complete", { method: "POST" });
  }

  async function handleNext() {
    setError(null);
    setSaving(true);
    try {
      if (currentStep === 1) {
        if (!formData.companyName.trim()) {
          setError("Company name is required.");
          setSaving(false);
          return;
        }
        // Create the tenant and link user to it
        await createTenant();
      }
      if (currentStep === 3) {
        await saveApiKeys();
      }
      if (currentStep === 4) {
        await markSetupComplete();
        router.push("/dashboard");
        return;
      }
      setCurrentStep((s) => s + 1);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="w-full max-w-2xl">
      {/* Progress header */}
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold text-white mb-1">Set Up Your AI Workspace</h1>
        <p className="text-white/40 text-sm">Step {currentStep} of {steps.length}</p>
      </div>

      {/* Step indicators */}
      <div className="flex items-center justify-between mb-8 px-2">
        {steps.map((step, i) => (
          <div key={step.id} className="flex items-center">
            <div className="flex flex-col items-center">
              <div
                className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${
                  step.id < currentStep
                    ? "bg-emerald-500/20 border border-emerald-500/30"
                    : step.id === currentStep
                    ? "bg-violet-600/30 border border-violet-500/40"
                    : "bg-white/5 border border-white/10"
                }`}
              >
                {step.id < currentStep ? (
                  <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                ) : (
                  <step.icon className={`w-4 h-4 ${step.id === currentStep ? "text-violet-400" : "text-white/30"}`} />
                )}
              </div>
              <span className={`text-xs mt-1.5 font-medium ${step.id === currentStep ? "text-white" : "text-white/30"}`}>
                {step.title}
              </span>
            </div>
            {i < steps.length - 1 && (
              <div className={`flex-1 h-px mx-3 mt-[-12px] ${step.id < currentStep ? "bg-emerald-500/40" : "bg-white/10"}`} />
            )}
          </div>
        ))}
      </div>

      {/* Step content */}
      <div className="glass-card p-8 border border-white/10">
        {currentStep === 1 && (
          <div className="space-y-4">
            <div>
              <h2 className="text-xl font-bold text-white mb-1">Company Information</h2>
              <p className="text-sm text-white/40">This helps us customize your AI agent</p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-white/60 mb-1.5">Company name *</label>
                <input
                  type="text"
                  value={formData.companyName}
                  onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                  placeholder="Acme Corp"
                  className="input-dark"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-white/60 mb-1.5">Website</label>
                <input
                  type="url"
                  value={formData.website}
                  onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                  placeholder="https://yoursite.com"
                  className="input-dark"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-white/60 mb-1.5">Industry</label>
                <select
                  value={formData.industry}
                  onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
                  className="input-dark bg-[#0f172a]"
                >
                  <option value="">Select industry</option>
                  <option>E-commerce</option>
                  <option>Healthcare</option>
                  <option>Real Estate</option>
                  <option>Education</option>
                  <option>Finance</option>
                  <option>Hospitality</option>
                  <option>Technology</option>
                  <option>Other</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-white/60 mb-1.5">Team size</label>
                <select
                  value={formData.teamSize}
                  onChange={(e) => setFormData({ ...formData, teamSize: e.target.value })}
                  className="input-dark bg-[#0f172a]"
                >
                  <option value="">Select size</option>
                  <option>Just me</option>
                  <option>2-10</option>
                  <option>11-50</option>
                  <option>51-200</option>
                  <option>200+</option>
                </select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-white/60 mb-1.5">Business phone</label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="+1 (555) 000-0000"
                  className="input-dark"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-white/60 mb-1.5">Country</label>
                <select
                  value={formData.country}
                  onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                  className="input-dark bg-[#0f172a]"
                >
                  <option value="">Select country</option>
                  <option>United States</option>
                  <option>United Kingdom</option>
                  <option>India</option>
                  <option>Canada</option>
                  <option>Australia</option>
                  <option>Other</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {currentStep === 2 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-bold text-white mb-1">Brand Setup</h2>
              <p className="text-sm text-white/40">Customize how your AI agent looks and feels</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-white/60 mb-3">Company logo</label>
              <div className="border-2 border-dashed border-white/10 rounded-xl p-8 text-center hover:border-violet-500/30 transition-colors cursor-pointer">
                <Upload className="w-10 h-10 text-white/20 mx-auto mb-3" />
                <p className="text-sm text-white/40">Click to upload or drag & drop</p>
                <p className="text-xs text-white/20 mt-1">PNG, JPG, SVG up to 5MB</p>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-white/60 mb-3">Brand color</label>
              <div className="flex items-center gap-4">
                <input
                  type="color"
                  value={formData.primaryColor}
                  onChange={(e) => setFormData({ ...formData, primaryColor: e.target.value })}
                  className="w-12 h-12 rounded-xl border border-white/10 cursor-pointer bg-transparent"
                />
                <div className="flex gap-2">
                  {["#7c3aed", "#06b6d4", "#10b981", "#f59e0b", "#ef4444"].map((color) => (
                    <button
                      key={color}
                      onClick={() => setFormData({ ...formData, primaryColor: color })}
                      className={`w-8 h-8 rounded-lg border-2 transition-all ${formData.primaryColor === color ? "border-white scale-110" : "border-transparent"}`}
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
                <span className="text-sm text-white/40">{formData.primaryColor}</span>
              </div>
            </div>
          </div>
        )}

        {currentStep === 3 && (
          <div className="space-y-5">
            <div>
              <h2 className="text-xl font-bold text-white mb-1">Add Your API Keys</h2>
              <p className="text-sm text-white/40">
                Vorynto AI uses your own API keys — you pay providers directly, we only charge the platform fee.
                All fields are optional and can be added later in Settings.
              </p>
            </div>

            {/* Info banner */}
            <div className="flex gap-2 p-3 rounded-xl bg-violet-600/10 border border-violet-500/20">
              <AlertCircle className="w-4 h-4 text-violet-400 shrink-0 mt-0.5" />
              <p className="text-xs text-white/50">
                Keys are encrypted and stored securely. You can skip any section and configure later in <strong className="text-white">Settings → API Keys</strong>.
              </p>
            </div>

            {/* OpenAI */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-sm font-semibold text-white flex items-center gap-1.5">
                  <span className="text-lg">🤖</span> OpenAI API Key
                </label>
                <a href="https://platform.openai.com/api-keys" target="_blank" rel="noopener noreferrer"
                  className="text-[11px] text-violet-400 flex items-center gap-0.5 hover:text-violet-300">
                  Get key <ExternalLink className="w-3 h-3" />
                </a>
              </div>
              <p className="text-xs text-white/30">Used by AI CRM, Chatbot, Voice Bot, and SEO features</p>
              <div className="relative">
                <input
                  type={showKey.openai ? "text" : "password"}
                  value={apiKeys.openai_api_key}
                  onChange={(e) => setApiKeys({ ...apiKeys, openai_api_key: e.target.value })}
                  placeholder="sk-proj-..."
                  className="input-dark pr-10 font-mono text-sm"
                />
                <button type="button" onClick={() => toggleShow("openai")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60">
                  {showKey.openai ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* WhatsApp */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-white flex items-center gap-1.5">
                <span className="text-lg">💬</span> WhatsApp Business API
              </label>
              <p className="text-xs text-white/30">Required for WhatsApp bot and WhatsApp campaigns</p>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-white/40 mb-1">Access Token</label>
                  <div className="relative">
                    <input
                      type={showKey.wa_token ? "text" : "password"}
                      value={apiKeys.wa_access_token}
                      onChange={(e) => setApiKeys({ ...apiKeys, wa_access_token: e.target.value })}
                      placeholder="EAAx..."
                      className="input-dark pr-8 text-sm font-mono"
                    />
                    <button type="button" onClick={() => toggleShow("wa_token")}
                      className="absolute right-2 top-1/2 -translate-y-1/2 text-white/30">
                      {showKey.wa_token ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>
                <div>
                  <label className="block text-xs text-white/40 mb-1">Phone Number ID</label>
                  <input
                    type="text"
                    value={apiKeys.wa_phone_number_id}
                    onChange={(e) => setApiKeys({ ...apiKeys, wa_phone_number_id: e.target.value })}
                    placeholder="12345678901234"
                    className="input-dark text-sm font-mono"
                  />
                </div>
              </div>
            </div>

            {/* Twilio SMS */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-white flex items-center gap-1.5">
                <span className="text-lg">📱</span> Twilio (SMS Campaigns)
              </label>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-white/40 mb-1">Account SID</label>
                  <input
                    type="text"
                    value={apiKeys.twilio_account_sid}
                    onChange={(e) => setApiKeys({ ...apiKeys, twilio_account_sid: e.target.value })}
                    placeholder="ACxx..."
                    className="input-dark text-sm font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs text-white/40 mb-1">Auth Token</label>
                  <div className="relative">
                    <input
                      type={showKey.twilio ? "text" : "password"}
                      value={apiKeys.twilio_auth_token}
                      onChange={(e) => setApiKeys({ ...apiKeys, twilio_auth_token: e.target.value })}
                      placeholder="••••••••••••••"
                      className="input-dark pr-8 text-sm font-mono"
                    />
                    <button type="button" onClick={() => toggleShow("twilio")}
                      className="absolute right-2 top-1/2 -translate-y-1/2 text-white/30">
                      {showKey.twilio ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* SMTP Email */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-white flex items-center gap-1.5">
                <span className="text-lg">📧</span> Email (SMTP)
              </label>
              <div className="grid grid-cols-3 gap-3">
                <div className="col-span-2">
                  <label className="block text-xs text-white/40 mb-1">SMTP Host</label>
                  <input
                    type="text"
                    value={apiKeys.smtp_host}
                    onChange={(e) => setApiKeys({ ...apiKeys, smtp_host: e.target.value })}
                    placeholder="smtp.resend.com"
                    className="input-dark text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs text-white/40 mb-1">Username</label>
                  <input
                    type="text"
                    value={apiKeys.smtp_user}
                    onChange={(e) => setApiKeys({ ...apiKeys, smtp_user: e.target.value })}
                    placeholder="resend"
                    className="input-dark text-sm"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs text-white/40 mb-1">SMTP Password / API Key</label>
                <div className="relative">
                  <input
                    type={showKey.smtp ? "text" : "password"}
                    value={apiKeys.smtp_pass}
                    onChange={(e) => setApiKeys({ ...apiKeys, smtp_pass: e.target.value })}
                    placeholder="re_xxxxxxxxxxxxxxxxxxxx"
                    className="input-dark pr-10 text-sm font-mono"
                  />
                  <button type="button" onClick={() => toggleShow("smtp")}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30">
                    {showKey.smtp ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            </div>

            <p className="text-xs text-white/30 text-center">
              Need help finding your API keys?{" "}
              <a href="/contact" className="text-violet-400 hover:text-violet-300">Contact our support team →</a>
            </p>
          </div>
        )}

        {currentStep === 4 && (
          <div className="text-center py-4">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-violet-600 to-purple-800 flex items-center justify-center mx-auto mb-6 shadow-2xl shadow-violet-500/30">
              <Zap className="w-10 h-10 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">Your AI is Ready! 🎉</h2>
            <p className="text-white/50 text-sm max-w-xs mx-auto mb-8">
              Your AI agent has been configured. Head to your dashboard to explore all features.
            </p>
            <div className="space-y-2 text-sm text-left max-w-xs mx-auto mb-8">
              {[
                "AI CRM workspace created",
                "WhatsApp bot configured",
                "Campaign module activated",
                "Analytics dashboard ready",
              ].map((item) => (
                <div key={item} className="flex items-center gap-2 text-white/60">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  {item}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Navigation */}
        <div className="flex items-center justify-between mt-8 pt-6 border-t border-white/5">
          {currentStep > 1 ? (
            <button
              onClick={() => setCurrentStep(currentStep - 1)}
              className="btn-secondary text-sm py-2.5 px-5"
            >
              Back
            </button>
          ) : (
            <div />
          )}
          <button
            onClick={handleNext}
            disabled={saving}
            className="btn-primary text-sm py-2.5 px-6 disabled:opacity-60 flex items-center gap-2"
          >
            {saving ? (
              <span className="flex items-center gap-2">
                <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                </svg>
                Saving…
              </span>
            ) : currentStep === 4 ? (
              <><ArrowRight className="w-4 h-4" /> Go to Dashboard</>
            ) : currentStep === 3 ? (
              <><ChevronRight className="w-4 h-4" /> Save &amp; Continue</>
            ) : currentStep === 1 ? (
              <><ChevronRight className="w-4 h-4" /> Save &amp; Continue</>
            ) : (
              <><ChevronRight className="w-4 h-4" /> Continue</>
            )}
          </button>
        </div>
        {error && (
          <div className="mt-3 flex items-center gap-2 text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-2.5">
            <AlertCircle className="w-4 h-4 shrink-0" />
            {error}
          </div>
        )}
      </div>
    </div>
  );
}
