
import { useEffect } from "react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import FinancialOverview from "@/components/dashboard/FinancialOverview";
import RecentActivity from "@/components/dashboard/RecentActivity";
import SpendingAnalysis from "@/components/dashboard/SpendingAnalysis";
import UpcomingTransactions from "@/components/dashboard/UpcomingTransactions";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MotionButton } from "@/components/ui/button";
import { useProfile } from "@/hooks/useProfile";
import { ArrowUp, ArrowDown, BadgeDollarSign, Clock, BarChart3, LineChart, Sparkles } from "lucide-react";
import { motion } from "framer-motion";

const Dashboard = () => {
  const { profile } = useProfile();
  const userName = profile?.name || "Usuário";

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
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 lg:grid-cols-4 gap-6"
      >
        {/* Welcome Card */}
        <motion.div variants={itemVariants} className="lg:col-span-1">
          <Card className="overflow-hidden border border-blue-100 dark:border-blue-900/30 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300">
            <CardContent className="pt-6">
              <h2 className="text-2xl font-bold text-blue-900 dark:text-blue-50 truncate">
                Olá, {userName}!
              </h2>
              <p className="text-gray-500 dark:text-gray-400 truncate">
                Bem-vindo de volta
              </p>
              <MotionButton 
                variant="clean" 
                className="mt-4 w-full flex items-center justify-center gap-2 truncate"
              >
                <LineChart size={16} />
                Visão Geral
              </MotionButton>
            </CardContent>
          </Card>
        </motion.div>

        {/* Financial Overview Banner */}
        <motion.div variants={itemVariants} className="lg:col-span-3">
          <FinancialOverview />
        </motion.div>

        {/* Financial Cards */}
        <motion.div variants={itemVariants} className="lg:col-span-1">
          <Card className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 border-blue-100 dark:border-blue-900/30 rounded-2xl overflow-hidden">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-blue-700 dark:text-blue-400">Saldo Atual</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <h3 className="text-2xl font-bold text-blue-700 dark:text-blue-400">R$ -67634.49</h3>
                <div className="p-2 bg-blue-200/50 dark:bg-blue-800/50 rounded-lg">
                  <BadgeDollarSign className="h-6 w-6 text-blue-500 dark:text-blue-400" />
                </div>
              </div>
              <p className="text-sm flex items-center mt-2 text-green-600 dark:text-green-400">
                <ArrowUp className="h-4 w-4 mr-1" /> 100% desde o mês passado
              </p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={itemVariants} className="lg:col-span-1">
          <Card className="bg-gradient-to-br from-red-50 to-red-100 dark:from-red-900/20 dark:to-red-800/20 border-red-100 dark:border-red-900/30 rounded-2xl overflow-hidden">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-red-700 dark:text-red-400">Despesas do Mês</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <h3 className="text-2xl font-bold text-red-700 dark:text-red-400">R$ 1124405.31</h3>
                <div className="p-2 bg-red-200/50 dark:bg-red-800/50 rounded-lg">
                  <ArrowDown className="h-6 w-6 text-red-500 dark:text-red-400" />
                </div>
              </div>
              <p className="text-sm flex items-center mt-2 text-gray-600 dark:text-gray-400">
                <ArrowDown className="h-4 w-4 mr-1" /> 0% desde o mês passado
              </p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={itemVariants} className="lg:col-span-1">
          <Card className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 border-green-100 dark:border-green-900/30 rounded-2xl overflow-hidden">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-green-700 dark:text-green-400">Economia</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <h3 className="text-2xl font-bold text-green-700 dark:text-green-400">R$ 56220.27</h3>
                <div className="p-2 bg-green-200/50 dark:bg-green-800/50 rounded-lg">
                  <BadgeDollarSign className="h-6 w-6 text-green-500 dark:text-green-400" />
                </div>
              </div>
              <p className="text-sm flex items-center mt-2 text-red-600 dark:text-red-400">
                <ArrowDown className="h-4 w-4 mr-1" /> -83.1% do seu saldo atual
              </p>
            </CardContent>
          </Card>
        </motion.div>

        {/* AI Assistant Card */}
        <motion.div variants={itemVariants} className="lg:col-span-4">
          <Card className="border-l-4 border-l-blue-500 mt-4 bg-gradient-to-r from-blue-50/80 to-white dark:from-blue-900/10 dark:to-transparent shadow-sm hover:shadow-md transition-all rounded-2xl overflow-hidden">
            <CardContent className="pt-6 pb-6">
              <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
                <div>
                  <h3 className="text-xl font-bold flex items-center">
                    <Sparkles className="h-5 w-5 mr-2 text-blue-500" />
                    Novo! FinAI - Seu Consultor Financeiro Inteligente
                  </h3>
                  <p className="mt-2 text-gray-600 dark:text-gray-400">
                    A FinAI é uma inteligência artificial avançada que funciona como um consultor financeiro digital personalizado.
                    Conheça algumas das principais funcionalidades:
                  </p>
                  <div className="flex flex-wrap gap-2 mt-3">
                    <MotionButton variant="outline" size="sm" className="rounded-full text-xs bg-white dark:bg-gray-800 border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-300">
                      <BarChart3 className="h-3 w-3 mr-1" /> Análise de Gastos
                    </MotionButton>
                    <MotionButton variant="outline" size="sm" className="rounded-full text-xs bg-white dark:bg-gray-800 border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-300">
                      <LineChart className="h-3 w-3 mr-1" /> Orçamento Inteligente
                    </MotionButton>
                    <MotionButton variant="outline" size="sm" className="rounded-full text-xs bg-white dark:bg-gray-800 border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-300">
                      <ArrowUp className="h-3 w-3 mr-1" /> Sugestões de Investimento
                    </MotionButton>
                    <MotionButton variant="outline" size="sm" className="rounded-full text-xs bg-white dark:bg-gray-800 border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-300">
                      <Clock className="h-3 w-3 mr-1" /> Previsão de Riscos
                    </MotionButton>
                  </div>
                </div>
                <MotionButton className="bg-blue-600 hover:bg-blue-500 text-white rounded-full px-6 py-2">
                  Conhecer
                </MotionButton>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Recent Activities and Charts in 2-column Layout */}
        <motion.div variants={itemVariants} className="lg:col-span-2">
          <RecentActivity />
        </motion.div>

        <motion.div variants={itemVariants} className="lg:col-span-2">
          <SpendingAnalysis />
        </motion.div>

        {/* Upcoming Transactions */}
        <motion.div variants={itemVariants} className="lg:col-span-4">
          <UpcomingTransactions />
        </motion.div>
      </motion.div>
    </DashboardLayout>
  );
};

export default Dashboard;
