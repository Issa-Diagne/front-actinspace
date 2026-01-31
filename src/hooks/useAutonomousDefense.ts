// useAutonomousDefense.ts
import { useState, useEffect, useCallback } from 'react';
import { satGuardianAPI } from '@/lib/sat-guardian-api';

interface Analysis {
  id: string;
  type: string;
  target: string;
  confidence: number;
  recommendedAction: string;
  autoResponse: boolean;
  timestamp: string;
  severity: number;
}

interface Action {
  id: string;
  action: string;
  status: 'pending' | 'in_progress' | 'completed' | 'failed';
  result: string;
  timestamp: string;
}

interface Metrics {
  totalThreatsAnalyzed: number;
  successfulActions: number;
  failedActions: number;
  averageConfidence: number;
  averageResponseTime: number;
}

interface PendingRequest {
  request_id: string;
  satellite_id: string;
  threat_analysis: {
    threat_type: string;
    confidence: number;
    severity: number;
    recommended_action: string;
  };
  recommended_action: string;
  severity: string;
  requires_approval: boolean;
  timestamp: string;
}

export function useAutonomousDefense() {
  const [isEnabled, setIsEnabled] = useState(true);
  const [confidenceThreshold, setConfidenceThreshold] = useState(0.75);
  const [analyses, setAnalyses] = useState<Analysis[]>([]);
  const [actions, setActions] = useState<Action[]>([]);
  const [pendingRequests, setPendingRequests] = useState<PendingRequest[]>([]);
  const [metrics, setMetrics] = useState<Metrics>({
    totalThreatsAnalyzed: 0,
    successfulActions: 0,
    failedActions: 0,
    averageConfidence: 0,
    averageResponseTime: 0,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Charger les données du dashboard
  const loadDashboardData = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      const data = await satGuardianAPI.getDashboardData();
      
      // Convertir les données du backend en format frontend
      if (data.human_intervention?.pending_requests) {
        const newAnalyses: Analysis[] = data.human_intervention.pending_requests.map((req: any) => ({
          id: req.request_id,
          type: req.threat_analysis?.threat_type || 'unknown',
          target: req.satellite_id,
          confidence: req.threat_analysis?.confidence || 0,
          recommendedAction: req.recommended_action,
          autoResponse: !req.requires_approval,
          timestamp: req.timestamp,
          severity: req.threat_analysis?.severity || 0,
        }));

        setAnalyses(prev => [...newAnalyses, ...prev].slice(0, 50));
      }

      // Mettre à jour les métriques
      const agentsStatus = await satGuardianAPI.getAgentsStatus();
      
      setMetrics({
        totalThreatsAnalyzed: data.human_intervention?.pending_requests?.length || 0,
        successfulActions: agentsStatus.agents?.defender?.efficiency 
          ? Math.round(agentsStatus.agents.defender.efficiency * 100) 
          : 0,
        failedActions: 0,
        averageConfidence: 0.85,
        averageResponseTime: 1.2,
      });

      // Charger les requêtes en attente
      const pending = await satGuardianAPI.getPendingRequests();
      setPendingRequests(pending.requests || []);

    } catch (err) {
      console.error('Error loading dashboard data:', err);
      setError(err instanceof Error ? err.message : 'Failed to load data');
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Approuver une action
  const approveAction = useCallback(async (requestId: string, reason?: string) => {
    try {
      const result = await satGuardianAPI.submitIntervention({
        action: 'approve',
        request_id: requestId,
        reason: reason || 'Approved by operator',
        approver: 'operator',
      });

      if (result.success) {
        // Ajouter l'action aux actions réussies
        const request = pendingRequests.find(r => r.request_id === requestId);
        if (request) {
          setActions((prev: Action[]) => [{
            id: requestId,
            action: request.recommended_action,
            status: 'completed',
            result: 'Action executed successfully',
            timestamp: new Date().toISOString(),
          }, ...prev].slice(0, 50));

          setMetrics(prev => ({
            ...prev,
            successfulActions: prev.successfulActions + 1,
          }));
        }

        // Retirer de la liste des requêtes en attente
        setPendingRequests(prev => prev.filter(r => r.request_id !== requestId));
        
        // Recharger les données
        await loadDashboardData();
      }

      return result;
    } catch (err) {
      console.error('Error approving action:', err);
      throw err;
    }
  }, [pendingRequests, loadDashboardData]);

  // Rejeter une action
  const rejectAction = useCallback(async (requestId: string, reason: string) => {
    try {
      const result = await satGuardianAPI.submitIntervention({
        action: 'reject',
        request_id: requestId,
        reason,
        approver: 'operator',
      });

      if (result.success) {
        const request = pendingRequests.find(r => r.request_id === requestId);
        if (request) {
          setActions((prev: Action[]) => [{
            id: requestId,
            action: request.recommended_action,
            status: 'failed',
            result: `Rejected: ${reason}`,
            timestamp: new Date().toISOString(),
          }, ...prev].slice(0, 50));

          setMetrics(prev => ({
            ...prev,
            failedActions: prev.failedActions + 1,
          }));
        }

        setPendingRequests(prev => prev.filter(r => r.request_id !== requestId));
        await loadDashboardData();
      }

      return result;
    } catch (err) {
      console.error('Error rejecting action:', err);
      throw err;
    }
  }, [pendingRequests, loadDashboardData]);

  // Exécuter une action manuelle
  const executeManualAction = useCallback(async (
    satelliteId: string,
    action: string,
    parameters?: Record<string, any>
  ) => {
    try {
      const result = await satGuardianAPI.submitIntervention({
        action: 'execute_manual',
        satellite_id: satelliteId,
        manual_action: action,
        parameters,
        approver: 'operator',
      });

      if (result.success) {
        setActions((prev: Action[]) => [{
          id: `manual_${Date.now()}`,
          action,
          status: 'completed',
          result: 'Manual action executed',
          timestamp: new Date().toISOString(),
        }, ...prev].slice(0, 50));

        setMetrics(prev => ({
          ...prev,
          successfulActions: prev.successfulActions + 1,
        }));

        await loadDashboardData();
      }

      return result;
    } catch (err) {
      console.error('Error executing manual action:', err);
      throw err;
    }
  }, [loadDashboardData]);

  // Simuler une analyse (pour les tests sans backend)
  const simulateAnalysis = useCallback((threatType: string = 'cpu_exhaustion') => {
    const newAnalysis: Analysis = {
      id: `analysis_${Date.now()}`,
      type: threatType,
      target: `SAT-${String(Math.floor(Math.random() * 5) + 1).padStart(3, '0')}`,
      confidence: 0.7 + Math.random() * 0.25,
      recommendedAction: 'throttle_processes',
      autoResponse: Math.random() > 0.5,
      timestamp: new Date().toISOString(),
      severity: Math.floor(Math.random() * 10) + 1,
    };

    setAnalyses(prev => [newAnalysis, ...prev].slice(0, 50));
    setMetrics(prev => ({
      ...prev,
      totalThreatsAnalyzed: prev.totalThreatsAnalyzed + 1,
      averageConfidence: (prev.averageConfidence * prev.totalThreatsAnalyzed + newAnalysis.confidence) / (prev.totalThreatsAnalyzed + 1),
    }));

    if (newAnalysis.confidence >= confidenceThreshold && isEnabled) {
      setTimeout(() => {
        setActions((prev: Action[]) => [{
          id: `action_${Date.now()}`,
          action: newAnalysis.recommendedAction,
          status: 'completed',
          result: 'Threat neutralized successfully',
          timestamp: new Date().toISOString(),
        }, ...prev].slice(0, 50));

        setMetrics(prev => ({
          ...prev,
          successfulActions: prev.successfulActions + 1,
        }));
      }, 1000);
    }
  }, [confidenceThreshold, isEnabled]);

  // Charger les données au montage
  useEffect(() => {
    loadDashboardData();

    // Rafraîchir toutes les 10 secondes
    const interval = setInterval(loadDashboardData, 10000);

    return () => clearInterval(interval);
  }, [loadDashboardData]);

  // Connexion WebSocket pour les notifications en temps réel
  useEffect(() => {
    const handleWebSocketMessage = (data: any) => {
      console.log('WebSocket message:', data);

      if (data.type === 'new_pending_request') {
        // Nouvelle requête en attente
        loadDashboardData();
      } else if (data.type === 'manual_action_executed') {
        // Action manuelle exécutée
        loadDashboardData();
      }
    };

    satGuardianAPI.connectWebSocket(handleWebSocketMessage);
    satGuardianAPI.onWebSocketMessage(handleWebSocketMessage);

    return () => {
      satGuardianAPI.offWebSocketMessage(handleWebSocketMessage);
    };
  }, [loadDashboardData]);

  return {
    isEnabled,
    setIsEnabled,
    confidenceThreshold,
    setConfidenceThreshold,
    analyses,
    actions,
    pendingRequests,
    metrics,
    isLoading,
    error,
    approveAction,
    rejectAction,
    executeManualAction,
    simulateAnalysis,
    refreshData: loadDashboardData,
  };
}