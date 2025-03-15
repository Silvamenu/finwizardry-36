
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

export interface Transaction {
  id: string;
  date: string;
  description: string;
  amount: number;
  category_id: string | null;
  type: string;
  status: string;
  payment_method: string | null;
  user_id: string;
  created_at: string;
}

export interface TransactionFormData {
  description: string;
  amount: number;
  category_id: string | null;
  type: string;
  date: string;
  payment_method: string | null;
  status: string;
}

export function useTransactions() {
  const { user } = useAuth();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTransactions = useCallback(async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('transactions')
        .select('*')
        .order('date', { ascending: false });

      if (error) throw error;

      setTransactions(data || []);
    } catch (err: any) {
      console.error('Erro ao buscar transações:', err);
      setError(err.message);
      toast.error('Erro ao carregar transações');
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]);

  const addTransaction = async (transactionData: TransactionFormData) => {
    if (!user) return null;
    
    try {
      const { data, error } = await supabase
        .from('transactions')
        .insert([{
          ...transactionData,
          user_id: user.id
        }])
        .select();

      if (error) throw error;
      
      toast.success('Transação criada com sucesso!');
      await fetchTransactions();
      return data[0];
    } catch (err: any) {
      console.error('Erro ao adicionar transação:', err);
      toast.error('Erro ao criar transação');
      return null;
    }
  };

  const updateTransaction = async (id: string, transactionData: Partial<TransactionFormData>) => {
    if (!user) return false;
    
    try {
      const { error } = await supabase
        .from('transactions')
        .update(transactionData)
        .eq('id', id);

      if (error) throw error;
      
      toast.success('Transação atualizada com sucesso!');
      await fetchTransactions();
      return true;
    } catch (err: any) {
      console.error('Erro ao atualizar transação:', err);
      toast.error('Erro ao atualizar transação');
      return false;
    }
  };

  const deleteTransaction = async (id: string) => {
    if (!user) return false;
    
    try {
      const { error } = await supabase
        .from('transactions')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      toast.success('Transação excluída com sucesso!');
      await fetchTransactions();
      return true;
    } catch (err: any) {
      console.error('Erro ao excluir transação:', err);
      toast.error('Erro ao excluir transação');
      return false;
    }
  };

  const exportTransactions = async (format: 'csv' | 'json' = 'csv') => {
    if (!transactions.length) {
      toast.error('Não há transações para exportar');
      return;
    }

    try {
      if (format === 'csv') {
        // Converter para CSV
        const headers = ['Data', 'Descrição', 'Valor', 'Categoria', 'Tipo', 'Status', 'Método de Pagamento'];
        const csvRows = [headers.join(',')];
        
        transactions.forEach(t => {
          const row = [
            t.date,
            `"${t.description.replace(/"/g, '""')}"`,
            t.amount,
            t.category_id || '',
            t.type,
            t.status,
            t.payment_method || ''
          ];
          csvRows.push(row.join(','));
        });
        
        const csvString = csvRows.join('\n');
        const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        
        link.setAttribute('href', url);
        link.setAttribute('download', `transacoes_${new Date().toISOString().split('T')[0]}.csv`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        toast.success('Transações exportadas com sucesso!');
      } else {
        // JSON
        const dataStr = JSON.stringify(transactions, null, 2);
        const blob = new Blob([dataStr], { type: 'application/json' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        
        link.setAttribute('href', url);
        link.setAttribute('download', `transacoes_${new Date().toISOString().split('T')[0]}.json`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        toast.success('Transações exportadas com sucesso!');
      }
    } catch (err: any) {
      console.error('Erro ao exportar transações:', err);
      toast.error('Erro ao exportar transações');
    }
  };

  return {
    transactions,
    loading,
    error,
    fetchTransactions,
    addTransaction,
    updateTransaction,
    deleteTransaction,
    exportTransactions
  };
}
