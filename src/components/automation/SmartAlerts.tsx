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
import { Bell, BellRing, AlertTriangle, Target, TrendingUp } from "lucide-react";
import { useAutomation } from "@/hooks/useAutomation";
import { useCategories } from "@/hooks/useCategories";
import { useFormatters } from "@/hooks/useFormatters";
import { motion } from "framer-motion";

const SmartAlerts = () => {
  const { alerts, alertHistory, createAlert, deleteAlert, markAlertAsRead, loading } = useAutomation();
  const { categories } = useCategories();
  const { formatCurrency } = useFormatters();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'alerts' | 'history'>('alerts');
  const [formData, setFormData] = useState({
    alert_type: 'budget_limit' as const,
    title: '',
    message: '',
    threshold_value: '',
    category_id: '',
    frequency: 'immediate' as const
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    await createAlert({
      alert_type: formData.alert_type,
      title: formData.title,
      message: formData.message,
      threshold_value: formData.threshold_value ? parseFloat(formData.threshold_value) : null,
      category_id: formData.category_id || null,
      frequency: formData.frequency,
      is_active: true
    });
    
    setIsDialogOpen(false);
    resetForm();
  };

  const resetForm = () => {
    setFormData({
      alert_type: 'budget_limit',
      title: '',
      message: '',
      threshold_value: '',
      category_id: '',
      frequency: 'immediate'
    });
  };

  const getAlertTypeIcon = (type: string) => {
    switch (type) {
      case 'budget_limit':
        return <AlertTriangle className="h-4 w-4" />;
      case 'goal_milestone':
        return <Target className="h-4 w-4" />;
      case 'unusual_spending':
        return <TrendingUp className="h-4 w-4" />;
      case 'recurring_reminder':
        return <BellRing className="h-4 w-4" />;
      default:
        return <Bell className="h-4 w-4" />;
    }
  };

  const getAlertTypeLabel = (type: string) => {
    const labels = {
      budget_limit: 'Limite de Orçamento',
      goal_milestone: 'Marco de Meta',
      unusual_spending: 'Gasto Incomum',
      recurring_reminder: 'Lembrete Recorrente',
      custom: 'Personalizado'
    };
    return labels[type as keyof typeof labels] || type;
  };

  const getFrequencyLabel = (frequency: string | null) => {
    const labels = {
      immediate: 'Imediato',
      daily: 'Diário',
      weekly: 'Semanal',
      monthly: 'Mensal'
    };
    return frequency ? labels[frequency as keyof typeof labels] || frequency : 'Imediato';
  };

  const getCategoryName = (categoryId: string | null) => {
    if (!categoryId) return 'Todas as categorias';
    const category = categories.find(c => c.id === categoryId);
    return category?.name || 'Categoria não encontrada';
  };

  const unreadAlerts = alertHistory.filter(alert => !alert.is_read);

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center space-x-2">
            <Bell className="h-5 w-5" />
            <span>Alertas Inteligentes</span>
            {unreadAlerts.length > 0 && (
              <Badge variant="destructive" className="ml-2">
                {unreadAlerts.length}
              </Badge>
            )}
          </CardTitle>
          <div className="flex items-center space-x-2">
            <div className="border rounded-lg p-1">
              <Button
                variant={activeTab === 'alerts' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setActiveTab('alerts')}
              >
                Configurações
              </Button>
              <Button
                variant={activeTab === 'history' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setActiveTab('history')}
              >
                Histórico
              </Button>
            </div>
            {activeTab === 'alerts' && (
              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                  <Button>Novo Alerta</Button>
                </DialogTrigger>
                <DialogContent className="max-w-md">
                  <DialogHeader>
                    <DialogTitle>Configurar Novo Alerta</DialogTitle>
                  </DialogHeader>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                      <Label htmlFor="alert_type">Tipo de Alerta</Label>
                      <Select value={formData.alert_type} onValueChange={(value: any) => 
                        setFormData({ ...formData, alert_type: value })}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="budget_limit">Limite de Orçamento</SelectItem>
                          <SelectItem value="goal_milestone">Marco de Meta</SelectItem>
                          <SelectItem value="unusual_spending">Gasto Incomum</SelectItem>
                          <SelectItem value="recurring_reminder">Lembrete Recorrente</SelectItem>
                          <SelectItem value="custom">Personalizado</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="title">Título do Alerta</Label>
                      <Input
                        id="title"
                        value={formData.title}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        placeholder="Ex: Orçamento Alimentação Excedido"
                        required
                      />
                    </div>

                    <div>
                      <Label htmlFor="message">Mensagem</Label>
                      <Textarea
                        id="message"
                        value={formData.message}
                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                        placeholder="Descreva quando este alerta deve ser disparado..."
                        required
                      />
                    </div>

                    {['budget_limit', 'unusual_spending'].includes(formData.alert_type) && (
                      <div>
                        <Label htmlFor="threshold_value">Valor Limite (R$)</Label>
                        <Input
                          id="threshold_value"
                          type="number"
                          step="0.01"
                          value={formData.threshold_value}
                          onChange={(e) => setFormData({ ...formData, threshold_value: e.target.value })}
                          placeholder="1000.00"
                        />
                      </div>
                    )}

                    <div>
                      <Label htmlFor="category_id">Categoria (opcional)</Label>
                      <Select value={formData.category_id} onValueChange={(value) => 
                        setFormData({ ...formData, category_id: value })}>
                        <SelectTrigger>
                          <SelectValue placeholder="Todas as categorias" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="">Todas as categorias</SelectItem>
                          {categories.map(category => (
                            <SelectItem key={category.id} value={category.id}>
                              {category.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="frequency">Frequência</Label>
                      <Select value={formData.frequency} onValueChange={(value: any) => 
                        setFormData({ ...formData, frequency: value })}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="immediate">Imediato</SelectItem>
                          <SelectItem value="daily">Diário</SelectItem>
                          <SelectItem value="weekly">Semanal</SelectItem>
                          <SelectItem value="monthly">Mensal</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <Button type="submit" className="w-full">
                      Criar Alerta
                    </Button>
                  </form>
                </DialogContent>
              </Dialog>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {activeTab === 'alerts' ? (
          loading ? (
            <div className="text-center py-4">Carregando...</div>
          ) : alerts.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Bell className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>Nenhum alerta configurado</p>
              <p className="text-sm">Configure alertas para ser notificado sobre eventos importantes</p>
            </div>
          ) : (
            <div className="space-y-4">
              {alerts.map((alert, index) => (
                <motion.div
                  key={alert.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="border rounded-lg p-4 space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      {getAlertTypeIcon(alert.alert_type)}
                      <div>
                        <h4 className="font-medium">{alert.title}</h4>
                        <p className="text-sm text-muted-foreground">{alert.message}</p>
                      </div>
                    </div>
                    <Switch checked={alert.is_active} disabled />
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <Badge variant="outline">
                      {getAlertTypeLabel(alert.alert_type)}
                    </Badge>
                    <Badge variant="outline">
                      {getFrequencyLabel(alert.frequency)}
                    </Badge>
                    {alert.threshold_value && (
                      <Badge variant="outline">
                        Limite: {formatCurrency(alert.threshold_value)}
                      </Badge>
                    )}
                    <Badge variant="outline">
                      {getCategoryName(alert.category_id)}
                    </Badge>
                  </div>

                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <span>
                      {alert.last_triggered 
                        ? `Último disparo: ${new Date(alert.last_triggered).toLocaleDateString('pt-BR')}`
                        : 'Nunca disparado'
                      }
                    </span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => deleteAlert(alert.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      Remover
                    </Button>
                  </div>
                </motion.div>
              ))}
            </div>
          )
        ) : (
          <div className="space-y-4">
            {alertHistory.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Bell className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Nenhum alerta disparado ainda</p>
                <p className="text-sm">O histórico aparecerá aqui quando os alertas forem ativados</p>
              </div>
            ) : (
              alertHistory.map((historyItem, index) => (
                <motion.div
                  key={historyItem.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={`border rounded-lg p-4 ${!historyItem.is_read ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-200' : ''}`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <p className="font-medium">{historyItem.message}</p>
                      <p className="text-sm text-muted-foreground">
                        {new Date(historyItem.triggered_at).toLocaleString('pt-BR')}
                      </p>
                    </div>
                    {!historyItem.is_read && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => markAlertAsRead(historyItem.id)}
                      >
                        Marcar como lido
                      </Button>
                    )}
                  </div>
                </motion.div>
              ))
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default SmartAlerts;