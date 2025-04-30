
import { useEffect, useState, useRef, useCallback } from "react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { MessageSquare, Send, Search, Plus, User, Clock, Loader2, X } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useProfile } from "@/hooks/useProfile";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Textarea } from "@/components/ui/textarea";

interface Message {
  id: string;
  content: string;
  sender_id: string;
  receiver_id: string;
  sender_name?: string;
  sender_avatar?: string;
  created_at: string;
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

interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatar_url?: string;
}

const Mensagens = () => {
  const { user } = useAuth();
  const { profile } = useProfile();
  const [activeContact, setActiveContact] = useState<Contact | null>(null);
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [searchEmail, setSearchEmail] = useState("");
  const [searchResults, setSearchResults] = useState<UserProfile[]>([]);
  const [showAddContact, setShowAddContact] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [loadingContacts, setLoadingContacts] = useState(true);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [showContactSheet, setShowContactSheet] = useState(false);

  // Scroll to bottom of messages when new message arrives
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Set page title
  useEffect(() => {
    document.title = "MoMoney | Mensagens";
  }, []);

  // Load contacts whenever user changes
  useEffect(() => {
    if (user?.id) {
      fetchContacts();
    }
  }, [user?.id]);

  // Subscribe to new messages using Supabase realtime
  useEffect(() => {
    if (!user?.id) return;

    const channel = supabase
      .channel('messages_channel')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `receiver_id=eq.${user.id}`
        },
        async (payload) => {
          console.log('New message received:', payload);
          
          // Fetch the sender's profile to get name and avatar
          const { data: senderData } = await supabase
            .from('profiles')
            .select('name, avatar_url')
            .eq('id', payload.new.sender_id)
            .single();
            
          const newMessage = {
            ...payload.new,
            sender_name: senderData?.name || 'Unknown User',
            sender_avatar: senderData?.avatar_url
          };
          
          // If message belongs to active conversation, add it to the messages list
          if (activeContact && (activeContact.id === payload.new.sender_id)) {
            setMessages(prev => [...prev, newMessage as Message]);
            
            // Mark message as read immediately if it's from the active contact
            await supabase
              .from('messages')
              .update({ read: true })
              .eq('id', payload.new.id);
          } else {
            // Check if sender is in contacts, if not, need to refresh contacts
            if (!contacts.some(contact => contact.id === payload.new.sender_id)) {
              fetchContacts();
            } else {
              // Update unread count for this contact
              setContacts(prev => 
                prev.map(contact => {
                  if (contact.id === payload.new.sender_id) {
                    return {
                      ...contact,
                      lastMessage: payload.new.content,
                      unreadCount: contact.unreadCount + 1,
                      lastActivity: new Date()
                    };
                  }
                  return contact;
                })
              );
            }
            
            // Show notification
            toast("Nova mensagem!", {
              description: `${senderData?.name || 'Unknown User'}: ${payload.new.content.substring(0, 50)}${payload.new.content.length > 50 ? '...' : ''}`,
            });
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user?.id, activeContact, contacts]);

  // Fetch user contacts from the database
  const fetchContacts = async () => {
    if (!user?.id) return;
    
    setLoadingContacts(true);
    
    try {
      // First get all the contacts
      const { data: contactsData, error } = await supabase
        .from('contacts')
        .select('contact_id, created_at, updated_at, last_message_at')
        .eq('user_id', user.id);
        
      if (error) throw error;
      
      if (contactsData && contactsData.length > 0) {
        // Get the profile information for each contact
        const contactIds = contactsData.map(c => c.contact_id);
        const { data: profilesData, error: profilesError } = await supabase
          .from('profiles')
          .select('id, name, email, avatar_url')
          .in('id', contactIds);
          
        if (profilesError) throw profilesError;
        
        // Get unread message count for each contact
        const contactsWithDetails = await Promise.all(profilesData.map(async (profile) => {
          // Get unread count
          const { count, error: countError } = await supabase
            .from('messages')
            .select('id', { count: 'exact', head: true })
            .eq('sender_id', profile.id)
            .eq('receiver_id', user.id)
            .eq('read', false);
            
          if (countError) console.error("Error getting unread count:", countError);
          
          // Get last message between the user and this contact
          const { data: lastMessageData, error: lastMessageError } = await supabase
            .from('messages')
            .select('content, created_at')
            .or(`and(sender_id.eq.${user.id},receiver_id.eq.${profile.id}),and(sender_id.eq.${profile.id},receiver_id.eq.${user.id})`)
            .order('created_at', { ascending: false })
            .limit(1);
            
          if (lastMessageError) console.error("Error getting last message:", lastMessageError);
          
          // Find the contact data for this profile
          const contactData = contactsData.find(c => c.contact_id === profile.id);
          
          return {
            id: profile.id,
            name: profile.name || profile.email.split('@')[0],
            email: profile.email,
            avatar_url: profile.avatar_url,
            lastMessage: lastMessageData && lastMessageData[0] ? lastMessageData[0].content : undefined,
            unreadCount: count || 0,
            lastActivity: new Date(lastMessageData && lastMessageData[0] ? lastMessageData[0].created_at : contactData.last_message_at || contactData.updated_at || contactData.created_at)
          };
        }));
        
        // Sort contacts by last activity
        const sortedContacts = contactsWithDetails.sort((a, b) => 
          b.lastActivity.getTime() - a.lastActivity.getTime()
        );
        
        setContacts(sortedContacts);
      }
    } catch (error) {
      console.error("Error fetching contacts:", error);
      toast.error("Erro ao carregar contatos");
    } finally {
      setLoadingContacts(false);
    }
  };
  
  // Load messages for a selected contact
  const loadMessages = useCallback(async (contactId: string) => {
    if (!user?.id) return;
    
    setLoadingMessages(true);
    
    try {
      // Get messages between the user and the selected contact
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .or(`and(sender_id.eq.${user.id},receiver_id.eq.${contactId}),and(sender_id.eq.${contactId},receiver_id.eq.${user.id})`)
        .order('created_at', { ascending: true });
        
      if (error) throw error;
      
      // Get the contact's profile details
      const { data: contactData, error: contactError } = await supabase
        .from('profiles')
        .select('name, avatar_url')
        .eq('id', contactId)
        .single();
        
      if (contactError) throw contactError;
      
      // Format messages with sender information
      const formattedMessages = data.map(msg => ({
        ...msg,
        sender_name: msg.sender_id === user.id ? profile?.name || 'Você' : contactData.name,
        sender_avatar: msg.sender_id === user.id ? profile?.avatar_url : contactData.avatar_url
      }));
      
      setMessages(formattedMessages);
      
      // Mark unread messages as read
      const unreadMessages = data.filter(msg => 
        msg.receiver_id === user.id && !msg.read
      );
      
      if (unreadMessages.length > 0) {
        const unreadIds = unreadMessages.map(msg => msg.id);
        await supabase
          .from('messages')
          .update({ read: true })
          .in('id', unreadIds);
          
        // Update the contacts list to reflect that messages are now read
        setContacts(prev => 
          prev.map(contact => {
            if (contact.id === contactId) {
              return { ...contact, unreadCount: 0 };
            }
            return contact;
          })
        );
      }
    } catch (error) {
      console.error("Error loading messages:", error);
      toast.error("Erro ao carregar mensagens");
    } finally {
      setLoadingMessages(false);
    }
  }, [user?.id, profile]);

  // Function to handle selecting a contact
  const handleSelectContact = useCallback((contact: Contact) => {
    setActiveContact(contact);
    loadMessages(contact.id);
  }, [loadMessages]);

  // Function to send a message
  const handleSendMessage = async () => {
    if (!input.trim() || !activeContact || !user?.id) return;
    
    const newMessage = {
      sender_id: user.id,
      receiver_id: activeContact.id,
      content: input.trim(),
      read: false
    };
    
    try {
      const { data, error } = await supabase
        .from('messages')
        .insert(newMessage)
        .select()
        .single();
        
      if (error) throw error;
      
      // Add sender information to the message
      const messageWithSender = {
        ...data,
        sender_name: profile?.name || 'Você',
        sender_avatar: profile?.avatar_url
      };
      
      // Update messages list
      setMessages(prev => [...prev, messageWithSender]);
      
      // Update the contact's last activity
      const { error: updateError } = await supabase
        .from('contacts')
        .update({ 
          last_message_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .eq('user_id', user.id)
        .eq('contact_id', activeContact.id);
        
      if (updateError) console.error("Error updating contact:", updateError);
      
      // Update contacts list to show the latest message
      setContacts(prev => 
        prev.map(contact => {
          if (contact.id === activeContact.id) {
            return { 
              ...contact, 
              lastMessage: input.trim(),
              lastActivity: new Date()
            };
          }
          return contact;
        }).sort((a, b) => b.lastActivity.getTime() - a.lastActivity.getTime())
      );
      
      // Clear input
      setInput("");
    } catch (error) {
      console.error("Error sending message:", error);
      toast.error("Erro ao enviar mensagem");
    }
  };

  // Function to search for users by email
  const handleSearchUser = async () => {
    if (!searchEmail.trim() || !user?.id) return;
    
    setIsSearching(true);
    setSearchResults([]);
    
    try {
      // Search for user with this email
      const { data, error } = await supabase
        .from('profiles')
        .select('id, name, email, avatar_url')
        .ilike('email', `%${searchEmail.trim()}%`)
        .neq('id', user.id) // Don't include the current user
        .limit(5);
        
      if (error) throw error;
      
      setSearchResults(data || []);
    } catch (error) {
      console.error("Error searching user:", error);
      toast.error("Erro ao buscar usuário");
    } finally {
      setIsSearching(false);
    }
  };

  // Function to add a new contact
  const handleAddContact = async (contactId: string) => {
    if (!user?.id) return;
    
    try {
      // First check if contact already exists
      const { data: existingContact, error: checkError } = await supabase
        .from('contacts')
        .select('id')
        .eq('user_id', user.id)
        .eq('contact_id', contactId)
        .maybeSingle();
        
      if (checkError) throw checkError;
      
      if (existingContact) {
        toast.info("Contato já adicionado");
        setShowContactSheet(false);
        
        // Find and select the existing contact
        const existing = contacts.find(c => c.id === contactId);
        if (existing) {
          handleSelectContact(existing);
        } else {
          await fetchContacts();
          // Need to refetch contacts since this one wasn't in the list
        }
        return;
      }
      
      // Add new contact
      const { error } = await supabase
        .from('contacts')
        .insert({
          user_id: user.id,
          contact_id: contactId
        });
        
      if (error) throw error;
      
      // Get the contact's profile
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('id, name, email, avatar_url')
        .eq('id', contactId)
        .single();
        
      if (profileError) throw profileError;
      
      // Update the contacts list
      const newContact: Contact = {
        id: profile.id,
        name: profile.name || profile.email.split('@')[0],
        email: profile.email,
        avatar_url: profile.avatar_url,
        unreadCount: 0,
        lastActivity: new Date()
      };
      
      setContacts(prev => [newContact, ...prev]);
      setActiveContact(newContact);
      setMessages([]);
      setShowContactSheet(false);
      
      toast.success("Contato adicionado com sucesso!");
    } catch (error) {
      console.error("Error adding contact:", error);
      toast.error("Erro ao adicionar contato");
    }
  };

  // Helper function to get initials from a name
  const getInitials = (name: string = "") => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  // Format time from a date object
  const formatTime = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  // Format date in a user-friendly way
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
                  onClick={() => setShowContactSheet(true)}
                >
                  <Plus className="h-5 w-5" />
                </Button>
              </div>
              
              <div className="relative mt-2">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
                <Input 
                  placeholder="Buscar conversas" 
                  className="pl-8" 
                />
              </div>
            </CardHeader>
            
            <CardContent className="flex-1 overflow-y-auto pt-0">
              {loadingContacts ? (
                <div className="flex justify-center items-center h-full">
                  <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
                </div>
              ) : contacts.length > 0 ? (
                <div className="space-y-1">
                  {contacts.map((contact) => (
                    <div
                      key={contact.id}
                      className={`flex items-center gap-3 p-2 rounded-lg cursor-pointer ${
                        activeContact?.id === contact.id
                          ? "bg-blue-50 dark:bg-blue-900/30"
                          : "hover:bg-gray-100 dark:hover:bg-gray-700"
                      }`}
                      onClick={() => handleSelectContact(contact)}
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
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-center p-4">
                  <MessageSquare className="h-12 w-12 text-gray-300 mb-2" />
                  <h3 className="text-lg font-medium">Nenhum contato ainda</h3>
                  <p className="text-sm text-gray-500 mt-1">
                    Adicione contatos para iniciar conversas
                  </p>
                  <Button 
                    onClick={() => setShowContactSheet(true)}
                    className="mt-4"
                    variant="outline"
                    size="sm"
                  >
                    <Plus className="mr-2 h-4 w-4" /> Adicionar Contato
                  </Button>
                </div>
              )}
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
                {loadingMessages ? (
                  <div className="flex justify-center items-center h-full">
                    <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
                  </div>
                ) : messages.length > 0 ? (
                  messages.map((message) => (
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
                        <p>{message.content}</p>
                        <div className="flex justify-end mt-1">
                          <span className="text-xs opacity-70">
                            {formatTime(message.created_at)}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="h-full flex flex-col items-center justify-center text-center">
                    <MessageSquare className="h-12 w-12 text-gray-300 mb-2" />
                    <h3 className="text-lg font-medium">Nenhuma mensagem</h3>
                    <p className="text-sm text-gray-500 mt-1">
                      Envie a primeira mensagem para iniciar a conversa
                    </p>
                  </div>
                )}
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
                  <Textarea
                    placeholder="Digite sua mensagem..."
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    className="flex-1 min-h-[40px] max-h-[120px] resize-none"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        handleSendMessage();
                      }
                    }}
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
                <Button 
                  onClick={() => setShowContactSheet(true)}
                  className="mt-4"
                  variant="outline"
                >
                  <Plus className="mr-2 h-4 w-4" /> Adicionar Contato
                </Button>
              </div>
            </Card>
          )}
        </div>
      </div>

      {/* Add Contact Sheet */}
      <Sheet open={showContactSheet} onOpenChange={setShowContactSheet}>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>Adicionar Contato</SheetTitle>
            <SheetDescription>
              Busque um usuário pelo email para iniciar uma conversa.
            </SheetDescription>
          </SheetHeader>

          <div className="mt-6 space-y-6">
            <div className="space-y-2">
              <form 
                className="flex gap-2" 
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSearchUser();
                }}
              >
                <Input
                  placeholder="Buscar por email..."
                  value={searchEmail}
                  onChange={(e) => setSearchEmail(e.target.value)}
                  className="flex-1"
                />
                <Button type="submit" disabled={isSearching}>
                  {isSearching ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
                </Button>
              </form>
            </div>

            <div className="mt-4">
              {searchResults.length > 0 ? (
                <div className="space-y-2">
                  <h4 className="text-sm font-medium mb-2">Resultados da Busca</h4>
                  {searchResults.map((user) => (
                    <div 
                      key={user.id} 
                      className="flex items-center justify-between p-2 border rounded-lg"
                    >
                      <div className="flex items-center gap-2">
                        <Avatar className="h-10 w-10">
                          {user.avatar_url ? (
                            <AvatarImage src={user.avatar_url} alt={user.name || user.email} />
                          ) : (
                            <AvatarFallback className="bg-blue-100 text-blue-600">
                              {getInitials(user.name || user.email)}
                            </AvatarFallback>
                          )}
                        </Avatar>
                        <div>
                          <p className="font-medium">{user.name || user.email.split('@')[0]}</p>
                          <p className="text-xs text-gray-500">{user.email}</p>
                        </div>
                      </div>
                      <Button 
                        size="sm"
                        onClick={() => handleAddContact(user.id)}
                      >
                        Adicionar
                      </Button>
                    </div>
                  ))}
                </div>
              ) : searchEmail && !isSearching ? (
                <div className="text-center py-4">
                  <p className="text-gray-500">Nenhum usuário encontrado com este email.</p>
                </div>
              ) : null}
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </DashboardLayout>
  );
};

export default Mensagens;
