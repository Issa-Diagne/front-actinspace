import { cn } from "@/lib/utils";
import { Shield, Lock, Eye, Cpu } from "lucide-react";

interface Metric {
  label: string;
  value: number;
  max: number;
  unit?: string;
  status: "good" | "moderate" | "poor";
}

const metrics: Metric[] = [
  { label: "Chiffrement", value: 256, max: 256, unit: "bit", status: "good" },
  { label: "Intégrité", value: 98, max: 100, unit: "%", status: "good" },
  { label: "Authentification", value: 87, max: 100, unit: "%", status: "moderate" },
  { label: "Détection", value: 94, max: 100, unit: "%", status: "good" },
];

const statusColors = {
  good: "from-secure-green to-cyber-cyan",
  moderate: "from-warning-amber to-cyber-cyan",
  poor: "from-threat-red to-warning-amber",
};

export function SecurityMetrics() {
  const overallScore = Math.round(
    metrics.reduce((acc, m) => acc + (m.value / m.max) * 100, 0) / metrics.length
  );

  return (
    <div className="cyber-card rounded-xl border border-border p-4">
      {/* Header */}
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Shield className="h-5 w-5 text-primary" />
          <h3 className="font-orbitron text-sm font-semibold uppercase tracking-wider">
            Niveau de Sécurité
          </h3>
        </div>
      </div>

      {/* Overall Score */}
      <div className="mb-6 flex items-center justify-center">
        <div className="relative">
          {/* Circular progress */}
          <svg className="h-32 w-32 -rotate-90 transform">
            {/* Background circle */}
            <circle
              cx="64"
              cy="64"
              r="56"
              fill="none"
              stroke="hsl(var(--muted))"
              strokeWidth="8"
            />
            {/* Progress circle */}
            <circle
              cx="64"
              cy="64"
              r="56"
              fill="none"
              stroke="url(#securityGradient)"
              strokeWidth="8"
              strokeLinecap="round"
              strokeDasharray={`${(overallScore / 100) * 352} 352`}
              className="transition-all duration-1000"
            />
            <defs>
              <linearGradient id="securityGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="hsl(var(--secure-green))" />
                <stop offset="100%" stopColor="hsl(var(--cyber-cyan))" />
              </linearGradient>
            </defs>
          </svg>
          {/* Center text */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="font-orbitron text-3xl font-bold text-foreground">
              {overallScore}
            </span>
            <span className="text-xs text-muted-foreground">Score Global</span>
          </div>
        </div>
      </div>

      {/* Individual metrics */}
      <div className="space-y-3">
        {metrics.map((metric, index) => (
          <div key={metric.label}>
            <div className="mb-1 flex items-center justify-between">
              <span className="text-xs text-muted-foreground">{metric.label}</span>
              <span className="font-mono text-xs font-medium text-foreground">
                {metric.value}
                {metric.unit}
              </span>
            </div>
            <div className="h-1.5 rounded-full bg-muted">
              <div
                className={cn(
                  "h-full rounded-full bg-gradient-to-r transition-all duration-500",
                  statusColors[metric.status]
                )}
                style={{ width: `${(metric.value / metric.max) * 100}%` }}
              />
            </div>
          </div>
        ))}
      </div>

      {/* Security features */}
      <div className="mt-6 grid grid-cols-2 gap-2">
        <div className="flex items-center gap-2 rounded-lg bg-secure-green/10 px-3 py-2">
          <Lock className="h-4 w-4 text-secure-green" />
          <span className="text-xs font-medium text-secure-green">AES-256</span>
        </div>
        <div className="flex items-center gap-2 rounded-lg bg-secure-green/10 px-3 py-2">
          <Eye className="h-4 w-4 text-secure-green" />
          <span className="text-xs font-medium text-secure-green">Zero Trust</span>
        </div>
        <div className="flex items-center gap-2 rounded-lg bg-primary/10 px-3 py-2">
          <Cpu className="h-4 w-4 text-primary" />
          <span className="text-xs font-medium text-primary">IA Active</span>
        </div>
        <div className="flex items-center gap-2 rounded-lg bg-primary/10 px-3 py-2">
          <Shield className="h-4 w-4 text-primary" />
          <span className="text-xs font-medium text-primary">Auto-défense</span>
        </div>
      </div>
    </div>
  );
}
