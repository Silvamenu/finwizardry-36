
import { 
  Card, 
  CardHeader, 
  CardTitle, 
  CardContent 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CalendarDays, CreditCard, Check, Clock, AlertCircle } from "lucide-react";

// Simulated upcoming transactions
const upcomingTransactions = [
  {
    id: 1,
    description: "Netflix",
    amount: 39.90,
    dueDate: "30/07/2023",
    status: "pending",
    recurrent: true,
    category: "Entretenimento",
    paymentMethod: "Cartão Nubank",
    icon: CreditCard
  },
  {
    id: 2,
    description: "Academia",
    amount: 99.90,
    dueDate: "05/08/2023",
    status: "pending",
    recurrent: true,
    category: "Saúde",
    paymentMethod: "Débito Automático",
    icon: CreditCard
  },
  {
    id: 3,
    description: "Aluguel",
    amount: 1200.00,
    dueDate: "10/08/2023",
    status: "pending",
    recurrent: true,
    category: "Moradia",
    paymentMethod: "Transferência Bancária",
    icon: CreditCard
  },
  {
    id: 4,
    description: "Internet",
    amount: 120.00,
    dueDate: "12/08/2023",
    status: "pending",
    recurrent: true,
    category: "Serviços",
    paymentMethod: "Boleto",
    icon: CreditCard
  }
];

const UpcomingTransactions = () => {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <Check className="h-4 w-4 text-green-500" />;
      case 'pending':
        return <Clock className="h-4 w-4 text-amber-500" />;
      case 'overdue':
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      default:
        return <Clock className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'completed':
        return 'Pago';
      case 'pending':
        return 'Pendente';
      case 'overdue':
        return 'Atrasado';
      default:
        return 'Desconhecido';
    }
  };

  // Calculate the total of upcoming transactions
  const total = upcomingTransactions.reduce((sum, transaction) => sum + transaction.amount, 0);

  return (
    <Card className="animate-fade-in reveal-delay-3">
      <CardHeader className="flex flex-row items-center justify-between">
        <div className="flex items-center">
          <CalendarDays className="mr-2 h-5 w-5 text-momoney-600" />
          <CardTitle className="text-lg font-medium">Próximos Pagamentos</CardTitle>
        </div>
        <Button variant="outline" size="sm">Ver Todos</Button>
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
              {upcomingTransactions.map((transaction) => (
                <tr key={transaction.id} className="hover:bg-muted/50">
                  <td className="px-4 py-3 text-sm font-medium">
                    <div className="flex items-center">
                      <transaction.icon className="mr-2 h-4 w-4 text-muted-foreground" />
                      {transaction.description}
                      {transaction.recurrent && (
                        <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-primary/10 text-primary">
                          Recorrente
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm text-muted-foreground">{transaction.category}</td>
                  <td className="px-4 py-3 text-sm text-muted-foreground">{transaction.dueDate}</td>
                  <td className="px-4 py-3 text-sm font-medium">{formatCurrency(transaction.amount)}</td>
                  <td className="px-4 py-3 text-sm">
                    <div className="flex items-center">
                      {getStatusIcon(transaction.status)}
                      <span className="ml-1">{getStatusText(transaction.status)}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm text-muted-foreground">{transaction.paymentMethod}</td>
                  <td className="px-4 py-3 text-sm text-right">
                    <Button variant="ghost" size="sm">Pagar</Button>
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="bg-muted/50">
                <td colSpan={3} className="px-4 py-3 text-sm font-medium">Total</td>
                <td className="px-4 py-3 text-sm font-bold">{formatCurrency(total)}</td>
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
