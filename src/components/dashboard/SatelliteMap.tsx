import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { Satellite, AlertTriangle, CheckCircle, Radio } from "lucide-react";

interface SatelliteData {
  id: string;
  name: string;
  status: "online" | "warning" | "critical" | "offline";
  position: { x: number; y: number };
  signalStrength: number;
  orbit: string;
}

const mockSatellites: SatelliteData[] = [
  { id: "SAT-001", name: "SENTINEL-1A", status: "online", position: { x: 25, y: 30 }, signalStrength: 98, orbit: "LEO" },
  { id: "SAT-002", name: "COPERNICUS-2", status: "online", position: { x: 55, y: 20 }, signalStrength: 95, orbit: "LEO" },
  { id: "SAT-003", name: "GALILEO-E14", status: "warning", position: { x: 75, y: 45 }, signalStrength: 67, orbit: "MEO" },
  { id: "SAT-004", name: "EUTELSAT-KA1", status: "online", position: { x: 40, y: 60 }, signalStrength: 92, orbit: "GEO" },
  { id: "SAT-005", name: "COSMO-SKY-4", status: "critical", position: { x: 65, y: 70 }, signalStrength: 23, orbit: "LEO" },
  { id: "SAT-006", name: "METEOSAT-11", status: "online", position: { x: 85, y: 35 }, signalStrength: 99, orbit: "GEO" },
];

const statusColors = {
  online: "bg-secure-green",
  warning: "bg-warning-amber",
  critical: "bg-threat-red",
  offline: "bg-muted-foreground",
};

const statusGlow = {
  online: "shadow-[0_0_10px_hsl(var(--secure-green))]",
  warning: "shadow-[0_0_10px_hsl(var(--warning-amber))]",
  critical: "shadow-[0_0_15px_hsl(var(--threat-red))] animate-pulse",
  offline: "",
};

