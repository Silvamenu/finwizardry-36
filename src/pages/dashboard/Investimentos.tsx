import { useEffect } from "react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { BarChart, LineChart, PieChart, TrendingUp, TrendingDown, DollarSign, Plus, HelpCircle, ArrowUpRight } from "lucide-react";
import { ResponsiveContainer, PieChart as RechartsPieChart, Pie, Cell, LineChart as RechartsLineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, BarChart as RechartsBarChart, Bar } from "recharts";

const pieChartData = [
  { name: "Ações", value: 35, color: "#4F46E5" },
  { name: "Renda Fixa", value: 30, color: "#0EA5E9" },
  { name: "Fundos Imobiliários", value: 15, color: "#10B981" },
  { name: "Tesouro Direto", value: 10, color: "#F59E0B" },
  { name: "Criptomoedas", value: 5, color: "#EC4899" },
  { name: "Poupança", value: 5, color: "#6B7280" },
];

const performanceData = [
  { month: "Jan", retorno: 2.1 },
  { month: "Fev", retorno: -0.8 },
  { month: "Mar", retorno: 1.3 },
  { month: "Abr", retorno: 3.2 },
  { month: "Mai", retorno: -1.2 },
  { month: "Jun", retorno: 4.5 },
];

const comparativeData = [
  { month: 'Jan', investimentos: 2.1, poupanca: 0.5, cdi: 0.9 },
  { month: 'Fev', investimentos: 1.3, poupanca: 0.5, cdi: 0.8 },
  { month: 'Mar', investimentos: 2.6, poupanca: 0.5, cdi: 0.9 },
  { month: 'Abr', investimentos: 5.8, poupanca: 0.5, cdi: 0.9 },
  { month: 'Mai', investimentos: 4.6, poupanca: 0.5, cdi: 0.8 },
  { month: 'Jun', investimentos: 9.1, poupanca: 0.5, cdi: 0.9 },
];

const investments = [
  {
    name: "PETR4",
    type: "Ações",
    value: 4500,
    quantity: 100,
    price: 45.0,
    change: 2.5,
    positive: true
  },
  {
    name: "Tesouro Selic 2026",
    type: "Tesouro Direto",
    value: 10000,
    quantity: 1,
    price: 10000,
    change: 0.6,
    positive: true
  },
  {
    name: "CDB Banco XYZ 110% CDI",
    type: "Renda Fixa",
    value: 15000,
    quantity: 1,
    price: 15000,
    change: 0.7,
    positive: true
  },
  {
    name: "HGLG11",
    type: "Fundos Imobiliários",
    value: 5500,
    quantity: 50,
    price: 110.0,
    change: -1.2,
    positive: false
  },
  {
    name: "ITSA4",
    type: "Ações",
    value: 3500,
    quantity: 400,
    price: 8.75,
    change: -0.5,
    positive: false
  },
  {
    name: "Bitcoin",
    type: "Criptomoedas",
    value: 2500,
    quantity: 0.05,
    price: 50000,
    change: 5.2,
    positive: true
  }
];

