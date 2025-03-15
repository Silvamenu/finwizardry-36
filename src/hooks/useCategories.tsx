
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

export interface Category {
  id: string;
  name: string;
  type: string;
  color: string | null;
  icon: string | null;
  user_id: string;
  created_at: string;
}

export interface CategoryFormData {
  name: string;
  type: string;
  color?: string | null;
  icon?: string | null;
}

export function useCategories() {
  const { user } = useAuth();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCategories = useCallback(async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .order('name');

      if (error) throw error;

      setCategories(data || []);
    } catch (err: any) {
      console.error('Erro ao buscar categorias:', err);
      setError(err.message);
      toast.error('Erro ao carregar categorias');
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  const addCategory = async (categoryData: CategoryFormData) => {
    if (!user) return null;
    
    try {
      const { data, error } = await supabase
        .from('categories')
        .insert([{
          ...categoryData,
          user_id: user.id
        }])
        .select();

      if (error) throw error;
      
      toast.success('Categoria criada com sucesso!');
      await fetchCategories();
      return data[0];
    } catch (err: any) {
      console.error('Erro ao adicionar categoria:', err);
      toast.error('Erro ao criar categoria');
      return null;
    }
  };

  const updateCategory = async (id: string, categoryData: Partial<CategoryFormData>) => {
    if (!user) return false;
    
    try {
      const { error } = await supabase
        .from('categories')
        .update(categoryData)
        .eq('id', id);

      if (error) throw error;
      
      toast.success('Categoria atualizada com sucesso!');
      await fetchCategories();
      return true;
    } catch (err: any) {
      console.error('Erro ao atualizar categoria:', err);
      toast.error('Erro ao atualizar categoria');
      return false;
    }
  };

  const deleteCategory = async (id: string) => {
    if (!user) return false;
    
    try {
      const { error } = await supabase
        .from('categories')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      toast.success('Categoria excluída com sucesso!');
      await fetchCategories();
      return true;
    } catch (err: any) {
      console.error('Erro ao excluir categoria:', err);
      toast.error('Erro ao excluir categoria');
      return false;
    }
  };

  return {
    categories,
    loading,
    error,
    fetchCategories,
    addCategory,
    updateCategory,
    deleteCategory
  };
}
