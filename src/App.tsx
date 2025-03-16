
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { useAuth } from "./contexts/AuthContext";
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
import Login from "./pages/Login";
import AuthCallback from "./pages/AuthCallback";
import ResetPassword from "./pages/ResetPassword";
import { LoadingScreen } from "./components/ui/loading-screen";

const queryClient = new QueryClient();

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
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <AppRoutes />
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
