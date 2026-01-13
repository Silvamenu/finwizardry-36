
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

interface Profile {
  id: string;
  name: string;
  email: string;
  avatar_url?: string;
}

interface ProfileUpdateData {
  name?: string;
  email?: string;
  avatar_url?: string;
}

export function useProfile() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const fetchProfile = async (): Promise<Profile | null> => {
    if (!user?.id) return null;

    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id as any)
      .single();

    if (error) {
      console.error('Error fetching profile:', error);
      throw error;
    }

    return data as unknown as Profile;
  };

  const updateProfile = async (profileData: ProfileUpdateData): Promise<Profile> => {
    if (!user?.id) throw new Error('User not authenticated');

    const updateData: { 
      name?: string; 
      email?: string; 
      avatar_url?: string;
    } = {};
    
    if (profileData.name !== undefined) updateData.name = profileData.name;
    if (profileData.email !== undefined) updateData.email = profileData.email;
    if (profileData.avatar_url !== undefined) updateData.avatar_url = profileData.avatar_url;

    const { data, error } = await supabase
      .from('profiles')
      .update(updateData as any)
      .eq('id', user.id as any)
      .select()
      .single();

    if (error) {
      console.error('Error updating profile:', error);
      throw error;
    }

    return data as unknown as Profile;
  };

  const uploadAvatar = async (file: File): Promise<string> => {
    if (!user?.id) throw new Error('User not authenticated');

    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}.${fileExt}`;
    // Use folder-based path: {user_id}/{filename} for RLS policy enforcement
    const filePath = `${user.id}/${fileName}`;

    const { data: buckets } = await supabase.storage.listBuckets();
    if (!buckets?.find(bucket => bucket.name === 'avatars')) {
      await supabase.storage.createBucket('avatars', {
        public: true,
        fileSizeLimit: 1024 * 1024 * 2 // 2MB
      });
    }

    const { error: uploadError } = await supabase.storage
      .from('avatars')
      .upload(filePath, file);

    if (uploadError) {
      console.error('Error uploading avatar:', uploadError);
      throw uploadError;
    }

    const { data } = supabase.storage.from('avatars').getPublicUrl(filePath);
    return data.publicUrl;
  };

  const profileQuery = useQuery({
    queryKey: ['profile', user?.id],
    queryFn: fetchProfile,
    enabled: !!user?.id,
  });

  const updateProfileMutation = useMutation({
    mutationFn: updateProfile,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profile', user?.id] });
      toast.success('Perfil atualizado com sucesso!');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Erro ao atualizar perfil');
    }
  });

  const uploadAvatarMutation = useMutation({
    mutationFn: uploadAvatar,
    onSuccess: (publicUrl) => {
      updateProfileMutation.mutate({ avatar_url: publicUrl });
    },
    onError: (error: any) => {
      toast.error(error.message || 'Erro ao fazer upload da imagem');
    }
  });

  return {
    profile: profileQuery.data,
    isLoading: profileQuery.isLoading,
    error: profileQuery.error,
    updateProfile: updateProfileMutation.mutate,
    uploadAvatar: uploadAvatarMutation.mutate,
    isUpdating: updateProfileMutation.isPending,
    isUploading: uploadAvatarMutation.isPending
  };
}