const Investimentos = () => {
  useEffect(() => {
    document.title = "MoMoney | Investimentos";
  }, []);

  const totalInvestment = investments.reduce((total, investment) => total + investment.value, 0);
  
  return (
    <DashboardLayout activePage="Investimentos">
      <div className="grid gap-6">
        <div className="flex flex-col md:flex-row gap-6 md:items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">Seus Investimentos</h1>
            <p className="text-gray-500">Acompanhe e gerencie sua carteira de investimentos</p>
          </div>
          <Button className="animate-fade-in">
            <Plus className="h-4 w-4 mr-2" />
            Novo Investimento
          </Button>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">Total Investido</p>
                  <p className="text-2xl font-bold">R$ {totalInvestment.toLocaleString('pt-BR')}</p>
                </div>
                <div className="p-3 rounded-full bg-momoney-100">
                  <DollarSign className="h-6 w-6 text-momoney-600" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">Rentabilidade (Mês)</p>
                  <p className="text-2xl font-bold text-green-600">+2.5%</p>
                </div>
                <div className="p-3 rounded-full bg-green-100">
                  <TrendingUp className="h-6 w-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">Rentabilidade (Ano)</p>
                  <p className="text-2xl font-bold text-green-600">+9.1%</p>
                </div>
                <div className="p-3 rounded-full bg-green-100">
                  <ArrowUpRight className="h-6 w-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">Vs. CDI (Ano)</p>
                  <p className="text-2xl font-bold text-green-600">120%</p>
                </div>
                <div className="p-3 rounded-full bg-purple-100">
                  <LineChart className="h-6 w-6 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Portfolio Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-1 h-[400px]">
            <CardHeader>
              <CardTitle>Distribuição da Carteira</CardTitle>
              <CardDescription>Por classe de ativos</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <RechartsPieChart>
                  <Pie
                    data={pieChartData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={90}
                    paddingAngle={2}
                    dataKey="value"
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    labelLine={false}
                  >
                    {pieChartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => `${value}%`} />
                </RechartsPieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
          
          <Card className="lg:col-span-2 h-[400px]">
            <CardHeader>
              <CardTitle>Rentabilidade Mensal</CardTitle>
              <CardDescription>Retorno dos últimos 6 meses</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <RechartsBarChart data={performanceData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="month" />
                  <YAxis tickFormatter={(value) => `${value}%`} />
                  <Tooltip formatter={(value) => `${value}%`} />
                  <Bar dataKey="retorno" name="Retorno (%)" fill="#4F46E5" radius={[4, 4, 0, 0]} />
                </RechartsBarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Investments List */}
        <Card className="w-full animate-fade-in">
          <CardHeader>
            <CardTitle>Meus Investimentos</CardTitle>
            <CardDescription>Lista completa dos seus ativos</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="all">
              <TabsList className="mb-6">
                <TabsTrigger value="all">Todos</TabsTrigger>
                <TabsTrigger value="stocks">Ações</TabsTrigger>
                <TabsTrigger value="fixed">Renda Fixa</TabsTrigger>
                <TabsTrigger value="reits">Fundos Imobiliários</TabsTrigger>
                <TabsTrigger value="crypto">Criptomoedas</TabsTrigger>
              </TabsList>
              
              <TabsContent value="all" className="space-y-4">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b text-left">
                        <th className="py-3 px-4 font-medium">Ativo</th>
                        <th className="py-3 px-4 font-medium">Tipo</th>
                        <th className="py-3 px-4 font-medium text-right">Quantidade</th>
                        <th className="py-3 px-4 font-medium text-right">Preço</th>
                        <th className="py-3 px-4 font-medium text-right">Valor Total</th>
                        <th className="py-3 px-4 font-medium text-right">Variação</th>
                      </tr>
                    </thead>
                    <tbody>
                      {investments.map((investment, index) => (
                        <tr key={index} className="border-b hover:bg-gray-50">
                          <td className="py-3 px-4 font-medium">{investment.name}</td>
                          <td className="py-3 px-4">
                            <Badge variant="outline" className="bg-gray-50">
                              {investment.type}
                            </Badge>
                          </td>
                          <td className="py-3 px-4 text-right">{investment.quantity}</td>
                          <td className="py-3 px-4 text-right">
                            R$ {investment.price.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                          </td>
                          <td className="py-3 px-4 text-right font-medium">
                            R$ {investment.value.toLocaleString('pt-BR')}
                          </td>
                          <td className={`py-3 px-4 text-right font-medium ${investment.positive ? 'text-green-600' : 'text-red-600'}`}>
                            {investment.positive ? '+' : ''}{investment.change}%
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </TabsContent>
              
              {/* Other tabs content */}
              <TabsContent value="stocks">
                {/* Stocks content */}
              </TabsContent>
              <TabsContent value="fixed">
                {/* Fixed income content */}
              </TabsContent>
              <TabsContent value="reits">
                {/* REITs content */}
              </TabsContent>
              <TabsContent value="crypto">
                {/* Crypto content */}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {/* Performance Comparison */}
        <Card className="w-full animate-fade-in">
          <CardHeader>
            <CardTitle>Comparativo de Rentabilidade</CardTitle>
            <CardDescription>Sua carteira vs. outros investimentos</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <RechartsLineChart data={comparativeData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis tickFormatter={(value) => `${value}%`} />
                  <Tooltip formatter={(value) => `${value}%`} />
                  <Legend />
                  <Line type="monotone" dataKey="investimentos" name="Seus Investimentos" stroke="#4F46E5" strokeWidth={2} dot={{ strokeWidth: 2 }} />
                  <Line type="monotone" dataKey="cdi" name="CDI" stroke="#10B981" strokeWidth={2} strokeDasharray="5 5" dot={{ strokeWidth: 2 }} />
                  <Line type="monotone" dataKey="poupanca" name="Poupança" stroke="#F59E0B" strokeWidth={2} strokeDasharray="3 3" dot={{ strokeWidth: 2 }} />
                </RechartsLineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default Investimentos;
