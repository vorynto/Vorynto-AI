import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/server";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const mode = searchParams.get("hub.mode");
  const token = searchParams.get("hub.verify_token");
  const challenge = searchParams.get("hub.challenge");

  if (mode === "subscribe" && token === process.env.WHATSAPP_VERIFY_TOKEN) {
    return new NextResponse(challenge, { status: 200 });
  }

  return NextResponse.json({ error: "Forbidden" }, { status: 403 });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const supabase = (await createAdminClient()) as any;

    if (body.object !== "whatsapp_business_account") {
      return NextResponse.json({ status: "ignored" });
    }

    for (const entry of body.entry || []) {
      for (const change of entry.changes || []) {
        if (change.field !== "messages") continue;

        const messages = change.value?.messages || [];
        for (const message of messages) {
          if (message.type !== "text") continue;

          const waPhone: string = message.from;
          const content: string = message.text?.body;
          const waMessageId: string = message.id;

          const phoneNumberId = change.value?.metadata?.phone_number_id;
          const { data: waConfig } = await supabase
            .from("whatsapp_configs")
            .select("tenant_id")
            .eq("phone_number_id", phoneNumberId)
            .single();

          if (!waConfig) continue;

          const { data: conv } = await supabase
            .from("whatsapp_conversations")
            .upsert(
              { tenant_id: waConfig.tenant_id, wa_contact_id: waPhone, wa_phone: waPhone },
              { onConflict: "tenant_id,wa_contact_id" }
            )
            .select("id")
            .single();

          if (!conv) continue;

          await supabase.from("whatsapp_messages").insert({
            tenant_id: waConfig.tenant_id,
            conversation_id: conv.id,
            wa_message_id: waMessageId,
            direction: "inbound",
            message_type: "text",
            content,
          });
        }
      }
    }

    return NextResponse.json({ status: "ok" });
  } catch {
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
