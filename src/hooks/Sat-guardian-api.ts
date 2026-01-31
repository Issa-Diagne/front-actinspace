// sat-guardian-api.ts
// Client API compatible avec le backend main.py (SAT-GUARDIAN v2.0)

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';
const WS_BASE_URL = import.meta.env.VITE_WS_URL || 'ws://localhost:8000';

// ============================================
// TYPES (correspondant au backend main.py)
// ============================================

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
  sentinel?: {
    model_loaded: boolean;
    features: string[];
    last_detection: string;
  };
  analyst?: {
    model_loaded: boolean;
    threat_types: string[];
    last_analysis: string;
  };
  defender?: {
    resource_budget: number;
    actions_available: string[];
    efficiency: number;
  };
  coordinator?: {
    mode: string;
    pending_approvals: number;
    total_incidents: number;
  };
}

export interface ConstellationStatus {
  total_satellites: number;
  operational: number;
  under_attack: number;
  defended: number;
  satellites: Record<string, any>;
  last_update?: string;
}

export interface DashboardData {
  telemetry: TelemetryData[];
  active_attacks: any[];
  system_status: {
    agents: AgentStatus;
    system_status: string;
  };
  human_intervention: {
    pending_requests: DefenseRequest[];
    count: number;
    recent_decisions: any[];
  };
  timestamp: string;
}

export interface AttackRequest {
  scenario_name: string;
  target_satellite: string;
  duration?: number;
}

// ============================================
// CLIENT API
// ============================================

class SatGuardianAPI {
  private baseURL: string;
  private wsConnection: WebSocket | null = null;
  private wsMessageHandlers: Set<(data: any) => void> = new Set();
  private reconnectInterval: number = 5000;
  private shouldReconnect: boolean = true;

  constructor(baseURL: string = API_BASE_URL) {
    this.baseURL = baseURL;
  }

