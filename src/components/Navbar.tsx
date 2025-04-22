
import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Menu, X, LogIn, User } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useNavigate } from 'react-router-dom';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from '@/contexts/AuthContext';

const Navbar = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const navItems = [
    { title: "Início", href: "#home" },
    { title: "Benefícios", href: "#benefits" },
    { title: "Como Funciona", href: "#how-it-works" },
    { title: "Contato", href: "#contact" }
  ];

  const avatarUrl = user?.user_metadata?.avatar_url;
  const userName = user?.user_metadata?.name || user?.email?.split('@')[0] || 'Usuário';
  const userInitials = userName.split(' ').map(n => n[0]).join('').toUpperCase();

  return (
    <header className={cn(
      "fixed top-0 w-full z-50 transition-all duration-300", 
      isScrolled ? "py-2 bg-white/90 backdrop-blur-md shadow-sm" : "py-4 bg-transparent"
    )}>
      <div className="container mx-auto px-4 flex justify-between items-center">
        <a href="#" className="flex items-center space-x-2">
          <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-600 to-blue-400 flex items-center justify-center">
            <span className="text-white font-bold text-lg">M</span>
          </div>
          <span className="text-2xl font-bold gradient-text">MoMoney</span>
        </a>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-8">
          {navItems.map((item, index) => (
            <a 
              key={index} 
              href={item.href} 
              className="text-gray-700 hover:text-blue-600 transition-colors duration-300 py-2 relative group"
            >
              {item.title}
              <span className="absolute left-0 bottom-0 w-0 h-0.5 bg-blue-500 transition-all duration-300 group-hover:w-full"></span>
            </a>
          ))}
          
          {user ? (
            <div className="flex items-center space-x-4">
              <Button 
                className="bg-blue-500 hover:bg-blue-600 rounded-xl shadow-md transform transition-all duration-300 hover:scale-105"
                onClick={() => navigate('/dashboard')}
              >
                Dashboard
              </Button>
              <Avatar 
                className="cursor-pointer hover:ring-2 hover:ring-blue-300 transition-all duration-300" 
                onClick={() => navigate('/dashboard/perfil')}
              >
                <AvatarImage src={avatarUrl} alt={userName} />
                <AvatarFallback className="bg-blue-100 text-blue-700">{userInitials}</AvatarFallback>
              </Avatar>
            </div>
          ) : (
            <>
              <Button 
                variant="outline" 
                className="border-blue-500 text-blue-600 hover:bg-blue-50 rounded-xl"
                onClick={() => navigate('/login')}
              >
                <LogIn className="mr-2 h-4 w-4" />
                Entrar
              </Button>
              <Button 
                className="bg-blue-500 hover:bg-blue-600 neo-button rounded-xl shadow-md transform transition-all duration-300 hover:scale-105"
                onClick={() => navigate('/login')}
              >
                Criar Conta
              </Button>
            </>
          )}
        </nav>

        {/* Mobile Menu Button */}
        <div className="md:hidden flex items-center space-x-4">
          {user && (
            <Avatar 
              className="cursor-pointer" 
              onClick={() => navigate('/dashboard/perfil')}
            >
              <AvatarImage src={avatarUrl} alt={userName} />
              <AvatarFallback className="bg-blue-100 text-blue-700">{userInitials}</AvatarFallback>
            </Avatar>
          )}
          <button 
            className="text-gray-700 focus:outline-none" 
            onClick={toggleMenu}
            aria-label={isMenuOpen ? "Fechar menu" : "Abrir menu"}
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      <div className={cn(
        "md:hidden fixed inset-0 bg-white/95 backdrop-blur-sm z-40 transition-transform duration-300 ease-in-out transform",
        isMenuOpen ? "translate-x-0" : "translate-x-full"
      )}>
        <div className="flex flex-col h-full p-8 pt-20">
          {navItems.map((item, index) => (
            <a 
              key={index} 
              href={item.href} 
              className="text-xl py-4 border-b border-gray-100 text-gray-800 hover:text-blue-600 transition-colors duration-300" 
              onClick={() => setIsMenuOpen(false)}
            >
              {item.title}
            </a>
          ))}
          <div className="mt-8 space-y-4">
            {user ? (
              <Button 
                className="w-full bg-blue-500 hover:bg-blue-600 neo-button rounded-xl"
                onClick={() => {
                  navigate('/dashboard');
                  setIsMenuOpen(false);
                }}
              >
                Dashboard
              </Button>
            ) : (
              <>
                <Button 
                  variant="outline" 
                  className="w-full border-blue-500 text-blue-600 hover:bg-blue-50 rounded-xl"
                  onClick={() => {
                    navigate('/login');
                    setIsMenuOpen(false);
                  }}
                >
                  <LogIn className="mr-2 h-4 w-4" />
                  Entrar
                </Button>
                <Button 
                  className="w-full bg-blue-500 hover:bg-blue-600 neo-button rounded-xl"
                  onClick={() => {
                    navigate('/login');
                    setIsMenuOpen(false);
                  }}
                >
                  Criar Conta
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
