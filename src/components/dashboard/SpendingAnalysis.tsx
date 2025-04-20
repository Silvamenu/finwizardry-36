import { useState } from "react";
import { 
  Card, 
  CardHeader, 
  CardTitle, 
  CardContent 
} from "@/components/ui/card";
import { ChartContainer } from "@/components/ui/chart";
import { PieChart, Pie, ResponsiveContainer, Cell, Tooltip } from "recharts";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowUpRight, Download, Filter, FileBarChart, Calendar } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

// Simulated category spending data
const generateCategoryData = () => {
  const categories = [{
    name: 'Moradia',
    value: 2500,
    color: '#0ea5e9'
  }, {
    name: 'Alimentação',
    value: 1200,
    color: '#22c55e'
  }, {
    name: 'Transporte',
    value: 800,
    color: '#f59e0b'
  }, {
    name: 'Lazer',
    value: 600,
    color: '#8b5cf6'
  }, {
    name: 'Saúde',
    value: 450,
    color: '#ef4444'
  }, {
    name: 'Outros',
    value: 350,
    color: '#6b7280'
  }];
  return categories.map(cat => ({
    ...cat,
    value: Math.round(cat.value + (Math.random() - 0.5) * 200) // Add some randomness
  }));
};

// Simulated merchant spending data
const generateMerchantData = () => {
  const merchants = [{
    name: 'Supermercado',
    value: 850,
    color: '#0ea5e9'
  }, {
    name: 'Aluguel',
    value: 1500,
    color: '#22c55e'
  }, {
    name: 'Restaurantes',
    value: 450,
    color: '#f59e0b'
  }, {
    name: 'Streaming',
    value: 120,
    color: '#8b5cf6'
  }, {
    name: 'Farmácia',
    value: 180,
    color: '#ef4444'
  }, {
    name: 'Outros',
    value: 720,
    color: '#6b7280'
  }];
  return merchants.map(merchant => ({
    ...merchant,
    value: Math.round(merchant.value + (Math.random() - 0.5) * 100) // Add some randomness
  }));
};

// Custom tooltip component for PieChart
const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="chart-tooltip bg-white dark:bg-gray-800 p-3 rounded-lg shadow-md border border-gray-100 dark:border-gray-700">
        <div className="flex items-center gap-2 mb-1">
          <div className="w-3 h-3 rounded-full" style={{ backgroundColor: payload[0].payload.color }}></div>
          <span className="font-medium">{payload[0].payload.name}</span>
        </div>
        <div className="flex flex-col">
          <span className="font-bold">{formatCurrency(payload[0].value)}</span>
          <span className="text-xs text-gray-500 dark:text-gray-400">{payload[0].payload.percentage}% do total</span>
        </div>
      </div>
    );
  }
  return null;
};

// Helper function to format currency
const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(value);
};

