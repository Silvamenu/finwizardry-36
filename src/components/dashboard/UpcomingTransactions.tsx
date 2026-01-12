import { 
  Card, 
  CardHeader, 
  CardTitle, 
  CardContent 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CalendarDays, CreditCard, Check, Clock, AlertCircle, Loader2, Receipt } from "lucide-react";
import { useTransactions, Transaction } from "@/hooks/useTransactions";
import { useCategories, Category } from "@/hooks/useCategories";
import { useMemo } from "react";
import { format, parseISO, isAfter, isBefore, startOfDay } from "date-fns";
import { ptBR } from "date-fns/locale";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const UpcomingTransactions = () => {
  const navigate = useNavigate();
  const { transactions, loading: transactionsLoading, updateTransaction } = useTransactions();
  const { categories, loading: categoriesLoading } = useCategories();

  const loading = transactionsLoading || categoriesLoading;

  // Create a map for quick category lookup
  const categoryMap = useMemo(() => {
    const map = new Map<string, Category>();
    categories.forEach(cat => map.set(cat.id, cat));
    return map;
  }, [categories]);

  // Filter upcoming/pending expense transactions
  const upcomingTransactions = useMemo(() => {
    const today = startOfDay(new Date());
    
    return transactions
      .filter(t => {
        // Only expenses (outflows)
        if (t.type !== 'expense') return false;
        
        // Only pending or scheduled transactions
        if (t.status !== 'pending' && t.status !== 'scheduled') return false;
        
        return true;
      })
      .map(t => {
        const transactionDate = startOfDay(parseISO(t.date));
        let displayStatus = t.status;
        
        // Determine if overdue
        if (isBefore(transactionDate, today) && t.status === 'pending') {
          displayStatus = 'overdue';
        }
        
        return { ...t, displayStatus };
      })
      .sort((a, b) => {
        // Sort by date ascending (nearest first)
        return new Date(a.date).getTime() - new Date(b.date).getTime();
      })
      .slice(0, 5); // Show max 5 upcoming
  }, [transactions]);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value);
  };

  const formatDate = (dateString: string) => {
    return format(parseISO(dateString), "dd/MM/yyyy", { locale: ptBR });
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <Check className="h-4 w-4 text-green-500" />;
      case 'pending':
      case 'scheduled':
        return <Clock className="h-4 w-4 text-amber-500" />;
      case 'overdue':
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      default:
        return <Clock className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'completed':
        return 'Pago';
      case 'pending':
        return 'Pendente';
      case 'scheduled':
        return 'Agendado';
      case 'overdue':
        return 'Atrasado';
      default:
        return 'Desconhecido';
    }
  };

  const handleMarkAsPaid = async (transaction: Transaction) => {
    const success = await updateTransaction(transaction.id, { status: 'completed' });
    if (success) {
      toast.success(`"${transaction.description}" marcado como pago!`);
    }
  };

  const handleViewAll = () => {
    navigate('/dashboard/transacoes');
  };

  // Calculate the total of upcoming transactions
  const total = upcomingTransactions.reduce((sum, transaction) => sum + transaction.amount, 0);

  if (loading) {
    return (
      <Card className="animate-fade-in reveal-delay-3">
        <CardHeader className="flex flex-row items-center justify-between">
          <div className="flex items-center">
            <CalendarDays className="mr-2 h-5 w-5 text-primary" />
            <CardTitle className="text-lg font-medium">Próximos Pagamentos</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="flex items-center justify-center py-8">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </CardContent>
      </Card>
    );
  }

  if (upcomingTransactions.length === 0) {
    return (
      <Card className="animate-fade-in reveal-delay-3">
        <CardHeader className="flex flex-row items-center justify-between">
          <div className="flex items-center">
            <CalendarDays className="mr-2 h-5 w-5 text-primary" />
            <CardTitle className="text-lg font-medium">Próximos Pagamentos</CardTitle>
          </div>
          <Button variant="outline" size="sm" onClick={handleViewAll}>Ver Todos</Button>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center py-8 text-center">
          <Receipt className="h-10 w-10 text-muted-foreground mb-2" />
          <p className="text-muted-foreground text-sm">Nenhum pagamento pendente.</p>
          <p className="text-muted-foreground text-xs">Adicione transações com status "pendente" para vê-las aqui.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="animate-fade-in reveal-delay-3">
      <CardHeader className="flex flex-row items-center justify-between">
        <div className="flex items-center">
          <CalendarDays className="mr-2 h-5 w-5 text-primary" />
          <CardTitle className="text-lg font-medium">Próximos Pagamentos</CardTitle>
        </div>
        <Button variant="outline" size="sm" onClick={handleViewAll}>Ver Todos</Button>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Descrição</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Categoria</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Data</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Valor</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Status</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Método</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {upcomingTransactions.map((transaction) => {
                const category = transaction.category_id ? categoryMap.get(transaction.category_id) : null;
                const categoryName = category?.name || '-';

                return (
                  <tr key={transaction.id} className="hover:bg-muted/50">
                    <td className="px-4 py-3 text-sm font-medium">
                      <div className="flex items-center">
                        <CreditCard className="mr-2 h-4 w-4 text-muted-foreground" />
                        {transaction.description}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-muted-foreground">{categoryName}</td>
                    <td className="px-4 py-3 text-sm text-muted-foreground">{formatDate(transaction.date)}</td>
                    <td className="px-4 py-3 text-sm font-medium text-red-600 dark:text-red-400">
                      {formatCurrency(transaction.amount)}
                    </td>
                    <td className="px-4 py-3 text-sm">
                      <div className="flex items-center">
                        {getStatusIcon(transaction.displayStatus)}
                        <span className="ml-1">{getStatusText(transaction.displayStatus)}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-muted-foreground">
                      {transaction.payment_method || '-'}
                    </td>
                    <td className="px-4 py-3 text-sm text-right">
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => handleMarkAsPaid(transaction)}
                      >
                        Pagar
                      </Button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
            <tfoot>
              <tr className="bg-muted/50">
                <td colSpan={3} className="px-4 py-3 text-sm font-medium">Total</td>
                <td className="px-4 py-3 text-sm font-bold text-red-600 dark:text-red-400">{formatCurrency(total)}</td>
                <td colSpan={3}></td>
              </tr>
            </tfoot>
          </table>
        </div>
      </CardContent>
    </Card>
  );
};

export default UpcomingTransactions;
