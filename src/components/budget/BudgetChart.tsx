
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BudgetCategory } from '@/hooks/useBudget';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { useFormatters } from '@/hooks/useFormatters';

interface BudgetChartProps {
  budgetCategories: BudgetCategory[];
}

const BudgetChart: React.FC<BudgetChartProps> = ({ budgetCategories }) => {
  const { formatCurrency } = useFormatters();
  
  // Prepare data for chart
  const chartData = budgetCategories.map(category => ({
    name: category.name,
    value: category.current_amount,
    color: category.color,
    maxAmount: category.max_amount,
    percentage: category.percentage
  }));

  // Custom tooltip component
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      
      return (
        <div className="bg-white dark:bg-gray-800 p-3 rounded-lg shadow-md border border-gray-100 dark:border-gray-700">
          <p className="font-medium">{data.name}</p>
          <p className="text-sm">
            <span className="font-bold">{formatCurrency(data.value)}</span>
            {' '}/{' '}
            <span className="text-gray-500">{formatCurrency(data.maxAmount)}</span>
          </p>
          <p className="text-xs text-gray-500">
            {data.percentage}% do limite utilizado
          </p>
        </div>
      );
    }
    
    return null;
  };

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="text-lg">Distribuição de Gastos</CardTitle>
      </CardHeader>
      <CardContent className="p-4 h-[300px]">
        {chartData.length > 0 ? (
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={4}
                dataKey="value"
                nameKey="name"
              >
                {chartData.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={entry.color} 
                    stroke="transparent"
                    className="hover:opacity-80 transition-opacity"
                  />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
              <Legend 
                layout="vertical" 
                verticalAlign="middle" 
                align="right"
                iconType="circle"
                iconSize={8}
                formatter={(value) => (
                  <span className="text-xs truncate">{value}</span>
                )}
              />
            </PieChart>
          </ResponsiveContainer>
        ) : (
          <div className="h-full flex items-center justify-center">
            <p className="text-gray-500 text-center">
              Adicione categorias e defina limites<br />
              para visualizar seus gastos
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default BudgetChart;
