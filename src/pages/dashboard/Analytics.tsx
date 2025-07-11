import React, { useEffect } from "react";
import { useTranslation } from "react-i18next";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import ExecutiveDashboard from "@/components/analytics/ExecutiveDashboard";

const Analytics = () => {
  const { t } = useTranslation();

  useEffect(() => {
    document.title = "MoMoney | Analytics";
  }, []);

  return (
    <DashboardLayout activePage="Analytics">
      <div className="container mx-auto px-4">
        <ExecutiveDashboard />
      </div>
    </DashboardLayout>
  );
};

export default Analytics;