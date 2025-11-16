import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import ScrollToTop from "./components/ScrollToTop";
import Home from "./pages/Home";
import QuemSomos from "./pages/QuemSomos";
import NossasIgrejas from "./pages/NossasIgrejas";
import Projetos from "./pages/Projetos";
import Programacao from "./pages/Programacao";
import Galerias from "./pages/Galerias";
import Eventos from "./pages/Eventos";
import Videos from "./pages/Videos";
import FaleConosco from "./pages/FaleConosco";
import Jornal from "./pages/Jornal";
import RedesSociais from "./pages/RedesSociais";
import VersiculoDoDia from "./pages/VersiculoDoDia";
import AdminVersiculos from "./pages/AdminVersiculos";
import AdminJornais from "./pages/AdminJornais";
import AdminGalerias from "./pages/AdminGalerias";
import AdminEventos from "./pages/AdminEventos";
import Live from "./pages/Live";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter basename="/AvivaNacoes">
        <ScrollToTop />
        <Layout>
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
            <Route path="/live" element={<Live />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Layout>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
