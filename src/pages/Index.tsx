import { MainLayout } from "@/components/layout/MainLayout";
import { StatusCard } from "@/components/dashboard/StatusCard";
import { SatelliteMap, SatelliteData } from "@/components/dashboard/SatelliteMap"; // Import de la carte
import { useSatelliteSystem } from "@/contexts/SatelliteContext";
import { Satellite, Shield, AlertTriangle, Radio, Activity } from "lucide-react";
import { useMemo } from "react";

const Index = () => {
  const { systemState, activeAttacks, isConnected } = useSatelliteSystem();

  // Valeurs par défaut
  const satCount = systemState?.telemetry?.length || 0;
  const threatCount = activeAttacks.length;
  const pendingCount = systemState?.human_intervention?.count || 0;
  
  // Calcul santé globale
  const systemHealth = threatCount > 0 ? 60 : pendingCount > 0 ? 80 : 98;

  // --- TRANSFORMATION DES DONNÉES POUR LA CARTE ---
  const mapData: SatelliteData[] = useMemo(() => {
    if (!systemState?.telemetry) return [];

    // Positions fixes pour l'esthétique (pour éviter que les satellites bougent n'importe comment)
    const fixedPositions = [
        { x: 20, y: 30, name: "SENTINEL-1" },
        { x: 50, y: 20, name: "GALILEO-2" },
        { x: 80, y: 40, name: "METEOSAT" },
        { x: 30, y: 60, name: "SPOT-6" },
        { x: 70, y: 70, name: "EUTELSAT" },
        { x: 90, y: 20, name: "COSMOS" }
    ];

    return systemState.telemetry.map((sat: any, index: number) => {
        // Déterminer le statut visuel en fonction des métriques réelles
        let status: SatelliteData['status'] = 'online';
        if (sat.cpu_usage > 90 || sat.packet_loss > 10) status = 'critical';
        else if (sat.cpu_usage > 70 || sat.temperature > 80) status = 'warning';

        // Position cyclique
        const pos = fixedPositions[index % fixedPositions.length];

        return {
            id: sat.satellite_id,
            name: pos.name, // Nom fictif joli, ou utiliser sat.satellite_id
            status: status,
            position: { x: pos.x, y: pos.y },
            signalStrength: Math.max(0, 100 - (sat.packet_loss * 5)), // Simuler force signal via perte paquets
            orbit: "LEO",
            details: {
                cpu: sat.cpu_usage,
                ram: sat.memory_usage,
                temp: sat.temperature
            }
        };
    });
  }, [systemState]);

  return (
    <MainLayout
      title="Centre de Contrôle"
      subtitle={isConnected ? "🟢 Connexion temps réel active" : "🔴 Déconnecté du serveur"}
    >
      {/* 1. Ligne des cartes de statut */}
      <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatusCard
          title="Satellites Actifs"
          value={`${satCount}/${satCount}`}
          subtitle="Télémétrie reçue"
          icon={Satellite}
          status={satCount > 0 ? "secure" : "warning"}
        />
        <StatusCard
          title="Menaces Actives"
          value={threatCount}
          subtitle={threatCount > 0 ? "Attaque en cours" : "Aucune menace"}
          icon={AlertTriangle}
          status={threatCount > 0 ? "critical" : "secure"}
        />
        <StatusCard
          title="Score Sécurité"
          value={`${systemHealth}%`}
          subtitle="Niveau de résilience"
          icon={Shield}
          status={systemHealth > 90 ? "secure" : "warning"}
        />
        <StatusCard
          title="Actions Requises"
          value={pendingCount}
          subtitle="Approbations en attente"
          icon={Activity}
          status={pendingCount > 0 ? "warning" : "secure"}
        />
      </div>

      {/* 2. Section Principale avec la Carte */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Carte des Satellites (Prend 2 colonnes) */}
        <div className="lg:col-span-2 min-h-[400px]">
            <SatelliteMap satellites={mapData} />
        </div>

        {/* Panneau latéral d'info (Colonne de droite) */}
        <div className="space-y-6">
            {/* Info Connexion */}
            <div className="cyber-card p-4 border border-border rounded-xl">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="font-bold flex items-center gap-2">
                        <Radio className="h-4 w-4 text-primary"/> État du Réseau
                    </h3>
                    <span className={`text-xs px-2 py-1 rounded font-mono ${isConnected ? "bg-green-500/20 text-green-500" : "bg-red-500/20 text-red-500"}`}>
                        {isConnected ? "CONNECTED" : "DISCONNECTED"}
                    </span>
                </div>
                <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                        <span className="text-muted-foreground">Latence Moyenne</span>
                        <span className="font-mono">24ms</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-muted-foreground">Uplink</span>
                        <span className="font-mono text-green-400">Secure (AES-256)</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-muted-foreground">Mode</span>
                        <span className="font-mono text-primary">Autonome</span>
                    </div>
                </div>
            </div>

            {/* Liste rapide des menaces */}
            <div className="cyber-card p-4 border border-border rounded-xl bg-red-500/5">
                <h3 className="font-bold text-red-500 mb-3 flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4"/> Alertes Prioritaires
                </h3>
                {threatCount === 0 && pendingCount === 0 ? (
                    <p className="text-sm text-muted-foreground text-center py-4">R.A.S. Secteur calme.</p>
                ) : (
                    <div className="space-y-2">
                        {activeAttacks.map((att: any) => (
                            <div key={att.scenario_id} className="text-xs bg-background p-2 rounded border border-red-500/30 flex justify-between items-center">
                                <span className="font-bold text-red-400">{att.scenario_name}</span>
                                <span className="text-muted-foreground">{att.target_satellite}</span>
                            </div>
                        ))}
                         {systemState?.human_intervention?.pending_requests.map((req: any) => (
                            <div key={req.request_id} className="text-xs bg-orange-500/10 p-2 rounded border border-orange-500/30 flex justify-between items-center">
                                <span className="font-bold text-orange-400">Decision Requise</span>
                                <span className="text-muted-foreground">{req.satellite_id}</span>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default Index;