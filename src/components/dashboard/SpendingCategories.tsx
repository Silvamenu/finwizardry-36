
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useTranslation } from "react-i18next";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { Skeleton } from "@/components/ui/skeleton";
import { useFinancialData } from '@/hooks/useFinancialData';
import { useCategories } from '@/hooks/useCategories';

const SpendingCategories = () => {
  const { t } = useTranslation();
  const { summary, loading } = useFinancialData();
  const { categories } = useCategories();
  
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82ca9d', '#ffc658', '#8dd1e1', '#a4de6c', '#d0ed57'];

  // Obter dados para o gráfico a partir do resumo financeiro
  const chartData = summary.spendingByCategory.length > 0 
    ? summary.spendingByCategory.map(item => ({
        name: item.name,
        value: item.value,
        color: item.color || COLORS[summary.spendingByCategory.indexOf(item) % COLORS.length]
      }))
    : [
        { name: t('categories.food'), value: 400, color: COLORS[0] },
        { name: t('categories.transport'), value: 300, color: COLORS[1] },
        { name: t('categories.housing'), value: 200, color: COLORS[2] },
        { name: t('categories.entertainment'), value: 150, color: COLORS[3] },
        { name: t('categories.others'), value: 100, color: COLORS[4] }
      ];

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>{t('dashboard.spending_categories')}</CardTitle>
      </CardHeader>
      <CardContent className="h-[300px]">
        {loading ? (
          <div className="flex items-center justify-center h-full">
            <Skeleton className="h-[200px] w-[200px] rounded-full" />
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
                animationDuration={1000}
              >
                {chartData.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={entry.color || COLORS[index % COLORS.length]} 
                  />
                ))}
              </Pie>
              <Tooltip 
                formatter={(value: number) => `R$ ${value.toFixed(2)}`}
                labelFormatter={(name) => `Categoria: ${name}`}
              />
              <Legend 
                layout="horizontal" 
                verticalAlign="bottom" 
                align="center"
              />
            </PieChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  );
};

export default SpendingCategories;
