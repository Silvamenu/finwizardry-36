
import { useEffect, useState, useRef } from "react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Bot, Send, Info, User, Sparkles, ArrowUp, HelpCircle, Clock, ThumbsUp, ThumbsDown, Volume2, VolumeX } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface Message {
  id: string;
  content: string;
  role: "user" | "assistant";
  timestamp: Date;
}

interface Assistant {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
}

const assistants: Assistant[] = [
  {
    id: "financial-advisor",
    name: "Consultor Financeiro",
    description: "Tire dúvidas sobre investimentos, planejamento financeiro e economia",
    icon: <Sparkles className="h-6 w-6 text-purple-500" />
  },
  {
    id: "budget-assistant",
    name: "Assistente de Orçamento",
    description: "Ajuda com orçamento pessoal, controle de gastos e dicas de economia",
    icon: <ArrowUp className="h-6 w-6 text-green-500" />
  },
  {
    id: "help-center",
    name: "Central de Ajuda",
    description: "Tire dúvidas sobre como usar o MoMoney e suas funcionalidades",
    icon: <HelpCircle className="h-6 w-6 text-blue-500" />
  }
];

// Respostas pré-definidas do assistente
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
  ]
};

// Histórico de conversas por assistente
interface ConversationHistory {
  id: string;
  title: string;
  date: Date;
  assistantId: string;
}

const sampleHistories: ConversationHistory[] = [
  {
    id: "hist-1",
    title: "Planejamento para aposentadoria",
    date: new Date(2023, 5, 15),
    assistantId: "financial-advisor"
  },
  {
    id: "hist-2",
    title: "Revisão de gastos mensais",
    date: new Date(2023, 6, 22),
    assistantId: "budget-assistant"
  },
  {
    id: "hist-3",
    title: "Como configurar categorias",
    date: new Date(2023, 7, 3),
    assistantId: "help-center"
  }
];

