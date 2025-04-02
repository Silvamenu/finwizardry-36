
import { AlertCircle, BarChart4, Brain, CreditCard, DollarSign, LineChart, PieChart, TrendingUp } from "lucide-react";
import AnimatedIcon from "./AnimatedIcon";
import { cn } from "@/lib/utils";

const features = [
  {
    icon: BarChart4,
    title: "Análise de Gastos",
    description: "Monitora despesas e identifica padrões para sugerir cortes ou ajustes estratégicos.",
    color: "bg-blue-50 text-blue-600",
    delay: "0s"
  },
  {
    icon: PieChart,
    title: "Orçamento Inteligente",
    description: "Cria um plano financeiro adaptado ao seu estilo de vida e metas pessoais.",
    color: "bg-purple-50 text-purple-600",
    delay: "0.1s"
  },
  {
    icon: TrendingUp,
    title: "Sugestões de Investimento",
    description: "Analisa seu perfil e sugere aplicações financeiras com base em risco e retorno.",
    color: "bg-green-50 text-green-600",
    delay: "0.2s"
  },
  {
    icon: AlertCircle,
    title: "Previsão de Riscos",
    description: "Detecta riscos financeiros antes que aconteçam, sugerindo ações corretivas.",
    color: "bg-orange-50 text-orange-600",
    delay: "0.3s"
  },
  {
    icon: Brain,
    title: "Assistente Automatizado",
    description: "Responde dúvidas sobre finanças, impostos e melhores práticas de economia.",
    color: "bg-red-50 text-red-600",
    delay: "0.4s"
  },
  {
    icon: LineChart,
    title: "Alerta de Oportunidades",
    description: "Identifica promoções, benefícios bancários e oportunidades em tempo real.",
    color: "bg-momoney-50 text-momoney-600",
    delay: "0.5s"
  }
];

const Features = () => {
  return (
    <section id="features" className="py-20 relative overflow-hidden bg-white">
      {/* Gradient Blob Background */}
      <div className="absolute top-40 -left-40 w-96 h-96 bg-momoney-100 rounded-full blur-3xl opacity-30"></div>
      
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center px-3 py-1.5 bg-momoney-100 text-momoney-700 rounded-full mb-4">
            <span className="text-sm font-medium">Recursos Inteligentes</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Como o <span className="gradient-text">MoMoney</span> funciona?
          </h2>
          <p className="text-lg text-gray-700">
            Nosso assistente utiliza aprendizado de máquina e análise preditiva para entender seu comportamento financeiro e fornecer insights estratégicos.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div 
              key={index} 
              className="glass-card p-6 hover:shadow-xl transition-all duration-300 animate-fade-in"
              style={{ animationDelay: feature.delay }}
            >
              <div className="mb-4">
                <div className={cn("w-12 h-12 rounded-lg flex items-center justify-center", feature.color)}>
                  <AnimatedIcon 
                    icon={feature.icon} 
                    className="w-6 h-6" 
                    animation="pulse" 
                    delay={feature.delay} 
                  />
                </div>
              </div>
              <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
        
        <div className="mt-20 bg-white glass-card p-8 md:p-12 flex flex-col md:flex-row items-center gap-10 animate-fade-in">
          <div className="md:w-1/2 space-y-6">
            <h3 className="text-2xl md:text-3xl font-bold">
              IA que aprende com seus hábitos financeiros
            </h3>
            <p className="text-gray-700">
              Nossa tecnologia evolui à medida que você a utiliza, oferecendo recomendações cada vez mais personalizadas e precisas para sua vida financeira.
            </p>
            <ul className="space-y-3">
              {[
                "Análise avançada de dados financeiros",
                "Reconhecimento de padrões de consumo",
                "Previsões financeiras baseadas no seu histórico",
                "Sugestões personalizadas para seu perfil"
              ].map((item, idx) => (
                <li key={idx} className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-momoney-500"></div>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="md:w-1/2 flex justify-center">
            <div className="relative w-full max-w-md">
              <div className="w-full aspect-square bg-momoney-50 rounded-2xl flex items-center justify-center">
                <AnimatedIcon 
                  icon={Brain} 
                  className="w-32 h-32 text-momoney-500" 
                  animation="float" 
                />
              </div>
              <div className="absolute -top-4 -right-4 glass-card p-4 animate-float" style={{ animationDelay: '1s' }}>
                <div className="flex items-center space-x-3">
                  <CreditCard className="w-6 h-6 text-momoney-600" />
                  <div>
                    <p className="text-xs text-gray-500">Gastos Inteligentes</p>
                    <p className="font-semibold text-sm">Otimização em tempo real</p>
                  </div>
                </div>
              </div>
              <div className="absolute -bottom-4 -left-4 glass-card p-4 animate-float" style={{ animationDelay: '2s' }}>
                <div className="flex items-center space-x-3">
                  <DollarSign className="w-6 h-6 text-green-600" />
                  <div>
                    <p className="text-xs text-gray-500">Economia Automática</p>
                    <p className="font-semibold text-sm">+32% em 3 meses</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Features;
