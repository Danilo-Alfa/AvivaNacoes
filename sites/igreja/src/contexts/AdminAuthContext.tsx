import { createContext, useContext, useState, useCallback } from "react";
import { supabase } from "@/lib/supabase";

const ADMIN_SESSION_KEY = "admin_session";
const SESSION_DURATION_MS = 12 * 60 * 60 * 1000; // 12 horas

function getStoredSession(): boolean {
  try {
    const raw = localStorage.getItem(ADMIN_SESSION_KEY);
    if (!raw) return false;
    const { expiresAt } = JSON.parse(raw);
    if (Date.now() > expiresAt) {
      localStorage.removeItem(ADMIN_SESSION_KEY);
      return false;
    }
    return true;
  } catch {
    localStorage.removeItem(ADMIN_SESSION_KEY);
    return false;
  }
}

interface AdminAuthContextType {
  isAuthenticated: boolean;
  login: (password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
}

const AdminAuthContext = createContext<AdminAuthContextType | null>(null);

export function AdminAuthProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(getStoredSession);

  const login = useCallback(async (password: string) => {
    try {
      // Validar senha via Supabase RPC (server-side)
      const { data, error } = await supabase.rpc("verify_admin_password", {
        password_input: password,
      });

      if (error) {
        // Fallback: se a funcao RPC nao existir, bloqueia acesso
        console.error("Erro na verificacao admin:", error.message);
        return { success: false, error: "Servico de autenticacao indisponivel. Contate o administrador." };
      }

      if (data === true) {
        const session = { expiresAt: Date.now() + SESSION_DURATION_MS };
        localStorage.setItem(ADMIN_SESSION_KEY, JSON.stringify(session));
        setIsAuthenticated(true);
        return { success: true };
      }

      return { success: false, error: "Senha incorreta!" };
    } catch {
      return { success: false, error: "Erro ao conectar com o servidor." };
    }
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem(ADMIN_SESSION_KEY);
    setIsAuthenticated(false);
  }, []);

  return (
    <AdminAuthContext.Provider value={{ isAuthenticated, login, logout }}>
      {children}
    </AdminAuthContext.Provider>
  );
}

export function useAdminAuth() {
  const context = useContext(AdminAuthContext);
  if (!context) {
    throw new Error("useAdminAuth must be used within an AdminAuthProvider");
  }
  return context;
}
