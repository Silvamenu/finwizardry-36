import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useTranslation } from "react-i18next";
import { useFinancialData } from "@/hooks/useFinancialData";
import { useFormatters } from "@/hooks/useFormatters";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Skeleton } from "@/components/ui/skeleton";
import { useTheme } from "next-themes";

const FinancialOverview = () => {
  const { t } = useTranslation();
  const { summary, loading } = useFinancialData();
  const { formatCurrency } = useFormatters();
  const { resolvedTheme } = useTheme();
  
  const isDark = resolvedTheme === 'dark';
  const gridColor = isDark ? '#444444' : '#e5e7eb';
  const textColor = isDark ? '#AAAAAA' : '#6b7280';
  
  // Prepare data for the chart - use monthly data from summary
  const chartData = summary.monthlyData.map(item => ({
    name: item.month,
    income: item.income,
    expense: item.expense,
    balance: item.balance
  }));

  return (
    <Card className="w-full overflow-hidden">
      <CardHeader>
        <CardTitle className="text-lg font-medium">Visão Geral Financeira</CardTitle>
      </CardHeader>
      <CardContent className="p-6 pt-0">
        {loading ? (
          <div className="h-[300px] w-full flex items-center justify-center">
            <Skeleton className="h-[250px] w-full" />
          </div>
        ) : (
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
                <XAxis dataKey="name" stroke={textColor} fontSize={12} tickLine={false} axisLine={false} />
                <YAxis 
                  tickFormatter={(value) => formatCurrency(value, { notation: 'compact' })}
                  stroke={textColor}
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: isDark ? 'hsl(222, 14%, 14%)' : 'white',
                    borderColor: isDark ? 'hsl(222, 14%, 20%)' : '#e5e7eb',
                    color: isDark ? 'white' : '#1f2937',
                    borderRadius: '0.5rem'
                  }}
                  formatter={(value) => {
                    if (typeof value === 'number' || typeof value === 'string') {
                      return formatCurrency(value);
                    }
                    return value;
                  }}
                  labelFormatter={(label) => `${label}`}
                />
                <Legend wrapperStyle={{ color: textColor, fontSize: '12px' }} />
                <Line 
                  type="monotone" 
                  dataKey="income" 
                  stroke="#22c55e" 
                  strokeWidth={2}
                  name="Receitas"
                  activeDot={{ r: 8 }}
                />
                <Line 
                  type="monotone" 
                  dataKey="expense" 
                  stroke="#ef4444" 
                  strokeWidth={2}
                  name="Despesas"
                />
                <Line 
                  type="monotone" 
                  dataKey="balance" 
                  stroke="#8b5cf6" 
                  strokeWidth={2}
                  name="Saldo"
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
