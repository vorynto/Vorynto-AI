"use client";

import { useState, useTransition } from "react";
import {
  Key, Eye, EyeOff, Trash2, CheckCircle2, AlertCircle,
  Loader2, Save, ChevronDown, ChevronUp, ExternalLink,
} from "lucide-react";

/* ─── Types ─────────────────────────────────────────────────── */

interface SavedKey {
  id: string;
  masked: string;
  saved: boolean;
  verified: boolean;
}

interface InitialKeys {
  [provider: string]: {
    [keyName: string]: SavedKey;
  };
}

interface KeyField {
  name: string;       // key_name stored in DB
  label: string;
  placeholder: string;
  type?: "text" | "password";
  hint?: string;
}

interface ProviderConfig {
  id: string;
  label: string;
  icon: string;
  color: string;
  bgColor: string;
  description: string;
  docUrl: string;
  fields: KeyField[];
}

/* ─── Provider definitions ───────────────────────────────────── */

const PROVIDERS: ProviderConfig[] = [
  {
    id: "openai",
    label: "OpenAI",
    icon: "🤖",
    color: "text-emerald-400",
    bgColor: "bg-emerald-600/20",
    description: "Powers AI CRM suggestions, Website Chatbot, Voice Bot, and SEO analysis",
    docUrl: "https://platform.openai.com/api-keys",
    fields: [
      {
        name: "api_key",
        label: "API Key",
        placeholder: "sk-proj-...",
        type: "password",
        hint: "Found in your OpenAI dashboard under API keys",
      },
    ],
  },
  {
    id: "whatsapp",
    label: "WhatsApp Business API",
    icon: "💬",
    color: "text-green-400",
    bgColor: "bg-green-600/20",
    description: "Required for WhatsApp AI Bot and WhatsApp bulk campaigns",
    docUrl: "https://developers.facebook.com/docs/whatsapp/cloud-api/get-started",
    fields: [
      {
        name: "access_token",
        label: "Permanent Access Token",
        placeholder: "EAAx...",
        type: "password",
        hint: "System user token from Meta Business Manager",
      },
      {
        name: "phone_number_id",
        label: "Phone Number ID",
        placeholder: "123456789012345",
        hint: "From WhatsApp Business > Phone Numbers in Meta dashboard",
      },
      {
        name: "waba_id",
        label: "WhatsApp Business Account ID",
        placeholder: "123456789012345",
        hint: "Your WABA ID from Meta Business Manager",
      },
      {
        name: "verify_token",
        label: "Webhook Verify Token",
        placeholder: "my-secret-verify-token",
        hint: "A secret you choose — must match your webhook config in Meta",
      },
    ],
  },
  {
    id: "twilio",
    label: "Twilio (SMS Campaigns)",
    icon: "📱",
    color: "text-red-400",
    bgColor: "bg-red-600/20",
    description: "Required for sending SMS bulk campaigns",
    docUrl: "https://www.twilio.com/console",
    fields: [
      {
        name: "account_sid",
        label: "Account SID",
        placeholder: "ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
        hint: "From your Twilio Console dashboard",
      },
      {
        name: "auth_token",
        label: "Auth Token",
        placeholder: "••••••••••••••••••••••••••••••••",
        type: "password",
        hint: "From your Twilio Console dashboard",
      },
      {
        name: "from_number",
        label: "From Phone Number",
        placeholder: "+15551234567",
        hint: "Your Twilio phone number in E.164 format",
      },
    ],
  },
  {
    id: "smtp",
    label: "Email (SMTP)",
    icon: "📧",
    color: "text-blue-400",
    bgColor: "bg-blue-600/20",
    description: "Required for sending email bulk campaigns. Works with Resend, SendGrid, Mailgun, etc.",
    docUrl: "https://resend.com/docs/send-with-smtp",
    fields: [
      {
        name: "host",
        label: "SMTP Host",
        placeholder: "smtp.resend.com",
        hint: "Your email provider's SMTP server hostname",
      },
      {
        name: "port",
        label: "SMTP Port",
        placeholder: "587",
        hint: "587 (TLS) or 465 (SSL) are common",
      },
      {
        name: "user",
        label: "SMTP Username",
        placeholder: "resend or your@email.com",
        hint: "Login username for SMTP authentication",
      },
      {
        name: "pass",
        label: "SMTP Password / API Key",
        placeholder: "re_xxxxxxxxxxxxxxxxxxxx",
        type: "password",
        hint: "Your SMTP password or provider API key",
      },
      {
        name: "from_email",
        label: "From Email Address",
        placeholder: "hello@yourcompany.com",
        hint: "The sender address shown to recipients",
      },
    ],
  },
  {
    id: "meta",
    label: "Meta Ads (Facebook & Instagram)",
    icon: "📘",
    color: "text-indigo-400",
    bgColor: "bg-indigo-600/20",
    description: "Required for AI-managed Facebook and Instagram ad campaigns",
    docUrl: "https://developers.facebook.com/docs/marketing-api/overview",
    fields: [
      {
        name: "app_id",
        label: "App ID",
        placeholder: "123456789012345",
        hint: "From Meta for Developers > Your App > Settings > Basic",
      },
      {
        name: "app_secret",
        label: "App Secret",
        placeholder: "••••••••••••••••••••••••••••••••",
        type: "password",
        hint: "From Meta for Developers > Your App > Settings > Basic",
      },
      {
        name: "access_token",
        label: "Long-Lived Access Token",
        placeholder: "EAAx...",
        type: "password",
        hint: "Generate via Graph API explorer with ads_management permission",
      },
      {
        name: "ad_account_id",
        label: "Ad Account ID",
        placeholder: "act_123456789",
        hint: "From Meta Business Manager > Ad Accounts (include 'act_' prefix)",
      },
    ],
  },
  {
    id: "razorpay",
    label: "Razorpay (Payment Gateway)",
    icon: "💳",
    color: "text-sky-400",
    bgColor: "bg-sky-600/20",
    description: "Accept payments via Razorpay — UPI, cards, net banking, wallets & more",
    docUrl: "https://dashboard.razorpay.com/app/keys",
    fields: [
      {
        name: "key_id",
        label: "Key ID",
        placeholder: "rzp_live_xxxxxxxxxxxx",
        hint: "From Razorpay Dashboard → Settings → API Keys. Use rzp_test_... for test mode.",
      },
      {
        name: "key_secret",
        label: "Key Secret",
        placeholder: "••••••••••••••••••••••••",
        type: "password",
        hint: "Never share this. Used server-side to verify payment signatures.",
      },
      {
        name: "webhook_secret",
        label: "Webhook Secret",
        placeholder: "••••••••••••••••••••••••",
        type: "password",
        hint: "From Razorpay Dashboard → Settings → Webhooks. Used to verify incoming webhook events.",
      },
    ],
  },
];

