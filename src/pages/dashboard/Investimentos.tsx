
import { useEffect, useState } from "react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, ArrowUpRight, ArrowDownRight } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import NewInvestmentModal from "@/components/investments/NewInvestmentModal";
import { toast } from "sonner";
import { useFormatters } from "@/hooks/useFormatters";

const mockInvestments = [
  {
    id: 'inv-1',
    name: 'PETR4',
    type: 'stocks',
    amount: 100,
    purchasePrice: 25.50,
    currentPrice: 28.75,
    variation: 12.75,
    totalValue: 2875
  },
  {
    id: 'inv-2',
    name: 'Tesouro Selic 2026',
    type: 'treasury',
    amount: 1,
    purchasePrice: 10000,
    currentPrice: 10320,
    variation: 3.2,
    totalValue: 10320
  },
  {
    id: 'inv-3',
    name: 'Bitcoin',
    type: 'crypto',
    amount: 0.05,
    purchasePrice: 45000,
    currentPrice: 42000,
    variation: -6.67,
    totalValue: 2100
  }
];

const Investimentos = () => {
  const [isNewInvestmentModalOpen, setIsNewInvestmentModalOpen] = useState(false);
  const { formatCurrency, formatPercentage } = useFormatters();
  
  useEffect(() => {
    document.title = "MoMoney | Investimentos";
  }, []);

  const handleAddInvestment = (investment: any) => {
    console.log("Novo investimento adicionado:", investment);
    // Em uma aplicação real, isso enviaria os dados para o backend
    toast.success("Investimento adicionado com sucesso!");
  };

  // Calcular totais
  const totalInvested = mockInvestments.reduce(
    (sum, inv) => sum + (inv.amount * inv.purchasePrice), 0
  );
  
  const currentValue = mockInvestments.reduce(
    (sum, inv) => sum + (inv.amount * inv.currentPrice), 0
  );
  
  const totalVariation = ((currentValue - totalInvested) / totalInvested) * 100;
  
  return (
    <DashboardLayout activePage="Investimentos">
      {/* Modal para adicionar novo investimento */}
      <NewInvestmentModal 
        open={isNewInvestmentModalOpen}
        onOpenChange={setIsNewInvestmentModalOpen}
        onAddInvestment={handleAddInvestment}
      />
      
      <div className="grid gap-6">
        <div className="flex flex-col md:flex-row gap-6 md:items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">Investimentos</h1>
            <p className="text-gray-500">Acompanhe o desempenho da sua carteira</p>
          </div>
          <div className="flex gap-3">
            <Button onClick={() => setIsNewInvestmentModalOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Novo Investimento
            </Button>
          </div>
        </div>

        {/* Resumo dos investimentos */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 border-blue-100 dark:border-blue-900/30">
            <CardContent className="pt-6">
              <div className="text-sm font-medium text-blue-700 dark:text-blue-400">
                Total Investido
              </div>
              <div className="text-2xl font-bold text-blue-700 dark:text-blue-400 mt-2">
                {formatCurrency(totalInvested)}
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 border-green-100 dark:border-green-900/30">
            <CardContent className="pt-6">
              <div className="text-sm font-medium text-green-700 dark:text-green-400">
                Valor Atual
              </div>
              <div className="text-2xl font-bold text-green-700 dark:text-green-400 mt-2">
                {formatCurrency(currentValue)}
              </div>
            </CardContent>
          </Card>
          
          <Card className={`bg-gradient-to-br ${totalVariation >= 0 
            ? "from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 border-green-100 dark:border-green-900/30" 
            : "from-red-50 to-red-100 dark:from-red-900/20 dark:to-red-800/20 border-red-100 dark:border-red-900/30"}`}>
            <CardContent className="pt-6">
              <div className={`text-sm font-medium ${totalVariation >= 0 
                ? "text-green-700 dark:text-green-400"
                : "text-red-700 dark:text-red-400"}`}>
                Retorno Total
              </div>
              <div className={`text-2xl font-bold flex items-center mt-2 ${totalVariation >= 0 
                ? "text-green-700 dark:text-green-400"
                : "text-red-700 dark:text-red-400"}`}>
                {totalVariation >= 0 ? (
                  <ArrowUpRight className="h-5 w-5 mr-1" />
                ) : (
                  <ArrowDownRight className="h-5 w-5 mr-1" />
                )}
                {formatPercentage(Math.abs(totalVariation))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Lista de investimentos */}
        <Card>
          <CardHeader>
            <CardTitle>Meus Investimentos</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="all">
              <TabsList className="mb-4">
                <TabsTrigger value="all">Todos</TabsTrigger>
                <TabsTrigger value="stocks">Ações</TabsTrigger>
                <TabsTrigger value="fixed_income">Renda Fixa</TabsTrigger>
                <TabsTrigger value="crypto">Criptomoedas</TabsTrigger>
              </TabsList>
              
              <TabsContent value="all">
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-3 px-4">Nome</th>
                        <th className="text-left py-3 px-4">Tipo</th>
                        <th className="text-right py-3 px-4">Quantidade</th>
                        <th className="text-right py-3 px-4">Preço Médio</th>
                        <th className="text-right py-3 px-4">Preço Atual</th>
                        <th className="text-right py-3 px-4">Variação</th>
                        <th className="text-right py-3 px-4">Total</th>
                      </tr>
                    </thead>
                    <tbody>
                      {mockInvestments.map((inv) => (
                        <tr key={inv.id} className="border-b hover:bg-gray-50">
                          <td className="py-3 px-4 font-medium">{inv.name}</td>
                          <td className="py-3 px-4">{inv.type}</td>
                          <td className="py-3 px-4 text-right">{inv.amount}</td>
                          <td className="py-3 px-4 text-right">{formatCurrency(inv.purchasePrice)}</td>
                          <td className="py-3 px-4 text-right">{formatCurrency(inv.currentPrice)}</td>
                          <td className={`py-3 px-4 text-right ${inv.variation >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                            <span className="flex items-center justify-end">
                              {inv.variation >= 0 ? (
                                <ArrowUpRight className="h-4 w-4 mr-1" />
                              ) : (
                                <ArrowDownRight className="h-4 w-4 mr-1" />
                              )}
                              {formatPercentage(Math.abs(inv.variation))}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-right font-medium">{formatCurrency(inv.totalValue)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </TabsContent>
              
              {/* Conteúdo das outras abas seria filtrado por tipo */}
              <TabsContent value="stocks">
                {/* Conteúdo filtrado para ações */}
                <div className="text-center text-gray-500 py-10">
                  Filtro por ações
                </div>
              </TabsContent>
              
              <TabsContent value="fixed_income">
                {/* Conteúdo filtrado para renda fixa */}
                <div className="text-center text-gray-500 py-10">
                  Filtro por renda fixa
                </div>
              </TabsContent>
              
              <TabsContent value="crypto">
                {/* Conteúdo filtrado para criptomoedas */}
                <div className="text-center text-gray-500 py-10">
                  Filtro por criptomoedas
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default Investimentos;
