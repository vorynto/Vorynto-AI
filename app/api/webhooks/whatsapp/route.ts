import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/server";
import type { Database } from "@/types/supabase";

type WaConfigRow = Database["public"]["Tables"]["whatsapp_configs"]["Row"];
type WaConvInsert = Database["public"]["Tables"]["whatsapp_conversations"]["Insert"];
type WaMsgInsert = Database["public"]["Tables"]["whatsapp_messages"]["Insert"];

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
    const supabase = await createAdminClient();
    // Scoped escape hatch: PostgREST v14 inference broken for insert/upsert builders
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const db = supabase as unknown as { from: (t: string) => any };

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

          const phoneNumberId: string = change.value?.metadata?.phone_number_id;

          // Look up whatsapp config by phone number ID
          const { data: waConfig } = await supabase
            .from("whatsapp_configs")
            .select("tenant_id")
            .eq("phone_number_id", phoneNumberId)
            .returns<Pick<WaConfigRow, "tenant_id">[]>()
            .single();

          if (!waConfig) continue;

          // Find or create conversation
          let convId: string | undefined;
          const { data: existingConv } = await supabase
            .from("whatsapp_conversations")
            .select("id")
            .eq("tenant_id", waConfig.tenant_id)
            .eq("wa_contact_id", waPhone)
            .returns<{ id: string }[]>()
            .maybeSingle();

          if (existingConv) {
            convId = existingConv.id;
          } else {
            const convData: WaConvInsert = {
              tenant_id: waConfig.tenant_id,
              wa_contact_id: waPhone,
              wa_phone: waPhone,
            };
            const { data: newConv } = await db
              .from("whatsapp_conversations")
              .insert(convData)
              .select("id")
              .single() as { data: { id: string } | null };
            if (!newConv) continue;
            convId = newConv.id;
          }

          if (!convId) continue;

          const msgData: WaMsgInsert = {
            tenant_id: waConfig.tenant_id,
            conversation_id: convId,
            wa_message_id: waMessageId,
            direction: "inbound",
            message_type: "text",
            content,
          };
          await db.from("whatsapp_messages").insert(msgData);
        }
      }
    }

    return NextResponse.json({ status: "ok" });
  } catch {
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
