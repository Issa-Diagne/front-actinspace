import { MainLayout } from "@/components/layout/MainLayout";
import { SimulationPanel } from "@/components/dashboard/SimulationPanel";
import { cn } from "@/lib/utils";
import { Zap, FileText, Download, BarChart3 } from "lucide-react";
import { Button } from "@/components/ui/button";

const previousSimulations = [
  { id: "SIM-2024-047", type: "Brouillage RF", date: "29/01/2026", result: "success", duration: "2.3s" },
  { id: "SIM-2024-046", type: "Spoofing GPS", date: "28/01/2026", result: "success", duration: "1.8s" },
  { id: "SIM-2024-045", type: "Intrusion TTC", date: "27/01/2026", result: "success", duration: "3.1s" },
  { id: "SIM-2024-044", type: "Brouillage RF", date: "26/01/2026", result: "partial", duration: "5.2s" },
];

const SimulationPage = () => {
  return (
    <MainLayout
      title="Mode Simulation"
      subtitle="Test et validation des mécanismes de défense"
    >
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main simulation panel */}
        <div className="lg:col-span-2 space-y-6">
          <SimulationPanel />

          {/* Stats */}
          <div className="cyber-card rounded-xl border border-border p-4">
            <div className="mb-4 flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-primary" />
              <h3 className="font-orbitron text-sm font-semibold uppercase tracking-wider">
                Statistiques de Simulation
              </h3>
            </div>
            <div className="grid gap-4 sm:grid-cols-4">
              <div className="rounded-lg bg-secondary/50 p-3 text-center">
                <span className="font-orbitron text-2xl font-bold text-foreground">47</span>
                <p className="text-xs text-muted-foreground">Simulations totales</p>
              </div>
              <div className="rounded-lg bg-secure-green/10 p-3 text-center">
                <span className="font-orbitron text-2xl font-bold text-secure-green">98%</span>
                <p className="text-xs text-muted-foreground">Taux de succès</p>
              </div>
              <div className="rounded-lg bg-primary/10 p-3 text-center">
                <span className="font-orbitron text-2xl font-bold text-primary">0.4s</span>
                <p className="text-xs text-muted-foreground">Temps réponse moy.</p>
              </div>
              <div className="rounded-lg bg-warning-amber/10 p-3 text-center">
                <span className="font-orbitron text-2xl font-bold text-warning-amber">3</span>
                <p className="text-xs text-muted-foreground">Types d'attaques</p>
              </div>
            </div>
          </div>
        </div>

        {/* Previous simulations */}
        <div className="cyber-card rounded-xl border border-border p-4">
          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-primary" />
              <h3 className="font-orbitron text-sm font-semibold uppercase tracking-wider">
                Historique
              </h3>
            </div>
            <Button variant="ghost" size="sm" className="h-7 gap-1 text-xs">
              <Download className="h-3 w-3" />
              Export
            </Button>
          </div>
          <div className="space-y-2">
            {previousSimulations.map((sim) => (
              <div
                key={sim.id}
                className="rounded-lg border border-border bg-secondary/30 p-3 transition-all hover:border-primary/30"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <Zap className="h-3 w-3 text-warning-amber" />
                      <span className="font-mono text-xs font-medium text-foreground">
                        {sim.id}
                      </span>
                    </div>
                    <span className="text-xs text-muted-foreground">{sim.type}</span>
                  </div>
                  <div className="text-right">
                    <span
                      className={cn(
                        "rounded px-1.5 py-0.5 text-[10px] font-medium",
                        sim.result === "success" && "bg-secure-green/10 text-secure-green",
                        sim.result === "partial" && "bg-warning-amber/10 text-warning-amber"
                      )}
                    >
                      {sim.result === "success" ? "Réussi" : "Partiel"}
                    </span>
                    <p className="mt-0.5 text-[10px] text-muted-foreground">{sim.date}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default SimulationPage;
