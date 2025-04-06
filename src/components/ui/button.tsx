
import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { motion, type TargetAndTransition, type Variants } from "framer-motion";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 [&_svg]:h-4 [&_svg]:w-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-blue-500 text-white hover:bg-blue-600 shadow-sm",
        destructive: "bg-red-500 text-white hover:bg-red-600 shadow-sm",
        outline: "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-blue-500 underline-offset-4 hover:underline",
        clean: "bg-blue-600 text-white hover:bg-blue-500 shadow-sm",
        cleanOutline: "border border-blue-400 text-blue-600 bg-transparent hover:bg-blue-50 dark:hover:bg-blue-900/20",
      },
      size: {
        default: "h-10 px-5 py-2",
        sm: "h-9 rounded-lg px-3",
        lg: "h-11 rounded-xl px-8 text-base",
        icon: "h-10 w-10 rounded-full",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  isLoading?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, isLoading, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);

// Define specific motion animation variants
const buttonAnimationVariants: Variants = {
  initial: { scale: 1, y: 0 },
  hover: { scale: 1.02, y: -2 },
  tap: { scale: 0.98 }
};

// Create a proper typed motion button version without prop type issues
interface MotionButtonProps extends ButtonProps {
  whileHover?: TargetAndTransition;
  whileTap?: TargetAndTransition;
  transition?: object;
  animate?: TargetAndTransition;
  initial?: TargetAndTransition;
}

const MotionButton = React.forwardRef<HTMLButtonElement, MotionButtonProps>(
  ({ 
    className, 
    variant, 
    size, 
    asChild = false, 
    whileHover, 
    whileTap, 
    transition, 
    animate, 
    initial, 
    isLoading, 
    ...props 
  }, ref) => {
    const buttonClasses = cn(buttonVariants({ variant, size, className }));
    
    return (
      <motion.button
        className={buttonClasses}
        ref={ref}
        variants={buttonAnimationVariants}
        initial="initial"
        whileHover={whileHover || "hover"}
        whileTap={whileTap || "tap"}
        transition={transition || { duration: 0.2 }}
        animate={animate || "initial"}
        {...props}
      />
    );
  }
);

Button.displayName = "Button";
MotionButton.displayName = "MotionButton";

export { Button, MotionButton, buttonVariants };
