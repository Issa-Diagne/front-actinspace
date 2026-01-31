import React, { useState } from 'react';
import { MainLayout } from "@/components/layout/MainLayout";
import { useSatelliteSystem } from "@/contexts/SatelliteContext";
import { DefenseAction } from "@/types/satellite";
import { AlertTriangle, CheckCircle, XCircle, Shield, Activity } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function AutonomousDefensePage() {
  // Protection par défaut : pendingApprovals = []
  const { pendingApprovals = [], sendIntervention, isConnected } = useSatelliteSystem();
  const [loadingId, setLoadingId] = useState<string | null>(null);

  const handleDecision = async (requestId: string, action: DefenseAction) => {
    setLoadingId(requestId);
    // On mappe l'enum vers les chaînes attendues par l'API ('approve' | 'reject')
    const apiAction = action === DefenseAction.APPROVE ? 'approve' : 'reject';
    await sendIntervention(requestId, apiAction);
    setLoadingId(null);
  };

  return (
    <MainLayout 
      title="Supervision IA" 
      subtitle={isConnected ? "🟢 Système connecté" : "🔴 Déconnecté"}
    >
      <div className="grid gap-6">
        
        {/* En-tête Statut */}
        <div className="flex items-center justify-between p-4 bg-card border border-border rounded-xl">
          <div className="flex items-center gap-3">
            <Shield className="h-8 w-8 text-primary animate-pulse" />
            <div>
              <h2 className="text-lg font-bold">Centre de Décision</h2>
              <p className="text-sm text-muted-foreground">
                {pendingApprovals.length} action(s) requièrent votre attention
              </p>
            </div>
          </div>
        </div>

        {/* Liste des requêtes */}
        <div className="space-y-4">
          {pendingApprovals.length === 0 ? (
            <div className="text-center py-12 border border-dashed border-border rounded-xl bg-secondary/10">
              <CheckCircle className="h-12 w-12 mx-auto mb-4 text-green-500/50" />
              <p className="text-lg font-medium">Système Nominal</p>
              <p className="text-sm text-muted-foreground">L'IA gère le trafic en autonomie.</p>
            </div>
          ) : (
            pendingApprovals.map((req) => (
              <div 
                key={req.request_id} 
                className="relative overflow-hidden bg-background border border-red-500/30 rounded-xl p-6 shadow-lg animate-in slide-in-from-bottom-2"
              >
                {/* Barre latérale rouge */}
                <div className="absolute top-0 left-0 w-1 h-full bg-red-500" />
                
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-red-400 font-mono text-sm uppercase font-bold">
                      <AlertTriangle className="h-4 w-4" />
                      {req.severity} SEVERITY • {req.satellite_id}
                    </div>
                    <h3 className="text-xl font-bold text-foreground">
                      {req.threat_type}
                    </h3>
                    <p className="text-muted-foreground text-sm">
                      Recommandation : <span className="text-white font-bold bg-primary/20 px-2 py-0.5 rounded">{req.recommended_action}</span>
                    </p>
                    <div className="text-xs text-muted-foreground pt-2">
                      Confiance IA: {(req.confidence * 100).toFixed(1)}% | ID: {req.request_id}
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <Button 
                      variant="destructive" 
                      onClick={() => handleDecision(req.request_id, DefenseAction.REJECT)}
                      disabled={loadingId === req.request_id}
                      className="gap-2"
                    >
                      <XCircle className="h-4 w-4" />
                      REJETER
                    </Button>
                    
                    <Button 
                      onClick={() => handleDecision(req.request_id, DefenseAction.APPROVE)}
                      disabled={loadingId === req.request_id}
                      className="bg-green-600 hover:bg-green-700 text-white gap-2"
                    >
                      <CheckCircle className="h-4 w-4" />
                      APPROUVER
                    </Button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </MainLayout>
  );
}