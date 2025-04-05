
import { Moon, Sun } from "lucide-react"
import { cn } from "@/lib/utils"
import { useUserPreferences } from "@/hooks/useUserPreferences"
import { toast } from "sonner"

interface ThemeToggleProps {
  className?: string
}

export function ThemeToggle({ className }: ThemeToggleProps) {
  const { preferences, setPreferences, savePreferences, saving } = useUserPreferences();
  
  const isDark = preferences.theme === 'dark';
  
  const toggleTheme = () => {
    if (saving) {
      toast.info("Aguarde, alterando o tema...");
      return; // Prevent toggle while saving
    }
    
    const newTheme = isDark ? 'light' : 'dark';
    
    // Update local state immediately for responsive UI
    setPreferences({
      ...preferences,
      theme: newTheme
    });
    
    // Save to database
    savePreferences({
      ...preferences,
      theme: newTheme
    }).then(success => {
      if (success) {
        toast.success(`Tema alterado para ${newTheme === 'dark' ? 'escuro' : 'claro'}`);
      }
    });
  }

  return (
    <div
      className={cn(
        "flex w-16 h-8 p-1 rounded-full cursor-pointer transition-all duration-300",
        isDark 
          ? "bg-gray-800 border border-gray-700" 
          : "bg-white border border-zinc-200",
        className
      )}
      onClick={toggleTheme}
      role="button"
      tabIndex={0}
      aria-label={isDark ? "Mudar para modo claro" : "Mudar para modo escuro"}
    >
      <div className="flex justify-between items-center w-full">
        <div
          className={cn(
            "flex justify-center items-center w-6 h-6 rounded-full transition-transform duration-300",
            isDark 
              ? "transform translate-x-0 bg-gray-700" 
              : "transform translate-x-8 bg-gray-200"
          )}
        >
          {isDark ? (
            <Moon 
              className="w-4 h-4 text-momoney-300" 
              strokeWidth={1.5}
            />
          ) : (
            <Sun 
              className="w-4 h-4 text-amber-500" 
              strokeWidth={1.5}
            />
          )}
        </div>
        <div
          className={cn(
            "flex justify-center items-center w-6 h-6 rounded-full transition-transform duration-300",
            isDark 
              ? "bg-transparent" 
              : "transform -translate-x-8"
          )}
        >
          {isDark ? (
            <Sun 
              className="w-4 h-4 text-amber-300 opacity-50" 
              strokeWidth={1.5}
            />
          ) : (
            <Moon 
              className="w-4 h-4 text-gray-400" 
              strokeWidth={1.5}
            />
          )}
        </div>
      </div>
    </div>
  )
}
