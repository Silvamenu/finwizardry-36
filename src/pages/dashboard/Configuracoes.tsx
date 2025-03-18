
import { useEffect, useState } from "react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { toast } from "sonner";
import { 
  Bell, 
  Settings, 
  Shield, 
  Eye, 
  Globe, 
  PaintBucket, 
  Languages, 
  Wallet, 
  Clock,
  Save
} from "lucide-react";

const Configuracoes = () => {
  useEffect(() => {
    document.title = "MoMoney | Configurações";
  }, []);

  const [theme, setTheme] = useState("system");
  const [language, setLanguage] = useState("pt-BR");
  const [currency, setCurrency] = useState("BRL");
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [showBalance, setShowBalance] = useState(true);
  const [dateFormat, setDateFormat] = useState("dd/MM/yyyy");

  const handleSavePreferences = () => {
    toast.success("Preferências salvas com sucesso!");
  };

  const handleResetSettings = () => {
    // Reset to defaults
    setTheme("system");
    setLanguage("pt-BR");
    setCurrency("BRL");
    setNotificationsEnabled(true);
    setEmailNotifications(true);
    setTwoFactorEnabled(false);
    setShowBalance(true);
    setDateFormat("dd/MM/yyyy");
    
    toast.info("Configurações redefinidas para o padrão");
  };

  const handleExportData = () => {
    toast.success("Seus dados serão exportados e enviados para seu email");
  };

  return (
    <DashboardLayout activePage="Configurações">
      <div className="grid gap-6">
        <Tabs defaultValue="preferences" className="w-full">
          <TabsList className="mb-4">
            <TabsTrigger value="preferences" className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              <span>Preferências</span>
            </TabsTrigger>
            <TabsTrigger value="security" className="flex items-center gap-2">
              <Shield className="h-4 w-4" />
              <span>Segurança</span>
            </TabsTrigger>
            <TabsTrigger value="notifications" className="flex items-center gap-2">
              <Bell className="h-4 w-4" />
              <span>Notificações</span>
            </TabsTrigger>
          </TabsList>
          
          {/* Preferences Tab */}
          <TabsContent value="preferences">
            <div className="grid md:grid-cols-2 gap-6">
              <Card className="animate-fade-in">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <PaintBucket className="h-5 w-5" />
                    Aparência
                  </CardTitle>
                  <CardDescription>Configure como o aplicativo será exibido</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label>Tema</Label>
                    <RadioGroup 
                      value={theme} 
                      onValueChange={setTheme}
                      className="flex flex-col space-y-1"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="light" id="theme-light" />
                        <Label htmlFor="theme-light">Claro</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="dark" id="theme-dark" />
                        <Label htmlFor="theme-dark">Escuro</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="system" id="theme-system" />
                        <Label htmlFor="theme-system">Sistema</Label>
                      </div>
                    </RadioGroup>
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Mostrar saldo</Label>
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <span className="text-sm font-medium">Exibir valores</span>
                        <div className="text-xs text-muted-foreground">
                          Mostrar ou ocultar os valores monetários na interface
                        </div>
                      </div>
                      <Switch 
                        checked={showBalance} 
                        onCheckedChange={setShowBalance} 
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="animate-fade-in">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Globe className="h-5 w-5" />
                    Regionalização
                  </CardTitle>
                  <CardDescription>Configure seu idioma e moeda preferidos</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label>Idioma</Label>
                    <Select value={language} onValueChange={setLanguage}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecionar idioma" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pt-BR">Português (Brasil)</SelectItem>
                        <SelectItem value="en-US">English (US)</SelectItem>
                        <SelectItem value="es">Español</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Moeda</Label>
                    <Select value={currency} onValueChange={setCurrency}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecionar moeda" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="BRL">Real (R$)</SelectItem>
                        <SelectItem value="USD">Dólar ($)</SelectItem>
                        <SelectItem value="EUR">Euro (€)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Formato de data</Label>
                    <Select value={dateFormat} onValueChange={setDateFormat}>
                      <SelectTrigger>
                        <SelectValue placeholder="Formato de data" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="dd/MM/yyyy">DD/MM/AAAA</SelectItem>
                        <SelectItem value="MM/dd/yyyy">MM/DD/AAAA</SelectItem>
                        <SelectItem value="yyyy-MM-dd">AAAA-MM-DD</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="md:col-span-2 animate-fade-in">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Wallet className="h-5 w-5" />
                    Dados Financeiros
                  </CardTitle>
                  <CardDescription>Gerencie seus dados e exportações</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Dia de fechamento do mês</Label>
                      <Select defaultValue="1">
                        <SelectTrigger>
                          <SelectValue placeholder="Dia de fechamento" />
                        </SelectTrigger>
                        <SelectContent>
                          {Array.from({ length: 28 }, (_, i) => (
                            <SelectItem key={i + 1} value={(i + 1).toString()}>
                              Dia {i + 1}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <p className="text-xs text-muted-foreground">
                        Dia em que seu mês financeiro encerra para análises e relatórios
                      </p>
                    </div>
                    
                    <div className="space-y-2">
                      <Label>Exportar dados</Label>
                      <Button 
                        variant="outline" 
                        className="w-full"
                        onClick={handleExportData}
                      >
                        Exportar todos os dados
                      </Button>
                      <p className="text-xs text-muted-foreground">
                        Exporta todos os seus dados financeiros em formato CSV
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <div className="mt-6 flex justify-between">
              <Button 
                variant="outline" 
                onClick={handleResetSettings}
              >
                Restaurar padrões
              </Button>
              <Button 
                onClick={handleSavePreferences}
                className="gap-2"
              >
                <Save className="h-4 w-4" />
                Salvar preferências
              </Button>
            </div>
          </TabsContent>
          
          {/* Security Tab */}
          <TabsContent value="security">
            <Card className="animate-fade-in">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  Segurança da conta
                </CardTitle>
                <CardDescription>Configure as opções de segurança da sua conta</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <span className="text-sm font-medium">Autenticação de dois fatores</span>
                      <div className="text-xs text-muted-foreground">
                        Adicione uma camada extra de segurança à sua conta
                      </div>
                    </div>
                    <Switch 
                      checked={twoFactorEnabled} 
                      onCheckedChange={setTwoFactorEnabled} 
                    />
                  </div>
                  
                  {twoFactorEnabled && (
                    <div className="border rounded-lg p-4 space-y-4">
                      <h4 className="text-sm font-medium">Configurar autenticação de dois fatores</h4>
                      <p className="text-sm text-gray-500">
                        Para configurar a autenticação de dois fatores, você precisa escanear o código QR abaixo com um aplicativo autenticador como Google Authenticator ou Authy.
                      </p>
                      <div className="bg-gray-100 dark:bg-gray-800 h-40 w-40 mx-auto flex items-center justify-center">
                        <p className="text-xs text-gray-500">Código QR (simulação)</p>
                      </div>
                      <div className="space-y-2">
                        <Label>Código de verificação</Label>
                        <Input placeholder="Digite o código do aplicativo autenticador" maxLength={6} />
                        <Button size="sm" className="w-full">Verificar e ativar</Button>
                      </div>
                    </div>
                  )}
                </div>
                
                <div className="space-y-4">
                  <h4 className="text-sm font-medium">Alterar senha</h4>
                  <div className="space-y-2">
                    <Label>Senha atual</Label>
                    <Input type="password" placeholder="Digite sua senha atual" />
                  </div>
                  <div className="space-y-2">
                    <Label>Nova senha</Label>
                    <Input type="password" placeholder="Digite sua nova senha" />
                  </div>
                  <div className="space-y-2">
                    <Label>Confirmar nova senha</Label>
                    <Input type="password" placeholder="Confirme sua nova senha" />
                  </div>
                  <Button>Alterar senha</Button>
                </div>
                
                <div className="space-y-4">
                  <h4 className="text-sm font-medium">Sessões ativas</h4>
                  <div className="border rounded-lg p-4 space-y-2">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium">Navegador Chrome - Windows</p>
                        <p className="text-xs text-gray-500">Ativo agora • São Paulo, Brasil</p>
                      </div>
                      <Badge>Atual</Badge>
                    </div>
                  </div>
                  <div className="border rounded-lg p-4 space-y-2">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium">App Mobile - Android</p>
                        <p className="text-xs text-gray-500">Ativo há 2 horas • São Paulo, Brasil</p>
                      </div>
                      <Button variant="outline" size="sm">Encerrar</Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Notifications Tab */}
          <TabsContent value="notifications">
            <Card className="animate-fade-in">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bell className="h-5 w-5" />
                  Notificações
                </CardTitle>
                <CardDescription>Gerencie como e quando você recebe notificações</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-medium">Notificações no aplicativo</h4>
                    <p className="text-xs text-gray-500">Receba notificações no aplicativo</p>
                  </div>
                  <Switch 
                    checked={notificationsEnabled} 
                    onCheckedChange={setNotificationsEnabled} 
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-medium">Notificações por email</h4>
                    <p className="text-xs text-gray-500">Receba notificações por email</p>
                  </div>
                  <Switch 
                    checked={emailNotifications} 
                    onCheckedChange={setEmailNotifications} 
                  />
                </div>
                
                <div className="space-y-4">
                  <h4 className="text-sm font-medium">Tipos de notificação</h4>
                  
                  <div className="border rounded-lg p-4 space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h5 className="text-sm font-medium">Relatórios semanais</h5>
                        <p className="text-xs text-gray-500">Resumo semanal das suas finanças</p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <h5 className="text-sm font-medium">Alertas de orçamento</h5>
                        <p className="text-xs text-gray-500">Quando você ultrapassar um limite de orçamento</p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <h5 className="text-sm font-medium">Contas a pagar</h5>
                        <p className="text-xs text-gray-500">Lembretes de contas próximas do vencimento</p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <h5 className="text-sm font-medium">Dicas de economia</h5>
                        <p className="text-xs text-gray-500">Dicas personalizadas para economizar</p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <h5 className="text-sm font-medium">Novas funcionalidades</h5>
                        <p className="text-xs text-gray-500">Atualizações e novos recursos do MoMoney</p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                  </div>
                </div>
                
                <Button onClick={() => toast.success("Preferências de notificação salvas!")}>
                  Salvar preferências
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default Configuracoes;
