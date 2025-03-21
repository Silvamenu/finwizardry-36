
import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { TransactionFormData } from '@/hooks/useTransactions';
import { useCategories, Category } from '@/hooks/useCategories';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Calendar as CalendarIcon, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

const transactionSchema = z.object({
  description: z.string().min(3, { message: 'A descrição deve ter pelo menos 3 caracteres' }),
  amount: z.coerce.number().refine(val => val !== 0, { message: 'O valor não pode ser zero' }),
  category_id: z.string().nullable(),
  type: z.string().min(1, { message: 'Selecione um tipo' }),
  date: z.string().min(1, { message: 'Selecione uma data' }),
  payment_method: z.string().nullable(),
  status: z.string()
});

interface TransactionFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: TransactionFormData) => Promise<void>;
  initialData?: Partial<TransactionFormData>;
  isEditing?: boolean;
}

export function TransactionForm({ 
  open, 
  onOpenChange, 
  onSubmit, 
  initialData, 
  isEditing = false 
}: TransactionFormProps) {
  const { categories, loading: loadingCategories } = useCategories();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Filtered categories by type
  const [filteredCategories, setFilteredCategories] = useState<Category[]>([]);

  const form = useForm<z.infer<typeof transactionSchema>>({
    resolver: zodResolver(transactionSchema),
    defaultValues: {
      description: initialData?.description || '',
      amount: initialData?.amount || 0,
      category_id: initialData?.category_id || null,
      type: initialData?.type || 'expense',
      date: initialData?.date || format(new Date(), 'yyyy-MM-dd'),
      payment_method: initialData?.payment_method || null,
      status: initialData?.status || 'completed'
    }
  });

  // Update filtered categories when type changes
  useEffect(() => {
    const type = form.watch('type');
    if (categories.length > 0) {
      setFilteredCategories(categories.filter(cat => cat.type === type));
    }
  }, [categories, form.watch('type')]);

  const handleSubmit = async (data: z.infer<typeof transactionSchema>) => {
    setIsSubmitting(true);
    try {
      // Ensure all required fields are present in the data
      const transactionData: TransactionFormData = {
        description: data.description,
        amount: data.amount,
        category_id: data.category_id,
        type: data.type,
        date: data.date,
        payment_method: data.payment_method,
        status: data.status
      };
      
      await onSubmit(transactionData);
      form.reset();
      onOpenChange(false);
    } catch (error) {
      console.error('Erro ao salvar transação:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{isEditing ? 'Editar Transação' : 'Nova Transação'}</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Descrição</FormLabel>
                  <FormControl>
                    <Input placeholder="Descrição da transação" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="amount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Valor</FormLabel>
                    <FormControl>
                      <Input type="number" step="0.01" {...field} onChange={e => {
                        const value = parseFloat(e.target.value);
                        field.onChange(value);
                      }} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="date"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Data</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant="outline"
                            className={cn(
                              "w-full pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value ? (
                              format(new Date(field.value), "dd/MM/yyyy", { locale: ptBR })
                            ) : (
                              <span>Selecione uma data</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value ? new Date(field.value) : undefined}
                          onSelect={(date) => {
                            if (date) {
                              field.onChange(format(date, 'yyyy-MM-dd'));
                            }
                          }}
                          locale={ptBR}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tipo</FormLabel>
                    <Select 
                      onValueChange={(value) => {
                        field.onChange(value);
                        // Reset category when type changes
                        form.setValue('category_id', null);
                      }} 
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione o tipo" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="income">Entrada</SelectItem>
                        <SelectItem value="expense">Saída</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Status</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione o status" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="completed">Concluída</SelectItem>
                        <SelectItem value="pending">Pendente</SelectItem>
                        <SelectItem value="scheduled">Agendada</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="category_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Categoria</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value || undefined}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione a categoria" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {loadingCategories ? (
                          <div className="flex items-center justify-center p-2">
                            <Loader2 className="h-4 w-4 animate-spin" />
                            <span className="ml-2">Carregando...</span>
                          </div>
                        ) : filteredCategories.length > 0 ? (
                          filteredCategories.map(category => (
                            <SelectItem key={category.id} value={category.id}>
                              {category.name}
                            </SelectItem>
                          ))
                        ) : (
                          <div className="p-2 text-sm text-muted-foreground">
                            Nenhuma categoria disponível
                          </div>
                        )}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="payment_method"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Método de Pagamento</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value || undefined}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione o método" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="credit">Cartão de Crédito</SelectItem>
                        <SelectItem value="debit">Cartão de Débito</SelectItem>
                        <SelectItem value="cash">Dinheiro</SelectItem>
                        <SelectItem value="transfer">Transferência</SelectItem>
                        <SelectItem value="pix">Pix</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <DialogFooter>
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => onOpenChange(false)}
              >
                Cancelar
              </Button>
              <Button type="submit" variant="clean" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {isEditing ? 'Atualizando...' : 'Salvando...'}
                  </>
                ) : (
                  isEditing ? 'Atualizar' : 'Salvar'
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
