
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { LandingAuthProvider } from "./contexts/LandingAuthContext";
import { useAuth } from "./contexts/AuthContext";
import { useState, useEffect } from "react";
import { useThemeEffect } from "./hooks/useThemeEffect";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useUserPreferences } from "./hooks/useUserPreferences";
import i18n from "./i18n";
import { LoadingScreen } from "@/components/ui/loading-screen";
import { Toaster } from "@/components/ui/sonner";

// Landing pages (separate Supabase)
import LandingIndex from "@/pages/LandingIndex";
import LandingLogin from "@/pages/LandingLogin";
import LandingSignup from "@/pages/LandingSignup";
import LandingForgotPassword from "@/pages/LandingForgotPassword";
import LandingResetPassword from "@/pages/LandingResetPassword";

// Dashboard pages (main Supabase)
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
import MFAVerify from "@/pages/MFAVerify";
import NotFound from "@/pages/NotFound";
import AuthCallback from "@/pages/AuthCallback";

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

const LandingRoutes = () => (
  <LandingAuthProvider>
    <Routes>
      <Route path="/" element={<LandingIndex />} />
      <Route path="/login" element={<LandingLogin />} />
      <Route path="/signup" element={<LandingSignup />} />
      <Route path="/forgot-password" element={<LandingForgotPassword />} />
      <Route path="/reset-password" element={<LandingResetPassword />} />
    </Routes>
  </LandingAuthProvider>
);

const DashboardRoutes = () => (
  <AuthProvider>
    <ThemeAndLanguageProvider>
      <Routes>
        <Route path="/auth-callback" element={<AuthCallback />} />
        <Route path="/mfa-verify" element={<MFAVerify />} />
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
    </ThemeAndLanguageProvider>
  </AuthProvider>
);

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
          <Routes>
            {/* Landing pages with separate Supabase */}
            <Route path="/" element={<LandingAuthProvider><LandingIndex /></LandingAuthProvider>} />
            <Route path="/login" element={<LandingAuthProvider><LandingLogin /></LandingAuthProvider>} />
            <Route path="/signup" element={<LandingAuthProvider><LandingSignup /></LandingAuthProvider>} />
            <Route path="/forgot-password" element={<LandingAuthProvider><LandingForgotPassword /></LandingAuthProvider>} />
            <Route path="/reset-password" element={<LandingAuthProvider><LandingResetPassword /></LandingAuthProvider>} />
            
            {/* Dashboard routes with main Supabase */}
            <Route path="/auth-callback" element={<AuthProvider><AuthCallback /></AuthProvider>} />
            <Route path="/mfa-verify" element={<AuthProvider><MFAVerify /></AuthProvider>} />
            <Route path="/dashboard/*" element={
              <AuthProvider>
                <ThemeAndLanguageProvider>
                  <Routes>
                    <Route path="/" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
                    <Route path="/analytics" element={<ProtectedRoute><Analytics /></ProtectedRoute>} />
                    <Route path="/automacao" element={<ProtectedRoute><Automacao /></ProtectedRoute>} />
                    <Route path="/relatorios" element={<ProtectedRoute><Relatorios /></ProtectedRoute>} />
                    <Route path="/orcamento" element={<ProtectedRoute><Orcamento /></ProtectedRoute>} />
                    <Route path="/investimentos" element={<ProtectedRoute><Investimentos /></ProtectedRoute>} />
                    <Route path="/transacoes" element={<ProtectedRoute><Transacoes /></ProtectedRoute>} />
                    <Route path="/metas" element={<ProtectedRoute><Metas /></ProtectedRoute>} />
                    <Route path="/assistente" element={<ProtectedRoute><Assistente /></ProtectedRoute>} />
                    <Route path="/configuracoes" element={<ProtectedRoute><Configuracoes /></ProtectedRoute>} />
                    <Route path="/perfil" element={<ProtectedRoute><Perfil /></ProtectedRoute>} />
                    <Route path="/mensagens" element={<ProtectedRoute><Mensagens /></ProtectedRoute>} />
                  </Routes>
                </ThemeAndLanguageProvider>
              </AuthProvider>
            } />
            <Route path="*" element={<NotFound />} />
          </Routes>
          <Toaster />
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
