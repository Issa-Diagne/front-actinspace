import { MainLayout } from "@/components/layout/MainLayout";
import { StatusCard } from "@/components/dashboard/StatusCard";
import { SatelliteMap } from "@/components/dashboard/SatelliteMap";
import { ThreatTimeline } from "@/components/dashboard/ThreatTimeline";
import { SecurityMetrics } from "@/components/dashboard/SecurityMetrics";
import { CommunicationStatus } from "@/components/dashboard/CommunicationStatus";
import { SimulationPanel } from "@/components/dashboard/SimulationPanel";
import { Satellite, Shield, AlertTriangle, Radio, Zap, Activity } from "lucide-react";

const Index = () => {
  return (
    <MainLayout
      title="Centre de Contrôle"
      subtitle="Surveillance et résilience en temps réel"
    >
      {/* Status Cards */}
      <div className="mb-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <StatusCard
          title="Satellites Actifs"
          value="6/6"
          subtitle="Tous opérationnels"
          icon={Satellite}
          status="secure"
          trend={{ value: 0, direction: "up" }}
        />
        <StatusCard
          title="Menaces Actives"
          value={2}
          subtitle="2 en cours d'analyse"
          icon={AlertTriangle}
          status="critical"
        />
        <StatusCard
          title="Score Sécurité"
          value="94%"
          subtitle="Niveau élevé"
          icon={Shield}
          status="secure"
          trend={{ value: 2, direction: "up" }}
        />
        <StatusCard
          title="Canaux Comm."
          value="4/5"
          subtitle="1 canal brouillé"
          icon={Radio}
          status="warning"
        />
      </div>

      {/* Main Grid */}
      <div className="grid gap-4 lg:grid-cols-3">
        {/* Left Column - Map & Communications */}
        <div className="space-y-4 lg:col-span-2">
          <SatelliteMap />
          <div className="grid gap-4 md:grid-cols-2">
            <CommunicationStatus />
            <SimulationPanel />
          </div>
        </div>

        {/* Right Column - Timeline & Security */}
        <div className="space-y-4">
          <SecurityMetrics />
          <ThreatTimeline />
        </div>
      </div>

      {/* Footer Stats - Positioned correctly below main content */}
      <div className="mt-4 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-border bg-card p-3">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2">
            <Activity className="h-4 w-4 text-secure-green" />
            <span className="text-xs text-muted-foreground">Uptime:</span>
            <span className="font-mono text-sm text-foreground">99.97%</span>
          </div>
          <div className="flex items-center gap-2">
            <Zap className="h-4 w-4 text-primary" />
            <span className="text-xs text-muted-foreground">Latence moy:</span>
            <span className="font-mono text-sm text-foreground">12ms</span>
          </div>
          <div className="flex items-center gap-2">
            <Shield className="h-4 w-4 text-primary" />
            <span className="text-xs text-muted-foreground">Attaques bloquées:</span>
            <span className="font-mono text-sm text-foreground">1,247</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground">Mode défense:</span>
          <span className="rounded-full bg-secure-green/10 px-2 py-0.5 text-xs font-medium text-secure-green">
            Automatique
          </span>
        </div>
      </div>
    </MainLayout>
  );
};

export default Index;