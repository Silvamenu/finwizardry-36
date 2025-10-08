
import { BarChart3, MessageCircle, TrendingUp, Lightbulb } from "lucide-react";
import { cn } from "@/lib/utils";
import AnimatedIcon from "./AnimatedIcon";

const benefitCards = [
  {
    icon: TrendingUp,
    title: "Controle de gastos inteligente",
    description: "Organize e acompanhe todas as suas despesas automaticamente com categorização inteligente.",
    color: "bg-gradient-to-r from-accent-start to-accent-end text-white",
    iconBg: "bg-white/10",
    iconColor: "text-white"
  },
  {
    icon: Lightbulb,
    title: "Dicas personalizadas de economia",
    description: "Receba sugestões adaptadas ao seu perfil para economizar mais sem abrir mão do seu estilo de vida.",
    color: "bg-background-card",
    iconBg: "bg-accent-start/10",
    iconColor: "text-accent-start"
  },
  {
    icon: MessageCircle,
    title: "Assistente IA para tirar dúvidas",
    description: "Converse com nosso assistente virtual especializado em finanças e obtenha respostas personalizadas.",
    color: "bg-background-card",
    iconBg: "bg-accent-start/10",
    iconColor: "text-accent-start"
  },
  {
    icon: BarChart3,
    title: "Relatórios e gráficos fáceis de entender",
    description: "Visualize sua saúde financeira de forma clara e intuitiva através de dashboards interativos.",
    color: "bg-background-card",
    iconBg: "bg-accent-start/10",
    iconColor: "text-accent-start"
  }
];

const Benefits = () => {
  return (
    <section id="benefits" className="py-20 relative overflow-hidden">
      {/* Gradient Blob Background */}
      <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-accent-start/10 rounded-full blur-3xl opacity-30"></div>
      
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center px-3 py-1.5 bg-accent-end/20 text-accent-start rounded-full mb-4">
            <span className="text-sm font-medium">Benefícios</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold mb-6 text-text-highlight">
            Benefícios do <span className="text-transparent bg-gradient-to-r from-accent-start to-accent-end bg-clip-text">FinWizardry</span> para você
          </h2>
          <p className="text-lg text-text-primary">
            Nossa tecnologia pode transformar a forma como você lida com dinheiro, proporcionando uma experiência personalizada e inteligente.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {benefitCards.map((card, index) => (
            <div 
              key={index} 
              className={cn(
                "rounded-2xl p-8 shadow-lg transition-all duration-300 hover:shadow-xl hover:-translate-y-2 animate-fade-in",
                index !== 0 && "border border-white/10",
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
                <h3 className={cn(
                  "text-xl font-bold",
                  index !== 0 && "text-text-highlight"
                )}>{card.title}</h3>
              </div>
              <p className={cn("mb-6", index === 0 ? "text-white/90" : "text-text-primary")}>
                {card.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Benefits;
