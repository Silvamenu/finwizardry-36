
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

export interface Message {
  id: string;
  content: string;
  sender_id: string;
  receiver_id: string;
  created_at: string;
  read: boolean;
  sender_name?: string;
  sender_avatar?: string;
}

export interface Contact {
  id: string;
  name: string;
  email: string;
  avatar_url?: string;
  lastMessage?: string;
  unreadCount: number;
  lastActivity: Date;
}

export function useMessaging() {
  const { user } = useAuth();
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [activeContact, setActiveContact] = useState<Contact | null>(null);
  const [isLoadingContacts, setIsLoadingContacts] = useState(false);
  const [isLoadingMessages, setIsLoadingMessages] = useState(false);

  // Fetch user contacts from database
  const fetchContacts = async () => {
    if (!user?.id) return;
    
    setIsLoadingContacts(true);
    
    try {
      // First get all the contacts
      const { data: contactsData, error } = await supabase
        .from('profiles')
        .select('id, name, email, avatar_url')
        .neq('id', user.id);
        
      if (error) throw error;
      
      if (contactsData && contactsData.length > 0) {
        // Create contacts from profiles
        const contactsWithDetails = await Promise.all(contactsData.map(async (profile) => {
          // Get unread count
          const { count, error: countError } = await supabase
            .from('transactions') // Using transactions as a placeholder for message count
            .select('id', { count: 'exact', head: true })
            .eq('user_id', profile.id)
            .eq('category_id', user.id);
            
          if (countError) console.error("Error getting unread count:", countError);
          
          // Create contact entry
          return {
            id: profile.id,
            name: profile.name || profile.email.split('@')[0],
            email: profile.email,
            avatar_url: profile.avatar_url,
            lastMessage: "No messages yet", // Placeholder for last message
            unreadCount: count || 0,
            lastActivity: new Date() // Placeholder for last activity
          };
        }));
        
        setContacts(contactsWithDetails);
      } else {
        setContacts([]);
      }
    } catch (error) {
      console.error("Error fetching contacts:", error);
      toast.error("Erro ao carregar contatos");
    } finally {
      setIsLoadingContacts(false);
    }
  };
  
  // Load messages for a selected contact
  const loadMessages = async (contactId: string) => {
    if (!user?.id) return;
    
    setIsLoadingMessages(true);
    
    try {
      // Simulation of loading messages - in a real app, we would fetch from a messages table
      const simulatedMessages = [
        {
          id: '1',
          content: 'Olá, como posso ajudar com suas finanças hoje?',
          sender_id: contactId,
          receiver_id: user.id,
          created_at: new Date(Date.now() - 86400000).toISOString(), // yesterday
          read: true
        },
        {
          id: '2',
          content: 'Estou procurando dicas para economizar dinheiro.',
          sender_id: user.id,
          receiver_id: contactId,
          created_at: new Date(Date.now() - 85400000).toISOString(),
          read: true
        },
        {
          id: '3',
          content: 'Claro! Uma boa estratégia é a regra 50-30-20: 50% para necessidades, 30% para desejos e 20% para economia e investimentos.',
          sender_id: contactId,
          receiver_id: user.id,
          created_at: new Date(Date.now() - 84400000).toISOString(),
          read: true
        }
      ];
      
      // Get the contact's profile details
      const { data: contactData, error: contactError } = await supabase
        .from('profiles')
        .select('name, avatar_url')
        .eq('id', contactId)
        .single();
        
      if (contactError) throw contactError;
      
      // Get the user's profile details
      const { data: userData, error: userError } = await supabase
        .from('profiles')
        .select('name, avatar_url')
        .eq('id', user.id)
        .single();
        
      if (userError) throw userError;
      
      // Format messages with sender information
      const formattedMessages = simulatedMessages.map(msg => ({
        ...msg,
        sender_name: msg.sender_id === user.id ? userData?.name || 'Você' : contactData.name || 'Usuário',
        sender_avatar: msg.sender_id === user.id ? userData?.avatar_url : contactData.avatar_url
      }));
      
      setMessages(formattedMessages);
      
    } catch (error) {
      console.error("Error loading messages:", error);
      toast.error("Erro ao carregar mensagens");
    } finally {
      setIsLoadingMessages(false);
    }
  };
  
  // Select a contact and load messages
  const selectContact = (contact: Contact) => {
    setActiveContact(contact);
    loadMessages(contact.id);
  };
  
  // Send message to a contact
  const sendMessage = async (content: string) => {
    if (!content.trim() || !activeContact || !user?.id) return false;
    
    try {
      // In a real app, we would insert the message into a messages table
      // For now, we'll simulate adding a message to the UI
      
      // Get the user's profile for sender info
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('name, avatar_url')
        .eq('id', user.id)
        .single();
        
      if (profileError) throw profileError;
      
      const newMessage: Message = {
        id: `temp-${Date.now()}`,
        content: content.trim(),
        sender_id: user.id,
        receiver_id: activeContact.id,
        created_at: new Date().toISOString(),
        read: false,
        sender_name: profile?.name || 'Você',
        sender_avatar: profile?.avatar_url
      };
      
      // Update messages list
      setMessages(prev => [...prev, newMessage]);
      
      // Update the contact's last activity
      const updatedContacts = contacts.map(contact => {
        if (contact.id === activeContact.id) {
          return { 
            ...contact, 
            lastMessage: content.trim(),
            lastActivity: new Date()
          };
        }
        return contact;
      }).sort((a, b) => b.lastActivity.getTime() - a.lastActivity.getTime());
      
      setContacts(updatedContacts);
      
      // Simulate response after a short delay
      setTimeout(() => {
        const responses = [
          "Entendi. Alguma outra dúvida sobre finanças?",
          "Isso faz sentido. Posso ajudar com algo mais?",
          "Interessante! Vamos explorar mais esse assunto.",
          "Obrigado por compartilhar. Tem mais alguma questão financeira?",
          "Legal! Alguma outra estratégia que você gostaria de discutir?"
        ];
        
        const responseMsg: Message = {
          id: `temp-response-${Date.now()}`,
          content: responses[Math.floor(Math.random() * responses.length)],
          sender_id: activeContact.id,
          receiver_id: user.id,
          created_at: new Date().toISOString(),
          read: true,
          sender_name: activeContact.name,
          sender_avatar: activeContact.avatar_url
        };
        
        setMessages(prev => [...prev, responseMsg]);
      }, 1500);
      
      return true;
    } catch (error) {
      console.error("Error sending message:", error);
      toast.error("Erro ao enviar mensagem");
      return false;
    }
  };
  
  // Search users by email
  const searchUsers = async (email: string) => {
    if (!email.trim() || !user?.id) return [];
    
    try {
      // Search for user with this email
      const { data, error } = await supabase
        .from('profiles')
        .select('id, name, email, avatar_url')
        .ilike('email', `%${email.trim()}%`)
        .neq('id', user.id) // Don't include the current user
        .limit(5);
        
      if (error) throw error;
      
      return data || [];
    } catch (error) {
      console.error("Error searching user:", error);
      toast.error("Erro ao buscar usuário");
      return [];
    }
  };
  
  // Add new contact
  const addContact = async (contactId: string) => {
    if (!user?.id) return false;
    
    try {
      // Get the contact's profile
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('id, name, email, avatar_url')
        .eq('id', contactId)
        .single();
        
      if (profileError) throw profileError;
      
      // Check if contact already exists
      const existingContact = contacts.find(c => c.id === contactId);
      
      if (existingContact) {
        toast.info("Contato já adicionado");
        
        // Select the existing contact
        selectContact(existingContact);
        return true;
      }
      
      // Add new contact (in a real app, we would insert into a contacts table)
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
      
      toast.success("Contato adicionado com sucesso!");
      return true;
    } catch (error) {
      console.error("Error adding contact:", error);
      toast.error("Erro ao adicionar contato");
      return false;
    }
  };

  // Load contacts on initial render
  useEffect(() => {
    if (user?.id) {
      fetchContacts();
    }
  }, [user?.id]);

  // Simulate receiving messages - in a real app, this would use Supabase realtime
  useEffect(() => {
    if (!user?.id) return;

    const simulateMessage = () => {
      if (contacts.length > 0 && Math.random() > 0.9) {
        const randomContact = contacts[Math.floor(Math.random() * contacts.length)];
        
        const simulatedMessage = {
          id: `simulated-${Date.now()}`,
          content: `Nova mensagem simulada às ${new Date().toLocaleTimeString()}`,
          sender_id: randomContact.id,
          sender_name: randomContact.name,
          sender_avatar: randomContact.avatar_url,
          receiver_id: user.id,
          created_at: new Date().toISOString(),
          read: false
        };
        
        // If message belongs to active conversation, add it to the messages list
        if (activeContact && (activeContact.id === randomContact.id)) {
          setMessages(prev => [...prev, simulatedMessage as Message]);
        } else {
          // Update unread count for this contact
          setContacts(prev => 
            prev.map(contact => {
              if (contact.id === randomContact.id) {
                return {
                  ...contact,
                  lastMessage: simulatedMessage.content,
                  unreadCount: contact.unreadCount + 1,
                  lastActivity: new Date()
                };
              }
              return contact;
            }).sort((a, b) => b.lastActivity.getTime() - a.lastActivity.getTime())
          );
          
          // Show notification
          toast("Nova mensagem!", {
            description: `${randomContact.name}: ${simulatedMessage.content.substring(0, 50)}${simulatedMessage.content.length > 50 ? '...' : ''}`,
          });
        }
      }
    };
    
    // Simulate occasional messages
    const interval = setInterval(simulateMessage, 15000);
    
    return () => clearInterval(interval);
  }, [user?.id, contacts, activeContact]);

  return {
    contacts,
    messages,
    activeContact,
    isLoadingContacts,
    isLoadingMessages,
    fetchContacts,
    selectContact,
    sendMessage,
    searchUsers,
    addContact,
    setActiveContact
  };
}