const Assistente = () => {
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
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Efeito para rolar para a última mensagem
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Adicionar mensagem de boas-vindas ao trocar de assistente
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
    
    // Adicionar mensagem do usuário
    const userMessage: Message = {
      id: `user-${Date.now()}`,
      content: input,
      role: "user",
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setIsTyping(true);
    
    // Simular resposta do assistente após um delay
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

      // Simular leitura em voz alta
      if (audioEnabled) {
        speakMessage(randomResponse);
      }
    }, 1500);
  };

  const handleSuggestedQuestion = (question: string) => {
    // Adicionar mensagem do usuário com a pergunta sugerida
    const userMessage: Message = {
      id: `user-${Date.now()}`,
      content: question,
      role: "user",
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setIsTyping(true);
    
    // Simular resposta do assistente após um delay
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

      // Simular leitura em voz alta
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
    // Simular carregamento de uma conversa anterior
    toast.info("Carregando conversa...", {
      description: `Conversa ${conversationId} selecionada.`
    });
    
    // Para demonstração, apenas muda o assistente baseado na conversa
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
    // Limpar mensagens e começar nova conversa
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
    // Simulação de leitura em voz alta
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
  
  return (
    <DashboardLayout activePage="Assistente IA">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 h-[calc(100vh-12rem)]">
        {/* Assistants Sidebar */}
        <div className="lg:col-span-1">
          <Card className="h-full flex flex-col">
            <CardHeader>
              <CardTitle>Assistente IA</CardTitle>
              <CardDescription>Seu parceiro financeiro inteligente</CardDescription>
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full mt-2">
                <TabsList className="w-full grid grid-cols-2">
                  <TabsTrigger value="chat">Assistentes</TabsTrigger>
                  <TabsTrigger value="history">Histórico</TabsTrigger>
                </TabsList>
              </Tabs>
            </CardHeader>
            
            <CardContent className="flex-1 overflow-y-auto">
              <TabsContent value="chat" className="space-y-4 mt-0">
                {assistants.map((assistant) => (
                  <Button
                    key={assistant.id}
                    variant={activeAssistant.id === assistant.id ? "default" : "outline"}
                    className={cn(
                      "w-full justify-start h-auto py-3",
                      activeAssistant.id === assistant.id ? "bg-momoney-500" : ""
                    )}
                    onClick={() => setActiveAssistant(assistant)}
                  >
                    <div className="mr-2">
                      {assistant.icon}
                    </div>
                    <div className="text-left">
                      <p className="font-medium">{assistant.name}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-1 mt-1">
                        {assistant.description}
                      </p>
                    </div>
                  </Button>
                ))}
              </TabsContent>
              
              <TabsContent value="history" className="space-y-3 mt-0">
                <Button 
                  variant="outline" 
                  className="w-full justify-start mb-4"
                  onClick={createNewConversation}
                >
                  <Bot className="h-4 w-4 mr-2 text-momoney-500" />
                  Nova Conversa
                </Button>
                
                {conversations.map((convo) => (
                  <Button
                    key={convo.id}
                    variant="ghost"
                    className="w-full justify-start h-auto py-2 px-3 hover:bg-gray-100"
                    onClick={() => loadConversation(convo.id)}
                  >
                    <div className="w-full flex flex-col items-start">
                      <div className="flex items-center w-full">
                        <span className="font-medium line-clamp-1 text-sm">{convo.title}</span>
                        <Clock className="h-3 w-3 ml-auto text-gray-400" />
                      </div>
                      <div className="flex items-center w-full mt-1">
                        <span className="text-xs text-gray-500">
                          {convo.date.toLocaleDateString()}
                        </span>
                        <span className="ml-auto text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">
                          {assistants.find(a => a.id === convo.assistantId)?.name.split(' ')[0]}
                        </span>
                      </div>
                    </div>
                  </Button>
                ))}
              </TabsContent>
            </CardContent>
            
            <CardFooter className="flex justify-center border-t pt-4">
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
                      <p>Informações sobre nosso assistente IA</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            </CardFooter>
          </Card>
        </div>

        {/* Chat Area */}
        <div className="lg:col-span-3 flex flex-col">
          <Card className="flex-1 flex flex-col h-full overflow-hidden relative">
            <CardHeader className="pb-3 border-b flex-shrink-0">
              <div className="flex items-center">
                <div className="mr-2">
                  {activeAssistant.icon}
                </div>
                <div>
                  <CardTitle>{activeAssistant.name}</CardTitle>
                  <CardDescription>{activeAssistant.description}</CardDescription>
                </div>
              </div>
            </CardHeader>
            
            {/* Messages Container */}
            <CardContent className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={cn(
                    "flex",
                    message.role === "user" ? "justify-end" : "justify-start"
                  )}
                >
                  <div
                    className={cn(
                      "max-w-[80%] rounded-lg p-4",
                      message.role === "user"
                        ? "bg-momoney-500 text-white"
                        : "bg-gray-100 text-gray-900"
                    )}
                  >
                    <div className="flex items-center mb-2">
                      {message.role === "assistant" ? (
                        <Avatar className="h-6 w-6 mr-2">
                          <AvatarFallback>
                            <Bot className="h-4 w-4" />
                          </AvatarFallback>
                        </Avatar>
                      ) : (
                        <Avatar className="h-6 w-6 mr-2">
                          <AvatarFallback>
                            <User className="h-4 w-4" />
                          </AvatarFallback>
                        </Avatar>
                      )}
                      <span className="text-xs">
                        {message.role === "assistant" ? activeAssistant.name : "Você"}
                      </span>
                      <span className="text-xs ml-auto flex items-center">
                        <Clock className="h-3 w-3 mr-1" />
                        {message.timestamp.toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit"
                        })}
                      </span>
                    </div>
                    <p className="text-sm">{message.content}</p>
                    
                    {message.role === "assistant" && (
                      <div className="flex justify-end mt-2 space-x-2">
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="h-6 px-2"
                          onClick={() => handleFeedback(true)}
                        >
                          <ThumbsUp className="h-3 w-3" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="h-6 px-2"
                          onClick={() => handleFeedback(false)}
                        >
                          <ThumbsDown className="h-3 w-3" />
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
              
              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-gray-100 text-gray-900 rounded-lg p-4 max-w-[80%]">
                    <div className="flex space-x-2">
                      <div className="h-2 w-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }}></div>
                      <div className="h-2 w-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }}></div>
                      <div className="h-2 w-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "600ms" }}></div>
                    </div>
                  </div>
                </div>
              )}
              
              <div ref={messagesEndRef} />
            </CardContent>
            
            {/* Suggested Questions */}
            {messages.length <= 2 && (
              <div className="px-4 pb-4">
                <p className="text-sm text-gray-500 mb-2">Perguntas sugeridas:</p>
                <div className="flex flex-wrap gap-2">
                  {suggestedQuestions[activeAssistant.id].map((question, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      size="sm"
                      className="text-xs"
                      onClick={() => handleSuggestedQuestion(question)}
                    >
                      {question}
                    </Button>
                  ))}
                </div>
              </div>
            )}
            
            {/* Input Area */}
            <CardFooter className="border-t pt-4 flex-shrink-0">
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
                  size="icon" 
                  className="bg-momoney-500 hover:bg-momoney-600"
                  disabled={!input.trim() || isTyping}
                >
                  <Send className="h-4 w-4" />
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
