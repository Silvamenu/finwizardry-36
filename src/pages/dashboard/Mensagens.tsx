
import { useEffect, useState, useRef } from "react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MessageSquare, Send, Search, Plus, User, Clock } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useProfile } from "@/hooks/useProfile";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

interface Message {
  id: string;
  content: string;
  sender_id: string;
  receiver_id: string;
  sender_name: string;
  sender_avatar?: string;
  timestamp: Date;
  read: boolean;
}

interface Contact {
  id: string;
  name: string;
  email: string;
  avatar_url?: string;
  lastMessage?: string;
  unreadCount: number;
  lastActivity: Date;
}

const Mensagens = () => {
  const { user } = useAuth();
  const { profile } = useProfile();
  const [activeContact, setActiveContact] = useState<Contact | null>(null);
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [newContactEmail, setNewContactEmail] = useState("");
  const [showAddContact, setShowAddContact] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    document.title = "MoMoney | Mensagens";
    
    // Fetch contacts (mock data for now)
    const mockContacts: Contact[] = [
      {
        id: "contact1",
        name: "João Silva",
        email: "joao@example.com",
        avatar_url: "",
        lastMessage: "Como está o orçamento?",
        unreadCount: 2,
        lastActivity: new Date(2023, 6, 15, 14, 23)
      },
      {
        id: "contact2",
        name: "Maria Oliveira",
        email: "maria@example.com",
        avatar_url: "",
        lastMessage: "Vamos definir metas de investimento",
        unreadCount: 0,
        lastActivity: new Date(2023, 6, 14, 9, 45)
      },
      {
        id: "contact3",
        name: "Pedro Santos",
        email: "pedro@example.com",
        avatar_url: "",
        lastMessage: "Precisamos revisar as transações",
        unreadCount: 1,
        lastActivity: new Date(2023, 6, 13, 19, 10)
      }
    ];
    
    setContacts(mockContacts);
  }, []);

  // Effect to scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Load messages when contact selected
  useEffect(() => {
    if (activeContact) {
      // Mock messages for demo
      const mockMessages: Message[] = [
        {
          id: "msg1",
          content: "Olá, como posso te ajudar com suas finanças?",
          sender_id: activeContact.id,
          receiver_id: user?.id || "",
          sender_name: activeContact.name,
          sender_avatar: activeContact.avatar_url,
          timestamp: new Date(2023, 6, 15, 14, 20),
          read: true
        },
        {
          id: "msg2",
          content: "Estou querendo organizar melhor meu orçamento mensal",
          sender_id: user?.id || "",
          receiver_id: activeContact.id,
          sender_name: profile?.name || "Você",
          sender_avatar: profile?.avatar_url,
          timestamp: new Date(2023, 6, 15, 14, 22),
          read: true
        },
        {
          id: "msg3",
          content: "Claro! Que tal começarmos definindo categorias de gastos?",
          sender_id: activeContact.id,
          receiver_id: user?.id || "",
          sender_name: activeContact.name,
          sender_avatar: activeContact.avatar_url,
          timestamp: new Date(2023, 6, 15, 14, 23),
          read: false
        }
      ];
      
      setMessages(mockMessages);
      
      // Mark messages as read
      const updatedContacts = contacts.map(contact => {
        if (contact.id === activeContact.id) {
          return { ...contact, unreadCount: 0 };
        }
        return contact;
      });
      
      setContacts(updatedContacts);
    }
  }, [activeContact, user?.id, profile, contacts]);

  const handleSendMessage = () => {
    if (!input.trim() || !activeContact) return;
    
    const newMessage: Message = {
      id: `msg-${Date.now()}`,
      content: input,
      sender_id: user?.id || "",
      receiver_id: activeContact.id,
      sender_name: profile?.name || "Você",
      sender_avatar: profile?.avatar_url,
      timestamp: new Date(),
      read: false
    };
    
    setMessages([...messages, newMessage]);
    setInput("");
    
    // In a real app, you would send to Supabase here
    // supabase.from('messages').insert([newMessage])
  };

  const handleAddContact = () => {
    if (!newContactEmail.trim()) return;
    
    // In a real app, you would check if the email exists in the database
    // For now, just simulate adding a new contact
    
    const newContact: Contact = {
      id: `contact-${Date.now()}`,
      name: newContactEmail.split('@')[0],
      email: newContactEmail,
      avatar_url: "",
      unreadCount: 0,
      lastActivity: new Date()
    };
    
    setContacts([newContact, ...contacts]);
    setNewContactEmail("");
    setShowAddContact(false);
    
    toast.success("Contato adicionado com sucesso!");
  };

  const getInitials = (name: string = "") => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const formatDate = (date: Date) => {
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    if (date.toDateString() === today.toDateString()) {
      return "Hoje";
    } else if (date.toDateString() === yesterday.toDateString()) {
      return "Ontem";
    } else {
      return date.toLocaleDateString();
    }
  };

  return (
    <DashboardLayout activePage="Mensagens">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 h-[calc(100vh-12rem)]">
        {/* Contacts Sidebar */}
        <div className="md:col-span-1">
          <Card className="h-full flex flex-col">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">Mensagens</CardTitle>
                <Button 
                  variant="ghost" 
                  size="icon"
                  onClick={() => setShowAddContact(!showAddContact)}
                >
                  <Plus className="h-5 w-5" />
                </Button>
              </div>
              {showAddContact && (
                <div className="mt-2 space-y-2">
                  <Input
                    placeholder="Email do contato"
                    value={newContactEmail}
                    onChange={(e) => setNewContactEmail(e.target.value)}
                  />
                  <div className="flex gap-2">
                    <Button 
                      size="sm" 
                      className="w-full"
                      onClick={handleAddContact}
                    >
                      Adicionar
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="w-full"
                      onClick={() => setShowAddContact(false)}
                    >
                      Cancelar
                    </Button>
                  </div>
                </div>
              )}
              <div className="relative mt-2">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
                <Input placeholder="Buscar contatos" className="pl-8" />
              </div>
            </CardHeader>
            
            <CardContent className="flex-1 overflow-y-auto pt-0">
              <div className="space-y-1">
                {contacts.map((contact) => (
                  <div
                    key={contact.id}
                    className={`flex items-center gap-3 p-2 rounded-lg cursor-pointer ${
                      activeContact?.id === contact.id
                        ? "bg-blue-50 dark:bg-blue-900/30"
                        : "hover:bg-gray-100 dark:hover:bg-gray-700"
                    }`}
                    onClick={() => setActiveContact(contact)}
                  >
                    <Avatar className="h-10 w-10">
                      {contact.avatar_url ? (
                        <AvatarImage src={contact.avatar_url} alt={contact.name} />
                      ) : (
                        <AvatarFallback className="bg-blue-100 text-blue-600">
                          {getInitials(contact.name)}
                        </AvatarFallback>
                      )}
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className="font-medium truncate">{contact.name}</span>
                        <span className="text-xs text-gray-500">
                          {formatDate(contact.lastActivity)}
                        </span>
                      </div>
                      {contact.lastMessage && (
                        <p className="text-sm text-gray-500 truncate">
                          {contact.lastMessage}
                        </p>
                      )}
                    </div>
                    {contact.unreadCount > 0 && (
                      <Badge className="ml-auto bg-blue-500">{contact.unreadCount}</Badge>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Chat Area */}
        <div className="md:col-span-3">
          {activeContact ? (
            <Card className="h-full flex flex-col">
              <CardHeader className="pb-3 border-b">
                <div className="flex items-center">
                  <Avatar className="h-9 w-9 mr-2">
                    {activeContact.avatar_url ? (
                      <AvatarImage src={activeContact.avatar_url} alt={activeContact.name} />
                    ) : (
                      <AvatarFallback className="bg-blue-100 text-blue-600">
                        {getInitials(activeContact.name)}
                      </AvatarFallback>
                    )}
                  </Avatar>
                  <div>
                    <CardTitle className="text-base">{activeContact.name}</CardTitle>
                    <CardDescription className="text-xs">{activeContact.email}</CardDescription>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${
                      message.sender_id === user?.id ? "justify-end" : "justify-start"
                    }`}
                  >
                    <div
                      className={`max-w-[75%] rounded-lg p-3 ${
                        message.sender_id === user?.id
                          ? "bg-blue-500 text-white"
                          : "bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs">
                          {message.sender_id === user?.id ? "Você" : message.sender_name}
                        </span>
                        <span className="text-xs">
                          {formatTime(message.timestamp)}
                        </span>
                      </div>
                      <p>{message.content}</p>
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </CardContent>
              
              <CardFooter className="border-t p-3">
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
                  <Button type="submit" size="icon">
                    <Send className="h-4 w-4" />
                  </Button>
                </form>
              </CardFooter>
            </Card>
          ) : (
            <Card className="h-full flex flex-col items-center justify-center">
              <div className="text-center p-8">
                <MessageSquare className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                <h3 className="text-lg font-medium">Nenhuma conversa selecionada</h3>
                <p className="text-sm text-gray-500 mt-1">
                  Selecione um contato para começar a conversar
                </p>
              </div>
            </Card>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Mensagens;