const SpendingAnalysis = () => {
  const [tabView, setTabView] = useState<'categories' | 'merchants'>('categories');
  const data = tabView === 'categories' ? generateCategoryData() : generateMerchantData();

  // Calculate total
  const total = data.reduce((sum, item) => sum + item.value, 0);
  
  // Add percentage to each item
  const dataWithPercentage = data.map(item => ({
    ...item,
    percentage: parseFloat(((item.value / total) * 100).toFixed(1))
  }));

  // Create chart config for the categories
  const chartConfig = dataWithPercentage.reduce((config, item) => {
    config[item.name] = {
      label: item.name,
      color: item.color
    };
    return config;
  }, {} as Record<string, {
    label: string;
    color: string;
  }>);

  return (
    <Card className="h-full animate-fade-in reveal-delay-1">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-lg font-medium flex items-center gap-2 truncate">
          <FileBarChart className="h-5 w-5 text-blue-500 flex-shrink-0" />
          Análise de Gastos
        </CardTitle>
        <div className="flex items-center gap-2">
          <Tabs defaultValue="categories" className="w-[300px]" onValueChange={(value) => setTabView(value as 'categories' | 'merchants')}>
            <TabsList className="grid w-full grid-cols-2 rounded-lg dark:bg-gray-700">
              <TabsTrigger 
                value="categories" 
                className="rounded-l-lg data-[state=active]:bg-blue-500 dark:data-[state=active]:bg-blue-600 dark:text-gray-300 dark:data-[state=active]:text-white"
              >
                Categorias
              </TabsTrigger>
              <TabsTrigger 
                value="merchants" 
                className="rounded-r-lg data-[state=active]:bg-blue-500 dark:data-[state=active]:bg-blue-600 dark:text-gray-300 dark:data-[state=active]:text-white"
              >
                Estabelecimentos
              </TabsTrigger>
            </TabsList>
            <TabsContent value="categories"></TabsContent>
            <TabsContent value="merchants"></TabsContent>
          </Tabs>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon" className="h-8 w-8 dark:bg-gray-700 dark:border-gray-600">
                <Calendar className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="dark:bg-gray-800 dark:border-gray-700">
              <DropdownMenuItem className="dark:text-gray-300 dark:focus:bg-gray-700">Mês atual</DropdownMenuItem>
              <DropdownMenuItem className="dark:text-gray-300 dark:focus:bg-gray-700">Mês anterior</DropdownMenuItem>
              <DropdownMenuItem className="dark:text-gray-300 dark:focus:bg-gray-700">Últimos 3 meses</DropdownMenuItem>
              <DropdownMenuItem className="dark:text-gray-300 dark:focus:bg-gray-700">Este ano</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="w-full md:w-1/2 h-[300px] flex items-center justify-center">
            <ChartContainer config={chartConfig} className="w-full max-w-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <defs>
                    {dataWithPercentage.map((entry, index) => (
                      <filter key={`shadow-${index}`} id={`shadow-${index}`} x="-20%" y="-20%" width="140%" height="140%">
                        <feDropShadow dx="0" dy="0" stdDeviation="3" floodColor={entry.color} floodOpacity="0.3" />
                      </filter>
                    ))}
                  </defs>
                  <Pie 
                    data={dataWithPercentage} 
                    cx="50%" 
                    cy="50%" 
                    labelLine={false} 
                    outerRadius={100} 
                    innerRadius={60} 
                    fill="#8884d8" 
                    dataKey="value" 
                    nameKey="name" 
                    paddingAngle={2}
                    label={({
                      name,
                      percent
                    }) => `${(percent * 100).toFixed(0)}%`}
                  >
                    {dataWithPercentage.map((entry, index) => (
                      <Cell 
                        key={`cell-${index}`} 
                        fill={entry.color} 
                        stroke="#fff" 
                        strokeWidth={2}
                        filter={`url(#shadow-${index})`}
                        className="transition-all duration-300 hover:opacity-80"
                      />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                </PieChart>
              </ResponsiveContainer>
            </ChartContainer>
          </div>
          
          <div className="w-full md:w-1/2">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium truncate">Detalhes</h3>
              <Button variant="outline" size="sm" className="h-8 gap-1 rounded-lg">
                <Filter className="h-3.5 w-3.5" />
                <span className="text-xs">Filtrar</span>
              </Button>
            </div>
            <div className="space-y-3 overflow-hidden">
              {dataWithPercentage.map((item, index) => (
                <div key={index} className="flex items-center justify-between p-2 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors">
                  <div className="flex items-center min-w-0">
                    <div 
                      className="w-3 h-3 rounded-full mr-2 flex-shrink-0" 
                      style={{ backgroundColor: item.color }} 
                    />
                    <span className="truncate">{item.name}</span>
                  </div>
                  <div className="flex flex-col items-end flex-shrink-0">
                    <span className="font-medium whitespace-nowrap">{formatCurrency(item.value)}</span>
                    <div className="flex items-center text-xs text-gray-500">
                      <span>{item.percentage}%</span>
                      <ArrowUpRight className="h-3 w-3 ml-0.5 text-green-500" />
                    </div>
                  </div>
                </div>
              ))}
              <div className="pt-3 mt-3 border-t border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between font-bold">
                  <span>Total</span>
                  <span>{formatCurrency(total)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default SpendingAnalysis;