export function SatelliteMap() {
  const [selectedSatellite, setSelectedSatellite] = useState<SatelliteData | null>(null);
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="cyber-card relative overflow-hidden rounded-xl border border-border p-3">
      {/* Header */}
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Satellite className="h-5 w-5 text-primary" />
          <h3 className="font-orbitron text-sm font-semibold uppercase tracking-wider">
            Réseau Satellite
          </h3>
        </div>
        <div className="flex items-center gap-3 text-xs">
          <div className="flex items-center gap-1.5">
            <span className="status-dot status-dot-online" />
            <span className="text-muted-foreground">En ligne: 4</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="status-dot status-dot-warning" />
            <span className="text-muted-foreground">Alerte: 1</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="status-dot status-dot-critical" />
            <span className="text-muted-foreground">Critique: 1</span>
          </div>
        </div>
      </div>

      {/* Map Container - Reduced height */}
      <div className="relative aspect-[2.5/1] w-full overflow-hidden rounded-lg bg-space-deep">
        {/* Grid overlay */}
        <div className="absolute inset-0 cyber-grid opacity-30" />
        
        {/* World map outline (simplified) */}
        <svg
          className="absolute inset-0 h-full w-full opacity-20"
          viewBox="0 0 100 50"
          preserveAspectRatio="xMidYMid slice"
        >
          <path
            d="M10,25 Q15,20 25,22 T40,20 T55,25 T70,22 T85,25 T95,23"
            fill="none"
            stroke="hsl(var(--primary))"
            strokeWidth="0.3"
          />
          <ellipse cx="30" cy="20" rx="8" ry="5" fill="none" stroke="hsl(var(--primary))" strokeWidth="0.2" />
          <ellipse cx="50" cy="25" rx="10" ry="6" fill="none" stroke="hsl(var(--primary))" strokeWidth="0.2" />
          <ellipse cx="75" cy="22" rx="7" ry="4" fill="none" stroke="hsl(var(--primary))" strokeWidth="0.2" />
        </svg>

        {/* Orbit paths */}
        <svg className="absolute inset-0 h-full w-full" viewBox="0 0 100 50">
          {/* LEO orbit */}
          <ellipse
            cx="50"
            cy="25"
            rx="45"
            ry="20"
            fill="none"
            stroke="hsl(var(--cyber-cyan) / 0.2)"
            strokeWidth="0.2"
            strokeDasharray="2,2"
          />
          {/* MEO orbit */}
          <ellipse
            cx="50"
            cy="25"
            rx="35"
            ry="15"
            fill="none"
            stroke="hsl(var(--data-blue) / 0.2)"
            strokeWidth="0.2"
            strokeDasharray="2,2"
          />
        </svg>

        {/* Satellites */}
        {mockSatellites.map((sat) => (
          <div
            key={sat.id}
            className={cn(
              "absolute cursor-pointer transition-all duration-300 hover:scale-150",
              selectedSatellite?.id === sat.id && "scale-150 z-10"
            )}
            style={{ left: `${sat.position.x}%`, top: `${sat.position.y}%` }}
            onClick={() => setSelectedSatellite(sat)}
          >
            <div
              className={cn(
                "h-3 w-3 rounded-full transition-all",
                statusColors[sat.status],
                statusGlow[sat.status]
              )}
            />
            {/* Pulse ring for critical */}
            {sat.status === "critical" && (
              <div className="absolute inset-0 animate-ping rounded-full bg-threat-red opacity-50" />
            )}
            {/* Connection lines */}
            {sat.status !== "offline" && selectedSatellite?.id === sat.id && (
              <svg className="absolute -left-1 -top-1 h-10 w-10 overflow-visible">
                <line
                  x1="6"
                  y1="6"
                  x2="40"
                  y2="40"
                  stroke="hsl(var(--primary) / 0.5)"
                  strokeWidth="0.5"
                  strokeDasharray="2,2"
                />
              </svg>
            )}
          </div>
        ))}

        {/* Ground stations */}
        <div
          className="absolute left-[30%] top-[75%] flex h-4 w-4 items-center justify-center"
          title="Station Sol - Paris"
        >
          <Radio className="h-3 w-3 text-primary" />
        </div>
        <div
          className="absolute left-[70%] top-[65%] flex h-4 w-4 items-center justify-center"
          title="Station Sol - Kourou"
        >
          <Radio className="h-3 w-3 text-primary" />
        </div>
      </div>

      {/* Selected Satellite Info - More compact */}
      {selectedSatellite && (
        <div className="mt-3 rounded-lg bg-secondary/50 p-2.5">
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-2">
                <span
                  className={cn(
                    "h-2 w-2 rounded-full",
                    statusColors[selectedSatellite.status]
                  )}
                />
                <span className="font-mono text-sm font-semibold">
                  {selectedSatellite.name}
                </span>
              </div>
              <div className="mt-0.5 flex items-center gap-3 text-xs text-muted-foreground">
                <span>ID: {selectedSatellite.id}</span>
                <span>Orbite: {selectedSatellite.orbit}</span>
              </div>
            </div>
            <div className="text-right">
              <div className="flex items-center gap-1">
                {selectedSatellite.status === "critical" ? (
                  <AlertTriangle className="h-4 w-4 text-threat-red" />
                ) : (
                  <CheckCircle className="h-4 w-4 text-secure-green" />
                )}
                <span
                  className={cn(
                    "text-sm font-medium",
                    selectedSatellite.status === "critical"
                      ? "text-threat-red"
                      : "text-secure-green"
                  )}
                >
                  {selectedSatellite.signalStrength}%
                </span>
              </div>
              <span className="text-xs text-muted-foreground">Signal</span>
            </div>
          </div>
          {/* Signal bar */}
          <div className="mt-2">
            <div className="data-bar">
              <div
                className={cn(
                  "data-bar-fill",
                  selectedSatellite.signalStrength > 80
                    ? "data-bar-fill-green"
                    : selectedSatellite.signalStrength > 50
                    ? "data-bar-fill-cyan"
                    : selectedSatellite.signalStrength > 30
                    ? "data-bar-fill-amber"
                    : "data-bar-fill-red"
                )}
                style={{ width: `${selectedSatellite.signalStrength}%` }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}