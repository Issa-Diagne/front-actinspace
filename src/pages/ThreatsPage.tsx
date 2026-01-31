import { useState } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { useSatelliteSystem } from "@/contexts/SatelliteContext";
import { 
  AlertTriangle, 
  ShieldCheck, 
  History, 
  CheckCircle, 
  XCircle, 
  Clock, 
  ShieldAlert,
  Server,
  Activity
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

const ThreatsPage = () => {
  // On récupère tout ce dont on a besoin du contexte
  const { 
    activeAttacks, 
    attackHistory, 
    pendingApprovals, // Les demandes en attente
    sendIntervention // La fonction pour décider
  } = useSatelliteSystem();

  const [processingId, setProcessingId] = useState<string | null>(null);

  // Fonction pour gérer le clic sur Approuver/Rejeter
  const handleDecision = async (requestId: string, action: 'approve' | 'reject') => {
    setProcessingId(requestId);
    try {
      await sendIntervention(requestId, action);
      // Le toast est déjà géré dans le contexte, mais on peut en ajouter un spécifique ici si besoin
    } catch (e) {
      console.error(e);
    } finally {
      setProcessingId(null);
    }
  };

  return (
    <MainLayout
      title="Gestion des Menaces"
      subtitle="Surveillance temps réel et prise de décision"
    >
      <div className="space-y-8">
        
        {/* --- SECTION 1 : DÉCISIONS URGENTES (HUMAN IN THE LOOP) --- */}
        {pendingApprovals.length > 0 && (
          <section className="animate-in slide-in-from-top-4 fade-in duration-500">
            <div className="flex items-center gap-2 mb-4">
              <div className="relative">
                <span className="absolute -top-1 -right-1 flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
                </span>
                <ShieldAlert className="h-6 w-6 text-red-500" />
              </div>
              <h2 className="text-xl font-bold text-red-500">INTERVENTION REQUISE ({pendingApprovals.length})</h2>
            </div>

            <div className="grid gap-4 lg:grid-cols-2">
              {pendingApprovals.map((req) => (
                <div 
                  key={req.request_id} 
                  className="cyber-card border-2 border-red-500/50 bg-red-500/5 p-5 rounded-xl shadow-[0_0_20px_rgba(239,68,68,0.2)] relative overflow-hidden"
                >
                  {/* Background Pulse Effect */}
                  <div className="absolute inset-0 bg-red-500/5 animate-pulse pointer-events-none" />

                  <div className="relative z-10">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded uppercase">
                            {req.severity} PRIORITY
                          </span>
                          <span className="text-xs font-mono text-muted-foreground">ID: {req.request_id.split('-')[1]}</span>
                        </div>
                        <h3 className="text-lg font-bold text-foreground flex items-center gap-2">
                          {req.threat_type.replace('_', ' ').toUpperCase()}
                        </h3>
                      </div>
                      <div className="text-right">
                        <div className="text-xs text-muted-foreground">Cible</div>
                        <div className="font-mono font-bold text-primary">{req.satellite_id}</div>
                      </div>
                    </div>

                    <div className="bg-background/50 p-3 rounded-lg border border-border mb-4">
                      <p className="text-xs text-muted-foreground mb-1">Analyse IA & Recommandation :</p>
                      <p className="text-sm font-medium text-foreground">
                        {req.recommended_action}
                      </p>
                      <div className="mt-2 flex items-center gap-2 text-xs">
                        <span className="text-muted-foreground">Confiance IA:</span>
                        <div className="h-1.5 w-20 bg-secondary rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-green-500" 
                            style={{ width: `${req.confidence * 100}%` }} 
                          />
                        </div>
                        <span className="font-mono">{(req.confidence * 100).toFixed(0)}%</span>
                      </div>
                    </div>

                    <div className="flex gap-3">
                      <Button 
                        className="flex-1 bg-green-600 hover:bg-green-700 text-white border-none shadow-glow-green"
                        onClick={() => handleDecision(req.request_id, 'approve')}
                        disabled={!!processingId}
                      >
                        {processingId === req.request_id ? (
                          <Activity className="h-4 w-4 animate-spin" />
                        ) : (
                          <>
                            <CheckCircle className="h-4 w-4 mr-2" />
                            APPROUVER
                          </>
                        )}
                      </Button>
                      
                      <Button 
                        variant="destructive"
                        className="flex-1"
                        onClick={() => handleDecision(req.request_id, 'reject')}
                        disabled={!!processingId}
                      >
                        <XCircle className="h-4 w-4 mr-2" />
                        REJETER
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* --- SECTION 2 : SIMULATIONS EN COURS (Contexte) --- */}
        <section>
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            <Activity className="text-primary" /> 
            Activité Détectée
            {activeAttacks.length > 0 && (
              <span className="bg-secondary text-xs px-2 py-1 rounded-full text-foreground font-normal">
                {activeAttacks.length} Simulation(s) active(s)
              </span>
            )}
          </h2>
          
          <div className="grid gap-4">
            {activeAttacks.length === 0 ? (
              <div className="p-6 bg-green-500/5 border border-green-500/20 rounded-xl flex items-center gap-4">
                <ShieldCheck className="h-10 w-10 text-green-500" />
                <div>
                  <h3 className="font-bold text-green-500">Aucune attaque active</h3>
                  <p className="text-sm text-muted-foreground">Les systèmes de surveillance sont nominaux.</p>
                </div>
              </div>
            ) : (
              activeAttacks.map((attack: any) => (
                <div key={attack.scenario_id} className="cyber-card border-l-4 border-l-orange-500 p-4 rounded-r-xl border-y border-r border-border bg-background flex items-center justify-between">
                  <div className="flex items-start gap-4">
                    <div className="p-2 bg-orange-500/10 rounded-lg h-fit">
                      <AlertTriangle className="h-6 w-6 text-orange-500 animate-pulse" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-foreground uppercase">{attack.scenario_name}</h3>
                      <div className="flex items-center gap-3 mt-1 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Server className="h-3 w-3" /> {attack.target_satellite}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" /> {attack.elapsed_time}s écoulés
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="px-3 py-1 bg-orange-500/20 text-orange-500 text-xs font-bold rounded animate-pulse">
                      EN COURS
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </section>

        {/* --- SECTION 3 : HISTORIQUE DES DÉCISIONS ET ATTAQUES --- */}
        <section>
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            <History className="text-primary" /> Historique des Événements
          </h2>
          <div className="rounded-xl border border-border overflow-hidden bg-card">
            <table className="w-full text-sm text-left">
              <thead className="bg-secondary/50 text-muted-foreground">
                <tr>
                  <th className="p-3">Événement / Menace</th>
                  <th className="p-3">Cible</th>
                  <th className="p-3">Heure</th>
                  <th className="p-3">Durée</th>
                  <th className="p-3 text-right">Statut Final</th>
                </tr>
              </thead>
              <tbody>
                {attackHistory.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="p-8 text-center text-muted-foreground">
                      Aucune donnée historique disponible.
                    </td>
                  </tr>
                ) : (
                  attackHistory.slice(0, 10).map((item: any) => ( // Top 10 seulement
                    <tr key={item.scenario_id} className="border-t border-border/50 hover:bg-secondary/10 transition-colors">
                      <td className="p-3 font-medium text-foreground flex items-center gap-2">
                        {item.status === 'completed' || item.status === 'stopped' ? (
                          <div className="h-2 w-2 rounded-full bg-gray-500" />
                        ) : (
                          <div className="h-2 w-2 rounded-full bg-green-500" />
                        )}
                        {item.scenario_name}
                      </td>
                      <td className="p-3 font-mono text-xs text-muted-foreground">{item.target_satellite}</td>
                      <td className="p-3 text-muted-foreground">
                        {new Date(item.start_time).toLocaleTimeString()}
                      </td>
                      <td className="p-3 text-muted-foreground font-mono">
                        {item.end_time 
                          ? `${Math.round((new Date(item.end_time).getTime() - new Date(item.start_time).getTime()) / 1000)}s` 
                          : "..."}
                      </td>
                      <td className="p-3 text-right">
                        <span className={cn(
                          "px-2 py-0.5 rounded text-[10px] font-bold uppercase",
                          item.status === "active" ? "bg-orange-500/20 text-orange-500" : "bg-gray-500/20 text-gray-400"
                        )}>
                          {item.status === "active" ? "ACTIF" : "TERMINÉ"}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </MainLayout>
  );
};

export default ThreatsPage;