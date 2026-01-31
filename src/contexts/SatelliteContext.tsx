// src/contexts/SatelliteContext.tsx
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { api } from '@/services/api';
import { DefenseRequest, SystemState } from '@/types/satellite';
import { toast } from "sonner"; // Assurez-vous d'avoir installé sonner ou supprimez cette ligne

interface SatelliteContextType {
  systemState: SystemState | null;
  pendingApprovals: DefenseRequest[];
  activeAttacks: any[];
  isConnected: boolean;
  refreshData: () => Promise<void>;
  sendIntervention: (id: string, action: 'approve' | 'reject') => Promise<void>;
  launchAttack: (type: string, target: string) => Promise<void>;
  stopSimulation: (id: string) => Promise<void>;
  attackHistory: any[];
}

const SatelliteContext = createContext<SatelliteContextType>({} as SatelliteContextType);

export const SatelliteProvider = ({ children }: { children: React.ReactNode }) => {
  const [systemState, setSystemState] = useState<SystemState | null>(null);
  // INITIALISATION IMPORTANTE À [] POUR ÉVITER LE CRASH
  const [pendingApprovals, setPendingApprovals] = useState<DefenseRequest[]>([]);
  const [activeAttacks, setActiveAttacks] = useState<any[]>([]);
  const [isConnected, setIsConnected] = useState(false);
    const [attackHistory, setAttackHistory] = useState<any[]>([]);

  // 1. Fonction de chargement des données
  const refreshData = useCallback(async () => {
    const data = await api.getDashboardData();
    if (data) {
      setSystemState(data);
      // Sécurité : Si data.human_intervention est null, on met []
      setPendingApprovals(data.human_intervention?.pending_requests || []);
      setActiveAttacks(data.active_attacks || []);
      setAttackHistory(data.attack_history || []);
    }
  }, []);

  const stopSimulation = async (id: string) => {
    await api.stopAttack(id);
    toast.info("Simulation arrêtée");
    refreshData();
  };

  // 2. WebSocket
  useEffect(() => {
    let ws: WebSocket;
    try {
      ws = new WebSocket("ws://localhost:8000/ws/notifications");

      ws.onopen = () => {
        console.log("🟢 WebSocket Connecté");
        setIsConnected(true);
        refreshData();
      };

      ws.onmessage = (event) => {
        const msg = JSON.parse(event.data);
        if (msg.type === "new_pending_request") {
          toast.warning("Nouvelle menace détectée !");
          refreshData();
        } else if (msg.type === "request_approved" || msg.type === "request_rejected") {
          refreshData();
        }
      };

      ws.onclose = () => setIsConnected(false);
    } catch (e) {
      console.error("WS Error", e);
    }

    // Polling de secours (toutes les 3s)
    const interval = setInterval(refreshData, 3000);

    return () => {
      if (ws) ws.close();
      clearInterval(interval);
    };
  }, [refreshData]);

  // 3. Actions
  const sendIntervention = async (id: string, action: 'approve' | 'reject') => {
    try {
      await api.intervene(action, id);
      toast.success(`Action ${action === 'approve' ? 'approuvée' : 'rejetée'}`);
      // Optimistic update pour fluidité
      setPendingApprovals(prev => prev.filter(req => req.request_id !== id));
    } catch (e) {
      toast.error("Erreur lors de l'envoi");
    }
  };

  const launchAttack = async (type: string, target: string) => {
    await api.startAttack(type, target);
    toast.error(`Attaque lancée : ${type}`);
    refreshData();
  };

  return (
    <SatelliteContext.Provider value={{ 
      systemState, pendingApprovals, activeAttacks, isConnected, 
      refreshData, sendIntervention, launchAttack, stopSimulation, attackHistory 
    }}>
      {children}
    </SatelliteContext.Provider>
  );
};

export const useSatelliteSystem = () => useContext(SatelliteContext);