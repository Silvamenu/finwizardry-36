import heroImage from '@/assets/login-hero.png';
import { SignInPage } from "@/components/ui/sign-in";
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { useState } from 'react';

const LoginPage = () => {
  const { signIn, signInWithGoogle } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  const handleSignIn = async (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    setIsLoading(true);

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
    } catch (error: any) {
      toast.error(error.message || "Falha no login. Verifique suas credenciais.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      await signInWithGoogle();
    } catch (error: any) {
      toast.error(error.message || "Erro ao fazer login com Google.");
    }
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