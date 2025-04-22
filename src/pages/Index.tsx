
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
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
  useEffect(() => {
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
    
    // Force light theme background for index page only
    const html = document.documentElement;
    const previousClass = html.classList.contains('dark') ? 'dark' : 'light';
    
    // Store previous theme class and remove dark class if present
    html.classList.remove('dark');
    html.classList.add('light');
    html.classList.add('index-page');
    
    // Redirect to dashboard if logged in
    if (user) {
      navigate('/dashboard');
    }
    
    return () => {
      // Restore previous theme class when component unmounts
      document.removeEventListener('click', handleAnchorClick);
      html.classList.remove('index-page');
      html.classList.remove('light');
      if (previousClass) {
        html.classList.add(previousClass);
      }
    };
  }, [user, navigate]);
  
  return (
    <div className="min-h-screen bg-white overflow-hidden index-page-wrapper">
      <Navbar />
      <main>
        <Hero />
        <Benefits />
        <HowItWorks />
        <Testimonials />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
