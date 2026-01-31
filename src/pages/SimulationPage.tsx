import { useState } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { useSatelliteSystem } from "@/contexts/SatelliteContext";
import { Zap, Skull, ShieldAlert, Activity } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const scenarios = [
  { id: "cpu_stress", name: "Surcharge CPU (Dos)", icon: Activity, desc: "Sature le processeur du satellite pour bloquer les commandes." },
  { id: "memory_leak", name: "Fuite Mémoire", icon: Zap, desc: "Injecte un processus qui consomme toute la RAM disponible." },
  { id: "jamming", name: "Brouillage RF", icon: Radio, desc: "Interférence sur les bandes de fréquence de communication." },
  { id: "auth_bruteforce", name: "Intrusion Force Brute", icon: Skull, desc: "Tentative de deviner les clés de chiffrement." },
];

const SimulationPage = () => {
  const { launchAttack, activeAttacks } = useSatelliteSystem();
  const [loading, setLoading] = useState<string | null>(null);

  const handleLaunch = async (scenarioId: string) => {
    setLoading(scenarioId);
    // On cible SAT-001 par défaut pour la démo
    await launchAttack(scenarioId, "SAT-001");
    setTimeout(() => setLoading(null), 1000);
  };

  return (
    <MainLayout
      title="Simulateur de Menaces"
      subtitle="Testez la résilience de l'IA contre des attaques cyber"
    >
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Launcher Panel */}
        <div className="lg:col-span-2 space-y-4">
          <h2 className="text-lg font-bold flex items-center gap-2">
            <ShieldAlert className="text-red-500" /> 
            Catalogue d'Attaques
          </h2>
          <div className="grid gap-4 sm:grid-cols-2">
            {scenarios.map((scenario) => (
              <div key={scenario.id} className="cyber-card p-4 border border-border rounded-xl hover:border-red-500/50 transition-colors">
                <div className="flex items-start justify-between mb-3">
                  <div className="p-2 bg-red-500/10 rounded-lg">
                    <scenario.icon className="h-6 w-6 text-red-500" />
                  </div>
                  <Button 
                    variant="destructive" 
                    size="sm"
                    disabled={loading === scenario.id}
                    onClick={() => handleLaunch(scenario.id)}
                    className="shadow-glow-red"
                  >
                    {loading === scenario.id ? "Lancement..." : "LANCER"}
                  </Button>
                </div>
                <h3 className="font-bold text-foreground">{scenario.name}</h3>
                <p className="text-sm text-muted-foreground mt-1">{scenario.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Active Simulations Panel */}
        <div className="cyber-card border border-border rounded-xl p-4 h-fit">
          <h3 className="font-orbitron font-bold mb-4 flex items-center gap-2">
            <Activity className="text-primary" />
            Simulations en cours
          </h3>
          
          <div className="space-y-3">
            {activeAttacks.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-8">
                Aucune simulation active.
              </p>
            ) : (
              activeAttacks.map((attack: any) => (
                <div key={attack.scenario_id} className="bg-background/50 p-3 rounded-lg border border-red-500/30 animate-pulse">
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-bold text-red-400 text-sm">{attack.scenario_name || attack.name}</span>
                    <span className="text-[10px] bg-red-500/20 text-red-300 px-1.5 py-0.5 rounded">ACTIVE</span>
                  </div>
                  <div className="text-xs text-muted-foreground flex justify-between">
                    <span>Cible: {attack.target_satellite}</span>
                    <span>Durée: {attack.elapsed_time}s</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

import { Radio } from "lucide-react"; // Ajout de l'import manquant
export default SimulationPage;