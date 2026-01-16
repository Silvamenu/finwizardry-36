import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { landingSupabase } from '@/integrations/supabase/landing-client';
import type { User, Session, AuthError } from '@supabase/supabase-js';

type Plan = 'basic' | 'standard' | 'pro';

interface SubscriptionInfo {
  subscribed: boolean;
  plan: Plan;
  subscription_end: string | null;
}

interface AuthResult {
  error: AuthError | null;
}

interface LandingAuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  subscription: SubscriptionInfo;
  checkSubscription: () => Promise<void>;
  signOut: () => Promise<void>;
  signInWithEmail: (email: string, password: string) => Promise<AuthResult>;
  signUpWithEmail: (email: string, password: string) => Promise<AuthResult>;
  signInWithGoogle: () => Promise<AuthResult>;
  resetPassword: (email: string) => Promise<AuthResult>;
  updatePassword: (newPassword: string) => Promise<AuthResult>;
}

const defaultSubscription: SubscriptionInfo = {
  subscribed: false,
  plan: 'basic',
  subscription_end: null,
};

const LandingAuthContext = createContext<LandingAuthContextType>({
  user: null,
  session: null,
  loading: true,
  subscription: defaultSubscription,
  checkSubscription: async () => {},
  signOut: async () => {},
  signInWithEmail: async () => ({ error: null }),
  signUpWithEmail: async () => ({ error: null }),
  signInWithGoogle: async () => ({ error: null }),
  resetPassword: async () => ({ error: null }),
  updatePassword: async () => ({ error: null }),
});

export const useLandingAuth = () => useContext(LandingAuthContext);

export const LandingAuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [subscription, setSubscription] = useState<SubscriptionInfo>(defaultSubscription);

  const checkSubscription = useCallback(async () => {
    if (!session?.access_token) {
      setSubscription(defaultSubscription);
      return;
    }

    try {
      const { data, error } = await landingSupabase.functions.invoke('check-subscription', {
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
      });

      if (error) {
        console.error('Error checking subscription:', error);
        return;
      }

      if (data) {
        setSubscription({
          subscribed: data.subscribed,
          plan: data.plan || 'basic',
          subscription_end: data.subscription_end,
        });
      }
    } catch (error) {
      console.error('Error checking subscription:', error);
    }
  }, [session?.access_token]);

  useEffect(() => {
    // Set up auth state listener FIRST
    const { data: { subscription: authSubscription } } = landingSupabase.auth.onAuthStateChange(
      async (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);
      }
    );

    // Then get initial session
    landingSupabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => {
      authSubscription.unsubscribe();
    };
  }, []);

  // Check subscription when session changes
  useEffect(() => {
    if (session) {
      checkSubscription();
    } else {
      setSubscription(defaultSubscription);
    }
  }, [session, checkSubscription]);

  // Periodically check subscription (every minute)
  useEffect(() => {
    if (!session) return;

    const interval = setInterval(() => {
      checkSubscription();
    }, 60000);

    return () => clearInterval(interval);
  }, [session, checkSubscription]);

  const signOut = async () => {
    await landingSupabase.auth.signOut();
    setSubscription(defaultSubscription);
  };

  const signInWithEmail = async (email: string, password: string): Promise<AuthResult> => {
    const { error } = await landingSupabase.auth.signInWithPassword({
      email,
      password,
    });
    return { error };
  };

  const signUpWithEmail = async (email: string, password: string): Promise<AuthResult> => {
    const { error } = await landingSupabase.auth.signUp({
      email,
      password,
    });
    return { error };
  };

  const signInWithGoogle = async (): Promise<AuthResult> => {
    const { error } = await landingSupabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/dashboard`,
      },
    });
    return { error };
  };

  const resetPassword = async (email: string): Promise<AuthResult> => {
    const { error } = await landingSupabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    return { error };
  };

  const updatePassword = async (newPassword: string): Promise<AuthResult> => {
    const { error } = await landingSupabase.auth.updateUser({
      password: newPassword,
    });
    return { error };
  };

  return (
    <LandingAuthContext.Provider
      value={{
        user,
        session,
        loading,
        subscription,
        checkSubscription,
        signOut,
        signInWithEmail,
        signUpWithEmail,
        signInWithGoogle,
        resetPassword,
        updatePassword,
      }}
    >
      {children}
    </LandingAuthContext.Provider>
  );
};
