import Header from "@/components/dashboard/Header";
import CampaignsClient from "@/components/agents/CampaignsClient";
import { createAdminClient } from "@/lib/supabase/server";
import { createClient } from "@/lib/supabase/server";
import { getCurrentTenantId, hasRequiredKeys } from "@/lib/tenant-keys";
import { AlertTriangle, ArrowRight } from "lucide-react";
import Link from "next/link";
import { Plus } from "lucide-react";

export default async function CampaignsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const tenantId = user ? await getCurrentTenantId(user.id) : null;

  const [hasWhatsApp, hasTwilio, hasSmtp] = tenantId
    ? await Promise.all([
        hasRequiredKeys(tenantId, "whatsapp", ["access_token", "phone_number_id"]),
        hasRequiredKeys(tenantId, "twilio", ["account_sid", "auth_token"]),
        hasRequiredKeys(tenantId, "smtp", ["host", "user", "pass"]),
      ])
    : [false, false, false];

  const missingProviders = [
    !hasWhatsApp && { label: "WhatsApp", desc: "WhatsApp campaigns" },
    !hasTwilio && { label: "Twilio", desc: "SMS campaigns" },
    !hasSmtp && { label: "Email (SMTP)", desc: "Email campaigns" },
  ].filter(Boolean) as { label: string; desc: string }[];

  const admin = await createAdminClient();

  const { data: campaigns } = tenantId
    ? await admin
        .from("campaigns")
        .select("*")
        .eq("tenant_id", tenantId)
        .order("created_at", { ascending: false })
        .returns<{
          id: string; tenant_id: string; name: string; type: string;
          status: string | null; total_recipients: number | null;
          sent_count: number | null; opened_count: number | null;
          clicked_count: number | null; scheduled_at: string | null;
          sent_at: string | null; created_at: string | null;
        }[]>()
    : { data: [] };

  return (
    <div>
      {missingProviders.length > 0 && (
        <div className="mx-6 mt-6 p-4 rounded-xl border border-amber-500/20 bg-amber-500/5 flex gap-3">
          <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="text-sm font-semibold text-white mb-1">Some campaign channels are not configured</p>
            <p className="text-xs text-white/50 mb-3">
              Add the missing API keys in Settings to unlock all campaign types:
            </p>
            <div className="flex flex-wrap gap-2 mb-3">
              {missingProviders.map((p) => (
                <span key={p.label} className="px-2 py-0.5 text-[11px] rounded-md bg-white/5 border border-white/10 text-white/50">
                  {p.label} — {p.desc}
                </span>
              ))}
            </div>
            <Link href="/settings" className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-500/10 border border-amber-500/20 text-xs font-semibold text-amber-300 hover:bg-amber-500/20 transition-all">
              Configure in Settings <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      )}
      <Header
        title="Bulk Campaigns"
        subtitle="WhatsApp, SMS & Email campaigns at scale"
        action={
          <button className="btn-primary text-sm py-2 px-4">
            <Plus className="w-4 h-4" />
            New Campaign
          </button>
        }
      />
      {tenantId && (
        <CampaignsClient
          tenantId={tenantId}
          initialCampaigns={campaigns ?? []}
        />
      )}
    </div>
  );
}
