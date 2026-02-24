import { Suspense, lazy } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import ScrollToTop from "./components/ScrollToTop";

// Lazy loading das páginas para melhorar performance
const Home = lazy(() => import("./pages/Home"));
const QuemSomos = lazy(() => import("./pages/QuemSomos"));
const NossasIgrejas = lazy(() => import("./pages/NossasIgrejas"));
const Projetos = lazy(() => import("./pages/Projetos"));
const Programacao = lazy(() => import("./pages/Programacao"));
const Galerias = lazy(() => import("./pages/Galerias"));
const Eventos = lazy(() => import("./pages/Eventos"));
const Videos = lazy(() => import("./pages/Videos"));
const FaleConosco = lazy(() => import("./pages/FaleConosco"));
const Jornal = lazy(() => import("./pages/Jornal"));
const RedesSociais = lazy(() => import("./pages/RedesSociais"));
const VersiculoDoDia = lazy(() => import("./pages/VersiculoDoDia"));
const AdminVersiculos = lazy(() => import("./pages/AdminVersiculos"));
const AdminJornais = lazy(() => import("./pages/AdminJornais"));
const AdminGalerias = lazy(() => import("./pages/AdminGalerias"));
const AdminEventos = lazy(() => import("./pages/AdminEventos"));
const AdminVideos = lazy(() => import("./pages/AdminVideos"));
const AdminLive = lazy(() => import("./pages/AdminLive"));
const AdminProgramacao = lazy(() => import("./pages/AdminProgramacao"));
const AdminIgrejas = lazy(() => import("./pages/AdminIgrejas"));
const AdminProjetos = lazy(() => import("./pages/AdminProjetos"));
const AdminMensagens = lazy(() => import("./pages/AdminMensagens"));
const AdminCarousel = lazy(() => import("./pages/AdminCarousel"));
const Live = lazy(() => import("./pages/Live"));
const TesteLive = lazy(() => import("./pages/TesteLive"));
const NotFound = lazy(() => import("./pages/NotFound"));

// Componente de loading
const PageLoader = () => (
  <div className="min-h-[50vh] flex items-center justify-center">
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
        <ScrollToTop />
        <Layout>
          <Suspense fallback={<PageLoader />}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/quem-somos" element={<QuemSomos />} />
              <Route path="/nossas-igrejas" element={<NossasIgrejas />} />
              <Route path="/projetos" element={<Projetos />} />
              <Route path="/programacao" element={<Programacao />} />
              <Route path="/galerias" element={<Galerias />} />
              <Route path="/eventos" element={<Eventos />} />
              <Route path="/videos" element={<Videos />} />
              <Route path="/fale-conosco" element={<FaleConosco />} />
              <Route path="/jornal" element={<Jornal />} />
              <Route path="/redes-sociais" element={<RedesSociais />} />
              <Route path="/versiculo-do-dia" element={<VersiculoDoDia />} />
              <Route path="/admin/versiculo-do-dia" element={<AdminVersiculos />} />
              <Route path="/admin/jornal" element={<AdminJornais />} />
              <Route path="/admin/galerias" element={<AdminGalerias />} />
              <Route path="/admin/eventos" element={<AdminEventos />} />
              <Route path="/admin/videos" element={<AdminVideos />} />
              <Route path="/admin/live" element={<AdminLive />} />
              <Route path="/admin/programacao" element={<AdminProgramacao />} />
              <Route path="/admin/igrejas" element={<AdminIgrejas />} />
              <Route path="/admin/projetos" element={<AdminProjetos />} />
              <Route path="/admin/mensagens" element={<AdminMensagens />} />
              <Route path="/admin/fale-conosco" element={<AdminMensagens />} />
              <Route path="/admin/carousel" element={<AdminCarousel />} />
              <Route path="/live" element={<Live />} />
              <Route path="/teste-live" element={<TesteLive />} />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </Layout>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
