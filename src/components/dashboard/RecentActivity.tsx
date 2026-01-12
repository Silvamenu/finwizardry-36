import { 
  Card, 
  CardHeader, 
  CardTitle, 
  CardContent 
} from "@/components/ui/card";
import { ShoppingCart, Coffee, Home, Car, CreditCard, DollarSign, TrendingUp, Loader2, Receipt, LucideIcon } from "lucide-react";
import { useTransactions, Transaction } from "@/hooks/useTransactions";
import { useCategories, Category } from "@/hooks/useCategories";
import { useMemo } from "react";
import { format, isToday, isYesterday, parseISO } from "date-fns";
import { ptBR } from "date-fns/locale";

// Map category names/types to icons
const getCategoryIcon = (categoryName: string | null, transactionType: string): LucideIcon => {
  if (!categoryName) {
    return transactionType === 'income' ? DollarSign : Receipt;
  }
  
  const lowerName = categoryName.toLowerCase();
  
  if (lowerName.includes('alimentação') || lowerName.includes('mercado') || lowerName.includes('supermercado')) {
    return ShoppingCart;
  }
  if (lowerName.includes('café') || lowerName.includes('restaurante') || lowerName.includes('lanche')) {
    return Coffee;
  }
  if (lowerName.includes('moradia') || lowerName.includes('aluguel') || lowerName.includes('casa')) {
    return Home;
  }
  if (lowerName.includes('transporte') || lowerName.includes('combustível') || lowerName.includes('uber') || lowerName.includes('carro')) {
    return Car;
  }
  if (lowerName.includes('investimento') || lowerName.includes('ações') || lowerName.includes('renda')) {
    return TrendingUp;
  }
  if (lowerName.includes('receita') || lowerName.includes('salário')) {
    return DollarSign;
  }
  
  return transactionType === 'income' ? DollarSign : CreditCard;
};

const formatTransactionDate = (dateString: string): string => {
  const date = parseISO(dateString);
  
  if (isToday(date)) {
    return `Hoje, ${format(date, 'HH:mm')}`;
  }
  
  if (isYesterday(date)) {
    return `Ontem, ${format(date, 'HH:mm')}`;
  }
  
  return format(date, "dd/MM/yyyy", { locale: ptBR });
};

const RecentActivity = () => {
  const { transactions, loading: transactionsLoading } = useTransactions();
  const { categories, loading: categoriesLoading } = useCategories();

  const loading = transactionsLoading || categoriesLoading;

  // Create a map for quick category lookup
  const categoryMap = useMemo(() => {
    const map = new Map<string, Category>();
    categories.forEach(cat => map.set(cat.id, cat));
    return map;
  }, [categories]);

  // Get the 6 most recent transactions
  const recentTransactions = useMemo(() => {
    return transactions.slice(0, 6);
  }, [transactions]);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value);
  };

  const getIconColorClass = (type: string) => {
    return type === 'income'
      ? "bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400" 
      : "bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400";
  };

  const getDisplayAmount = (transaction: Transaction) => {
    // For display purposes, expenses show as negative
    return transaction.type === 'expense' ? -Math.abs(transaction.amount) : Math.abs(transaction.amount);
  };

  if (loading) {
    return (
      <Card className="h-full animate-fade-in reveal-delay-2">
        <CardHeader>
          <CardTitle className="text-lg font-medium">Atividade Recente</CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-center py-8">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </CardContent>
      </Card>
    );
  }

  if (recentTransactions.length === 0) {
    return (
      <Card className="h-full animate-fade-in reveal-delay-2">
        <CardHeader>
          <CardTitle className="text-lg font-medium">Atividade Recente</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center py-8 text-center">
          <Receipt className="h-10 w-10 text-muted-foreground mb-2" />
          <p className="text-muted-foreground text-sm">Nenhuma transação registrada ainda.</p>
          <p className="text-muted-foreground text-xs">Adicione uma transação para começar.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="h-full animate-fade-in reveal-delay-2">
      <CardHeader>
        <CardTitle className="text-lg font-medium">Atividade Recente</CardTitle>
      </CardHeader>
      <CardContent className="overflow-hidden">
        <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2">
          {recentTransactions.map((transaction) => {
            const category = transaction.category_id ? categoryMap.get(transaction.category_id) : null;
            const categoryName = category?.name || null;
            const Icon = getCategoryIcon(categoryName, transaction.type);
            const displayAmount = getDisplayAmount(transaction);

            return (
              <div 
                key={transaction.id} 
                className="flex items-center justify-between py-2 border-b border-border last:border-0"
              >
                <div className="flex items-center">
                  <div className={`p-2 rounded-full ${getIconColorClass(transaction.type)} mr-3`}>
                    <Icon className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="font-medium text-sm">{transaction.description}</p>
                    <p className="text-xs text-muted-foreground">
                      {formatTransactionDate(transaction.date)} 
                      {categoryName && ` • ${categoryName}`}
                    </p>
                  </div>
                </div>
                <p className={`font-medium ${transaction.type === 'income' ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"}`}>
                  {formatCurrency(displayAmount)}
                </p>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

export default RecentActivity;
