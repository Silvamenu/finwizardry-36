import * as React from "react";
import { motion, useScroll, useMotionValueEvent } from "framer-motion";
import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

interface DockProps {
  className?: string;
  items: {
    icon: LucideIcon;
    label: string;
    onClick?: () => void;
    href?: string;
  }[];
}

interface DockIconButtonProps {
  icon: LucideIcon;
  label: string;
  onClick?: () => void;
  href?: string;
  className?: string;
}


const DockIconButton = React.forwardRef<HTMLButtonElement, DockIconButtonProps>(
  ({ icon: Icon, label, onClick, href, className }, ref) => {
    const handleClick = () => {
      if (href) {
        const element = document.querySelector(href);
        if (element) {
          element.scrollIntoView({ behavior: "smooth" });
        }
      }
      onClick?.();
    };

    return (
      <motion.button
        ref={ref}
        onClick={handleClick}
        className={cn(
          "group relative flex h-12 w-12 items-center justify-center rounded-xl",
          "bg-white/10 backdrop-blur-md transition-all duration-500",
          "hover:bg-white/20",
          "focus:outline-none focus:ring-2 focus:ring-white/30",
          className
        )}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        transition={{ type: "spring", stiffness: 400, damping: 17 }}
      >
        <Icon className="h-5 w-5 text-white/80 transition-colors duration-300 group-hover:text-white" />
        <span
          className={cn(
            "absolute -bottom-8 left-1/2 -translate-x-1/2",
            "px-2 py-1 text-xs font-medium text-white",
            "bg-black/80 backdrop-blur-sm rounded-md",
            "opacity-0 group-hover:opacity-100 transition-all duration-300",
            "whitespace-nowrap pointer-events-none",
            "translate-y-1 group-hover:translate-y-0"
          )}
        >
          {label}
        </span>
      </motion.button>
    );
  }
);
DockIconButton.displayName = "DockIconButton";

const LandingDock = React.forwardRef<HTMLDivElement, DockProps>(
  ({ items, className }, ref) => {
    const [hidden, setHidden] = React.useState(false);
    const { scrollY } = useScroll();

    useMotionValueEvent(scrollY, "change", (latest) => {
      const previous = scrollY.getPrevious() ?? 0;
      if (latest > previous && latest > 150) {
        setHidden(true);
      } else {
        setHidden(false);
      }
    });

    return (
      <motion.nav
        ref={ref}
        className={cn(
          "fixed top-6 left-0 right-0 z-50 flex justify-center",
          className
        )}
        initial={{ y: -100, opacity: 0 }}
        animate={{ 
          y: hidden ? -100 : 0, 
          opacity: hidden ? 0 : 1 
        }}
        transition={{ 
          duration: 0.4, 
          ease: [0.25, 0.46, 0.45, 0.94]
        }}
      >
        <motion.div
          animate={{ y: [-1, 1, -1] }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className={cn(
            "flex items-center gap-2 px-4 py-3",
            "bg-white/5 backdrop-blur-xl",
            "border border-white/10 rounded-2xl",
            "shadow-[0_8px_32px_rgba(0,0,0,0.4)]"
          )}
        >
          <div className="flex items-center gap-1">
            {items.map((item, index) => (
              <DockIconButton
                key={index}
                icon={item.icon}
                label={item.label}
                onClick={item.onClick}
                href={item.href}
              />
            ))}
          </div>
        </motion.div>
      </motion.nav>
    );
  }
);
LandingDock.displayName = "LandingDock";

export { LandingDock };
