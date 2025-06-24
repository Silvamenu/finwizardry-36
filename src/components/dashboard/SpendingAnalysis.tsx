
import { useState } from "react";
import { 
  Card, 
  CardHeader, 
  CardTitle, 
  CardContent 
} from "@/components/ui/card";
import { ChartContainer } from "@/components/ui/chart";
import { PieChart, Pie, ResponsiveContainer, Cell, Tooltip, Legend } from "recharts";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowUpRight, Download, Filter, FileBarChart, Calendar } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { useFinancialData } from "@/hooks/useFinancialData";
import { useFormatters } from "@/hooks/useFormatters";
import { Skeleton } from "@/components/ui/skeleton";

const CustomTooltip = ({ active, payload }: any) => {
  const { formatCurrency } = useFormatters();
  
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

const CustomLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }: any) => {
  const RADIAN = Math.PI / 180;
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  return percent > 0.05 ? (
    <text 
      x={x} 
      y={y} 
      fill="white" 
      textAnchor={x > cx ? 'start' : 'end'} 
      dominantBaseline="central"
      fontSize={12}
      fontWeight="bold"
    >
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  ) : null;
};

const SpendingAnalysis = () => {
  const [tabView, setTabView] = useState<'categories' | 'merchants'>('categories');
  const { summary, loading } = useFinancialData();
  const { formatCurrency } = useFormatters();
  
  // Default data for merchants since we don't have that in our database yet
  const defaultMerchantData = [
    { name: 'Supermercado', value: 850, color: '#0ea5e9' },
    { name: 'Aluguel', value: 1500, color: '#22c55e' },
    { name: 'Restaurantes', value: 450, color: '#f59e0b' },
    { name: 'Streaming', value: 120, color: '#8b5cf6' },
    { name: 'Farmácia', value: 180, color: '#ef4444' },
    { name: 'Outros', value: 720, color: '#6b7280' }
  ];

  // Use real spending data or default merchants data
  const rawData = tabView === 'categories' ? summary.spendingByCategory : defaultMerchantData;
  
  // Fallback to sample data if we have no transactions
  const data = rawData.length > 0 ? rawData : defaultMerchantData;
  
  const total = data.reduce((sum, item) => sum + item.value, 0);
  
  const dataWithPercentage = data.map(item => ({
    ...item,
    percentage: parseFloat(((item.value / total) * 100).toFixed(1))
  }));

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
          Spending Analysis
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
        {loading ? (
          <div className="flex items-center justify-center h-[300px]">
            <Skeleton className="h-[200px] w-[200px] rounded-full" />
          </div>
        ) : (
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="w-full md:w-1/2 h-[300px] flex items-center justify-center">
              <ChartContainer config={chartConfig} className="w-full h-full">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <defs>
                      {dataWithPercentage.map((entry, index) => (
                        <linearGradient key={`gradient-${index}`} id={`gradient-${index}`} x1="0%" y1="0%" x2="100%" y2="100%">
                          <stop offset="0%" stopColor={entry.color} stopOpacity={0.8} />
                          <stop offset="100%" stopColor={entry.color} stopOpacity={1} />
                        </linearGradient>
                      ))}
                    </defs>
                    <Pie 
                      data={dataWithPercentage} 
                      cx="50%" 
                      cy="50%" 
                      labelLine={false} 
                      outerRadius={80} 
                      innerRadius={40} 
                      fill="#8884d8" 
                      dataKey="value" 
                      nameKey="name" 
                      paddingAngle={2}
                      label={CustomLabel}
                    >
                      {dataWithPercentage.map((entry, index) => (
                        <Cell 
                          key={`cell-${index}`} 
                          fill={`url(#gradient-${index})`}
                          stroke="#fff" 
                          strokeWidth={2}
                          className="transition-all duration-300 hover:opacity-80 cursor-pointer"
                        />
                      ))}
                    </Pie>
                    <Tooltip content={<CustomTooltip />} />
                    <Legend 
                      verticalAlign="bottom" 
                      height={36}
                      formatter={(value) => <span className="text-sm">{value}</span>}
                    />
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
                  <div key={index} className="flex items-center justify-between p-3 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors border border-gray-100 dark:border-gray-600">
                    <div className="flex items-center min-w-0">
                      <div 
                        className="w-4 h-4 rounded-full mr-3 flex-shrink-0 border-2 border-white shadow-sm" 
                        style={{ backgroundColor: item.color }} 
                      />
                      <span className="truncate font-medium">{item.name}</span>
                    </div>
                    <div className="flex flex-col items-end flex-shrink-0">
                      <span className="font-bold whitespace-nowrap text-lg">{formatCurrency(item.value)}</span>
                      <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                        <span>{item.percentage}%</span>
                        <ArrowUpRight className="h-3 w-3 ml-1 text-green-500" />
                      </div>
                    </div>
                  </div>
                ))}
                <div className="pt-4 mt-4 border-t border-gray-200 dark:border-gray-700">
                  <div className="flex items-center justify-between font-bold text-lg bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">
                    <span>Total</span>
                    <span className="text-blue-600 dark:text-blue-400">{formatCurrency(total)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default SpendingAnalysis;
