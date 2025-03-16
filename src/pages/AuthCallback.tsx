
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
        // Get the session from the URL
        const { data, error } = await supabase.auth.getSession();
        
        if (error) {
          throw error;
        }

        if (data?.session) {
          toast.success("Login realizado com sucesso!");
          // Redirect to dashboard after a short delay
          setTimeout(() => {
            navigate("/dashboard");
          }, 1500); // Small delay to show the success toast
        } else {
          // If no session, redirect to login
          navigate("/login");
        }
      } catch (error: any) {
        console.error("Auth callback error:", error);
        toast.error(error.message || "Erro durante autenticação");
        // Redirect to login after a short delay
        setTimeout(() => {
          navigate("/login");
        }, 1500);
      }
    };

    // Call the function
    handleAuthCallback();
  }, [navigate]);

  return <LoadingScreen message="Autenticando..." />;
};

export default AuthCallback;
