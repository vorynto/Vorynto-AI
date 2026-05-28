import Header from "@/components/dashboard/Header";
import SetupRequired from "@/components/ui/SetupRequired";
import VoiceBotClient from "@/components/agents/VoiceBotClient";
import { createAdminClient } from "@/lib/supabase/server";
import { createClient } from "@/lib/supabase/server";
import { getCurrentTenantId, hasRequiredKeys } from "@/lib/tenant-keys";
import { Plus } from "lucide-react";

export default async function VoiceBotPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const tenantId = user ? await getCurrentTenantId(user.id) : null;

  const ready = tenantId
    ? await hasRequiredKeys(tenantId, "openai", ["api_key"])
    : false;

  const admin = await createAdminClient();

  const { data: configRow } = tenantId
    ? await admin
        .from("voice_bot_configs")
        .select("*")
        .eq("tenant_id", tenantId)
        .returns<{
          id: string; tenant_id: string; name: string; voice_id: string | null;
          language: string | null; greeting_message: string | null;
          phone_number: string | null; system_prompt: string | null;
          is_active: boolean | null;
        }[]>()
        .maybeSingle()
    : { data: null };

  const { data: calls } = tenantId
    ? await admin
        .from("voice_calls")
        .select("id, tenant_id, caller_number, duration_seconds, outcome, sentiment, called_at")
        .eq("tenant_id", tenantId)
        .order("called_at", { ascending: false })
        .limit(50)
        .returns<{
          id: string; tenant_id: string; caller_number: string;
          duration_seconds: number | null; outcome: string | null;
          sentiment: string | null; called_at: string | null;
        }[]>()
    : { data: [] };

  return (
    <div>
      {!ready && (
        <SetupRequired
          provider="openai"
          title="OpenAI API key not configured"
          description="The Voice Bot uses OpenAI to understand and respond to spoken conversations. Add your API key to activate it."
          keys={["api_key"]}
        />
      )}
      <Header
        title="Voice Bot"
        subtitle="AI-powered voice conversations for phone and web"
        action={
          <button className="btn-primary text-sm py-2 px-4">
            <Plus className="w-4 h-4" />
            Configure Voice Bot
          </button>
        }
      />
      {tenantId && (
        <VoiceBotClient
          tenantId={tenantId}
          initialConfig={configRow ?? null}
          initialCalls={calls ?? []}
        />
      )}
    </div>
  );
}
