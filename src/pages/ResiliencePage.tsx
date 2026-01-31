import { MainLayout } from "@/components/layout/MainLayout";
import { useSatelliteSystem } from "@/contexts/SatelliteContext";
import { CheckCircle2, Bot, BrainCircuit, ShieldCheck, Server } from "lucide-react";

const ResiliencePage = () => {
  const { systemState } = useSatelliteSystem();
  
  // Mapping de l'état des agents du backend
  const agents = systemState?.system_status?.agents || {
    sentinel: "unknown",
    analyst: "unknown",
    defender: "unknown",
    coordinator: "unknown"
  };

  const AgentCard = ({ name, role, status, icon: Icon }: any) => (
    <div className="cyber-card p-6 border border-border rounded-xl flex items-center justify-between">
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
        <span className="font-mono text-sm uppercase">{status}</span>
      </div>
    </div>
  );

  return (
    <MainLayout
      title="Résilience Système"
      subtitle="État de santé des agents autonomes"
    >
      <div className="grid gap-6">
        
        {/* Status Overview */}
        <div className="p-6 rounded-xl bg-gradient-to-r from-green-500/10 to-transparent border border-green-500/20 mb-4">
          <div className="flex items-center gap-4">
            <CheckCircle2 className="h-10 w-10 text-green-500" />
            <div>
              <h2 className="text-xl font-bold text-green-500">Système Nominal</h2>
              <p className="text-sm text-foreground/80">
                Tous les agents de cyber-défense sont opérationnels et synchronisés.
              </p>
            </div>
          </div>
        </div>

        {/* Agents Grid */}
        <div className="grid gap-4 md:grid-cols-2">
          <AgentCard 
            name="Sentinelle" 
            role="Détection d'anomalies (Isolation Forest)" 
            status={agents.sentinel}
            icon={Bot}
          />
          <AgentCard 
            name="Analyste" 
            role="Classification des menaces (Random Forest)" 
            status={agents.analyst}
            icon={BrainCircuit}
          />
          <AgentCard 
            name="Défenseur" 
            role="Gestion des ressources & Actions" 
            status={agents.defender}
            icon={ShieldCheck}
          />
          <AgentCard 
            name="Coordinateur" 
            role="Orchestration & Human-Interface" 
            status={agents.coordinator}
            icon={Server}
          />
        </div>
      </div>
    </MainLayout>
  );
};

export default ResiliencePage;