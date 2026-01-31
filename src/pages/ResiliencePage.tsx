import { MainLayout } from "@/components/layout/MainLayout";
import { SecurityMetrics } from "@/components/dashboard/SecurityMetrics";
import { cn } from "@/lib/utils";
import { Shield, Zap, Lock, RefreshCw, CheckCircle, XCircle, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";

const resilienceActions = [
  { id: 1, action: "Changement de fréquence", target: "GALILEO-E14", status: "completed", time: "14:24:12" },
  { id: 2, action: "Chiffrement renforcé", target: "COSMO-SKY-4", status: "in_progress", time: "14:23:45" },
  { id: 3, action: "Isolation du composant", target: "CH-5 Emergency", status: "pending", time: "14:23:00" },
  { id: 4, action: "Redirection backup", target: "SENTINEL-1A", status: "completed", time: "14:15:30" },
];

const defenseCapabilities = [
  { name: "Changement fréquence auto", enabled: true, description: "Basculement automatique en cas de brouillage" },
  { name: "Chiffrement adaptatif", enabled: true, description: "Renforcement du chiffrement sous attaque" },
  { name: "Isolation composants", enabled: true, description: "Quarantaine des systèmes compromis" },
  { name: "Redirection backup", enabled: true, description: "Canaux de secours activés automatiquement" },
  { name: "Mode furtif", enabled: false, description: "Réduction de la signature électromagnétique" },
  { name: "Contre-mesures actives", enabled: false, description: "Réponse offensive (désactivé)" },
];

const statusIcons = {
  completed: <CheckCircle className="h-4 w-4 text-secure-green" />,
  in_progress: <RefreshCw className="h-4 w-4 text-primary animate-spin" />,
  pending: <Clock className="h-4 w-4 text-warning-amber" />,
  failed: <XCircle className="h-4 w-4 text-threat-red" />,
};

const ResiliencePage = () => {
  return (
    <MainLayout
      title="Résilience & Défense"
      subtitle="Mécanismes de protection et réponse automatique"
    >
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left column */}
        <div className="lg:col-span-2 space-y-6">
          {/* Defense Status */}
          <div className="cyber-card rounded-xl border border-border p-4">
            <div className="mb-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-primary" />
                <h3 className="font-orbitron text-sm font-semibold uppercase tracking-wider">
                  Mode de Défense
                </h3>
              </div>
              <div className="flex items-center gap-2">
                <span className="rounded-full bg-secure-green/10 px-3 py-1 text-xs font-medium text-secure-green">
                  AUTOMATIQUE
                </span>
                <Button variant="outline" size="sm" className="h-7 text-xs">
                  Configurer
                </Button>
              </div>
            </div>
            <p className="mb-4 text-sm text-muted-foreground">
              Le système est configuré pour répondre automatiquement aux menaces détectées,
              sans intervention humaine requise. Les actions sont journalisées et traçables.
            </p>

            {/* Capabilities grid */}
            <div className="grid gap-3 sm:grid-cols-2">
              {defenseCapabilities.map((cap) => (
                <div
                  key={cap.name}
                  className={cn(
                    "rounded-lg border p-3 transition-all",
                    cap.enabled
                      ? "border-secure-green/30 bg-secure-green/5"
                      : "border-border bg-secondary/30"
                  )}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {cap.enabled ? (
                        <CheckCircle className="h-4 w-4 text-secure-green" />
                      ) : (
                        <XCircle className="h-4 w-4 text-muted-foreground" />
                      )}
                      <span
                        className={cn(
                          "text-sm font-medium",
                          cap.enabled ? "text-foreground" : "text-muted-foreground"
                        )}
                      >
                        {cap.name}
                      </span>
                    </div>
                    <span
                      className={cn(
                        "text-[10px] font-medium",
                        cap.enabled ? "text-secure-green" : "text-muted-foreground"
                      )}
                    >
                      {cap.enabled ? "ACTIF" : "INACTIF"}
                    </span>
                  </div>
                  <p className="mt-1 text-xs text-muted-foreground">{cap.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Actions */}
          <div className="cyber-card rounded-xl border border-border p-4">
            <div className="mb-4 flex items-center gap-2">
              <Zap className="h-5 w-5 text-warning-amber" />
              <h3 className="font-orbitron text-sm font-semibold uppercase tracking-wider">
                Actions Récentes
              </h3>
            </div>
            <div className="space-y-2">
              {resilienceActions.map((action) => (
                <div
                  key={action.id}
                  className="flex items-center justify-between rounded-lg border border-border bg-secondary/30 p-3"
                >
                  <div className="flex items-center gap-3">
                    {statusIcons[action.status as keyof typeof statusIcons]}
                    <div>
                      <span className="text-sm font-medium text-foreground">
                        {action.action}
                      </span>
                      <p className="text-xs text-muted-foreground">
                        Cible: <span className="font-mono text-primary">{action.target}</span>
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span
                      className={cn(
                        "rounded px-1.5 py-0.5 text-[10px] font-medium",
                        action.status === "completed" && "bg-secure-green/10 text-secure-green",
                        action.status === "in_progress" && "bg-primary/10 text-primary",
                        action.status === "pending" && "bg-warning-amber/10 text-warning-amber"
                      )}
                    >
                      {action.status === "completed" && "Terminé"}
                      {action.status === "in_progress" && "En cours"}
                      {action.status === "pending" && "En attente"}
                    </span>
                    <p className="mt-0.5 text-[10px] text-muted-foreground">{action.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right column */}
        <div className="space-y-6">
          <SecurityMetrics />

          {/* Quick Actions */}
          <div className="cyber-card rounded-xl border border-border p-4">
            <div className="mb-4 flex items-center gap-2">
              <Lock className="h-5 w-5 text-primary" />
              <h3 className="font-orbitron text-sm font-semibold uppercase tracking-wider">
                Actions Rapides
              </h3>
            </div>
            <div className="space-y-2">
              <Button className="w-full justify-start gap-2" variant="outline">
                <RefreshCw className="h-4 w-4" />
                Forcer rotation des clés
              </Button>
              <Button className="w-full justify-start gap-2" variant="outline">
                <Shield className="h-4 w-4" />
                Activer mode furtif
              </Button>
              <Button className="w-full justify-start gap-2 border-threat-red/50 text-threat-red hover:bg-threat-red/10" variant="outline">
                <Zap className="h-4 w-4" />
                Isolation d'urgence
              </Button>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default ResiliencePage;
