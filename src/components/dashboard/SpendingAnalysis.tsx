import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent, ChartLegend, ChartLegendContent } from "@/components/ui/chart";
import { PieChart, Pie, ResponsiveContainer, Cell, Tooltip, Legend } from "recharts";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

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
const SpendingAnalysis = () => {
  const [tabView, setTabView] = useState<'categories' | 'merchants'>('categories');
  const data = tabView === 'categories' ? generateCategoryData() : generateMerchantData();

  // Calculate total
  const total = data.reduce((sum, item) => sum + item.value, 0);
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };

  // Create chart config for the categories
  const chartConfig = data.reduce((config, item) => {
    config[item.name] = {
      label: item.name,
      color: item.color
    };
    return config;
  }, {} as Record<string, {
    label: string;
    color: string;
  }>);
  return <Card className="h-full animate-fade-in reveal-delay-1">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-lg font-medium">Análise de Gastos</CardTitle>
        <Tabs defaultValue="categories" className="w-[300px]">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="categories" onClick={() => setTabView('categories')}>
              Categorias
            </TabsTrigger>
            <TabsTrigger value="merchants" onClick={() => setTabView('merchants')}>
              Estabelecimentos
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="w-full md:w-1/2 h-72 mx-0 my-0 px-0 py-[24px] rounded-none">
            <ChartContainer config={chartConfig}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={data} cx="50%" cy="50%" labelLine={false} outerRadius={80} innerRadius={40} fill="#8884d8" dataKey="value" nameKey="name" paddingAngle={2} label={({
                  name,
                  percent
                }) => `${name} ${(percent * 100).toFixed(0)}%`}>
                    {data.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)}
                  </Pie>
                  <Tooltip formatter={value => [formatCurrency(value as number), 'Valor']} />
                </PieChart>
              </ResponsiveContainer>
            </ChartContainer>
          </div>
          
          <div className="w-full md:w-1/2">
            <h3 className="text-lg font-medium mb-4">Detalhes</h3>
            <div className="space-y-3">
              {data.map((item, index) => <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="w-3 h-3 rounded-full mr-2" style={{
                  backgroundColor: item.color
                }} />
                    <span>{item.name}</span>
                  </div>
                  <div className="flex flex-col items-end">
                    <span className="font-medium">{formatCurrency(item.value)}</span>
                    <span className="text-xs text-gray-500">
                      {(item.value / total * 100).toFixed(1)}%
                    </span>
                  </div>
                </div>)}
              <div className="pt-3 mt-3 border-t border-gray-200">
                <div className="flex items-center justify-between font-bold">
                  <span>Total</span>
                  <span>{formatCurrency(total)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>;
};
export default SpendingAnalysis;