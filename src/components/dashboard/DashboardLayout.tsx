
import React, { ReactNode, useState } from "react";
import { useNavigate } from "react-router-dom";
import { X, Menu } from "lucide-react";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";
import { useAuth } from "@/contexts/AuthContext";
import { Sidebar } from "@/components/ui/sidebar";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { AvatarDropdown } from "@/components/ui/avatar-dropdown";
import { Button } from "@/components/ui/button";

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

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex">
      {/* Mobile sidebar backdrop */}
      {isMobile && sidebarOpen && (
        <div 
          className="fixed inset-0 z-20 bg-black/50"
          onClick={() => setSidebarOpen(false)}
        />
      )}
      
      {/* Sidebar */}
      <div 
        className={cn(
          "fixed md:static inset-y-0 left-0 z-30 transition-transform transform-gpu duration-300 ease-in-out",
          isMobile && !sidebarOpen ? "-translate-x-full" : "translate-x-0"
        )}
      >
        <Sidebar data-active-page={activePage} />
      </div>
      
      <div className="flex-1 min-w-0 flex flex-col">
        <header className="bg-white dark:bg-gray-800 shadow-sm z-10 flex justify-between items-center p-4">
          <div className="flex items-center">
            <Button
              variant="ghost"
              size="icon"
              className="mr-2 md:hidden"
              onClick={() => setSidebarOpen(!sidebarOpen)}
            >
              {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
            <h1 className="text-xl md:text-2xl font-bold text-gray-800 dark:text-white">
              {activePage}
            </h1>
          </div>
          <div className="flex items-center space-x-3">
            <ThemeToggle />
            <AvatarDropdown />
          </div>
        </header>
        
        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          {children}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