  // ============================================
  // MÉTHODES HTTP
  // ============================================

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
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.detail || `HTTP ${response.status}: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error(`❌ API Request Error (${endpoint}):`, error);
      throw error;
    }
  }

  // ============================================
  // HEALTH CHECK
  // ============================================

  async healthCheck() {
    return this.request<{
      status: string;
      timestamp: string;
      components: Record<string, string>;
      intervention_mode: {
        enabled: boolean;
        auto_approve_threshold: number;
        pending_requests: number;
      };
    }>('/health');
  }

  // ============================================
  // TÉLÉMÉTRIE
  // ============================================

  async processTelemetry(telemetry: TelemetryData) {
    return this.request<{
      success: boolean;
      report_id: string;
      incident_id: string;
      anomaly_detected: boolean;
      threat_analysis: ThreatAnalysis;
      requires_human_approval: boolean;
      defense_request: DefenseRequest | null;
      coordinator_recommendation: string;
      timestamp: string;
    }>('/telemetry/process', {
      method: 'POST',
      body: JSON.stringify(telemetry),
    });
  }

  // ============================================
  // CONSTELLATION
  // ============================================

  async getConstellationStatus() {
    return this.request<{
      success: boolean;
      constellation_status: ConstellationStatus;
      telemetry: TelemetryData[];
      timestamp: string;
    }>('/constellation/status');
  }

  // ============================================
  // HUMAN INTERVENTION (COMPATIBLE MAIN.PY)
  // ============================================

  async getHumanDashboard() {
    return this.request<{
      success: boolean;
      dashboard: {
        pending_requests: DefenseRequest[];
        recent_decisions: any[];
        statistics: any;
      };
      timestamp: string;
    }>('/human/dashboard');
  }

  async getPendingRequests() {
    return this.request<{
      success: boolean;
      count: number;
      requests: DefenseRequest[];
      timestamp: string;
    }>('/human/pending');
  }

  async getRequestDetails(requestId: string) {
    return this.request<{
      success: boolean;
      request: DefenseRequest;
      full_analysis: any;
      quick_actions: any[];
      timestamp: string;
    }>(`/human/request/${requestId}`);
  }

  async submitIntervention(intervention: HumanInterventionRequest) {
    return this.request<{
      success: boolean;
      message: string;
      result?: any;
      timestamp: string;
    }>('/human/intervene', {
      method: 'POST',
      body: JSON.stringify({
        ...intervention,
        approver: intervention.approver || 'operator'
      }),
    });
  }

  async getInterventionHistory(limit: number = 50) {
    return this.request<{
      success: boolean;
      count: number;
      history: any[];
      timestamp: string;
    }>(`/human/history?limit=${limit}`);
  }

  async getQuickActions(severity: string = 'medium') {
    return this.request<{
      success: boolean;
      actions: any[];
      timestamp: string;
    }>(`/human/quick-actions?severity=${severity}`);
  }

  // ============================================
  // ATTACKS
  // ============================================

  async startAttack(attack: AttackRequest) {
    return this.request<{
      success: boolean;
      scenario_id: string;
      message: string;
      timestamp: string;
    }>('/attack/start', {
      method: 'POST',
      body: JSON.stringify(attack),
    });
  }

  async getActiveAttacks() {
    return this.request<{
      success: boolean;
      active_attacks: any[];
      count: number;
      timestamp: string;
    }>('/attack/active');
  }

  async stopAttack(scenarioId: string) {
    return this.request<{
      success: boolean;
      message: string;
      timestamp: string;
    }>(`/attack/stop/${scenarioId}`, {
      method: 'DELETE',
    });
  }

  // ============================================
  // AGENTS STATUS
  // ============================================

  async getAgentsStatus() {
    return this.request<{
      success: boolean;
      agents: AgentStatus;
      system_status: any;
      timestamp: string;
    }>('/agents/status');
  }

  // ============================================
  // DASHBOARD DATA
  // ============================================

  async getDashboardData() {
    return this.request<{
      success: boolean;
      telemetry: TelemetryData[];
      constellation: ConstellationStatus;
      human_intervention: {
        required: boolean;
        pending_requests: DefenseRequest[];
        count: number;
      };
      agents: AgentStatus;
      timestamp: string;
    }>('/dashboard/data');
  }

  // ============================================
  // WEBSOCKET
  // ============================================

  connectWebSocket(onMessage?: (data: any) => void) {
    if (this.wsConnection?.readyState === WebSocket.OPEN) {
      console.log('✅ WebSocket already connected');
      return;
    }

    this.shouldReconnect = true;
    const wsUrl = `${WS_BASE_URL}/ws/notifications`;

    try {
      this.wsConnection = new WebSocket(wsUrl);

      this.wsConnection.onopen = () => {
        console.log('✅ WebSocket connected to SAT-GUARDIAN');
      };

      this.wsConnection.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          
          // Appeler tous les handlers enregistrés
          this.wsMessageHandlers.forEach(handler => {
            try {
              handler(data);
            } catch (error) {
              console.error('Error in WebSocket message handler:', error);
            }
          });
          
          // Appeler le handler spécifique si fourni
          if (onMessage) {
            onMessage(data);
          }
        } catch (error) {
          console.error('Error parsing WebSocket message:', error);
        }
      };

      this.wsConnection.onerror = (error) => {
        console.error('❌ WebSocket error:', error);
      };

      this.wsConnection.onclose = () => {
        console.log('🔌 WebSocket disconnected');
        this.wsConnection = null;

        // Auto-reconnect
        if (this.shouldReconnect) {
          console.log(`🔄 Reconnecting in ${this.reconnectInterval / 1000}s...`);
          setTimeout(() => this.connectWebSocket(onMessage), this.reconnectInterval);
        }
      };

      // Ping pour garder la connexion active
      const pingInterval = setInterval(() => {
        if (this.wsConnection?.readyState === WebSocket.OPEN) {
          this.wsConnection.send('ping');
        } else {
          clearInterval(pingInterval);
        }
      }, 30000);

    } catch (error) {
      console.error('Error connecting WebSocket:', error);
    }
  }

  disconnectWebSocket() {
    this.shouldReconnect = false;
    if (this.wsConnection) {
      this.wsConnection.close();
      this.wsConnection = null;
    }
  }

  onWebSocketMessage(handler: (data: any) => void) {
    this.wsMessageHandlers.add(handler);
  }

  offWebSocketMessage(handler: (data: any) => void) {
    this.wsMessageHandlers.delete(handler);
  }

  sendWebSocketMessage(message: any) {
    if (this.wsConnection?.readyState === WebSocket.OPEN) {
      this.wsConnection.send(JSON.stringify(message));
    } else {
      console.warn('⚠️ WebSocket not connected, cannot send message');
    }
  }

  get isWebSocketConnected(): boolean {
    return this.wsConnection?.readyState === WebSocket.OPEN;
  }
}

// Export singleton instance
export const satGuardianAPI = new SatGuardianAPI();

// Export default
export default satGuardianAPI;