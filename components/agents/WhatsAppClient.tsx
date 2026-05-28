"use client";

import { useState, useEffect, useRef } from "react";
import { createClient, mutationClient } from "@/lib/supabase/client";
import { useRealtimeTable } from "@/lib/hooks/useRealtimeTable";
import StatsCard from "@/components/dashboard/StatsCard";
import {
  MessageSquare, Bot, Users, CheckCheck, Send, Search,
  Plus, ToggleLeft, ToggleRight, Wifi, WifiOff,
} from "lucide-react";

type Conversation = {
  id: string;
  tenant_id: string;
  contact_name: string | null;
  wa_phone: string;
  last_message: string | null;
  last_message_at: string | null;
  is_ai_active: boolean | null;
  unread_count: number | null;
  is_resolved: boolean | null;
  wa_contact_id: string;
};

type Message = {
  id: string;
  tenant_id: string;
  conversation_id: string;
  direction: string;
  content: string | null;
  is_ai_generated: boolean | null;
  sent_at: string | null;
};

type Props = {
  tenantId: string;
  initialConversations: Conversation[];
  initialMessages: Message[];
};

function timeAgo(ts: string | null) {
  if (!ts) return "—";
  const diff = Date.now() - new Date(ts).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1) return "just now";
  if (m < 60) return `${m}m`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h`;
  return `${Math.floor(h / 24)}d`;
}

export default function WhatsAppClient({ tenantId, initialConversations, initialMessages }: Props) {
  const { data: conversations, connected } = useRealtimeTable<Conversation>(
    "whatsapp_conversations", tenantId, initialConversations
  );
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [selectedId, setSelectedId] = useState<string | null>(
    initialConversations[0]?.id ?? null
  );
  const [search, setSearch] = useState("");
  const [inputText, setInputText] = useState("");
  const [sending, setSending] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  const selected = conversations.find((c) => c.id === selectedId) ?? null;

  // Realtime subscription for messages of the selected conversation
  useEffect(() => {
    if (!selectedId) return;
    const supabase = createClient();
    const channel = supabase
      .channel(`rt-messages-${selectedId}`)
      .on(
        // @ts-expect-error supabase typing quirk
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "whatsapp_messages",
          filter: `conversation_id=eq.${selectedId}`,
        },
        (payload: { eventType: string; new: Message; old: Partial<Message> }) => {
          if (payload.eventType === "INSERT") {
            setMessages((prev) => [...prev, payload.new]);
          } else if (payload.eventType === "UPDATE") {
            setMessages((prev) =>
              prev.map((m) => (m.id === payload.new.id ? payload.new : m))
            );
          }
        }
      )
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [selectedId]);

  // Load messages when switching conversations
  async function loadMessages(convId: string) {
    setSelectedId(convId);
    const supabase = createClient();
    const { data } = await supabase
      .from("whatsapp_messages")
      .select("*")
      .eq("conversation_id", convId)
      .order("sent_at", { ascending: true })
      .limit(100);
    setMessages((data as Message[]) ?? []);
  }

  // Scroll to bottom on new messages
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  async function sendMessage() {
    if (!inputText.trim() || !selectedId || !tenantId) return;
    setSending(true);
    const text = inputText;
    setInputText("");
    const db = mutationClient();
    await db.from("whatsapp_messages").insert({
      tenant_id: tenantId,
      conversation_id: selectedId,
      direction: "outbound",
      content: text,
      is_ai_generated: false,
      sent_at: new Date().toISOString(),
    });
    // Update last message on conversation
    await db.from("whatsapp_conversations").update({
      last_message: text,
      last_message_at: new Date().toISOString(),
    }).eq("id", selectedId);
    setSending(false);
  }

  async function toggleAI(convId: string, current: boolean | null) {
    const db = mutationClient();
    await db.from("whatsapp_conversations")
      .update({ is_ai_active: !current })
      .eq("id", convId);
  }

  const filtered = conversations.filter(
    (c) => !search || (c.contact_name ?? c.wa_phone).toLowerCase().includes(search.toLowerCase())
  );

  const activeCount = conversations.filter((c) => !c.is_resolved).length;
  const aiHandled = conversations.filter((c) => c.is_ai_active).length;
  const totalUnread = conversations.reduce((s, c) => s + (c.unread_count ?? 0), 0);

  return (
    <div className="flex-1 overflow-hidden flex flex-col">
      {/* Stats */}
      <div className="p-6 pb-0 grid grid-cols-2 xl:grid-cols-4 gap-4">
        <StatsCard title="Active Conversations" value={activeCount.toString()} icon={MessageSquare} iconColor="text-emerald-400" iconBg="bg-emerald-600/20" />
        <StatsCard title="AI Handling" value={aiHandled.toString()} icon={Bot} iconColor="text-violet-400" iconBg="bg-violet-600/20" />
        <StatsCard title="Total Contacts" value={conversations.length.toString()} icon={Users} iconColor="text-cyan-400" iconBg="bg-cyan-600/20" />
        <StatsCard title="Unread Messages" value={totalUnread.toString()} icon={CheckCheck} iconColor="text-amber-400" iconBg="bg-amber-600/20" />
      </div>

      {/* Chat UI */}
      <div className="flex-1 p-6 pt-4 overflow-hidden">
        <div className="glass-card h-full flex overflow-hidden">
          {/* Conversations list */}
          <div className="w-72 border-r border-white/5 flex flex-col">
            <div className="p-3 border-b border-white/5">
              <div className="flex items-center gap-2 px-3 py-1.5 bg-white/5 rounded-lg">
                <Search className="w-3.5 h-3.5 text-white/30" />
                <input
                  type="text"
                  placeholder="Search..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="bg-transparent text-xs text-white/60 placeholder:text-white/30 outline-none flex-1"
                />
              </div>
            </div>

            {/* Live indicator */}
            <div className="px-3 py-1.5 flex items-center gap-1.5 border-b border-white/5">
              {connected ? (
                <><Wifi className="w-3 h-3 text-emerald-400" /><span className="text-[10px] text-emerald-400">Live</span></>
              ) : (
                <><WifiOff className="w-3 h-3 text-white/20" /><span className="text-[10px] text-white/30">Connecting…</span></>
              )}
            </div>

            <div className="flex-1 overflow-y-auto divide-y divide-white/5">
              {filtered.length === 0 ? (
                <div className="p-6 text-center">
                  <MessageSquare className="w-8 h-8 text-white/10 mx-auto mb-2" />
                  <p className="text-xs text-white/30">No conversations yet</p>
                </div>
              ) : (
                filtered.map((conv) => (
                  <button
                    key={conv.id}
                    onClick={() => loadMessages(conv.id)}
                    className={`w-full flex items-start gap-3 p-3 text-left transition-colors hover:bg-white/3 ${conv.id === selectedId ? "bg-violet-600/10" : ""}`}
                  >
                    <div className="relative shrink-0">
                      <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-violet-600 to-purple-700 flex items-center justify-center text-xs font-bold text-white">
                        {(conv.contact_name ?? conv.wa_phone)[0]}
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-0.5">
                        <span className="text-xs font-medium text-white truncate">
                          {conv.contact_name ?? conv.wa_phone}
                        </span>
                        <span className="text-xs text-white/30 shrink-0 ml-1">
                          {timeAgo(conv.last_message_at)}
                        </span>
                      </div>
                      <p className="text-xs text-white/40 truncate">{conv.last_message ?? "No messages yet"}</p>
                      <div className="flex items-center gap-1.5 mt-1">
                        {conv.is_ai_active ? (
                          <span className="flex items-center gap-1 text-xs text-emerald-400">
                            <Bot className="w-3 h-3" /> AI Active
                          </span>
                        ) : (
                          <span className="flex items-center gap-1 text-xs text-white/30">
                            <Bot className="w-3 h-3" /> Human
                          </span>
                        )}
                        {(conv.unread_count ?? 0) > 0 && (
                          <span className="ml-auto w-4 h-4 rounded-full bg-violet-600 flex items-center justify-center text-xs text-white font-bold">
                            {conv.unread_count}
                          </span>
                        )}
                      </div>
                    </div>
                  </button>
                ))
              )}
            </div>

            <div className="p-3 border-t border-white/5">
              <button className="btn-primary w-full text-xs py-2 flex items-center justify-center gap-1.5">
                <Plus className="w-3.5 h-3.5" /> New Conversation
              </button>
            </div>
          </div>

          {/* Chat area */}
          <div className="flex-1 flex flex-col">
            {selected ? (
              <>
                {/* Chat header */}
                <div className="flex items-center justify-between px-4 py-3 border-b border-white/5">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-violet-600/20 flex items-center justify-center text-sm font-bold text-violet-400">
                      {(selected.contact_name ?? selected.wa_phone)[0]}
                    </div>
                    <div>
                      <div className="text-sm font-medium text-white">
                        {selected.contact_name ?? "Unknown"}
                      </div>
                      <div className="text-xs text-emerald-400 flex items-center gap-1">
                        <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full" />
                        {selected.wa_phone}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-xs">
                    <Bot className={`w-4 h-4 ${selected.is_ai_active ? "text-emerald-400" : "text-white/30"}`} />
                    <span className="text-white/50">AI Mode</span>
                    <button onClick={() => toggleAI(selected.id, selected.is_ai_active)}>
                      {selected.is_ai_active ? (
                        <ToggleRight className="w-8 h-8 text-emerald-400 cursor-pointer" />
                      ) : (
                        <ToggleLeft className="w-8 h-8 text-white/30 cursor-pointer" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-4 space-y-3">
                  {messages.length === 0 ? (
                    <div className="flex items-center justify-center h-full text-sm text-white/20">
                      No messages in this conversation
                    </div>
                  ) : (
                    messages.map((msg) => (
                      <div
                        key={msg.id}
                        className={`flex ${msg.direction === "outbound" ? "justify-end" : "justify-start"}`}
                      >
                        {msg.direction === "inbound" && (
                          <div className="w-6 h-6 rounded-full bg-violet-600/20 flex items-center justify-center text-xs text-violet-400 mr-2 mt-1 shrink-0">
                            {(selected.contact_name ?? "?")[0]}
                          </div>
                        )}
                        <div
                          className={`max-w-xs lg:max-w-md px-4 py-2.5 rounded-2xl text-xs leading-relaxed ${
                            msg.direction === "outbound"
                              ? "bg-violet-600/20 border border-violet-500/20 text-white"
                              : "bg-white/5 border border-white/5 text-white/80"
                          }`}
                        >
                          {msg.is_ai_generated && (
                            <div className="flex items-center gap-1 mb-1 text-emerald-400">
                              <Bot className="w-3 h-3" />
                              <span className="text-xs font-medium">AI Response</span>
                            </div>
                          )}
                          <p className="whitespace-pre-line">{msg.content}</p>
                          <p className="text-white/25 text-xs mt-1 text-right">
                            {msg.sent_at ? new Date(msg.sent_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : ""}
                          </p>
                        </div>
                      </div>
                    ))
                  )}
                  <div ref={bottomRef} />
                </div>

                {/* Input */}
                <div className="p-4 border-t border-white/5">
                  <div className="flex items-center gap-3">
                    <input
                      type="text"
                      placeholder={selected.is_ai_active ? "AI is handling — type to override..." : "Type a message..."}
                      value={inputText}
                      onChange={(e) => setInputText(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && sendMessage()}
                      className="input-dark flex-1 text-sm"
                    />
                    <button
                      onClick={sendMessage}
                      disabled={sending || !inputText.trim()}
                      className="w-10 h-10 rounded-xl bg-violet-600 hover:bg-violet-500 disabled:opacity-40 flex items-center justify-center transition-colors shrink-0"
                    >
                      <Send className="w-4 h-4 text-white" />
                    </button>
                  </div>
                  <p className="text-xs text-white/25 mt-2 text-center">
                    {selected.is_ai_active
                      ? "AI is handling this conversation · Click toggle to respond manually"
                      : "Manual mode — you are responding"}
                  </p>
                </div>
              </>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center text-center p-8">
                <MessageSquare className="w-12 h-12 text-white/10 mb-4" />
                <p className="text-sm text-white/30 mb-2">No conversation selected</p>
                <p className="text-xs text-white/15">Pick a conversation from the left or start a new one</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
