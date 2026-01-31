// src/services/api.ts

const API_URL = "http://localhost:8000";

export const api = {
  // ... (Garder les fonctions existantes getDashboardData, intervene, startAttack, stopAttack) ...

  getDashboardData: async () => {
     try {
       const res = await fetch(`${API_URL}/dashboard/data`);
       if (!res.ok) throw new Error("Erreur réseau");
       return await res.json();
     } catch (error) {
       console.error("API Error:", error);
       return null;
     }
  },

  intervene: async (action: string, requestId: string, reason?: string) => {
    // ... (code existant)
    const res = await fetch(`${API_URL}/human/intervene`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action,
        request_id: requestId,
        reason,
        approver: "OPERATOR-MAIN"
      }),
    });
    return res.json();
  },

  startAttack: async (scenarioName: string, targetSat: string = "SAT-001") => {
    // ... (code existant)
    const res = await fetch(`${API_URL}/attack/start`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        scenario_name: scenarioName,
        target_satellite: targetSat,
        duration: 60
      }),
    });
    return res.json();
  },

  stopAttack: async (scenarioId: string) => {
      const res = await fetch(`${API_URL}/attack/stop/${scenarioId}`, { method: "DELETE" });
      return res.json();
  },

  // --- NOUVELLES FONCTIONS À AJOUTER ---

  // 1. Récupérer l'historique des interventions humaines
  getInterventionHistory: async (limit: int = 50) => {
    const res = await fetch(`${API_URL}/human/history?limit=${limit}`);
    return res.json();
  },

  // 2. Récupérer les actions rapides suggérées
  getQuickActions: async (severity: string = "high") => {
    const res = await fetch(`${API_URL}/human/quick-actions?severity=${severity}`);
    return res.json();
  },

  // 3. Exécuter une action manuelle (via Quick Actions)
  executeManualAction: async (satelliteId: string, actionId: string) => {
    const res = await fetch(`${API_URL}/human/intervene`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action: "execute_manual",
        satellite_id: satelliteId,
        manual_action: actionId,
        approver: "OPERATOR-MANUAL"
      }),
    });
    return res.json();
  }
};