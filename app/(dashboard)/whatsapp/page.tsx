import Header from "@/components/dashboard/Header";
import StatsCard from "@/components/dashboard/StatsCard";
import { MessageSquare, Bot, Users, CheckCheck, Send, Search, Plus, ToggleLeft, ToggleRight } from "lucide-react";

const conversations = [
  { name: "Ahmad Hassan", phone: "+971 50 123 4567", lastMsg: "When will my order arrive?", time: "2m", unread: 2, aiActive: true, status: "online" },
  { name: "Fatima Al-Said", phone: "+966 55 987 6543", lastMsg: "Thank you for the quick response!", time: "15m", unread: 0, aiActive: true, status: "online" },
  { name: "Raj Patel", phone: "+91 98765 43210", lastMsg: "I would like to book an appointment", time: "1h", unread: 1, aiActive: false, status: "offline" },
  { name: "Maria Santos", phone: "+63 917 123 4567", lastMsg: "What are your business hours?", time: "2h", unread: 0, aiActive: true, status: "offline" },
  { name: "James Okafor", phone: "+234 80 123 4567", lastMsg: "Do you offer discounts for bulk orders?", time: "3h", unread: 3, aiActive: true, status: "offline" },
];

const messages = [
  { direction: "inbound", text: "Hello, I want to know about your pricing plans", time: "10:24 AM", isAI: false },
  { direction: "outbound", text: "Hi! Welcome to Vorynto AI 👋 I am your AI assistant. We offer 3 plans starting from $49/month. Would you like me to share the details?", time: "10:24 AM", isAI: true },
  { direction: "inbound", text: "Yes please, specifically the Growth plan", time: "10:25 AM", isAI: false },
  { direction: "outbound", text: "Great choice! 🌟 The Growth plan at $149/month includes:\n• AI CRM (5,000 contacts)\n• WhatsApp API Bot\n• 10,000 campaign messages/month\n• AI Website Builder\n• Voice Bot (100 min/mo)\n• Meta Ads Integration\n• AI SEO Tools\n• 10 team members\n\nWould you like to start a free 14-day trial? No credit card needed!", time: "10:25 AM", isAI: true },
  { direction: "inbound", text: "That sounds great! How do I sign up?", time: "10:26 AM", isAI: false },
  { direction: "outbound", text: "Awesome! 🎉 You can sign up here: https://app.vorynto.ai/signup?plan=growth\n\nOr I can have one of our team members call you to help with the setup. Which would you prefer?", time: "10:26 AM", isAI: true },
];

