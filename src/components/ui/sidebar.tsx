
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
  LogOut 
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

export interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> {}

export function Sidebar({ className, ...props }: SidebarProps) {
  const { signOut } = useAuth();
  
  // Get the active page from data attribute
  const activePage = props["data-active-page"] || "";

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
      name: "Assistente IA", 
      path: "/dashboard/assistente", 
      icon: BrainCircuit
    },
    { 
      name: "Configurações", 
      path: "/dashboard/configuracoes", 
      icon: Settings
    }
  ];

  return (
    <div
      className={cn(
        "flex flex-col h-screen bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 w-64 p-4",
        className
      )}
      {...props}
    >
      <div className="flex items-center gap-2 px-2 py-3">
        <div className="rounded-full bg-blue-600 p-1 w-8 h-8 flex items-center justify-center">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5 text-white">
            <path d="M20.91 8.84 8.56 2.23a1.93 1.93 0 0 0-1.81 0L3.1 4.13a2.12 2.12 0 0 0-.05 3.69l12.22 6.93a2 2 0 0 0 1.94 0L21 12.51a2.12 2.12 0 0 0-.09-3.67Z"></path>
            <path d="m3.09 8.84 12.35-6.61a1.93 1.93 0 0 1 1.81 0l3.65 1.9a2.12 2.12 0 0 1 .1 3.69L8.73 14.75a2 2 0 0 1-1.94 0L3 12.51a2.12 2.12 0 0 1 .09-3.67Z"></path>
            <line x1="12" y1="22" x2="12" y2="13"></line>
            <path d="M20 13.5v3.37a2.06 2.06 0 0 1-1.11 1.83l-6 3.08a1.93 1.93 0 0 1-1.78 0l-6-3.08A2.06 2.06 0 0 1 4 16.87V13.5"></path>
          </svg>
        </div>
        <span className="text-xl font-bold text-blue-600">Mo Money</span>
      </div>

      <div className="mt-8 flex flex-col flex-1 gap-1">
        {menuItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={cn(
              "flex items-center gap-3 rounded-lg px-3 py-2 text-gray-700 dark:text-gray-300 transition-all hover:bg-gray-100 dark:hover:bg-gray-700",
              activePage === item.name && "bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 font-medium"
            )}
          >
            <item.icon className={cn(
              "h-5 w-5",
              activePage === item.name ? "text-blue-600 dark:text-blue-400" : "text-gray-500 dark:text-gray-400"
            )} />
            {item.name}
          </Link>
        ))}
      </div>

      <div className="mt-auto pb-4">
        <button
          onClick={() => signOut()}
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-gray-700 dark:text-gray-300 transition-all hover:bg-gray-100 dark:hover:bg-gray-700"
        >
          <LogOut className="h-5 w-5 text-gray-500 dark:text-gray-400" />
          Sair
        </button>
      </div>
    </div>
  );
}
