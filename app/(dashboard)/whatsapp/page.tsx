import Header from "@/components/dashboard/Header";
import SetupRequired from "@/components/ui/SetupRequired";
import WhatsAppClient from "@/components/agents/WhatsAppClient";
import { createAdminClient } from "@/lib/supabase/server";
import { createClient } from "@/lib/supabase/server";
import { getCurrentTenantId, hasRequiredKeys } from "@/lib/tenant-keys";
import { Plus } from "lucide-react";

export default async function WhatsAppPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const tenantId = user ? await getCurrentTenantId(user.id) : null;

  const ready = tenantId
    ? await hasRequiredKeys(tenantId, "whatsapp", ["access_token", "phone_number_id"])
    : false;

  const admin = await createAdminClient();

  // Load conversations
  const { data: conversations } = tenantId
    ? await admin
        .from("whatsapp_conversations")
        .select("*")
        .eq("tenant_id", tenantId)
        .order("last_message_at", { ascending: false })
        .limit(50)
        .returns<{
          id: string; tenant_id: string; contact_name: string | null;
          wa_phone: string; last_message: string | null; last_message_at: string | null;
          is_ai_active: boolean | null; unread_count: number | null;
          is_resolved: boolean | null; wa_contact_id: string;
        }[]>()
    : { data: [] };

  // Load messages for first conversation
  const firstConvId = conversations?.[0]?.id;
  const { data: messages } = firstConvId
    ? await admin
        .from("whatsapp_messages")
        .select("*")
        .eq("conversation_id", firstConvId)
        .order("sent_at", { ascending: true })
        .limit(100)
        .returns<{
          id: string; tenant_id: string; conversation_id: string;
          direction: string; content: string | null; is_ai_generated: boolean | null;
          sent_at: string | null;
        }[]>()
    : { data: [] };

  return (
    <div className="flex flex-col h-full">
      {!ready && (
        <SetupRequired
          provider="whatsapp"
          title="WhatsApp Business API not configured"
          description="Add your WhatsApp credentials to start receiving and sending messages with the AI bot."
          keys={["access_token", "phone_number_id", "waba_id", "verify_token"]}
        />
      )}
      <Header
        title="WhatsApp AI Bot"
        subtitle="AI-powered conversations with your customers"
        action={
          <button className="btn-primary text-sm py-2 px-4">
            <Plus className="w-4 h-4" />
            Configure Bot
          </button>
        }
      />
      {tenantId && (
        <WhatsAppClient
          tenantId={tenantId}
          initialConversations={conversations ?? []}
          initialMessages={messages ?? []}
        />
      )}
    </div>
  );
}
