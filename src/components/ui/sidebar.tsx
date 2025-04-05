
import * as React from "react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import { 
  LayoutDashboard, 
  ArrowUpDown, 
  LineChart, 
  PiggyBank, 
  Target, 
  BrainCircuit, 
  Settings, 
  LogOut,
  MessageSquare,
  ChevronsLeft,
  ChevronsRight,
  User
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

export interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> {}

export function Sidebar({ className, ...props }: SidebarProps) {
  const { user, signOut } = useAuth();
  const [collapsed, setCollapsed] = useState(false);
  
  // Get the active page from data attribute
  const activePage = props["data-active-page"] || "";

  const userName = user?.user_metadata?.name || user?.email?.split('@')[0] || 'Usuário';
  const userInitials = userName.split(' ').map(n => n[0]).join('').toUpperCase();
  const avatarUrl = user?.user_metadata?.avatar_url;

  const menuItems = [
    { 
      name: "Dashboard", 
      path: "/dashboard", 
      icon: LayoutDashboard
    },
    { 
      name: "Transações", 
      path: "/dashboard/transacoes", 
      icon: ArrowUpDown
    },
    { 
      name: "Investimentos", 
      path: "/dashboard/investimentos", 
      icon: LineChart
    },
    { 
      name: "Orçamento", 
      path: "/dashboard/orcamento", 
      icon: PiggyBank
    },
    { 
      name: "Metas", 
      path: "/dashboard/metas", 
      icon: Target
    },
    { 
      name: "Mensagens", 
      path: "/dashboard/mensagens", 
      icon: MessageSquare 
    },
    { 
      name: "Assistente IA", 
      path: "/dashboard/assistente", 
      icon: BrainCircuit
    },
    { 
      name: "Perfil", 
      path: "/dashboard/perfil", 
      icon: User
    },
    { 
      name: "Configurações", 
      path: "/dashboard/configuracoes", 
      icon: Settings
    }
  ];

  const toggleCollapsed = () => {
    setCollapsed(!collapsed);
  };

  return (
    <div
      className={cn(
        "flex flex-col h-screen bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 transition-all duration-500 ease-in-out shadow-md",
        collapsed ? "w-20" : "w-64",
        className
      )}
      {...props}
    >
      <div className={cn(
        "flex items-center gap-2 p-4 border-b border-gray-100 dark:border-gray-700",
        collapsed ? "justify-center" : "px-6"
      )}>
        <div className="shrink-0 rounded-full bg-gradient-to-r from-blue-600 to-blue-400 p-1 w-10 h-10 flex items-center justify-center animate-pulse-soft">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6 text-white">
            <path d="M20.91 8.84 8.56 2.23a1.93 1.93 0 0 0-1.81 0L3.1 4.13a2.12 2.12 0 0 0-.05 3.69l12.22 6.93a2 2 0 0 0 1.94 0L21 12.51a2.12 2.12 0 0 0-.09-3.67Z"></path>
            <path d="m3.09 8.84 12.35-6.61a1.93 1.93 0 0 1 1.81 0l3.65 1.9a2.12 2.12 0 0 1 .1 3.69L8.73 14.75a2 2 0 0 1-1.94 0L3 12.51a2.12 2.12 0 0 1 .09-3.67Z"></path>
            <line x1="12" y1="22" x2="12" y2="13"></line>
            <path d="M20 13.5v3.37a2.06 2.06 0 0 1-1.11 1.83l-6 3.08a1.93 1.93 0 0 1-1.78 0l-6-3.08A2.06 2.06 0 0 1 4 16.87V13.5"></path>
          </svg>
        </div>
        {!collapsed && <span className="text-xl font-bold gradient-text">MoMoney</span>}
      </div>

      <div className="mt-2 py-2 px-3 flex justify-end">
        <Button 
          variant="ghost" 
          size="sm" 
          className="h-8 w-8 p-0 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700" 
          onClick={toggleCollapsed}
        >
          {collapsed ? <ChevronsRight size={16} /> : <ChevronsLeft size={16} />}
        </Button>
      </div>

      <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
        <TooltipProvider>
          <div className="mt-2 flex flex-col gap-1 px-3">
            {menuItems.map((item) => (
              <Tooltip key={item.path} delayDuration={300}>
                <TooltipTrigger asChild>
                  <Link
                    to={item.path}
                    className={cn(
                      "flex items-center gap-3 rounded-xl px-3 py-3 text-gray-700 dark:text-gray-300 transition-all hover:bg-blue-50 dark:hover:bg-blue-900/30",
                      activePage === item.name && "bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 font-medium",
                      collapsed ? "justify-center" : "",
                      "hover:scale-[1.02] hover:-translate-y-0.5"
                    )}
                  >
                    <item.icon className={cn(
                      "h-5 w-5 shrink-0",
                      activePage === item.name ? "text-blue-600 dark:text-blue-400" : "text-gray-500 dark:text-gray-400"
                    )} />
                    {!collapsed && <span>{item.name}</span>}
                  </Link>
                </TooltipTrigger>
                {collapsed && (
                  <TooltipContent side="right" className="rounded-xl">
                    {item.name}
                  </TooltipContent>
                )}
              </Tooltip>
            ))}
          </div>
        </TooltipProvider>
      </div>

      <div className={cn(
        "mt-auto border-t border-gray-200 dark:border-gray-700",
        collapsed ? "p-3" : "p-4"
      )}>
        <div className={cn(
          "flex items-center",
          collapsed ? "flex-col gap-3" : "gap-3"
        )}>
          <Avatar className="h-10 w-10 shrink-0 ring-2 ring-blue-100 dark:ring-blue-900">
            <AvatarImage src={avatarUrl} alt={userName} />
            <AvatarFallback className="bg-blue-100 text-blue-700">{userInitials}</AvatarFallback>
          </Avatar>
          
          {!collapsed && (
            <div className="flex-1 overflow-hidden">
              <h4 className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">{userName}</h4>
              <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{user?.email}</p>
            </div>
          )}
          
          <Tooltip delayDuration={300}>
            <TooltipTrigger asChild>
              <button
                onClick={() => signOut()}
                className={cn(
                  "flex items-center justify-center rounded-full text-gray-500 hover:text-red-500 dark:text-gray-400 dark:hover:text-red-400 transition-colors hover:bg-red-50 dark:hover:bg-red-900/20",
                  collapsed ? "h-8 w-8" : "h-8 w-8"
                )}
              >
                <LogOut className="h-4 w-4" />
              </button>
            </TooltipTrigger>
            <TooltipContent side={collapsed ? "right" : "top"} className="rounded-xl">
              Sair
            </TooltipContent>
          </Tooltip>
        </div>
      </div>
    </div>
  );
}
