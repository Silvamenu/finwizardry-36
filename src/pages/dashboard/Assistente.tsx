
import { useEffect, useState, useRef } from "react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Bot, Send, Info, Volume2, VolumeX, Brain, FileText, Cpu, ThumbsUp, ThumbsDown, Clock, Sparkles, ArrowUp, HelpCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { type Assistant, type Message, type ConversationHistory } from "@/types/assistant";
import AssistantSelect from "@/components/assistant/AssistantSelect";
import ChatMessage from "@/components/assistant/ChatMessage";
import { useNavigate } from "react-router-dom";

const assistants: Assistant[] = [
  {
    id: "financial-advisor",
    name: "Consultor Financeiro",
    description: "Tire dúvidas sobre investimentos, planejamento financeiro e economia",
    icon: <Sparkles className="h-6 w-6 text-purple-500" />,
    gradient: "from-purple-500/20 to-purple-600/20"
  },
  {
    id: "budget-assistant",
    name: "Assistente de Orçamento",
    description: "Ajuda com orçamento pessoal, controle de gastos e dicas de economia",
    icon: <ArrowUp className="h-6 w-6 text-green-500" />,
    gradient: "from-green-500/20 to-green-600/20"
  },
  {
    id: "help-center",
    name: "Central de Ajuda",
    description: "Tire dúvidas sobre como usar o MoMoney e suas funcionalidades",
    icon: <HelpCircle className="h-6 w-6 text-blue-500" />,
    gradient: "from-blue-500/20 to-blue-600/20"
  },
  {
    id: "economic-analyst",
    name: "Analista Econômico",
    description: "Análise de tendências econômicas e impactos no mercado financeiro",
    icon: <Brain className="h-6 w-6 text-red-500" />,
    gradient: "from-red-500/20 to-red-600/20"
  },
  {
    id: "document-assistant",
    name: "Assistente Documental",
    description: "Ajuda com documentos financeiros, contratos e questões legais",
    icon: <FileText className="h-6 w-6 text-amber-500" />,
    gradient: "from-amber-500/20 to-amber-600/20"
  },
  {
    id: "ai-analyst",
    name: "Analista IA",
    description: "Análise aprofundada dos seus dados financeiros com inteligência artificial",
    icon: <Cpu className="h-6 w-6 text-cyan-500" />,
    gradient: "from-cyan-500/20 to-cyan-600/20"
  }
];

