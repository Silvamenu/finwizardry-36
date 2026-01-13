import heroImage from '@/assets/login-hero.png';
import { SignInPage } from "@/components/ui/sign-in";
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { useState } from 'react';

const LoginPage = () => {
  const { signIn, signUp, signInWithGoogle } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'signin' | 'signup'>('signin');

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

  const handleSignUp = async (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    setIsLoading(true);

    const form = (event.target as HTMLButtonElement).closest('form');
    if (!form) {
      toast.error("Ocorreu um erro inesperado. Formulário não encontrado.");
      setIsLoading(false);
      return;
    }

    const name = (form.elements.namedItem('name') as HTMLInputElement)?.value;
    const email = (form.elements.namedItem('signupEmail') as HTMLInputElement)?.value;
    const password = (form.elements.namedItem('signupPassword') as HTMLInputElement)?.value;
    const confirmPassword = (form.elements.namedItem('confirmPassword') as HTMLInputElement)?.value;

    if (!name || !email || !password || !confirmPassword) {
      toast.error("Por favor, preencha todos os campos.");
      setIsLoading(false);
      return;
    }

    if (password !== confirmPassword) {
      toast.error("As senhas não coincidem.");
      setIsLoading(false);
      return;
    }

    if (password.length < 6) {
      toast.error("A senha deve ter pelo menos 6 caracteres.");
      setIsLoading(false);
      return;
    }

    try {
      await signUp(email, password, name);
      toast.success("Conta criada! Verifique seu email para confirmar o cadastro.");
      setActiveTab('signin');
    } catch (error: any) {
      toast.error(error.message || "Erro ao criar conta.");
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
    toast.info("Funcionalidade de reset de senha em desenvolvimento.");
  };

  return (
    <SignInPage
      heroImageSrc={heroImage}
      isLoading={isLoading}
      activeTab={activeTab}
      onTabChange={setActiveTab}
      onSignIn={handleSignIn}
      onSignUp={handleSignUp}
      onGoogleSignIn={handleGoogleSignIn}
      onResetPassword={handleResetPassword}
    />
  );
};

export default LoginPage;