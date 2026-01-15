import React, { ReactNode, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, ChevronRight, ChevronDown, Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";
import { useAuth } from "@/contexts/AuthContext";
import { 
  Sidebar, 
  SidebarProvider,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { AvatarDropdown } from "@/components/ui/avatar-dropdown";
import { MotionButton } from "@/components/ui/button";
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
  FileText,
  Zap,
  Shield,
  Wallet
} from "lucide-react";
import { useTranslation } from "react-i18next";
import ascendLogo from "@/assets/ascend-logo.png";

interface DashboardLayoutProps {
  children: ReactNode;
  activePage?: string;
}

// Types for navigation items
interface NavChildItem {
  title: string;
  path: string;
  color: string; // Dot color
}

interface NavItem {
  title: string;
  icon: React.ComponentType<{ className?: string }>;
  path?: string;
  children?: NavChildItem[];
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
  const [expandedMenus, setExpandedMenus] = useState<string[]>([]);
  
  // Navigation structure with collapsible menus (defined early for use in effects)
  const navigationItems: NavItem[] = [
    { 
      title: t("sidebar.dashboard"), 
      icon: Home, 
      path: "/dashboard" 
    },
    { 
      title: "Financeiro", 
      icon: Wallet, 
      children: [
        { title: t("sidebar.transactions"), path: "/dashboard/transacoes", color: "#3B82F6" },
        { title: t("sidebar.budget"), path: "/dashboard/orcamento", color: "#10B981" },
        { title: t("sidebar.investments"), path: "/dashboard/investimentos", color: "#8B5CF6" },
        { title: t("sidebar.goals"), path: "/dashboard/metas", color: "#F59E0B" },
      ]
    },
    { 
      title: "Automação", 
      icon: Zap, 
      path: "/dashboard/automacao" 
    },
    { 
      title: "Relatórios", 
      icon: FileText, 
      path: "/dashboard/relatorios" 
    },
    { 
      title: t("sidebar.assistant"), 
      icon: MessageSquarePlus, 
      path: "/dashboard/assistente" 
    },
    { 
      title: t("sidebar.settings"), 
      icon: Settings, 
      children: [
        { title: t("sidebar.profile"), path: "/dashboard/perfil", color: "#EC4899" },
        { title: "Geral", path: "/dashboard/configuracoes", color: "#6366F1" },
        { title: "Segurança", path: "/dashboard/configuracoes", color: "#EF4444" },
      ]
    },
  ];

  // Auto-expand menus when a child page is active
  useEffect(() => {
    const menusToExpand: string[] = [];
    navigationItems.forEach(item => {
      if (item.children) {
        const hasActiveChild = item.children.some(child => activePage === child.title);
        if (hasActiveChild) {
          menusToExpand.push(item.title);
        }
      }
    });
    if (menusToExpand.length > 0) {
      setExpandedMenus(prev => {
        const newExpanded = [...new Set([...prev, ...menusToExpand])];
        return newExpanded;
      });
    }
  }, [activePage]);
  
  // Load sidebar state from localStorage on mount
  useEffect(() => {
    const savedSidebarState = localStorage.getItem('sidebarCollapsed');
    if (savedSidebarState) {
      const isCollapsedValue = savedSidebarState === 'true';
      setIsCollapsed(isCollapsedValue);
      setSidebarOpen(!isCollapsedValue);
    } else if (isMobile) {
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

  const toggleMenu = (menuTitle: string) => {
    setExpandedMenus(prev => 
      prev.includes(menuTitle) 
        ? prev.filter(m => m !== menuTitle)
        : [...prev, menuTitle]
    );
  };

  const handleNavigate = (path: string) => {
    navigate(path);
    if (isMobile) setSidebarOpen(false);
  };

  const isChildActive = (children?: NavChildItem[]) => {
    if (!children) return false;
    return children.some(child => activePage === child.title);
  };

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
          {/* Logo Header */}
          <SidebarHeader className="bg-sidebar border-0 px-4 py-5">
            <div className={cn(
              "flex items-center transition-all duration-300",
              isCollapsed && !isMobile ? "justify-center" : "justify-start"
            )}>
              <img 
                src={ascendLogo} 
                alt="Ascend Logo" 
                className={cn(
                  "transition-all duration-300",
                  isCollapsed && !isMobile ? "h-8 w-8 object-contain" : "h-10 max-w-[160px] object-contain"
                )}
              />
            </div>
          </SidebarHeader>

          <SidebarContent className="bg-sidebar border-0 px-3">
            <SidebarMenu className="space-y-1">
              {navigationItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  {/* Parent Item */}
                  <SidebarMenuButton 
                    tooltip={isCollapsed ? item.title : undefined}
                    isActive={item.path ? activePage === item.title : isChildActive(item.children)}
                    onClick={() => {
                      if (item.children && !isCollapsed) {
                        toggleMenu(item.title);
                      } else if (item.path) {
                        handleNavigate(item.path);
                      }
                    }}
                    className={cn(
                      "w-full justify-between rounded-xl transition-all duration-200",
                      (item.path ? activePage === item.title : isChildActive(item.children))
                        ? "bg-[rgba(59,130,246,0.15)] text-[#60A5FA]"
                        : "text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent/10"
                    )}
                  >
                    <span className="flex items-center">
                      <item.icon className="h-5 w-5 flex-shrink-0" />
                      <span className={cn(
                        "ml-3 transition-opacity duration-300 font-medium",
                        isCollapsed && !isMobile ? "opacity-0 w-0 overflow-hidden" : "opacity-100"
                      )}>{item.title}</span>
                    </span>
                    {item.children && !isCollapsed && !isMobile && (
                      <ChevronDown className={cn(
                        "h-4 w-4 transition-transform duration-200",
                        expandedMenus.includes(item.title) ? "rotate-0" : "-rotate-90"
                      )} />
                    )}
                  </SidebarMenuButton>

                  {/* Child Items with Animation */}
                  {item.children && !isCollapsed && !isMobile && (
                    <AnimatePresence>
                      {expandedMenus.includes(item.title) && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.2, ease: "easeInOut" }}
                          className="overflow-hidden"
                        >
                          <div className="ml-4 mt-1 space-y-1 border-l border-sidebar-foreground/10 pl-3">
                            {item.children.map((child) => (
                              <button
                                key={child.path + child.title}
                                onClick={() => handleNavigate(child.path)}
                                className={cn(
                                  "w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-all duration-200",
                                  activePage === child.title
                                    ? "text-white bg-sidebar-accent/10"
                                    : "text-[#94A3B8] hover:text-white hover:bg-sidebar-accent/5"
                                )}
                              >
                                {/* Colored Dot */}
                                <span 
                                  className="w-2 h-2 rounded-full flex-shrink-0"
                                  style={{ backgroundColor: child.color }}
                                />
                                <span className="truncate">{child.title}</span>
                              </button>
                            ))}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  )}
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarContent>

          <SidebarFooter className="bg-sidebar border-0 px-3 py-4">
            <div className="flex items-center justify-between">
              <AvatarDropdown />
              <ThemeToggle />
            </div>
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
