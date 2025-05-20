
import { useEffect, useState } from "react";
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
import { LineChart, BarChart3, Sparkles, Target } from "lucide-react";
import { motion } from "framer-motion";
import OnboardingDialog from "@/components/onboarding/OnboardingDialog";
import NewGoalModal from "@/components/goals/NewGoalModal";
import NewInvestmentModal from "@/components/investments/NewInvestmentModal";

const Dashboard = () => {
  const { t } = useTranslation();
  const { profile } = useProfile();
  const navigate = useNavigate();
  const userName = profile?.name || t('dashboard.welcome');
  const [showNewGoalModal, setShowNewGoalModal] = useState(false);
  const [showNewInvestmentModal, setShowNewInvestmentModal] = useState(false);

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

  const handleAddGoal = (goal: any) => {
    console.log("Nova meta adicionada:", goal);
    navigate("/dashboard/metas");
  };

  const handleAddInvestment = (investment: any) => {
    console.log("Novo investimento adicionado:", investment);
    navigate("/dashboard/investimentos");
  };

  return (
    <DashboardLayout activePage="Dashboard">
      {/* Onboarding Dialog */}
      <OnboardingDialog />
      
      {/* New Goal Modal */}
      <NewGoalModal 
        open={showNewGoalModal} 
        onOpenChange={setShowNewGoalModal}
        onAddGoal={handleAddGoal}
      />

      {/* New Investment Modal */}
      <NewInvestmentModal 
        open={showNewInvestmentModal} 
        onOpenChange={setShowNewInvestmentModal}
        onAddInvestment={handleAddInvestment}
      />
      
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 gap-4 md:gap-6"
      >
        {/* Welcome Banner */}
        <motion.div variants={itemVariants} className="mb-2">
          <h2 className="text-2xl font-bold">
            {t('dashboard.welcome')}, {userName}!
          </h2>
          <p className="text-gray-500 dark:text-gray-400">
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
          <div className="border-l-4 border-l-blue-500 mt-2 md:mt-4 bg-gradient-to-r from-blue-50/80 to-white dark:from-blue-900/10 dark:to-transparent shadow-sm hover:shadow-md transition-all rounded-2xl overflow-hidden p-6">
            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
              <div>
                <h3 className="text-xl font-bold flex items-center">
                  <Sparkles className="h-5 w-5 mr-2 text-blue-500" />
                  {t('dashboard.ai_assistant.title')}
                </h3>
                <p className="mt-2 text-gray-600 dark:text-gray-400">
                  {t('dashboard.ai_assistant.description')}
                </p>
              </div>
              <MotionButton 
                className="bg-blue-600 hover:bg-blue-500 text-white rounded-full px-6 py-2 whitespace-nowrap"
                onClick={() => navigate('/dashboard/assistente')}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {t('dashboard.ai_assistant.learn_more')}
              </MotionButton>
            </div>
          </div>
        </motion.div>

        {/* Action Buttons */}
        <motion.div variants={itemVariants} className="fixed bottom-6 right-6 flex flex-col space-y-3 z-10">
          <MotionButton
            className="bg-blue-600 hover:bg-blue-500 text-white rounded-full w-12 h-12 flex items-center justify-center shadow-lg md:hidden"
            onClick={() => setShowNewGoalModal(true)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Target className="h-6 w-6" />
          </MotionButton>
          
          <MotionButton
            className="bg-green-600 hover:bg-green-500 text-white rounded-full w-12 h-12 flex items-center justify-center shadow-lg md:hidden"
            onClick={() => setShowNewInvestmentModal(true)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <BarChart3 className="h-6 w-6" />
          </MotionButton>
          
          {/* Desktop only buttons */}
          <div className="hidden md:flex md:space-x-3 fixed bottom-6 right-6 z-10">
            <MotionButton
              className="bg-blue-600 hover:bg-blue-500 text-white rounded-xl px-4 py-2 shadow-lg flex items-center"
              onClick={() => setShowNewGoalModal(true)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Target className="h-5 w-5 mr-2" />
              Nova Meta
            </MotionButton>
            
            <MotionButton
              className="bg-green-600 hover:bg-green-500 text-white rounded-xl px-4 py-2 shadow-lg flex items-center"
              onClick={() => setShowNewInvestmentModal(true)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <BarChart3 className="h-5 w-5 mr-2" />
              Novo Investimento
            </MotionButton>
          </div>
        </motion.div>
      </motion.div>
    </DashboardLayout>
  );
};

export default Dashboard;
