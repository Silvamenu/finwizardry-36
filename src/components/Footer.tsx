
import { Facebook, Instagram, Linkedin, Twitter } from "lucide-react";

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer id="contact" className="bg-white pt-16 pb-8 border-t border-gray-100">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          <div className="lg:col-span-1">
            <div className="mb-4 flex items-center">
              <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-600 to-blue-400 flex items-center justify-center mr-2">
                <span className="text-white font-bold text-lg">M</span>
              </div>
              <span className="text-2xl font-bold text-transparent bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text">MoMoney</span>
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
                  className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-100 text-gray-600 hover:bg-blue-100 hover:text-blue-600 transition-colors duration-300 transform hover:scale-110"
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
                  <a href="#" className="text-gray-600 hover:text-blue-600 transition-colors duration-300 relative group">
                    {item}
                    <span className="absolute left-0 bottom-0 w-0 h-0.5 bg-blue-300 transition-all duration-300 group-hover:w-full"></span>
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
                  <a href="#" className="text-gray-600 hover:text-blue-600 transition-colors duration-300 relative group">
                    {item}
                    <span className="absolute left-0 bottom-0 w-0 h-0.5 bg-blue-300 transition-all duration-300 group-hover:w-full"></span>
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
                  <a href="#" className="text-gray-600 hover:text-blue-600 transition-colors duration-300 relative group">
                    {item}
                    <span className="absolute left-0 bottom-0 w-0 h-0.5 bg-blue-300 transition-all duration-300 group-hover:w-full"></span>
                  </a>
                </li>
              ))}
            </ul>
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
