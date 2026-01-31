import { useState } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { useAuth } from "@/contexts/AuthContext";
import { cn } from "@/lib/utils";
import { 
  FileText, 
  Download, 
  Calendar, 
  Filter, 
  BarChart3,
  AlertTriangle,
  Shield,
  Zap,
  ChevronDown
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const reportTypes = [
  { id: 'threats', name: 'Rapport de menaces', icon: AlertTriangle },
  { id: 'simulations', name: 'Résultats de simulation', icon: Zap },
  { id: 'security', name: 'Analyse de sécurité', icon: Shield },
  { id: 'complete', name: 'Rapport complet', icon: BarChart3 },
];

const mockReports = [
  {
    id: 'RPT-2026-001',
    type: 'threats',
    title: 'Rapport mensuel des menaces',
    date: '2026-01-30',
    period: 'Janvier 2026',
    status: 'available',
    size: '2.4 MB',
  },
  {
    id: 'RPT-2026-002',
    type: 'simulations',
    title: 'Résultats simulations Q1',
    date: '2026-01-28',
    period: 'Q1 2026',
    status: 'available',
    size: '1.8 MB',
  },
  {
    id: 'RPT-2026-003',
    type: 'security',
    title: 'Audit de sécurité hebdomadaire',
    date: '2026-01-27',
    period: 'Semaine 4',
    status: 'available',
    size: '3.2 MB',
  },
];

export default function ReportsPage() {
  const { hasPermission } = useAuth();
  const [selectedType, setSelectedType] = useState<string>('all');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  const generatePDFReport = async (reportId: string) => {
    setIsGenerating(true);
    
    // Simulate PDF generation
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // In a real implementation, this would call an API to generate the PDF
    // For now, we'll create a simple HTML content and convert it
    const reportContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="UTF-8">
          <title>SDRIC Report - ${reportId}</title>
          <style>
            body {
              font-family: Arial, sans-serif;
              margin: 40px;
              color: #333;
            }
            h1 {
              color: #0ea5e9;
              border-bottom: 2px solid #0ea5e9;
              padding-bottom: 10px;
            }
            .header {
              display: flex;
              justify-content: space-between;
              margin-bottom: 30px;
            }
            .section {
              margin: 20px 0;
              padding: 15px;
              background: #f8f9fa;
              border-left: 4px solid #0ea5e9;
            }
            .metric {
              display: inline-block;
              margin: 10px 20px 10px 0;
              padding: 10px 15px;
              background: white;
              border-radius: 5px;
              box-shadow: 0 2px 4px rgba(0,0,0,0.1);
            }
            .metric-label {
              font-size: 12px;
              color: #666;
              text-transform: uppercase;
            }
            .metric-value {
              font-size: 24px;
              font-weight: bold;
              color: #0ea5e9;
            }
            table {
              width: 100%;
              border-collapse: collapse;
              margin: 20px 0;
            }
            th, td {
              padding: 12px;
              text-align: left;
              border-bottom: 1px solid #ddd;
            }
            th {
              background-color: #0ea5e9;
              color: white;
            }
            .footer {
              margin-top: 40px;
              padding-top: 20px;
              border-top: 1px solid #ddd;
              font-size: 12px;
              color: #666;
            }
          </style>
        </head>
        <body>
          <div class="header">
            <div>
              <h1>SDRIC - Space Defense Report</h1>
              <p>Report ID: ${reportId}</p>
            </div>
            <div style="text-align: right;">
              <p><strong>Généré le:</strong> ${new Date().toLocaleDateString('fr-FR')}</p>
              <p><strong>Période:</strong> Janvier 2026</p>
            </div>
          </div>

          <div class="section">
            <h2>Résumé Exécutif</h2>
            <div class="metric">
              <div class="metric-label">Menaces détectées</div>
              <div class="metric-value">47</div>
            </div>
            <div class="metric">
              <div class="metric-label">Taux de succès</div>
              <div class="metric-value">98%</div>
            </div>
            <div class="metric">
              <div class="metric-label">Satellites actifs</div>
              <div class="metric-value">6/6</div>
            </div>
            <div class="metric">
              <div class="metric-label">Score sécurité</div>
              <div class="metric-value">94%</div>
            </div>
          </div>

          <div class="section">
            <h2>Menaces Détectées</h2>
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Type</th>
                  <th>Sévérité</th>
                  <th>Cible</th>
                  <th>État</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>THR-001</td>
                  <td>Brouillage RF</td>
                  <td>Élevée</td>
                  <td>GALILEO-E14</td>
                  <td>Neutralisée</td>
                </tr>
                <tr>
                  <td>THR-002</td>
                  <td>Intrusion TTC</td>
                  <td>Critique</td>
                  <td>COSMO-SKY-4</td>
                  <td>En cours</td>
                </tr>
                <tr>
                  <td>THR-003</td>
                  <td>Spoofing GPS</td>
                  <td>Moyenne</td>
                  <td>SENTINEL-1A</td>
                  <td>Neutralisée</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div class="section">
            <h2>Performance des Simulations</h2>
            <p>Total de simulations effectuées: <strong>47</strong></p>
            <p>Taux de réussite: <strong>98%</strong></p>
            <p>Temps de réponse moyen: <strong>0.4s</strong></p>
            <p>Types d'attaques testées: <strong>3</strong></p>
          </div>

          <div class="section">
            <h2>Recommandations</h2>
            <ul>
              <li>Renforcer le chiffrement sur le canal CH-5 Emergency</li>
              <li>Augmenter la fréquence de rotation des clés pour GALILEO-E14</li>
              <li>Mettre à jour le firmware du satellite COSMO-SKY-4</li>
              <li>Planifier un audit de sécurité approfondi pour février</li>
            </ul>
          </div>

          <div class="footer">
            <p>© 2026 SDRIC - Space Defense & Resilience Intelligent Console</p>
            <p>Document confidentiel - Classification: RESTREINT</p>
          </div>
        </body>
      </html>
    `;

    // Create a Blob and download
    const blob = new Blob([reportContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `SDRIC_Report_${reportId}_${new Date().toISOString().split('T')[0]}.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    setIsGenerating(false);
  };

  // Check permissions
  if (!hasPermission('operator')) {
    return (
      <MainLayout
        title="Rapports"
        subtitle="Génération et export de rapports d'analyse"
      >
        <div className="flex h-96 items-center justify-center">
          <div className="text-center">
            <AlertTriangle className="mx-auto h-12 w-12 text-warning-amber" />
            <h3 className="mt-4 text-lg font-semibold">Accès restreint</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Vous n'avez pas les permissions nécessaires pour accéder aux rapports.
            </p>
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout
      title="Rapports"
      subtitle="Génération et export de rapports d'analyse"
    >
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Report Generator */}
        <div className="lg:col-span-2 space-y-6">
          {/* Generator Form */}
          <div className="cyber-card rounded-xl border border-border p-6">
            <div className="mb-6 flex items-center gap-2">
              <FileText className="h-5 w-5 text-primary" />
              <h3 className="font-orbitron text-sm font-semibold uppercase tracking-wider">
                Générateur de Rapport
              </h3>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label>Type de rapport</Label>
                <Select value={selectedType} onValueChange={setSelectedType}>
                  <SelectTrigger className="bg-secondary/50">
                    <SelectValue placeholder="Sélectionner un type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tous les types</SelectItem>
                    {reportTypes.map((type) => (
                      <SelectItem key={type.id} value={type.id}>
                        {type.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Période</Label>
                <Select defaultValue="month">
                  <SelectTrigger className="bg-secondary/50">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="week">Cette semaine</SelectItem>
                    <SelectItem value="month">Ce mois</SelectItem>
                    <SelectItem value="quarter">Ce trimestre</SelectItem>
                    <SelectItem value="year">Cette année</SelectItem>
                    <SelectItem value="custom">Personnalisé</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="dateFrom">Date de début</Label>
                <Input
                  id="dateFrom"
                  type="date"
                  value={dateFrom}
                  onChange={(e) => setDateFrom(e.target.value)}
                  className="bg-secondary/50"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="dateTo">Date de fin</Label>
                <Input
                  id="dateTo"
                  type="date"
                  value={dateTo}
                  onChange={(e) => setDateTo(e.target.value)}
                  className="bg-secondary/50"
                />
              </div>
            </div>

            <Button 
              className="mt-6 w-full gap-2"
              onClick={() => generatePDFReport('NEW')}
              disabled={isGenerating}
            >
              {isGenerating ? (
                <>
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                  Génération en cours...
                </>
              ) : (
                <>
                  <Download className="h-4 w-4" />
                  Générer le rapport PDF
                </>
              )}
            </Button>
          </div>

          {/* Reports History */}
          <div className="cyber-card rounded-xl border border-border p-6">
            <div className="mb-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-primary" />
                <h3 className="font-orbitron text-sm font-semibold uppercase tracking-wider">
                  Historique des Rapports
                </h3>
              </div>
              <Button variant="outline" size="sm" className="gap-2">
                <Filter className="h-4 w-4" />
                Filtrer
              </Button>
            </div>

            <div className="space-y-3">
              {mockReports.map((report) => {
                const ReportIcon = reportTypes.find(t => t.id === report.type)?.icon || FileText;
                
                return (
                  <div
                    key={report.id}
                    className="flex items-center justify-between rounded-lg border border-border bg-secondary/30 p-4 transition-all hover:border-primary/30"
                  >
                    <div className="flex items-center gap-4">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                        <ReportIcon className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-foreground">
                            {report.title}
                          </span>
                          <span className="rounded bg-secure-green/10 px-1.5 py-0.5 text-xs font-medium text-secure-green">
                            Disponible
                          </span>
                        </div>
                        <div className="mt-1 flex items-center gap-3 text-xs text-muted-foreground">
                          <span>ID: {report.id}</span>
                          <span>•</span>
                          <span>{report.period}</span>
                          <span>•</span>
                          <span>{report.size}</span>
                        </div>
                      </div>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      className="gap-2"
                      onClick={() => generatePDFReport(report.id)}
                    >
                      <Download className="h-4 w-4" />
                      Télécharger
                    </Button>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Report Types */}
        <div className="space-y-6">
          <div className="cyber-card rounded-xl border border-border p-4">
            <h3 className="mb-4 font-orbitron text-sm font-semibold uppercase tracking-wider">
              Types de Rapports
            </h3>
            <div className="space-y-2">
              {reportTypes.map((type) => {
                const Icon = type.icon;
                return (
                  <div
                    key={type.id}
                    className="flex items-center gap-3 rounded-lg border border-border bg-secondary/30 p-3"
                  >
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
                      <Icon className="h-4 w-4 text-primary" />
                    </div>
                    <span className="text-sm font-medium text-foreground">
                      {type.name}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Stats */}
          <div className="cyber-card rounded-xl border border-border p-4">
            <h3 className="mb-4 font-orbitron text-sm font-semibold uppercase tracking-wider">
              Statistiques
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Rapports générés</span>
                <span className="font-mono text-sm font-semibold text-foreground">47</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Ce mois</span>
                <span className="font-mono text-sm font-semibold text-foreground">12</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Taille totale</span>
                <span className="font-mono text-sm font-semibold text-foreground">124 MB</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
