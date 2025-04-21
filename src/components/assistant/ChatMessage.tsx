
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Bot, Clock, ThumbsDown, ThumbsUp, User } from "lucide-react";
import { type Message } from "@/types/assistant";

interface ChatMessageProps {
  message: Message;
  assistantName: string;
  onFeedback: (positive: boolean) => void;
}

const ChatMessage = ({ message, assistantName, onFeedback }: ChatMessageProps) => {
  return (
    <div
      className={cn(
        "flex animate-fade-in",
        message.role === "user" ? "justify-end" : "justify-start"
      )}
    >
      <div
        className={cn(
          "max-w-[80%] rounded-lg p-4",
          message.role === "user"
            ? "bg-gradient-to-r from-momoney-600 to-momoney-500 text-white"
            : "bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white"
        )}
      >
        <div className="flex items-center mb-2">
          {message.role === "assistant" ? (
            <Avatar className="h-6 w-6 mr-2">
              <AvatarFallback className="bg-momoney-100 text-momoney-700 dark:bg-momoney-900 dark:text-momoney-300">
                <Bot className="h-4 w-4" />
              </AvatarFallback>
            </Avatar>
          ) : (
            <Avatar className="h-6 w-6 mr-2">
              <AvatarFallback className="bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-300">
                <User className="h-4 w-4" />
              </AvatarFallback>
            </Avatar>
          )}
          <span className="text-xs">
            {message.role === "assistant" ? assistantName : "Você"}
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
              className="h-6 px-2 hover:bg-white/10"
              onClick={() => onFeedback(true)}
            >
              <ThumbsUp className="h-3 w-3" />
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              className="h-6 px-2 hover:bg-white/10"
              onClick={() => onFeedback(false)}
            >
              <ThumbsDown className="h-3 w-3" />
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatMessage;
