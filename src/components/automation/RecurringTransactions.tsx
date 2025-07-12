import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "lucide-react";
import { useAutomation } from "@/hooks/useAutomation";
import { useCategories } from "@/hooks/useCategories";
import { useFormatters } from "@/hooks/useFormatters";
import { motion } from "framer-motion";

const RecurringTransactions = () => {
  const { recurringTransactions, createRecurringTransaction, updateRecurringTransaction, deleteRecurringTransaction, loading } = useAutomation();
  const { categories } = useCategories();
  const { formatCurrency } = useFormatters();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    template_name: '',
    amount: '',
    description: '',
    category_id: '',
    type: 'expense' as 'income' | 'expense',
    frequency: 'monthly' as 'daily' | 'weekly' | 'monthly' | 'yearly',
    frequency_interval: 1,
    start_date: new Date().toISOString().split('T')[0],
    end_date: '',
    payment_method: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const nextExecutionDate = calculateNextExecution(formData.start_date, formData.frequency, formData.frequency_interval);
    
    await createRecurringTransaction({
      ...formData,
      amount: parseFloat(formData.amount),
      next_execution_date: nextExecutionDate,
      is_active: true
    });
    
    setIsDialogOpen(false);
    resetForm();
  };

  const resetForm = () => {
    setFormData({
      template_name: '',
      amount: '',
      description: '',
      category_id: '',
      type: 'expense',
      frequency: 'monthly',
      frequency_interval: 1,
      start_date: new Date().toISOString().split('T')[0],
      end_date: '',
      payment_method: ''
    });
  };

  const calculateNextExecution = (startDate: string, frequency: string, interval: number): string => {
    const date = new Date(startDate);
    
    switch (frequency) {
      case 'daily':
        date.setDate(date.getDate() + interval);
        break;
      case 'weekly':
        date.setDate(date.getDate() + (interval * 7));
        break;
      case 'monthly':
        date.setMonth(date.getMonth() + interval);
        break;
      case 'yearly':
        date.setFullYear(date.getFullYear() + interval);
        break;
    }
    
    return date.toISOString().split('T')[0];
  };

  const toggleRecurringTransaction = async (id: string, isActive: boolean) => {
    await updateRecurringTransaction(id, { is_active: !isActive });
  };

  const getFrequencyLabel = (frequency: string, interval: number) => {
    const labels = {
      daily: interval === 1 ? 'Diário' : `A cada ${interval} dias`,
      weekly: interval === 1 ? 'Semanal' : `A cada ${interval} semanas`,
      monthly: interval === 1 ? 'Mensal' : `A cada ${interval} meses`,
      yearly: interval === 1 ? 'Anual' : `A cada ${interval} anos`
    };
    return labels[frequency as keyof typeof labels];
  };

  const getCategoryName = (categoryId: string | null) => {
    if (!categoryId) return 'Sem categoria';
    const category = categories.find(c => c.id === categoryId);
    return category?.name || 'Categoria não encontrada';
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center space-x-2">
            <Calendar className="h-5 w-5" />
            <span>Transações Recorrentes</span>
          </CardTitle>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button>Adicionar Recorrência</Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Nova Transação Recorrente</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="template_name">Nome do Template</Label>
                  <Input
                    id="template_name"
                    value={formData.template_name}
                    onChange={(e) => setFormData({ ...formData, template_name: e.target.value })}
                    placeholder="Ex: Aluguel, Salário..."
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="amount">Valor</Label>
                    <Input
                      id="amount"
                      type="number"
                      step="0.01"
                      value={formData.amount}
                      onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                      placeholder="0,00"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="type">Tipo</Label>
                    <Select value={formData.type} onValueChange={(value: 'income' | 'expense') => 
                      setFormData({ ...formData, type: value })}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="income">Receita</SelectItem>
                        <SelectItem value="expense">Despesa</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <Label htmlFor="description">Descrição</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Descrição da transação..."
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="category_id">Categoria</Label>
                  <Select value={formData.category_id} onValueChange={(value) => 
                    setFormData({ ...formData, category_id: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione uma categoria" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories
                        .filter(cat => cat.type === formData.type)
                        .map(category => (
                          <SelectItem key={category.id} value={category.id}>
                            {category.name}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="frequency">Frequência</Label>
                    <Select value={formData.frequency} onValueChange={(value: any) => 
                      setFormData({ ...formData, frequency: value })}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="daily">Diário</SelectItem>
                        <SelectItem value="weekly">Semanal</SelectItem>
                        <SelectItem value="monthly">Mensal</SelectItem>
                        <SelectItem value="yearly">Anual</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="frequency_interval">Intervalo</Label>
                    <Input
                      id="frequency_interval"
                      type="number"
                      min="1"
                      value={formData.frequency_interval}
                      onChange={(e) => setFormData({ ...formData, frequency_interval: parseInt(e.target.value) })}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="start_date">Data de Início</Label>
                    <Input
                      id="start_date"
                      type="date"
                      value={formData.start_date}
                      onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="end_date">Data de Fim (opcional)</Label>
                    <Input
                      id="end_date"
                      type="date"
                      value={formData.end_date}
                      onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="payment_method">Método de Pagamento</Label>
                  <Input
                    id="payment_method"
                    value={formData.payment_method}
                    onChange={(e) => setFormData({ ...formData, payment_method: e.target.value })}
                    placeholder="Ex: Cartão de Crédito, PIX..."
                  />
                </div>

                <Button type="submit" className="w-full">
                  Criar Recorrência
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="text-center py-4">Carregando...</div>
        ) : recurringTransactions.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <Calendar className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>Nenhuma transação recorrente configurada</p>
            <p className="text-sm">Configure transações automáticas para economizar tempo</p>
          </div>
        ) : (
          <div className="space-y-4">
            {recurringTransactions.map((transaction, index) => (
              <motion.div
                key={transaction.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="border rounded-lg p-4 space-y-3"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div>
                      <h4 className="font-medium">{transaction.template_name}</h4>
                      <p className="text-sm text-muted-foreground">{transaction.description}</p>
                    </div>
                  </div>
                  <Switch
                    checked={transaction.is_active}
                    onCheckedChange={() => toggleRecurringTransaction(transaction.id, transaction.is_active)}
                  />
                </div>

                <div className="flex flex-wrap gap-2">
                  <Badge variant={transaction.type === 'income' ? 'default' : 'secondary'}>
                    {formatCurrency(transaction.amount)}
                  </Badge>
                  <Badge variant="outline">
                    {getFrequencyLabel(transaction.frequency, transaction.frequency_interval)}
                  </Badge>
                  <Badge variant="outline">
                    {getCategoryName(transaction.category_id)}
                  </Badge>
                  {transaction.payment_method && (
                    <Badge variant="outline">
                      {transaction.payment_method}
                    </Badge>
                  )}
                </div>

                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <span>Próxima execução: {new Date(transaction.next_execution_date).toLocaleDateString('pt-BR')}</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => deleteRecurringTransaction(transaction.id)}
                    className="text-red-600 hover:text-red-700"
                  >
                    Remover
                  </Button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default RecurringTransactions;