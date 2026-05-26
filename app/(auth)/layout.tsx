import Link from "next/link";
import { Zap } from "lucide-react";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#080b14] flex flex-col">
      {/* Top bar */}
      <header className="p-6">
        <Link href="/" className="flex items-center gap-2.5 w-fit">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-violet-600 to-purple-800 flex items-center justify-center">
            <Zap className="w-4 h-4 text-white" />
          </div>
          <span className="text-lg font-bold">
            <span className="gradient-text">Vorynto</span>
            <span className="text-white"> AI</span>
          </span>
        </Link>
      </header>

      {/* Background effects */}
      <div className="fixed inset-0 bg-glow-gradient pointer-events-none" />
      <div
        className="fixed inset-0 opacity-10 pointer-events-none"
        style={{
          backgroundImage: `linear-gradient(rgba(124,58,237,0.2) 1px, transparent 1px), linear-gradient(90deg, rgba(124,58,237,0.2) 1px, transparent 1px)`,
          backgroundSize: "50px 50px",
        }}
      />

      <main className="flex-1 flex items-center justify-center p-6 relative z-10">
        {children}
      </main>
    </div>
  );
}
