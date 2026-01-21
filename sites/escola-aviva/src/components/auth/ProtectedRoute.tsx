import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Loader2 } from 'lucide-react';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAdmin?: boolean;
}

export function ProtectedRoute({ children, requireAdmin = false }: ProtectedRouteProps) {
  const { user, profile, isAdmin, loading, profileLoaded } = useAuth();
  const location = useLocation();

  console.log('🛡️ ProtectedRoute:', { loading, profileLoaded, user: !!user, profile: !!profile, isAdmin });

  // Ainda carregando autenticacao ou perfil
  if (loading || !profileLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Carregando...</p>
        </div>
      </div>
    );
  }

  // Nao esta logado
  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Perfil nao existe (usuario nao configurado pelo admin)
  if (!profile) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center max-w-md p-6">
          <p className="text-xl font-bold mb-2">Perfil nao encontrado</p>
          <p className="text-muted-foreground">
            Seu usuario ainda nao foi configurado. Entre em contato com o administrador.
          </p>
        </div>
      </div>
    );
  }

  // Requer admin mas nao e admin
  if (requireAdmin && !isAdmin) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}
