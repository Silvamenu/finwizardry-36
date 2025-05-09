
import { Button } from "@/components/ui/button";
import { ArrowRight, BarChart3, DollarSign, PieChart, TrendingUp, Star } from "lucide-react";
import AnimatedIcon from "./AnimatedIcon";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const Hero = () => {
  return (
    <section id="home" className="pt-32 pb-20 relative overflow-hidden">
      {/* Gradient Blob Background */}
      <div className="absolute -top-40 -right-40 w-96 h-96 bg-blue-100 rounded-full blur-3xl opacity-50 animate-float"></div>
      <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-blue-100 rounded-full blur-3xl opacity-50 animate-float" style={{ animationDelay: '2s' }}></div>
      
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <motion.div 
            className="space-y-8 max-w-2xl mx-auto lg:mx-0"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center px-3 py-1.5 bg-blue-50 text-blue-700 rounded-full animate-pulse-soft">
              <Star className="h-4 w-4 mr-2 text-blue-600" />
              <span className="text-sm font-medium">Seu Parceiro Financeiro Inteligente</span>
            </div>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
              <span className="gradient-text">Transforme sua vida financeira</span> com inteligência artificial
            </h1>
            
            <p className="text-lg text-gray-700 dark:text-gray-300">
              Gerencie seus gastos, planeje investimentos e alcance seus objetivos com o MoMoney. 
              Nossa plataforma moderna reinventa o controle financeiro, investimentos e educação 
              financeira personalizada.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Button className="minimalist-button minimalist-button-primary text-lg py-6 px-8 rounded-xl shadow-lg transform transition-all duration-300 hover:scale-105" asChild>
                <Link to="/login">
                  Comece Agora <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button variant="outline" className="minimalist-button border-blue-300 hover:bg-blue-50 text-blue-700 text-lg py-6 px-8 rounded-xl transform transition-all duration-300 hover:scale-105">
                Saiba Mais
              </Button>
            </div>
          </motion.div>
          
          <div className="relative lg:h-[500px] grid place-items-center">
            <motion.div 
              className="glass-card p-8 w-full max-w-md rounded-2xl shadow-xl backdrop-blur-sm border border-blue-100/20 dark:border-blue-700/20"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
            >
              <div className="flex justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-800 dark:text-gray-200">Meu Dashboard</h2>
                <span className="text-blue-600 dark:text-blue-400 font-semibold">R$ 15.840,00</span>
              </div>
              
              <div className="space-y-6">
                <motion.div 
                  className="space-y-2"
                  initial={{ width: 0 }}
                  animate={{ width: "100%" }}
                  transition={{ delay: 0.5, duration: 0.8 }}
                >
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">Orçamento Mensal</span>
                    <span className="font-medium">R$ 5.000,00</span>
                  </div>
                  <div className="w-full h-2 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                    <motion.div 
                      className="h-full gradient-bg rounded-full" 
                      initial={{ width: 0 }}
                      animate={{ width: "65%" }}
                      transition={{ delay: 0.7, duration: 0.8 }}
                    ></motion.div>
                  </div>
                </motion.div>
                
                <div className="grid grid-cols-2 gap-4">
                  <motion.div 
                    className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-xl shadow-sm transition-all duration-300 hover:shadow-md hover:bg-blue-100 dark:hover:bg-blue-900/30"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.8, duration: 0.5 }}
                  >
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-blue-100 dark:bg-blue-800/50 rounded-lg">
                        <TrendingUp className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 dark:text-gray-400">Economia</p>
                        <p className="font-semibold">+12%</p>
                      </div>
                    </div>
                  </motion.div>
                  <motion.div 
                    className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-xl shadow-sm transition-all duration-300 hover:shadow-md hover:bg-blue-100 dark:hover:bg-blue-900/30"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.9, duration: 0.5 }}
                  >
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-blue-100 dark:bg-blue-800/50 rounded-lg">
                        <DollarSign className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 dark:text-gray-400">Investimentos</p>
                        <p className="font-semibold">R$ 2.450</p>
                      </div>
                    </div>
                  </motion.div>
                </div>
                
                <motion.div 
                  className="bg-white dark:bg-gray-800 p-4 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm transition-all duration-300 hover:shadow-md"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.0, duration: 0.5 }}
                >
                  <div className="flex space-x-3 items-center mb-2">
                    <p className="font-medium">Análise de Gastos</p>
                  </div>
                  <div className="flex justify-center py-2">
                    <AnimatedIcon icon={PieChart} className="w-24 h-24 text-blue-500 dark:text-blue-400" animation="float" />
                  </div>
                </motion.div>
                
                <motion.div 
                  className="flex justify-center"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1.2, duration: 0.5 }}
                >
                  <Button variant="outline" className="w-full border-blue-200 text-blue-700 dark:border-blue-800 dark:text-blue-400 rounded-xl hover:bg-blue-50 dark:hover:bg-blue-900/20 group" asChild>
                    <Link to="/login">
                      Ver Relatório Completo
                      <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </Button>
                </motion.div>
              </div>
            </motion.div>
            
            <motion.div 
              className="absolute -right-10 top-20 glass-card p-4 shadow-lg rounded-xl backdrop-blur-sm border border-blue-100/20 dark:border-blue-700/20"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 1.4, duration: 0.5 }}
              style={{animationDelay: '1s'}}
            >
              <div className="flex items-center space-x-3">
                <AnimatedIcon 
                  icon={BarChart3} 
                  className="w-10 h-10 p-2 bg-blue-100 dark:bg-blue-900/50 rounded-lg text-blue-600 dark:text-blue-400" 
                  animation="pulse"
                />
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Economia Projetada</p>
                  <p className="font-semibold text-green-600 dark:text-green-400">+ R$ 4.280</p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
