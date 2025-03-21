
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import LoginForm from "@/components/auth/LoginForm";
import SignupForm from "@/components/auth/SignupForm";

const Login = () => {
  useEffect(() => {
    document.title = "MoMoney | Login";
  }, []);

  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col items-center justify-center p-4 transition-colors duration-300">
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>
      
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold gradient-text mb-2">MoMoney</h1>
          <p className="text-gray-600 dark:text-gray-400">Gerencie suas finanças de forma inteligente</p>
        </div>

        <Card className="w-full animate-fade-in dark:bg-gray-800 dark:border-gray-700 rounded-2xl overflow-hidden shadow-lg">
          <CardHeader className="pb-2">
            <CardTitle className="text-2xl text-center dark:text-white">Bem-vindo(a) de volta</CardTitle>
            <CardDescription className="text-center dark:text-gray-400">
              Faça login ou crie uma conta para continuar
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-4">
            <Tabs defaultValue="login" className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-6 rounded-xl dark:bg-gray-700">
                <TabsTrigger 
                  value="login" 
                  className="rounded-xl dark:data-[state=active]:bg-blue-600 dark:text-gray-300 dark:data-[state=active]:text-white"
                >
                  Login
                </TabsTrigger>
                <TabsTrigger 
                  value="signup" 
                  className="rounded-xl dark:data-[state=active]:bg-blue-600 dark:text-gray-300 dark:data-[state=active]:text-white"
                >
                  Cadastro
                </TabsTrigger>
              </TabsList>
              <TabsContent value="login">
                <LoginForm />
              </TabsContent>
              <TabsContent value="signup">
                <SignupForm />
              </TabsContent>
            </Tabs>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <div className="text-center text-sm text-gray-500 dark:text-gray-400 mt-2">
              Ao continuar, você concorda com nossos{" "}
              <a href="#" className="text-momoney-600 hover:underline dark:text-momoney-400">
                Termos de Serviço
              </a>{" "}
              e{" "}
              <a href="#" className="text-momoney-600 hover:underline dark:text-momoney-400">
                Política de Privacidade
              </a>
              .
            </div>
          </CardFooter>
        </Card>

        <div className="mt-6 text-center">
          <Button 
            variant="link" 
            onClick={() => navigate("/")}
            className="dark:text-gray-300"
          >
            Voltar para página inicial
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Login;
