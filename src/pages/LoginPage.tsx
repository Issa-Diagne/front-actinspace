import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Shield, AlertCircle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const success = await login(email, password);
      if (success) {
        navigate("/");
      } else {
        setError("Identifiants invalides");
      }
    } catch (err) {
      setError("Une erreur est survenue");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-space-deep cyber-grid">
      {/* Background effects */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -left-1/4 top-1/4 h-96 w-96 rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute -right-1/4 bottom-1/4 h-96 w-96 rounded-full bg-cyber-cyan/10 blur-3xl" />
      </div>

      <div className="relative w-full max-w-md">
        {/* Logo and title */}
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-2xl bg-primary/20 backdrop-blur-sm">
            <Shield className="h-12 w-12 text-primary" />
          </div>
          <h1 className="font-orbitron text-3xl font-bold tracking-wider text-primary glow-text-cyan">
            SDRIC
          </h1>
          <p className="mt-2 text-sm uppercase tracking-widest text-muted-foreground">
            Space Defense & Resilience Console
          </p>
        </div>

        {/* Login form */}
        <div className="cyber-card rounded-2xl border border-border bg-card/50 p-8 backdrop-blur-sm">
          <h2 className="mb-6 font-orbitron text-xl font-semibold">
            Authentification
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="utilisateur@sdric.space"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={isLoading}
                className="bg-secondary/50"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Mot de passe</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={isLoading}
                className="bg-secondary/50"
              />
            </div>

            {error && (
              <div className="flex items-center gap-2 rounded-lg bg-threat-red/10 p-3 text-sm text-threat-red">
                <AlertCircle className="h-4 w-4" />
                {error}
              </div>
            )}

            <Button
              type="submit"
              className="w-full"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Connexion...
                </>
              ) : (
                "Se connecter"
              )}
            </Button>
          </form>

          {/* Demo credentials */}
          <div className="mt-6 rounded-lg border border-border bg-secondary/30 p-4">
            <p className="mb-2 text-xs font-semibold text-muted-foreground">
              Identifiants de démonstration:
            </p>
            <div className="space-y-1 text-xs font-mono text-muted-foreground">
              <p>Admin: admin@sdric.space / admin123</p>
              <p>Opérateur: operator@sdric.space / operator123</p>
              <p>Observateur: observer@sdric.space / observer123</p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <p className="mt-6 text-center text-xs text-muted-foreground">
          © 2026 SDRIC - Tous droits réservés
        </p>
      </div>
    </div>
  );
}
