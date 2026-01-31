import { MainLayout } from "@/components/layout/MainLayout";
import { StatusCard } from "@/components/dashboard/StatusCard";
import { useSatelliteSystem } from "@/contexts/SatelliteContext";
import { Satellite, Shield, AlertTriangle, Radio, Activity } from "lucide-react";

const Index = () => {
  const { systemState, activeAttacks, isConnected } = useSatelliteSystem();

  // Valeurs par défaut sécurisées
  const satCount = systemState?.telemetry?.length || 0;
  const threatCount = activeAttacks.length;
  const pendingCount = systemState?.human_intervention?.count || 0;
  
  // Calcul santé système (exemple simple basé sur les alertes)
  const systemHealth = threatCount > 0 ? 60 : pendingCount > 0 ? 80 : 98;

  return (
    <MainLayout
      title="Centre de Contrôle"
      subtitle={isConnected ? "🟢 Connexion temps réel active" : "🔴 Déconnecté du serveur"}
    >
      {/* Status Cards */}
      <div className="mb-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <StatusCard
          title="Satellites Actifs"
          value={`${satCount}/6`} // Supposons une constellation de 6
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

      {/* Footer Info */}
      <div className="mt-4 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-border bg-card p-3">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2">
            <Radio className="h-4 w-4 text-primary" />
            <span className="text-xs text-muted-foreground">Backend API:</span>
            <span className={`font-mono text-sm ${isConnected ? "text-green-500" : "text-red-500"}`}>
              {isConnected ? "ONLINE" : "OFFLINE"}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Shield className="h-4 w-4 text-primary" />
            <span className="text-xs text-muted-foreground">Mode IA:</span>
            <span className="font-mono text-sm text-foreground">Human-in-the-Loop</span>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default Index;