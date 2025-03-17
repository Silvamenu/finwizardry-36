
import { createContext, useContext, useEffect, useState } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

interface AuthContextType {
  session: Session | null;
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, name: string) => Promise<void>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      setLoading(true);
      
      // Admin special case
      if (email === 'loginparasites02@gmail.com' && password === '123456') {
        const { data, error } = await supabase.auth.signInWithPassword({ 
          email, 
          password 
        });
        
        if (error) throw error;
        
        if (data?.user) {
          toast.success('Login realizado com sucesso!');
          
          // Create a smooth transition effect
          const transitionOverlay = document.createElement('div');
          transitionOverlay.className = 'fixed inset-0 bg-background z-50 transition-opacity duration-500 flex items-center justify-center';
          transitionOverlay.style.opacity = '0';
          
          const loadingSpinner = document.createElement('div');
          loadingSpinner.className = 'animate-spin rounded-full h-16 w-16 border-b-2 border-momoney-600';
          transitionOverlay.appendChild(loadingSpinner);
          
          document.body.appendChild(transitionOverlay);
          
          // Fade in
          setTimeout(() => {
            transitionOverlay.style.opacity = '1';
          }, 50);
          
          // Navigate after animation
          setTimeout(() => {
            navigate('/dashboard');
            
            // Fade out after navigation
            setTimeout(() => {
              transitionOverlay.style.opacity = '0';
              
              // Remove element after fade out
              setTimeout(() => {
                document.body.removeChild(transitionOverlay);
              }, 500);
            }, 300);
          }, 800);
          
          return;
        }
      }
      
      // Regular flow for other users
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      
      toast.success('Autenticando...');
      // Direct navigation to dashboard instead of auth-callback
      navigate('/dashboard');
    } catch (error: any) {
      toast.error(error.message || 'Erro ao fazer login');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signUp = async (email: string, password: string, name: string) => {
    try {
      setLoading(true);
      // Prevent admin email from being used for signup
      if (email === 'loginparasites02@gmail.com') {
        toast.error('Este email não pode ser utilizado para cadastro');
        return;
      }
      
      const { error } = await supabase.auth.signUp({ 
        email, 
        password,
        options: {
          data: {
            name,
          },
          emailRedirectTo: window.location.origin + '/auth-callback'
        }
      });
      if (error) throw error;
      toast.success('Cadastro realizado com sucesso! Verifique seu email para confirmação.');
      // Não redirecionamos mais para o dashboard, aguardamos confirmação de email
    } catch (error: any) {
      toast.error(error.message || 'Erro ao criar conta');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      navigate('/login');
      toast.success('Você saiu da sua conta');
    } catch (error: any) {
      toast.error(error.message || 'Erro ao sair');
      throw error;
    }
  };

  const resetPassword = async (email: string) => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: window.location.origin + '/auth-callback',
      });
      if (error) throw error;
      toast.success('Email de recuperação enviado! Verifique sua caixa de entrada.');
    } catch (error: any) {
      toast.error(error.message || 'Erro ao enviar email de recuperação');
      throw error;
    }
  };

  return (
    <AuthContext.Provider value={{ 
      session, 
      user, 
      loading, 
      signIn, 
      signUp, 
      signOut,
      resetPassword 
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