export default function WhatsAppPage() {
  return (
    <div className="flex flex-col h-full">
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

      <div className="flex-1 overflow-hidden flex flex-col">
        {/* Stats */}
        <div className="p-6 pb-0 grid grid-cols-2 xl:grid-cols-4 gap-4">
          <StatsCard title="Active Conversations" value="47" change={15} icon={MessageSquare} iconColor="text-emerald-400" iconBg="bg-emerald-600/20" />
          <StatsCard title="AI Handled Today" value="124" change={22} icon={Bot} iconColor="text-violet-400" iconBg="bg-violet-600/20" />
          <StatsCard title="Contacts Reached" value="1,284" change={8} icon={Users} iconColor="text-cyan-400" iconBg="bg-cyan-600/20" />
          <StatsCard title="Response Rate" value="98.4%" change={1.2} icon={CheckCheck} iconColor="text-amber-400" iconBg="bg-amber-600/20" />
        </div>

        {/* Chat UI */}
        <div className="flex-1 p-6 pt-4 overflow-hidden">
          <div className="glass-card h-full flex overflow-hidden">
            {/* Conversations list */}
            <div className="w-72 border-r border-white/5 flex flex-col">
              <div className="p-3 border-b border-white/5">
                <div className="flex items-center gap-2 px-3 py-1.5 bg-white/5 rounded-lg">
                  <Search className="w-3.5 h-3.5 text-white/30" />
                  <input type="text" placeholder="Search..." className="bg-transparent text-xs text-white/60 placeholder:text-white/30 outline-none flex-1" />
                </div>
              </div>
              <div className="flex-1 overflow-y-auto divide-y divide-white/5">
                {conversations.map((conv, i) => (
                  <button
                    key={conv.phone}
                    className={`w-full flex items-start gap-3 p-3 text-left transition-colors hover:bg-white/3 ${i === 0 ? "bg-violet-600/10" : ""}`}
                  >
                    <div className="relative shrink-0">
                      <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-violet-600 to-purple-700 flex items-center justify-center text-xs font-bold text-white">
                        {conv.name[0]}
                      </div>
                      {conv.status === "online" && (
                        <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-400 rounded-full border-2 border-[#0a0d1a]" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-0.5">
                        <span className="text-xs font-medium text-white truncate">{conv.name}</span>
                        <span className="text-xs text-white/30 shrink-0 ml-1">{conv.time}</span>
                      </div>
                      <p className="text-xs text-white/40 truncate">{conv.lastMsg}</p>
                      <div className="flex items-center gap-1.5 mt-1">
                        {conv.aiActive ? (
                          <span className="flex items-center gap-1 text-xs text-emerald-400">
                            <Bot className="w-3 h-3" />
                            AI Active
                          </span>
                        ) : (
                          <span className="flex items-center gap-1 text-xs text-white/30">
                            <Bot className="w-3 h-3" />
                            Human
                          </span>
                        )}
                        {conv.unread > 0 && (
                          <span className="ml-auto w-4 h-4 rounded-full bg-violet-600 flex items-center justify-center text-xs text-white font-bold">
                            {conv.unread}
                          </span>
                        )}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Chat area */}
            <div className="flex-1 flex flex-col">
              {/* Chat header */}
              <div className="flex items-center justify-between px-4 py-3 border-b border-white/5">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-violet-600/20 flex items-center justify-center text-sm font-bold text-violet-400">A</div>
                  <div>
                    <div className="text-sm font-medium text-white">Ahmad Hassan</div>
                    <div className="text-xs text-emerald-400 flex items-center gap-1">
                      <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full" />
                      Online · +971 50 123 4567
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-2 text-xs">
                    <Bot className="w-4 h-4 text-emerald-400" />
                    <span className="text-white/50">AI Mode</span>
                    <ToggleRight className="w-8 h-8 text-emerald-400 cursor-pointer" />
                  </div>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {messages.map((msg, i) => (
                  <div key={i} className={`flex ${msg.direction === "outbound" ? "justify-end" : "justify-start"}`}>
                    {msg.direction === "inbound" && (
                      <div className="w-6 h-6 rounded-full bg-violet-600/20 flex items-center justify-center text-xs text-violet-400 mr-2 mt-1 shrink-0">A</div>
                    )}
                    <div className={`max-w-xs lg:max-w-md px-4 py-2.5 rounded-2xl text-xs leading-relaxed ${
                      msg.direction === "outbound"
                        ? "bg-violet-600/20 border border-violet-500/20 text-white"
                        : "bg-white/5 border border-white/5 text-white/80"
                    }`}>
                      {msg.isAI && (
                        <div className="flex items-center gap-1 mb-1 text-emerald-400">
                          <Bot className="w-3 h-3" />
                          <span className="text-xs font-medium">AI Response</span>
                        </div>
                      )}
                      <p className="whitespace-pre-line">{msg.text}</p>
                      <p className="text-white/25 text-xs mt-1 text-right">{msg.time}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Input */}
              <div className="p-4 border-t border-white/5">
                <div className="flex items-center gap-3">
                  <input
                    type="text"
                    placeholder="Type a message or let AI handle it..."
                    className="input-dark flex-1 text-sm"
                  />
                  <button className="w-10 h-10 rounded-xl bg-violet-600 hover:bg-violet-500 flex items-center justify-center transition-colors shrink-0">
                    <Send className="w-4 h-4 text-white" />
                  </button>
                </div>
                <p className="text-xs text-white/25 mt-2 text-center">AI is handling this conversation · Turn off to respond manually</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