const predefinedResponses: Record<string, string[]> = {
  "financial-advisor": [
    "Diversificar seus investimentos é uma estratégia importante para reduzir riscos. Considere uma combinação de renda fixa, ações e fundos imobiliários de acordo com seu perfil de risco.",
    "Para começar a investir, primeiro estabeleça uma reserva de emergência com o equivalente a 6 meses de despesas. Depois, você pode explorar investimentos de maior rendimento de acordo com seus objetivos.",
    "Os investimentos em renda fixa são mais seguros, mas tendem a ter retornos menores. Já as ações oferecem potencial de ganhos maiores, mas com riscos mais elevados. O ideal é ter um portfólio equilibrado conforme seu perfil."
  ],
  "budget-assistant": [
    "Analisando seus gastos, percebi que você está gastando 35% acima da média em restaurantes. Que tal estabelecer um limite semanal para refeições fora e preparar mais refeições em casa?",
    "Uma boa estratégia para economizar é a regra 50-30-20: destine 50% da sua renda para necessidades básicas, 30% para desejos e 20% para poupança e investimentos.",
    "Identifiquei pequenas assinaturas mensais que somam R$ 156,90. Reveja serviços que você não usa com frequência para economizar esse valor todos os meses."
  ],
  "help-center": [
    "Para adicionar uma nova transação, vá até a página 'Transações' e clique no botão '+Nova Transação' no canto superior direito da tela.",
    "Você pode personalizar suas metas financeiras na seção 'Metas'. Lá você pode definir objetivos, prazos e acompanhar seu progresso.",
    "Para exportar seus relatórios financeiros, acesse a página que deseja exportar e procure pelo botão 'Exportar' geralmente localizado na parte superior da página."
  ],
  "economic-analyst": [
    "A recente decisão do Banco Central de manter a taxa Selic em 10.5% sugere uma postura cautelosa diante da inflação. Para seu portfólio, isso favorece investimentos em títulos pós-fixados e empresas com baixo endividamento.",
    "O aumento do dólar em 3.2% este mês pode indicar uma oportunidade para diversificar com ETFs internacionais, mas mantenha exposição limitada a 15-20% do seu patrimônio para gerenciar a volatilidade cambial.",
    "Com a recente aprovação da reforma tributária, setores como varejo e serviços tendem a se beneficiar no médio prazo. Considere aumentar sua exposição a estes setores nas próximas alocações."
  ],
  "document-assistant": [
    "Analisei seu contrato de financiamento imobiliário e identifiquei que você pode solicitar a portabilidade para outro banco, potencialmente economizando R$ 32.500 ao longo do contrato com taxas mais competitivas.",
    "Para sua declaração de Imposto de Renda, considere incluir os gastos com saúde que totalizaram R$ 7.800 no último ano. Isso pode aumentar sua restituição em aproximadamente R$ 1.950.",
    "Verifiquei que seu seguro de vida tem cobertura limitada para doenças graves. Recomendo revisar e possivelmente complementar com um seguro específico, especialmente considerando seu histórico familiar."
  ],
  "ai-analyst": [
    "Minha análise preditiva indica que mantendo seu padrão atual de investimentos, você atingirá sua meta de aposentadoria 3 anos antes do previsto. Considere aumentar sua contribuição mensal em R$ 300 para adiantar em mais 2 anos.",
    "Detectei um padrão sazonal em seus gastos com lazer, com picos em janeiro e julho. Planejando antecipadamente para estes períodos, você poderia economizar cerca de 22% através de reservas antecipadas e promoções fora de temporada.",
    "Baseado no seu histórico financeiro e objetivos, meu algoritmo calcula que sua alocação ideal seria: 45% em renda fixa, 30% em ações, 15% em fundos imobiliários e 10% em reserva de oportunidade. Isso otimizaria seu retorno ajustado ao risco."
  ]
};

const suggestedQuestions: Record<string, string[]> = {
  "financial-advisor": [
    "Como devo começar a investir?",
    "Qual a diferença entre renda fixa e variável?",
    "Como diversificar minha carteira de investimentos?"
  ],
  "budget-assistant": [
    "Como posso economizar mais dinheiro?",
    "Qual a melhor estratégia para organizar meu orçamento?",
    "Como identificar gastos desnecessários?"
  ],
  "help-center": [
    "Como adicionar uma nova transação?",
    "Como criar metas financeiras?",
    "Como exportar meus relatórios?"
  ],
  "economic-analyst": [
    "Como a taxa Selic afeta meus investimentos?",
    "Quais setores da economia estão mais promissores?",
    "Como proteger meu patrimônio da inflação?"
  ],
  "document-assistant": [
    "Como otimizar minha declaração de IR?",
    "Quais documentos devo guardar e por quanto tempo?",
    "Como negociar melhores condições em contratos?"
  ],
  "ai-analyst": [
    "Qual minha projeção financeira para os próximos 5 anos?",
    "Como otimizar minha alocação de ativos?",
    "Quais padrões de gasto posso melhorar?"
  ]
};

