import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Home, Rocket, CreditCard, User, Settings } from "lucide-react";
import { Dock } from "@/components/ui/dock-two";
import SpaceHero from "@/components/landing/SpaceHero";
import SpacePricing from "@/components/landing/SpacePricing";
import { useAuth } from "@/contexts/AuthContext";

const SpaceLanding = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    document.title = "Beyond Limits | Space Landing";
    
    // Redirect to dashboard if logged in
    if (user) {
      navigate('/dashboard');
    }
  }, [user, navigate]);

  const dockItems = [
    { 
      icon: Home, 
      label: "Home",
      onClick: () => window.scrollTo({ top: 0, behavior: 'smooth' })
    },
    { 
      icon: Rocket, 
      label: "Features",
      onClick: () => document.getElementById('pricing')?.scrollIntoView({ behavior: 'smooth' })
    },
    { 
      icon: CreditCard, 
      label: "Pricing",
      onClick: () => document.getElementById('pricing')?.scrollIntoView({ behavior: 'smooth' })
    },
    { 
      icon: User, 
      label: "Login",
      onClick: () => navigate('/login')
    },
    { 
      icon: Settings, 
      label: "Settings",
      onClick: () => {}
    },
  ];

  return (
    <div className="min-h-screen bg-black">
      {/* Hero Section with Mountain Background */}
      <SpaceHero />
      
      {/* Pricing Section */}
      <SpacePricing />
      
      {/* Simple Footer */}
      <footer className="py-12 bg-black border-t border-white/10">
        <div className="container mx-auto px-4 text-center">
          <p className="text-white/40 text-sm">
            © 2025 Beyond Limits. All rights reserved.
          </p>
        </div>
      </footer>
      
      {/* Floating Dock Navigation */}
      <Dock items={dockItems} />
    </div>
  );
};

export default SpaceLanding;
