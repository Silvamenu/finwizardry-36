
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

  // Load preferences from Supabase
  useEffect(() => {
    async function loadPreferences() {
      if (!user) {
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
          toast.error('Erro ao carregar suas preferências');
          return;
        }

        if (data) {
          setPreferences(data as UserPreferences);
        } else {
          // If no preferences exist yet, create default ones
          await savePreferences({
            ...defaultPreferences,
            user_id: user.id
          });
        }
      } catch (error) {
        console.error('Failed to load preferences:', error);
      } finally {
        setLoading(false);
      }
    }

    loadPreferences();
  }, [user]);

  // Save preferences to Supabase
  const savePreferences = async (newPreferences: UserPreferences) => {
    if (!user) return;

    try {
      setSaving(true);
      
      // Check if preferences already exist for this user
      const { data: existingData, error: checkError } = await supabase
        .from('user_preferences')
        .select('id')
        .eq('user_id', user.id)
        .maybeSingle();

      if (checkError) {
        console.error('Error checking existing preferences:', checkError);
        throw checkError;
      }

      let result;
      const prefsToSave = {
        ...newPreferences,
        user_id: user.id
      };
      
      if (existingData?.id) {
        // Update existing preferences
        result = await supabase
          .from('user_preferences')
          .update({
            ...prefsToSave,
            updated_at: new Date().toISOString()
          })
          .eq('id', existingData.id);
      } else {
        // Insert new preferences
        result = await supabase
          .from('user_preferences')
          .insert(prefsToSave);
      }

      if (result.error) {
        throw result.error;
      }

      setPreferences(newPreferences);
      toast.success('Preferências salvas com sucesso');
    } catch (error) {
      console.error('Error saving preferences:', error);
      toast.error('Erro ao salvar suas preferências');
    } finally {
      setSaving(false);
    }
  };

  return {
    preferences,
    setPreferences,
    savePreferences,
    loading,
    saving
  };
}
