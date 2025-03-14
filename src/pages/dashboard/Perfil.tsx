
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from "@/components/ui/form";
import { toast } from "sonner";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

// Define form schema with zod
const formSchema = z.object({
  name: z.string().min(2, { message: "O nome deve ter pelo menos 2 caracteres" }),
  email: z.string().email({ message: "Email inválido" }),
  password: z.string().optional(),
  confirmPassword: z.string().optional(),
}).refine(data => {
  if (data.password && data.password !== data.confirmPassword) {
    return false;
  }
  return true;
}, {
  message: "As senhas não coincidem",
  path: ["confirmPassword"],
});

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

  // Initialize form with react-hook-form
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: user.name,
      email: user.email,
      password: "",
      confirmPassword: "",
    },
  });

  const handleAvatarUpload = () => {
    toast.success("Funcionalidade será implementada em breve");
  };

  const handleSaveProfile = (values: z.infer<typeof formSchema>) => {
    console.log("Form values:", values);
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
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(handleSaveProfile)} className="space-y-4">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Nome completo</FormLabel>
                          <FormControl>
                            <Input placeholder="Seu nome" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email</FormLabel>
                          <FormControl>
                            <Input type="email" placeholder="seu@email.com" {...field} />
                          </FormControl>
                          <FormDescription>
                            Este email será usado para login e recuperação de senha.
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Nova senha</FormLabel>
                          <FormControl>
                            <Input 
                              type="password" 
                              placeholder="••••••••" 
                              {...field}
                            />
                          </FormControl>
                          <FormDescription>
                            Deixe em branco para manter a senha atual.
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="confirmPassword"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Confirmar nova senha</FormLabel>
                          <FormControl>
                            <Input 
                              type="password" 
                              placeholder="••••••••" 
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <div className="pt-4">
                      <Button type="submit" className="w-full sm:w-auto">
                        Salvar alterações
                      </Button>
                    </div>
                  </form>
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
