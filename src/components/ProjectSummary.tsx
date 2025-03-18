
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  LineChart, 
  BarChart3, 
  PieChart, 
  Wallet, 
  Target, 
  BrainCircuit, 
  ShieldCheck, 
  UserCog, 
  MessageSquare,
  Upload,
  Lock,
  BarChartHorizontal,
  Sparkles
} from "lucide-react";
import { Badge } from "@/components/ui/badge";

export function ProjectSummary() {
  return (
    <Card className="w-full rounded-xl shadow-md">
      <CardHeader className="pb-3">
        <CardTitle className="text-2xl font-bold text-center">
          <span className="gradient-text">MoMoney</span> - Resumo do Projeto
        </CardTitle>
        <CardDescription className="text-center">
          Sua plataforma completa de gestão financeira pessoal
        </CardDescription>
      </CardHeader>
      
      <CardContent className="pt-0">
        <Tabs defaultValue="recursos">
          <TabsList className="grid w-full grid-cols-3 mb-8">
            <TabsTrigger value="recursos">Recursos</TabsTrigger>
            <TabsTrigger value="tecnologias">Tecnologias</TabsTrigger>
            <TabsTrigger value="usabilidade">Usabilidade</TabsTrigger>
          </TabsList>
          
          <TabsContent value="recursos" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-gray-50 rounded-xl p-6 border border-gray-100">
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-lg bg-blue-100 text-blue-600">
                    <BarChart3 className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Dashboard Interativo</h3>
                    <p className="text-gray-600">
                      Visualize suas finanças em gráficos dinâmicos e interativos. Acompanhe receitas, despesas, economias e investimentos de maneira clara e objetiva.
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="bg-gray-50 rounded-xl p-6 border border-gray-100">
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-lg bg-purple-100 text-purple-600">
                    <LineChart className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Gestão de Investimentos</h3>
                    <p className="text-gray-600">
                      Plataforma completa para controle e análise de investimentos. Compare desempenho com benchmarks, visualize distribuição de ativos e veja relatórios detalhados.
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="bg-gray-50 rounded-xl p-6 border border-gray-100">
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-lg bg-green-100 text-green-600">
                    <Wallet className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Controle de Transações</h3>
                    <p className="text-gray-600">
                      Registre e categorize transações financeiras. Importação automática via CSV, análise de padrões de gastos e detecção de despesas recorrentes.
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="bg-gray-50 rounded-xl p-6 border border-gray-100">
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-lg bg-amber-100 text-amber-600">
                    <Target className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Metas Financeiras</h3>
                    <p className="text-gray-600">
                      Estabeleça metas de curto, médio e longo prazo. Acompanhe o progresso, receba lembretes e comemore conquistas financeiras.
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="bg-gray-50 rounded-xl p-6 border border-gray-100">
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-lg bg-indigo-100 text-indigo-600">
                    <BrainCircuit className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Assistente IA</h3>
                    <p className="text-gray-600">
                      Consultor financeiro digital que analisa seus hábitos, identifica oportunidades de economia e oferece recomendações personalizadas para melhorar sua saúde financeira.
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="bg-gray-50 rounded-xl p-6 border border-gray-100">
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-lg bg-pink-100 text-pink-600">
                    <MessageSquare className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Sistema de Mensagens</h3>
                    <p className="text-gray-600">
                      Comunique-se com outros usuários em um sistema de mensagens integrado. Compartilhe dicas de investimentos e construa uma rede de conhecimento financeiro.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="tecnologias" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="border border-gray-100 rounded-xl p-5 text-center">
                <div className="bg-blue-50 p-4 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/a/a7/React-icon.svg/1200px-React-icon.svg.png" alt="React" className="w-10 h-10" />
                </div>
                <h3 className="font-medium mb-2">React</h3>
                <p className="text-sm text-gray-500">Frontend interativo e responsivo construído com React e TypeScript</p>
              </div>
              
              <div className="border border-gray-100 rounded-xl p-5 text-center">
                <div className="bg-teal-50 p-4 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <img src="https://www.vectorlogo.zone/logos/tailwindcss/tailwindcss-icon.svg" alt="Tailwind CSS" className="w-10 h-10" />
                </div>
                <h3 className="font-medium mb-2">Tailwind CSS</h3>
                <p className="text-sm text-gray-500">Design moderno e estilização com Tailwind CSS para interfaces elegantes</p>
              </div>
              
              <div className="border border-gray-100 rounded-xl p-5 text-center">
                <div className="bg-emerald-50 p-4 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <img src="https://supabase.com/favicon/favicon-196x196.png" alt="Supabase" className="w-10 h-10" />
                </div>
                <h3 className="font-medium mb-2">Supabase</h3>
                <p className="text-sm text-gray-500">Backend com Supabase para autenticação, banco de dados e armazenamento</p>
              </div>
              
              <div className="border border-gray-100 rounded-xl p-5 text-center">
                <div className="bg-red-50 p-4 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <img src="https://seeklogo.com/images/R/recharts-logo-253D82FB0E-seeklogo.com.png" alt="Recharts" className="w-10 h-10" />
                </div>
                <h3 className="font-medium mb-2">Recharts</h3>
                <p className="text-sm text-gray-500">Visualização de dados com Recharts para criar gráficos informativos</p>
              </div>
              
              <div className="border border-gray-100 rounded-xl p-5 text-center">
                <div className="bg-violet-50 p-4 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <img src="https://avatars.githubusercontent.com/u/75042455?s=280&v=4" alt="Radix UI" className="w-10 h-10" />
                </div>
                <h3 className="font-medium mb-2">Radix UI</h3>
                <p className="text-sm text-gray-500">Componentes acessíveis e personalizáveis com Radix UI e shadcn/ui</p>
              </div>
              
              <div className="border border-gray-100 rounded-xl p-5 text-center">
                <div className="bg-orange-50 p-4 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <img src="https://raw.githubusercontent.com/lucide-icons/lucide/main/logo/icon.svg" alt="Lucide Icons" className="w-10 h-10" />
                </div>
                <h3 className="font-medium mb-2">Lucide Icons</h3>
                <p className="text-sm text-gray-500">Ícones modernos e consistentes com Lucide para melhor experiência visual</p>
              </div>
            </div>
            
            <div className="bg-gray-50 rounded-xl p-6">
              <h3 className="font-semibold mb-3 flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-amber-500" />
                Recursos Técnicos
              </h3>
              <div className="flex flex-wrap gap-2">
                <Badge variant="outline" className="bg-white">Responsivo</Badge>
                <Badge variant="outline" className="bg-white">Otimizado</Badge>
                <Badge variant="outline" className="bg-white">TypeScript</Badge>
                <Badge variant="outline" className="bg-white">API REST</Badge>
                <Badge variant="outline" className="bg-white">Autenticação JWT</Badge>
                <Badge variant="outline" className="bg-white">Upload de Imagens</Badge>
                <Badge variant="outline" className="bg-white">Tema Claro/Escuro</Badge>
                <Badge variant="outline" className="bg-white">Animações CSS</Badge>
                <Badge variant="outline" className="bg-white">Componentes Reutilizáveis</Badge>
                <Badge variant="outline" className="bg-white">React Query</Badge>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="usabilidade" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-gray-50 rounded-xl p-6 border border-gray-100">
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-lg bg-cyan-100 text-cyan-600">
                    <Upload className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Importação de Dados</h3>
                    <p className="text-gray-600">
                      Importe dados financeiros de planilhas do Excel ou CSV. Sincronize automaticamente com seu histórico bancário para maior conveniência.
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="bg-gray-50 rounded-xl p-6 border border-gray-100">
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-lg bg-rose-100 text-rose-600">
                    <Lock className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Segurança e Privacidade</h3>
                    <p className="text-gray-600">
                      Seus dados financeiros são protegidos com criptografia de ponta a ponta. Autenticação segura com múltiplos fatores.
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="bg-gray-50 rounded-xl p-6 border border-gray-100">
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-lg bg-amber-100 text-amber-600">
                    <BarChartHorizontal className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Análise Avançada</h3>
                    <p className="text-gray-600">
                      Relatórios detalhados sobre seus gastos e investimentos. Identifique padrões, preveja tendências e tome decisões mais informadas.
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="bg-gray-50 rounded-xl p-6 border border-gray-100">
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-lg bg-violet-100 text-violet-600">
                    <UserCog className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Personalização</h3>
                    <p className="text-gray-600">
                      Personalize seu dashboard, categorias de gastos e metas financeiras. Adapte o aplicativo às suas necessidades específicas.
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="border border-gray-100 rounded-xl overflow-hidden">
              <div className="bg-gradient-to-r from-momoney-600 to-momoney-300 p-6 text-white">
                <h3 className="text-xl font-bold mb-2">MoMoney - Seu Parceiro Financeiro</h3>
                <p>
                  Nossa missão é transformar sua relação com o dinheiro, tornando a gestão financeira acessível, intuitiva e até mesmo prazerosa. 
                  Com interfaces amigáveis e recursos poderosos, o MoMoney é perfeito tanto para iniciantes quanto para usuários experientes em finanças pessoais.
                </p>
              </div>
              <div className="p-6 bg-white">
                <h4 className="font-medium mb-3">Público-alvo:</h4>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-momoney-500 mt-2"></div>
                    <span>Pessoas que desejam organizar suas finanças pessoais</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-momoney-500 mt-2"></div>
                    <span>Investidores iniciantes e experientes</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-momoney-500 mt-2"></div>
                    <span>Quem busca economizar e planejar o futuro financeiro</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-momoney-500 mt-2"></div>
                    <span>Empreendedores gerenciando finanças pessoais e empresariais</span>
                  </li>
                </ul>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
      
      <CardFooter className="flex justify-center pt-0">
        <p className="text-sm text-gray-500 text-center max-w-2xl">
          O MoMoney é uma aplicação fullstack desenvolvida para simplificar a gestão financeira pessoal,
          oferecendo ferramentas poderosas de análise, controle de gastos, investimentos e planejamento financeiro,
          tudo em uma interface moderna, intuitiva e responsiva.
        </p>
      </CardFooter>
    </Card>
  );
}

export default ProjectSummary;
