
import { Facebook, Instagram, Linkedin, Twitter, Mail, Phone, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-white pt-16 pb-8 border-t border-gray-100">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 mb-12">
          <div className="lg:col-span-2">
            <div className="mb-4 flex items-center">
              <div className="w-10 h-10 rounded-full bg-gradient-to-r from-momoney-600 to-momoney-300 flex items-center justify-center mr-2">
                <span className="text-white font-bold text-lg">M</span>
              </div>
              <span className="text-2xl font-bold gradient-text">MoMoney</span>
            </div>
            <p className="text-gray-600 mb-6 max-w-md">
              Transformando sua relação com o dinheiro através da inteligência artificial. Gerencie melhor suas finanças e alcance a liberdade financeira.
            </p>
            <div className="flex space-x-4">
              {[
                { icon: Facebook, label: "Facebook" },
                { icon: Twitter, label: "Twitter" },
                { icon: Instagram, label: "Instagram" },
                { icon: Linkedin, label: "LinkedIn" }
              ].map((social, index) => (
                <a 
                  key={index}
                  href="#"
                  aria-label={social.label}
                  className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-100 text-gray-600 hover:bg-momoney-100 hover:text-momoney-600 transition-colors duration-300 transform hover:scale-110"
                >
                  <social.icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Produto</h3>
            <ul className="space-y-3">
              {["Recursos", "Preços", "Avaliações", "FAQ"].map((item, index) => (
                <li key={index}>
                  <a href="#" className="text-gray-600 hover:text-momoney-600 transition-colors duration-300 relative group">
                    {item}
                    <span className="absolute left-0 bottom-0 w-0 h-0.5 bg-momoney-300 transition-all duration-300 group-hover:w-full"></span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Empresa</h3>
            <ul className="space-y-3">
              {["Sobre nós", "Carreiras", "Blog", "Contato"].map((item, index) => (
                <li key={index}>
                  <a href="#" className="text-gray-600 hover:text-momoney-600 transition-colors duration-300 relative group">
                    {item}
                    <span className="absolute left-0 bottom-0 w-0 h-0.5 bg-momoney-300 transition-all duration-300 group-hover:w-full"></span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Legal</h3>
            <ul className="space-y-3">
              {["Termos", "Privacidade", "Cookies", "Licenças"].map((item, index) => (
                <li key={index}>
                  <a href="#" className="text-gray-600 hover:text-momoney-600 transition-colors duration-300 relative group">
                    {item}
                    <span className="absolute left-0 bottom-0 w-0 h-0.5 bg-momoney-300 transition-all duration-300 group-hover:w-full"></span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
        
        {/* Resumo do projeto */}
        <div className="border-t border-b border-gray-100 py-8 mb-8">
          <h3 className="text-2xl font-bold text-center mb-6 gradient-text">MoMoney - Seu Assistente Financeiro Inteligente</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-gray-50 p-6 rounded-xl">
              <h4 className="text-lg font-semibold mb-3 text-momoney-600">Dashboards Interativos</h4>
              <p className="text-gray-600">
                Visualize suas finanças com gráficos dinâmicos e interativos. Acompanhe receitas, despesas, investimentos e metas financeiras em tempo real.
              </p>
            </div>
            <div className="bg-gray-50 p-6 rounded-xl">
              <h4 className="text-lg font-semibold mb-3 text-momoney-600">Assistente IA</h4>
              <p className="text-gray-600">
                Conte com um consultor financeiro digital alimentado por IA que analisa seus hábitos financeiros e oferece recomendações personalizadas.
              </p>
            </div>
            <div className="bg-gray-50 p-6 rounded-xl">
              <h4 className="text-lg font-semibold mb-3 text-momoney-600">Comunicação</h4>
              <p className="text-gray-600">
                Troque mensagens com outros usuários, compartilhe dicas de investimentos e construa uma rede de conhecimento financeiro colaborativa.
              </p>
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 py-8 border-b border-gray-100 mb-8">
          <div className="flex items-start space-x-3">
            <Mail className="w-5 h-5 text-momoney-500 mt-0.5" />
            <div>
              <h4 className="font-medium">E-mail</h4>
              <p className="text-gray-500">contato@momoney.com.br</p>
            </div>
          </div>
          <div className="flex items-start space-x-3">
            <Phone className="w-5 h-5 text-momoney-500 mt-0.5" />
            <div>
              <h4 className="font-medium">Telefone</h4>
              <p className="text-gray-500">+55 (11) 3456-7890</p>
            </div>
          </div>
          <div className="flex items-start space-x-3">
            <MapPin className="w-5 h-5 text-momoney-500 mt-0.5" />
            <div>
              <h4 className="font-medium">Endereço</h4>
              <p className="text-gray-500">Av. Paulista, 1000 - São Paulo, SP</p>
            </div>
          </div>
        </div>
        
        <div className="pt-8 border-t border-gray-100 text-center text-gray-500 text-sm">
          <p>&copy; {currentYear} MoMoney. Todos os direitos reservados.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
