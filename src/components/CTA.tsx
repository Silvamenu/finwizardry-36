
import { Button } from "@/components/ui/button";
import { ArrowRight, Check } from "lucide-react";

const CTA = () => {
  return (
    <section id="contact" className="py-20 relative overflow-hidden bg-momoney-50">
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-momoney-100 rounded-full blur-3xl opacity-50"></div>
      <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-momoney-100 rounded-full blur-3xl opacity-50"></div>
      
      <div className="container mx-auto px-4">
        <div className="glass-card p-8 md:p-12 max-w-4xl mx-auto text-center animate-fade-in">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Transforme suas finanças com o <span className="gradient-text">MoMoney</span>
          </h2>
          <p className="text-lg text-gray-700 mb-8 max-w-2xl mx-auto">
            O MoMoney não é apenas uma IA, é um verdadeiro parceiro financeiro para transformar sua vida e seus negócios. Comece agora mesmo!
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
            {[
              "Reduza seus gastos em até 30%",
              "Invista de forma inteligente e segura",
              "Planeje seu futuro financeiro"
            ].map((item, index) => (
              <div 
                key={index}
                className="flex items-center gap-2 text-left animate-fade-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="bg-momoney-100 rounded-full p-1">
                  <Check className="w-4 h-4 text-momoney-600" />
                </div>
                <span className="text-gray-700">{item}</span>
              </div>
            ))}
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in reveal-delay-2">
            <Button className="bg-momoney-500 hover:bg-momoney-600 neo-button text-white px-8 py-6 text-lg">
              Começar Gratuitamente <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button variant="outline" className="border-momoney-300 hover:bg-momoney-50 text-momoney-700 px-8 py-6 text-lg">
              Agendar Demonstração
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTA;
