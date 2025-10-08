
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { Transaction } from '@/hooks/useTransactions';
import { useCategories } from '@/hooks/useCategories';

export interface FinancialSummary {
  totalIncome: number;
  totalExpense: number;
  balance: number;
  incomeByCategory: Record<string, number>;
  expenseByCategory: Record<string, number>;
  monthlyData: {
    month: string;
    income: number;
    expense: number;
    balance: number;
  }[];
  spendingByCategory: { name: string; value: number; color: string }[];
}

export const useFinancialData = () => {
  const { user } = useAuth();
  const { categories } = useCategories();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [summary, setSummary] = useState<FinancialSummary>({
    totalIncome: 0,
    totalExpense: 0,
    balance: 0,
    incomeByCategory: {},
    expenseByCategory: {},
    monthlyData: [],
    spendingByCategory: [],
  });
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

      setTransactions(data as Transaction[] || []);
    } catch (err: any) {
      console.error('Error fetching transactions:', err);
      setError(err.message);
      toast.error('Error loading transactions');
    } finally {
      setLoading(false);
    }
  }, [user]);

  // Calculate financial summary from transactions
  const calculateSummary = useCallback(() => {
    if (!transactions.length) {
      setSummary({
        totalIncome: 0,
        totalExpense: 0,
        balance: 0,
        incomeByCategory: {},
        expenseByCategory: {},
        monthlyData: [],
        spendingByCategory: [],
      });
      return;
    }

    // Calculate totals
    const totalIncome = transactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + Number(t.amount), 0);
      
    const totalExpense = transactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + Number(t.amount), 0);
      
    const balance = totalIncome - totalExpense;

    // Group by category
    const incomeByCategory: Record<string, number> = {};
    const expenseByCategory: Record<string, number> = {};
    
    // Process transactions by category
    transactions.forEach(transaction => {
      if (!transaction.category_id) return;
      
      const categoryId = transaction.category_id;
      const amount = Number(transaction.amount);
      
      if (transaction.type === 'income') {
        incomeByCategory[categoryId] = (incomeByCategory[categoryId] || 0) + amount;
      } else if (transaction.type === 'expense') {
        expenseByCategory[categoryId] = (expenseByCategory[categoryId] || 0) + amount;
      }
    });

    // Calculate monthly data (last 6 months)
    const monthlyData = calculateMonthlyData(transactions);

    // Calculate spending by category for charts
    const spendingByCategory = calculateSpendingByCategory(transactions, categories);

    setSummary({
      totalIncome,
      totalExpense,
      balance,
      incomeByCategory,
      expenseByCategory,
      monthlyData,
      spendingByCategory,
    });
  }, [transactions, categories]);

  // Helper function to get monthly data
  const calculateMonthlyData = (transactions: Transaction[]) => {
    const months: Record<string, { income: number; expense: number }> = {};
    
    // Get last 6 months including current
    const today = new Date();
    for (let i = 0; i < 6; i++) {
      const date = new Date(today.getFullYear(), today.getMonth() - i, 1);
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      const monthName = date.toLocaleString('default', { month: 'short' });
      months[monthKey] = { income: 0, expense: 0 };
    }

    // Group transactions by month
    transactions.forEach(transaction => {
      const date = new Date(transaction.date);
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      
      if (months[monthKey]) {
        if (transaction.type === 'income') {
          months[monthKey].income += Number(transaction.amount);
        } else if (transaction.type === 'expense') {
          months[monthKey].expense += Number(transaction.amount);
        }
      }
    });

    // Convert to array and calculate balance
    return Object.entries(months).map(([monthKey, data]) => {
      const [year, month] = monthKey.split('-');
      const date = new Date(Number(year), Number(month) - 1, 1);
      const monthName = date.toLocaleString('default', { month: 'short' });
      
      return {
        month: monthName,
        income: data.income,
        expense: data.expense,
        balance: data.income - data.expense,
      };
    }).reverse();
  };

  // Helper function to calculate spending by category
  const calculateSpendingByCategory = (transactions: Transaction[], categories: any[]) => {
    const categoryTotals: Record<string, number> = {};
    
    // Sum expenses by category
    transactions
      .filter(t => t.type === 'expense' && t.category_id)
      .forEach(transaction => {
        const categoryId = transaction.category_id as string;
        categoryTotals[categoryId] = (categoryTotals[categoryId] || 0) + Number(transaction.amount);
      });
    
    // Map to format needed for charts
    const result = Object.entries(categoryTotals).map(([categoryId, value]) => {
      const category = categories.find(c => c.id === categoryId);
      return {
        name: category ? category.name : 'Other',
        value,
        color: category?.color || '#6b7280',
      };
    });
    
    // Sort by value (descending)
    return result.sort((a, b) => b.value - a.value);
  };

  // Setup real-time listener for transactions
  useEffect(() => {
    if (!user) return;

    fetchTransactions();

    // Setup real-time subscription
    const channel = supabase
      .channel('financial-data-changes')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'transactions' }, 
        () => {
          fetchTransactions();
        })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user, fetchTransactions]);

  // Calculate summary when transactions change
  useEffect(() => {
    calculateSummary();
  }, [transactions, calculateSummary]);

  return {
    transactions,
    summary,
    loading,
    error,
    refetch: fetchTransactions,
  };
};
