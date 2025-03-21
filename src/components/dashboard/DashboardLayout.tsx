
import React, { ReactNode, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { X, Menu, ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";
import { useAuth } from "@/contexts/AuthContext";
import { Sidebar } from "@/components/ui/sidebar";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { AvatarDropdown } from "@/components/ui/avatar-dropdown";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";

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

  // Verificar dark mode quando componente é montado
  useEffect(() => {
    const isDarkMode = document.documentElement.classList.contains('dark');
    setDarkMode(isDarkMode);
  }, []);

  // Para telas menores, fechar automaticamente a sidebar
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
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex transition-colors duration-300">
      {/* Mobile sidebar backdrop */}
      {isMobile && sidebarOpen && (
        <div 
          className="fixed inset-0 z-20 bg-black/50 backdrop-blur-sm transition-opacity"
          onClick={() => setSidebarOpen(false)}
        />
      )}
      
      {/* Sidebar */}
      <div 
        className={cn(
          "fixed md:static inset-y-0 left-0 z-30 transition-all duration-300 ease-in-out",
          isMobile && !sidebarOpen ? "-translate-x-full" : "translate-x-0",
          isCollapsed && !isMobile ? "md:w-20" : "md:w-64"
        )}
      >
        <Sidebar data-active-page={activePage} className={cn(
          "h-full transition-all duration-300",
          isCollapsed && !isMobile ? "md:w-20" : "md:w-64"
        )} />
      </div>
      
      <div className={cn(
        "flex-1 min-w-0 flex flex-col transition-all duration-300",
        isCollapsed && !isMobile ? "md:ml-20" : "md:ml-0"
      )}>
        <header className="bg-white dark:bg-gray-800 shadow-sm z-10 flex justify-between items-center p-4 transition-colors duration-300 border-b border-gray-100 dark:border-gray-700">
          <div className="flex items-center">
            {isMobile ? (
              <Button
                variant="ghost"
                size="icon"
                className="mr-2 text-gray-500 hover:text-gray-700 dark:text-gray-300 dark:hover:text-white"
                onClick={() => setSidebarOpen(!sidebarOpen)}
              >
                {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </Button>
            ) : (
              <Button
                variant="ghost"
                size="icon"
                className="mr-2 text-gray-500 hover:text-gray-700 dark:text-gray-300 dark:hover:text-white"
                onClick={toggleCollapse}
              >
                {isCollapsed ? <ChevronRight className="h-5 w-5" /> : <ChevronLeft className="h-5 w-5" />}
              </Button>
            )}
            <h1 className="text-xl md:text-2xl font-bold text-gray-800 dark:text-white transition-colors duration-300">
              {activePage}
            </h1>
          </div>
          <div className="flex items-center space-x-3">
            <ThemeToggle />
            <Separator orientation="vertical" className="h-8 mx-1 hidden sm:block dark:bg-gray-700" />
            <AvatarDropdown />
          </div>
        </header>
        
        <main className="flex-1 overflow-y-auto p-4 md:p-6 bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
          {children}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
