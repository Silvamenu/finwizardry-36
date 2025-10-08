
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import LoginForm from "@/components/auth/LoginForm";
import SignupForm from "@/components/auth/SignupForm";
import Logo from "@/components/Logo";

const Login = () => {
  useEffect(() => {
    document.title = "MoMoney | Login";
  }, []);

  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("login");

  const switchToLoginTab = () => {
    setActiveTab("login");
  };

  return (
    <div className="min-h-screen bg-[hsl(var(--background))] flex flex-col items-center justify-center p-6 transition-colors duration-300">
      <div className="absolute top-6 right-6">
        <ThemeToggle />
      </div>
      
      <div className="w-full max-w-md">
        <div className="text-center mb-10">
          <div className="flex items-center justify-center mb-4">
            <Logo className="w-14 h-14" textSize="text-4xl" />
          </div>
          <p className="text-[hsl(var(--muted-foreground))] text-lg">Gerencie suas finanças de forma inteligente</p>
        </div>

        <Card className="w-full animate-fade-in bg-[hsl(var(--card))] border-[hsl(var(--border))] rounded-2xl overflow-hidden shadow-xl">
          <CardHeader className="pb-3 pt-8">
            <CardTitle className="text-2xl text-center text-[hsl(var(--card-foreground))]">Bem-vindo(a) de volta</CardTitle>
            <CardDescription className="text-center text-[hsl(var(--muted-foreground))]">
              Faça login ou crie uma conta para continuar
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6 px-8 pb-8">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-8 rounded-xl bg-[hsl(var(--muted))]">
                <TabsTrigger 
                  value="login" 
                  className="rounded-xl data-[state=active]:bg-[hsl(var(--primary))] text-[hsl(var(--muted-foreground))] data-[state=active]:text-white"
                >
                  Login
                </TabsTrigger>
                <TabsTrigger 
                  value="signup" 
                  className="rounded-xl data-[state=active]:bg-[hsl(var(--primary))] text-[hsl(var(--muted-foreground))] data-[state=active]:text-white"
                >
                  Cadastro
                </TabsTrigger>
              </TabsList>
              <TabsContent value="login">
                <LoginForm />
              </TabsContent>
              <TabsContent value="signup">
                <SignupForm onSuccess={switchToLoginTab} />
              </TabsContent>
            </Tabs>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4 pb-8">
            <div className="text-center text-sm text-[hsl(var(--muted-foreground))] mt-2 leading-relaxed">
              Ao continuar, você concorda com nossos{" "}
              <a href="#" className="text-[hsl(var(--accent))] hover:underline">
                Termos de Serviço
              </a>{" "}
              e{" "}
              <a href="#" className="text-[hsl(var(--accent))] hover:underline">
                Política de Privacidade
              </a>
              .
            </div>
          </CardFooter>
        </Card>

        <div className="mt-8 text-center">
          <Button 
            variant="link" 
            onClick={() => navigate("/")}
            className="text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--accent))]"
          >
            Voltar para página inicial
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Login;
