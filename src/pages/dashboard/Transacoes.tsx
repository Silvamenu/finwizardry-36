
import { useEffect, useState } from "react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { 
  ArrowDownUp, 
  Calendar, 
  Download, 
  Filter, 
  Plus, 
  Search, 
  ShoppingCart, 
  Coffee, 
  Home, 
  Car, 
  DollarSign, 
  CreditCard, 
  Briefcase 
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface Transaction {
  id: number;
  date: Date;
  description: string;
  amount: number;
  category: string;
  type: "entrada" | "saida";
  status: "concluida" | "pendente" | "agendada";
  paymentMethod: string;
  icon: any;
}

const TRANSACTIONS: Transaction[] = [
  {
    id: 1,
    date: new Date(2023, 5, 28),
    description: "Salário Mensal",
    amount: 3500,
    category: "Salário",
    type: "entrada",
    status: "concluida",
    paymentMethod: "Transferência",
    icon: Briefcase
  },
  {
    id: 2,
    date: new Date(2023, 5, 27),
    description: "Supermercado Extra",
    amount: -156.78,
    category: "Alimentação",
    type: "saida",
    status: "concluida",
    paymentMethod: "Crédito",
    icon: ShoppingCart
  },
  {
    id: 3,
    date: new Date(2023, 5, 27),
    description: "Starbucks",
    amount: -22.90,
    category: "Café",
    type: "saida",
    status: "concluida",
    paymentMethod: "Débito",
    icon: Coffee
  },
  {
    id: 4,
    date: new Date(2023, 5, 26),
    description: "Aluguel",
    amount: -1200.00,
    category: "Moradia",
    type: "saida",
    status: "concluida",
    paymentMethod: "Transferência",
    icon: Home
  },
  {
    id: 5,
    date: new Date(2023, 5, 26),
    description: "Posto Shell",
    amount: -150.00,
    category: "Transporte",
    type: "saida",
    status: "concluida",
    paymentMethod: "Crédito",
    icon: Car
  },
  {
    id: 6,
    date: new Date(2023, 5, 25),
    description: "Freelance Design",
    amount: 450.00,
    category: "Freelance",
    type: "entrada",
    status: "concluida",
    paymentMethod: "Transferência",
    icon: DollarSign
  },
  {
    id: 7,
    date: new Date(2023, 5, 25),
    description: "Netflix",
    amount: -39.90,
    category: "Entretenimento",
    type: "saida",
    status: "concluida",
    paymentMethod: "Crédito",
    icon: CreditCard
  },
  {
    id: 8,
    date: new Date(2023, 6, 1),
    description: "Transferência para Poupança",
    amount: -500.00,
    category: "Investimento",
    type: "saida",
    status: "agendada",
    paymentMethod: "Transferência",
    icon: DollarSign
  }
];

const Transacoes = () => {
  useEffect(() => {
    document.title = "MoMoney | Transações";
  }, []);

  const [searchQuery, setSearchQuery] = useState("");
  const [filteredTransactions, setFilteredTransactions] = useState<Transaction[]>(TRANSACTIONS);
  const [filter, setFilter] = useState("todas");

  useEffect(() => {
    let result = TRANSACTIONS;
    
    // Apply search filter
    if (searchQuery) {
      result = result.filter(t => 
        t.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.category.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    // Apply type filter
    if (filter === "entrada") {
      result = result.filter(t => t.type === "entrada");
    } else if (filter === "saida") {
      result = result.filter(t => t.type === "saida");
    } else if (filter === "agendada") {
      result = result.filter(t => t.status === "agendada");
    }
    
    setFilteredTransactions(result);
  }, [searchQuery, filter]);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'concluida':
        return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Concluída</Badge>;
      case 'pendente':
        return <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">Pendente</Badge>;
      case 'agendada':
        return <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">Agendada</Badge>;
      default:
        return null;
    }
  };

  return (
    <DashboardLayout activePage="Transações">
      <div className="grid gap-6">
        <div className="flex flex-col md:flex-row gap-6 md:items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">Transações</h1>
            <p className="text-gray-500">Visualize e gerencie todas as suas transações financeiras</p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Exportar
            </Button>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Nova Transação
            </Button>
          </div>
        </div>

        <Card className="w-full animate-fade-in">
          <CardHeader className="pb-2">
            <CardTitle>Histórico de Transações</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row gap-4 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                <Input 
                  type="search" 
                  placeholder="Pesquisar transações..." 
                  className="pl-8"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              
              <div className="flex gap-4">
                <div className="w-40">
                  <Select onValueChange={setFilter} defaultValue="todas">
                    <SelectTrigger>
                      <Filter className="h-4 w-4 mr-2" />
                      <SelectValue placeholder="Tipo" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="todas">Todas</SelectItem>
                      <SelectItem value="entrada">Entradas</SelectItem>
                      <SelectItem value="saida">Saídas</SelectItem>
                      <SelectItem value="agendada">Agendadas</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="w-40">
                  <Select>
                    <SelectTrigger>
                      <Calendar className="h-4 w-4 mr-2" />
                      <SelectValue placeholder="Período" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="atual">Mês Atual</SelectItem>
                      <SelectItem value="anterior">Mês Anterior</SelectItem>
                      <SelectItem value="ultimo3">Últimos 3 Meses</SelectItem>
                      <SelectItem value="ultimo6">Últimos 6 Meses</SelectItem>
                      <SelectItem value="personalizado">Personalizado</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <Button variant="outline" size="icon">
                  <ArrowDownUp className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <Tabs defaultValue="todas">
              <TabsList className="mb-6">
                <TabsTrigger value="todas">Todas</TabsTrigger>
                <TabsTrigger value="entradas">Entradas</TabsTrigger>
                <TabsTrigger value="saidas">Saídas</TabsTrigger>
                <TabsTrigger value="agendadas">Agendadas</TabsTrigger>
              </TabsList>
              
              <TabsContent value="todas" className="space-y-4">
                {filteredTransactions.length === 0 ? (
                  <div className="text-center py-10">
                    <p className="text-gray-500">Nenhuma transação encontrada</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Data</TableHead>
                          <TableHead>Descrição</TableHead>
                          <TableHead>Categoria</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Pagamento</TableHead>
                          <TableHead className="text-right">Valor</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredTransactions.map((transaction) => (
                          <TableRow key={transaction.id}>
                            <TableCell className="font-medium">
                              {format(transaction.date, "dd MMM yyyy", { locale: ptBR })}
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <div className={`p-1.5 rounded-full ${transaction.amount > 0 ? 'bg-green-100' : 'bg-red-100'}`}>
                                  <transaction.icon className={`h-3.5 w-3.5 ${transaction.amount > 0 ? 'text-green-600' : 'text-red-600'}`} />
                                </div>
                                {transaction.description}
                              </div>
                            </TableCell>
                            <TableCell>{transaction.category}</TableCell>
                            <TableCell>{getStatusBadge(transaction.status)}</TableCell>
                            <TableCell>{transaction.paymentMethod}</TableCell>
                            <TableCell className={`text-right font-medium ${transaction.amount > 0 ? 'text-green-600' : 'text-red-600'}`}>
                              {formatCurrency(transaction.amount)}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </TabsContent>
              
              {/* Repetitive tabs content for other tabs */}
              <TabsContent value="entradas">
                {/* Similar content for entradas */}
              </TabsContent>
              <TabsContent value="saidas">
                {/* Similar content for saidas */}
              </TabsContent>
              <TabsContent value="agendadas">
                {/* Similar content for agendadas */}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default Transacoes;
