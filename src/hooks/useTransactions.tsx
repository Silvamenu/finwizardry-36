
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

      // Use type assertion to ensure data is treated as Transaction[]
      setTransactions(data as Transaction[] || []);
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
      // Create object that matches the Supabase table schema
      const newTransaction = {
        description: transactionData.description,
        amount: transactionData.amount,
        category_id: transactionData.category_id,
        type: transactionData.type,
        date: transactionData.date,
        payment_method: transactionData.payment_method,
        status: transactionData.status,
        user_id: user.id
      };

      const { data, error } = await supabase
        .from('transactions')
        .insert([newTransaction])
        .select();

      if (error) throw error;
      
      toast.success('Transação criada com sucesso!');
      await fetchTransactions();
      return data[0] as Transaction;
    } catch (err: any) {
      console.error('Erro ao adicionar transação:', err);
      toast.error('Erro ao criar transação');
      return null;
    }
  };

  const updateTransaction = async (id: string, transactionData: Partial<TransactionFormData>) => {
    if (!user) return false;
    
    try {
      // Create update object that matches the Supabase table schema
      const updateData: { 
        description?: string;
        amount?: number;
        category_id?: string | null;
        type?: string;
        date?: string;
        payment_method?: string | null;
        status?: string;
      } = {};
      
      if (transactionData.description !== undefined) updateData.description = transactionData.description;
      if (transactionData.amount !== undefined) updateData.amount = transactionData.amount;
      if (transactionData.category_id !== undefined) updateData.category_id = transactionData.category_id;
      if (transactionData.type !== undefined) updateData.type = transactionData.type;
      if (transactionData.date !== undefined) updateData.date = transactionData.date;
      if (transactionData.payment_method !== undefined) updateData.payment_method = transactionData.payment_method;
      if (transactionData.status !== undefined) updateData.status = transactionData.status;

      const { error } = await supabase
        .from('transactions')
        .update(updateData)
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
