import { useState } from "react";
import { cn } from "@/lib/utils";
import { Play, Pause, RotateCcw, Zap, Radio, AlertTriangle, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";

type AttackType = "jamming" | "spoofing" | "intrusion";
type SimulationState = "idle" | "running" | "completed";

interface SimulationResult {
  withProtection: {
    detected: boolean;
    responseTime: number;
    serviceRestored: boolean;
    dataLoss: number;
  };
  withoutProtection: {
    detected: boolean;
    responseTime: number;
    serviceRestored: boolean;
    dataLoss: number;
  };
}

const attackTypes: { type: AttackType; label: string; icon: typeof Zap; description: string }[] = [
  { type: "jamming", label: "Brouillage RF", icon: Radio, description: "Interférence sur les fréquences de communication" },
  { type: "spoofing", label: "Spoofing GPS", icon: Zap, description: "Falsification des signaux de positionnement" },
  { type: "intrusion", label: "Intrusion TTC", icon: AlertTriangle, description: "Accès non autorisé au système de commande" },
];

export function SimulationPanel() {
  const [selectedAttack, setSelectedAttack] = useState<AttackType>("jamming");
  const [state, setState] = useState<SimulationState>("idle");
  const [progress, setProgress] = useState(0);
  const [results, setResults] = useState<SimulationResult | null>(null);

  const runSimulation = () => {
    setState("running");
    setProgress(0);
    setResults(null);

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setState("completed");
          setResults({
            withProtection: {
              detected: true,
              responseTime: 0.3,
              serviceRestored: true,
              dataLoss: 0,
            },
            withoutProtection: {
              detected: false,
              responseTime: 45,
              serviceRestored: false,
              dataLoss: 78,
            },
          });
          return 100;
        }
        return prev + 2;
      });
    }, 50);
  };

  const reset = () => {
    setState("idle");
    setProgress(0);
    setResults(null);
  };

  return (
    <div className="cyber-card rounded-xl border border-border p-3">
      {/* Header */}
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Zap className="h-5 w-5 text-warning-amber" />
          <h3 className="font-orbitron text-sm font-semibold uppercase tracking-wider">
            Simulation d'Attaque
          </h3>
        </div>
        <span
          className={cn(
            "rounded-full px-2 py-0.5 text-xs font-medium",
            state === "idle" && "bg-muted text-muted-foreground",
            state === "running" && "bg-warning-amber/10 text-warning-amber",
            state === "completed" && "bg-secure-green/10 text-secure-green"
          )}
        >
          {state === "idle" && "Prêt"}
          {state === "running" && "En cours..."}
          {state === "completed" && "Terminé"}
        </span>
      </div>

      {/* Attack type selection - More compact */}
      <div className="mb-3 space-y-1.5">
        <span className="text-xs text-muted-foreground">Type d'attaque :</span>
        <div className="grid grid-cols-3 gap-1.5">
          {attackTypes.map(({ type, label, icon: Icon }) => (
            <button
              key={type}
              onClick={() => state === "idle" && setSelectedAttack(type)}
              disabled={state !== "idle"}
              className={cn(
                "flex flex-col items-center gap-1 rounded-lg border p-2 transition-all",
                selectedAttack === type
                  ? "border-warning-amber bg-warning-amber/10"
                  : "border-border bg-secondary/30 hover:border-muted-foreground",
                state !== "idle" && "cursor-not-allowed opacity-50"
              )}
            >
              <Icon
                className={cn(
                  "h-4 w-4",
                  selectedAttack === type ? "text-warning-amber" : "text-muted-foreground"
                )}
              />
              <span
                className={cn(
                  "text-[10px] font-medium",
                  selectedAttack === type ? "text-warning-amber" : "text-muted-foreground"
                )}
              >
                {label}
              </span>
            </button>
          ))}
        </div>
        <p className="text-[10px] text-muted-foreground">
          {attackTypes.find((a) => a.type === selectedAttack)?.description}
        </p>
      </div>

      {/* Progress bar */}
      {state !== "idle" && (
        <div className="mb-3">
          <div className="mb-1 flex justify-between text-xs">
            <span className="text-muted-foreground">Progression</span>
            <span className="text-foreground">{progress}%</span>
          </div>
          <div className="h-1.5 overflow-hidden rounded-full bg-muted">
            <div
              className={cn(
                "h-full rounded-full transition-all duration-300",
                state === "running"
                  ? "bg-gradient-to-r from-warning-amber to-threat-red"
                  : "bg-gradient-to-r from-secure-green to-cyber-cyan"
              )}
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      )}

      {/* Results comparison - More compact */}
      {results && (
        <div className="mb-3 grid grid-cols-2 gap-2">
          {/* Without SDRIC */}
          <div className="rounded-lg border border-threat-red/50 bg-threat-red/5 p-2">
            <div className="mb-1.5 flex items-center gap-1">
              <AlertTriangle className="h-3 w-3 text-threat-red" />
              <span className="text-[10px] font-semibold text-threat-red">Sans SDRIC</span>
            </div>
            <div className="space-y-1 text-[10px]">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Détection</span>
                <span className="text-threat-red">✗ Non</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Temps rép.</span>
                <span className="text-threat-red">{results.withoutProtection.responseTime}s</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Service</span>
                <span className="text-threat-red">Interrompu</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Perte</span>
                <span className="text-threat-red">{results.withoutProtection.dataLoss}%</span>
              </div>
            </div>
          </div>

          {/* With SDRIC */}
          <div className="rounded-lg border border-secure-green/50 bg-secure-green/5 p-2">
            <div className="mb-1.5 flex items-center gap-1">
              <Shield className="h-3 w-3 text-secure-green" />
              <span className="text-[10px] font-semibold text-secure-green">Avec SDRIC</span>
            </div>
            <div className="space-y-1 text-[10px]">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Détection</span>
                <span className="text-secure-green">✓ Oui</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Temps rép.</span>
                <span className="text-secure-green">{results.withProtection.responseTime}s</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Service</span>
                <span className="text-secure-green">Maintenu</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Perte</span>
                <span className="text-secure-green">{results.withProtection.dataLoss}%</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Action buttons */}
      <div className="flex gap-2">
        {state === "idle" && (
          <Button
            onClick={runSimulation}
            className="flex-1 gap-2 bg-gradient-to-r from-warning-amber to-threat-red text-white hover:opacity-90 h-8 text-xs"
          >
            <Play className="h-3 w-3" />
            Lancer
          </Button>
        )}
        {state === "running" && (
          <Button
            disabled
            className="flex-1 gap-2 bg-warning-amber/20 text-warning-amber h-8 text-xs"
          >
            <Pause className="h-3 w-3 animate-pulse" />
            En cours...
          </Button>
        )}
        {state === "completed" && (
          <>
            <Button
              onClick={reset}
              variant="outline"
              className="flex-1 gap-2 h-8 text-xs"
            >
              <RotateCcw className="h-3 w-3" />
              Nouvelle
            </Button>
            <Button
              variant="outline"
              className="gap-2 border-primary text-primary hover:bg-primary/10 h-8 text-xs"
            >
              Export
            </Button>
          </>
        )}
      </div>
    </div>
  );
}