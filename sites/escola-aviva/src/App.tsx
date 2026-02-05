import { Suspense, lazy } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";

// Lazy loading das páginas para melhorar performance
const Cursos = lazy(() => import("./pages/Cursos"));
const CursoDetalhe = lazy(() => import("./pages/CursoDetalhe"));
const Materiais = lazy(() => import("./pages/Materiais"));
const Login = lazy(() => import("./pages/Login"));
const EsqueciSenha = lazy(() => import("./pages/EsqueciSenha"));
const RedefinirSenha = lazy(() => import("./pages/RedefinirSenha"));
const Perfil = lazy(() => import("./pages/Perfil"));
const Admin = lazy(() => import("./pages/Admin"));
const NotFound = lazy(() => import("./pages/NotFound"));

// Componente de loading
const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center bg-background">
    <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
  </div>
);

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter basename="">
        <AuthProvider>
          <Suspense fallback={<PageLoader />}>
            <Routes>
              {/* Rotas publicas - autenticacao */}
              <Route path="/login" element={<Login />} />
              <Route path="/esqueci-senha" element={<EsqueciSenha />} />
              <Route path="/redefinir-senha" element={<RedefinirSenha />} />

              {/* Redireciona raiz para cursos */}
              <Route path="/" element={<Navigate to="/cursos" replace />} />

              {/* Rotas protegidas - requer login */}
              <Route path="/cursos" element={<ProtectedRoute><Cursos /></ProtectedRoute>} />
              <Route path="/cursos/:id" element={<ProtectedRoute><CursoDetalhe /></ProtectedRoute>} />
              <Route path="/materiais" element={<ProtectedRoute><Materiais /></ProtectedRoute>} />
              <Route path="/perfil" element={<ProtectedRoute><Perfil /></ProtectedRoute>} />
              <Route path="/admin" element={<ProtectedRoute requireAdmin><Admin /></ProtectedRoute>} />

              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
