
import { useEffect } from "react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormField, FormItem, FormLabel, FormControl, FormDescription } from "@/components/ui/form";
import { toast } from "sonner";

const Perfil = () => {
  useEffect(() => {
    document.title = "MoMoney | Perfil";
  }, []);

  // Dados simulados do usuário
  const user = {
    name: "Maria Silva",
    email: "maria.silva@exemplo.com",
    avatar: "",
    initials: "MS"
  };

  const handleAvatarUpload = () => {
    toast.success("Funcionalidade será implementada em breve");
  };

  const handleSaveProfile = () => {
    toast.success("Perfil atualizado com sucesso!");
  };

  return (
    <DashboardLayout activePage="Perfil">
      <div className="grid gap-6">
        <Card className="w-full animate-fade-in">
          <CardHeader>
            <CardTitle>Seu Perfil</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center sm:flex-row sm:items-start gap-8">
              <div className="flex flex-col items-center gap-4">
                <Avatar className="h-24 w-24 ring-4 ring-offset-4 ring-momoney-200">
                  {user.avatar ? (
                    <AvatarImage src={user.avatar} alt={user.name} />
                  ) : (
                    <AvatarFallback className="bg-momoney-100 text-momoney-600 text-xl">
                      {user.initials}
                    </AvatarFallback>
                  )}
                </Avatar>
                <Button variant="outline" size="sm" onClick={handleAvatarUpload}>
                  Alterar foto
                </Button>
              </div>
              
              <div className="w-full max-w-md space-y-6">
                <Form>
                  <div className="space-y-4">
                    <FormField
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Nome completo</FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="Seu nome" 
                              defaultValue={user.name}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email</FormLabel>
                          <FormControl>
                            <Input 
                              type="email" 
                              placeholder="seu@email.com" 
                              defaultValue={user.email}
                            />
                          </FormControl>
                          <FormDescription>
                            Este email será usado para login e recuperação de senha.
                          </FormDescription>
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      name="password"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Nova senha</FormLabel>
                          <FormControl>
                            <Input 
                              type="password" 
                              placeholder="••••••••" 
                            />
                          </FormControl>
                          <FormDescription>
                            Deixe em branco para manter a senha atual.
                          </FormDescription>
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      name="confirmPassword"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Confirmar nova senha</FormLabel>
                          <FormControl>
                            <Input 
                              type="password" 
                              placeholder="••••••••" 
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    
                    <div className="pt-4">
                      <Button onClick={handleSaveProfile} className="w-full sm:w-auto">
                        Salvar alterações
                      </Button>
                    </div>
                  </div>
                </Form>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default Perfil;
