import { useState, useEffect } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { api } from "@/services/api";
import { cn } from "@/lib/utils";
import { FileText, CheckCircle, XCircle, User, Calendar, Download } from "lucide-react";
import { Button } from "@/components/ui/button";

const ReportsPage = () => {
  const [history, setHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const data = await api.getInterventionHistory(100); // Récupère les 100 dernières
        if (data.success) {
          setHistory(data.history);
        }
      } catch (error) {
        console.error("Erreur historique", error);
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, []);

  return (
    <MainLayout title="Rapports d'Intervention" subtitle="Journal d'audit des décisions humaines">
      <div className="grid gap-6">
        
        {/* Résumé */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="cyber-card p-4 border border-border rounded-xl flex items-center gap-4">
                <div className="p-3 bg-primary/10 rounded-lg"><FileText className="text-primary"/></div>
                <div>
                    <p className="text-sm text-muted-foreground">Total Interventions</p>
                    <p className="text-2xl font-bold">{history.length}</p>
                </div>
            </div>
            <div className="cyber-card p-4 border border-border rounded-xl flex items-center gap-4">
                <div className="p-3 bg-green-500/10 rounded-lg"><CheckCircle className="text-green-500"/></div>
                <div>
                    <p className="text-sm text-muted-foreground">Approbations</p>
                    <p className="text-2xl font-bold">{history.filter(h => h.status === 'approved').length}</p>
                </div>
            </div>
            <div className="cyber-card p-4 border border-border rounded-xl flex items-center gap-4">
                <div className="p-3 bg-red-500/10 rounded-lg"><XCircle className="text-red-500"/></div>
                <div>
                    <p className="text-sm text-muted-foreground">Rejets</p>
                    <p className="text-2xl font-bold">{history.filter(h => h.status === 'rejected').length}</p>
                </div>
            </div>
        </div>

        {/* Tableau d'Historique */}
        <div className="cyber-card border border-border rounded-xl overflow-hidden">
          <div className="p-4 border-b border-border bg-secondary/20 flex justify-between items-center">
            <h3 className="font-bold">Journal des opérations</h3>
            <Button variant="outline" size="sm" className="gap-2">
                <Download className="h-4 w-4"/> Exporter CSV
            </Button>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-secondary/50 text-muted-foreground">
                <tr>
                  <th className="p-4">ID Requête</th>
                  <th className="p-4">Menace & Satellite</th>
                  <th className="p-4">Action Proposée</th>
                  <th className="p-4">Décision</th>
                  <th className="p-4">Opérateur</th>
                  <th className="p-4 text-right">Date</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                    <tr><td colSpan={6} className="p-8 text-center">Chargement des données...</td></tr>
                ) : history.length === 0 ? (
                    <tr><td colSpan={6} className="p-8 text-center text-muted-foreground">Aucune intervention enregistrée.</td></tr>
                ) : (
                  history.slice().reverse().map((item: any) => ( // On inverse pour avoir le plus récent en haut
                    <tr key={item.request_id} className="border-t border-border/50 hover:bg-secondary/10 transition-colors">
                      <td className="p-4 font-mono text-xs text-muted-foreground">{item.request_id}</td>
                      <td className="p-4">
                        <div className="font-bold text-foreground">{item.threat_type}</div>
                        <div className="text-xs text-muted-foreground">{item.satellite_id}</div>
                      </td>
                      <td className="p-4">
                        <span className="bg-secondary px-2 py-1 rounded text-xs font-mono">{item.recommended_action}</span>
                      </td>
                      <td className="p-4">
                        <span className={cn(
                          "px-2 py-0.5 rounded-full text-xs font-bold uppercase flex w-fit items-center gap-1",
                          item.status === "approved" ? "bg-green-500/10 text-green-500" : "bg-red-500/10 text-red-500"
                        )}>
                          {item.status === "approved" ? <CheckCircle className="h-3 w-3"/> : <XCircle className="h-3 w-3"/>}
                          {item.status}
                        </span>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                            <User className="h-3 w-3 text-muted-foreground"/>
                            {item.approved_by || "Système"}
                        </div>
                      </td>
                      <td className="p-4 text-right text-xs text-muted-foreground">
                        <div className="flex items-center justify-end gap-2">
                            <Calendar className="h-3 w-3"/>
                            {new Date(item.approval_time).toLocaleString()}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default ReportsPage;