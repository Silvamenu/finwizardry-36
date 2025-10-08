
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import LandingPageLayout from "@/components/LandingPageLayout";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Benefits from "@/components/Benefits";
import HowItWorks from "@/components/HowItWorks";
import Testimonials from "@/components/Testimonials";
import Footer from "@/components/Footer";
import { useAuth } from "@/contexts/AuthContext";

const Index = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  
  // Smooth scroll to sections when clicking anchor links
  useEffect(() => {''
    const handleAnchorClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const anchor = target.closest('a');
      
      if (anchor && anchor.hash && anchor.hash.startsWith('#')) {
        e.preventDefault();
        const targetElement = document.querySelector(anchor.hash);
        if (targetElement) {
          window.scrollTo({
            top: targetElement.getBoundingClientRect().top + window.pageYOffset - 80,
            behavior: 'smooth'
          });
        }
      }
    };

    document.addEventListener('click', handleAnchorClick);
    
    // Redirect to dashboard if logged in
    if (user) {
      navigate('/dashboard');
    }
    
    return () => {
      document.removeEventListener('click', handleAnchorClick);
    };
  }, [user, navigate]);
  
  return (
    <LandingPageLayout>
      <div className="min-h-screen bg-transparent overflow-hidden">
        <Navbar />
        <main>
          <Hero />
          <Benefits />
          <HowItWorks />
          <Testimonials />
        </main>
        <Footer />
      </div>
    </LandingPageLayout>
  );
};

export default Index;
