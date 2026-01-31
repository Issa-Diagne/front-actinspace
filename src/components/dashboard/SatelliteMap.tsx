import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { Satellite, AlertTriangle, CheckCircle, Radio } from "lucide-react";

// On exporte l'interface pour l'utiliser dans la page parente
export interface SatelliteData {
  id: string;
  name: string;
  status: "online" | "warning" | "critical" | "offline";
  position: { x: number; y: number };
  signalStrength: number;
  orbit: string;
  details?: {
    cpu: number;
    ram: number;
    temp: number;
  }
}

const statusColors = {
  online: "bg-green-500",
  warning: "bg-orange-500",
  critical: "bg-red-500",
  offline: "bg-gray-500",
};

const statusGlow = {
  online: "shadow-[0_0_10px_#22c55e]",
  warning: "shadow-[0_0_10px_#f97316]",
  critical: "shadow-[0_0_15px_#ef4444] animate-pulse",
  offline: "",
};

// Le composant accepte maintenant les données en props
export function SatelliteMap({ satellites }: { satellites: SatelliteData[] }) {
  const [selectedSatellite, setSelectedSatellite] = useState<SatelliteData | null>(null);

  // Mise à jour de la sélection si le satellite change de statut
  useEffect(() => {
    if (selectedSatellite) {
      const updated = satellites.find(s => s.id === selectedSatellite.id);
      if (updated) setSelectedSatellite(updated);
    }
  }, [satellites, selectedSatellite]);

  const counts = {
    online: satellites.filter(s => s.status === "online").length,
    warning: satellites.filter(s => s.status === "warning").length,
    critical: satellites.filter(s => s.status === "critical").length
  };

  return (
    <div className="cyber-card relative overflow-hidden rounded-xl border border-border p-3 h-full flex flex-col">
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
            <span className="h-2 w-2 rounded-full bg-green-500" />
            <span className="text-muted-foreground">{counts.online}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-orange-500" />
            <span className="text-muted-foreground">{counts.warning}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-red-500" />
            <span className="text-muted-foreground">{counts.critical}</span>
          </div>
        </div>
      </div>

      {/* Map Container */}
      <div className="relative flex-1 min-h-[250px] w-full overflow-hidden rounded-lg bg-[#0a0a1a]">
        {/* Grid overlay */}
        <div className="absolute inset-0 opacity-20" 
             style={{ backgroundImage: 'linear-gradient(#333 1px, transparent 1px), linear-gradient(90deg, #333 1px, transparent 1px)', backgroundSize: '20px 20px' }} 
        />
        
        {/* World map outline (simplified CSS based) */}
        <svg className="absolute inset-0 h-full w-full opacity-20 pointer-events-none" viewBox="0 0 100 50" preserveAspectRatio="none">
           <path d="M0,25 Q25,20 50,25 T100,25" fill="none" stroke="hsl(var(--primary))" strokeWidth="0.2" />
           <ellipse cx="50" cy="25" rx="30" ry="15" fill="none" stroke="hsl(var(--primary))" strokeWidth="0.1" strokeDasharray="2,2"/>
        </svg>

        {/* Satellites */}
        {satellites.map((sat) => (
          <div
            key={sat.id}
            className={cn(
              "absolute cursor-pointer transition-all duration-300 hover:scale-125 hover:z-20",
              selectedSatellite?.id === sat.id && "scale-125 z-10"
            )}
            style={{ left: `${sat.position.x}%`, top: `${sat.position.y}%` }}
            onClick={() => setSelectedSatellite(sat)}
          >
            <div
              className={cn(
                "h-3 w-3 rounded-full transition-all border border-background",
                statusColors[sat.status],
                statusGlow[sat.status]
              )}
            />
            {sat.status === "critical" && (
              <div className="absolute inset-0 animate-ping rounded-full bg-red-500 opacity-50" />
            )}
            
            {/* Label on hover or selected */}
            {(selectedSatellite?.id === sat.id) && (
               <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-black/80 text-[10px] px-2 py-0.5 rounded border border-primary/30 whitespace-nowrap">
                  {sat.name}
               </div>
            )}
          </div>
        ))}
      </div>

      {/* Selected Satellite Info */}
      {selectedSatellite && (
        <div className="mt-3 rounded-lg bg-secondary/30 p-2.5 animate-in slide-in-from-bottom-2">
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-2">
                <span className={cn("h-2 w-2 rounded-full", statusColors[selectedSatellite.status])} />
                <span className="font-mono text-sm font-semibold">{selectedSatellite.name}</span>
              </div>
              <div className="mt-1 flex gap-4 text-xs text-muted-foreground">
                <span>CPU: <span className={selectedSatellite.details?.cpu! > 80 ? "text-red-400" : ""}>{selectedSatellite.details?.cpu?.toFixed(0)}%</span></span>
                <span>RAM: {selectedSatellite.details?.ram?.toFixed(0)}%</span>
                <span>TEMP: {selectedSatellite.details?.temp?.toFixed(0)}°C</span>
              </div>
            </div>
            <div className="text-right">
              <div className="flex items-center justify-end gap-1">
                 <span className={cn("text-lg font-bold", selectedSatellite.status === "critical" ? "text-red-500" : "text-green-500")}>
                  {selectedSatellite.signalStrength}%
                 </span>
                 <Radio className="h-3 w-3 text-muted-foreground"/>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}