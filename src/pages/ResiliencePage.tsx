import { useEffect, useState } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { useSatelliteSystem } from "@/contexts/SatelliteContext";
import { api } from "@/services/api"; // Import du service
import { CheckCircle2, Bot, BrainCircuit, ShieldCheck, Server, Lock, Zap, RefreshCw, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const ResiliencePage = () => {
  const { systemState } = useSatelliteSystem();
  const [quickActions, setQuickActions] = useState<any[]>([]);
  const [loadingAction, setLoadingAction] = useState<string | null>(null);
  
  // Mapping de l'état des agents
  const agents = systemState?.system_status?.agents || {
    sentinel: "unknown", analyst: "unknown", defender: "unknown", coordinator: "unknown"
  };

  // Chargement des actions rapides au montage
  useEffect(() => {
    const loadActions = async () => {
      try {
        const data = await api.getQuickActions("high"); // On demande les actions de niveau élevé par défaut
        if (data.success) {
          setQuickActions(data.actions);
        }
      } catch (e) {
        console.error("Erreur chargement actions", e);
      }
    };
    loadActions();
  }, []);

  const handleManualAction = async (actionId: string, label: string) => {
    setLoadingAction(actionId);
    try {
      // On cible SAT-001 par défaut pour l'exemple manuel
      await api.executeManualAction("SAT-001", actionId);
      toast.success(`Action exécutée : ${label}`);
    } catch (e) {
      toast.error("Échec de l'action");
    } finally {
      setLoadingAction(null);
    }
  };

  const AgentCard = ({ name, role, status, icon: Icon }: any) => (
    <div className="cyber-card p-6 border border-border rounded-xl flex items-center justify-between transition-all hover:border-primary/50">
      <div className="flex items-center gap-4">
        <div className="p-3 bg-primary/10 rounded-full">
          <Icon className="h-6 w-6 text-primary" />
        </div>
        <div>
          <h3 className="font-bold text-lg capitalize">{name}</h3>
          <p className="text-sm text-muted-foreground">{role}</p>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <div className={`h-3 w-3 rounded-full ${status === "active" ? "bg-green-500 shadow-[0_0_10px_#22c55e]" : "bg-gray-500"}`} />
        <span className={`font-mono text-sm uppercase ${status === "active" ? "text-green-500" : "text-gray-500"}`}>
          {status}
        </span>
      </div>
    </div>
  );

  return (
    <MainLayout title="Résilience Système" subtitle="État des agents et réponses d'urgence">
      <div className="grid gap-6 lg:grid-cols-3">
        
        {/* Colonne Gauche : État des Agents */}
        <div className="lg:col-span-2 space-y-6">
          <div className="p-6 rounded-xl bg-gradient-to-r from-green-500/10 to-transparent border border-green-500/20">
            <div className="flex items-center gap-4">
              <CheckCircle2 className="h-10 w-10 text-green-500" />
              <div>
                <h2 className="text-xl font-bold text-green-500">Système Nominal</h2>
                <p className="text-sm text-foreground/80">
                  Orchestration multi-agents active. Base de connaissances chargée.
                </p>
              </div>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <AgentCard name="Sentinelle" role="Détection (Isolation Forest)" status={agents.sentinel} icon={Bot} />
            <AgentCard name="Analyste" role="Classification (Random Forest)" status={agents.analyst} icon={BrainCircuit} />
            <AgentCard name="Défenseur" role="Réponse & Ressources" status={agents.defender} icon={ShieldCheck} />
            <AgentCard name="Coordinateur" role="Orchestration Humaine" status={agents.coordinator} icon={Server} />
          </div>
        </div>

        {/* Colonne Droite : Actions Rapides (API) */}
        <div className="space-y-6">
          <div className="cyber-card rounded-xl border border-red-500/30 bg-red-500/5 p-4">
            <div className="mb-4 flex items-center gap-2 text-red-500">
              <Lock className="h-5 w-5" />
              <h3 className="font-orbitron text-sm font-bold uppercase tracking-wider">
                Commandes d'Urgence
              </h3>
            </div>
            
            <div className="space-y-3">
              {quickActions.length === 0 ? (
                <p className="text-sm text-muted-foreground">Chargement des actions...</p>
              ) : (
                quickActions.map((action) => (
                  <div key={action.id} className="group relative">
                     <Button 
                      className="w-full justify-start gap-2 border-red-500/20 hover:bg-red-500/10 hover:text-red-500 transition-all" 
                      variant="outline"
                      disabled={loadingAction === action.id}
                      onClick={() => handleManualAction(action.id, action.label)}
                    >
                      {loadingAction === action.id ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Play className="h-4 w-4" />}
                      {action.label}
                    </Button>
                    <p className="text-[10px] text-muted-foreground mt-1 ml-2">{action.description}</p>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default ResiliencePage;