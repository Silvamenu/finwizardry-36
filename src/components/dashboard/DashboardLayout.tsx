
import React, { ReactNode, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { X, Menu, ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";
import { useAuth } from "@/contexts/AuthContext";
import { 
  Sidebar, 
  SidebarProvider,
  SidebarTrigger,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { AvatarDropdown } from "@/components/ui/avatar-dropdown";
import { MotionButton } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Home,
  PiggyBank,
  BarChart3,
  ArrowLeftRight,
  Target,
  MessageSquarePlus,
  Settings,
  User,
  Mail
} from "lucide-react";

interface DashboardLayoutProps {
  children: ReactNode;
  activePage?: string;
}

// Navigation items for the sidebar
const navigationItems = [
  { title: "Dashboard", icon: Home, path: "/dashboard" },
  { title: "Orçamento", icon: PiggyBank, path: "/dashboard/orcamento" },
  { title: "Investimentos", icon: BarChart3, path: "/dashboard/investimentos" },
  { title: "Transações", icon: ArrowLeftRight, path: "/dashboard/transacoes" },
  { title: "Metas", icon: Target, path: "/dashboard/metas" },
  { title: "Assistente", icon: MessageSquarePlus, path: "/dashboard/assistente" },
];

// User-related items
const userItems = [
  { title: "Configurações", icon: Settings, path: "/dashboard/configuracoes" },
  { title: "Perfil", icon: User, path: "/dashboard/perfil" },
  { title: "Mensagens", icon: Mail, path: "/dashboard/mensagens" },
];

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
  };

  return (
    <SidebarProvider defaultOpen={!isMobile && !isCollapsed}>
      <motion.div 
        className="min-h-screen bg-white dark:bg-gray-900 flex w-full transition-colors duration-500"
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
        
        {/* Enhanced Sidebar */}
        <Sidebar 
          variant="floating"
          className={cn(
            "rounded-2xl overflow-hidden shadow-lg border border-blue-50 dark:border-blue-900/30",
            isMobile && !sidebarOpen ? "-translate-x-full" : "translate-x-0"
          )}
        >
          <SidebarContent>
            {/* Main Navigation */}
            <SidebarGroup>
              <SidebarGroupLabel>Navegação</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {navigationItems.map((item) => (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton 
                        tooltip={item.title}
                        isActive={activePage === item.title}
                        asChild
                      >
                        <a href={item.path} onClick={(e) => {
                          e.preventDefault();
                          navigate(item.path);
                          if (isMobile) setSidebarOpen(false);
                        }}>
                          <item.icon className="h-5 w-5" />
                          <span>{item.title}</span>
                        </a>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>

            {/* User Section */}
            <SidebarGroup>
              <SidebarGroupLabel>Usuário</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {userItems.map((item) => (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton 
                        tooltip={item.title}
                        isActive={activePage === item.title}
                        asChild
                      >
                        <a href={item.path} onClick={(e) => {
                          e.preventDefault();
                          navigate(item.path);
                          if (isMobile) setSidebarOpen(false);
                        }}>
                          <item.icon className="h-5 w-5" />
                          <span>{item.title}</span>
                        </a>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>

          <SidebarFooter>
            <SidebarGroup>
              <div className="flex items-center justify-between px-2">
                <AvatarDropdown />
                <ThemeToggle />
              </div>
            </SidebarGroup>
          </SidebarFooter>
        </Sidebar>
        
        <div className="flex-1 min-w-0 flex flex-col">
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
    </SidebarProvider>
  );
};

export default DashboardLayout;
