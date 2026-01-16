import { Home, Layers, CreditCard, MessageSquare, Mail } from "lucide-react";
import { Dock } from "@/components/landing/Dock";
import Hero from "@/components/landing/Hero";
import Features from "@/components/landing/Features";
import Pricing from "@/components/landing/Pricing";
import Testimonials from "@/components/landing/Testimonials";
import Footer from "@/components/landing/Footer";
import AuthButton from "@/components/landing/AuthButton";

const dockItems = [
  { icon: Home, label: "Home", href: "#home" },
  { icon: Layers, label: "Features", href: "#features" },
  { icon: CreditCard, label: "Pricing", href: "#pricing" },
  { icon: MessageSquare, label: "Testimonials", href: "#testimonials" },
  { icon: Mail, label: "Contact", href: "#contact" },
];

const Index = () => {
  return (
    <div className="min-h-screen bg-black">
      <AuthButton />
      <Dock items={dockItems} />
      <Hero />
      <Features />
      <Pricing />
      <Testimonials />
      <Footer />
    </div>
  );
};

export default Index;
