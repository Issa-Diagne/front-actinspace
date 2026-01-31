// src/services/api.ts

const API_URL = "http://localhost:8000";

export const api = {
  // --- Dashboard & Santé ---
  getHealth: async () => {
    const res = await fetch(`${API_URL}/health`);
    return res.json();
  },
  getDashboardData: async () => {
    const res = await fetch(`${API_URL}/dashboard/data`);
    return res.json();
  },

  // --- Intervention Humaine (Human-in-the-loop) ---
  getPendingRequests: async () => {
    const res = await fetch(`${API_URL}/human/pending`);
    return res.json();
  },
  intervene: async (action: "approve" | "reject" | "execute_manual", requestId: string, reason?: string, manualDetails?: any) => {
    const res = await fetch(`${API_URL}/human/intervene`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action,
        request_id: requestId,
        reason,
        satellite_id: manualDetails?.satelliteId,
        manual_action: manualDetails?.action,
        approver: "operator_1" // Idéalement venant de l'auth
      }),
    });
    if (!res.ok) throw new Error("Erreur intervention");
    return res.json();
  },

  // --- Simulations d'Attaques ---
  startAttack: async (scenarioName: string, targetSat: string = "SAT-001") => {
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

  // --- Constellation ---
  getConstellationStatus: async () => {
    const res = await fetch(`${API_URL}/constellation/status`);
    return res.json();
  }
};