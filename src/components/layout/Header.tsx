import { useState } from "react";
import { Bell, Search, User, AlertCircle, X, LogOut, Settings } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface HeaderProps {
  title: string;
  subtitle?: string;
}

interface Notification {
  id: string;
  type: "info" | "warning" | "critical";
  title: string;
  message: string;
  time: string;
  read: boolean;
}

const mockNotifications: Notification[] = [
  {
    id: "1",
    type: "critical",
    title: "Menace critique détectée",
    message: "Intrusion TTC sur COSMO-SKY-4",
    time: "Il y a 2 min",
    read: false,
  },
  {
    id: "2",
    type: "warning",
    title: "Brouillage RF",
    message: "Interférence détectée sur GALILEO-E14",
    time: "Il y a 8 min",
    read: false,
  },
  {
    id: "3",
    type: "info",
    title: "Simulation terminée",
    message: "Rapport disponible pour SIM-2024-047",
    time: "Il y a 15 min",
    read: true,
  },
  {
    id: "4",
    type: "info",
    title: "Mise à jour système",
    message: "SDRIC v2.4.1 installé avec succès",
    time: "Il y a 1h",
    read: true,
  },
  {
    id: "5",
    type: "warning",
    title: "Canal brouillé",
    message: "CH-5 Emergency - Intervention requise",
    time: "Il y a 2h",
    read: true,
  },
];

const mockAlerts = [
  { id: "1", severity: "critical", message: "2 menaces actives" },
  { id: "2", severity: "warning", message: "1 canal brouillé" },
  { id: "3", severity: "info", message: "Défense autonome active" },
];

export function Header({ title, subtitle }: HeaderProps) {
  const { user, logout } = useAuth();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showAlerts, setShowAlerts] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [notifications, setNotifications] = useState(mockNotifications);

  const unreadCount = notifications.filter((n) => !n.read).length;
  const criticalAlerts = mockAlerts.filter((a) => a.severity === "critical").length;

  const markAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-border bg-background/80 px-6 backdrop-blur-md">
      <div className="flex flex-col">
        <h1 className="font-orbitron text-xl font-semibold tracking-wide text-foreground">
          {title}
        </h1>
        {subtitle && <p className="text-xs text-muted-foreground">{subtitle}</p>}
      </div>

      <div className="flex items-center gap-3">
        {/* Search */}
        <div className="relative hidden md:block">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Rechercher..."
            className="w-64 bg-secondary/50 pl-10 font-mono text-sm"
          />
        </div>

        {/* Alert Indicator */}
        <div className="relative">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => {
              setShowAlerts(!showAlerts);
              setShowNotifications(false);
              setShowUserMenu(false);
            }}
            className="relative"
          >
            <AlertCircle className="h-5 w-5 text-warning-amber" />
            {criticalAlerts > 0 && (
              <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-threat-red text-[10px] font-bold text-white">
                {criticalAlerts}
              </span>
            )}
          </Button>

          {/* Alerts Dropdown */}
          {showAlerts && (
            <div className="absolute right-0 top-12 w-80 rounded-lg border border-border bg-card shadow-lg">
              <div className="flex items-center justify-between border-b border-border p-3">
                <h3 className="font-semibold text-sm">Alertes Actives</h3>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6"
                  onClick={() => setShowAlerts(false)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
              <div className="max-h-96 overflow-y-auto p-2">
                {mockAlerts.map((alert) => (
                  <div
                    key={alert.id}
                    className={cn(
                      "mb-2 rounded-lg border p-3",
                      alert.severity === "critical" && "border-threat-red/50 bg-threat-red/5",
                      alert.severity === "warning" && "border-warning-amber/50 bg-warning-amber/5",
                      alert.severity === "info" && "border-primary/50 bg-primary/5"
                    )}
                  >
                    <p className="text-sm text-foreground">{alert.message}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Notifications */}
        <div className="relative">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => {
              setShowNotifications(!showNotifications);
              setShowAlerts(false);
              setShowUserMenu(false);
            }}
            className="relative"
          >
            <Bell className="h-5 w-5" />
            {unreadCount > 0 && (
              <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">
                {unreadCount}
              </span>
            )}
          </Button>

          {/* Notifications Dropdown */}
          {showNotifications && (
            <div className="absolute right-0 top-12 w-96 rounded-lg border border-border bg-card shadow-lg">
              <div className="flex items-center justify-between border-b border-border p-3">
                <h3 className="font-semibold text-sm">Notifications</h3>
                <div className="flex items-center gap-2">
                  {unreadCount > 0 && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={markAllAsRead}
                      className="h-7 text-xs"
                    >
                      Tout marquer lu
                    </Button>
                  )}
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6"
                    onClick={() => setShowNotifications(false)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <div className="max-h-96 overflow-y-auto">
                {notifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={cn(
                      "border-b border-border p-3 transition-colors hover:bg-secondary/50 cursor-pointer",
                      !notification.read && "bg-primary/5"
                    )}
                    onClick={() => markAsRead(notification.id)}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span
                            className={cn(
                              "h-2 w-2 rounded-full",
                              notification.type === "critical" && "bg-threat-red",
                              notification.type === "warning" && "bg-warning-amber",
                              notification.type === "info" && "bg-primary"
                            )}
                          />
                          <h4 className="text-sm font-semibold">{notification.title}</h4>
                        </div>
                        <p className="mt-1 text-xs text-muted-foreground">
                          {notification.message}
                        </p>
                        <span className="mt-1 text-[10px] text-muted-foreground">
                          {notification.time}
                        </span>
                      </div>
                      {!notification.read && (
                        <span className="h-2 w-2 rounded-full bg-primary" />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* User Menu */}
        <div className="relative">
          <Button
            variant="ghost"
            size="icon"
            className="rounded-full"
            onClick={() => {
              setShowUserMenu(!showUserMenu);
              setShowNotifications(false);
              setShowAlerts(false);
            }}
          >
            <User className="h-5 w-5" />
          </Button>

          {/* User Dropdown */}
          {showUserMenu && user && (
            <div className="absolute right-0 top-12 w-64 rounded-lg border border-border bg-card shadow-lg">
              <div className="border-b border-border p-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/20">
                    <User className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-semibold text-sm">{user.name}</p>
                    <p className="text-xs text-muted-foreground">{user.email}</p>
                    <span className="mt-1 inline-block rounded bg-primary/10 px-2 py-0.5 text-[10px] font-medium uppercase text-primary">
                      {user.role}
                    </span>
                  </div>
                </div>
              </div>
              <div className="p-2">
                <Button
                  variant="ghost"
                  className="w-full justify-start gap-2"
                  onClick={() => {
                    window.location.href = "/settings";
                    setShowUserMenu(false);
                  }}
                >
                  <Settings className="h-4 w-4" />
                  Paramètres
                </Button>
                <Button
                  variant="ghost"
                  className="w-full justify-start gap-2 text-threat-red hover:bg-threat-red/10 hover:text-threat-red"
                  onClick={() => {
                    logout();
                    setShowUserMenu(false);
                  }}
                >
                  <LogOut className="h-4 w-4" />
                  Déconnexion
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Time */}
        <div className="hidden items-center gap-2 border-l border-border pl-4 lg:flex">
          <div className="flex flex-col items-end">
            <span className="font-mono text-sm font-medium text-primary">
              {new Date().toLocaleTimeString("fr-FR", {
                hour: "2-digit",
                minute: "2-digit",
                second: "2-digit",
              })}
            </span>
            <span className="text-[10px] text-muted-foreground">UTC+1</span>
          </div>
        </div>
      </div>
    </header>
  );
}