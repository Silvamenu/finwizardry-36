
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { type Assistant } from "@/types/assistant";

interface AssistantSelectProps {
  assistants: Assistant[];
  activeAssistant: Assistant;
  onSelectAssistant: (assistant: Assistant) => void;
}

const AssistantSelect = ({ assistants, activeAssistant, onSelectAssistant }: AssistantSelectProps) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-3">
      {assistants.map((assistant) => (
        <Button
          key={assistant.id}
          variant={activeAssistant.id === assistant.id ? "default" : "outline"}
          className={cn(
            "w-full justify-start h-auto py-3 transition-all duration-300 whitespace-normal text-left",
            activeAssistant.id === assistant.id 
              ? "bg-gradient-to-r from-momoney-600 to-momoney-500 text-white" 
              : `bg-gradient-to-r ${assistant.gradient} hover:bg-gradient-to-r hover:from-momoney-500/10 hover:to-momoney-400/10`
          )}
          onClick={() => onSelectAssistant(assistant)}
        >
          <div className="mr-2 flex-shrink-0">
            {assistant.icon}
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-medium truncate">{assistant.name}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2 break-words">
              {assistant.description}
            </p>
          </div>
        </Button>
      ))}
    </div>
  );
};

export default AssistantSelect;
