import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import { cn } from "@/lib/utils/cn";

interface StatsCardProps {
  title: string;
  value: string | number;
  change?: number;
  changeLabel?: string;
  icon: React.ComponentType<{ className?: string }>;
  iconColor?: string;
  iconBg?: string;
  suffix?: string;
}

export default function StatsCard({
  title,
  value,
  change,
  changeLabel,
  icon: Icon,
  iconColor = "text-violet-400",
  iconBg = "bg-violet-600/20",
  suffix,
}: StatsCardProps) {
  const isPositive = change !== undefined && change > 0;
  const isNegative = change !== undefined && change < 0;
  const isNeutral = change === 0;

  return (
    <div className="glass-card p-5 hover:border-white/12 transition-all duration-200">
      <div className="flex items-start justify-between mb-4">
        <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center", iconBg)}>
          <Icon className={cn("w-5 h-5", iconColor)} />
        </div>
        {change !== undefined && (
          <div
            className={cn(
              "flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-medium",
              isPositive && "bg-emerald-500/10 text-emerald-400",
              isNegative && "bg-red-500/10 text-red-400",
              isNeutral && "bg-white/5 text-white/40"
            )}
          >
            {isPositive && <TrendingUp className="w-3 h-3" />}
            {isNegative && <TrendingDown className="w-3 h-3" />}
            {isNeutral && <Minus className="w-3 h-3" />}
            {change > 0 ? "+" : ""}{change}%
          </div>
        )}
      </div>
      <div className="text-2xl font-bold text-white mb-0.5">
        {value}{suffix}
      </div>
      <div className="text-sm text-white/40">{title}</div>
      {changeLabel && (
        <div className="text-xs text-white/25 mt-1">{changeLabel}</div>
      )}
    </div>
  );
}
