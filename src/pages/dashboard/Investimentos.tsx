
import { useEffect, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, ArrowUpRight, ArrowDownRight } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import NewInvestmentModal from "@/components/investments/NewInvestmentModal";
import { toast } from "sonner";
import { useFormatters } from "@/hooks/useFormatters";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { LoadingScreen } from "@/components/ui/loading-screen";

// Tipo baseado no schema real da tabela investments
type Investment = {
  id: string;
  user_id: string;
  name: string;
  type: string;
  ticker: string | null;
  quantity: number | null;
  average_price: number;
  purchase_date: string;
  notes: string | null;
  created_at: string;
  updated_at: string;
};

const Investimentos = () => {
  const [isNewInvestmentModalOpen, setIsNewInvestmentModalOpen] = useState(false);
  const { formatCurrency, formatPercentage } = useFormatters();
  const { user } = useAuth();
  const queryClient = useQueryClient();
  
  useEffect(() => {
    document.title = "MoMoney | Investimentos";
  }, []);

  // Buscar investimentos do usuário
  const { data: investments, isLoading, error } = useQuery({
    queryKey: ['investments'],
    queryFn: async () => {
      if (!user?.id) throw new Error("Usuário não autenticado");
      
      const { data, error } = await supabase
        .from('investments')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      // Fazemos cast explícito porque o schema real tem average_price e ticker
      return (data || []) as unknown as Investment[];
    },
    enabled: !!user?.id,
  });

  // Mutation para adicionar novo investimento
  const addInvestmentMutation = useMutation({
    mutationFn: async (newInvestment: {
      name: string;
      type: string;
      ticker?: string | null;
      quantity?: number | null;
      average_price: number;
      purchase_date: string;
      notes?: string | null;
    }) => {
      if (!user?.id) throw new Error("Usuário não autenticado");
      
      // Fazemos cast do objeto para any para contornar o problema de tipos gerados
      const { data, error } = await supabase
        .from('investments')
        .insert([{
          name: newInvestment.name,
          type: newInvestment.type,
          ticker: newInvestment.ticker || null,
          quantity: newInvestment.quantity || null,
          average_price: newInvestment.average_price,
          purchase_date: newInvestment.purchase_date,
          notes: newInvestment.notes || null,
          user_id: user.id,
        } as any])
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      toast.success("Investimento adicionado com sucesso!");
      queryClient.invalidateQueries({ queryKey: ['investments'] });
      setIsNewInvestmentModalOpen(false);
    },
    onError: (error: Error) => {
      toast.error(`Erro ao adicionar investimento: ${error.message}`);
    },
  });

  const handleAddInvestment = (investment: any) => {
    addInvestmentMutation.mutate(investment);
  };

  // Calcular totais
  const totalInvested = (investments || []).reduce(
    (sum, inv) => sum + ((inv.quantity || 0) * inv.average_price), 0
  );
  
  // Para valor atual, usamos o preço médio como aproximação (em produção, você buscaria cotações reais)
  const currentValue = (investments || []).reduce(
    (sum, inv) => sum + ((inv.quantity || 0) * inv.average_price), 0
  );
  
  const totalVariation = totalInvested > 0 ? ((currentValue - totalInvested) / totalInvested) * 100 : 0;
  
  if (isLoading) {
    return <LoadingScreen message="Carregando investimentos..." />;
  }

  if (error) {
    toast.error("Erro ao carregar investimentos");
  }

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
                  {!investments || investments.length === 0 ? (
                    <div className="text-center text-gray-500 py-10">
                      Nenhum investimento cadastrado. Clique em "Novo Investimento" para começar!
                    </div>
                  ) : (
                    <table className="w-full border-collapse">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left py-3 px-4">Nome</th>
                          <th className="text-left py-3 px-4">Ticker</th>
                          <th className="text-left py-3 px-4">Tipo</th>
                          <th className="text-right py-3 px-4">Quantidade</th>
                          <th className="text-right py-3 px-4">Preço Médio</th>
                          <th className="text-right py-3 px-4">Total Investido</th>
                        </tr>
                      </thead>
                      <tbody>
                        {investments.map((inv) => (
                          <tr key={inv.id} className="border-b hover:bg-gray-50 dark:hover:bg-gray-800">
                            <td className="py-3 px-4 font-medium">{inv.name}</td>
                            <td className="py-3 px-4">{inv.ticker || '-'}</td>
                            <td className="py-3 px-4 capitalize">{inv.type}</td>
                            <td className="py-3 px-4 text-right">{inv.quantity || '-'}</td>
                            <td className="py-3 px-4 text-right">{formatCurrency(inv.average_price)}</td>
                            <td className="py-3 px-4 text-right font-medium">
                              {formatCurrency((inv.quantity || 0) * inv.average_price)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}
                </div>
              </TabsContent>
              
              {/* Conteúdo filtrado por tipo */}
              <TabsContent value="stocks">
                <div className="overflow-x-auto">
                  {!investments || investments.filter(inv => inv.type === 'stocks').length === 0 ? (
                    <div className="text-center text-gray-500 py-10">
                      Nenhuma ação cadastrada
                    </div>
                  ) : (
                    <table className="w-full border-collapse">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left py-3 px-4">Nome</th>
                          <th className="text-left py-3 px-4">Ticker</th>
                          <th className="text-right py-3 px-4">Quantidade</th>
                          <th className="text-right py-3 px-4">Preço Médio</th>
                          <th className="text-right py-3 px-4">Total Investido</th>
                        </tr>
                      </thead>
                      <tbody>
                        {investments.filter(inv => inv.type === 'stocks').map((inv) => (
                          <tr key={inv.id} className="border-b hover:bg-gray-50 dark:hover:bg-gray-800">
                            <td className="py-3 px-4 font-medium">{inv.name}</td>
                            <td className="py-3 px-4">{inv.ticker || '-'}</td>
                            <td className="py-3 px-4 text-right">{inv.quantity || '-'}</td>
                            <td className="py-3 px-4 text-right">{formatCurrency(inv.average_price)}</td>
                            <td className="py-3 px-4 text-right font-medium">
                              {formatCurrency((inv.quantity || 0) * inv.average_price)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}
                </div>
              </TabsContent>
              
              <TabsContent value="fixed_income">
                <div className="overflow-x-auto">
                  {!investments || investments.filter(inv => inv.type === 'fixed_income').length === 0 ? (
                    <div className="text-center text-gray-500 py-10">
                      Nenhum investimento de renda fixa cadastrado
                    </div>
                  ) : (
                    <table className="w-full border-collapse">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left py-3 px-4">Nome</th>
                          <th className="text-left py-3 px-4">Tipo</th>
                          <th className="text-right py-3 px-4">Quantidade</th>
                          <th className="text-right py-3 px-4">Preço Médio</th>
                          <th className="text-right py-3 px-4">Total Investido</th>
                        </tr>
                      </thead>
                      <tbody>
                        {investments.filter(inv => inv.type === 'fixed_income').map((inv) => (
                          <tr key={inv.id} className="border-b hover:bg-gray-50 dark:hover:bg-gray-800">
                            <td className="py-3 px-4 font-medium">{inv.name}</td>
                            <td className="py-3 px-4 capitalize">{inv.type}</td>
                            <td className="py-3 px-4 text-right">{inv.quantity || '-'}</td>
                            <td className="py-3 px-4 text-right">{formatCurrency(inv.average_price)}</td>
                            <td className="py-3 px-4 text-right font-medium">
                              {formatCurrency((inv.quantity || 0) * inv.average_price)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}
                </div>
              </TabsContent>
              
              <TabsContent value="crypto">
                <div className="overflow-x-auto">
                  {!investments || investments.filter(inv => inv.type === 'crypto').length === 0 ? (
                    <div className="text-center text-gray-500 py-10">
                      Nenhuma criptomoeda cadastrada
                    </div>
                  ) : (
                    <table className="w-full border-collapse">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left py-3 px-4">Nome</th>
                          <th className="text-left py-3 px-4">Ticker</th>
                          <th className="text-right py-3 px-4">Quantidade</th>
                          <th className="text-right py-3 px-4">Preço Médio</th>
                          <th className="text-right py-3 px-4">Total Investido</th>
                        </tr>
                      </thead>
                      <tbody>
                        {investments.filter(inv => inv.type === 'crypto').map((inv) => (
                          <tr key={inv.id} className="border-b hover:bg-gray-50 dark:hover:bg-gray-800">
                            <td className="py-3 px-4 font-medium">{inv.name}</td>
                            <td className="py-3 px-4">{inv.ticker || '-'}</td>
                            <td className="py-3 px-4 text-right">{inv.quantity || '-'}</td>
                            <td className="py-3 px-4 text-right">{formatCurrency(inv.average_price)}</td>
                            <td className="py-3 px-4 text-right font-medium">
                              {formatCurrency((inv.quantity || 0) * inv.average_price)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}
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
