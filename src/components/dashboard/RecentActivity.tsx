
import { 
  Card, 
  CardHeader, 
  CardTitle, 
  CardContent 
} from "@/components/ui/card";
import { ShoppingCart, Coffee, Home, Car, CreditCard, DollarSign } from "lucide-react";

// Simulated recent transactions
const transactions = [
  {
    id: 1,
    description: "Supermercado Extra",
    amount: -156.78,
    date: "Hoje, 14:30",
    category: "Alimentação",
    icon: ShoppingCart
  },
  {
    id: 2,
    description: "Starbucks",
    amount: -22.90,
    date: "Hoje, 10:15",
    category: "Café",
    icon: Coffee
  },
  {
    id: 3,
    description: "Aluguel",
    amount: -1200.00,
    date: "Ontem, 08:00",
    category: "Moradia",
    icon: Home
  },
  {
    id: 4,
    description: "Posto Shell",
    amount: -150.00,
    date: "Ontem, 17:45",
    category: "Transporte",
    icon: Car
  },
  {
    id: 5,
    description: "Salário",
    amount: 3500.00,
    date: "26/06/2023",
    category: "Receita",
    icon: DollarSign
  },
  {
    id: 6,
    description: "Netflix",
    amount: -39.90,
    date: "25/06/2023",
    category: "Entretenimento",
    icon: CreditCard
  }
];

const RecentActivity = () => {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value);
  };

  const getIconColorClass = (amount: number) => {
    return amount >= 0 ? "bg-green-100 text-green-600" : "bg-red-100 text-red-600";
  };

  return (
    <Card className="h-full animate-fade-in reveal-delay-2">
      <CardHeader>
        <CardTitle className="text-lg font-medium">Atividade Recente</CardTitle>
      </CardHeader>
      <CardContent className="overflow-hidden">
        <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2">
          {transactions.map((transaction) => (
            <div 
              key={transaction.id} 
              className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0"
            >
              <div className="flex items-center">
                <div className={`p-2 rounded-full ${getIconColorClass(transaction.amount)} mr-3`}>
                  <transaction.icon className="h-4 w-4" />
                </div>
                <div>
                  <p className="font-medium text-sm">{transaction.description}</p>
                  <p className="text-xs text-gray-500">{transaction.date} • {transaction.category}</p>
                </div>
              </div>
              <p className={`font-medium ${transaction.amount >= 0 ? "text-green-600" : "text-red-600"}`}>
                {formatCurrency(transaction.amount)}
              </p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default RecentActivity;
