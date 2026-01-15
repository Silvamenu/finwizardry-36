import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import type { Factor, AuthenticatorAssuranceLevels } from '@supabase/supabase-js';

interface MFAState {
  factors: Factor[];
  isLoading: boolean;
  isEnrolling: boolean;
  isVerifying: boolean;
  currentLevel: AuthenticatorAssuranceLevels | null;
  nextLevel: AuthenticatorAssuranceLevels | null;
  qrCode: string | null;
  secret: string | null;
  factorId: string | null;
}

export function useMFA() {
  const [state, setState] = useState<MFAState>({
    factors: [],
    isLoading: true,
    isEnrolling: false,
    isVerifying: false,
    currentLevel: null,
    nextLevel: null,
    qrCode: null,
    secret: null,
    factorId: null,
  });

  // Fetch MFA factors and assurance level
  const fetchMFAStatus = useCallback(async () => {
    try {
      setState(prev => ({ ...prev, isLoading: true }));
      
      const [factorsResult, aalResult] = await Promise.all([
        supabase.auth.mfa.listFactors(),
        supabase.auth.mfa.getAuthenticatorAssuranceLevel()
      ]);

      if (factorsResult.error) throw factorsResult.error;
      if (aalResult.error) throw aalResult.error;

      setState(prev => ({
        ...prev,
        factors: factorsResult.data?.totp || [],
        currentLevel: aalResult.data?.currentLevel || null,
        nextLevel: aalResult.data?.nextLevel || null,
        isLoading: false,
      }));
    } catch (error: any) {
      console.error('Error fetching MFA status:', error);
      setState(prev => ({ ...prev, isLoading: false }));
    }
  }, []);

  useEffect(() => {
    fetchMFAStatus();
  }, [fetchMFAStatus]);

  // Get verified factors
  const verifiedFactors = state.factors.filter(f => f.status === 'verified');
  const hasMFAEnabled = verifiedFactors.length > 0;

  // Check if user needs to verify MFA
  const needsMFAVerification = 
    state.currentLevel === 'aal1' && 
    state.nextLevel === 'aal2' && 
    hasMFAEnabled;

  // Start MFA enrollment
  const startEnrollment = async () => {
    try {
      setState(prev => ({ ...prev, isEnrolling: true }));

      const { data, error } = await supabase.auth.mfa.enroll({
        factorType: 'totp',
        issuer: 'MoMoney',
        friendlyName: 'Authenticator App'
      });

      if (error) throw error;

      setState(prev => ({
        ...prev,
        qrCode: data.totp.qr_code,
        secret: data.totp.secret,
        factorId: data.id,
        isEnrolling: false,
      }));

      return { success: true, data };
    } catch (error: any) {
      console.error('Error starting MFA enrollment:', error);
      toast.error(error.message || 'Erro ao iniciar configuração de 2FA');
      setState(prev => ({ ...prev, isEnrolling: false }));
      return { success: false, error };
    }
  };

  // Verify and complete enrollment
  const verifyEnrollment = async (code: string) => {
    if (!state.factorId) {
      toast.error('Nenhum fator para verificar');
      return { success: false };
    }

    try {
      setState(prev => ({ ...prev, isVerifying: true }));

      // Create a challenge
      const { data: challengeData, error: challengeError } = 
        await supabase.auth.mfa.challenge({ factorId: state.factorId });

      if (challengeError) throw challengeError;

      // Verify the code
      const { data: verifyData, error: verifyError } = 
        await supabase.auth.mfa.verify({
          factorId: state.factorId,
          challengeId: challengeData.id,
          code,
        });

      if (verifyError) throw verifyError;

      // Reset enrollment state and refresh factors
      setState(prev => ({
        ...prev,
        qrCode: null,
        secret: null,
        factorId: null,
        isVerifying: false,
      }));

      await fetchMFAStatus();
      toast.success('Autenticação de dois fatores ativada com sucesso!');
      return { success: true };
    } catch (error: any) {
      console.error('Error verifying MFA:', error);
      toast.error(error.message || 'Código inválido. Tente novamente.');
      setState(prev => ({ ...prev, isVerifying: false }));
      return { success: false, error };
    }
  };

  // Challenge and verify for login
  const challengeAndVerify = async (factorId: string, code: string) => {
    try {
      setState(prev => ({ ...prev, isVerifying: true }));

      // Create a challenge
      const { data: challengeData, error: challengeError } = 
        await supabase.auth.mfa.challenge({ factorId });

      if (challengeError) throw challengeError;

      // Verify the code
      const { data: verifyData, error: verifyError } = 
        await supabase.auth.mfa.verify({
          factorId,
          challengeId: challengeData.id,
          code,
        });

      if (verifyError) throw verifyError;

      setState(prev => ({ ...prev, isVerifying: false }));
      await fetchMFAStatus();
      return { success: true };
    } catch (error: any) {
      console.error('Error verifying MFA challenge:', error);
      toast.error(error.message || 'Código inválido. Tente novamente.');
      setState(prev => ({ ...prev, isVerifying: false }));
      return { success: false, error };
    }
  };

  // Unenroll a factor
  const unenrollFactor = async (factorId: string) => {
    try {
      const { error } = await supabase.auth.mfa.unenroll({ factorId });
      if (error) throw error;

      await fetchMFAStatus();
      toast.success('Autenticação de dois fatores desativada');
      return { success: true };
    } catch (error: any) {
      console.error('Error unenrolling MFA:', error);
      toast.error(error.message || 'Erro ao desativar 2FA');
      return { success: false, error };
    }
  };

  // Cancel enrollment
  const cancelEnrollment = async () => {
    if (state.factorId) {
      try {
        await supabase.auth.mfa.unenroll({ factorId: state.factorId });
      } catch (e) {
        // Ignore errors on cancel
      }
    }
    setState(prev => ({
      ...prev,
      qrCode: null,
      secret: null,
      factorId: null,
      isEnrolling: false,
    }));
  };

  return {
    ...state,
    hasMFAEnabled,
    verifiedFactors,
    needsMFAVerification,
    startEnrollment,
    verifyEnrollment,
    challengeAndVerify,
    unenrollFactor,
    cancelEnrollment,
    refreshStatus: fetchMFAStatus,
  };
}
