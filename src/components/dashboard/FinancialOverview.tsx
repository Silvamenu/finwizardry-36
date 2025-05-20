
import { Card, CardContent } from "@/components/ui/card";
import { useTranslation } from "react-i18next";
import { useFinancialData } from "@/hooks/useFinancialData";
import { useFormatters } from "@/hooks/useFormatters";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Skeleton } from "@/components/ui/skeleton";

const FinancialOverview = () => {
  const { t } = useTranslation();
  const { summary, loading } = useFinancialData();
  const { formatCurrency } = useFormatters();
  
  // Prepare data for the chart - use monthly data from summary
  const chartData = summary.monthlyData.map(item => ({
    name: item.month,
    income: item.income,
    expense: item.expense,
    balance: item.balance
  }));

  return (
    <Card className="w-full overflow-hidden">
      <CardContent className="p-6">
        <h3 className="text-lg font-medium mb-4">{t('dashboard.financial_overview')}</h3>
        
        {loading ? (
          <div className="h-[300px] w-full flex items-center justify-center">
            <Skeleton className="h-[250px] w-full" />
          </div>
        ) : (
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="name" />
                <YAxis 
                  tickFormatter={(value) => formatCurrency(value, { notation: 'compact' })}
                />
                <Tooltip 
                  formatter={(value) => formatCurrency(value)}
                  labelFormatter={(label) => `${label}`}
                />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="income" 
                  stroke="#22c55e" 
                  strokeWidth={2}
                  name={t('dashboard.income')}
                  activeDot={{ r: 8 }}
                />
                <Line 
                  type="monotone" 
                  dataKey="expense" 
                  stroke="#ef4444" 
                  strokeWidth={2}
                  name={t('dashboard.expenses')}
                />
                <Line 
                  type="monotone" 
                  dataKey="balance" 
                  stroke="#3b82f6" 
                  strokeWidth={2}
                  name={t('dashboard.balance')}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default FinancialOverview;
