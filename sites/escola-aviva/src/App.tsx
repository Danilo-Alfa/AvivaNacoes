import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import Cursos from "./pages/Cursos";
import CursoDetalhe from "./pages/CursoDetalhe";
import Materiais from "./pages/Materiais";
import Login from "./pages/Login";
import EsqueciSenha from "./pages/EsqueciSenha";
import RedefinirSenha from "./pages/RedefinirSenha";
import Perfil from "./pages/Perfil";
import Admin from "./pages/Admin";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter basename="/AvivaNacoes/escolaAviva">
        <AuthProvider>
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
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
