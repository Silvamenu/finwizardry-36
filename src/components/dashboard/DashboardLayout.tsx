
import { useState, ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { 
  SidebarProvider, 
  Sidebar, 
  SidebarContent, 
  SidebarMenu, 
  SidebarMenuItem, 
  SidebarMenuButton,
  SidebarHeader,
  SidebarFooter,
  SidebarInset,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent
} from "@/components/ui/sidebar";
import { 
  LayoutDashboard, 
  PieChart, 
  LineChart, 
  Wallet, 
  Goal, 
  Settings, 
  BellRing, 
  LogOut,
  Menu,
  Home,
  Bot
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";
import { useToast } from "@/hooks/use-toast";

interface DashboardLayoutProps {
  children: ReactNode;
}

const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  const navigate = useNavigate();
  const { toast: uiToast } = useToast();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleNotificationClick = () => {
    toast("Notificações", {
      description: "Você não tem novas notificações no momento.",
      position: "top-right",
    });
  };

  const handleLogout = () => {
    uiToast({
      title: "Saindo...",
      description: "Você será redirecionado para a página inicial.",
    });
    
    setTimeout(() => {
      navigate("/");
    }, 1500);
  };

  const mainMenuItems = [
    { icon: LayoutDashboard, label: "Dashboard", active: true },
    { icon: PieChart, label: "Orçamento" },
    { icon: LineChart, label: "Investimentos" },
    { icon: Wallet, label: "Transações" },
    { icon: Goal, label: "Metas" },
    { icon: Bot, label: "Assistente IA" },
  ];

  const secondaryMenuItems = [
    { icon: Settings, label: "Configurações" },
  ];

  return (
    <div className="min-h-screen w-full bg-gray-50">
      {/* Mobile Header */}
      <div className="block lg:hidden bg-white border-b px-4 py-2">
        <div className="flex justify-between items-center">
          <Button 
            variant="ghost" 
            size="icon"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            <Menu className="h-6 w-6" />
          </Button>
          <div className="flex items-center space-x-2">
            <Button 
              variant="ghost" 
              size="icon"
              onClick={handleNotificationClick}
            >
              <BellRing className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 bg-white lg:hidden">
          <div className="flex flex-col h-full">
            <div className="flex justify-between items-center p-4 border-b">
              <h1 className="text-xl font-bold text-momoney-600">MoMoney</h1>
              <Button 
                variant="ghost" 
                size="icon"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <Menu className="h-6 w-6" />
              </Button>
            </div>
            <div className="flex-1 overflow-auto p-4">
              <div className="space-y-6">
                <Button 
                  variant="ghost" 
                  className="w-full justify-start" 
                  onClick={() => navigate("/")}
                >
                  <Home className="mr-2 h-5 w-5" />
                  Página Inicial
                </Button>
                
                {mainMenuItems.map((item) => (
                  <Button 
                    key={item.label}
                    variant={item.active ? "default" : "ghost"}
                    className="w-full justify-start"
                  >
                    <item.icon className="mr-2 h-5 w-5" />
                    {item.label}
                  </Button>
                ))}
                
                <div className="h-px bg-gray-200 my-4" />
                
                {secondaryMenuItems.map((item) => (
                  <Button 
                    key={item.label}
                    variant="ghost" 
                    className="w-full justify-start"
                  >
                    <item.icon className="mr-2 h-5 w-5" />
                    {item.label}
                  </Button>
                ))}
              </div>
            </div>
            <div className="p-4 border-t">
              <Button 
                variant="outline" 
                className="w-full justify-start text-red-500"
                onClick={handleLogout}
              >
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
                    <SidebarMenuItem>
                      <SidebarMenuButton 
                        isActive={false} 
                        tooltip="Página Inicial"
                        onClick={() => navigate("/")}
                      >
                        <Home />
                        <span>Página Inicial</span>
                      </SidebarMenuButton>
                    </SidebarMenuItem>

                    {mainMenuItems.map((item) => (
                      <SidebarMenuItem key={item.label}>
                        <SidebarMenuButton 
                          isActive={item.active} 
                          tooltip={item.label}
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
                    {secondaryMenuItems.map((item) => (
                      <SidebarMenuItem key={item.label}>
                        <SidebarMenuButton tooltip={item.label}>
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
              <Button
                variant="outline"
                className="w-full justify-start text-red-500"
                onClick={handleLogout}
              >
                <LogOut className="mr-2 h-5 w-5" />
                <span>Sair</span>
              </Button>
            </SidebarFooter>
          </Sidebar>

          <SidebarInset>
            <div className="hidden lg:flex justify-end items-center p-4 border-b">
              <Button
                variant="ghost"
                size="icon"
                onClick={handleNotificationClick}
              >
                <BellRing className="h-5 w-5" />
              </Button>
            </div>
            <div className="p-6">
              <h1 className="text-2xl font-bold mb-6">Dashboard</h1>
              {children}
            </div>
          </SidebarInset>
        </div>
      </SidebarProvider>
    </div>
  );
};

export default DashboardLayout;
