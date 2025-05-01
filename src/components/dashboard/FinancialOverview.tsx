
import { Card, CardContent } from "@/components/ui/card";
import { ArrowUp, ArrowDown } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useFinancialData } from "@/hooks/useFinancialData";
import { useFormatters } from "@/hooks/useFormatters";

const FinancialOverview = () => {
  const { t } = useTranslation();
  const { summary, loading } = useFinancialData();
  const { formatCurrency } = useFormatters();
  
  // Calculate percentage changes (would ideally come from the financial data)
  const balanceChange = summary.balance !== 0 ? 100 : 0; // Placeholder
  const expenseChange = 0; // Placeholder
  const economyPercentage = summary.totalIncome !== 0 
    ? Math.round((summary.balance / summary.totalIncome) * 100) 
    : 0;
  
  return (
    <Card className="w-full bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900/20 dark:to-gray-800/20 overflow-hidden">
      <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6">
        {/* Current Balance Card */}
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 rounded-xl p-4 shadow-sm">
          <div className="text-sm font-medium text-blue-700 dark:text-blue-400 mb-2">
            {t('dashboard.current_balance')}
          </div>
          <div className="text-2xl font-bold text-blue-700 dark:text-blue-400">
            {formatCurrency(summary.balance)}
          </div>
          <div className="flex items-center mt-2 text-green-600 dark:text-green-400 text-sm">
            <ArrowUp className="h-4 w-4 mr-1 flex-shrink-0" />
            <span>{balanceChange}% {t('dashboard.since_last_month')}</span>
          </div>
        </div>

        {/* Monthly Expenses Card */}
        <div className="bg-gradient-to-br from-red-50 to-red-100 dark:from-red-900/20 dark:to-red-800/20 rounded-xl p-4 shadow-sm">
          <div className="text-sm font-medium text-red-700 dark:text-red-400 mb-2">
            {t('dashboard.monthly_expenses')}
          </div>
          <div className="text-2xl font-bold text-red-700 dark:text-red-400">
            {formatCurrency(summary.totalExpense)}
          </div>
          <div className="flex items-center mt-2 text-gray-600 dark:text-gray-400 text-sm">
            <ArrowDown className="h-4 w-4 mr-1 flex-shrink-0" />
            <span>{expenseChange}% {t('dashboard.since_last_month')}</span>
          </div>
        </div>

        {/* Economy Card */}
        <div className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 rounded-xl p-4 shadow-sm">
          <div className="text-sm font-medium text-green-700 dark:text-green-400 mb-2">
            {t('dashboard.economy')}
          </div>
          <div className="text-2xl font-bold text-green-700 dark:text-green-400">
            {formatCurrency(summary.totalIncome - summary.totalExpense)}
          </div>
          <div className="flex items-center mt-2 text-red-600 dark:text-red-400 text-sm">
            <ArrowDown className="h-4 w-4 mr-1 flex-shrink-0" />
            <span>-{Math.abs(economyPercentage)}% {t('dashboard.of_current_balance')}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default FinancialOverview;