const sampleHistories: ConversationHistory[] = [
  {
    id: "hist-1",
    title: "Planejamento para aposentadoria",
    date: new Date(2023, 5, 15),
    assistantId: "financial-advisor",
    preview: "Discussão sobre estratégias para planejamento de aposentadoria e FIRE"
  },
  {
    id: "hist-2",
    title: "Revisão de gastos mensais",
    date: new Date(2023, 6, 22),
    assistantId: "budget-assistant",
    preview: "Análise detalhada de gastos recorrentes e oportunidades de economia"
  },
  {
    id: "hist-3",
    title: "Como configurar categorias",
    date: new Date(2023, 7, 3),
    assistantId: "help-center",
    preview: "Tutorial sobre configuração de categorias personalizadas"
  },
  {
    id: "hist-4",
    title: "Impacto da taxa de juros",
    date: new Date(2023, 8, 12),
    assistantId: "economic-analyst",
    preview: "Análise do impacto das variações na taxa de juros em diferentes investimentos"
  },
  {
    id: "hist-5",
    title: "Revisão de contrato imobiliário",
    date: new Date(2023, 9, 18),
    assistantId: "document-assistant",
    preview: "Análise das cláusulas contratuais e recomendações de negociação"
  }
];

const Assistente = () => {
  const navigate = useNavigate();
  
  useEffect(() => {
    document.title = "MoMoney | Assistente IA";
  }, []);

  const [activeAssistant, setActiveAssistant] = useState<Assistant>(assistants[0]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [activeTab, setActiveTab] = useState<string>("chat");
  const [conversations, setConversations] = useState<ConversationHistory[]>(sampleHistories);
  const [audioEnabled, setAudioEnabled] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    const welcomeMessage = {
      id: `welcome-${Date.now()}`,
      content: `Olá! Sou o assistente ${activeAssistant.name}. ${activeAssistant.description}. Como posso ajudar você hoje?`,
      role: "assistant" as const,
      timestamp: new Date()
    };
    
    setMessages([welcomeMessage]);
  }, [activeAssistant]);

  const handleSendMessage = () => {
    if (!input.trim()) return;
    
    const userMessage: Message = {
      id: `user-${Date.now()}`,
      content: input,
      role: "user",
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setIsTyping(true);
    
    setTimeout(() => {
      const assistantResponses = predefinedResponses[activeAssistant.id];
      const randomResponse = assistantResponses[Math.floor(Math.random() * assistantResponses.length)];
      
      const assistantMessage: Message = {
        id: `assistant-${Date.now()}`,
        content: randomResponse,
        role: "assistant",
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, assistantMessage]);
      setIsTyping(false);

      if (audioEnabled) {
        speakMessage(randomResponse);
      }
    }, 1500);
  };

  const handleSuggestedQuestion = (question: string) => {
    const userMessage: Message = {
      id: `user-${Date.now()}`,
      content: question,
      role: "user",
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setIsTyping(true);
    
    setTimeout(() => {
      const assistantResponses = predefinedResponses[activeAssistant.id];
      const randomResponse = assistantResponses[Math.floor(Math.random() * assistantResponses.length)];
      
      const assistantMessage: Message = {
        id: `assistant-${Date.now()}`,
        content: randomResponse,
        role: "assistant",
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, assistantMessage]);
      setIsTyping(false);

      if (audioEnabled) {
        speakMessage(randomResponse);
      }
    }, 1500);
  };

  const handleFeedback = (positive: boolean) => {
    toast(positive ? "Feedback positivo enviado!" : "Feedback negativo enviado", {
      description: "Obrigado por nos ajudar a melhorar o assistente.",
      icon: positive ? <ThumbsUp className="h-4 w-4" /> : <ThumbsDown className="h-4 w-4" />,
    });
  };

  const loadConversation = (conversationId: string) => {
    toast.info("Carregando conversa...", {
      description: `Conversa ${conversationId} selecionada.`
    });
    
    const conversation = conversations.find(c => c.id === conversationId);
    if (conversation) {
      const selectedAssistant = assistants.find(a => a.id === conversation.assistantId);
      if (selectedAssistant) {
        setActiveAssistant(selectedAssistant);
      }
    }
    
    setActiveTab("chat");
  };

  const createNewConversation = () => {
    const welcomeMessage = {
      id: `welcome-${Date.now()}`,
      content: `Olá! Sou o assistente ${activeAssistant.name}. ${activeAssistant.description}. Como posso ajudar você hoje?`,
      role: "assistant" as const,
      timestamp: new Date()
    };
    
    setMessages([welcomeMessage]);
    toast.success("Nova conversa iniciada!");
  };

  const speakMessage = (text: string) => {
    const speech = new SpeechSynthesisUtterance(text);
    speech.lang = 'pt-BR';
    window.speechSynthesis.speak(speech);
  };

  const toggleAudio = () => {
    setAudioEnabled(!audioEnabled);
    toast.info(
      !audioEnabled ? "Áudio ativado" : "Áudio desativado", 
      { description: !audioEnabled ? "As respostas serão lidas em voz alta." : "As respostas não serão mais lidas." }
    );
  };

  const filteredConversations = conversations.filter(convo => 
    convo.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    convo.preview.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <DashboardLayout activePage="Assistente IA">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 h-[calc(100vh-12rem)]">
        <div className="lg:col-span-1 h-auto">
          <Card className="h-full flex flex-col dark-card overflow-hidden">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center">
                <Bot className="mr-2 h-5 w-5 text-momoney-500" />
                Assistente IA
              </CardTitle>
              <CardDescription>Seu parceiro financeiro inteligente</CardDescription>
              <div className="w-full mt-2">
                <Tabs value={activeTab} onValueChange={setActiveTab}>
                  <TabsList className="w-full grid grid-cols-2">
                    <TabsTrigger value="chat">Assistentes</TabsTrigger>
                    <TabsTrigger value="history">Histórico</TabsTrigger>
                  </TabsList>
                  <TabsContent value="chat" className="space-y-4 mt-2 overflow-y-auto max-h-[calc(100vh-22rem)]">
                    <AssistantSelect
                      assistants={assistants}
                      activeAssistant={activeAssistant}
                      onSelectAssistant={setActiveAssistant}
                    />
                  </TabsContent>
                  
                  <TabsContent value="history" className="space-y-3 mt-2 overflow-y-auto max-h-[calc(100vh-22rem)]">
                    <Button 
                      variant="outline" 
                      className="w-full justify-start mb-4 bg-gradient-to-r from-momoney-500/10 to-momoney-400/10 hover:from-momoney-500/20 hover:to-momoney-400/20"
                      onClick={createNewConversation}
                    >
                      <Bot className="h-4 w-4 mr-2 text-momoney-500" />
                      Nova Conversa
                    </Button>

                    <div className="relative mb-4">
                      <Input
                        type="text"
                        placeholder="Pesquisar conversas..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-8"
                      />
                      <div className="absolute left-2.5 top-2.5">
                        <svg className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                      </div>
                    </div>
                    
                    <div className="space-y-2 overflow-y-auto pr-1">
                      {filteredConversations.length > 0 ? (
                        filteredConversations.map((convo) => (
                          <Button
                            key={convo.id}
                            variant="ghost"
                            className="w-full justify-start h-auto py-2 px-3 hover:bg-gray-100 dark:hover:bg-gray-700/50 transition-colors rounded-lg"
                            onClick={() => loadConversation(convo.id)}
                          >
                            <div className="w-full flex flex-col items-start">
                              <div className="flex items-center w-full">
                                <span className="font-medium line-clamp-1 text-sm">{convo.title}</span>
                                <Clock className="h-3 w-3 ml-auto text-gray-400" />
                              </div>
                              <p className="text-xs text-gray-500 line-clamp-1 text-left mt-1">{convo.preview}</p>
                              <div className="flex items-center w-full mt-1">
                                <span className="text-xs text-gray-500">
                                  {convo.date.toLocaleDateString()}
                                </span>
                                <Badge variant="outline" className="ml-auto text-xs bg-transparent">
                                  {assistants.find(a => a.id === convo.assistantId)?.name.split(' ')[0]}
                                </Badge>
                              </div>
                            </div>
                          </Button>
                        ))
                      ) : (
                        <div className="text-center py-4">
                          <p className="text-gray-500 dark:text-gray-400 text-sm">
                            Nenhuma conversa encontrada
                          </p>
                        </div>
                      )}
                    </div>
                  </TabsContent>
                </Tabs>
              </div>
            </CardHeader>
            
            <CardFooter className="border-t pt-4 mt-auto">
              <div className="flex space-x-2 w-full">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1"
                        onClick={toggleAudio}
                      >
                        {audioEnabled ? (
                          <Volume2 className="h-4 w-4 mr-2 text-green-500" />
                        ) : (
                          <VolumeX className="h-4 w-4 mr-2" />
                        )}
                        {audioEnabled ? "Áudio Ligado" : "Áudio Desligado"}
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>{audioEnabled ? "Desativar leitura em voz alta" : "Ativar leitura em voz alta"}</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="outline" size="sm" className="flex-1">
                        <Info className="h-4 w-4 mr-2" />
                        Sobre IA
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Nossa IA utiliza modelos avançados para analisar seus dados financeiros e fornecer recomendações personalizadas.</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            </CardFooter>
          </Card>
        </div>

        <div className="lg:col-span-3 flex flex-col h-full">
          <Card className="flex-1 flex flex-col h-full overflow-hidden relative dark-card">
            <CardHeader className="pb-3 border-b flex-shrink-0">
              <div className="flex items-center">
                <div className={`mr-2 p-2 rounded-full bg-gradient-to-r ${activeAssistant.gradient}`}>
                  {activeAssistant.icon}
                </div>
                <div>
                  <CardTitle>{activeAssistant.name}</CardTitle>
                  <CardDescription className="line-clamp-1">{activeAssistant.description}</CardDescription>
                </div>
              </div>
            </CardHeader>
            
            <CardContent className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin">
              {messages.map((message) => (
                <ChatMessage
                  key={message.id}
                  message={message}
                  assistantName={activeAssistant.name}
                  onFeedback={handleFeedback}
                />
              ))}
              
              {isTyping && (
                <div className="flex justify-start animate-fade-in">
                  <div className="bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg p-4 max-w-[80%]">
                    <div className="flex space-x-2">
                      <div className="h-2 w-2 bg-gray-400 dark:bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: "0ms" }}></div>
                      <div className="h-2 w-2 bg-gray-400 dark:bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: "300ms" }}></div>
                      <div className="h-2 w-2 bg-gray-400 dark:bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: "600ms" }}></div>
                    </div>
                  </div>
                </div>
              )}
              
              <div ref={messagesEndRef} />
            </CardContent>
            
            {messages.length <= 2 && (
              <div className="px-4 pb-4">
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">Perguntas sugeridas:</p>
                <div className="flex flex-wrap gap-2">
                  {suggestedQuestions[activeAssistant.id].map((question, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      size="sm"
                      className="text-xs line-clamp-1 max-w-full sm:max-w-[250px] bg-gradient-to-r from-white/50 to-white/30 hover:from-white/70 hover:to-white/50 dark:from-gray-700/50 dark:to-gray-800/30 dark:hover:from-gray-700/70 dark:hover:to-gray-800/50 border border-gray-200 dark:border-gray-700 transition-all"
                      onClick={() => handleSuggestedQuestion(question)}
                    >
                      {question}
                    </Button>
                  ))}
                </div>
              </div>
            )}
            
            <CardFooter className="border-t pt-4 pb-4 flex-shrink-0">
              <form
                className="flex w-full items-center space-x-2"
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSendMessage();
                }}
              >
                <Input
                  type="text"
                  placeholder="Digite sua mensagem..."
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  className="flex-1"
                />
                <Button 
                  type="submit" 
                  className="bg-gradient-to-r from-momoney-600 to-momoney-500 hover:from-momoney-700 hover:to-momoney-600 text-white"
                  disabled={!input.trim() || isTyping}
                >
                  <Send className="h-4 w-4 mr-2" />
                  Enviar
                </Button>
              </form>
            </CardFooter>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Assistente;
