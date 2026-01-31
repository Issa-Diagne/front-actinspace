import { MainLayout } from "@/components/layout/MainLayout";
import { useAuth } from "@/contexts/AuthContext";
import { useAutonomousDefense } from "@/hooks/useAutonomousDefense";
import { cn } from "@/lib/utils";
import {
  Cpu,
  Shield,
  AlertTriangle,
  TrendingUp,
  Zap,
  CheckCircle,
  XCircle,
  Clock,
  Settings,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";

export default function AutonomousDefensePage() {
  const { hasPermission } = useAuth();
  const defense = useAutonomousDefense();

  // Check permissions
  if (!hasPermission('operator')) {
    return (
      <MainLayout
        title="Défense Autonome IA"
        subtitle="Système de réponse automatique aux menaces"
      >
        <div className="flex h-96 items-center justify-center">
          <div className="text-center">
            <AlertTriangle className="mx-auto h-12 w-12 text-warning-amber" />
            <h3 className="mt-4 text-lg font-semibold">Accès restreint</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Seuls les opérateurs et administrateurs peuvent accéder au système de défense autonome.
            </p>
          </div>
        </div>
      </MainLayout>
    );
  }

  const recentAnalyses = defense.analyses.slice(0, 5);
  const recentActions = defense.actions.slice(0, 5);

  return (
    <MainLayout
      title="Défense Autonome IA"
      subtitle="Système de réponse automatique aux menaces"
    >
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main content */}
        <div className="lg:col-span-2 space-y-6">
          {/* System Status */}
          <div className="cyber-card rounded-xl border border-border p-6">
            <div className="mb-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Cpu className="h-5 w-5 text-primary" />
                <h3 className="font-orbitron text-sm font-semibold uppercase tracking-wider">
                  État du Système IA
                </h3>
              </div>
              <div className="flex items-center gap-3">
                <span
                  className={cn(
                    "rounded-full px-3 py-1 text-xs font-medium",
                    defense.isEnabled
                      ? "bg-secure-green/10 text-secure-green"
                      : "bg-muted text-muted-foreground"
                  )}
                >
                  {defense.isEnabled ? "ACTIF" : "INACTIF"}
                </span>
                <Switch
                  checked={defense.isEnabled}
                  onCheckedChange={defense.setIsEnabled}
                  disabled={!hasPermission('admin')}
                />
              </div>
            </div>

            {defense.isEnabled && (
              <>
                <p className="mb-4 text-sm text-muted-foreground">
                  Le système IA analyse automatiquement toutes les menaces détectées et déclenche
                  des réponses autonomes lorsque le niveau de confiance dépasse le seuil configuré.
                </p>

                <div className="space-y-4">
                  <div>
                    <div className="mb-2 flex items-center justify-between">
                      <Label>Seuil de confiance: {(defense.confidenceThreshold * 100).toFixed(0)}%</Label>
                      {hasPermission('admin') && (
                        <Button variant="ghost" size="sm" className="h-7 text-xs">
                          <Settings className="mr-1 h-3 w-3" />
                          Ajuster
                        </Button>
                      )}
                    </div>
                    <Slider
                      value={[defense.confidenceThreshold * 100]}
                      onValueChange={([value]) => defense.setConfidenceThreshold(value / 100)}
                      max={100}
                      min={50}
                      step={5}
                      disabled={!hasPermission('admin')}
                      className="w-full"
                    />
                    <p className="mt-1 text-xs text-muted-foreground">
                      Les menaces avec un score de confiance supérieur à ce seuil déclencheront une réponse automatique
                    </p>
                  </div>
                </div>
              </>
            )}

            {!defense.isEnabled && (
              <div className="rounded-lg border border-warning-amber/30 bg-warning-amber/5 p-4">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="h-5 w-5 text-warning-amber" />
                  <div>
                    <p className="text-sm font-medium text-warning-amber">
                      Système désactivé
                    </p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      La défense autonome est actuellement désactivée. Les menaces nécessiteront une intervention manuelle.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Metrics */}
          <div className="grid gap-4 sm:grid-cols-4">
            <div className="cyber-card rounded-xl border border-border p-4">
              <span className="text-xs text-muted-foreground">Menaces analysées</span>
              <div className="mt-1 flex items-baseline gap-2">
                <span className="font-orbitron text-2xl font-bold text-foreground">
                  {defense.metrics.totalThreatsAnalyzed}
                </span>
              </div>
            </div>

            <div className="cyber-card rounded-xl border border-border p-4">
              <span className="text-xs text-muted-foreground">Actions réussies</span>
              <div className="mt-1 flex items-baseline gap-2">
                <span className="font-orbitron text-2xl font-bold text-secure-green">
                  {defense.metrics.successfulActions}
                </span>
              </div>
            </div>

            <div className="cyber-card rounded-xl border border-border p-4">
              <span className="text-xs text-muted-foreground">Confiance moy.</span>
              <div className="mt-1 flex items-baseline gap-2">
                <span className="font-orbitron text-2xl font-bold text-primary">
                  {(defense.metrics.averageConfidence * 100).toFixed(0)}%
                </span>
              </div>
            </div>

            <div className="cyber-card rounded-xl border border-border p-4">
              <span className="text-xs text-muted-foreground">Temps réponse</span>
              <div className="mt-1 flex items-baseline gap-2">
                <span className="font-orbitron text-2xl font-bold text-foreground">
                  {defense.metrics.averageResponseTime.toFixed(1)}s
                </span>
              </div>
            </div>
          </div>

          {/* Recent Analyses */}
          <div className="cyber-card rounded-xl border border-border p-4">
            <div className="mb-4 flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-primary" />
              <h3 className="font-orbitron text-sm font-semibold uppercase tracking-wider">
                Analyses Récentes
              </h3>
            </div>

            {recentAnalyses.length === 0 ? (
              <div className="rounded-lg bg-secondary/30 p-8 text-center">
                <Shield className="mx-auto h-8 w-8 text-muted-foreground" />
                <p className="mt-2 text-sm text-muted-foreground">
                  Aucune analyse récente
                </p>
              </div>
            ) : (
              <div className="space-y-2">
                {recentAnalyses.map((analysis) => (
                  <div
                    key={analysis.id}
                    className="flex items-center justify-between rounded-lg border border-border bg-secondary/30 p-3"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={cn(
                          "flex h-8 w-8 items-center justify-center rounded-lg",
                          analysis.confidence >= 0.9
                            ? "bg-secure-green/10"
                            : analysis.confidence >= 0.7
                            ? "bg-primary/10"
                            : "bg-warning-amber/10"
                        )}
                      >
                        <Cpu
                          className={cn(
                            "h-4 w-4",
                            analysis.confidence >= 0.9
                              ? "text-secure-green"
                              : analysis.confidence >= 0.7
                              ? "text-primary"
                              : "text-warning-amber"
                          )}
                        />
                      </div>
                      <div>
                        <span className="text-sm font-medium text-foreground">
                          {analysis.type} - {analysis.target}
                        </span>
                        <p className="text-xs text-muted-foreground">
                          {analysis.recommendedAction}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center gap-1">
                        <span className="font-mono text-sm font-semibold text-primary">
                          {(analysis.confidence * 100).toFixed(1)}%
                        </span>
                      </div>
                      {analysis.autoResponse && (
                        <span className="mt-0.5 inline-block rounded bg-secure-green/10 px-1.5 py-0.5 text-[10px] font-medium text-secure-green">
                          Auto
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Recent Actions */}
          <div className="cyber-card rounded-xl border border-border p-4">
            <div className="mb-4 flex items-center gap-2">
              <Zap className="h-5 w-5 text-warning-amber" />
              <h3 className="font-orbitron text-sm font-semibold uppercase tracking-wider">
                Actions Automatiques
              </h3>
            </div>

            {recentActions.length === 0 ? (
              <div className="rounded-lg bg-secondary/30 p-8 text-center">
                <Zap className="mx-auto h-8 w-8 text-muted-foreground" />
                <p className="mt-2 text-sm text-muted-foreground">
                  Aucune action automatique
                </p>
              </div>
            ) : (
              <div className="space-y-2">
                {recentActions.map((action) => {
                  const statusIcons = {
                    pending: <Clock className="h-4 w-4 text-muted-foreground" />,
                    in_progress: <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />,
                    completed: <CheckCircle className="h-4 w-4 text-secure-green" />,
                    failed: <XCircle className="h-4 w-4 text-threat-red" />,
                  };

                  return (
                    <div
                      key={action.id}
                      className={cn(
                        "flex items-center justify-between rounded-lg border border-border bg-secondary/30 p-3",
                        action.status === 'failed' && "border-threat-red/50"
                      )}
                    >
                      <div className="flex items-center gap-3">
                        {statusIcons[action.status]}
                        <div>
                          <span className="text-sm font-medium text-foreground">
                            {action.action}
                          </span>
                          <p className="text-xs text-muted-foreground">
                            {action.result || 'En cours...'}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <span
                          className={cn(
                            "rounded px-1.5 py-0.5 text-[10px] font-medium",
                            action.status === "completed" && "bg-secure-green/10 text-secure-green",
                            action.status === "in_progress" && "bg-primary/10 text-primary",
                            action.status === "pending" && "bg-muted text-muted-foreground",
                            action.status === "failed" && "bg-threat-red/10 text-threat-red"
                          )}
                        >
                          {action.status === "completed" && "Terminé"}
                          {action.status === "in_progress" && "En cours"}
                          {action.status === "pending" && "En attente"}
                          {action.status === "failed" && "Échec"}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Success Rate */}
          <div className="cyber-card rounded-xl border border-border p-4">
            <h3 className="mb-4 font-orbitron text-sm font-semibold uppercase tracking-wider">
              Taux de Réussite
            </h3>
            <div className="relative">
              <svg className="h-32 w-32 mx-auto -rotate-90 transform">
                <circle
                  cx="64"
                  cy="64"
                  r="56"
                  fill="none"
                  stroke="hsl(var(--muted))"
                  strokeWidth="8"
                />
                <circle
                  cx="64"
                  cy="64"
                  r="56"
                  fill="none"
                  stroke="url(#successGradient)"
                  strokeWidth="8"
                  strokeLinecap="round"
                  strokeDasharray={`${
                    ((defense.metrics.successfulActions /
                      (defense.metrics.successfulActions + defense.metrics.failedActions || 1)) *
                      352) || 0
                  } 352`}
                  className="transition-all duration-1000"
                />
                <defs>
                  <linearGradient id="successGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="hsl(var(--secure-green))" />
                    <stop offset="100%" stopColor="hsl(var(--cyber-cyan))" />
                  </linearGradient>
                </defs>
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="font-orbitron text-3xl font-bold text-foreground">
                  {defense.metrics.successfulActions + defense.metrics.failedActions > 0
                    ? Math.round(
                        (defense.metrics.successfulActions /
                          (defense.metrics.successfulActions + defense.metrics.failedActions)) *
                          100
                      )
                    : 0}
                  %
                </span>
                <span className="text-xs text-muted-foreground">Succès</span>
              </div>
            </div>
          </div>

          {/* AI Features */}
          <div className="cyber-card rounded-xl border border-border p-4">
            <h3 className="mb-4 font-orbitron text-sm font-semibold uppercase tracking-wider">
              Capacités IA
            </h3>
            <div className="space-y-2">
              <div className="flex items-center gap-2 rounded-lg bg-primary/10 px-3 py-2">
                <Cpu className="h-4 w-4 text-primary" />
                <span className="text-xs font-medium text-primary">Analyse comportementale</span>
              </div>
              <div className="flex items-center gap-2 rounded-lg bg-primary/10 px-3 py-2">
                <Shield className="h-4 w-4 text-primary" />
                <span className="text-xs font-medium text-primary">Détection anomalies</span>
              </div>
              <div className="flex items-center gap-2 rounded-lg bg-primary/10 px-3 py-2">
                <Zap className="h-4 w-4 text-primary" />
                <span className="text-xs font-medium text-primary">Réponse prédictive</span>
              </div>
              <div className="flex items-center gap-2 rounded-lg bg-primary/10 px-3 py-2">
                <TrendingUp className="h-4 w-4 text-primary" />
                <span className="text-xs font-medium text-primary">Apprentissage continu</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}