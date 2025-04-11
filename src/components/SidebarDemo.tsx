
import { 
  Sidebar,
  SidebarProvider,
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
  SidebarTrigger,
} from "@/components/ui/sidebar"

import { 
  User,
  ChevronsUpDown,
  Calendar,
  Home,
  Inbox,
  Search,
  Settings,
  PiggyBank,
  BarChart3,
  ArrowLeftRight,
  Target,
  MessageSquarePlus 
} from "lucide-react"

// Menu items
const mainItems = [
  { title: "Dashboard", icon: Home, path: "/dashboard" },
  { title: "Orçamento", icon: PiggyBank, path: "/dashboard/orcamento" },
  { title: "Investimentos", icon: BarChart3, path: "/dashboard/investimentos" },
  { title: "Transações", icon: ArrowLeftRight, path: "/dashboard/transacoes" },
  { title: "Metas", icon: Target, path: "/dashboard/metas" },
  { title: "Assistente", icon: MessageSquarePlus, path: "/dashboard/assistente" },
];

const userItems = [
  { title: "Configurações", icon: Settings, path: "/dashboard/configuracoes" },
  { title: "Perfil", icon: User, path: "/dashboard/perfil" },
  { title: "Inbox", icon: Inbox, path: "/dashboard/mensagens" },
];

export function SidebarDemo() {
  return (
    <SidebarProvider>
      <div className="flex w-full">
        <Sidebar variant="floating" className="rounded-2xl border border-blue-50 dark:border-blue-900/30 shadow-lg">
          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupLabel>Navegação</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {mainItems.map((item) => (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton asChild tooltip={item.title}>
                        <a href={item.path}>
                          <item.icon className="h-5 w-5" />
                          <span>{item.title}</span>
                        </a>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
            
            <SidebarGroup>
              <SidebarGroupLabel>Usuário</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {userItems.map((item) => (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton asChild tooltip={item.title}>
                        <a href={item.path}>
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
              <SidebarMenuButton className="w-full justify-between gap-3 h-12">
                <div className="flex items-center gap-2">
                  <User className="h-5 w-5 rounded-md" />
                  <div className="flex flex-col items-start">
                    <span className="text-sm font-medium">John Doe</span>
                    <span className="text-xs text-muted-foreground">john@example.com</span>
                  </div>
                </div>
                <ChevronsUpDown className="h-5 w-5 rounded-md" />
              </SidebarMenuButton>
            </SidebarGroup>
          </SidebarFooter>
        </Sidebar>

        <main className="flex-1 min-h-svh">
          <div className="px-4 py-2">
            <SidebarTrigger className="h-4 w-4 mt-2" />
          </div>
          <div className="p-6">
            <h1 className="text-2xl font-bold">Exemplo de Sidebar</h1>
            <p className="mt-2">Esta é uma demonstração da sidebar aprimorada.</p>
          </div>
        </main>
      </div>
    </SidebarProvider>
  )
}
