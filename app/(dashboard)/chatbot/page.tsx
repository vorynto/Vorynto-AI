import Header from "@/components/dashboard/Header";
import SetupRequired from "@/components/ui/SetupRequired";
import ChatbotClient from "@/components/agents/ChatbotClient";
import { createAdminClient } from "@/lib/supabase/server";
import { createClient } from "@/lib/supabase/server";
import { getCurrentTenantId, hasRequiredKeys } from "@/lib/tenant-keys";
import { Plus } from "lucide-react";

export default async function ChatbotPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const tenantId = user ? await getCurrentTenantId(user.id) : null;

  const ready = tenantId
    ? await hasRequiredKeys(tenantId, "openai", ["api_key"])
    : false;

  const admin = await createAdminClient();

  const { data: configs } = tenantId
    ? await admin
        .from("chatbot_configs")
        .select("*")
        .eq("tenant_id", tenantId)
        .returns<{
          id: string; tenant_id: string; name: string;
          welcome_message: string | null; system_prompt: string | null;
          primary_color: string | null; position: string | null;
          is_active: boolean | null; ai_model: string | null;
        }[]>()
    : { data: [] };

  // Load recent chatbot sessions (from new table)
  const { data: sessions } = tenantId
    ? await admin
        .from("chatbot_sessions")
        .select("id, tenant_id, is_resolved, lead_captured, message_count, started_at")
        .eq("tenant_id", tenantId)
        .order("started_at", { ascending: false })
        .limit(100)
        .returns<{
          id: string; tenant_id: string; is_resolved: boolean | null;
          lead_captured: boolean | null; message_count: number | null;
          started_at: string | null;
        }[]>()
    : { data: [] };

  return (
    <div>
      {!ready && (
        <SetupRequired
          provider="openai"
          title="OpenAI API key not configured"
          description="Add your OpenAI API key to power the AI chatbot responses."
          keys={["api_key"]}
        />
      )}
      <Header
        title="Website AI Chatbot"
        subtitle="Embed AI chatbot on any website"
        action={
          <button className="btn-primary text-sm py-2 px-4">
            <Plus className="w-4 h-4" />
            New Chatbot
          </button>
        }
      />
      {tenantId && (
        <ChatbotClient
          tenantId={tenantId}
          initialConfigs={configs ?? []}
          initialSessions={sessions ?? []}
        />
      )}
    </div>
  );
}
