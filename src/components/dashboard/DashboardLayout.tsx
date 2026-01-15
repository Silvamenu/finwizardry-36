import React, { ReactNode, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, ChevronRight, Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";
import { useAuth } from "@/contexts/AuthContext";
import { 
  Sidebar, 
  SidebarProvider,
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
import { motion } from "framer-motion";
import { 
  Home,
  PiggyBank,
  BarChart3,
  ArrowLeftRight,
  Target,
  MessageSquarePlus,
  Settings,
  User,
  Mail,
  FileText,
  Zap
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useTranslation } from "react-i18next";

interface DashboardLayoutProps {
  children: ReactNode;
  activePage?: string;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({
  children,
  activePage = "",
}) => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isCollapsed, setIsCollapsed] = useState(false);
  
  // Load sidebar state from localStorage on mount
  useEffect(() => {
    const savedSidebarState = localStorage.getItem('sidebarCollapsed');
    if (savedSidebarState) {
      const isCollapsedValue = savedSidebarState === 'true';
      setIsCollapsed(isCollapsedValue);
      setSidebarOpen(!isCollapsedValue);
    } else if (isMobile) {
      // Default for mobile is collapsed
      setIsCollapsed(true);
      setSidebarOpen(false);
    }
  }, []);

  // Adjust for smaller screens
  useEffect(() => {
    if (isMobile) {
      setSidebarOpen(false);
      setIsCollapsed(true);
    }
  }, [isMobile]);

  // Save sidebar state to localStorage when it changes
  useEffect(() => {
    localStorage.setItem('sidebarCollapsed', isCollapsed.toString());
  }, [isCollapsed]);

  const toggleSidebar = () => {
    if (isMobile) {
      setSidebarOpen(!sidebarOpen);
    } else {
      setIsCollapsed(!isCollapsed);
      setSidebarOpen(!isCollapsed);
    }
  };

  // Navigation items for the sidebar with translations
  const navigationItems = [
    { title: t("sidebar.dashboard"), icon: Home, path: "/dashboard" },
    { title: "Automação", icon: Zap, path: "/dashboard/automacao" },
    { title: "Relatórios", icon: FileText, path: "/dashboard/relatorios" },
    { title: t("sidebar.budget"), icon: PiggyBank, path: "/dashboard/orcamento" },
    { title: t("sidebar.investments"), icon: BarChart3, path: "/dashboard/investimentos" },
    { title: t("sidebar.transactions"), icon: ArrowLeftRight, path: "/dashboard/transacoes" },
    { title: t("sidebar.goals"), icon: Target, path: "/dashboard/metas" },
    { title: t("sidebar.assistant"), icon: MessageSquarePlus, path: "/dashboard/assistente" },
  ];

  // User-related items
  const userItems = [
    { title: t("sidebar.settings"), icon: Settings, path: "/dashboard/configuracoes" },
    { title: t("sidebar.profile"), icon: User, path: "/dashboard/perfil" },
  ];

  return (
    <SidebarProvider defaultOpen={!isMobile && !isCollapsed}>
      <motion.div 
        className="min-h-screen bg-background flex w-full transition-colors duration-300"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4 }}
      >
        {/* Mobile sidebar backdrop */}
        {isMobile && sidebarOpen && (
          <motion.div 
            className="fixed inset-0 z-20 bg-black/40 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={() => setSidebarOpen(false)}
          />
        )}
        
        {/* Enhanced Sidebar - Deep Navy, No Borders */}
        <Sidebar 
          variant="floating"
          className={cn(
            "overflow-hidden transition-all duration-300 ease-in-out bg-sidebar shadow-xl border-0",
            isMobile ? (sidebarOpen ? "translate-x-0 z-50 rounded-r-2xl" : "-translate-x-full") : "rounded-none",
            !isMobile && isCollapsed ? "w-[4.5rem]" : "w-64"
          )}
        >
          <SidebarContent className="bg-sidebar border-0">
            {/* Main Navigation */}
            <SidebarGroup>
              <SidebarGroupLabel className="text-sidebar-foreground/60">{t("sidebar.navigation")}</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {navigationItems.map((item) => (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton 
                        tooltip={isCollapsed ? item.title : undefined}
                        isActive={activePage === item.title}
                        asChild
                        className="text-sidebar-foreground/80 hover:text-sidebar-foreground hover:bg-sidebar-accent/10 data-[active=true]:bg-primary data-[active=true]:text-primary-foreground"
                      >
                        <a href={item.path} onClick={(e) => {
                          e.preventDefault();
                          navigate(item.path);
                          if (isMobile) setSidebarOpen(false);
                        }}
                        className="flex items-center">
                          <item.icon className="h-5 w-5 flex-shrink-0" />
                          <span className={cn(
                            "ml-3 transition-opacity duration-300",
                            isCollapsed && !isMobile ? "opacity-0 w-0 overflow-hidden" : "opacity-100"
                          )}>{item.title}</span>
                        </a>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>

            {/* User Section */}
            <SidebarGroup>
              <SidebarGroupLabel className="text-sidebar-foreground/60">{t("sidebar.user")}</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {userItems.map((item) => (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton 
                        tooltip={isCollapsed ? item.title : undefined}
                        isActive={activePage === item.title}
                        asChild
                        className="text-sidebar-foreground/80 hover:text-sidebar-foreground hover:bg-sidebar-accent/10 data-[active=true]:bg-primary data-[active=true]:text-primary-foreground"
                      >
                        <a href={item.path} onClick={(e) => {
                          e.preventDefault();
                          navigate(item.path);
                          if (isMobile) setSidebarOpen(false);
                        }}
                        className="flex items-center">
                          <item.icon className="h-5 w-5 flex-shrink-0" />
                          <span className={cn(
                            "ml-3 transition-opacity duration-300",
                            isCollapsed && !isMobile ? "opacity-0 w-0 overflow-hidden" : "opacity-100"
                          )}>{item.title}</span>
                        </a>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>

          <SidebarFooter className="bg-sidebar border-0">
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
            className="bg-card shadow-sm z-10 flex justify-between items-center p-4 transition-colors duration-300 border-b border-border"
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.15, duration: 0.3 }}
          >
            <div className="flex items-center">
              <MotionButton
                variant="ghost"
                size="icon"
                className="mr-3 text-primary hover:bg-primary/10 rounded-xl"
                onClick={toggleSidebar}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {isMobile ? 
                  (sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />) :
                  (isCollapsed ? <ChevronRight className="h-5 w-5" /> : <ChevronLeft className="h-5 w-5" />)
                }
              </MotionButton>
              <motion.h1 
                className="text-xl md:text-2xl font-semibold text-foreground transition-colors duration-300"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                {activePage}
              </motion.h1>
            </div>
          </motion.header>
          
          <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8 bg-background transition-colors duration-300">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25, duration: 0.3 }}
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
