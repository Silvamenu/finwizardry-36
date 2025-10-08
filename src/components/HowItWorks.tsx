
import { UserPlus, Link2, MessageSquare, Target } from "lucide-react";
import { cn } from "@/lib/utils";
import AnimatedIcon from "./AnimatedIcon";

const steps = [
  {
    icon: UserPlus,
    title: "Crie sua conta",
    description: "Registre-se gratuitamente em menos de 2 minutos com seus dados básicos.",
    delay: "0s"
  },
  {
    icon: Link2,
    title: "Conecte suas finanças",
    description: "Sincronize suas contas bancárias ou adicione suas transações manualmente.",
    delay: "0.2s"
  },
  {
    icon: MessageSquare,
    title: "Converse com o assistente IA",
    description: "Faça perguntas e receba orientações personalizadas para melhorar suas finanças.",
    delay: "0.4s"
  },
  {
    icon: Target,
    title: "Alcance suas metas!",
    description: "Acompanhe seu progresso financeiro e celebre cada conquista no caminho.",
    delay: "0.6s"
  }
];

const HowItWorks = () => {
  return (
    <section id="how-it-works" className="py-20">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center px-3 py-1.5 bg-accent-end/20 text-accent-start rounded-full mb-4">
            <span className="text-sm font-medium">Como Funciona</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold mb-6 text-text-highlight">
            Comece a transformar suas <span className="text-transparent bg-gradient-to-r from-accent-start to-accent-end bg-clip-text">finanças em 4 passos</span>
          </h2>
          <p className="text-lg text-text-primary">
            O FinWizardry torna o processo de melhorar sua vida financeira simples e direto, sem complicações ou termos técnicos.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 relative">
          {/* Connecting line */}
          <div className="hidden lg:block absolute top-1/2 left-0 right-0 h-0.5 bg-gray-700" style={{transform: 'translateY(-50%)'}}></div>
          
          {steps.map((step, index) => (
            <div 
              key={index} 
              className="bg-background-card rounded-xl p-8 shadow-lg border border-white/10 relative z-10 animate-fade-in"
              style={{ animationDelay: step.delay }}
            >
              <div className="flex flex-col items-center text-center">
                <div className={cn(
                  "w-16 h-16 rounded-full bg-accent-start/10 flex items-center justify-center mb-6",
                  "border-4 border-background-card shadow-md"
                )}>
                  <AnimatedIcon 
                    icon={step.icon} 
                    className="w-8 h-8 text-accent-start" 
                    animation="pulse"
                    delay={step.delay}
                  />
                </div>
                <div className="absolute -top-3 -right-3 w-8 h-8 bg-accent-end rounded-full text-white flex items-center justify-center font-bold shadow-lg">
                  {index + 1}
                </div>
                <h3 className="text-xl font-bold mb-3 text-text-highlight">{step.title}</h3>
                <p className="text-text-primary">{step.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
