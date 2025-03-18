
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
        // Detect which type of authentication action is happening
        const url = new URL(window.location.href);
        const isPasswordReset = url.hash.includes('type=recovery') || url.search.includes('type=recovery');
        const isEmailConfirmation = url.hash.includes('type=signup') || url.search.includes('type=signup');
        
        // Process URL hash/fragment or query parameters
        if (window.location.hash || window.location.search) {
          await supabase.auth.getSession();
        }
        
        // Get session after processing
        const { data, error } = await supabase.auth.getSession();
        
        if (error) {
          throw error;
        }

        if (isPasswordReset) {
          // Redirect to password reset page
          toast.success("Link de recuperação verificado! Defina sua nova senha.");
          navigate("/reset-password");
          return;
        }

        if (isEmailConfirmation) {
          toast.success("Email confirmado com sucesso!");
        }

        if (data?.session) {
          // If we have an active session, go to dashboard immediately
          toast.success("Autenticação realizada com sucesso!");
          navigate("/dashboard");
        } else {
          // No session, go to login
          navigate("/login");
        }
      } catch (error: any) {
        console.error("Auth callback error:", error);
        toast.error(error.message || "Erro durante autenticação");
        navigate("/login");
      }
    };

    handleAuthCallback();
  }, [navigate]);

  return <LoadingScreen message="Processando autenticação..." />;
};

export default AuthCallback;
