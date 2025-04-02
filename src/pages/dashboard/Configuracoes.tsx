
import { useEffect } from "react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { 
  Bell, 
  Settings, 
  Shield, 
  Eye, 
  Globe, 
  PaintBucket, 
  Wallet, 
  Save,
  Loader2
} from "lucide-react";
import { useUserPreferences } from "@/hooks/useUserPreferences";

const Configuracoes = () => {
  useEffect(() => {
    document.title = "MoMoney | Configurações";
  }, []);

  const { 
    preferences, 
    setPreferences, 
    savePreferences, 
    loading, 
    saving 
  } = useUserPreferences();

  const handlePreferenceChange = (key: string, value: any) => {
    setPreferences({
      ...preferences,
      [key]: value
    });
  };

  const handleSavePreferences = async () => {
    await savePreferences(preferences);
  };

  const handleResetSettings = () => {
    // Reset to defaults
    setPreferences({
      ...preferences,
      theme: "system",
      language: "pt-BR",
      currency: "BRL",
      show_balance: true,
      date_format: "dd/MM/yyyy",
      notifications_enabled: true,
      email_notifications: true,
    });
    
    toast.info("Configurações redefinidas para o padrão");
  };

  const handleExportData = () => {
    toast.success("Seus dados serão exportados e enviados para seu email");
  };

  if (loading) {
    return (
      <DashboardLayout activePage="Configurações">
        <div className="flex items-center justify-center h-full">
          <Loader2 className="h-10 w-10 animate-spin text-momoney-600" />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout activePage="Configurações">
      <div className="grid gap-6">
        <Tabs defaultValue="preferences" className="w-full">
          <TabsList className="mb-4 bg-white dark:bg-gray-800 border dark:border-gray-700">
            <TabsTrigger value="preferences" className="flex items-center gap-2 data-[state=active]:bg-momoney-100 dark:data-[state=active]:bg-momoney-900">
              <Settings className="h-4 w-4" />
              <span>Preferências</span>
            </TabsTrigger>
            <TabsTrigger value="security" className="flex items-center gap-2 data-[state=active]:bg-momoney-100 dark:data-[state=active]:bg-momoney-900">
              <Shield className="h-4 w-4" />
              <span>Segurança</span>
            </TabsTrigger>
            <TabsTrigger value="notifications" className="flex items-center gap-2 data-[state=active]:bg-momoney-100 dark:data-[state=active]:bg-momoney-900">
              <Bell className="h-4 w-4" />
              <span>Notificações</span>
            </TabsTrigger>
          </TabsList>
          
          {/* Preferences Tab */}
          <TabsContent value="preferences">
            <div className="grid md:grid-cols-2 gap-6">
              <Card className="animate-fade-in dark-card">
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
                      value={preferences.theme} 
                      onValueChange={(value: 'light' | 'dark' | 'system') => handlePreferenceChange('theme', value)}
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
                        checked={preferences.show_balance} 
                        onCheckedChange={(value) => handlePreferenceChange('show_balance', value)} 
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="animate-fade-in dark-card">
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
                    <Select 
                      value={preferences.language} 
                      onValueChange={(value) => handlePreferenceChange('language', value)}
                    >
                      <SelectTrigger className="bg-white dark:bg-gray-800">
                        <SelectValue placeholder="Selecionar idioma" />
                      </SelectTrigger>
                      <SelectContent className="bg-white dark:bg-gray-800">
                        <SelectItem value="pt-BR">Português (Brasil)</SelectItem>
                        <SelectItem value="en-US">English (US)</SelectItem>
                        <SelectItem value="es">Español</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Moeda</Label>
                    <Select 
                      value={preferences.currency} 
                      onValueChange={(value) => handlePreferenceChange('currency', value)}
                    >
                      <SelectTrigger className="bg-white dark:bg-gray-800">
                        <SelectValue placeholder="Selecionar moeda" />
                      </SelectTrigger>
                      <SelectContent className="bg-white dark:bg-gray-800">
                        <SelectItem value="BRL">Real (R$)</SelectItem>
                        <SelectItem value="USD">Dólar ($)</SelectItem>
                        <SelectItem value="EUR">Euro (€)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Formato de data</Label>
                    <Select 
                      value={preferences.date_format} 
                      onValueChange={(value) => handlePreferenceChange('date_format', value)}
                    >
                      <SelectTrigger className="bg-white dark:bg-gray-800">
                        <SelectValue placeholder="Formato de data" />
                      </SelectTrigger>
                      <SelectContent className="bg-white dark:bg-gray-800">
                        <SelectItem value="dd/MM/yyyy">DD/MM/AAAA</SelectItem>
                        <SelectItem value="MM/dd/yyyy">MM/DD/AAAA</SelectItem>
                        <SelectItem value="yyyy-MM-dd">AAAA-MM-DD</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="md:col-span-2 animate-fade-in dark-card">
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
                        <SelectTrigger className="bg-white dark:bg-gray-800">
                          <SelectValue placeholder="Dia de fechamento" />
                        </SelectTrigger>
                        <SelectContent className="bg-white dark:bg-gray-800">
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
                        variant="default" 
                        className="w-full bg-momoney-600 hover:bg-momoney-700 text-white"
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
                className="border-gray-200 dark:border-gray-700"
              >
                Restaurar padrões
              </Button>
              <Button 
                variant="default"
                onClick={handleSavePreferences}
                className="gap-2 bg-momoney-600 hover:bg-momoney-700 text-white"
                disabled={saving}
              >
                {saving ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Save className="h-4 w-4 mr-1" />}
                {saving ? 'Salvando...' : 'Salvar preferências'}
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
                      checked={false} 
                      onCheckedChange={() => toast.info('Funcionalidade em desenvolvimento')} 
                    />
                  </div>
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
                  <Button variant="clean">Alterar senha</Button>
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
                    checked={preferences.notifications_enabled} 
                    onCheckedChange={(value) => handlePreferenceChange('notifications_enabled', value)} 
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-medium">Notificações por email</h4>
                    <p className="text-xs text-gray-500">Receba notificações por email</p>
                  </div>
                  <Switch 
                    checked={preferences.email_notifications} 
                    onCheckedChange={(value) => handlePreferenceChange('email_notifications', value)} 
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
                
                <Button 
                  variant="clean"
                  onClick={handleSavePreferences} 
                  disabled={saving}
                >
                  {saving ? 'Salvando...' : 'Salvar preferências'}
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
