import { ReactNode } from "react";
import { Shield } from "lucide-react";

interface Props {
  title: string;
  subtitle?: string;
  action?: ReactNode;
  breadcrumb?: string;
}

export default function AdminHeader({ title, subtitle, action, breadcrumb }: Props) {
  return (
    <div className="border-b border-amber-500/10 bg-[#070a11] px-6 py-4">
      {breadcrumb && (
        <p className="text-xs text-amber-500/50 mb-1 font-medium tracking-wide uppercase">
          {breadcrumb}
        </p>
      )}
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center">
            <Shield className="w-4 h-4 text-amber-400" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-white leading-tight">{title}</h1>
            {subtitle && <p className="text-xs text-white/40 mt-0.5">{subtitle}</p>}
          </div>
        </div>
        {action && <div className="shrink-0">{action}</div>}
      </div>
    </div>
  );
}
