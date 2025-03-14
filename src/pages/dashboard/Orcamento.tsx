
import { useEffect } from "react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PlusCircle, DollarSign, TrendingDown, TrendingUp, Pencil } from "lucide-react";
import { Progress } from "@/components/ui/progress";

const BudgetCategory = ({ 
  name, 
  spent, 
  limit, 
  color = "bg-blue-500" 
}: { 
  name: string; 
  spent: number; 
  limit: number;
  color?: string;
}) => {
  const percentage = Math.min(Math.round((spent / limit) * 100), 100);
  const remaining = limit - spent;
  
  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <div className={`w-3 h-3 rounded-full ${color}`}></div>
          <h4 className="font-medium">{name}</h4>
        </div>
        <Button variant="ghost" size="sm" className="p-0 h-auto">
          <Pencil className="h-4 w-4 text-gray-400" />
        </Button>
      </div>
      <Progress value={percentage} className="h-2" />
      <div className="flex justify-between text-sm text-gray-500">
        <span>R$ {spent.toFixed(2)} de R$ {limit.toFixed(2)}</span>
        <span className={remaining >= 0 ? "text-green-600" : "text-red-600"}>
          {remaining >= 0 
            ? `R$ ${remaining.toFixed(2)} disponível` 
            : `R$ ${Math.abs(remaining).toFixed(2)} acima do limite`}
        </span>
      </div>
    </div>
  );
};

const Orcamento = () => {
  useEffect(() => {
    document.title = "MoMoney | Orçamento";
  }, []);

  // Dados simulados de categorias de orçamento
  const expenses = [
    { name: "Moradia", spent: 1200, limit: 1500, color: "bg-indigo-500" },
    { name: "Alimentação", spent: 850, limit: 800, color: "bg-red-500" },
    { name: "Transporte", spent: 420, limit: 500, color: "bg-yellow-500" },
    { name: "Lazer", spent: 380, limit: 400, color: "bg-green-500" },
    { name: "Saúde", spent: 250, limit: 300, color: "bg-blue-500" },
    { name: "Educação", spent: 280, limit: 300, color: "bg-purple-500" },
  ];

  // Dados simulados de receitas
  const income = [
    { name: "Salário", amount: 3500, color: "bg-green-500" },
    { name: "Freelance", amount: 1200, color: "bg-blue-500" },
    { name: "Investimentos", amount: 450, color: "bg-purple-500" },
  ];

  return (
    <DashboardLayout activePage="Orçamento">
      <div className="grid gap-6">
        <div className="flex flex-col md:flex-row gap-6 md:items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">Orçamento Mensal</h1>
            <p className="text-gray-500">Gerencie suas despesas e receitas de forma eficiente</p>
          </div>
          <div className="flex gap-3">
            <Button>
              <PlusCircle className="h-4 w-4 mr-2" />
              Nova Categoria
            </Button>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          <Card className="md:col-span-2 animate-fade-in">
            <CardHeader className="pb-3">
              <CardTitle className="text-xl">Orçamento de Junho</CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="despesas">
                <TabsList className="mb-6">
                  <TabsTrigger value="despesas">Despesas</TabsTrigger>
                  <TabsTrigger value="receitas">Receitas</TabsTrigger>
                </TabsList>
                <TabsContent value="despesas" className="space-y-6">
                  {expenses.map((category, index) => (
                    <BudgetCategory 
                      key={index}
                      name={category.name}
                      spent={category.spent}
                      limit={category.limit}
                      color={category.color}
                    />
                  ))}
                </TabsContent>
                <TabsContent value="receitas" className="space-y-6">
                  {income.map((item, index) => (
                    <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-full ${item.color} flex items-center justify-center`}>
                          <DollarSign className="h-5 w-5 text-white" />
                        </div>
                        <span className="font-medium">{item.name}</span>
                      </div>
                      <div className="text-right">
                        <div className="font-semibold">R$ {item.amount.toFixed(2)}</div>
                      </div>
                    </div>
                  ))}
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>

          <Card className="animate-fade-in">
            <CardHeader className="pb-3">
              <CardTitle className="text-xl">Resumo</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="bg-green-50 p-4 rounded-lg">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center">
                      <TrendingUp className="h-4 w-4 text-white" />
                    </div>
                    <span className="font-medium">Total de Receitas</span>
                  </div>
                  <div className="text-2xl font-bold text-green-600">
                    R$ {income.reduce((acc, curr) => acc + curr.amount, 0).toFixed(2)}
                  </div>
                </div>

                <div className="bg-red-50 p-4 rounded-lg">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-8 h-8 rounded-full bg-red-500 flex items-center justify-center">
                      <TrendingDown className="h-4 w-4 text-white" />
                    </div>
                    <span className="font-medium">Total de Despesas</span>
                  </div>
                  <div className="text-2xl font-bold text-red-600">
                    R$ {expenses.reduce((acc, curr) => acc + curr.spent, 0).toFixed(2)}
                  </div>
                </div>

                <div className="border-t pt-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-medium">Saldo do Mês</span>
                    <span className="text-xl font-bold text-green-600">
                      R$ {(
                        income.reduce((acc, curr) => acc + curr.amount, 0) - 
                        expenses.reduce((acc, curr) => acc + curr.spent, 0)
                      ).toFixed(2)}
                    </span>
                  </div>
                  <div className="text-sm text-gray-500">
                    Economia de {Math.round((
                      (income.reduce((acc, curr) => acc + curr.amount, 0) - 
                      expenses.reduce((acc, curr) => acc + curr.spent, 0)) /
                      income.reduce((acc, curr) => acc + curr.amount, 0)
                    ) * 100)}% da sua renda
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Orcamento;
