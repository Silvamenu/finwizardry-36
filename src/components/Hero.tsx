
import { Button } from "@/components/ui/button";
import { ArrowRight, BarChart3, DollarSign, PieChart, TrendingUp, Star } from "lucide-react";
import AnimatedIcon from "./AnimatedIcon";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const Hero = () => {
  return (
    <section id="home" className="pt-40 pb-32 relative overflow-hidden">
      {/* Gradient Blob Background */}
      <div className="absolute -top-40 -right-40 w-96 h-96 bg-[hsl(var(--accent))]/20 rounded-full blur-3xl opacity-50 animate-float"></div>
      <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-[hsl(var(--primary))]/20 rounded-full blur-3xl opacity-50 animate-float" style={{ animationDelay: '2s' }}></div>
      
      <div className="container mx-auto px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          <motion.div 
            className="space-y-10 max-w-2xl mx-auto lg:mx-0"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center px-4 py-2 bg-[hsl(var(--accent))]/10 text-[hsl(var(--accent))] rounded-full border border-[hsl(var(--accent))]/20">
              <Star className="h-4 w-4 mr-2" />
              <span className="text-sm font-medium">Seu Parceiro Financeiro Inteligente</span>
            </div>
            
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold leading-tight">
              <span className="gradient-text">Transforme sua vida financeira</span> com inteligência artificial
            </h1>
            
            <p className="text-xl text-[hsl(var(--muted-foreground))] leading-relaxed">
              Gerencie seus gastos, planeje investimentos e alcance seus objetivos com o MoMoney. 
              Nossa plataforma moderna reinventa o controle financeiro, investimentos e educação 
              financeira personalizada.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-6 pt-6">
              <Button className="minimalist-button minimalist-button-primary text-lg py-7 px-10 rounded-xl shadow-lg transform transition-all duration-300 hover:scale-105" asChild>
                <Link to="/login">
                  Comece Agora <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button variant="outline" className="minimalist-button border-[hsl(var(--primary))] hover:bg-[hsl(var(--primary))]/10 text-[hsl(var(--primary))] text-lg py-7 px-10 rounded-xl transform transition-all duration-300 hover:scale-105">
                Saiba Mais
              </Button>
            </div>
          </motion.div>
          
          <div className="relative lg:h-[550px] grid place-items-center">
            <motion.div 
              className="glass-card p-10 w-full max-w-md rounded-2xl shadow-2xl"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
            >
              <div className="flex justify-between mb-8">
                <h2 className="text-xl font-bold text-[hsl(var(--card-foreground))]">Meu Dashboard</h2>
                <span className="text-[hsl(var(--accent))] font-semibold text-lg">R$ 15.840,00</span>
              </div>
              
              <div className="space-y-8">
                <motion.div 
                  className="space-y-3"
                  initial={{ width: 0 }}
                  animate={{ width: "100%" }}
                  transition={{ delay: 0.5, duration: 0.8 }}
                >
                  <div className="flex justify-between text-sm">
                    <span className="text-[hsl(var(--muted-foreground))]">Orçamento Mensal</span>
                    <span className="font-medium text-[hsl(var(--foreground))]">R$ 5.000,00</span>
                  </div>
                  <div className="w-full h-3 bg-[hsl(var(--muted))] rounded-full overflow-hidden">
                    <motion.div 
                      className="h-full gradient-bg rounded-full" 
                      initial={{ width: 0 }}
                      animate={{ width: "65%" }}
                      transition={{ delay: 0.7, duration: 0.8 }}
                    ></motion.div>
                  </div>
                </motion.div>
                
                <div className="grid grid-cols-2 gap-5">
                  <motion.div 
                    className="bg-[hsl(var(--accent))]/10 p-5 rounded-xl shadow-sm transition-all duration-300 hover:shadow-md hover:bg-[hsl(var(--accent))]/15 border border-[hsl(var(--accent))]/20"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.8, duration: 0.5 }}
                  >
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-[hsl(var(--accent))]/20 rounded-lg">
                        <TrendingUp className="h-5 w-5 text-[hsl(var(--accent))]" />
                      </div>
                      <div>
                        <p className="text-xs text-[hsl(var(--muted-foreground))]">Economia</p>
                        <p className="font-semibold text-[hsl(var(--foreground))]">+12%</p>
                      </div>
                    </div>
                  </motion.div>
                  <motion.div 
                    className="bg-[hsl(var(--accent))]/10 p-5 rounded-xl shadow-sm transition-all duration-300 hover:shadow-md hover:bg-[hsl(var(--accent))]/15 border border-[hsl(var(--accent))]/20"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.9, duration: 0.5 }}
                  >
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-[hsl(var(--accent))]/20 rounded-lg">
                        <DollarSign className="h-5 w-5 text-[hsl(var(--accent))]" />
                      </div>
                      <div>
                        <p className="text-xs text-[hsl(var(--muted-foreground))]">Investimentos</p>
                        <p className="font-semibold text-[hsl(var(--foreground))]">R$ 2.450</p>
                      </div>
                    </div>
                  </motion.div>
                </div>
                
                <motion.div 
                  className="bg-[hsl(var(--card))] p-6 rounded-xl border border-[hsl(var(--border))] shadow-sm transition-all duration-300 hover:shadow-md"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.0, duration: 0.5 }}
                >
                  <div className="flex space-x-3 items-center mb-3">
                    <p className="font-medium text-[hsl(var(--foreground))]">Análise de Gastos</p>
                  </div>
                  <div className="flex justify-center py-3">
                    <AnimatedIcon icon={PieChart} className="w-24 h-24 text-[hsl(var(--accent))]" animation="float" />
                  </div>
                </motion.div>
                
                <motion.div 
                  className="flex justify-center pt-2"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1.2, duration: 0.5 }}
                >
                  <Button variant="outline" className="w-full border-[hsl(var(--primary))] text-[hsl(var(--primary))] rounded-xl hover:bg-[hsl(var(--primary))]/10 group" asChild>
                    <Link to="/login">
                      Ver Relatório Completo
                      <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </Button>
                </motion.div>
              </div>
            </motion.div>
            
            <motion.div 
              className="absolute -right-10 top-20 glass-card p-5 shadow-xl rounded-xl border border-[hsl(var(--border))]"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 1.4, duration: 0.5 }}
              style={{animationDelay: '1s'}}
            >
              <div className="flex items-center space-x-3">
                <AnimatedIcon 
                  icon={BarChart3} 
                  className="w-10 h-10 p-2 bg-[hsl(var(--accent))]/20 rounded-lg text-[hsl(var(--accent))]" 
                  animation="pulse"
                />
                <div>
                  <p className="text-xs text-[hsl(var(--muted-foreground))]">Economia Projetada</p>
                  <p className="font-semibold text-green-400">+ R$ 4.280</p>
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
