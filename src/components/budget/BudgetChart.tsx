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
      <CardContent>
      </CardContent>
    </Card>
  );
};

export default BudgetChart;
