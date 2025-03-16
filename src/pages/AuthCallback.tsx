
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { LoadingScreen } from "@/components/ui/loading-screen";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const AuthCallback = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Process the auth callback
    const handleAuthCallback = async () => {
      try {
        // Detectar qual tipo de ação de autenticação está acontecendo
        const url = new URL(window.location.href);
        const isPasswordReset = url.hash.includes('type=recovery') || url.search.includes('type=recovery');
        const isEmailConfirmation = url.hash.includes('type=signup') || url.search.includes('type=signup');
        
        // Processar explicitamente a URL hash/fragment ou query parameters
        if (window.location.hash || window.location.search) {
          await supabase.auth.getSession();
        }
        
        // Obter a sessão após processar
        const { data, error } = await supabase.auth.getSession();
        
        if (error) {
          throw error;
        }

        if (isPasswordReset) {
          // Redirecionar para página de definição de nova senha
          toast.success("Link de recuperação verificado! Defina sua nova senha.");
          navigate("/reset-password"); // Você precisará criar esta rota
          return;
        }

        if (isEmailConfirmation) {
          toast.success("Email confirmado com sucesso!");
        }

        if (data?.session) {
          // Se temos uma sessão ativa, vamos para o dashboard
          setTimeout(() => {
            navigate("/dashboard");
          }, 1500);
        } else {
          // Sem sessão, vamos para o login
          setTimeout(() => {
            navigate("/login");
          }, 1500);
        }
      } catch (error: any) {
        console.error("Auth callback error:", error);
        toast.error(error.message || "Erro durante autenticação");
        setTimeout(() => {
          navigate("/login");
        }, 1500);
      }
    };

    handleAuthCallback();
  }, [navigate]);

  return <LoadingScreen message="Processando autenticação..." />;
};

export default AuthCallback;
