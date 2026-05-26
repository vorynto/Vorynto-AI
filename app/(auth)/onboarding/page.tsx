"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Building2, Upload, Globe, Key, CheckCircle2, ArrowRight,
  MessageSquare, BarChart3, ChevronRight, Zap,
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
    connectWhatsApp: false,
    connectMeta: false,
  });
  const router = useRouter();

  function handleNext() {
    if (currentStep < 4) setCurrentStep(currentStep + 1);
    else router.push("/dashboard");
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
          <div className="space-y-4">
            <div>
              <h2 className="text-xl font-bold text-white mb-1">Connect Your Tools</h2>
              <p className="text-sm text-white/40">Link your channels to start automating (you can do this later)</p>
            </div>

            <div className="space-y-3">
              {[
                {
                  icon: MessageSquare,
                  name: "WhatsApp Business API",
                  desc: "Connect your WhatsApp Business account for AI chatbot",
                  color: "text-emerald-400",
                  bg: "bg-emerald-600/20",
                  key: "connectWhatsApp",
                },
                {
                  icon: BarChart3,
                  name: "Meta Ads (Facebook/Instagram)",
                  desc: "Connect your ad account for AI campaign management",
                  color: "text-blue-400",
                  bg: "bg-blue-600/20",
                  key: "connectMeta",
                },
                {
                  icon: Globe,
                  name: "Your Website",
                  desc: "Add our chatbot widget to any website",
                  color: "text-violet-400",
                  bg: "bg-violet-600/20",
                  key: null,
                },
              ].map((item) => (
                <div key={item.name} className="glass-card p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-xl ${item.bg} flex items-center justify-center`}>
                      <item.icon className={`w-5 h-5 ${item.color}`} />
                    </div>
                    <div>
                      <div className="text-sm font-medium text-white">{item.name}</div>
                      <div className="text-xs text-white/40">{item.desc}</div>
                    </div>
                  </div>
                  {item.key ? (
                    <button className="px-3 py-1.5 text-xs font-medium border border-violet-500/30 text-violet-300 rounded-lg hover:bg-violet-600/10 transition-all">
                      Connect
                    </button>
                  ) : (
                    <button className="px-3 py-1.5 text-xs font-medium border border-white/10 text-white/40 rounded-lg hover:bg-white/5 transition-all">
                      Get Code
                    </button>
                  )}
                </div>
              ))}
            </div>

            <p className="text-xs text-white/30 text-center">
              Need help? Our team can set these up for you.{" "}
              <a href="/contact" className="text-violet-400">Contact support</a>
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
          <button onClick={handleNext} className="btn-primary text-sm py-2.5 px-6">
            {currentStep === 4 ? "Go to Dashboard" : currentStep === 3 ? "Skip & Continue" : "Continue"}
            {currentStep < 4 ? (
              <ChevronRight className="w-4 h-4" />
            ) : (
              <ArrowRight className="w-4 h-4" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
