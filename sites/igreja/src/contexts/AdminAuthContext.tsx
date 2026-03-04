import { createContext, useContext, useState, useCallback } from "react";

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
  login: (password: string) => { success: boolean; error?: string };
  logout: () => void;
}

const AdminAuthContext = createContext<AdminAuthContextType | null>(null);

export function AdminAuthProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(getStoredSession);

  const login = useCallback((password: string) => {
    const adminPassword = import.meta.env.VITE_ADMIN_PASSWORD;

    if (!adminPassword) {
      return { success: false, error: "Senha de admin não configurada. Verifique o arquivo .env" };
    }

    if (password === adminPassword) {
      const session = { expiresAt: Date.now() + SESSION_DURATION_MS };
      localStorage.setItem(ADMIN_SESSION_KEY, JSON.stringify(session));
      setIsAuthenticated(true);
      return { success: true };
    }

    return { success: false, error: "Senha incorreta!" };
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
