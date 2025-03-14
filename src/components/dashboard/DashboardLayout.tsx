
import { useState, ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { SidebarProvider, Sidebar, SidebarContent, SidebarMenu, SidebarMenuItem, SidebarMenuButton, SidebarHeader, SidebarFooter, SidebarInset, SidebarGroup, SidebarGroupLabel, SidebarGroupContent } from "@/components/ui/sidebar";
import { LayoutDashboard, PieChart, LineChart, Wallet, Goal, Settings, BellRing, LogOut, Menu, Bot } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useToast } from "@/hooks/use-toast";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";

interface DashboardLayoutProps {
  children: ReactNode;
  activePage?: string;
}

const DashboardLayout = ({
  children,
  activePage = "Dashboard"
}: DashboardLayoutProps) => {
  const navigate = useNavigate();
  const { toast: uiToast } = useToast();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  const handleNotificationClick = () => {
    toast("Notificações", {
      description: "Você não tem novas notificações no momento.",
      position: "top-right"
    });
  };
  
  const handleLogout = () => {
    uiToast({
      title: "Saindo...",
      description: "Você será redirecionado para a página inicial."
    });
    setTimeout(() => {
      navigate("/");
    }, 1500);
  };

  // Dados simulados do usuário
  const user = {
    name: "Maria Silva",
    email: "maria.silva@exemplo.com",
    avatar: "",
    initials: "MS"
  };
  
  const mainMenuItems = [
    {
      icon: LayoutDashboard,
      label: "Dashboard",
      path: "/dashboard",
      active: activePage === "Dashboard"
    }, 
    {
      icon: PieChart,
      label: "Orçamento",
      path: "/dashboard/orcamento",
      active: activePage === "Orçamento"
    }, 
    {
      icon: LineChart,
      label: "Investimentos",
      path: "/dashboard/investimentos",
      active: activePage === "Investimentos"
    }, 
    {
      icon: Wallet,
      label: "Transações",
      path: "/dashboard/transacoes",
      active: activePage === "Transações"
    }, 
    {
      icon: Goal,
      label: "Metas",
      path: "/dashboard/metas",
      active: activePage === "Metas"
    }, 
    {
      icon: Bot,
      label: "Assistente IA",
      path: "/dashboard/assistente",
      active: activePage === "Assistente IA"
    }
  ];
  
  const secondaryMenuItems = [
    {
      icon: Settings,
      label: "Configurações",
      path: "/dashboard/configuracoes",
      active: activePage === "Configurações"
    }
  ];

  return (
    <div className="min-h-screen w-full bg-gray-50">
      {/* Mobile Header */}
      <div className="block lg:hidden bg-white border-b px-4 py-2">
        <div className="flex justify-between items-center">
          <Button variant="ghost" size="icon" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
            <Menu className="h-6 w-6" />
          </Button>
          <div className="flex items-center space-x-2">
            <Button variant="ghost" size="icon" onClick={handleNotificationClick}>
              <BellRing className="h-5 w-5" />
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                  <Avatar className="h-8 w-8">
                    {user.avatar ? (
                      <AvatarImage src={user.avatar} alt={user.name} />
                    ) : (
                      <AvatarFallback className="bg-momoney-100 text-momoney-600">{user.initials}</AvatarFallback>
                    )}
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">{user.name}</p>
                    <p className="text-xs leading-none text-muted-foreground">{user.email}</p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => navigate("/dashboard/perfil")}>
                  Perfil
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate("/dashboard/configuracoes")}>
                  Configurações
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout} className="text-red-500">
                  Sair
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 bg-white lg:hidden">
          <div className="flex flex-col h-full">
            <div className="flex justify-between items-center p-4 border-b">
              <h1 className="text-xl font-bold text-momoney-600">MoMoney</h1>
              <Button variant="ghost" size="icon" onClick={() => setIsMobileMenuOpen(false)}>
                <Menu className="h-6 w-6" />
              </Button>
            </div>
            <div className="flex-1 overflow-auto p-4">
              <div className="space-y-6">                
                {mainMenuItems.map(item => (
                  <Button 
                    key={item.label} 
                    variant={item.active ? "default" : "ghost"} 
                    className="w-full justify-start"
                    onClick={() => {
                      navigate(item.path);
                      setIsMobileMenuOpen(false);
                    }}
                  >
                    <item.icon className="mr-2 h-5 w-5" />
                    {item.label}
                  </Button>
                ))}
                
                <div className="h-px bg-gray-200 my-4" />
                
                {secondaryMenuItems.map(item => (
                  <Button 
                    key={item.label} 
                    variant="ghost" 
                    className="w-full justify-start"
                    onClick={() => {
                      navigate(item.path);
                      setIsMobileMenuOpen(false);
                    }}
                  >
                    <item.icon className="mr-2 h-5 w-5" />
                    {item.label}
                  </Button>
                ))}
              </div>
            </div>
            <div className="p-4 border-t">
              <Button variant="outline" className="w-full justify-start text-red-500" onClick={handleLogout}>
                <LogOut className="mr-2 h-5 w-5" />
                Sair
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Desktop Layout with Sidebar */}
      <SidebarProvider defaultOpen={true}>
        <div className="min-h-screen flex w-full">
          <Sidebar>
            <SidebarHeader className="flex justify-center items-center py-4 border-b border-sidebar-border">
              <h1 className="text-xl font-bold text-momoney-600">MoMoney</h1>
            </SidebarHeader>
            <SidebarContent>
              <SidebarGroup>
                <SidebarGroupLabel>Menu Principal</SidebarGroupLabel>
                <SidebarGroupContent>
                  <SidebarMenu>
                    {mainMenuItems.map(item => (
                      <SidebarMenuItem key={item.label}>
                        <SidebarMenuButton 
                          isActive={item.active} 
                          tooltip={item.label}
                          onClick={() => navigate(item.path)}
                        >
                          <item.icon />
                          <span>{item.label}</span>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    ))}
                  </SidebarMenu>
                </SidebarGroupContent>
              </SidebarGroup>

              <SidebarGroup>
                <SidebarGroupLabel>Configurações</SidebarGroupLabel>
                <SidebarGroupContent>
                  <SidebarMenu>
                    {secondaryMenuItems.map(item => (
                      <SidebarMenuItem key={item.label}>
                        <SidebarMenuButton 
                          isActive={item.active}
                          tooltip={item.label}
                          onClick={() => navigate(item.path)}
                        >
                          <item.icon />
                          <span>{item.label}</span>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    ))}
                  </SidebarMenu>
                </SidebarGroupContent>
              </SidebarGroup>
            </SidebarContent>
            <SidebarFooter className="border-t border-sidebar-border p-4">
              <Button variant="outline" className="w-full justify-start text-red-500" onClick={handleLogout}>
                <LogOut className="mr-2 h-5 w-5" />
                <span>Sair</span>
              </Button>
            </SidebarFooter>
          </Sidebar>

          <SidebarInset>
            <div className="hidden lg:flex justify-between items-center p-4 border-b rounded-sm bg-white">
              <h1 className="text-xl font-semibold">{activePage}</h1>
              <div className="flex items-center space-x-4">
                <Button variant="ghost" size="icon" onClick={handleNotificationClick} className="hover:bg-gray-100 transition-colors duration-200">
                  <BellRing className="h-5 w-5" />
                </Button>
                
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="relative h-8 w-8 rounded-full hover:bg-gray-100 transition-colors duration-200">
                      <Avatar className="h-8 w-8 ring-2 ring-offset-2 ring-momoney-200 transition-all duration-300 hover:ring-momoney-400">
                        {user.avatar ? (
                          <AvatarImage src={user.avatar} alt={user.name} />
                        ) : (
                          <AvatarFallback className="bg-momoney-100 text-momoney-600">{user.initials}</AvatarFallback>
                        )}
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56" align="end" forceMount>
                    <DropdownMenuLabel className="font-normal">
                      <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium leading-none">{user.name}</p>
                        <p className="text-xs leading-none text-muted-foreground">{user.email}</p>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => navigate("/dashboard/perfil")}>
                      Perfil
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => navigate("/dashboard/configuracoes")}>
                      Configurações
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleLogout} className="text-red-500">
                      Sair
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
            <div className="p-6">
              {children}
            </div>
          </SidebarInset>
        </div>
      </SidebarProvider>
    </div>
  );
};

export default DashboardLayout;
