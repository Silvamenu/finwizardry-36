
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

// Simulated data for the chart
const generateMonthlyData = () => {
  const months = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
  return months.map((month, index) => {
    const baseValue = 10000 + Math.random() * 5000;
    const expenses = baseValue - Math.random() * 6000;
    return {
      name: month,
      receita: Math.round(baseValue),
      despesa: Math.round(expenses),
      saldo: Math.round(baseValue - expenses),
    };
  });
};

const generateWeeklyData = () => {
  const weeks = ['Semana 1', 'Semana 2', 'Semana 3', 'Semana 4'];
  return weeks.map((week) => {
    const baseValue = 2500 + Math.random() * 1500;
    const expenses = baseValue - Math.random() * 1800;
    return {
      name: week,
      receita: Math.round(baseValue),
      despesa: Math.round(expenses),
      saldo: Math.round(baseValue - expenses),
    };
  });
};

const FinancialOverview = () => {
  const [timeRange, setTimeRange] = useState<'weekly' | 'monthly'>('monthly');
  const data = timeRange === 'monthly' ? generateMonthlyData() : generateWeeklyData();
  
  // Calculate totals
  const totals = data.reduce((acc, item) => {
    acc.receita += item.receita;
    acc.despesa += item.despesa;
    acc.saldo += item.saldo;
    return acc;
  }, { receita: 0, despesa: 0, saldo: 0 });

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
        dark: "#e11d48",
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
    <Card className="h-full animate-fade-in">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-lg font-medium">Visão Geral Financeira</CardTitle>
        <div className="flex space-x-2">
          <Button 
            variant={timeRange === 'weekly' ? "default" : "outline"} 
            size="sm"
            onClick={() => setTimeRange('weekly')}
          >
            Semanal
          </Button>
          <Button 
            variant={timeRange === 'monthly' ? "default" : "outline"} 
            size="sm"
            onClick={() => setTimeRange('monthly')}
          >
            Mensal
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="p-4 bg-blue-50 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Receita</p>
                <p className="text-xl font-bold text-blue-500">{formatCurrency(totals.receita)}</p>
              </div>
              <AnimatedIcon 
                icon={ArrowUp} 
                className="p-2 bg-blue-100 text-blue-500 rounded-lg w-10 h-10" 
                animation="float"
              />
            </div>
          </div>
          
          <div className="p-4 bg-red-50 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Despesa</p>
                <p className="text-xl font-bold text-red-500">{formatCurrency(totals.despesa)}</p>
              </div>
              <AnimatedIcon 
                icon={ArrowDown} 
                className="p-2 bg-red-100 text-red-500 rounded-lg w-10 h-10" 
                animation="float"
                delay="0.2s"
              />
            </div>
          </div>
          
          <div className="p-4 bg-green-50 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Saldo</p>
                <p className="text-xl font-bold text-green-500">{formatCurrency(totals.saldo)}</p>
              </div>
              <AnimatedIcon 
                icon={Info} 
                className="p-2 bg-green-100 text-green-500 rounded-lg w-10 h-10" 
                animation="float"
                delay="0.4s"
              />
            </div>
          </div>
        </div>
        
        <div className="h-80">
          <ChartContainer config={chartConfig}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorReceita" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#38bdf8" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#38bdf8" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorDespesa" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#fb7185" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#fb7185" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorSaldo" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#4ade80" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#4ade80" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis 
                  dataKey="name" 
                  tick={{ fontSize: 12 }} 
                  tickLine={false} 
                  axisLine={false} 
                />
                <YAxis 
                  tick={{ fontSize: 12 }} 
                  tickLine={false} 
                  axisLine={false}
                  tickFormatter={(value) => `R$${value / 1000}k`}
                />
                <Tooltip 
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      return (
                        <div className="bg-white p-3 border rounded-lg shadow-lg">
                          <p className="font-medium mb-1">{payload[0].payload.name}</p>
                          {payload.map((entry, index) => (
                            <div key={index} className="flex items-center justify-between mb-1">
                              <span className="flex items-center">
                                <span 
                                  className="w-2 h-2 rounded-full mr-1" 
                                  style={{
                                    backgroundColor: entry.name === 'receita' 
                                      ? '#38bdf8' 
                                      : entry.name === 'despesa' 
                                        ? '#fb7185' 
                                        : '#4ade80'
                                  }}
                                />
                                <span className="text-sm text-gray-600">{entry.name === 'receita' ? 'Receita' : entry.name === 'despesa' ? 'Despesa' : 'Saldo'}</span>
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
                  dataKey="receita" 
                  name="receita"
                  stroke="#38bdf8" 
                  fillOpacity={1} 
                  fill="url(#colorReceita)" 
                />
                <Area 
                  type="monotone" 
                  dataKey="despesa" 
                  name="despesa"
                  stroke="#fb7185" 
                  fillOpacity={1} 
                  fill="url(#colorDespesa)" 
                />
                <Area 
                  type="monotone" 
                  dataKey="saldo" 
                  name="saldo"
                  stroke="#4ade80" 
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
