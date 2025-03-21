
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { HashRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { useAuth } from "./contexts/AuthContext";
import { useState } from "react";
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
import Mensagens from "./pages/dashboard/Mensagens";
import Login from "./pages/Login";
import AuthCallback from "./pages/AuthCallback";
import ResetPassword from "./pages/ResetPassword";
import { LoadingScreen } from "./components/ui/loading-screen";

// Protected route component
const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
  const { user, loading } = useAuth();
  
  if (loading) {
    return <LoadingScreen />;
  }
  
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Index />} />
      <Route path="/login" element={<Login />} />
      <Route path="/auth-callback" element={<AuthCallback />} />
      <Route path="/reset-password" element={<ResetPassword />} />
      <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
      <Route path="/dashboard/orcamento" element={<ProtectedRoute><Orcamento /></ProtectedRoute>} />
      <Route path="/dashboard/investimentos" element={<ProtectedRoute><Investimentos /></ProtectedRoute>} />
      <Route path="/dashboard/transacoes" element={<ProtectedRoute><Transacoes /></ProtectedRoute>} />
      <Route path="/dashboard/metas" element={<ProtectedRoute><Metas /></ProtectedRoute>} />
      <Route path="/dashboard/assistente" element={<ProtectedRoute><Assistente /></ProtectedRoute>} />
      <Route path="/dashboard/configuracoes" element={<ProtectedRoute><Configuracoes /></ProtectedRoute>} />
      <Route path="/dashboard/perfil" element={<ProtectedRoute><Perfil /></ProtectedRoute>} />
      <Route path="/dashboard/mensagens" element={<ProtectedRoute><Mensagens /></ProtectedRoute>} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

const App = () => {
  // Create a new QueryClient instance inside the component
  const [queryClient] = useState(() => new QueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <HashRouter>
          <AuthProvider>
            <AppRoutes />
          </AuthProvider>
        </HashRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
