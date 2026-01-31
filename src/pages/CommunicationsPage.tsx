import { MainLayout } from "@/components/layout/MainLayout";
import { CommunicationStatus } from "@/components/dashboard/CommunicationStatus";
import { cn } from "@/lib/utils";
import { Radio, Activity, ArrowUpDown, Wifi, WifiOff } from "lucide-react";

const bandwidthHistory = [
  { time: "14:00", value: 85 },
  { time: "14:05", value: 88 },
  { time: "14:10", value: 92 },
  { time: "14:15", value: 78 },
  { time: "14:20", value: 65 },
  { time: "14:25", value: 72 },
  { time: "14:30", value: 82 },
];

const groundStations = [
  { id: "GS-001", name: "ESOC Darmstadt", location: "Allemagne", status: "online", satellites: 3 },
  { id: "GS-002", name: "Kourou CSG", location: "Guyane", status: "online", satellites: 2 },
  { id: "GS-003", name: "Maspalomas", location: "Espagne", status: "online", satellites: 2 },
  { id: "GS-004", name: "Redu", location: "Belgique", status: "maintenance", satellites: 0 },
];

const CommunicationsPage = () => {
  const maxValue = Math.max(...bandwidthHistory.map((d) => d.value));

  return (
    <MainLayout
      title="Communications"
      subtitle="Gestion des liaisons satellite-sol"
    >
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left column */}
        <div className="lg:col-span-2 space-y-6">
          {/* Bandwidth chart */}
          <div className="cyber-card rounded-xl border border-border p-4">
            <div className="mb-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Activity className="h-5 w-5 text-primary" />
                <h3 className="font-orbitron text-sm font-semibold uppercase tracking-wider">
                  Bande Passante (30 min)
                </h3>
              </div>
              <div className="flex items-center gap-2 text-xs">
                <ArrowUpDown className="h-4 w-4 text-secure-green" />
                <span className="text-foreground">Moy: 80%</span>
              </div>
            </div>
            {/* Simple bar chart */}
            <div className="flex h-32 items-end justify-between gap-2">
              {bandwidthHistory.map((point, i) => (
                <div key={i} className="flex flex-1 flex-col items-center gap-1">
                  <div
                    className={cn(
                      "w-full rounded-t transition-all",
                      point.value > 80
                        ? "bg-gradient-to-t from-secure-green to-cyber-cyan"
                        : point.value > 60
                        ? "bg-gradient-to-t from-warning-amber to-cyber-cyan"
                        : "bg-gradient-to-t from-threat-red to-warning-amber"
                    )}
                    style={{ height: `${(point.value / maxValue) * 100}%` }}
                  />
                  <span className="text-[10px] text-muted-foreground">{point.time}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Ground Stations */}
          <div className="cyber-card rounded-xl border border-border p-4">
            <div className="mb-4 flex items-center gap-2">
              <Radio className="h-5 w-5 text-primary" />
              <h3 className="font-orbitron text-sm font-semibold uppercase tracking-wider">
                Stations Sol
              </h3>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              {groundStations.map((station) => (
                <div
                  key={station.id}
                  className={cn(
                    "rounded-lg border border-border bg-secondary/30 p-4 transition-all hover:border-primary/30",
                    station.status === "maintenance" && "opacity-60"
                  )}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex gap-3">
                      <div
                        className={cn(
                          "flex h-10 w-10 items-center justify-center rounded-lg",
                          station.status === "online"
                            ? "bg-secure-green/10"
                            : "bg-warning-amber/10"
                        )}
                      >
                        {station.status === "online" ? (
                          <Wifi className="h-5 w-5 text-secure-green" />
                        ) : (
                          <WifiOff className="h-5 w-5 text-warning-amber" />
                        )}
                      </div>
                      <div>
                        <span className="font-medium text-foreground">{station.name}</span>
                        <p className="text-xs text-muted-foreground">{station.location}</p>
                      </div>
                    </div>
                    <span
                      className={cn(
                        "rounded px-1.5 py-0.5 text-[10px] font-medium",
                        station.status === "online"
                          ? "bg-secure-green/10 text-secure-green"
                          : "bg-warning-amber/10 text-warning-amber"
                      )}
                    >
                      {station.status === "online" ? "En ligne" : "Maintenance"}
                    </span>
                  </div>
                  <div className="mt-3 flex items-center justify-between text-xs">
                    <span className="text-muted-foreground">Satellites connectés:</span>
                    <span className="font-mono text-foreground">{station.satellites}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right column */}
        <div>
          <CommunicationStatus />
        </div>
      </div>
    </MainLayout>
  );
};

export default CommunicationsPage;
