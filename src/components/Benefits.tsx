
import { CircleDollarSign, Building, Sparkles, LineChart } from "lucide-react";
import { cn } from "@/lib/utils";
import AnimatedIcon from "./AnimatedIcon";

const benefitCards = [
  {
    icon: CircleDollarSign,
    title: "Pessoas Físicas",
    description: "Saia do vermelho, organize seu orçamento e alcance estabilidade financeira com recomendações personalizadas.",
    items: [
      "Organização financeira simplificada",
      "Economize sem perceber com ajustes inteligentes",
      "Alertas personalizados para evitar gastos excessivos",
      "Acompanhamento de metas financeiras"
    ],
    color: "bg-momoney-500 text-white",
    iconBg: "bg-white/20",
    iconColor: "text-white"
  },
  {
    icon: Building,
    title: "Pequenos Empresários",
    description: "Otimize o fluxo de caixa, reduza desperdícios e identifique estratégias para crescimento sustentável.",
    items: [
      "Previsão precisa de fluxo de caixa",
      "Identificação de custos desnecessários",
      "Gestão otimizada de recursos",
      "Oportunidades de crescimento"
    ],
    color: "bg-white",
    iconBg: "bg-momoney-100",
    iconColor: "text-momoney-600"
  },
  {
    icon: Sparkles,
    title: "Investidores Iniciantes",
    description: "Receba orientações para entrar no mundo dos investimentos com segurança e conhecimento.",
    items: [
      "Recomendações baseadas no seu perfil de risco",
      "Educação financeira personalizada",
      "Diversificação inteligente de portfólio",
      "Acompanhamento de desempenho"
    ],
    color: "bg-white",
    iconBg: "bg-momoney-100",
    iconColor: "text-momoney-600"
  },
  {
    icon: LineChart,
    title: "Grandes Empresas",
    description: "Auxílio na tomada de decisões financeiras estratégicas, reduzindo riscos e maximizando lucros.",
    items: [
      "Análise avançada de dados financeiros",
      "Previsões precisas para planejamento",
      "Otimização de recursos em escala",
      "Identificação de tendências de mercado"
    ],
    color: "bg-white",
    iconBg: "bg-momoney-100",
    iconColor: "text-momoney-600"
  }
];

const Benefits = () => {
  return (
    <section id="benefits" className="py-20 relative overflow-hidden">
      {/* Gradient Blob Background */}
      <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-momoney-100 rounded-full blur-3xl opacity-50"></div>
      
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center px-3 py-1.5 bg-momoney-100 text-momoney-700 rounded-full mb-4">
            <span className="text-sm font-medium">Para Todos os Perfis</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Benefícios do <span className="gradient-text">MoMoney</span> para você
          </h2>
          <p className="text-lg text-gray-700">
            Nossa tecnologia pode transformar a forma como as pessoas e empresas lidam com dinheiro, impactando diferentes públicos.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {benefitCards.map((card, index) => (
            <div 
              key={index} 
              className={cn(
                "rounded-2xl p-8 shadow-lg transition-all duration-300 hover:shadow-xl animate-fade-in",
                card.color
              )}
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="flex items-center gap-4 mb-6">
                <div className={cn("p-3 rounded-lg", card.iconBg)}>
                  <AnimatedIcon 
                    icon={card.icon} 
                    className={cn("w-6 h-6", card.iconColor)} 
                    animation="pulse"
                    delay={`${index * 0.2}s`}
                  />
                </div>
                <h3 className="text-xl font-bold">{card.title}</h3>
              </div>
              <p className={cn("mb-6", index === 0 ? "text-white/90" : "text-gray-600")}>
                {card.description}
              </p>
              <ul className="space-y-3">
                {card.items.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <div className={cn(
                      "mt-1.5 h-2 w-2 rounded-full flex-shrink-0",
                      index === 0 ? "bg-white" : "bg-momoney-500"
                    )}></div>
                    <span className={cn(
                      "text-sm",
                      index === 0 ? "text-white/90" : "text-gray-600"
                    )}>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        
        <div className="mt-20 text-center">
          <h3 className="text-2xl font-bold mb-4">Por que o MoMoney é inovador?</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-8">
            {[
              {
                title: "Inteligência Adaptativa",
                description: "Aprende com o usuário e melhora suas sugestões com o tempo"
              },
              {
                title: "Acessível a Todos",
                description: "Interface intuitiva para iniciantes e especialistas financeiros"
              },
              {
                title: "Segurança Avançada",
                description: "Proteção total dos seus dados contra fraudes e vazamentos"
              },
              {
                title: "Integração Completa",
                description: "Compatível com bancos, corretoras e aplicativos financeiros"
              }
            ].map((item, index) => (
              <div 
                key={index} 
                className="glass-card p-6 animate-fade-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <h4 className="text-lg font-semibold mb-2">{item.title}</h4>
                <p className="text-gray-600 text-sm">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Benefits;
