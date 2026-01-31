// sat-guardian-api.ts
// Service API pour communiquer avec le backend Python FastAPI

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

// Types
export interface TelemetryData {
  satellite_id: string;
  cpu_usage: number;
  memory_usage: number;
  temperature: number;
  data_rate: number;
  packet_loss?: number;
  timestamp?: string;
  status?: string;
  position?: {
    latitude: number;
    longitude: number;
    altitude: number;
    velocity: number;
  };
}

export interface ThreatAnalysis {
  threat_type: string;
  confidence: number;
  severity: number;
  recommended_action: string;
}

export interface DefenseRequest {
  request_id: string;
  satellite_id: string;
  threat_analysis: ThreatAnalysis;
  recommended_action: string;
  severity: string;
  requires_approval: boolean;
  timestamp: string;
}

export interface HumanInterventionRequest {
  action: 'approve' | 'reject' | 'execute_manual';
  request_id?: string;
  satellite_id?: string;
  manual_action?: string;
  parameters?: Record<string, any>;
  reason?: string;
  approver?: string;
}

export interface AgentStatus {
  sentinel: {
    model_loaded: boolean;
    features: string[];
    last_detection: string;
  };
  analyst: {
    model_loaded: boolean;
    threat_types: string[];
    last_analysis: string;
  };
  defender: {
    resource_budget: number;
    actions_available: string[];
    efficiency: number;
  };
  coordinator: {
    mode: string;
    pending_approvals: number;
    total_incidents: number;
  };
}

export interface DashboardData {
  telemetry: TelemetryData[];
  active_attacks: any[];
  system_status: {
    agents: AgentStatus;
    system_status: string;
    knowledge_base: any;
  };
  attack_statistics: any;
  human_intervention: {
    pending_requests: DefenseRequest[];
    count: number;
    recent_decisions: any[];
  };
  timestamp: string;
}

export interface ConstellationStatus {
  total_satellites: number;
  operational: number;
  under_attack: number;
  satellites: Record<string, any>;
}

export interface AttackRequest {
  scenario_name: string;
  target_satellite: string;
  duration?: number;
}

// API Client
class SatGuardianAPI {
  private baseURL: string;
  private wsConnection: WebSocket | null = null;
  private wsCallbacks: Array<(data: any) => void> = [];

  constructor(baseURL: string = API_BASE_URL) {
    this.baseURL = baseURL;
  }

  // Méthodes génériques
  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;
    
    try {
      const response = await fetch(url, {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
      });

      if (!response.ok) {
        const error = await response.json().catch(() => ({ detail: 'Unknown error' }));
        throw new Error(error.detail || `HTTP ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error(`API Error [${endpoint}]:`, error);
      throw error;
    }
  }

  // Health Check
  async healthCheck() {
    return this.request('/health');
  }

  // Télémétrie
  async processTelemetry(telemetry: TelemetryData) {
    return this.request('/telemetry/process', {
      method: 'POST',
      body: JSON.stringify(telemetry),
    });
  }

  // Constellation
  async getConstellationStatus(): Promise<{
    constellation_status: ConstellationStatus;
    telemetry: TelemetryData[];
    timestamp: string;
  }> {
    return this.request('/constellation/status');
  }

  // Human Intervention
  async getHumanDashboard() {
    return this.request('/human/dashboard');
  }

  async getPendingRequests(): Promise<{
    success: boolean;
    count: number;
    requests: DefenseRequest[];
    timestamp: string;
  }> {
    return this.request('/human/pending');
  }

  async getRequestDetails(requestId: string) {
    return this.request(`/human/request/${requestId}`);
  }

  async submitIntervention(intervention: HumanInterventionRequest) {
    return this.request('/human/intervene', {
      method: 'POST',
      body: JSON.stringify(intervention),
    });
  }

  async getInterventionHistory(limit: number = 50) {
    return this.request(`/human/history?limit=${limit}`);
  }

  async getQuickActions(severity: string = 'medium') {
    return this.request(`/human/quick-actions?severity=${severity}`);
  }

  // Attacks
  async startAttack(attack: AttackRequest) {
    return this.request('/attack/start', {
      method: 'POST',
      body: JSON.stringify(attack),
    });
  }

  async getActiveAttacks() {
    return this.request('/attack/active');
  }

  async stopAttack(scenarioId: string) {
    return this.request(`/attack/stop/${scenarioId}`, {
      method: 'DELETE',
    });
  }

  // Agents
  async getAgentsStatus(): Promise<{
    agents: AgentStatus;
    system_status: any;
    knowledge_base: any;
    human_interface: any;
    timestamp: string;
  }> {
    return this.request('/agents/status');
  }

  // Dashboard
  async getDashboardData(): Promise<DashboardData> {
    return this.request('/dashboard/data');
  }

  // WebSocket pour notifications en temps réel
  connectWebSocket(onMessage: (data: any) => void) {
    if (this.wsConnection?.readyState === WebSocket.OPEN) {
      console.log('WebSocket already connected');
      return;
    }

    const wsURL = this.baseURL.replace('http', 'ws') + '/ws/notifications';
    
    try {
      this.wsConnection = new WebSocket(wsURL);
      
      this.wsConnection.onopen = () => {
        console.log('✅ WebSocket connected');
      };

      this.wsConnection.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          onMessage(data);
          this.wsCallbacks.forEach(callback => callback(data));
        } catch (error) {
          console.error('WebSocket message error:', error);
        }
      };

      this.wsConnection.onerror = (error) => {
        console.error('WebSocket error:', error);
      };

      this.wsConnection.onclose = () => {
        console.log('WebSocket disconnected');
        // Reconnexion automatique après 5 secondes
        setTimeout(() => {
          console.log('Reconnecting WebSocket...');
          this.connectWebSocket(onMessage);
        }, 5000);
      };

      // Ping pour garder la connexion active
      setInterval(() => {
        if (this.wsConnection?.readyState === WebSocket.OPEN) {
          this.wsConnection.send('ping');
        }
      }, 30000);

    } catch (error) {
      console.error('WebSocket connection error:', error);
    }
  }

  disconnectWebSocket() {
    if (this.wsConnection) {
      this.wsConnection.close();
      this.wsConnection = null;
    }
  }

  onWebSocketMessage(callback: (data: any) => void) {
    this.wsCallbacks.push(callback);
  }

  offWebSocketMessage(callback: (data: any) => void) {
    this.wsCallbacks = this.wsCallbacks.filter(cb => cb !== callback);
  }
}

// Export singleton
export const satGuardianAPI = new SatGuardianAPI();
export default satGuardianAPI;