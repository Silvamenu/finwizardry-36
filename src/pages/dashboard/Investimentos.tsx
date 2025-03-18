
import { useEffect } from "react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  BarChart, 
  LineChart, 
  PieChart, 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Plus, 
  HelpCircle, 
  ArrowUpRight,
  FileSpreadsheet,
  Download,
  Upload,
  Filter
} from "lucide-react";
import { 
  ResponsiveContainer, 
  PieChart as RechartsPieChart, 
  Pie, 
  Cell, 
  LineChart as RechartsLineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip as RechartsTooltip, 
  Legend, 
  BarChart as RechartsBarChart, 
  Bar,
  Area,
  AreaChart
} from "recharts";
import { useProfile } from "@/hooks/useProfile";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

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

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-4 rounded-xl shadow-lg border border-gray-100">
        <p className="font-medium text-gray-800">{label}</p>
        <div className="mt-2 space-y-1">
          {payload.map((entry: any, index: number) => (
            <div key={index} className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: entry.color }}></div>
              <span className="text-sm text-gray-600">{entry.name}: </span>
              <span className="text-sm font-medium">{entry.value}%</span>
            </div>
          ))}
        </div>
      </div>
    );
  }
  return null;
};

const Investimentos = () => {
  const { profile } = useProfile();
  
  useEffect(() => {
    document.title = "MoMoney | Investimentos";
  }, []);

  const totalInvestment = investments.reduce((total, investment) => total + investment.value, 0);
  const today = new Date();
  const formattedDate = format(today, "d 'de' MMMM 'de' yyyy", { locale: ptBR });
  
  return (
    <DashboardLayout activePage="Investimentos">
      <div className="grid gap-6 animate-fade-in">
        <div className="flex flex-col md:flex-row gap-6 md:items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">Seus Investimentos</h1>
            <p className="text-gray-500">Acompanhe e gerencie sua carteira de investimentos • {formattedDate}</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="gap-2">
                  <FileSpreadsheet className="h-4 w-4" />
                  <span>Exportar</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-40">
                <DropdownMenuItem className="cursor-pointer">
                  <Download className="h-4 w-4 mr-2" />
                  Excel (.xlsx)
                </DropdownMenuItem>
                <DropdownMenuItem className="cursor-pointer">
                  <Download className="h-4 w-4 mr-2" />
                  CSV (.csv)
                </DropdownMenuItem>
                <DropdownMenuItem className="cursor-pointer">
                  <Download className="h-4 w-4 mr-2" />
                  PDF (.pdf)
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            
            <Button className="gap-2 bg-momoney-600 hover:bg-momoney-700 transition-all duration-300 transform hover:scale-105">
              <Plus className="h-4 w-4" />
              <span>Novo Investimento</span>
            </Button>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="overflow-hidden border border-blue-100 rounded-xl transition-transform duration-300 hover:shadow-md hover:-translate-y-1">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">Total Investido</p>
                  <p className="text-2xl font-bold">R$ {totalInvestment.toLocaleString('pt-BR')}</p>
                </div>
                <div className="p-3 rounded-full bg-blue-100/50">
                  <DollarSign className="h-6 w-6 text-blue-600" />
                </div>
              </div>
              <div className="mt-4 pt-4 border-t border-gray-100">
                <div className="text-xs text-gray-500">Última atualização</div>
                <div className="text-sm">Hoje, {format(today, "HH:mm")}</div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="overflow-hidden border border-green-100 rounded-xl transition-transform duration-300 hover:shadow-md hover:-translate-y-1">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">Rentabilidade (Mês)</p>
                  <p className="text-2xl font-bold text-green-600">+2.5%</p>
                </div>
                <div className="p-3 rounded-full bg-green-100/50">
                  <TrendingUp className="h-6 w-6 text-green-600" />
                </div>
              </div>
              <div className="mt-4">
                <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full bg-green-500 rounded-full" style={{width: '65%'}}></div>
                </div>
                <div className="flex justify-between mt-1 text-xs text-gray-500">
                  <span>Meta: 3.8%</span>
                  <span>65% alcançado</span>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="overflow-hidden border border-purple-100 rounded-xl transition-transform duration-300 hover:shadow-md hover:-translate-y-1">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">Rentabilidade (Ano)</p>
                  <p className="text-2xl font-bold text-purple-600">+9.1%</p>
                </div>
                <div className="p-3 rounded-full bg-purple-100/50">
                  <ArrowUpRight className="h-6 w-6 text-purple-600" />
                </div>
              </div>
              <div className="mt-4 flex items-center">
                <div className="flex-1 flex items-center">
                  <span className="text-xs font-medium text-gray-500">Jan</span>
                  <div className="h-1 bg-purple-200 flex-1 mx-1 rounded-full">
                    <div className="h-full bg-purple-500 rounded-full" style={{width: '75%'}}></div>
                  </div>
                  <span className="text-xs font-medium text-gray-500">Dez</span>
                </div>
                <span className="ml-2 text-xs text-gray-500">75%</span>
              </div>
            </CardContent>
          </Card>
          
          <Card className="overflow-hidden border border-teal-100 rounded-xl transition-transform duration-300 hover:shadow-md hover:-translate-y-1">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">Vs. CDI (Ano)</p>
                  <p className="text-2xl font-bold text-teal-600">120%</p>
                </div>
                <div className="p-3 rounded-full bg-teal-100/50">
                  <LineChart className="h-6 w-6 text-teal-600" />
                </div>
              </div>
              <div className="mt-4">
                <div className="h-8 bg-gray-50 rounded-lg overflow-hidden relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="h-2 bg-gray-200 w-full"></div>
                  </div>
                  <div className="absolute inset-0 flex items-center">
                    <div className="h-2 bg-teal-400 rounded-r-full" style={{width: '75%'}}></div>
                  </div>
                  <div className="absolute inset-0 flex items-center justify-end pr-2">
                    <span className="text-xs font-medium bg-white px-1 rounded">CDI</span>
                  </div>
                  <div className="absolute inset-0 flex items-center pl-2" style={{width: '75%'}}>
                    <span className="text-xs font-medium bg-white px-1 rounded text-teal-600">Sua carteira</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Portfolio Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-1 h-[400px] rounded-xl overflow-hidden border-blue-100/50 transition-transform duration-300 hover:shadow-md">
            <CardHeader>
              <CardTitle className="text-xl">Distribuição da Carteira</CardTitle>
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
                    animationBegin={0}
                    animationDuration={1500}
                  >
                    {pieChartData.map((entry, index) => (
                      <Cell 
                        key={`cell-${index}`} 
                        fill={entry.color} 
                        stroke="#fff" 
                        strokeWidth={1}
                      />
                    ))}
                  </Pie>
                  <RechartsTooltip content={<CustomTooltip />} />
                </RechartsPieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
          
          <Card className="lg:col-span-2 h-[400px] rounded-xl overflow-hidden border-blue-100/50 transition-transform duration-300 hover:shadow-md">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-xl">Rentabilidade Mensal</CardTitle>
                <CardDescription>Retorno dos últimos 6 meses</CardDescription>
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="h-8 gap-1">
                    <Filter className="h-3.5 w-3.5" />
                    <span className="text-xs">Filtrar</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem className="cursor-pointer">Últimos 6 meses</DropdownMenuItem>
                  <DropdownMenuItem className="cursor-pointer">2023</DropdownMenuItem>
                  <DropdownMenuItem className="cursor-pointer">2022</DropdownMenuItem>
                  <DropdownMenuItem className="cursor-pointer">2021</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <RechartsBarChart data={performanceData} barGap={0}>
                  <defs>
                    <linearGradient id="colorPositive" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#10B981" stopOpacity={0.8}/>
                      <stop offset="100%" stopColor="#10B981" stopOpacity={0.3}/>
                    </linearGradient>
                    <linearGradient id="colorNegative" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#EF4444" stopOpacity={0.8}/>
                      <stop offset="100%" stopColor="#EF4444" stopOpacity={0.3}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} strokeOpacity={0.2} />
                  <XAxis 
                    dataKey="month" 
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 12 }}
                  />
                  <YAxis 
                    tickFormatter={(value) => `${value}%`} 
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 12 }}
                  />
                  <RechartsTooltip
                    formatter={(value: number) => [`${value}%`, 'Retorno']}
                    labelFormatter={(label) => `Mês: ${label}`}
                    contentStyle={{ 
                      background: 'white', 
                      border: 'none', 
                      borderRadius: '8px', 
                      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' 
                    }}
                  />
                  <Bar 
                    dataKey="retorno" 
                    name="Retorno (%)" 
                    radius={[4, 4, 0, 0]}
                    fill="url(#colorPositive)"
                    shape={(props: any) => {
                      // Check if value is negative
                      const isNegative = props.payload.retorno < 0;
                      return (
                        <rect
                          x={props.x}
                          y={isNegative ? props.y : props.y}
                          width={props.width}
                          height={props.height}
                          rx={4}
                          ry={4}
                          fill={isNegative ? "url(#colorNegative)" : "url(#colorPositive)"}
                        />
                      );
                    }}
                    animationBegin={0}
                    animationDuration={1500}
                  />
                </RechartsBarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Investments List */}
        <Card className="w-full animate-fade-in rounded-xl overflow-hidden border-blue-100/50 transition-all duration-300 hover:shadow-md">
          <CardHeader>
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <CardTitle className="text-xl">Meus Investimentos</CardTitle>
                <CardDescription>Lista completa dos seus ativos</CardDescription>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" className="h-9">
                  <Upload className="h-4 w-4 mr-2" />
                  Importar
                </Button>
                <Button variant="outline" size="sm" className="h-9">
                  <Filter className="h-4 w-4 mr-2" />
                  Filtrar
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="all">
              <TabsList className="mb-6">
                <TabsTrigger value="all" className="rounded-lg">Todos</TabsTrigger>
                <TabsTrigger value="stocks" className="rounded-lg">Ações</TabsTrigger>
                <TabsTrigger value="fixed" className="rounded-lg">Renda Fixa</TabsTrigger>
                <TabsTrigger value="reits" className="rounded-lg">Fundos Imobiliários</TabsTrigger>
                <TabsTrigger value="crypto" className="rounded-lg">Criptomoedas</TabsTrigger>
              </TabsList>
              
              <TabsContent value="all" className="space-y-4">
                <ScrollArea className="h-[420px] overflow-auto rounded-lg">
                  <div className="w-full">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-gray-200 text-left bg-gray-50">
                          <th className="py-3 px-4 font-medium text-gray-500 rounded-tl-lg">Ativo</th>
                          <th className="py-3 px-4 font-medium text-gray-500">Tipo</th>
                          <th className="py-3 px-4 font-medium text-gray-500 text-right">Quantidade</th>
                          <th className="py-3 px-4 font-medium text-gray-500 text-right">Preço</th>
                          <th className="py-3 px-4 font-medium text-gray-500 text-right">Valor Total</th>
                          <th className="py-3 px-4 font-medium text-gray-500 text-right rounded-tr-lg">Variação</th>
                        </tr>
                      </thead>
                      <tbody>
                        {investments.map((investment, index) => (
                          <tr 
                            key={index} 
                            className={cn(
                              "border-b border-gray-100 hover:bg-gray-50 transition-colors",
                              index === investments.length - 1 ? "border-b-0" : ""
                            )}
                          >
                            <td className="py-3 px-4 font-medium">{investment.name}</td>
                            <td className="py-3 px-4">
                              <Badge variant="outline" className={cn(
                                "bg-gray-50",
                                investment.type === "Ações" && "border-blue-200 text-blue-700 bg-blue-50",
                                investment.type === "Renda Fixa" && "border-green-200 text-green-700 bg-green-50",
                                investment.type === "Fundos Imobiliários" && "border-purple-200 text-purple-700 bg-purple-50",
                                investment.type === "Tesouro Direto" && "border-amber-200 text-amber-700 bg-amber-50",
                                investment.type === "Criptomoedas" && "border-pink-200 text-pink-700 bg-pink-50",
                                investment.type === "Poupança" && "border-gray-200 text-gray-700 bg-gray-50"
                              )}>
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
                              <div className="flex items-center justify-end gap-1">
                                {investment.positive ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
                                {investment.positive ? '+' : ''}{investment.change}%
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </ScrollArea>
              </TabsContent>
              
              {/* Other tabs content */}
              <TabsContent value="stocks">
                <div className="h-[420px] flex items-center justify-center">
                  <div className="text-center">
                    <div className="inline-flex items-center justify-center p-4 rounded-full bg-blue-100 mb-4">
                      <LineChart className="h-8 w-8 text-blue-600" />
                    </div>
                    <h3 className="text-lg font-medium mb-2">Ações</h3>
                    <p className="text-gray-500 max-w-md">Visualize todas as suas ações, desempenho e histórico de transações.</p>
                  </div>
                </div>
              </TabsContent>
              <TabsContent value="fixed">
                <div className="h-[420px] flex items-center justify-center">
                  <div className="text-center">
                    <div className="inline-flex items-center justify-center p-4 rounded-full bg-green-100 mb-4">
                      <DollarSign className="h-8 w-8 text-green-600" />
                    </div>
                    <h3 className="text-lg font-medium mb-2">Renda Fixa</h3>
                    <p className="text-gray-500 max-w-md">Acompanhe seus investimentos em renda fixa, rendimentos e vencimentos.</p>
                  </div>
                </div>
              </TabsContent>
              <TabsContent value="reits">
                <div className="h-[420px] flex items-center justify-center">
                  <div className="text-center">
                    <div className="inline-flex items-center justify-center p-4 rounded-full bg-purple-100 mb-4">
                      <BarChart className="h-8 w-8 text-purple-600" />
                    </div>
                    <h3 className="text-lg font-medium mb-2">Fundos Imobiliários</h3>
                    <p className="text-gray-500 max-w-md">Veja seus fundos imobiliários, dividendos e evolução patrimonial.</p>
                  </div>
                </div>
              </TabsContent>
              <TabsContent value="crypto">
                <div className="h-[420px] flex items-center justify-center">
                  <div className="text-center">
                    <div className="inline-flex items-center justify-center p-4 rounded-full bg-pink-100 mb-4">
                      <TrendingUp className="h-8 w-8 text-pink-600" />
                    </div>
                    <h3 className="text-lg font-medium mb-2">Criptomoedas</h3>
                    <p className="text-gray-500 max-w-md">Monitore suas criptomoedas, performance e variações de preço.</p>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {/* Performance Comparison */}
        <Card className="w-full animate-fade-in rounded-xl overflow-hidden border-blue-100/50 transition-all duration-300 hover:shadow-md">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-xl">Comparativo de Rentabilidade</CardTitle>
              <CardDescription>Sua carteira vs. outros investimentos</CardDescription>
            </div>
            <Button variant="outline" size="sm" className="h-9 gap-2">
              <HelpCircle className="h-4 w-4" />
              <span>Ajuda</span>
            </Button>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={comparativeData}>
                  <defs>
                    <linearGradient id="colorInvestimentos" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#4F46E5" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#4F46E5" stopOpacity={0.1}/>
                    </linearGradient>
                    <linearGradient id="colorCdi" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10B981" stopOpacity={0.2}/>
                      <stop offset="95%" stopColor="#10B981" stopOpacity={0.05}/>
                    </linearGradient>
                    <linearGradient id="colorPoupanca" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#F59E0B" stopOpacity={0.2}/>
                      <stop offset="95%" stopColor="#F59E0B" stopOpacity={0.05}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} strokeOpacity={0.2} />
                  <XAxis 
                    dataKey="month" 
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis 
                    tickFormatter={(value) => `${value}%`} 
                    axisLine={false}
                    tickLine={false}
                  />
                  <RechartsTooltip
                    formatter={(value: number) => [`${value}%`, '']}
                    contentStyle={{ 
                      background: 'white', 
                      border: 'none', 
                      borderRadius: '8px', 
                      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' 
                    }}
                  />
                  <Legend 
                    iconType="circle" 
                    wrapperStyle={{ paddingTop: '15px' }}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="investimentos" 
                    name="Seus Investimentos" 
                    stroke="#4F46E5" 
                    strokeWidth={2} 
                    fillOpacity={1}
                    fill="url(#colorInvestimentos)"
                    activeDot={{ r: 6, strokeWidth: 0 }}
                    animationBegin={0}
                    animationDuration={1500}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="cdi" 
                    name="CDI" 
                    stroke="#10B981" 
                    strokeWidth={2} 
                    strokeDasharray="5 5" 
                    fillOpacity={1}
                    fill="url(#colorCdi)"
                    animationBegin={300}
                    animationDuration={1500}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="poupanca" 
                    name="Poupança" 
                    stroke="#F59E0B" 
                    strokeWidth={2} 
                    strokeDasharray="3 3" 
                    fillOpacity={1}
                    fill="url(#colorPoupanca)"
                    animationBegin={600}
                    animationDuration={1500}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default Investimentos;
