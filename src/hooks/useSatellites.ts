// useSatellites.ts
import { useState, useEffect, useCallback } from 'react';
import { satGuardianAPI, TelemetryData, ConstellationStatus } from '@/lib/sat-guardian-api';

export interface Satellite {
  id: string;
  name: string;
  status: 'online' | 'warning' | 'critical' | 'offline';
  orbit: string;
  altitude: string;
  velocity: string;
  signal: number;
  telemetry: {
    cpu_usage: number;
    memory_usage: number;
    temperature: number;
    data_rate: number;
    packet_loss: number;
    power_level?: number;
    signal_strength?: number;
  };
  position?: {
    latitude: number;
    longitude: number;
    altitude: number;
    velocity: number;
  };
  lastUpdate: string;
}

export function useSatellites() {
  const [satellites, setSatellites] = useState<Satellite[]>([]);
  const [constellationStatus, setConstellationStatus] = useState<ConstellationStatus | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Convertir les données de télémétrie du backend en format satellite
  const convertTelemetryToSatellite = useCallback((telemetry: TelemetryData): Satellite => {
    // Déterminer le statut basé sur les métriques
    let status: 'online' | 'warning' | 'critical' | 'offline' = 'online';
    
    if (telemetry.cpu_usage > 90 || telemetry.memory_usage > 90 || telemetry.temperature > 50) {
      status = 'critical';
    } else if (telemetry.cpu_usage > 75 || telemetry.memory_usage > 80 || telemetry.temperature > 40) {
      status = 'warning';
    } else if (telemetry.status === 'UNDER_ATTACK') {
      status = 'critical';
    }

    // Calculer le signal basé sur la performance globale
    const signal = Math.round(
      100 - (
        (telemetry.cpu_usage * 0.3) +
        (telemetry.memory_usage * 0.3) +
        (telemetry.temperature * 0.4)
      ) / 3
    );

    return {
      id: telemetry.satellite_id,
      name: getSatelliteName(telemetry.satellite_id),
      status,
      orbit: telemetry.position ? getOrbitType(telemetry.position.altitude) : 'LEO',
      altitude: telemetry.position ? `${Math.round(telemetry.position.altitude)} km` : 'N/A',
      velocity: telemetry.position ? `${telemetry.position.velocity.toFixed(1)} km/s` : 'N/A',
      signal: Math.max(0, Math.min(100, signal)),
      telemetry: {
        cpu_usage: telemetry.cpu_usage,
        memory_usage: telemetry.memory_usage,
        temperature: telemetry.temperature,
        data_rate: telemetry.data_rate,
        packet_loss: telemetry.packet_loss || 0,
      },
      position: telemetry.position,
      lastUpdate: telemetry.timestamp || new Date().toISOString(),
    };
  }, []);

  // Obtenir le nom du satellite basé sur son ID
  const getSatelliteName = (id: string): string => {
    const names: Record<string, string> = {
      'SAT-001': 'SENTINEL-1A',
      'SAT-002': 'COPERNICUS-2',
      'SAT-003': 'GALILEO-E14',
      'SAT-004': 'EUTELSAT-KA1',
      'SAT-005': 'COSMO-SKY-4',
    };
    return names[id] || id;
  };

  // Déterminer le type d'orbite basé sur l'altitude
  const getOrbitType = (altitude: number): string => {
    if (altitude < 2000) return 'LEO';
    if (altitude < 35000) return 'MEO';
    return 'GEO';
  };

  // Charger les données de la constellation
  const loadConstellationData = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      const data = await satGuardianAPI.getConstellationStatus();
      
      // Convertir les données de télémétrie en satellites
      const sats = data.telemetry.map(convertTelemetryToSatellite);
      setSatellites(sats);
      
      setConstellationStatus(data.constellation_status);

    } catch (err) {
      console.error('Error loading constellation data:', err);
      setError(err instanceof Error ? err.message : 'Failed to load constellation data');
    } finally {
      setIsLoading(false);
    }
  }, [convertTelemetryToSatellite]);

  // Obtenir un satellite spécifique
  const getSatellite = useCallback((satelliteId: string) => {
    return satellites.find(sat => sat.id === satelliteId);
  }, [satellites]);

  // Filtrer les satellites par statut
  const getSatellitesByStatus = useCallback((status: Satellite['status']) => {
    return satellites.filter(sat => sat.status === status);
  }, [satellites]);

  // Obtenir les statistiques de la constellation
  const getConstellationStats = useCallback(() => {
    const total = satellites.length;
    const online = satellites.filter(s => s.status === 'online').length;
    const warning = satellites.filter(s => s.status === 'warning').length;
    const critical = satellites.filter(s => s.status === 'critical').length;
    const offline = satellites.filter(s => s.status === 'offline').length;

    const avgSignal = satellites.length > 0
      ? satellites.reduce((sum, s) => sum + s.signal, 0) / satellites.length
      : 0;

    const avgCPU = satellites.length > 0
      ? satellites.reduce((sum, s) => sum + s.telemetry.cpu_usage, 0) / satellites.length
      : 0;

    const avgMemory = satellites.length > 0
      ? satellites.reduce((sum, s) => sum + s.telemetry.memory_usage, 0) / satellites.length
      : 0;

    return {
      total,
      online,
      warning,
      critical,
      offline,
      avgSignal: Math.round(avgSignal),
      avgCPU: Math.round(avgCPU),
      avgMemory: Math.round(avgMemory),
    };
  }, [satellites]);

  // Charger les données au montage et rafraîchir régulièrement
  useEffect(() => {
    loadConstellationData();

    // Rafraîchir toutes les 5 secondes
    const interval = setInterval(loadConstellationData, 5000);

    return () => clearInterval(interval);
  }, [loadConstellationData]);

  // Connexion WebSocket pour les mises à jour en temps réel
  useEffect(() => {
    const handleWebSocketMessage = (data: any) => {
      if (data.type === 'telemetry_update' || data.type === 'satellite_status_change') {
        loadConstellationData();
      }
    };

    satGuardianAPI.onWebSocketMessage(handleWebSocketMessage);

    return () => {
      satGuardianAPI.offWebSocketMessage(handleWebSocketMessage);
    };
  }, [loadConstellationData]);

  return {
    satellites,
    constellationStatus,
    isLoading,
    error,
    getSatellite,
    getSatellitesByStatus,
    getConstellationStats,
    refreshData: loadConstellationData,
  };
}