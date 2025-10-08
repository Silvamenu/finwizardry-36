
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
    <Card className="w-full rounded-2xl shadow-lg bg-background-card border-white/10">
      <CardHeader className="pb-6">
        <CardTitle className="text-3xl font-bold text-center text-text-highlight">
          <span className="bg-gradient-to-r from-accent-start to-accent-end bg-clip-text text-transparent">FinWizardry</span> - Resumo do Projeto
        </CardTitle>
        <CardDescription className="text-center text-text-primary">
          Sua plataforma completa de gestão financeira pessoal
        </CardDescription>
      </CardHeader>
      
      <CardContent className="pt-0">
        <Tabs defaultValue="recursos">
          <TabsList className="grid w-full grid-cols-3 mb-10 bg-background-dark p-2 rounded-xl">
            <TabsTrigger value="recursos" className="data-[state=active]:bg-accent-start/10 data-[state=active]:text-text-highlight text-text-primary">Recursos</TabsTrigger>
            <TabsTrigger value="tecnologias" className="data-[state=active]:bg-accent-start/10 data-[state=active]:text-text-highlight text-text-primary">Tecnologias</TabsTrigger>
            <TabsTrigger value="usabilidade" className="data-[state=active]:bg-accent-start/10 data-[state=active]:text-text-highlight text-text-primary">Usabilidade</TabsTrigger>
          </TabsList>
          
          <TabsContent value="recursos" className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-background-dark rounded-xl p-8 border border-white/10">
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-lg bg-accent-start/10 text-accent-start">
                    <BarChart3 className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold mb-2 text-text-highlight">Dashboard Interativo</h3>
                    <p className="text-text-primary">
                      Visualize suas finanças em gráficos dinâmicos e interativos. Acompanhe receitas, despesas, economias e investimentos de maneira clara e objetiva.
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="bg-background-dark rounded-xl p-8 border border-white/10">
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-lg bg-accent-start/10 text-accent-start">
                    <LineChart className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold mb-2 text-text-highlight">Gestão de Investimentos</h3>
                    <p className="text-text-primary">
                      Plataforma completa para controle e análise de investimentos. Compare desempenho com benchmarks, visualize distribuição de ativos e veja relatórios detalhados.
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="bg-background-dark rounded-xl p-8 border border-white/10">
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-lg bg-accent-start/10 text-accent-start">
                    <Wallet className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold mb-2 text-text-highlight">Controle de Transações</h3>
                    <p className="text-text-primary">
                      Registre e categorize transações financeiras. Importação automática via CSV, análise de padrões de gastos e detecção de despesas recorrentes.
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="bg-background-dark rounded-xl p-8 border border-white/10">
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-lg bg-accent-start/10 text-accent-start">
                    <Target className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold mb-2 text-text-highlight">Metas Financeiras</h3>
                    <p className="text-text-primary">
                      Estabeleça metas de curto, médio e longo prazo. Acompanhe o progresso, receba lembretes e comemore conquistas financeiras.
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="bg-background-dark rounded-xl p-8 border border-white/10">
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-lg bg-accent-start/10 text-accent-start">
                    <BrainCircuit className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold mb-2 text-text-highlight">Assistente IA</h3>
                    <p className="text-text-primary">
                      Consultor financeiro digital que analisa seus hábitos, identifica oportunidades de economia e oferece recomendações personalizadas para melhorar sua saúde financeira.
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="bg-background-dark rounded-xl p-8 border border-white/10">
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-lg bg-accent-start/10 text-accent-start">
                    <MessageSquare className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold mb-2 text-text-highlight">Sistema de Mensagens</h3>
                    <p className="text-text-primary">
                      Comunique-se com outros usuários em um sistema de mensagens integrado. Compartilhe dicas de investimentos e construa uma rede de conhecimento financeiro.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="tecnologias" className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="border border-white/10 bg-background-dark rounded-xl p-6 text-center">
                <div className="bg-accent-start/10 p-4 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/a/a7/React-icon.svg/1200px-React-icon.svg.png" alt="React" className="w-10 h-10" />
                </div>
                <h3 className="font-medium mb-2 text-text-highlight">React</h3>
                <p className="text-sm text-text-primary">Frontend interativo e responsivo construído com React e TypeScript</p>
              </div>
              
              <div className="border border-white/10 bg-background-dark rounded-xl p-6 text-center">
                <div className="bg-accent-start/10 p-4 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <img src="https://www.vectorlogo.zone/logos/tailwindcss/tailwindcss-icon.svg" alt="Tailwind CSS" className="w-10 h-10" />
                </div>
                <h3 className="font-medium mb-2 text-text-highlight">Tailwind CSS</h3>
                <p className="text-sm text-text-primary">Design moderno e estilização com Tailwind CSS para interfaces elegantes</p>
              </div>
              
              <div className="border border-white/10 bg-background-dark rounded-xl p-6 text-center">
                <div className="bg-accent-start/10 p-4 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <img src="https://supabase.com/favicon/favicon-196x196.png" alt="Supabase" className="w-10 h-10" />
                </div>
                <h3 className="font-medium mb-2 text-text-highlight">Supabase</h3>
                <p className="text-sm text-text-primary">Backend com Supabase para autenticação, banco de dados e armazenamento</p>
              </div>
              
              <div className="border border-white/10 bg-background-dark rounded-xl p-6 text-center">
                <div className="bg-accent-start/10 p-4 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <img src="https://seeklogo.com/images/R/recharts-logo-253D82FB0E-seeklogo.com.png" alt="Recharts" className="w-10 h-10" />
                </div>
                <h3 className="font-medium mb-2 text-text-highlight">Recharts</h3>
                <p className="text-sm text-text-primary">Visualização de dados com Recharts para criar gráficos informativos</p>
              </div>
              
              <div className="border border-white/10 bg-background-dark rounded-xl p-6 text-center">
                <div className="bg-accent-start/10 p-4 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <img src="https://avatars.githubusercontent.com/u/75042455?s=280&v=4" alt="Radix UI" className="w-10 h-10" />
                </div>
                <h3 className="font-medium mb-2 text-text-highlight">Radix UI</h3>
                <p className="text-sm text-text-primary">Componentes acessíveis e personalizáveis com Radix UI e shadcn/ui</p>
              </div>
              
              <div className="border border-white/10 bg-background-dark rounded-xl p-6 text-center">
                <div className="bg-accent-start/10 p-4 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <img src="https://raw.githubusercontent.com/lucide-icons/lucide/main/logo/icon.svg" alt="Lucide Icons" className="w-10 h-10" />
                </div>
                <h3 className="font-medium mb-2 text-text-highlight">Lucide Icons</h3>
                <p className="text-sm text-text-primary">Ícones modernos e consistentes com Lucide para melhor experiência visual</p>
              </div>
            </div>
            
            <div className="bg-background-dark rounded-xl p-6 border border-white/10">
              <h3 className="font-semibold mb-4 flex items-center gap-2 text-text-highlight">
                <Sparkles className="h-5 w-5 text-accent-start" />
                Recursos Técnicos
              </h3>
              <div className="flex flex-wrap gap-3">
                <Badge variant="outline" className="bg-background-card border-accent-start/30 text-text-primary">Responsivo</Badge>
                <Badge variant="outline" className="bg-background-card border-accent-start/30 text-text-primary">Otimizado</Badge>
                <Badge variant="outline" className="bg-background-card border-accent-start/30 text-text-primary">TypeScript</Badge>
                <Badge variant="outline" className="bg-background-card border-accent-start/30 text-text-primary">API REST</Badge>
                <Badge variant="outline" className="bg-background-card border-accent-start/30 text-text-primary">Autenticação JWT</Badge>
                <Badge variant="outline" className="bg-background-card border-accent-start/30 text-text-primary">Upload de Imagens</Badge>
                <Badge variant="outline" className="bg-background-card border-accent-start/30 text-text-primary">Tema Claro/Escuro</Badge>
                <Badge variant="outline" className="bg-background-card border-accent-start/30 text-text-primary">Animações CSS</Badge>
                <Badge variant="outline" className="bg-background-card border-accent-start/30 text-text-primary">Componentes Reutilizáveis</Badge>
                <Badge variant="outline" className="bg-background-card border-accent-start/30 text-text-primary">React Query</Badge>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="usabilidade" className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-background-dark rounded-xl p-8 border border-white/10">
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-lg bg-accent-start/10 text-accent-start">
                    <Upload className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold mb-2 text-text-highlight">Importação de Dados</h3>
                    <p className="text-text-primary">
                      Importe dados financeiros de planilhas do Excel ou CSV. Sincronize automaticamente com seu histórico bancário para maior conveniência.
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="bg-background-dark rounded-xl p-8 border border-white/10">
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-lg bg-accent-start/10 text-accent-start">
                    <Lock className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold mb-2 text-text-highlight">Segurança e Privacidade</h3>
                    <p className="text-text-primary">
                      Seus dados financeiros são protegidos com criptografia de ponta a ponta. Autenticação segura com múltiplos fatores.
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="bg-background-dark rounded-xl p-8 border border-white/10">
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-lg bg-accent-start/10 text-accent-start">
                    <BarChartHorizontal className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold mb-2 text-text-highlight">Análise Avançada</h3>
                    <p className="text-text-primary">
                      Relatórios detalhados sobre seus gastos e investimentos. Identifique padrões, preveja tendências e tome decisões mais informadas.
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="bg-background-dark rounded-xl p-8 border border-white/10">
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-lg bg-accent-start/10 text-accent-start">
                    <UserCog className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold mb-2 text-text-highlight">Personalização</h3>
                    <p className="text-text-primary">
                      Personalize seu dashboard, categorias de gastos e metas financeiras. Adapte o aplicativo às suas necessidades específicas.
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="border border-white/10 rounded-xl overflow-hidden">
              <div className="bg-gradient-to-r from-accent-end to-accent-start p-8 text-text-highlight">
                <h3 className="text-xl font-bold mb-2">FinWizardry - Seu Parceiro Financeiro</h3>
                <p className="text-white/80">
                  Nossa missão é transformar sua relação com o dinheiro, tornando a gestão financeira acessível, intuitiva e até mesmo prazerosa. 
                  Com interfaces amigáveis e recursos poderosos, o FinWizardry é perfeito tanto para iniciantes quanto para usuários experientes em finanças pessoais.
                </p>
              </div>
              <div className="p-8 bg-background-dark">
                <h4 className="font-medium mb-4 text-text-highlight">Público-alvo:</h4>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-accent-start mt-2"></div>
                    <span className="text-text-primary">Pessoas que desejam organizar suas finanças pessoais</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-accent-start mt-2"></div>
                    <span className="text-text-primary">Investidores iniciantes e experientes</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-accent-start mt-2"></div>
                    <span className="text-text-primary">Quem busca economizar e planejar o futuro financeiro</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-accent-start mt-2"></div>
                    <span className="text-text-primary">Empreendedores gerenciando finanças pessoais e empresariais</span>
                  </li>
                </ul>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
      
      <CardFooter className="flex justify-center pt-4">
        <p className="text-sm text-text-primary text-center max-w-2xl">
          O FinWizardry é uma aplicação fullstack desenvolvida para simplificar a gestão financeira pessoal,
          oferecendo ferramentas poderosas de análise, controle de gastos, investimentos e planejamento financeiro,
          tudo em uma interface moderna, intuitiva e responsiva.
        </p>
      </CardFooter>
    </Card>
  );
}

export default ProjectSummary;
