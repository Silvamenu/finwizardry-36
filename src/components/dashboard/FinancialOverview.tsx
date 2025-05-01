
import { useState } from "react";
import { 
  Card, 
  CardHeader, 
  CardTitle, 
  CardContent 
} from "@/components/ui/card";
import { 
  ChartContainer, 
  ChartTooltip, 
  ChartTooltipContent 
} from "@/components/ui/chart";
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  ResponsiveContainer,
  Tooltip
} from "recharts";
import { Button } from "@/components/ui/button";
import { ArrowUp, ArrowDown, Info } from "lucide-react";
import AnimatedIcon from "@/components/AnimatedIcon";
import { cn } from "@/lib/utils";
import { useFinancialData } from "@/hooks/useFinancialData";

const FinancialOverview = () => {
  const [timeRange, setTimeRange] = useState<'weekly' | 'monthly'>('monthly');
  const { summary, loading } = useFinancialData();
  
  const data = summary.monthlyData;
  
  // Calculate totals from actual transaction data
  const totals = {
    receita: summary.totalIncome,
    despesa: summary.totalExpense,
    saldo: summary.balance
  };

  const chartConfig = {
    receita: {
      label: "Receita",
      theme: {
        light: "#38bdf8",
        dark: "#0ea5e9",
      },
    },
    despesa: {
      label: "Despesa",
      theme: {
        light: "#fb7185",
        dark: "#f43f5e",
      },
    },
    saldo: {
      label: "Saldo",
      theme: {
        light: "#4ade80", 
        dark: "#22c55e", 
      },
    },
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  return (
    <Card className="h-full animate-fade-in dark-card overflow-hidden">
      <CardHeader className="flex flex-row items-center justify-between pt-4 pb-2 px-4 md:p-6 md:pb-4">
        <CardTitle className="text-lg font-medium truncate">Visão Geral Financeira</CardTitle>
        <div className="flex space-x-2">
          <Button 
            variant={timeRange === 'weekly' ? "default" : "outline"} 
            size="sm"
            onClick={() => setTimeRange('weekly')}
            className={cn(
              timeRange === 'weekly' && "bg-gradient-to-r from-blue-600 to-blue-500 text-white"
            )}
          >
            Semanal
          </Button>
          <Button 
            variant={timeRange === 'monthly' ? "default" : "outline"} 
            size="sm"
            onClick={() => setTimeRange('monthly')}
            className={cn(
              timeRange === 'monthly' && "bg-gradient-to-r from-blue-600 to-blue-500 text-white"
            )}
          >
            Mensal
          </Button>
        </div>
      </CardHeader>
      <CardContent className="px-4 pb-4 md:p-6 md:pt-0">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4 md:mb-6">
          <div className="p-3 md:p-4 rounded-lg bg-blue-50 dark:bg-blue-900/20 transition-all duration-300">
            <div className="flex items-center justify-between">
              <div className="min-w-0">
                <p className="text-sm text-gray-500 dark:text-gray-400 truncate">Receita</p>
                <p className="text-xl font-bold text-blue-500 dark:text-blue-400 truncate">
                  {formatCurrency(totals.receita)}
                </p>
              </div>
              <AnimatedIcon 
                icon={ArrowUp} 
                className="p-2 bg-blue-100 dark:bg-blue-800/50 text-blue-500 dark:text-blue-300 rounded-lg w-10 h-10" 
                animation="float"
              />
            </div>
          </div>
          
          <div className="p-3 md:p-4 rounded-lg bg-red-50 dark:bg-red-900/20 transition-all duration-300">
            <div className="flex items-center justify-between">
              <div className="min-w-0">
                <p className="text-sm text-gray-500 dark:text-gray-400 truncate">Despesa</p>
                <p className="text-xl font-bold text-red-500 dark:text-red-400 truncate">
                  {formatCurrency(totals.despesa)}
                </p>
              </div>
              <AnimatedIcon 
                icon={ArrowDown} 
                className="p-2 bg-red-100 dark:bg-red-800/50 text-red-500 dark:text-red-300 rounded-lg w-10 h-10" 
                animation="float"
                delay="0.2s"
              />
            </div>
          </div>
          
          <div className="p-3 md:p-4 rounded-lg bg-green-50 dark:bg-green-900/20 transition-all duration-300">
            <div className="flex items-center justify-between">
              <div className="min-w-0">
                <p className="text-sm text-gray-500 dark:text-gray-400 truncate">Saldo</p>
                <p className="text-xl font-bold text-green-500 dark:text-green-400 truncate">
                  {formatCurrency(totals.saldo)}
                </p>
              </div>
              <AnimatedIcon 
                icon={Info} 
                className="p-2 bg-green-100 dark:bg-green-800/50 text-green-500 dark:text-green-300 rounded-lg w-10 h-10" 
                animation="float"
                delay="0.4s"
              />
            </div>
          </div>
        </div>
        
        <div className="h-64 md:h-80">
          <ChartContainer config={chartConfig}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorReceita" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorDespesa" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#f43f5e" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorSaldo" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#22c55e" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid 
                  strokeDasharray="3 3" 
                  vertical={false} 
                  stroke="var(--chart-grid-color, rgba(0, 0, 0, 0.1))"
                  opacity={0.5}
                />
                <XAxis 
                  dataKey="month" 
                  tick={{ fontSize: 12, fill: "var(--chart-text-color, rgba(0, 0, 0, 0.7))" }} 
                  tickLine={{ stroke: "var(--chart-grid-color, rgba(0, 0, 0, 0.1))" }} 
                  axisLine={{ stroke: "var(--chart-grid-color, rgba(0, 0, 0, 0.1))" }} 
                />
                <YAxis 
                  tick={{ fontSize: 12, fill: "var(--chart-text-color, rgba(0, 0, 0, 0.7))" }} 
                  tickLine={{ stroke: "var(--chart-grid-color, rgba(0, 0, 0, 0.1))" }} 
                  axisLine={{ stroke: "var(--chart-grid-color, rgba(0, 0, 0, 0.1))" }}
                  tickFormatter={(value) => `R$${value / 1000}k`}
                />
                <Tooltip 
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      return (
                        <div className="chart-tooltip bg-white dark:bg-gray-800 p-3 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
                          <p className="font-medium mb-1">{payload[0].payload.month}</p>
                          {payload.map((entry, index) => (
                            <div key={index} className="flex items-center justify-between mb-1">
                              <span className="flex items-center">
                                <span 
                                  className="w-2 h-2 rounded-full mr-1" 
                                  style={{
                                    backgroundColor: entry.name === 'income' || entry.name === 'receita'
                                      ? '#0ea5e9' 
                                      : entry.name === 'expense' || entry.name === 'despesa'
                                        ? '#f43f5e' 
                                        : '#22c55e'
                                  }}
                                />
                                <span className="text-sm">
                                  {entry.name === 'income' || entry.name === 'receita' ? 'Receita' : 
                                   entry.name === 'expense' || entry.name === 'despesa' ? 'Despesa' : 'Saldo'}
                                </span>
                              </span>
                              <span className="font-medium text-sm">{formatCurrency(entry.value as number)}</span>
                            </div>
                          ))}
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Area 
                  type="monotone" 
                  dataKey="income" 
                  name="receita"
                  stroke="#0ea5e9" 
                  strokeWidth={2}
                  fillOpacity={1} 
                  fill="url(#colorReceita)" 
                />
                <Area 
                  type="monotone" 
                  dataKey="expense" 
                  name="despesa"
                  stroke="#f43f5e" 
                  strokeWidth={2}
                  fillOpacity={1} 
                  fill="url(#colorDespesa)" 
                />
                <Area 
                  type="monotone" 
                  dataKey="balance" 
                  name="saldo"
                  stroke="#22c55e" 
                  strokeWidth={2}
                  fillOpacity={1} 
                  fill="url(#colorSaldo)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </ChartContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default FinancialOverview;
