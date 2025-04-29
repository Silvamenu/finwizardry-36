
import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar as CalendarIcon, Target } from "lucide-react";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { toast } from "sonner";
import { useFormatters } from "@/hooks/useFormatters";

interface NewGoalModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAddGoal?: (goal: any) => void;
}

const categories = [
  { id: "savings", name: "Poupança", icon: "💰" },
  { id: "travel", name: "Lazer", icon: "✈️" },
  { id: "education", name: "Educação", icon: "🎓" },
  { id: "property", name: "Imóvel", icon: "🏠" },
  { id: "vehicle", name: "Bens", icon: "🚗" },
  { id: "other", name: "Outros", icon: "📦" },
];

const NewGoalModal = ({ open, onOpenChange, onAddGoal }: NewGoalModalProps) => {
  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [targetAmount, setTargetAmount] = useState("");
  const [initialAmount, setInitialAmount] = useState("");
  const [date, setDate] = useState<Date | undefined>(undefined);
  const { formatCurrency } = useFormatters();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name || !category || !targetAmount || !date) {
      toast.error("Por favor, preencha todos os campos obrigatórios.");
      return;
    }

    const newGoal = {
      id: `goal-${Date.now()}`,
      name,
      category,
      targetAmount: parseFloat(targetAmount),
      currentAmount: parseFloat(initialAmount || "0"),
      deadline: date,
      createdAt: new Date(),
      progress: parseFloat(initialAmount || "0") / parseFloat(targetAmount) * 100,
      status: "em andamento",
    };

    if (onAddGoal) {
      onAddGoal(newGoal);
    }

    toast.success("Meta criada com sucesso!", {
      description: `Sua meta "${name}" foi adicionada.`,
    });

    // Reset form
    setName("");
    setCategory("");
    setTargetAmount("");
    setInitialAmount("");
    setDate(undefined);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <Target className="mr-2 h-5 w-5 text-blue-500" />
            Nova Meta Financeira
          </DialogTitle>
          <DialogDescription>
            Defina seus objetivos financeiros e acompanhe seu progresso.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Nome da Meta *</Label>
              <Input 
                id="name" 
                value={name} 
                onChange={(e) => setName(e.target.value)} 
                placeholder="Ex: Viagem para Europa"
                required
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="category">Categoria *</Label>
              <Select value={category} onValueChange={setCategory} required>
                <SelectTrigger id="category">
                  <SelectValue placeholder="Selecione uma categoria" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((cat) => (
                    <SelectItem key={cat.id} value={cat.id}>
                      <div className="flex items-center">
                        <span className="mr-2">{cat.icon}</span>
                        {cat.name}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="target-amount">Valor Alvo (R$) *</Label>
                <Input 
                  id="target-amount" 
                  type="number" 
                  value={targetAmount} 
                  onChange={(e) => setTargetAmount(e.target.value)} 
                  placeholder="10000"
                  min="0"
                  step="0.01"
                  required
                />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="initial-amount">Valor Inicial (R$)</Label>
                <Input 
                  id="initial-amount" 
                  type="number" 
                  value={initialAmount} 
                  onChange={(e) => setInitialAmount(e.target.value)} 
                  placeholder="0"
                  min="0"
                  step="0.01"
                />
              </div>
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="deadline">Data Limite *</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    id="deadline"
                    variant={"outline"}
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !date && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {date ? format(date, "PPP", { locale: ptBR }) : <span>Selecione uma data</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={setDate}
                    initialFocus
                    locale={ptBR}
                    disabled={(date) => date < new Date()}
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>
          
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit" className="bg-gradient-to-r from-blue-600 to-blue-500 text-white">
              Adicionar Meta
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default NewGoalModal;
