import { MainLayout } from "@/components/layout/MainLayout";
import { useSatelliteSystem } from "@/contexts/SatelliteContext";
import { Satellite, Activity, Thermometer, Cpu } from "lucide-react";
import { cn } from "@/lib/utils";

const SatellitesPage = () => {
  const { systemState } = useSatelliteSystem();
  const satellites = systemState?.telemetry || [];

  return (
    <MainLayout
      title="Constellation Satellite"
      subtitle="Télémétrie temps réel des actifs spatiaux"
    >
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {satellites.length === 0 ? (
          <div className="col-span-full text-center py-10 text-muted-foreground">
            En attente de données de télémétrie...
          </div>
        ) : (
          satellites.map((sat: any) => (
            <div key={sat.satellite_id} className="cyber-card rounded-xl border border-border p-5 relative overflow-hidden">
              {/* Status Header */}
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-primary/10">
                    <Satellite className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg">{sat.satellite_id}</h3>
                    <div className="flex items-center gap-1.5">
                      <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                      </span>
                      <span className="text-xs text-muted-foreground">Signal Nominal</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Telemetry Grid */}
              <div className="space-y-4">
                {/* CPU */}
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="flex items-center gap-1 text-muted-foreground"><Cpu size={12}/> CPU</span>
                    <span className={cn("font-mono font-bold", sat.cpu_usage > 80 ? "text-red-500" : "text-foreground")}>
                      {sat.cpu_usage.toFixed(1)}%
                    </span>
                  </div>
                  <div className="h-1.5 w-full bg-secondary rounded-full overflow-hidden">
                    <div 
                      className={cn("h-full transition-all duration-500", sat.cpu_usage > 80 ? "bg-red-500" : "bg-primary")} 
                      style={{ width: `${sat.cpu_usage}%` }}
                    />
                  </div>
                </div>

                {/* Memory */}
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="flex items-center gap-1 text-muted-foreground"><Activity size={12}/> RAM</span>
                    <span className="font-mono font-bold">{sat.memory_usage.toFixed(1)}%</span>
                  </div>
                  <div className="h-1.5 w-full bg-secondary rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-blue-500 transition-all duration-500" 
                      style={{ width: `${sat.memory_usage}%` }}
                    />
                  </div>
                </div>

                {/* Temperature */}
                <div className="flex items-center justify-between pt-2 border-t border-border/50">
                  <span className="text-xs text-muted-foreground flex items-center gap-1">
                    <Thermometer size={14}/> Température
                  </span>
                  <span className={cn("font-mono text-sm", sat.temperature > 80 ? "text-red-500 font-bold" : "text-foreground")}>
                    {sat.temperature.toFixed(1)}°C
                  </span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </MainLayout>
  );
};

export default SatellitesPage;