"use client";

import { useState, useTransition } from "react";
import {
  Edit3, Trash2, ToggleRight, ToggleLeft, CheckCircle2,
  Plus, X, Save, Loader2, Users, Star,
} from "lucide-react";
import type { Database } from "@/types/supabase";

type Plan = Database["public"]["Tables"]["subscription_plans"]["Row"];

interface Props {
  initialPlans: Plan[];
}

const PLAN_COLORS = ["text-cyan-400", "text-violet-400", "text-amber-400", "text-emerald-400", "text-pink-400"];

type EditorState = {
  open: boolean;
  plan: Partial<Plan> | null;
  isNew: boolean;
};

export default function PlanManager({ initialPlans }: Props) {
  const [plans, setPlans] = useState<Plan[]>(initialPlans);
  const [editor, setEditor] = useState<EditorState>({ open: false, plan: null, isNew: false });
  const [isPending, startTransition] = useTransition();
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState<{ type: "ok" | "err"; text: string } | null>(null);

  // ── Feature list editor ─────────────────────────────────────
  const [featInput, setFeatInput] = useState("");

  function openCreate() {
    setEditor({
      open: true,
      isNew: true,
      plan: {
        name: "", slug: "", description: "", price_monthly: 0, price_yearly: 0,
        features: [], feature_limits: {}, is_active: true, is_featured: false, sort_order: plans.length + 1,
      },
    });
    setFeatInput("");
    setMsg(null);
  }

  function openEdit(plan: Plan) {
    setEditor({ open: true, isNew: false, plan: { ...plan } });
    setFeatInput("");
    setMsg(null);
  }

  function closeEditor() {
    setEditor({ open: false, plan: null, isNew: false });
    setMsg(null);
  }

  function setPlanField<K extends keyof Plan>(key: K, value: Plan[K]) {
    setEditor((prev) => prev.plan ? { ...prev, plan: { ...prev.plan, [key]: value } } : prev);
  }

  function addFeature() {
    if (!featInput.trim()) return;
    const current = (editor.plan?.features as string[]) ?? [];
    setPlanField("features", [...current, featInput.trim()] as Plan["features"]);
    setFeatInput("");
  }

  function removeFeature(i: number) {
    const current = (editor.plan?.features as string[]) ?? [];
    setPlanField("features", current.filter((_, idx) => idx !== i) as Plan["features"]);
  }

  function setLimit(key: string, val: string) {
    const current = (editor.plan?.feature_limits ?? {}) as Record<string, number>;
    setPlanField("feature_limits", { ...current, [key]: val === "" ? -1 : Number(val) } as Plan["feature_limits"]);
  }

  async function savePlan() {
    if (!editor.plan) return;
    setSaving(true);
    setMsg(null);

    startTransition(async () => {
      try {
        const url = editor.isNew ? "/api/admin/plans" : `/api/admin/plans/${editor.plan!.id}`;
        const method = editor.isNew ? "POST" : "PATCH";
        const res = await fetch(url, {
          method,
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(editor.plan),
        });
        const data = await res.json() as Plan & { error?: string };
        if (!res.ok) throw new Error(data.error ?? "Save failed");

        if (editor.isNew) {
          setPlans((prev) => [...prev, data]);
        } else {
          setPlans((prev) => prev.map((p) => p.id === data.id ? data : p));
        }
        setMsg({ type: "ok", text: `Plan "${data.name}" saved.` });
        closeEditor();
      } catch (err) {
        setMsg({ type: "err", text: err instanceof Error ? err.message : "Failed" });
      } finally {
        setSaving(false);
      }
    });
  }

  async function toggleActive(plan: Plan) {
    const res = await fetch(`/api/admin/plans/${plan.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ is_active: !plan.is_active }),
    });
    if (res.ok) {
      setPlans((prev) => prev.map((p) => p.id === plan.id ? { ...p, is_active: !plan.is_active } : p));
    }
  }

  async function deletePlan(id: string) {
    if (!confirm("Delete this plan? This cannot be undone.")) return;
    const res = await fetch(`/api/admin/plans/${id}`, { method: "DELETE" });
    if (res.ok) setPlans((prev) => prev.filter((p) => p.id !== id));
  }

  const features = (editor.plan?.features as string[]) ?? [];
  const limits = (editor.plan?.feature_limits ?? {}) as Record<string, number>;

  const DEFAULT_LIMITS = [
    { key: "contacts", label: "Max Contacts" },
    { key: "campaigns_per_month", label: "Campaign Messages/mo" },
    { key: "team_members", label: "Team Members" },
    { key: "chatbot_conversations", label: "Chatbot Conversations/mo" },
    { key: "voice_minutes", label: "Voice Bot Minutes/mo" },
  ];

  return (
    <div className="p-6 space-y-6">
      {/* Plans grid */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
        {plans.map((plan, i) => (
          <div
            key={plan.id}
            className={`glass-card p-6 relative ${plan.is_featured ? "border-violet-500/30 bg-gradient-to-b from-violet-600/5" : ""} ${!plan.is_active ? "opacity-50" : ""}`}
          >
            {plan.is_featured && (
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-violet-600 text-white text-xs font-semibold flex items-center gap-1">
                <Star className="w-3 h-3" /> Most Popular
              </div>
            )}

            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className={`text-xl font-bold ${PLAN_COLORS[i % PLAN_COLORS.length]}`}>{plan.name}</h3>
                <p className="text-xs text-white/30 mt-0.5">{plan.description}</p>
              </div>
              <button
                onClick={() => toggleActive(plan)}
                title={plan.is_active ? "Deactivate" : "Activate"}
              >
                {plan.is_active ? (
                  <ToggleRight className="w-7 h-7 text-emerald-400 hover:opacity-80 transition-opacity" />
                ) : (
                  <ToggleLeft className="w-7 h-7 text-white/20 hover:text-white/40 transition-colors" />
                )}
              </button>
            </div>

            <div className="mb-4">
              <div className="text-3xl font-bold text-white">${plan.price_monthly}<span className="text-base font-normal text-white/30">/mo</span></div>
              <div className="text-xs text-white/30 mt-0.5">${plan.price_yearly}/yr</div>
            </div>

            <ul className="space-y-1.5 mb-5">
              {((plan.features as string[]) ?? []).slice(0, 5).map((f) => (
                <li key={f} className="flex items-center gap-2 text-xs text-white/50">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  {f}
                </li>
              ))}
              {((plan.features as string[]) ?? []).length > 5 && (
                <li className="text-xs text-white/20 pl-5">+{((plan.features as string[]) ?? []).length - 5} more</li>
              )}
            </ul>

            <div className="mb-4 p-3 rounded-lg bg-white/3 border border-white/5 space-y-1">
              <div className="text-[10px] font-semibold text-white/30 uppercase mb-2">Limits</div>
              {Object.entries((plan.feature_limits ?? {}) as Record<string, number>).map(([k, v]) => (
                <div key={k} className="flex justify-between text-xs">
                  <span className="text-white/30 capitalize">{k.replace(/_/g, " ")}</span>
                  <span className="text-white/60 font-medium">{v === -1 ? "Unlimited" : v.toLocaleString()}</span>
                </div>
              ))}
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => openEdit(plan)}
                className="flex-1 btn-secondary text-xs py-2 flex items-center justify-center gap-1.5"
              >
                <Edit3 className="w-3.5 h-3.5" /> Edit Plan
              </button>
              <button
                onClick={() => deletePlan(plan.id)}
                className="w-9 h-9 flex items-center justify-center rounded-xl border border-white/10 text-white/20 hover:text-red-400 hover:bg-red-500/10 hover:border-red-500/20 transition-all"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}

        {/* Add plan card */}
        <button
          onClick={openCreate}
          className="glass-card p-6 border-dashed flex flex-col items-center justify-center gap-2 text-white/20 hover:text-white/40 hover:border-amber-500/30 transition-all min-h-48"
        >
          <div className="w-12 h-12 rounded-xl border-2 border-dashed border-current flex items-center justify-center">
            <Plus className="w-5 h-5" />
          </div>
          <span className="text-sm font-medium">Create New Plan</span>
        </button>
      </div>

      {/* Toast message */}
      {msg && (
        <div className={`p-3 rounded-xl text-sm ${msg.type === "ok" ? "bg-emerald-500/10 border border-emerald-500/20 text-emerald-400" : "bg-red-500/10 border border-red-500/20 text-red-400"}`}>
          {msg.text}
        </div>
      )}

      {/* ── Plan Editor Modal ───────────────────────────────────── */}
      {editor.open && editor.plan && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="glass-card w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-white/5">
              <h2 className="text-base font-bold text-white">
                {editor.isNew ? "Create New Plan" : `Edit — ${editor.plan.name}`}
              </h2>
              <button onClick={closeEditor} className="text-white/30 hover:text-white/60">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Basic info */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-white/50 mb-1.5">Plan Name *</label>
                  <input
                    type="text"
                    value={editor.plan.name ?? ""}
                    onChange={(e) => setPlanField("name", e.target.value)}
                    placeholder="e.g., Professional"
                    className="input-dark"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-white/50 mb-1.5">Slug *</label>
                  <input
                    type="text"
                    value={editor.plan.slug ?? ""}
                    onChange={(e) => setPlanField("slug", e.target.value.toLowerCase().replace(/\s+/g, "-"))}
                    placeholder="professional"
                    className="input-dark font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-white/50 mb-1.5">Description</label>
                <textarea
                  rows={2}
                  value={editor.plan.description ?? ""}
                  onChange={(e) => setPlanField("description", e.target.value)}
                  placeholder="Plan description..."
                  className="input-dark resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-white/50 mb-1.5">Monthly Price ($)</label>
                  <input
                    type="number"
                    value={editor.plan.price_monthly ?? 0}
                    onChange={(e) => setPlanField("price_monthly", Number(e.target.value))}
                    className="input-dark"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-white/50 mb-1.5">Yearly Price ($)</label>
                  <input
                    type="number"
                    value={editor.plan.price_yearly ?? 0}
                    onChange={(e) => setPlanField("price_yearly", Number(e.target.value))}
                    className="input-dark"
                  />
                </div>
              </div>

              {/* Toggles */}
              <div className="flex items-center gap-6">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editor.plan.is_active ?? true}
                    onChange={(e) => setPlanField("is_active", e.target.checked)}
                    className="w-4 h-4 accent-amber-500"
                  />
                  <span className="text-sm text-white/60">Active</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editor.plan.is_featured ?? false}
                    onChange={(e) => setPlanField("is_featured", e.target.checked)}
                    className="w-4 h-4 accent-violet-500"
                  />
                  <span className="text-sm text-white/60">Featured (Most Popular badge)</span>
                </label>
              </div>

              {/* Features list */}
              <div>
                <label className="block text-xs font-medium text-white/50 mb-2">Features</label>
                <div className="space-y-1.5 mb-3">
                  {features.map((f, i) => (
                    <div key={i} className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/3 border border-white/5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      <span className="flex-1 text-sm text-white/70">{f}</span>
                      <button onClick={() => removeFeature(i)} className="text-white/20 hover:text-red-400 transition-colors">
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={featInput}
                    onChange={(e) => setFeatInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addFeature())}
                    placeholder="Add a feature..."
                    className="input-dark flex-1 text-sm"
                  />
                  <button onClick={addFeature} className="btn-secondary text-xs px-3">Add</button>
                </div>
              </div>

              {/* Razorpay Plan IDs */}
              <div className="p-4 rounded-xl bg-sky-600/5 border border-sky-500/15 space-y-3">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-base">💳</span>
                  <label className="text-xs font-semibold text-sky-400">Razorpay Plan IDs</label>
                  <span className="text-[11px] text-white/25 ml-auto">
                    Create plans at <a href="https://dashboard.razorpay.com/app/subscriptions/plans" target="_blank" rel="noopener noreferrer" className="text-sky-400 hover:underline">Razorpay → Plans</a>
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-white/50 mb-1.5">Monthly Plan ID</label>
                    <input
                      type="text"
                      value={(editor.plan?.razorpay_plan_id_monthly as string | null) ?? ""}
                      onChange={(e) => setPlanField("razorpay_plan_id_monthly", e.target.value || null)}
                      placeholder="plan_xxxxxxxxxxxx"
                      className="input-dark font-mono text-sm"
                    />
                    <p className="text-[11px] text-white/25 mt-1">Required for recurring monthly checkout</p>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-white/50 mb-1.5">Yearly Plan ID</label>
                    <input
                      type="text"
                      value={(editor.plan?.razorpay_plan_id_yearly as string | null) ?? ""}
                      onChange={(e) => setPlanField("razorpay_plan_id_yearly", e.target.value || null)}
                      placeholder="plan_xxxxxxxxxxxx"
                      className="input-dark font-mono text-sm"
                    />
                    <p className="text-[11px] text-white/25 mt-1">Required for recurring yearly checkout</p>
                  </div>
                </div>
              </div>

              {/* Feature limits */}
              <div>
                <label className="block text-xs font-medium text-white/50 mb-2">Feature Limits <span className="text-white/20">(-1 = unlimited)</span></label>
                <div className="space-y-2">
                  {DEFAULT_LIMITS.map((l) => (
                    <div key={l.key} className="flex items-center gap-3">
                      <label className="text-sm text-white/40 flex-1">{l.label}</label>
                      <input
                        type="number"
                        value={limits[l.key] ?? ""}
                        onChange={(e) => setLimit(l.key, e.target.value)}
                        placeholder="-1"
                        className="input-dark w-28 text-sm text-right"
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between p-6 border-t border-white/5">
              {msg && (
                <span className={`text-sm ${msg.type === "ok" ? "text-emerald-400" : "text-red-400"}`}>{msg.text}</span>
              )}
              <div className="flex gap-3 ml-auto">
                <button onClick={closeEditor} className="btn-secondary text-sm py-2 px-5">Cancel</button>
                <button
                  onClick={savePlan}
                  disabled={saving || isPending}
                  className="btn-primary text-sm py-2 px-5 flex items-center gap-2 disabled:opacity-50"
                >
                  {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                  {editor.isNew ? "Create Plan" : "Save Changes"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
