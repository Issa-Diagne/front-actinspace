import { MainLayout } from "@/components/layout/MainLayout";
import { ThreatTimeline } from "@/components/dashboard/ThreatTimeline";
import { cn } from "@/lib/utils";
import { AlertTriangle, Shield, Radio, Zap, Filter, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const threatStats = [
  { label: "Total détectées", value: 47, period: "30 jours" },
  { label: "Neutralisées", value: 45, period: "95.7%" },
  { label: "En cours", value: 2, period: "analyse" },
  { label: "Temps réponse moy.", value: "0.4s", period: "optimal" },
];

const activeThreats = [
  {
    id: "THR-001",
    type: "jamming",
    severity: "high",
    target: "GALILEO-E14",
    description: "Interférence RF détectée sur le canal L-Band. Source identifiée à 34.5°N, 28.3°E.",
    detectedAt: "14:23:45",
    status: "analyzing",
  },
  {
    id: "THR-002",
    type: "intrusion",
    severity: "critical",
    target: "COSMO-SKY-4",
    description: "Tentative d'accès non autorisé au système TTC. Origine: réseau compromis.",
    detectedAt: "14:15:22",
    status: "mitigating",
  },
];

const severityColors = {
  low: "bg-secure-green/10 text-secure-green border-secure-green/30",
  medium: "bg-warning-amber/10 text-warning-amber border-warning-amber/30",
  high: "bg-threat-red/10 text-threat-red border-threat-red/30",
  critical: "bg-threat-red text-white border-threat-red glow-threat",
};

const ThreatsPage = () => {
  return (
    <MainLayout
      title="Détection des Menaces"
      subtitle="Analyse et réponse aux cyberattaques"
    >
      {/* Stats */}
      <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {threatStats.map((stat, i) => (
          <div key={i} className="cyber-card rounded-xl border border-border p-4">
            <span className="text-xs text-muted-foreground">{stat.label}</span>
            <div className="mt-1 flex items-baseline gap-2">
              <span className="font-orbitron text-2xl font-bold text-foreground">
                {stat.value}
              </span>
              <span className="text-xs text-muted-foreground">{stat.period}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="mb-6 flex flex-wrap items-center gap-4">
        <div className="relative flex-1 min-w-64">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Rechercher une menace..."
            className="bg-secondary/50 pl-10 font-mono"
          />
        </div>
        <Button variant="outline" className="gap-2">
          <Filter className="h-4 w-4" />
          Filtrer
        </Button>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Active Threats */}
        <div className="lg:col-span-2 space-y-4">
          <h2 className="font-orbitron text-lg font-semibold">Menaces Actives</h2>
          {activeThreats.map((threat) => (
            <div
              key={threat.id}
              className={cn(
                "cyber-card rounded-xl border p-4",
                threat.severity === "critical" && "border-threat-red/50"
              )}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex gap-3">
                  <div
                    className={cn(
                      "flex h-10 w-10 items-center justify-center rounded-lg",
                      threat.type === "jamming" && "bg-warning-amber/10",
                      threat.type === "intrusion" && "bg-threat-red/10",
                      threat.type === "spoofing" && "bg-data-purple/10"
                    )}
                  >
                    {threat.type === "jamming" && (
                      <Radio className="h-5 w-5 text-warning-amber" />
                    )}
                    {threat.type === "intrusion" && (
                      <AlertTriangle className="h-5 w-5 text-threat-red" />
                    )}
                    {threat.type === "spoofing" && (
                      <Zap className="h-5 w-5 text-data-purple" />
                    )}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-sm font-semibold text-foreground">
                        {threat.id}
                      </span>
                      <span
                        className={cn(
                          "rounded border px-1.5 py-0.5 text-[10px] font-medium uppercase",
                          severityColors[threat.severity as keyof typeof severityColors]
                        )}
                      >
                        {threat.severity}
                      </span>
                    </div>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {threat.description}
                    </p>
                    <div className="mt-2 flex items-center gap-4 text-xs">
                      <span className="text-muted-foreground">
                        Cible:{" "}
                        <span className="font-mono text-primary">{threat.target}</span>
                      </span>
                      <span className="text-muted-foreground">
                        Détecté: {threat.detectedAt}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <span
                    className={cn(
                      "rounded-full px-2 py-0.5 text-xs font-medium",
                      threat.status === "analyzing" && "bg-warning-amber/10 text-warning-amber",
                      threat.status === "mitigating" && "bg-primary/10 text-primary"
                    )}
                  >
                    {threat.status === "analyzing" && "Analyse..."}
                    {threat.status === "mitigating" && "Mitigation"}
                  </span>
                  <Button variant="outline" size="sm" className="h-7 text-xs">
                    Détails
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Timeline */}
        <div>
          <ThreatTimeline />
        </div>
      </div>
    </MainLayout>
  );
};

export default ThreatsPage;
