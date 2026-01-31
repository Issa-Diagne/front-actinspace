import { MainLayout } from "@/components/layout/MainLayout";
import { cn } from "@/lib/utils";
import { Settings, User, Shield, Bell, Database, Key, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

const SettingsPage = () => {
  return (
    <MainLayout
      title="Paramètres"
      subtitle="Configuration du système SDRIC"
    >
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main settings */}
        <div className="lg:col-span-2 space-y-6">
          {/* User Profile */}
          <div className="cyber-card rounded-xl border border-border p-6">
            <div className="mb-4 flex items-center gap-2">
              <User className="h-5 w-5 text-primary" />
              <h3 className="font-orbitron text-sm font-semibold uppercase tracking-wider">
                Profil Utilisateur
              </h3>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="name">Nom</Label>
                <Input id="name" defaultValue="Jean Dupont" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="role">Rôle</Label>
                <Input id="role" defaultValue="Opérateur Principal" disabled />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" defaultValue="j.dupont@esa.int" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="station">Station</Label>
                <Input id="station" defaultValue="ESOC Darmstadt" disabled />
              </div>
            </div>
            <Button className="mt-4" variant="outline">
              Mettre à jour le profil
            </Button>
          </div>

          {/* Security Settings */}
          <div className="cyber-card rounded-xl border border-border p-6">
            <div className="mb-4 flex items-center gap-2">
              <Shield className="h-5 w-5 text-primary" />
              <h3 className="font-orbitron text-sm font-semibold uppercase tracking-wider">
                Sécurité
              </h3>
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between rounded-lg border border-border bg-secondary/30 p-4">
                <div>
                  <span className="font-medium text-foreground">Authentification 2FA</span>
                  <p className="text-xs text-muted-foreground">
                    Exiger une vérification supplémentaire lors de la connexion
                  </p>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between rounded-lg border border-border bg-secondary/30 p-4">
                <div>
                  <span className="font-medium text-foreground">Session timeout</span>
                  <p className="text-xs text-muted-foreground">
                    Déconnexion automatique après 30 minutes d'inactivité
                  </p>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between rounded-lg border border-border bg-secondary/30 p-4">
                <div>
                  <span className="font-medium text-foreground">Journalisation avancée</span>
                  <p className="text-xs text-muted-foreground">
                    Enregistrer toutes les actions pour audit
                  </p>
                </div>
                <Switch defaultChecked />
              </div>
            </div>
          </div>

          {/* Notification Settings */}
          <div className="cyber-card rounded-xl border border-border p-6">
            <div className="mb-4 flex items-center gap-2">
              <Bell className="h-5 w-5 text-primary" />
              <h3 className="font-orbitron text-sm font-semibold uppercase tracking-wider">
                Notifications
              </h3>
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between rounded-lg border border-border bg-secondary/30 p-4">
                <div>
                  <span className="font-medium text-foreground">Alertes critiques</span>
                  <p className="text-xs text-muted-foreground">
                    Notifications immédiates pour menaces critiques
                  </p>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between rounded-lg border border-border bg-secondary/30 p-4">
                <div>
                  <span className="font-medium text-foreground">Alertes sonores</span>
                  <p className="text-xs text-muted-foreground">
                    Alarme audio pour les événements majeurs
                  </p>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between rounded-lg border border-border bg-secondary/30 p-4">
                <div>
                  <span className="font-medium text-foreground">Rapports quotidiens</span>
                  <p className="text-xs text-muted-foreground">
                    Résumé par email chaque jour à 08:00
                  </p>
                </div>
                <Switch />
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar settings */}
        <div className="space-y-6">
          {/* Quick Links */}
          <div className="cyber-card rounded-xl border border-border p-4">
            <h3 className="mb-4 font-orbitron text-sm font-semibold uppercase tracking-wider">
              Accès Rapide
            </h3>
            <div className="space-y-2">
              <Button variant="ghost" className="w-full justify-start gap-2">
                <Key className="h-4 w-4" />
                Gestion des clés API
              </Button>
              <Button variant="ghost" className="w-full justify-start gap-2">
                <Users className="h-4 w-4" />
                Gestion des utilisateurs
              </Button>
              <Button variant="ghost" className="w-full justify-start gap-2">
                <Database className="h-4 w-4" />
                Sauvegarde des données
              </Button>
            </div>
          </div>

          {/* System Info */}
          <div className="cyber-card rounded-xl border border-border p-4">
            <h3 className="mb-4 font-orbitron text-sm font-semibold uppercase tracking-wider">
              Informations Système
            </h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Version</span>
                <span className="font-mono text-foreground">v2.4.1</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Build</span>
                <span className="font-mono text-foreground">2026.01.29</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Licence</span>
                <span className="font-mono text-secure-green">Valide</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Dernière MAJ</span>
                <span className="font-mono text-foreground">Il y a 2j</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default SettingsPage;
