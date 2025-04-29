
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useTranslation } from "react-i18next";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { useCategories } from '@/hooks/useCategories';
import { useTransactions } from '@/hooks/useTransactions';
import { Skeleton } from "@/components/ui/skeleton";

const SpendingCategories = () => {
  const { t } = useTranslation();
  const { categories, loading: categoriesLoading } = useCategories();
  const { transactions, loading: transactionsLoading } = useTransactions();
  const [chartData, setChartData] = useState<{ name: string; value: number }[]>([]);
  
  useEffect(() => {
    if (categories && transactions) {
      // Calculate spending by category
      const spendingByCategory = new Map<string, number>();
      
      // Initialize with default categories
      categories.forEach(cat => {
        if (cat.type === 'expense') {
          spendingByCategory.set(cat.id, 0);
        }
      });
      
      // Sum up transactions
      transactions.forEach(transaction => {
        if (transaction.type === 'expense' && transaction.category_id) {
          const currentAmount = spendingByCategory.get(transaction.category_id) || 0;
          spendingByCategory.set(transaction.category_id, currentAmount + Math.abs(transaction.amount));
        }
      });
      
      // Convert to chart format
      const data = Array.from(spendingByCategory.entries())
        .map(([catId, value]) => {
          const category = categories.find(c => c.id === catId);
          return {
            name: category ? t(`categories.${category.name.toLowerCase()}`) : t('categories.others'),
            value: value
          };
        })
        .filter(item => item.value > 0)
        .sort((a, b) => b.value - a.value);
      
      // If no data, show default
      if (data.length === 0) {
        setChartData([
          { name: t('categories.food'), value: 400 },
          { name: t('categories.transport'), value: 300 },
          { name: t('categories.housing'), value: 200 },
          { name: t('categories.entertainment'), value: 150 },
          { name: t('categories.others'), value: 100 }
        ]);
      } else {
        setChartData(data);
      }
    } else {
      // Default data if no categories or transactions are available
      setChartData([
        { name: t('categories.food'), value: 400 },
        { name: t('categories.transport'), value: 300 },
        { name: t('categories.housing'), value: 200 },
        { name: t('categories.entertainment'), value: 150 },
        { name: t('categories.others'), value: 100 }
      ]);
    }
  }, [categories, transactions, t]);

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82ca9d', '#ffc658', '#8dd1e1', '#a4de6c', '#d0ed57'];

  const isLoading = categoriesLoading || transactionsLoading;

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>{t('dashboard.spending_categories')}</CardTitle>
      </CardHeader>
      <CardContent className="h-[300px]">
        {isLoading ? (
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
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => `${value}`} />
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
