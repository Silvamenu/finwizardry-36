
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { useAuth } from "./contexts/AuthContext";
import { useState, useEffect } from "react";
import { useThemeEffect } from "./hooks/useThemeEffect";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useUserPreferences } from "./hooks/useUserPreferences";
import i18n from "./i18n";
import { LoadingScreen } from "@/components/ui/loading-screen";

// Import page components
import Index from "@/pages/Index";
import LoginPage from "@/pages/LoginPage";
import AuthCallback from "@/pages/AuthCallback";
import ResetPassword from "@/pages/ResetPassword";
import Dashboard from "@/pages/Dashboard";
import Orcamento from "@/pages/dashboard/Orcamento";
import Investimentos from "@/pages/dashboard/Investimentos";
import Transacoes from "@/pages/dashboard/Transacoes";
import Metas from "@/pages/dashboard/Metas";
import Assistente from "@/pages/dashboard/Assistente";
import Analytics from "@/pages/dashboard/Analytics";
import Automacao from "@/pages/dashboard/Automacao";
import Relatorios from "@/pages/dashboard/Relatorios";
import Configuracoes from "@/pages/dashboard/Configuracoes";
import Perfil from "@/pages/dashboard/Perfil";
import Mensagens from "@/pages/dashboard/Mensagens";
import NotFound from "@/pages/NotFound";

import "./sidebar-theme.css";

const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  useThemeEffect();
  return <>{children}</>;
};

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
      <Route path="/login" element={<LoginPage />} />
      <Route path="/auth-callback" element={<AuthCallback />} />
      <Route path="/reset-password" element={<ResetPassword />} />
      <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
      <Route path="/dashboard/analytics" element={<ProtectedRoute><Analytics /></ProtectedRoute>} />
      <Route path="/dashboard/automacao" element={<ProtectedRoute><Automacao /></ProtectedRoute>} />
      <Route path="/dashboard/relatorios" element={<ProtectedRoute><Relatorios /></ProtectedRoute>} />
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

const ThemeAndLanguageProvider = ({ children }: { children: React.ReactNode }) => {
  const { preferences } = useUserPreferences();
  useThemeEffect();
  
  useEffect(() => {
    if (preferences.language) {
      i18n.changeLanguage(preferences.language);
    }
  }, [preferences.language]);

  return <>{children}</>;
};

const App = () => {
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        retry: 1,
        refetchOnWindowFocus: false,
      },
    },
  }));

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <BrowserRouter>
          <AuthProvider>
            <ThemeAndLanguageProvider>
              <AppRoutes />
            </ThemeAndLanguageProvider>
          </AuthProvider>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
