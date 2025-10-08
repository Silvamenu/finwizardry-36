// ARQUIVO CORRIGIDO: Navbar.tsx

import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

// 1. CORREÇÃO: Importando o arquivo correto (logo.png) e dando um nome claro
import novaLogo from '@/assets/logo.png';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className={cn(
      "sticky top-0 z-50 transition-all duration-300",
      isScrolled ? "bg-background-dark/80 backdrop-blur-lg shadow-lg" : "bg-transparent"
    )}>
      <div className="container mx-auto px-4 flex justify-between items-center py-4">
        {/* Nova Logo */}
        <Link to="/" className="flex items-center gap-2">
          {/* 2. CORREÇÃO: Usando a variável importada corretamente no 'src' */}
          <img src={novaLogo} alt="Logo da MoMoney" className="h-12 w-12" />
        </Link>

        {/* Links de Navegação */}
        <nav className="hidden md:flex gap-8 items-center">
          <a href="#benefits" className="text-text-primary hover:text-text-highlight transition-colors">Benefícios</a>
          <a href="#how-it-works" className="text-text-primary hover:text-text-highlight transition-colors">Como Funciona</a>
          <a href="#testimonials" className="text-text-primary hover:text-text-highlight transition-colors">Depoimentos</a>
        </nav>

        {/* Botão de Ação */}
        <div className="flex items-center gap-4">
          <Button asChild className="rounded-full bg-gradient-to-r from-accent-start to-accent-end text-white font-bold px-6 py-3 hover:shadow-lg hover:shadow-accent-start/20 transition-shadow">
            <Link to="/login">Começar Agora</Link>
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Navbar;