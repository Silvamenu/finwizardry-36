
import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar as CalendarIcon, BarChart3 } from "lucide-react";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { toast } from "sonner";
import { useFormatters } from "@/hooks/useFormatters";

interface NewInvestmentModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAddInvestment?: (investment: any) => void;
}

const assetTypes = [
  { id: "stocks", name: "Ações", icon: "📈" },
  { id: "fixed_income", name: "Renda Fixa", icon: "💵" },
  { id: "real_estate", name: "Fundos Imobiliários", icon: "🏢" },
  { id: "crypto", name: "Criptomoedas", icon: "₿" },
  { id: "treasury", name: "Tesouro Direto", icon: "🏛️" },
  { id: "savings", name: "Poupança", icon: "💰" },
  { id: "international", name: "Investimentos Internacionais", icon: "🌎" },
];

const NewInvestmentModal = ({ open, onOpenChange, onAddInvestment }: NewInvestmentModalProps) => {
  const [name, setName] = useState("");
  const [assetType, setAssetType] = useState("");
  const [amount, setAmount] = useState("");
  const [purchasePrice, setPurchasePrice] = useState("");
  const [purchaseDate, setPurchaseDate] = useState<Date | undefined>(new Date());
  const { formatCurrency } = useFormatters();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name || !assetType || !amount || !purchasePrice || !purchaseDate) {
      toast.error("Por favor, preencha todos os campos obrigatórios.");
      return;
    }

    const newInvestment = {
      id: `inv-${Date.now()}`,
      name,
      type: assetType,
      amount: parseFloat(amount),
      purchasePrice: parseFloat(purchasePrice),
      purchaseDate,
      currentPrice: parseFloat(purchasePrice), // Inicialmente igual ao preço de compra
      totalValue: parseFloat(amount) * parseFloat(purchasePrice),
      variation: 0, // Variação inicial é 0
      createdAt: new Date(),
    };

    if (onAddInvestment) {
      onAddInvestment(newInvestment);
    }

    toast.success("Investimento adicionado com sucesso!", {
      description: `${name} foi adicionado à sua carteira.`,
    });

    // Reset form
    setName("");
    setAssetType("");
    setAmount("");
    setPurchasePrice("");
    setPurchaseDate(new Date());
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <BarChart3 className="mr-2 h-5 w-5 text-green-500" />
            Novo Investimento
          </DialogTitle>
          <DialogDescription>
            Adicione um novo investimento à sua carteira.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="investment-name">Nome do Investimento *</Label>
              <Input 
                id="investment-name" 
                value={name} 
                onChange={(e) => setName(e.target.value)} 
                placeholder="Ex: PETR4, Tesouro Selic 2026, etc."
                required
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="asset-type">Tipo de Ativo *</Label>
              <Select value={assetType} onValueChange={setAssetType} required>
                <SelectTrigger id="asset-type">
                  <SelectValue placeholder="Selecione um tipo de ativo" />
                </SelectTrigger>
                <SelectContent>
                  {assetTypes.map((type) => (
                    <SelectItem key={type.id} value={type.id}>
                      <div className="flex items-center">
                        <span className="mr-2">{type.icon}</span>
                        {type.name}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="amount">Quantidade *</Label>
                <Input 
                  id="amount" 
                  type="number" 
                  value={amount} 
                  onChange={(e) => setAmount(e.target.value)} 
                  placeholder="10"
                  min="0"
                  step="0.01"
                  required
                />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="purchase-price">Preço de Compra (R$) *</Label>
                <Input 
                  id="purchase-price" 
                  type="number" 
                  value={purchasePrice} 
                  onChange={(e) => setPurchasePrice(e.target.value)} 
                  placeholder="25.75"
                  min="0"
                  step="0.01"
                  required
                />
              </div>
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="purchase-date">Data de Compra *</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    id="purchase-date"
                    variant={"outline"}
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !purchaseDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {purchaseDate ? format(purchaseDate, "PPP", { locale: ptBR }) : <span>Selecione uma data</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={purchaseDate}
                    onSelect={setPurchaseDate}
                    initialFocus
                    locale={ptBR}
                    disabled={(date) => date > new Date()}
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>
          
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit" className="bg-gradient-to-r from-green-600 to-green-500 text-white">
              Adicionar Investimento
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default NewInvestmentModal;
