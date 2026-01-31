import { useState } from "react";
import { NavLink } from "@/components/NavLink";
import { useAuth } from "@/contexts/AuthContext";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Shield,
  Zap,
  Radio,
  Settings,
  ChevronLeft,
  ChevronRight,
  Satellite,
  AlertTriangle,
  Activity,
  FileText,
  Cpu,
  LogOut,
  User,
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface SidebarProps {
  className?: string;
}

const navigation = [
  { name: "Dashboard", href: "/", icon: LayoutDashboard },
  { name: "Menaces", href: "/threats", icon: AlertTriangle },
  { name: "Satellites", href: "/satellites", icon: Satellite },
  { name: "Communications", href: "/communications", icon: Radio },
  { name: "Résilience", href: "/resilience", icon: Shield },
  { name: "Simulation", href: "/simulation", icon: Zap },
  { name: "Défense IA", href: "/autonomous-defense", icon: Cpu, requiresRole: 'operator' as const },
  { name: "Rapports", href: "/reports", icon: FileText, requiresRole: 'operator' as const },
];

const secondaryNavigation = [
  { name: "Paramètres", href: "/settings", icon: Settings },
];

export function Sidebar({ className }: SidebarProps) {
  const [collapsed, setCollapsed] = useState(false);
  const { user, logout, hasPermission } = useAuth();

  const filteredNavigation = navigation.filter(
    (item) => !item.requiresRole || hasPermission(item.requiresRole)
  );

  return (
    <aside
      className={cn(
        "fixed left-0 top-0 z-40 flex h-screen flex-col border-r border-border bg-sidebar transition-all duration-300",
        collapsed ? "w-16" : "w-64",
        className
      )}
    >
      {/* Logo */}
      <div className="flex h-16 items-center justify-between border-b border-border px-4">
        {!collapsed && (
          <div className="flex items-center gap-2">
            <div className="relative flex h-10 w-10 items-center justify-center">
              <div className="absolute inset-0 rounded-lg bg-primary/20" />
              <Shield className="h-6 w-6 text-primary" />
            </div>
            <div className="flex flex-col">
              <span className="font-orbitron text-lg font-bold tracking-wider text-primary glow-text-cyan">
                SDRIC
              </span>
              <span className="text-[10px] uppercase tracking-widest text-muted-foreground">
                Space Defense
              </span>
            </div>
          </div>
        )}
        {collapsed && (
          <div className="mx-auto flex h-10 w-10 items-center justify-center">
            <Shield className="h-6 w-6 text-primary" />
          </div>
        )}
      </div>

      {/* User Info */}
      {user && (
        <div
          className={cn(
            "border-b border-border p-4",
            collapsed && "flex justify-center"
          )}
        >
          {!collapsed ? (
            <div className="flex items-center gap-3 rounded-lg bg-primary/10 px-3 py-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/20">
                <User className="h-4 w-4 text-primary" />
              </div>
              <div className="flex flex-col min-w-0">
                <span className="truncate text-xs font-medium text-foreground">
                  {user.name}
                </span>
                <span className="text-[10px] uppercase text-primary">
                  {user.role}
                </span>
              </div>
            </div>
          ) : (
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/20">
              <User className="h-4 w-4 text-primary" />
            </div>
          )}
        </div>
      )}

      {/* System Status */}
      <div
        className={cn(
          "border-b border-border p-4",
          collapsed && "flex justify-center"
        )}
      >
        {!collapsed ? (
          <div className="flex items-center gap-3 rounded-lg bg-secure-green/10 px-3 py-2">
            <Activity className="h-4 w-4 text-secure-green" />
            <div className="flex flex-col">
              <span className="text-xs font-medium text-secure-green">
                Système Opérationnel
              </span>
              <span className="text-[10px] text-muted-foreground">
                Dernière MAJ: 2s
              </span>
            </div>
          </div>
        ) : (
          <div className="status-dot status-dot-online" title="Système Opérationnel" />
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 overflow-y-auto p-2">
        {filteredNavigation.map((item) => (
          <NavLink
            key={item.name}
            to={item.href}
            className={cn(
              "group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground transition-all hover:bg-secondary hover:text-foreground",
              collapsed && "justify-center px-2"
            )}
            activeClassName="bg-primary/10 text-primary border border-primary/20"
          >
            <item.icon className="h-5 w-5 flex-shrink-0" />
            {!collapsed && <span>{item.name}</span>}
          </NavLink>
        ))}
      </nav>

      {/* Secondary Navigation */}
      <div className="border-t border-border p-2">
        {secondaryNavigation.map((item) => (
          <NavLink
            key={item.name}
            to={item.href}
            className={cn(
              "group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground transition-all hover:bg-secondary hover:text-foreground",
              collapsed && "justify-center px-2"
            )}
            activeClassName="bg-primary/10 text-primary"
          >
            <item.icon className="h-5 w-5 flex-shrink-0" />
            {!collapsed && <span>{item.name}</span>}
          </NavLink>
        ))}

        {/* Logout */}
        <Button
          variant="ghost"
          onClick={logout}
          className={cn(
            "mt-2 w-full justify-start gap-3 text-muted-foreground hover:bg-secondary hover:text-foreground",
            collapsed && "justify-center px-2"
          )}
        >
          <LogOut className="h-5 w-5 flex-shrink-0" />
          {!collapsed && <span>Déconnexion</span>}
        </Button>

        {/* Collapse Button */}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className={cn(
            "mt-2 flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground transition-all hover:bg-secondary hover:text-foreground",
            collapsed && "justify-center px-2"
          )}
        >
          {collapsed ? (
            <ChevronRight className="h-5 w-5" />
          ) : (
            <>
              <ChevronLeft className="h-5 w-5" />
              <span>Réduire</span>
            </>
          )}
        </button>
      </div>
    </aside>
  );
}