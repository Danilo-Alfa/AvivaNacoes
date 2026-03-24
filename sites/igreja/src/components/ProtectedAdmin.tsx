import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Lock, LogOut } from "lucide-react";
import { supabase } from "@/lib/supabase";

interface ProtectedAdminProps {
  children: React.ReactNode;
}

export default function ProtectedAdmin({ children }: ProtectedAdminProps) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const { data, error: rpcError } = await supabase.rpc("verify_admin_password", {
        password_input: password,
      });

      if (rpcError) {
        setError("Servico de autenticacao indisponivel.");
        setPassword("");
        setLoading(false);
        return;
      }

      if (data === true) {
        setIsAuthenticated(true);
        setPassword("");
      } else {
        setError("Senha incorreta!");
        setPassword("");
      }
    } catch {
      setError("Erro ao conectar com o servidor.");
      setPassword("");
    }
    setLoading(false);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setPassword("");
    setError("");
  };

  if (!isAuthenticated) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-md mx-auto mt-20">
          <Card>
            <CardHeader className="text-center">
              <div className="flex justify-center mb-4">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
                  <Lock className="w-8 h-8 text-primary" />
                </div>
              </div>
              <CardTitle className="text-2xl">Área Administrativa</CardTitle>
              <p className="text-sm text-muted-foreground mt-2">
                Digite a senha para acessar o painel de administração
              </p>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleLogin} className="space-y-4">
                <div>
                  <Label htmlFor="password">Senha</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="Digite a senha"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    autoFocus
                  />
                </div>

                {error && (
                  <div className="bg-destructive/10 text-destructive text-sm p-3 rounded-md">
                    {error}
                  </div>
                )}

                <Button type="submit" className="w-full" disabled={loading}>
                  <Lock className="w-4 h-4 mr-2" />
                  {loading ? "Verificando..." : "Entrar"}
                </Button>
              </form>

              <div className="mt-6 p-4 bg-muted/50 rounded-lg">
                <p className="text-xs text-muted-foreground">
                  <strong>Nota de segurança:</strong> A senha está configurada no
                  arquivo .env. Mantenha este arquivo seguro e não compartilhe a
                  senha.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="container mx-auto px-4 pt-4">
        <div className="flex justify-end mb-4">
          <Button variant="outline" size="sm" onClick={handleLogout}>
            <LogOut className="w-4 h-4 mr-2" />
            Sair
          </Button>
        </div>
      </div>
      {children}
    </div>
  );
}
