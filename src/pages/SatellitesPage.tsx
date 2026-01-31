import { MainLayout } from "@/components/layout/MainLayout";
import { SatelliteMap } from "@/components/dashboard/SatelliteMap";
import { useSatellites } from "@/hooks/useSatellites";
import { cn } from "@/lib/utils";
import { Satellite, Signal, Activity, Settings, RefreshCw, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";

const statusConfig = {
  online: { color: "text-secure-green", bg: "bg-secure-green/10", label: "En ligne" },
  warning: { color: "text-warning-amber", bg: "bg-warning-amber/10", label: "Alerte" },
  critical: { color: "text-threat-red", bg: "bg-threat-red/10", label: "Critique" },
  offline: { color: "text-muted-foreground", bg: "bg-muted/10", label: "Hors ligne" },
};

const SatellitesPage = () => {
  const { satellites, constellationStatus, isLoading, error, getConstellationStats, refreshData } = useSatellites();
  const stats = getConstellationStats();

  return (
    <MainLayout
      title="Constellation Satellite"
      subtitle="Gestion et monitoring des actifs spatiaux"
    >
      {/* Header Stats */}
      <div className="mb-6 grid gap-4 sm:grid-cols-4">
        <div className="cyber-card rounded-xl border border-border p-4">
          <span className="text-xs text-muted-foreground">Total Satellites</span>
          <div className="mt-1 flex items-baseline gap-2">
            <span className="font-orbitron text-2xl font-bold text-foreground">
              {stats.total}
            </span>
          </div>
        </div>

        <div className="cyber-card rounded-xl border border-border p-4">
          <span className="text-xs text-muted-foreground">En ligne</span>
          <div className="mt-1 flex items-baseline gap-2">
            <span className="font-orbitron text-2xl font-bold text-secure-green">
              {stats.online}
            </span>
          </div>
        </div>

        <div className="cyber-card rounded-xl border border-border p-4">
          <span className="text-xs text-muted-foreground">Alertes</span>
          <div className="mt-1 flex items-baseline gap-2">
            <span className="font-orbitron text-2xl font-bold text-warning-amber">
              {stats.warning}
            </span>
          </div>
        </div>

        <div className="cyber-card rounded-xl border border-border p-4">
          <span className="text-xs text-muted-foreground">Critiques</span>
          <div className="mt-1 flex items-baseline gap-2">
            <span className="font-orbitron text-2xl font-bold text-threat-red">
              {stats.critical}
            </span>
          </div>
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <div className="mb-6 rounded-lg border border-threat-red/30 bg-threat-red/5 p-4">
          <div className="flex items-start gap-3">
            <AlertTriangle className="h-5 w-5 text-threat-red" />
            <div>
              <p className="text-sm font-medium text-threat-red">
                Erreur de connexion au backend
              </p>
              <p className="mt-1 text-xs text-muted-foreground">
                {error}
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Satellite list */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-orbitron text-lg font-semibold">
              Satellites Actifs {isLoading && <RefreshCw className="inline-block ml-2 h-4 w-4 animate-spin" />}
            </h2>
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                size="sm" 
                className="gap-2"
                onClick={refreshData}
                disabled={isLoading}
              >
                <RefreshCw className={cn("h-4 w-4", isLoading && "animate-spin")} />
                Actualiser
              </Button>
              <Button variant="outline" size="sm" className="gap-2">
                <Settings className="h-4 w-4" />
                Configuration
              </Button>
            </div>
          </div>

          {satellites.length === 0 && !isLoading ? (
            <div className="cyber-card rounded-xl border border-border p-8 text-center">
              <Satellite className="mx-auto h-12 w-12 text-muted-foreground" />
              <p className="mt-4 text-sm text-muted-foreground">
                Aucun satellite disponible
              </p>
              <p className="mt-2 text-xs text-muted-foreground">
                Assurez-vous que le backend est en cours d'exécution
              </p>
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2">
              {satellites.map((sat) => {
                const config = statusConfig[sat.status];
                return (
                  <div
                    key={sat.id}
                    className={cn(
                      "cyber-card rounded-xl border p-4 transition-all hover:border-primary/30",
                      sat.status === "critical" && "border-threat-red/50"
                    )}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex gap-3">
                        <div className={cn("flex h-10 w-10 items-center justify-center rounded-lg", config.bg)}>
                          <Satellite className={cn("h-5 w-5", config.color)} />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-sm font-semibold text-foreground">
                              {sat.name}
                            </span>
                            <span
                              className={cn(
                                "rounded px-1.5 py-0.5 text-[10px] font-medium",
                                config.bg,
                                config.color
                              )}
                            >
                              {config.label}
                            </span>
                          </div>
                          <span className="text-xs text-muted-foreground">{sat.id}</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="flex items-center gap-1">
                          <Signal className={cn("h-3 w-3", config.color)} />
                          <span className={cn("font-mono text-sm", config.color)}>
                            {sat.signal}%
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Telemetry Data */}
                    <div className="mt-3 grid grid-cols-3 gap-2 text-xs">
                      <div className="rounded bg-secondary/50 p-2 text-center">
                        <span className="text-muted-foreground">Orbite</span>
                        <p className="font-mono text-foreground">{sat.orbit}</p>
                      </div>
                      <div className="rounded bg-secondary/50 p-2 text-center">
                        <span className="text-muted-foreground">Altitude</span>
                        <p className="font-mono text-foreground">{sat.altitude}</p>
                      </div>
                      <div className="rounded bg-secondary/50 p-2 text-center">
                        <span className="text-muted-foreground">Vitesse</span>
                        <p className="font-mono text-foreground">{sat.velocity}</p>
                      </div>
                    </div>

                    {/* CPU & Memory */}
                    <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-muted-foreground">CPU</span>
                          <span className="font-mono text-foreground">
                            {sat.telemetry.cpu_usage.toFixed(1)}%
                          </span>
                        </div>
                        <div className="data-bar">
                          <div
                            className={cn(
                              "data-bar-fill",
                              sat.telemetry.cpu_usage > 80
                                ? "data-bar-fill-red"
                                : sat.telemetry.cpu_usage > 60
                                ? "data-bar-fill-amber"
                                : "data-bar-fill-green"
                            )}
                            style={{ width: `${sat.telemetry.cpu_usage}%` }}
                          />
                        </div>
                      </div>
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-muted-foreground">Mémoire</span>
                          <span className="font-mono text-foreground">
                            {sat.telemetry.memory_usage.toFixed(1)}%
                          </span>
                        </div>
                        <div className="data-bar">
                          <div
                            className={cn(
                              "data-bar-fill",
                              sat.telemetry.memory_usage > 80
                                ? "data-bar-fill-red"
                                : sat.telemetry.memory_usage > 60
                                ? "data-bar-fill-amber"
                                : "data-bar-fill-green"
                            )}
                            style={{ width: `${sat.telemetry.memory_usage}%` }}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Temperature */}
                    <div className="mt-2 flex items-center justify-between text-xs">
                      <span className="text-muted-foreground">Température</span>
                      <span className={cn(
                        "font-mono",
                        sat.telemetry.temperature > 50 ? "text-threat-red" :
                        sat.telemetry.temperature > 40 ? "text-warning-amber" :
                        "text-foreground"
                      )}>
                        {sat.telemetry.temperature.toFixed(1)}°C
                      </span>
                    </div>

                    {/* Signal bar */}
                    <div className="mt-3">
                      <div className="data-bar">
                        <div
                          className={cn(
                            "data-bar-fill",
                            sat.signal > 80
                              ? "data-bar-fill-green"
                              : sat.signal > 50
                              ? "data-bar-fill-amber"
                              : "data-bar-fill-red"
                          )}
                          style={{ width: `${sat.signal}%` }}
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Map */}
        <div className="space-y-4">
          <SatelliteMap />
          
          {/* Constellation Status */}
          {constellationStatus && (
            <div className="cyber-card rounded-xl border border-border p-4">
              <h3 className="mb-4 font-orbitron text-sm font-semibold uppercase tracking-wider">
                État Constellation
              </h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">Total</span>
                  <span className="font-mono text-sm font-semibold text-foreground">
                    {constellationStatus.total_satellites}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">Opérationnels</span>
                  <span className="font-mono text-sm font-semibold text-secure-green">
                    {constellationStatus.operational}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">Sous attaque</span>
                  <span className="font-mono text-sm font-semibold text-threat-red">
                    {constellationStatus.under_attack}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Average Stats */}
          <div className="cyber-card rounded-xl border border-border p-4">
            <h3 className="mb-4 font-orbitron text-sm font-semibold uppercase tracking-wider">
              Moyennes Constellation
            </h3>
            <div className="space-y-3">
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs text-muted-foreground">Signal moyen</span>
                  <span className="font-mono text-sm font-semibold text-foreground">
                    {stats.avgSignal}%
                  </span>
                </div>
                <div className="data-bar">
                  <div
                    className="data-bar-fill data-bar-fill-green"
                    style={{ width: `${stats.avgSignal}%` }}
                  />
                </div>
              </div>
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs text-muted-foreground">CPU moyen</span>
                  <span className="font-mono text-sm font-semibold text-foreground">
                    {stats.avgCPU}%
                  </span>
                </div>
                <div className="data-bar">
                  <div
                    className={cn(
                      "data-bar-fill",
                      stats.avgCPU > 80 ? "data-bar-fill-red" :
                      stats.avgCPU > 60 ? "data-bar-fill-amber" :
                      "data-bar-fill-green"
                    )}
                    style={{ width: `${stats.avgCPU}%` }}
                  />
                </div>
              </div>
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs text-muted-foreground">Mémoire moyenne</span>
                  <span className="font-mono text-sm font-semibold text-foreground">
                    {stats.avgMemory}%
                  </span>
                </div>
                <div className="data-bar">
                  <div
                    className={cn(
                      "data-bar-fill",
                      stats.avgMemory > 80 ? "data-bar-fill-red" :
                      stats.avgMemory > 60 ? "data-bar-fill-amber" :
                      "data-bar-fill-green"
                    )}
                    style={{ width: `${stats.avgMemory}%` }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default SatellitesPage;