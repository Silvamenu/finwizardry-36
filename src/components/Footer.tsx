import { Facebook, Instagram, Linkedin, Twitter } from "lucide-react";
import Logo from '@/components/Logo';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer id="contact" className="bg-[hsl(var(--card))] pt-20 pb-10 border-t border-[hsl(var(--border))]">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          <div className="lg:col-span-1">
            <div className="mb-6">
              <Logo />
            </div>
            <p className="text-[hsl(var(--muted-foreground))] mb-8 max-w-md leading-relaxed">
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
                  className="w-11 h-11 flex items-center justify-center rounded-full bg-[hsl(var(--muted))] text-[hsl(var(--muted-foreground))] hover:bg-[hsl(var(--accent))] hover:text-white transition-all duration-300 transform hover:scale-110"
                >
                  <social.icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-6 text-[hsl(var(--foreground))]">Produto</h3>
            <ul className="space-y-4">
              {["Recursos", "Preços", "Avaliações", "FAQ"].map((item, index) => (
                <li key={index}>
                  <a href="#" className="text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--accent))] transition-colors duration-300 relative group">
                    {item}
                    <span className="absolute left-0 bottom-0 w-0 h-0.5 bg-[hsl(var(--accent))] transition-all duration-300 group-hover:w-full"></span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-6 text-[hsl(var(--foreground))]">Empresa</h3>
            <ul className="space-y-4">
              {["Sobre nós", "Carreiras", "Blog", "Contato"].map((item, index) => (
                <li key={index}>
                  <a href="#" className="text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--accent))] transition-colors duration-300 relative group">
                    {item}
                    <span className="absolute left-0 bottom-0 w-0 h-0.5 bg-[hsl(var(--accent))] transition-all duration-300 group-hover:w-full"></span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-6 text-[hsl(var(--foreground))]">Legal</h3>
            <ul className="space-y-4">
              {["Termos", "Privacidade", "Cookies", "Licenças"].map((item, index) => (
                <li key={index}>
                  <a href="#" className="text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--accent))] transition-colors duration-300 relative group">
                    {item}
                    <span className="absolute left-0 bottom-0 w-0 h-0.5 bg-[hsl(var(--accent))] transition-all duration-300 group-hover:w-full"></span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
        
        <div className="pt-10 border-t border-[hsl(var(--border))] text-center text-[hsl(var(--muted-foreground))] text-sm">
          <p>&copy; {currentYear} MoMoney. Todos os direitos reservados.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
