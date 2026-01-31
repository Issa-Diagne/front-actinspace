import { useState } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { useSatelliteSystem } from "@/contexts/SatelliteContext";
import { Zap, ShieldAlert, Activity, StopCircle, Play, Lock, Database } from "lucide-react";
import { Button } from "@/components/ui/button";

// LISTE DES 4 SCÉNARIOS
const scenarios = [
  { 
    id: "cpu_stress", 
    name: "Surcharge CPU", 
    icon: Activity, 
    desc: "Sature le processeur à 99% pour bloquer les commandes." 
  },
  { 
    id: "memory_leak", 
    name: "Fuite Mémoire", 
    icon: Database, 
    desc: "Allocation mémoire exponentielle jusqu'au crash système." 
  },
  { 
    id: "jamming", 
    name: "Brouillage RF", 
    icon: ShieldAlert, 
    desc: "Interférence sur la bande L coupant la télémétrie." 
  },
  { 
    id: "auth_bruteforce", 
    name: "Force Brute", 
    icon: Lock, 
    desc: "Attaque dictionnaire sur les ports d'authentification." 
  },
];

const SimulationPage = () => {
  const { launchAttack, stopSimulation, activeAttacks } = useSatelliteSystem();
  const [loading, setLoading] = useState<string | null>(null);

  const handleLaunch = async (scenarioId: string) => {
    setLoading(scenarioId);
    await launchAttack(scenarioId, "SAT-001");
    setTimeout(() => setLoading(null), 500);
  };

  return (
    <MainLayout title="Simulateur de Menaces" subtitle="Tests de pénétration continus">
      <div className="grid gap-6 lg:grid-cols-3">
        
        {/* CATALOGUE (Gauche) */}
        <div className="lg:col-span-2 space-y-4">
          <h2 className="text-lg font-bold flex items-center gap-2">
            <Zap className="text-primary" /> Catalogue d'Attaques
          </h2>
          <div className="grid gap-4 sm:grid-cols-2">
            {scenarios.map((scenario) => (
              <div key={scenario.id} className="cyber-card p-4 border border-border rounded-xl hover:border-primary/50 transition-colors">
                <div className="flex justify-between items-start mb-3">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <scenario.icon className="h-6 w-6 text-primary" />
                  </div>
                  <Button 
                    size="sm"
                    disabled={loading === scenario.id}
                    onClick={() => handleLaunch(scenario.id)}
                    className="bg-red-600 hover:bg-red-700 text-white shadow-glow-red"
                  >
                    <Play className="h-4 w-4 mr-2" /> LANCER
                  </Button>
                </div>
                <h3 className="font-bold">{scenario.name}</h3>
                <p className="text-sm text-muted-foreground mt-1">{scenario.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* SIMULATIONS ACTIVES (Droite) */}
        <div className="cyber-card border border-red-500/30 bg-red-500/5 rounded-xl p-4 h-fit">
          <h3 className="font-bold mb-4 flex items-center gap-2 text-red-500">
            <Activity className="animate-pulse" /> 
            En cours ({activeAttacks.length})
          </h3>
          
          <div className="space-y-3">
            {activeAttacks.length === 0 ? (
              <div className="text-center py-10 border border-dashed border-border rounded-lg">
                <p className="text-sm text-muted-foreground">Aucune attaque active.</p>
                <p className="text-xs text-muted-foreground mt-1">Le système est au repos.</p>
              </div>
            ) : (
              activeAttacks.map((attack: any) => (
                <div key={attack.scenario_id} className="bg-background p-3 rounded-lg border border-red-500/50 shadow-lg animate-in slide-in-from-right-2">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-bold text-red-400">{attack.scenario_name}</span>
                    <span className="text-xs font-mono bg-red-950 text-red-200 px-1.5 py-0.5 rounded">
                      {attack.elapsed_time}s
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between mt-3">
                    <span className="text-xs text-muted-foreground flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse"/>
                      {attack.target_satellite}
                    </span>
                    
                    <Button 
                      variant="destructive" 
                      size="sm" 
                      className="h-7 px-2 text-xs"
                      onClick={() => stopSimulation(attack.scenario_id)}
                    >
                      <StopCircle className="h-3 w-3 mr-1" /> ARRÊTER
                    </Button>
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

export default SimulationPage;