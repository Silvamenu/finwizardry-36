
import React, { ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { User } from "lucide-react";
import { cn } from "@/lib/utils";
import { useMobile } from "@/hooks/use-mobile";
import { useAuth } from "@/contexts/AuthContext";
import { Sidebar } from "@/components/ui/sidebar";
import { ThemeToggle } from "@/components/ui/theme-toggle";

interface DashboardLayoutProps {
  children: ReactNode;
  activePage?: string;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({
  children,
  activePage = "",
}) => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const isMobile = useMobile();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex">
      <Sidebar activePage={activePage} />
      
      <div className="flex-1 min-w-0 flex flex-col">
        <header className="bg-white dark:bg-gray-800 shadow-sm z-10 flex justify-between items-center p-4">
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
            {activePage}
          </h1>
          <div className="flex items-center space-x-4">
            <ThemeToggle />
            <div className="flex items-center">
              <div
                onClick={() => navigate("/dashboard/perfil")}
                className={cn(
                  "flex items-center space-x-2 cursor-pointer px-3 py-2 rounded-md",
                  "hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
                )}
              >
                {user?.user_metadata?.avatar_url ? (
                  <img
                    src={user.user_metadata.avatar_url}
                    alt="Avatar"
                    className="w-8 h-8 rounded-full"
                  />
                ) : (
                  <div className="w-8 h-8 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center">
                    <User className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                  </div>
                )}
                {!isMobile && (
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    {user?.user_metadata?.name || user?.email}
                  </span>
                )}
              </div>
            </div>
          </div>
        </header>
        
        <main className="flex-1 overflow-y-auto p-6">
          {children}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
