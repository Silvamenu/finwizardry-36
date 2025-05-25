import { useEffect, useState, useRef } from "react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Bot, Send, Info, Volume2, VolumeX, Brain, Sparkles, ArrowUp, HelpCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { type Assistant, type Message, type ConversationHistory } from "@/types/assistant";
import AssistantSelect from "@/components/assistant/AssistantSelect";
import ChatMessage from "@/components/assistant/ChatMessage";
import { detectIntention } from "@/components/assistant/IntentionDetector";
import { useNavigate } from "react-router-dom";

const assistants: Assistant[] = [
  {
    id: "financial-advisor",
    name: "Consultor Financeiro",
    description: "Transformo seus sonhos financeiros em planos reais e alcançáveis",
    icon: <Sparkles className="h-6 w-6 text-purple-500" />,
    gradient: "from-purple-500/20 to-purple-600/20"
  },
  {
    id: "budget-assistant",
    name: "Organizador Financeiro",
    description: "Te ajudo a organizar suas finanças e controlar seus gastos",
    icon: <ArrowUp className="h-6 w-6 text-green-500" />,
    gradient: "from-green-500/20 to-green-600/20"
  },
  {
    id: "help-center",
    name: "Suporte MoMoney",
    description: "Tire dúvidas sobre como usar o MoMoney",
    icon: <HelpCircle className="h-6 w-6 text-blue-500" />,
    gradient: "from-blue-500/20 to-blue-600/20"
  }
];

const predefinedResponses: Record<string, string[]> = {
  "financial-advisor": [
    "Vou te ajudar a criar um plano personalizado para alcançar seus objetivos financeiros. O primeiro passo é sempre entender sua situação atual e definir metas claras e realistas.",
    "Excelente pergunta! Para investir com segurança, recomendo começar com uma reserva de emergência e depois diversificar entre renda fixa e variável conforme seu perfil de risco.",
    "O segredo para construir patrimônio está na consistência. Mesmo pequenos valores investidos mensalmente podem se transformar em grandes fortunas com o tempo e os juros compostos."
  ],
  "budget-assistant": [
    "Vou analisar seus padrões de gastos e te mostrar oportunidades de economia que você nem imaginava! Pequenos ajustes podem gerar grandes resultados.",
    "A organização financeira começa com clareza sobre onde seu dinheiro está indo. Vamos criar um sistema simples e prático para você acompanhar tudo.",
    "Que tal aplicarmos a regra 50-30-20? É um método comprovado para equilibrar necessidades, desejos e poupança de forma sustentável."
  ],
  "help-center": [
    "Estou aqui para te ajudar a aproveitar ao máximo o MoMoney! Qual funcionalidade você gostaria de conhecer melhor?",
    "O MoMoney foi criado para simplificar sua vida financeira. Posso te mostrar como usar cada ferramenta de forma eficiente.",
    "Fico feliz em ajudar! Com o MoMoney você pode organizar, planejar e acompanhar todas suas finanças em um só lugar."
  ]
};

const suggestedQuestions: Record<string, string[]> = {
  "financial-advisor": [
    "Quero ficar rico, por onde começar?",
    "Quero comprar uma casa, me ajude a planejar",
    "Como posso fazer meu dinheiro render mais?"
  ],
  "budget-assistant": [
    "Quero economizar mais dinheiro",
    "Preciso organizar meus gastos",
    "Como faço para não gastar mais do que ganho?"
  ],
  "help-center": [
    "Como adicionar minhas transações?",
    "Como definir metas financeiras?",
    "Como usar os relatórios do MoMoney?"
  ]
};

