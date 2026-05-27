import Link from "next/link";
import { AlertTriangle, ArrowRight } from "lucide-react";

interface Props {
  provider: string;
  title: string;
  description: string;
  keys: string[];
}

/**
 * Banner shown on feature pages when the tenant hasn't configured
 * the required API keys yet. Links directly to the Settings → API Keys section.
 */
export default function SetupRequired({ provider, title, description, keys }: Props) {
  return (
    <div className="m-6 p-5 rounded-xl border border-amber-500/20 bg-amber-500/5 flex gap-4 items-start">
      <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center shrink-0">
        <AlertTriangle className="w-5 h-5 text-amber-400" />
      </div>
      <div className="flex-1">
        <p className="text-sm font-semibold text-white">{title}</p>
        <p className="text-xs text-white/50 mt-0.5 mb-3">{description}</p>
        <div className="flex flex-wrap gap-2 mb-4">
          {keys.map((k) => (
            <span
              key={k}
              className="px-2 py-0.5 text-[11px] font-mono rounded-md bg-white/5 border border-white/10 text-white/50"
            >
              {provider} → {k}
            </span>
          ))}
        </div>
        <Link
          href="/settings"
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-amber-500/10 border border-amber-500/20 text-xs font-semibold text-amber-300 hover:bg-amber-500/20 transition-all"
        >
          Configure in Settings
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
}
