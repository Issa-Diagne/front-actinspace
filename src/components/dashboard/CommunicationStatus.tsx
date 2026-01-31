import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { Radio, ArrowUpDown, Activity, Wifi, WifiOff } from "lucide-react";

interface Channel {
  id: string;
  name: string;
  frequency: string;
  status: "active" | "standby" | "jammed" | "encrypted";
  bandwidth: number;
  latency: number;
}

const channels: Channel[] = [
  { id: "CH-1", name: "TTC Primary", frequency: "2.2 GHz", status: "encrypted", bandwidth: 95, latency: 12 },
  { id: "CH-2", name: "Payload Data", frequency: "8.1 GHz", status: "active", bandwidth: 78, latency: 45 },
  { id: "CH-3", name: "Backup Link", frequency: "1.5 GHz", status: "standby", bandwidth: 0, latency: 0 },
  { id: "CH-4", name: "Inter-Satellite", frequency: "26 GHz", status: "active", bandwidth: 88, latency: 8 },
  { id: "CH-5", name: "Emergency", frequency: "406 MHz", status: "jammed", bandwidth: 12, latency: 250 },
];

const statusConfig = {
  active: { color: "text-secure-green", bg: "bg-secure-green/10", label: "Actif" },
  standby: { color: "text-muted-foreground", bg: "bg-muted", label: "Veille" },
  jammed: { color: "text-threat-red", bg: "bg-threat-red/10", label: "Brouillé" },
  encrypted: { color: "text-primary", bg: "bg-primary/10", label: "Chiffré" },
};

export function CommunicationStatus() {
  const [dataFlow, setDataFlow] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setDataFlow((prev) => (prev + 1) % 100);
    }, 50);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="cyber-card rounded-xl border border-border p-4">
      {/* Header */}
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Radio className="h-5 w-5 text-primary" />
          <h3 className="font-orbitron text-sm font-semibold uppercase tracking-wider">
            Canaux de Communication
          </h3>
        </div>
        <div className="flex items-center gap-1">
          <Activity className="h-4 w-4 text-secure-green" />
          <span className="text-xs text-secure-green">4/5 Actifs</span>
        </div>
      </div>

      {/* Data flow animation */}
      <div className="mb-4 overflow-hidden rounded-lg bg-space-deep p-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Wifi className="h-4 w-4 text-primary" />
            <span className="text-xs text-muted-foreground">Flux de données</span>
          </div>
          <span className="font-mono text-xs text-primary">2.4 Gbps</span>
        </div>
        <div className="mt-2 h-1 overflow-hidden rounded-full bg-muted">
          <div
            className="h-full bg-gradient-to-r from-primary via-cyber-cyan to-primary animate-data-flow"
            style={{
              width: "200%",
              backgroundSize: "50% 100%",
            }}
          />
        </div>
      </div>

      {/* Channels list */}
      <div className="space-y-2">
        {channels.map((channel) => {
          const config = statusConfig[channel.status];
          
          return (
            <div
              key={channel.id}
              className={cn(
                "rounded-lg border border-border bg-secondary/30 p-3 transition-all hover:border-primary/30",
                channel.status === "jammed" && "border-threat-red/50"
              )}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div
                    className={cn(
                      "flex h-8 w-8 items-center justify-center rounded-lg",
                      config.bg
                    )}
                  >
                    {channel.status === "jammed" ? (
                      <WifiOff className={cn("h-4 w-4", config.color)} />
                    ) : (
                      <Wifi className={cn("h-4 w-4", config.color)} />
                    )}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-foreground">
                        {channel.name}
                      </span>
                      <span
                        className={cn(
                          "rounded px-1.5 py-0.5 text-[10px] font-medium",
                          config.bg,
                          config.color
                        )}
                      >
                        {config.label}
                      </span>
                    </div>
                    <span className="font-mono text-xs text-muted-foreground">
                      {channel.frequency}
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  {channel.status !== "standby" && channel.status !== "jammed" && (
                    <>
                      <div className="flex items-center justify-end gap-1">
                        <ArrowUpDown className="h-3 w-3 text-muted-foreground" />
                        <span className="font-mono text-xs text-foreground">
                          {channel.bandwidth}%
                        </span>
                      </div>
                      <span className="font-mono text-[10px] text-muted-foreground">
                        {channel.latency}ms
                      </span>
                    </>
                  )}
                  {channel.status === "jammed" && (
                    <span className="text-xs text-threat-red">⚠ Interférence</span>
                  )}
                </div>
              </div>
              {/* Bandwidth bar */}
              {channel.status !== "standby" && (
                <div className="mt-2">
                  <div className="data-bar">
                    <div
                      className={cn(
                        "data-bar-fill",
                        channel.status === "jammed"
                          ? "data-bar-fill-red"
                          : channel.bandwidth > 70
                          ? "data-bar-fill-green"
                          : "data-bar-fill-cyan"
                      )}
                      style={{ width: `${channel.bandwidth}%` }}
                    />
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
