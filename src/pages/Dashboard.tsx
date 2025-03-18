
import { useEffect } from "react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import FinancialOverview from "@/components/dashboard/FinancialOverview";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { ArrowUp, ArrowDown, BadgeDollarSign, Clock, BarChart3, LineChart } from "lucide-react";

const Dashboard = () => {
  const { user } = useAuth();
  const userName = user?.user_metadata?.name || "Usuário";

  useEffect(() => {
    document.title = "MoMoney | Dashboard";
  }, []);

  return (
    <DashboardLayout activePage="Dashboard">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Welcome Card */}
        <Card className="lg:col-span-1">
          <CardContent className="pt-6">
            <h2 className="text-2xl font-bold">Olá, {userName}!</h2>
            <p className="text-gray-500 dark:text-gray-400">Bem-vindo de volta</p>
            <Button variant="outline" className="mt-4 w-full flex items-center justify-center gap-2">
              <LineChart size={16} />
              Visão Geral
            </Button>
          </CardContent>
        </Card>

        {/* Financial Overview Banner */}
        <div className="lg:col-span-3">
          <FinancialOverview />
        </div>

        {/* Financial Cards */}
        <Card className="lg:col-span-1 bg-blue-50 dark:bg-blue-950 border-blue-100 dark:border-blue-900">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-blue-700 dark:text-blue-400">Saldo Atual</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <h3 className="text-2xl font-bold text-blue-700 dark:text-blue-400">R$ -67634.49</h3>
              <div className="p-2 bg-blue-100 dark:bg-blue-800 rounded-lg">
                <BadgeDollarSign className="h-6 w-6 text-blue-500 dark:text-blue-400" />
              </div>
            </div>
            <p className="text-sm flex items-center mt-2 text-green-600 dark:text-green-400">
              <ArrowUp className="h-4 w-4 mr-1" /> 100% desde o mês passado
            </p>
          </CardContent>
        </Card>

        <Card className="lg:col-span-1 bg-red-50 dark:bg-red-950 border-red-100 dark:border-red-900">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-red-700 dark:text-red-400">Despesas do Mês</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <h3 className="text-2xl font-bold text-red-700 dark:text-red-400">R$ 1124405.31</h3>
              <div className="p-2 bg-red-100 dark:bg-red-800 rounded-lg">
                <ArrowDown className="h-6 w-6 text-red-500 dark:text-red-400" />
              </div>
            </div>
            <p className="text-sm flex items-center mt-2 text-gray-600 dark:text-gray-400">
              <ArrowDown className="h-4 w-4 mr-1" /> 0% desde o mês passado
            </p>
          </CardContent>
        </Card>

        <Card className="lg:col-span-1 bg-green-50 dark:bg-green-950 border-green-100 dark:border-green-900">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-green-700 dark:text-green-400">Economia</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <h3 className="text-2xl font-bold text-green-700 dark:text-green-400">R$ 56220.27</h3>
              <div className="p-2 bg-green-100 dark:bg-green-800 rounded-lg">
                <BadgeDollarSign className="h-6 w-6 text-green-500 dark:text-green-400" />
              </div>
            </div>
            <p className="text-sm flex items-center mt-2 text-red-600 dark:text-red-400">
              <ArrowDown className="h-4 w-4 mr-1" /> -83.1% do seu saldo atual
            </p>
          </CardContent>
        </Card>

        {/* AI Assistant Card */}
        <Card className="lg:col-span-4 border-l-4 border-l-purple-500 mt-4">
          <CardContent className="pt-6 pb-6">
            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
              <div>
                <h3 className="text-xl font-bold flex items-center">
                  <span className="text-purple-600 mr-2">📊</span> 
                  Novo! FinAI - Seu Consultor Financeiro Inteligente
                </h3>
                <p className="mt-2 text-gray-600 dark:text-gray-400">
                  A FinAI é uma inteligência artificial avançada que funciona como um consultor financeiro digital personalizado.
                  Conheça algumas das principais funcionalidades:
                </p>
                <div className="flex flex-wrap gap-2 mt-3">
                  <Button variant="outline" size="sm" className="rounded-full text-xs">
                    <BarChart3 className="h-3 w-3 mr-1" /> Análise de Gastos
                  </Button>
                  <Button variant="outline" size="sm" className="rounded-full text-xs">
                    <LineChart className="h-3 w-3 mr-1" /> Orçamento Inteligente
                  </Button>
                  <Button variant="outline" size="sm" className="rounded-full text-xs">
                    <ArrowUp className="h-3 w-3 mr-1" /> Sugestões de Investimento
                  </Button>
                  <Button variant="outline" size="sm" className="rounded-full text-xs">
                    <Clock className="h-3 w-3 mr-1" /> Previsão de Riscos
                  </Button>
                </div>
              </div>
              <Button className="bg-purple-600 hover:bg-purple-700 text-white rounded-full px-4">
                Conhecer
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Recent Transactions */}
        <div className="lg:col-span-4 mt-4">
          <h2 className="text-xl font-bold mb-4 flex items-center">
            <Clock className="mr-2 h-5 w-5" /> Transações Recentes
          </h2>
          
          {/* Transaction list would go here */}
        </div>

        {/* Investment Chart */}
        <Card className="lg:col-span-4 mt-4">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Gráfico de Investimentos</CardTitle>
            <div className="flex space-x-2">
              <Button variant="outline" size="sm">Este Mês</Button>
              <Button variant="outline" size="sm">Filtrar</Button>
            </div>
          </CardHeader>
          <CardContent>
            {/* Chart would go here */}
            <div className="h-80 flex items-center justify-center bg-gray-50 dark:bg-gray-800 rounded-lg">
              <p className="text-gray-500 dark:text-gray-400">Gráfico de investimentos</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
