import { useEffect, useState, useRef } from "react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { type Assistant, type Message } from "@/types/assistant";
import ChatMessage from "@/components/assistant/ChatMessage";
import { supabase } from "@/integrations/supabase/client";

const defaultAssistant: Assistant = {
  id: "financial-advisor",
  name: "Assistente Financeiro MoMoney",
  description: "Seu parceiro para realizar sonhos financeiros",
  icon: <Sparkles className="h-6 w-6 text-purple-500" />,
  gradient: "from-purple-500/20 to-purple-600/20"
};

const suggestedQuestions = [
  "Quero ficar rico, por onde começar?",
  "Quero comprar uma casa, me ajude a planejar",
  "Como posso fazer meu dinheiro render mais?",
  "Preciso organizar meus gastos",
  "Como definir metas financeiras?"
];

const Assistente = () => {
  
  useEffect(() => {
    document.title = "MoMoney | Assistente IA";
  }, []);

  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    const welcomeMessage = {
      id: `welcome-${Date.now()}`,
      content: `Olá! Sou seu ${defaultAssistant.name}. ${defaultAssistant.description}. Me conte qual é seu objetivo ou sonho financeiro - não precisa ser uma pergunta, pode ser algo como "quero comprar uma casa" ou "quero ficar rico". Vou te ajudar a transformar isso em realidade!`,
      role: "assistant" as const,
      timestamp: new Date()
    };
    
    setMessages([welcomeMessage]);
  }, []);

  const handleSendMessage = async () => {
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
    
    try {
      // Chamar a Edge Function assistente-geral
      const { data, error } = await supabase.functions.invoke('assistente-geral', {
        body: { question: userInput }
      });

      if (error) {
        console.error('Error calling assistente-geral:', error);
        throw error;
      }

      const assistantMessage: Message = {
        id: `assistant-${Date.now()}`,
        content: data.answer || 'Desculpe, não consegui gerar uma resposta.',
        role: "assistant",
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Error in handleSendMessage:', error);
      
      const errorMessage: Message = {
        id: `error-${Date.now()}`,
        content: 'Desculpe, ocorreu um erro ao processar sua pergunta. Por favor, tente novamente.',
        role: "assistant",
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, errorMessage]);
      
      toast.error("Erro ao processar pergunta", {
        description: "Não foi possível obter uma resposta. Verifique sua conexão e tente novamente."
      });
    } finally {
      setIsTyping(false);
    }
  };

  const handleSuggestedQuestion = async (question: string) => {
    const userMessage: Message = {
      id: `user-${Date.now()}`,
      content: question,
      role: "user",
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setIsTyping(true);
    
    try {
      // Chamar a Edge Function assistente-geral
      const { data, error } = await supabase.functions.invoke('assistente-geral', {
        body: { question }
      });

      if (error) {
        console.error('Error calling assistente-geral:', error);
        throw error;
      }

      const assistantMessage: Message = {
        id: `assistant-${Date.now()}`,
        content: data.answer || 'Desculpe, não consegui gerar uma resposta.',
        role: "assistant",
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Error in handleSuggestedQuestion:', error);
      
      const errorMessage: Message = {
        id: `error-${Date.now()}`,
        content: 'Desculpe, ocorreu um erro ao processar sua pergunta. Por favor, tente novamente.',
        role: "assistant",
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, errorMessage]);
      
      toast.error("Erro ao processar pergunta", {
        description: "Não foi possível obter uma resposta."
      });
    } finally {
      setIsTyping(false);
    }
  };

  const handleFeedback = (positive: boolean) => {
    toast(positive ? "Feedback positivo enviado!" : "Feedback negativo enviado", {
      description: "Obrigado por nos ajudar a melhorar o assistente.",
      icon: positive ? <span>👍</span> : <span>👎</span>,
    });
  };


  return (
    <DashboardLayout activePage="Assistente IA">
      <div className="flex flex-col h-[calc(100vh-8rem)] w-full">
        <Card className="flex-1 flex flex-col h-full overflow-hidden">
          <CardHeader className="pb-3 border-b flex-shrink-0">
            <div className="flex items-center">
              <div className={`mr-2 p-2 rounded-full bg-gradient-to-r ${defaultAssistant.gradient}`}>
                {defaultAssistant.icon}
              </div>
              <div>
                <CardTitle>{defaultAssistant.name}</CardTitle>
                <CardDescription className="line-clamp-1">{defaultAssistant.description}</CardDescription>
              </div>
            </div>
          </CardHeader>
          
          <CardContent className="flex-1 overflow-y-auto p-6 space-y-4">
            {messages.map((message) => (
            <ChatMessage
                key={message.id}
                message={message}
                assistantName={defaultAssistant.name}
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
            <div className="px-6 pb-4">
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">Comece me contando seu objetivo:</p>
              <div className="flex flex-wrap gap-2">
                {suggestedQuestions.map((question, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    size="sm"
                    className="text-xs bg-gradient-to-r from-white/50 to-white/30 hover:from-white/70 hover:to-white/50 dark:from-gray-700/50 dark:to-gray-800/30 dark:hover:from-gray-700/70 dark:hover:to-gray-800/50 border border-gray-200 dark:border-gray-700 transition-all"
                    onClick={() => handleSuggestedQuestion(question)}
                  >
                    {question}
                  </Button>
                ))}
              </div>
            </div>
          )}
          
          <CardFooter className="border-t pt-4 pb-4 px-6 flex-shrink-0 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
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
                size="icon"
                className="bg-gradient-to-r from-momoney-600 to-momoney-500 hover:from-momoney-700 hover:to-momoney-600 text-white"
                disabled={!input.trim() || isTyping}
              >
                <Send className="h-4 w-4" />
              </Button>
            </form>
          </CardFooter>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default Assistente;
