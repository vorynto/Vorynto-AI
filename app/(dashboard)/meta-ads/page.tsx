import Header from "@/components/dashboard/Header";
import MetaAdsClient from "@/components/agents/MetaAdsClient";
import { createAdminClient } from "@/lib/supabase/server";
import { createClient } from "@/lib/supabase/server";
import { getCurrentTenantId } from "@/lib/tenant-keys";
import { Plus } from "lucide-react";

export default async function MetaAdsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const tenantId = user ? await getCurrentTenantId(user.id) : null;

  const admin = await createAdminClient();

  const { data: metaConfig } = tenantId
    ? await admin
        .from("meta_ads_configs")
        .select("id, tenant_id, is_connected, account_name, ad_account_id")
        .eq("tenant_id", tenantId)
        .returns<{
          id: string; tenant_id: string; is_connected: boolean | null;
          account_name: string | null; ad_account_id: string | null;
        }[]>()
        .maybeSingle()
    : { data: null };

  const { data: campaigns } = tenantId
    ? await admin
        .from("meta_ad_campaigns")
        .select("*")
        .eq("tenant_id", tenantId)
        .order("created_at", { ascending: false })
        .returns<{
          id: string; tenant_id: string; name: string; platform: string | null;
          budget: number | null; spent: number | null; impressions: number | null;
          clicks: number | null; conversions: number | null; roas: number | null;
          status: string | null; created_at: string | null;
        }[]>()
    : { data: [] };

  return (
    <div>
      <Header
        title="Meta Ads AI"
        subtitle="AI-managed Facebook & Instagram ad campaigns"
        action={
          <button className="btn-primary text-sm py-2 px-4">
            <Plus className="w-4 h-4" />
            Create Campaign
          </button>
        }
      />
      {tenantId && (
        <MetaAdsClient
          tenantId={tenantId}
          initialConfig={metaConfig ?? null}
          initialCampaigns={campaigns ?? []}
        />
      )}
    </div>
  );
}
