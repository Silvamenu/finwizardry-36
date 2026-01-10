
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BudgetCategory } from '@/hooks/useBudget';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { useFormatters } from '@/hooks/useFormatters';

interface BudgetPerformanceChartProps {
  budgetCategories: BudgetCategory[];
}

const BudgetPerformanceChart: React.FC<BudgetPerformanceChartProps> = ({ budgetCategories }) => {
  const { formatCurrency } = useFormatters();
  
  // Prepare data for bar chart comparing current spending vs budget limit
  const chartData = budgetCategories.map(category => ({
    name: category.name,
    gasto: category.current_amount,
    limite: category.max_amount,
    disponivel: Math.max(0, category.max_amount - category.current_amount),
    color: category.color
  }));

  // Custom tooltip component
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-card p-3 rounded-lg shadow-md border border-border">
          <p className="font-medium mb-2 text-foreground">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
              <span className="font-medium">{entry.name}:</span> {formatCurrency(entry.value)}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="text-lg">Performance por Categoria</CardTitle>
      </CardHeader>
      <CardContent className="p-4 h-[350px]">
        {chartData.length > 0 ? (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={chartData}
              margin={{
                top: 20,
                right: 30,
                left: 20,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
              <XAxis 
                dataKey="name" 
                fontSize={12}
                angle={-45}
                textAnchor="end"
                height={80}
              />
              <YAxis 
                fontSize={12}
                tickFormatter={(value) => formatCurrency(value, { notation: 'compact' })}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Bar 
                dataKey="gasto" 
                name="Gasto Atual"
                fill="#ef4444" 
                radius={[2, 2, 0, 0]}
              />
              <Bar 
                dataKey="disponivel" 
                name="Disponível"
                fill="#22c55e" 
                radius={[2, 2, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <div className="h-full flex items-center justify-center">
            <p className="text-muted-foreground text-center">
              Adicione categorias e defina limites<br />
              para visualizar a performance do seu orçamento
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default BudgetPerformanceChart;
