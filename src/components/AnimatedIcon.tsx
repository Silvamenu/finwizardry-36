
import React from 'react';
import { cn } from "@/lib/utils";

interface AnimatedIconProps {
  icon: React.ElementType;
  className?: string;
  animation?: "pulse" | "float" | "scale" | "none";
  delay?: string;
}

const AnimatedIcon: React.FC<AnimatedIconProps> = ({ 
  icon: Icon, 
  className, 
  animation = "pulse", 
  delay = "0s" 
}) => {
  const getAnimationClass = () => {
    switch (animation) {
      case "pulse":
        return "animate-pulse-soft";
      case "float":
        return "animate-float";
      case "scale":
        return "animate-scale";
      default:
        return "";
    }
  };

  return (
    <div 
      className={cn(
        "flex items-center justify-center", 
        getAnimationClass(),
        className
      )}
      style={{ animationDelay: delay }}
    >
      <Icon className="w-full h-full" />
    </div>
  );
};

export default AnimatedIcon;
