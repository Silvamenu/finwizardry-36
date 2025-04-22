
import { Button } from "@/components/ui/button";
import { ArrowRight, BarChart3, DollarSign, PieChart, TrendingUp } from "lucide-react";
import AnimatedIcon from "./AnimatedIcon";
import { Link } from "react-router-dom";

const Hero = () => {
  return (
    <section id="home" className="pt-32 pb-20 relative overflow-hidden">
      {/* Gradient Blob Background */}
      <div className="absolute -top-40 -right-40 w-96 h-96 bg-blue-100 rounded-full blur-3xl opacity-50 animate-float"></div>
      <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-blue-100 rounded-full blur-3xl opacity-50 animate-float" style={{ animationDelay: '2s' }}></div>
      
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8 max-w-2xl mx-auto lg:mx-0">
            <div className="inline-flex items-center px-3 py-1.5 bg-blue-100 text-blue-700 rounded-full animate-fade-in">
              <span className="text-sm font-medium">Seu Parceiro Financeiro Inteligente</span>
            </div>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight animate-fade-in reveal-delay-1">
              <span className="text-transparent bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text">Transforme sua vida financeira</span> com inteligência artificial
            </h1>
            
            <p className="text-lg text-gray-700 animate-fade-in reveal-delay-2">
              Gerencie seus gastos, planeje investimentos e alcance seus objetivos com o MoMoney. Plataforma moderna para controle financeiro, planejamento de investimentos e educação financeira personalizada.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 pt-4 animate-fade-in reveal-delay-3">
              <Button className="bg-blue-600 hover:bg-blue-500 text-white text-lg py-6 px-8 rounded-xl shadow-lg transform transition-all duration-300 hover:scale-105" asChild>
                <Link to="/login">
                  Comece Agora <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button variant="outline" className="border-blue-300 hover:bg-blue-50 text-blue-700 text-lg py-6 px-8 rounded-xl transform transition-all duration-300 hover:scale-105">
                Saiba Mais
              </Button>
            </div>
          </div>
          
          <div className="relative lg:h-[500px] grid place-items-center">
            <div className="glass-card p-8 w-full max-w-md animate-fade-in reveal-delay-2 rounded-2xl shadow-xl backdrop-blur-sm bg-white/80 border border-gray-100">
              <div className="flex justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-800">Meu Dashboard</h2>
                <span className="text-blue-600 font-semibold">R$ 15.840,00</span>
              </div>
              
              <div className="space-y-6">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Orçamento Mensal</span>
                    <span className="font-medium">R$ 5.000,00</span>
                  </div>
                  <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-full bg-blue-500 rounded-full" style={{width: '65%'}}></div>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-blue-50 p-4 rounded-xl shadow-sm transition-all duration-300 hover:shadow-md hover:bg-blue-100">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-blue-100 rounded-lg">
                        <TrendingUp className="h-5 w-5 text-blue-600" />
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Economia</p>
                        <p className="font-semibold">+12%</p>
                      </div>
                    </div>
                  </div>
                  <div className="bg-blue-50 p-4 rounded-xl shadow-sm transition-all duration-300 hover:shadow-md hover:bg-blue-100">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-blue-100 rounded-lg">
                        <DollarSign className="h-5 w-5 text-blue-600" />
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Investimentos</p>
                        <p className="font-semibold">R$ 2.450</p>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="bg-white p-4 rounded-xl border border-gray-100 animate-fade-in reveal-delay-3 shadow-sm transition-all duration-300 hover:shadow-md">
                  <div className="flex space-x-3 items-center mb-2">
                    <p className="font-medium">Análise de Gastos</p>
                  </div>
                  <div className="flex justify-center py-2">
                    <AnimatedIcon icon={PieChart} className="w-24 h-24 text-blue-500" animation="float" />
                  </div>
                </div>
                
                <div className="flex justify-center animate-fade-in reveal-delay-4">
                  <Button variant="outline" className="w-full border-blue-200 text-blue-700 rounded-xl transform transition-all duration-300 hover:scale-105" asChild>
                    <Link to="/login">
                      Ver Relatório Completo
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
            
            <div className="absolute -right-10 top-20 glass-card p-4 shadow-lg animate-fade-in reveal-delay-4 animate-float rounded-xl backdrop-blur-sm bg-white/80 border border-gray-100" style={{animationDelay: '1s'}}>
              <div className="flex items-center space-x-3">
                <AnimatedIcon 
                  icon={BarChart3} 
                  className="w-10 h-10 p-2 bg-blue-100 rounded-lg text-blue-600" 
                  animation="pulse"
                />
                <div>
                  <p className="text-xs text-gray-500">Economia Projetada</p>
                  <p className="font-semibold text-green-600">+ R$ 4.280</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
