// src/types/satellite.ts

export enum DefenseAction {
  APPROVE = "approve",
  REJECT = "reject",
  EXECUTE_MANUAL = "execute_manual"
}

export interface DefenseRequest {
  request_id: string;
  satellite_id: string;
  threat_type: string;
  severity: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
  recommended_action: string;
  confidence: number;
  timestamp: string;
  status: "pending" | "approved" | "rejected" | "executed";
}

export interface SystemState {
  telemetry: any[];
  active_attacks: any[];
  system_status: {
    agents: Record<string, string>;
    system_status: string;
    knowledge_base: number;
  };
  human_intervention: {
    pending_requests: DefenseRequest[];
    count: number;
  };
}