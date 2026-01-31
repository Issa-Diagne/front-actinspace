import { MainLayout } from "@/components/layout/MainLayout";
import { useSatelliteSystem } from "@/contexts/SatelliteContext";
import { AlertTriangle, ShieldCheck, Search } from "lucide-react";
import { cn } from "@/lib/utils";

const ThreatsPage = () => {
  const { activeAttacks, systemState } = useSatelliteSystem();

  // Pour l'historique, on utilise les logs du systemState s'ils existent, sinon vide
  // Note: Dans une vraie app, on ferait un appel API spécifique pour l'historique
  const history = systemState?.human_intervention?.recent_decisions || [];

  return (
    <MainLayout
      title="Surveillance des Menaces"
      subtitle="Détection et neutralisation en temps réel"
    >
      <div className="space-y-8">
        
        {/* Section Menaces Actives */}
        <section>
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2 text-red-500">
            <AlertTriangle /> Menaces en cours ({activeAttacks.length})
          </h2>
          
          <div className="grid gap-4">
            {activeAttacks.length === 0 ? (
              <div className="p-6 bg-green-500/5 border border-green-500/20 rounded-xl flex items-center gap-4">
                <ShieldCheck className="h-10 w-10 text-green-500" />
                <div>
                  <h3 className="font-bold text-green-500">Système Sécurisé</h3>
                  <p className="text-sm text-muted-foreground">Aucune activité malveillante détectée sur la constellation.</p>
                </div>
              </div>
            ) : (
              activeAttacks.map((attack: any) => (
                <div key={attack.scenario_id} className="cyber-card border-l-4 border-l-red-500 p-4 rounded-r-xl border-y border-r border-border bg-background">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-lg font-bold text-red-500 uppercase">{attack.scenario_name}</h3>
                      <p className="text-sm text-foreground">Cible : <span className="font-mono bg-secondary px-1 rounded">{attack.target_satellite}</span></p>
                      <p className="text-xs text-muted-foreground mt-2">Détecté le : {new Date().toLocaleTimeString()}</p>
                    </div>
                    <div className="text-right">
                      <span className="inline-block px-2 py-1 bg-red-500/20 text-red-500 text-xs font-bold rounded animate-pulse">
                        CRITIQUE
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </section>

        {/* Section Historique (Dernières décisions) */}
        <section>
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            <Search className="text-primary" /> Historique Récent
          </h2>
          <div className="rounded-xl border border-border overflow-hidden">
            <table className="w-full text-sm text-left">
              <thead className="bg-secondary/50 text-muted-foreground">
                <tr>
                  <th className="p-3">ID Requête</th>
                  <th className="p-3">Menace</th>
                  <th className="p-3">Décision</th>
                  <th className="p-3">Opérateur</th>
                  <th className="p-3 text-right">Heure</th>
                </tr>
              </thead>
              <tbody>
                {history.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="p-4 text-center text-muted-foreground">Aucun historique disponible</td>
                  </tr>
                ) : (
                  history.map((item: any) => (
                    <tr key={item.request_id} className="border-t border-border/50 hover:bg-secondary/20">
                      <td className="p-3 font-mono text-xs">{item.request_id.split('-')[1]}...</td>
                      <td className="p-3 font-medium">{item.threat_type}</td>
                      <td className="p-3">
                        <span className={cn(
                          "px-2 py-0.5 rounded-full text-xs font-medium",
                          item.status === "approved" ? "bg-green-500/10 text-green-500" : "bg-red-500/10 text-red-500"
                        )}>
                          {item.status === "approved" ? "APPROUVÉ" : "REJETÉ"}
                        </span>
                      </td>
                      <td className="p-3 text-muted-foreground">{item.approved_by || "Auto"}</td>
                      <td className="p-3 text-right text-xs font-mono">
                        {new Date(item.approval_time).toLocaleTimeString()}
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