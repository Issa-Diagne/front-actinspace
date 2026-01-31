import { cn } from "@/lib/utils";
import { AlertTriangle, Shield, Zap, Radio, Clock } from "lucide-react";
import { LucideIcon } from "lucide-react";

type ThreatType = "jamming" | "spoofing" | "intrusion" | "resolved";

interface ThreatEvent {
  id: string;
  type: ThreatType;
  title: string;
  description: string;
  timestamp: string;
  severity: "low" | "medium" | "high" | "critical";
  target?: string;
}

const mockEvents: ThreatEvent[] = [
  {
    id: "1",
    type: "jamming",
    title: "Brouillage détecté",
    description: "Interférence RF sur canal L-Band SAT-003",
    timestamp: "Il y a 2 min",
    severity: "high",
    target: "GALILEO-E14",
  },
  {
    id: "2",
    type: "intrusion",
    title: "Tentative d'intrusion",
    description: "Accès non autorisé au système TTC",
    timestamp: "Il y a 8 min",
    severity: "critical",
    target: "COSMO-SKY-4",
  },
  {
    id: "3",
    type: "resolved",
    title: "Menace neutralisée",
    description: "Changement de fréquence automatique effectué",
    timestamp: "Il y a 15 min",
    severity: "low",
    target: "SENTINEL-1A",
  },
  {
    id: "4",
    type: "spoofing",
    title: "Spoofing GPS",
    description: "Signal GPS falsifié détecté - validation croisée active",
    timestamp: "Il y a 23 min",
    severity: "medium",
    target: "COPERNICUS-2",
  },
  {
    id: "5",
    type: "resolved",
    title: "Système restauré",
    description: "Communications chiffrées rétablies",
    timestamp: "Il y a 45 min",
    severity: "low",
    target: "EUTELSAT-KA1",
  },
];

const typeConfig: Record<ThreatType, { icon: LucideIcon; color: string; bgColor: string }> = {
  jamming: {
    icon: Radio,
    color: "text-warning-amber",
    bgColor: "bg-warning-amber/10",
  },
  spoofing: {
    icon: Zap,
    color: "text-data-purple",
    bgColor: "bg-data-purple/10",
  },
  intrusion: {
    icon: AlertTriangle,
    color: "text-threat-red",
    bgColor: "bg-threat-red/10",
  },
  resolved: {
    icon: Shield,
    color: "text-secure-green",
    bgColor: "bg-secure-green/10",
  },
};

const severityStyles = {
  low: "border-l-secure-green",
  medium: "border-l-warning-amber",
  high: "border-l-threat-red",
  critical: "border-l-threat-red glow-threat",
};

export function ThreatTimeline() {
  return (
    <div className="cyber-card h-full rounded-xl border border-border p-3">
      {/* Header */}
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Clock className="h-5 w-5 text-primary" />
          <h3 className="font-orbitron text-sm font-semibold uppercase tracking-wider">
            Timeline des Événements
          </h3>
        </div>
        <span className="rounded-full bg-threat-red/10 px-2 py-0.5 text-xs font-medium text-threat-red">
          2 actifs
        </span>
      </div>

      {/* Timeline - Reduced spacing */}
      <div className="relative space-y-2">
        {/* Vertical line */}
        <div className="absolute bottom-0 left-4 top-0 w-px bg-border" />

        {mockEvents.map((event, index) => {
          const config = typeConfig[event.type];
          const Icon = config.icon;

          return (
            <div
              key={event.id}
              className={cn(
                "relative rounded-lg border-l-2 bg-secondary/30 p-2 pl-10 transition-all hover:bg-secondary/50",
                severityStyles[event.severity]
              )}
            >
              {/* Icon */}
              <div
                className={cn(
                  "absolute left-1.5 top-2 flex h-6 w-6 items-center justify-center rounded-full",
                  config.bgColor
                )}
              >
                <Icon className={cn("h-3.5 w-3.5", config.color)} />
              </div>

              {/* Content */}
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <h4 className="text-sm font-semibold text-foreground">
                      {event.title}
                    </h4>
                    {event.severity === "critical" && (
                      <span className="rounded bg-threat-red px-1.5 py-0.5 text-[10px] font-bold uppercase text-white">
                        Critique
                      </span>
                    )}
                  </div>
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    {event.description}
                  </p>
                  {event.target && (
                    <span className="mt-1 inline-block rounded bg-secondary px-1.5 py-0.5 font-mono text-[10px] text-primary">
                      {event.target}
                    </span>
                  )}
                </div>
                <span className="flex-shrink-0 text-[10px] text-muted-foreground">
                  {event.timestamp}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* View all link */}
      <button className="mt-3 w-full rounded-lg border border-border bg-secondary/30 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground">
        Voir tous les événements →
      </button>
    </div>
  );
}