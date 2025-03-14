
import { useEffect } from "react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import FinancialOverview from "@/components/dashboard/FinancialOverview";
import SpendingAnalysis from "@/components/dashboard/SpendingAnalysis";
import AIInsights from "@/components/dashboard/AIInsights";
import UpcomingTransactions from "@/components/dashboard/UpcomingTransactions";
import BudgetProgress from "@/components/dashboard/BudgetProgress";
import RecentActivity from "@/components/dashboard/RecentActivity";

const Dashboard = () => {
  useEffect(() => {
    document.title = "MoMoney | Dashboard";
  }, []);

  return (
    <DashboardLayout>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <FinancialOverview />
        </div>
        <div>
          <BudgetProgress />
        </div>
        <div>
          <RecentActivity />
        </div>
        <div className="lg:col-span-2">
          <SpendingAnalysis />
        </div>
        <div className="lg:col-span-3">
          <AIInsights />
        </div>
        <div className="lg:col-span-3">
          <UpcomingTransactions />
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
