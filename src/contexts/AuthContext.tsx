
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
          transitionOverlay.className = 'login-transition';
          
          const loadingSpinner = document.createElement('div');
          loadingSpinner.className = 'login-spinner';
          
          const centerContainer = document.createElement('div');
          centerContainer.className = 'flex items-center justify-center h-full';
          centerContainer.appendChild(loadingSpinner);
          
          transitionOverlay.appendChild(centerContainer);
          document.body.appendChild(transitionOverlay);
          
          // Fade in
          setTimeout(() => {
            transitionOverlay.classList.add('active');
          }, 50);
          
          // Navigate after animation
          setTimeout(() => {
            // Ensure we navigate to the dashboard
            window.location.href = '/#/dashboard';
            
            // Fade out after navigation
            setTimeout(() => {
              transitionOverlay.classList.remove('active');
              
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
      const { error, data } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      
      toast.success('Login realizado com sucesso!');
      
      // Create a smooth transition effect for regular users too
      const transitionOverlay = document.createElement('div');
      transitionOverlay.className = 'login-transition';
      
      const loadingSpinner = document.createElement('div');
      loadingSpinner.className = 'login-spinner';
      
      const centerContainer = document.createElement('div');
      centerContainer.className = 'flex items-center justify-center h-full';
      centerContainer.appendChild(loadingSpinner);
      
      transitionOverlay.appendChild(centerContainer);
      document.body.appendChild(transitionOverlay);
      
      // Fade in
      setTimeout(() => {
        transitionOverlay.classList.add('active');
      }, 50);
      
      // Navigate to dashboard directly
      setTimeout(() => {
        // Use window.location.href to ensure a full navigation to dashboard
        window.location.href = '/#/dashboard';
        
        // Fade out after navigation
        setTimeout(() => {
          transitionOverlay.classList.remove('active');
          
          // Remove element after fade out
          setTimeout(() => {
            document.body.removeChild(transitionOverlay);
          }, 500);
        }, 300);
      }, 800);
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
      
      // Update signup options to skip email confirmation
      const { error, data } = await supabase.auth.signUp({ 
        email, 
        password,
        options: {
          data: {
            name,
          },
        }
      });
      
      if (error) throw error;
      
      if (data?.user) {
        toast.success('Cadastro realizado com sucesso! Você já pode fazer login.');
        navigate('/login');
      } else {
        toast.error('Erro ao criar conta');
      }
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
