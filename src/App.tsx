
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Dashboard from "./pages/Dashboard";
import NotFound from "./pages/NotFound";
import Orcamento from "./pages/dashboard/Orcamento";
import Investimentos from "./pages/dashboard/Investimentos";
import Transacoes from "./pages/dashboard/Transacoes";
import Metas from "./pages/dashboard/Metas";
import Assistente from "./pages/dashboard/Assistente";
import Configuracoes from "./pages/dashboard/Configuracoes";
import Perfil from "./pages/dashboard/Perfil";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/dashboard/orcamento" element={<Orcamento />} />
          <Route path="/dashboard/investimentos" element={<Investimentos />} />
          <Route path="/dashboard/transacoes" element={<Transacoes />} />
          <Route path="/dashboard/metas" element={<Metas />} />
          <Route path="/dashboard/assistente" element={<Assistente />} />
          <Route path="/dashboard/configuracoes" element={<Configuracoes />} />
          <Route path="/dashboard/perfil" element={<Perfil />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
