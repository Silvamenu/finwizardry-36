
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import FinancialOverview from "@/components/dashboard/FinancialOverview";
import RecentActivity from "@/components/dashboard/RecentActivity";
import SpendingCategories from "@/components/dashboard/SpendingCategories";
import UpcomingTransactions from "@/components/dashboard/UpcomingTransactions";
import SpendingAnalysis from "@/components/dashboard/SpendingAnalysis";
import { MotionButton } from "@/components/ui/button";
import { useProfile } from "@/hooks/useProfile";
import { Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import OnboardingDialog from "@/components/onboarding/OnboardingDialog";

const Dashboard = () => {
  const { t } = useTranslation();
  const { profile } = useProfile();
  const navigate = useNavigate();
  const userName = profile?.name || t('dashboard.welcome');

  useEffect(() => {
    document.title = "MoMoney | Dashboard";
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };


  return (
    <DashboardLayout activePage="Dashboard">
      {/* Onboarding Dialog */}
      <OnboardingDialog />
      
      
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 gap-4 md:gap-6"
      >
        {/* Welcome Banner */}
        <motion.div variants={itemVariants} className="mb-2">
          <h2 className="text-2xl font-bold text-text-highlight">
            {t('dashboard.welcome')}, {userName}!
          </h2>
          <p className="text-text-primary">
            {t('dashboard.welcome_back')}
          </p>
        </motion.div>

        {/* Financial Overview Chart */}
        <motion.div variants={itemVariants}>
          <FinancialOverview />
        </motion.div>

        {/* Analytics Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
          {/* Spending Categories Chart */}
          <motion.div variants={itemVariants}>
            <SpendingCategories />
          </motion.div>

          {/* Spending Analysis Chart */}
          <motion.div variants={itemVariants}>
            <SpendingAnalysis />
          </motion.div>
        </div>

        {/* Recent Activities and Upcoming Transactions */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
          <motion.div variants={itemVariants}>
            <RecentActivity />
          </motion.div>
          <motion.div variants={itemVariants}>
            <UpcomingTransactions />
          </motion.div>
        </div>

        {/* AI Assistant Card */}
        <motion.div variants={itemVariants}>
          <div className="border-l-4 border-l-accent-start mt-2 md:mt-4 bg-gradient-to-r from-accent-start/10 to-background-card shadow-lg hover:shadow-accent-start/10 transition-all rounded-2xl overflow-hidden p-6">
            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
              <div>
                <h3 className="text-xl font-bold flex items-center text-text-highlight">
                  <Sparkles className="h-5 w-5 mr-2 text-accent-start" />
                  {t('dashboard.ai_assistant.title')}
                </h3>
                <p className="mt-2 text-text-primary">
                  {t('dashboard.ai_assistant.description')}
                </p>
              </div>
              <MotionButton 
                className="bg-gradient-to-r from-accent-start to-accent-end text-white rounded-full px-6 py-2 whitespace-nowrap shadow-lg shadow-accent-start/20 hover:opacity-90"
                onClick={() => navigate('/dashboard/assistente')}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {t('dashboard.ai_assistant.learn_more')}
              </MotionButton>
            </div>
          </div>
        </motion.div>

      </motion.div>
    </DashboardLayout>
  );
};

export default Dashboard;
