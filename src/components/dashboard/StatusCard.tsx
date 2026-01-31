import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

type StatusType = "normal" | "warning" | "critical" | "secure";

interface StatusCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  status?: StatusType;
  trend?: {
    value: number;
    direction: "up" | "down";
  };
}

const statusStyles: Record<StatusType, string> = {
  normal: "border-border hover:border-primary/50",
  warning: "border-warning-amber/50 hover:border-warning-amber",
  critical: "border-threat-red/50 hover:border-threat-red glow-threat",
  secure: "border-secure-green/50 hover:border-secure-green",
};

const statusIconStyles: Record<StatusType, string> = {
  normal: "bg-primary/10 text-primary",
  warning: "bg-warning-amber/10 text-warning-amber",
  critical: "bg-threat-red/10 text-threat-red",
  secure: "bg-secure-green/10 text-secure-green",
};

export function StatusCard({
  title,
  value,
  subtitle,
  icon: Icon,
  status = "normal",
  trend,
}: StatusCardProps) {
  return (
    <div
      className={cn(
        "cyber-card group relative overflow-hidden rounded-xl border p-5 transition-all",
        statusStyles[status]
      )}
    >
      {/* Background glow effect */}
      {status === "critical" && (
        <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-threat-red/10 blur-3xl" />
      )}
      {status === "secure" && (
        <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-secure-green/10 blur-3xl" />
      )}

      <div className="relative flex items-start justify-between">
        <div className="flex flex-col gap-1">
          <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
            {title}
          </span>
          <span className="font-orbitron text-3xl font-bold tracking-tight text-foreground">
            {value}
          </span>
          {subtitle && (
            <span className="text-sm text-muted-foreground">{subtitle}</span>
          )}
          {trend && (
            <div
              className={cn(
                "mt-1 flex items-center gap-1 text-xs font-medium",
                trend.direction === "up" ? "text-secure-green" : "text-threat-red"
              )}
            >
              <span>{trend.direction === "up" ? "↑" : "↓"}</span>
              <span>{trend.value}%</span>
              <span className="text-muted-foreground">vs hier</span>
            </div>
          )}
        </div>
        <div
          className={cn(
            "flex h-12 w-12 items-center justify-center rounded-xl transition-transform group-hover:scale-110",
            statusIconStyles[status]
          )}
        >
          <Icon className="h-6 w-6" />
        </div>
      </div>
    </div>
  );
}
