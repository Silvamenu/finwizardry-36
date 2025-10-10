import heroImage from '@/assets/login-hero.png';
import { SignInPage } from "@/components/ui/sign-in";
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { useState } from 'react';

const LoginPage = () => {
  const { signIn } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  const handleSignIn = async (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    setIsLoading(true);

    // Pega o formulário pai do botão para acessar os campos
    const form = (event.target as HTMLButtonElement).closest('form');
    if (!form) {
      toast.error("Ocorreu um erro inesperado. Formulário não encontrado.");
      setIsLoading(false);
      return;
    }

    const email = (form.elements.namedItem('email') as HTMLInputElement)?.value;
    const password = (form.elements.namedItem('password') as HTMLInputElement)?.value;

    try {
      await signIn(email, password);
      // O redirecionamento para /dashboard é feito dentro da função signIn no AuthContext
    } catch (error: any) {
      toast.error(error.message || "Falha no login. Verifique suas credenciais.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    toast.info("Login com Google em desenvolvimento.");
  };
 
  const handleResetPassword = () => {
    alert("Reset Password clicked");
  }

  const handleCreateAccount = () => {
    alert("Create Account clicked");
  }

  return (
    <SignInPage
      heroImageSrc={heroImage}
      isLoading={isLoading}
      onSignIn={handleSignIn}
      onGoogleSignIn={handleGoogleSignIn}
      onResetPassword={handleResetPassword}
      onCreateAccount={handleCreateAccount}
    />
  );
};

export default LoginPage;