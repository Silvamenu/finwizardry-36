
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

export interface UserPreferences {
  id?: string;
  user_id?: string;
  theme: 'light' | 'dark' | 'system';
  language: string;
  currency: string;
  show_balance: boolean;
  date_format: string;
  notifications_enabled: boolean;
  email_notifications: boolean;
}

const defaultPreferences: UserPreferences = {
  theme: 'system',
  language: 'pt-BR',
  currency: 'BRL',
  show_balance: true,
  date_format: 'dd/MM/yyyy',
  notifications_enabled: true,
  email_notifications: true,
};

export function useUserPreferences() {
  const { user } = useAuth();
  const [preferences, setPreferences] = useState<UserPreferences>(defaultPreferences);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [initialized, setInitialized] = useState(false);

  // Load preferences from Supabase
  useEffect(() => {
    async function loadPreferences() {
      if (!user) {
        // If no user, use default preferences and mark as not loading
        setPreferences(defaultPreferences);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('user_preferences')
          .select('*')
          .eq('user_id', user.id)
          .maybeSingle();

        if (error) {
          console.error('Error loading preferences:', error);
          // Don't show toast here, just use defaults
          setPreferences(defaultPreferences);
          return;
        }

        if (data) {
          setPreferences(data as UserPreferences);
          setInitialized(true);
        } else {
          // If no preferences exist yet, create default ones
          try {
            const { error: insertError } = await supabase
              .from('user_preferences')
              .insert({
                ...defaultPreferences,
                user_id: user.id
              });
              
            if (insertError) {
              console.error('Error creating default preferences:', insertError);
            } else {
              setInitialized(true);
            }
          } catch (err) {
            console.error('Failed to create default preferences:', err);
          }
          
          // Use defaults regardless of success/failure of insert
          setPreferences(defaultPreferences);
        }
      } catch (error) {
        console.error('Failed to load preferences:', error);
        setPreferences(defaultPreferences);
      } finally {
        setLoading(false);
      }
    }

    loadPreferences();
  }, [user]);

  // Save preferences to Supabase
  const savePreferences = async (newPreferences: UserPreferences): Promise<boolean> => {
    if (!user) return false;

    try {
      setSaving(true);
      
      const prefsToSave = {
        ...newPreferences,
        user_id: user.id
      };
      
      if (initialized) {
        // Update existing preferences
        const { error } = await supabase
          .from('user_preferences')
          .update({
            ...prefsToSave,
            updated_at: new Date().toISOString()
          })
          .eq('user_id', user.id);
          
        if (error) {
          throw error;
        }
      } else {
        // Insert new preferences
        const { error } = await supabase
          .from('user_preferences')
          .insert(prefsToSave);
          
        if (error) {
          throw error;
        }
        setInitialized(true);
      }

      setPreferences(newPreferences);
      toast.success('Preferências salvas com sucesso');
      return true;
    } catch (error: any) {
      console.error('Error saving preferences:', error);
      toast.error('Erro ao salvar suas preferências: ' + (error.message || 'Erro desconhecido'));
      return false;
    } finally {
      setSaving(false);
    }
  };

  return {
    preferences,
    setPreferences,
    savePreferences,
    loading,
    saving,
    initialized
  };
}