/* ─── Component ─────────────────────────────────────────────── */

interface Props {
  initialKeys: InitialKeys;
}

export default function ApiKeysManager({ initialKeys }: Props) {
  const [keys, setKeys] = useState<InitialKeys>(initialKeys);
  const [expanded, setExpanded] = useState<string | null>("openai");
  const [drafts, setDrafts] = useState<Record<string, Record<string, string>>>({});
  const [showValues, setShowValues] = useState<Record<string, boolean>>({});
  const [messages, setMessages] = useState<Record<string, { type: "success" | "error"; text: string }>>({});
  const [isPending, startTransition] = useTransition();
  const [savingProvider, setSavingProvider] = useState<string | null>(null);

  function getDraft(provider: string, keyName: string): string {
    return drafts[provider]?.[keyName] ?? "";
  }

  function setDraft(provider: string, keyName: string, value: string) {
    setDrafts((prev) => ({
      ...prev,
      [provider]: { ...(prev[provider] ?? {}), [keyName]: value },
    }));
  }

  function toggleShow(fieldId: string) {
    setShowValues((prev) => ({ ...prev, [fieldId]: !prev[fieldId] }));
  }

  async function saveProvider(provider: ProviderConfig) {
    const providerDrafts = drafts[provider.id] ?? {};
    const fieldsToSave = provider.fields.filter(
      (f) => providerDrafts[f.name]?.trim()
    );

    if (fieldsToSave.length === 0) {
      setMessages((prev) => ({
        ...prev,
        [provider.id]: { type: "error", text: "Enter at least one key to save." },
      }));
      return;
    }

    setSavingProvider(provider.id);
    setMessages((prev) => { const n = { ...prev }; delete n[provider.id]; return n; });

    startTransition(async () => {
      try {
        const results = await Promise.all(
          fieldsToSave.map((field) =>
            fetch("/api/settings/api-keys", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                provider: provider.id,
                key_name: field.name,
                value: providerDrafts[field.name].trim(),
              }),
            }).then((r) => r.json() as Promise<{ ok?: boolean; masked?: string; error?: string }>)
          )
        );

        const failed = results.find((r) => !r.ok);
        if (failed) throw new Error(failed.error ?? "Save failed");

        // Update local state with masked values
        setKeys((prev) => {
          const next = { ...prev };
          if (!next[provider.id]) next[provider.id] = {};
          fieldsToSave.forEach((field, i) => {
            next[provider.id][field.name] = {
              id: prev[provider.id]?.[field.name]?.id ?? crypto.randomUUID(),
              masked: results[i].masked ?? "••••",
              saved: true,
              verified: false,
            };
          });
          return next;
        });

        // Clear drafts for saved fields
        setDrafts((prev) => {
          const next = { ...prev };
          if (next[provider.id]) {
            fieldsToSave.forEach((f) => delete next[provider.id][f.name]);
          }
          return next;
        });

        setMessages((prev) => ({
          ...prev,
          [provider.id]: { type: "success", text: `${provider.label} keys saved successfully.` },
        }));
      } catch (err) {
        setMessages((prev) => ({
          ...prev,
          [provider.id]: { type: "error", text: err instanceof Error ? err.message : "Failed to save." },
        }));
      } finally {
        setSavingProvider(null);
      }
    });
  }

  async function deleteKey(provider: string, keyName: string, id: string) {
    const res = await fetch(`/api/settings/api-keys/${id}`, { method: "DELETE" });
    const data = await res.json() as { ok?: boolean };
    if (data.ok) {
      setKeys((prev) => {
        const next = { ...prev };
        if (next[provider]) {
          delete next[provider][keyName];
        }
        return next;
      });
    }
  }

  const savedCount = (providerId: string) =>
    Object.keys(keys[providerId] ?? {}).length;

  return (
    <div className="space-y-4">
      {PROVIDERS.map((provider) => {
        const isOpen = expanded === provider.id;
        const count = savedCount(provider.id);
        const isSaving = savingProvider === provider.id;
        const msg = messages[provider.id];

        return (
          <div
            key={provider.id}
            className={`rounded-xl border transition-all ${
              isOpen
                ? "border-violet-500/30 bg-violet-500/5"
                : "border-white/5 bg-white/3 hover:border-white/10"
            }`}
          >
            {/* Header */}
            <button
              className="w-full flex items-center justify-between p-5 text-left"
              onClick={() => setExpanded(isOpen ? null : provider.id)}
            >
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-xl ${provider.bgColor} flex items-center justify-center text-xl shrink-0`}>
                  {provider.icon}
                </div>
                <div>
                  <div className="text-sm font-semibold text-white flex items-center gap-2">
                    {provider.label}
                    {count > 0 && (
                      <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/20">
                        {count}/{provider.fields.length} saved
                      </span>
                    )}
                    {count === 0 && (
                      <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20">
                        Not configured
                      </span>
                    )}
                  </div>
                  <div className="text-xs text-white/40 mt-0.5">{provider.description}</div>
                </div>
              </div>
              {isOpen ? (
                <ChevronUp className="w-4 h-4 text-white/30 shrink-0" />
              ) : (
                <ChevronDown className="w-4 h-4 text-white/30 shrink-0" />
              )}
            </button>

            {/* Expanded fields */}
            {isOpen && (
              <div className="px-5 pb-5 space-y-4 border-t border-white/5 pt-5">
                <a
                  href={provider.docUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs text-violet-400 hover:text-violet-300 transition-colors"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  Where to find these keys →
                </a>

                <div className="grid gap-4">
                  {provider.fields.map((field) => {
                    const saved = keys[provider.id]?.[field.name];
                    const draft = getDraft(provider.id, field.name);
                    const fieldId = `${provider.id}_${field.name}`;
                    const isPassword = field.type === "password";
                    const showValue = showValues[fieldId];

                    return (
                      <div key={field.name}>
                        <label className="block text-sm font-medium text-white/70 mb-1.5">
                          {field.label}
                        </label>

                        {saved && !draft ? (
                          // Saved state — show masked value with clear option
                          <div className="flex items-center gap-2">
                            <div className="flex-1 flex items-center gap-2 px-3 py-2.5 rounded-xl bg-white/5 border border-emerald-500/20 text-sm">
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                              <span className="text-white/60 font-mono text-xs tracking-wider">{saved.masked}</span>
                            </div>
                            <button
                              onClick={() => setDraft(provider.id, field.name, " ")}
                              className="p-2.5 rounded-xl bg-white/5 border border-white/10 hover:bg-amber-500/10 hover:border-amber-500/20 hover:text-amber-400 text-white/40 transition-all"
                              title="Replace key"
                            >
                              <Key className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => deleteKey(provider.id, field.name, saved.id)}
                              className="p-2.5 rounded-xl bg-white/5 border border-white/10 hover:bg-red-500/10 hover:border-red-500/20 hover:text-red-400 text-white/40 transition-all"
                              title="Remove key"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        ) : (
                          // Edit state
                          <div className="space-y-1">
                            <div className="relative">
                              <input
                                type={isPassword && !showValue ? "password" : "text"}
                                value={draft.trim() === "" && draft !== "" ? "" : draft}
                                onChange={(e) => setDraft(provider.id, field.name, e.target.value)}
                                placeholder={field.placeholder}
                                className="input-dark pr-10 font-mono text-sm w-full"
                                autoComplete="off"
                              />
                              {isPassword && (
                                <button
                                  type="button"
                                  onClick={() => toggleShow(fieldId)}
                                  className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60"
                                >
                                  {showValue ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                </button>
                              )}
                            </div>
                            {field.hint && (
                              <p className="text-[11px] text-white/30">{field.hint}</p>
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>

                {/* Save button + status */}
                <div className="flex items-center justify-between pt-2">
                  {msg ? (
                    <div className={`flex items-center gap-1.5 text-sm ${msg.type === "success" ? "text-emerald-400" : "text-red-400"}`}>
                      {msg.type === "success" ? (
                        <CheckCircle2 className="w-4 h-4" />
                      ) : (
                        <AlertCircle className="w-4 h-4" />
                      )}
                      {msg.text}
                    </div>
                  ) : (
                    <div />
                  )}
                  <button
                    onClick={() => saveProvider(provider)}
                    disabled={isSaving || isPending}
                    className="btn-primary text-sm py-2 px-5 flex items-center gap-2 disabled:opacity-50"
                  >
                    {isSaving ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Save className="w-4 h-4" />
                    )}
                    Save {provider.label} Keys
                  </button>
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
