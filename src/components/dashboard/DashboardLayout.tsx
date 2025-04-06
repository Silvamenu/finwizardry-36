
import React, { ReactNode, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { X, Menu, ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";
import { useAuth } from "@/contexts/AuthContext";
import { 
  Sidebar, 
  SidebarProvider,
  SidebarTrigger 
} from "@/components/ui/sidebar";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { AvatarDropdown } from "@/components/ui/avatar-dropdown";
import { MotionButton } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";

interface DashboardLayoutProps {
  children: ReactNode;
  activePage?: string;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({
  children,
  activePage = "",
}) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const [sidebarOpen, setSidebarOpen] = useState(!isMobile);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  // Check dark mode when component is mounted
  useEffect(() => {
    const isDarkMode = document.documentElement.classList.contains('dark');
    setDarkMode(isDarkMode);
    
    // Create an observer to track theme changes
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.attributeName === 'class') {
          const isDark = document.documentElement.classList.contains('dark');
          setDarkMode(isDark);
        }
      });
    });
    
    // Start observing
    observer.observe(document.documentElement, { attributes: true });
    
    // Clean up
    return () => observer.disconnect();
  }, []);

  // For smaller screens, auto-close sidebar
  useEffect(() => {
    if (isMobile) {
      setSidebarOpen(false);
    } else {
      setSidebarOpen(true);
    }
  }, [isMobile]);

  const toggleCollapse = () => {
    if (isMobile) return;
    setIsCollapsed(!isCollapsed);
    toast.info(
      !isCollapsed ? "Sidebar minimizada" : "Sidebar expandida", 
      { duration: 1500 }
    );
  };

  return (
    <motion.div 
      className="min-h-screen bg-white dark:bg-gray-900 flex transition-colors duration-500"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* Mobile sidebar backdrop */}
      <AnimatePresence>
        {isMobile && sidebarOpen && (
          <motion.div 
            className="fixed inset-0 z-20 bg-black/30 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={() => setSidebarOpen(false)}
          />
        )}
      </AnimatePresence>
      
      {/* Sidebar */}
      <SidebarProvider defaultOpen={!isCollapsed}>
        <motion.div 
          className={cn(
            "fixed md:static inset-y-0 left-0 z-30 transition-all duration-500 ease-in-out",
            isMobile && !sidebarOpen ? "-translate-x-full" : "translate-x-0",
            isCollapsed && !isMobile ? "md:w-20" : "md:w-64"
          )}
          initial={{ x: isMobile ? -320 : 0 }}
          animate={{ x: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
        >
          <Sidebar data-active-page={activePage} className={cn(
            "h-full transition-all duration-500 rounded-r-3xl overflow-hidden",
            isCollapsed && !isMobile ? "md:w-20" : "md:w-64"
          )} />
        </motion.div>
      </SidebarProvider>
      
      <div className={cn(
        "flex-1 min-w-0 flex flex-col transition-all duration-500",
        isCollapsed && !isMobile ? "md:ml-20" : "md:ml-0"
      )}>
        <motion.header 
          className="bg-white dark:bg-gray-800 shadow-sm z-10 flex justify-between items-center p-4 transition-colors duration-500 border-b border-blue-50 dark:border-blue-900/30 rounded-b-3xl"
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.4 }}
        >
          <div className="flex items-center">
            {isMobile ? (
              <MotionButton
                variant="ghost"
                size="icon"
                className="mr-2 text-blue-600 dark:text-blue-400 rounded-full"
                onClick={() => setSidebarOpen(!sidebarOpen)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </MotionButton>
            ) : (
              <MotionButton
                variant="ghost"
                size="icon"
                className="mr-2 text-blue-600 dark:text-blue-400 rounded-full"
                onClick={toggleCollapse}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {isCollapsed ? <ChevronRight className="h-5 w-5" /> : <ChevronLeft className="h-5 w-5" />}
              </MotionButton>
            )}
            <motion.h1 
              className="text-xl md:text-2xl font-bold text-blue-900 dark:text-blue-50 transition-colors duration-500"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              {activePage}
            </motion.h1>
          </div>
          <div className="flex items-center space-x-3">
            <ThemeToggle />
            <Separator orientation="vertical" className="h-8 mx-1 hidden sm:block dark:bg-blue-900/30" />
            <AvatarDropdown />
          </div>
        </motion.header>
        
        <main className="flex-1 overflow-y-auto p-4 md:p-6 bg-blue-50/30 dark:bg-gray-900 transition-colors duration-500">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="h-full"
          >
            {children}
          </motion.div>
        </main>
      </div>
    </motion.div>
  );
};

export default DashboardLayout;