const sampleHistories: ConversationHistory[] = [
  {
    id: "hist-1",
    title: "Planejamento para casa própria",
    date: new Date(2023, 5, 15),
    assistantId: "financial-advisor",
    preview: "Estratégias para juntar dinheiro e financiar a casa dos sonhos"
  },
  {
    id: "hist-2",
    title: "Organização do orçamento familiar",
    date: new Date(2023, 6, 22),
    assistantId: "budget-assistant",
    preview: "Como organizar as finanças da família e economizar mais"
  },
  {
    id: "hist-3",
    title: "Usando o MoMoney",
    date: new Date(2023, 7, 3),
    assistantId: "help-center",
    preview: "Tutorial completo sobre as funcionalidades da plataforma"
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
      content: `Olá! Sou seu ${activeAssistant.name}. ${activeAssistant.description}. Me conte qual é seu objetivo ou sonho financeiro - não precisa ser uma pergunta, pode ser algo como "quero comprar uma casa" ou "quero ficar rico". Vou te ajudar a transformar isso em realidade!`,
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
    const userInput = input;
    setInput("");
    setIsTyping(true);
    
    setTimeout(() => {
      // Detectar intenção primeiro
      const intention = detectIntention(userInput, activeAssistant.id);
      
      let responseContent: string;
      let suggestions: string[] = [];
      
      if (intention) {
        responseContent = intention.response;
        suggestions = intention.suggestions;
      } else {
        // Resposta padrão se não detectar intenção específica
        const assistantResponses = predefinedResponses[activeAssistant.id];
        responseContent = assistantResponses[Math.floor(Math.random() * assistantResponses.length)];
      }
      
      const assistantMessage: Message = {
        id: `assistant-${Date.now()}`,
        content: responseContent,
        role: "assistant",
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, assistantMessage]);
      
      // Se há sugestões da detecção de intenção, adicionar como mensagem separada
      if (suggestions.length > 0) {
        setTimeout(() => {
          const suggestionsMessage: Message = {
            id: `suggestions-${Date.now()}`,
            content: "Algumas perguntas que podem te ajudar:",
            role: "assistant",
            timestamp: new Date(),
            suggestions: suggestions
          };
          setMessages(prev => [...prev, suggestionsMessage]);
        }, 800);
      }
      
      setIsTyping(false);

      if (audioEnabled) {
        speakMessage(responseContent);
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
      // Detectar intenção para pergunta sugerida
      const intention = detectIntention(question, activeAssistant.id);
      
      let responseContent: string;
      
      if (intention) {
        responseContent = intention.response;
      } else {
        const assistantResponses = predefinedResponses[activeAssistant.id];
        responseContent = assistantResponses[Math.floor(Math.random() * assistantResponses.length)];
      }
      
      const assistantMessage: Message = {
        id: `assistant-${Date.now()}`,
        content: responseContent,
        role: "assistant",
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, assistantMessage]);
      setIsTyping(false);

      if (audioEnabled) {
        speakMessage(responseContent);
      }
    }, 1500);
  };

  const handleFeedback = (positive: boolean) => {
    toast(positive ? "Feedback positivo enviado!" : "Feedback negativo enviado", {
      description: "Obrigado por nos ajudar a melhorar o assistente.",
      icon: positive ? <span>👍</span> : <span>👎</span>,
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
      content: `Olá! Sou seu ${activeAssistant.name}. ${activeAssistant.description}. Me conte qual é seu objetivo ou sonho financeiro - não precisa ser uma pergunta, pode ser algo como "quero comprar uma casa" ou "quero ficar rico". Vou te ajudar a transformar isso em realidade!`,
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
              <CardDescription>Seu parceiro para realizar sonhos financeiros</CardDescription>
              <div className="w-full mt-2">
                <Tabs value={activeTab} onValueChange={setActiveTab}>
                  <TabsList className="w-full grid grid-cols-2">
                    <TabsTrigger value="chat">Assistentes</TabsTrigger>
                    <TabsTrigger value="history">Conversas</TabsTrigger>
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
                                <span className="h-3 w-3 ml-auto text-gray-400">💬</span>
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
                      <p>Nossa IA entende suas intenções e oferece soluções personalizadas para seus objetivos financeiros.</p>
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
                  onSuggestionClick={handleSuggestedQuestion}
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
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">Comece me contando seu objetivo:</p>
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
                  placeholder="Digite seu objetivo ou pergunta..."
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
