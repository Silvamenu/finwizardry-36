import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Bot, Plus, X } from "lucide-react";
import { useAutomation } from "@/hooks/useAutomation";
import { useCategories } from "@/hooks/useCategories";
import { motion } from "framer-motion";

const AutoCategorization = () => {
  const { categorizationRules, createCategorizationRule, deleteCategorizationRule, loading } = useAutomation();
  const { categories } = useCategories();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    rule_name: '',
    keywords: [''],
    category_id: '',
    priority: 0
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const filteredKeywords = formData.keywords.filter(keyword => keyword.trim() !== '');
    
    if (filteredKeywords.length === 0) {
      return;
    }

    await createCategorizationRule({
      rule_name: formData.rule_name,
      keywords: filteredKeywords,
      category_id: formData.category_id,
      priority: formData.priority,
      is_active: true
    });
    
    setIsDialogOpen(false);
    resetForm();
  };

  const resetForm = () => {
    setFormData({
      rule_name: '',
      keywords: [''],
      category_id: '',
      priority: 0
    });
  };

  const addKeyword = () => {
    setFormData({
      ...formData,
      keywords: [...formData.keywords, '']
    });
  };

  const removeKeyword = (index: number) => {
    setFormData({
      ...formData,
      keywords: formData.keywords.filter((_, i) => i !== index)
    });
  };

  const updateKeyword = (index: number, value: string) => {
    const newKeywords = [...formData.keywords];
    newKeywords[index] = value;
    setFormData({
      ...formData,
      keywords: newKeywords
    });
  };

  const getCategoryName = (categoryId: string) => {
    const category = categories.find(c => c.id === categoryId);
    return category?.name || 'Categoria não encontrada';
  };

  const getPriorityLabel = (priority: number) => {
    if (priority >= 80) return 'Muito Alta';
    if (priority >= 60) return 'Alta';
    if (priority >= 40) return 'Média';
    if (priority >= 20) return 'Baixa';
    return 'Muito Baixa';
  };

  const getPriorityColor = (priority: number) => {
    if (priority >= 80) return 'destructive';
    if (priority >= 60) return 'default';
    if (priority >= 40) return 'secondary';
    return 'outline';
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center space-x-2">
            <Bot className="h-5 w-5" />
            <span>Categorização Automática</span>
          </CardTitle>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button>Adicionar Regra</Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Nova Regra de Categorização</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="rule_name">Nome da Regra</Label>
                  <Input
                    id="rule_name"
                    value={formData.rule_name}
                    onChange={(e) => setFormData({ ...formData, rule_name: e.target.value })}
                    placeholder="Ex: Gastos com Alimentação"
                    required
                  />
                </div>

                <div>
                  <Label>Palavras-chave</Label>
                  <div className="space-y-2">
                    {formData.keywords.map((keyword, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        <Input
                          value={keyword}
                          onChange={(e) => updateKeyword(index, e.target.value)}
                          placeholder="Ex: restaurante, lanchonete..."
                        />
                        {formData.keywords.length > 1 && (
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => removeKeyword(index)}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    ))}
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={addKeyword}
                      className="w-full"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Adicionar Palavra-chave
                    </Button>
                  </div>
                </div>

                <div>
                  <Label htmlFor="category_id">Categoria</Label>
                  <Select value={formData.category_id} onValueChange={(value) => 
                    setFormData({ ...formData, category_id: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione uma categoria" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map(category => (
                        <SelectItem key={category.id} value={category.id}>
                          {category.name} ({category.type === 'income' ? 'Receita' : 'Despesa'})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="priority">Prioridade (0-100)</Label>
                  <Input
                    id="priority"
                    type="number"
                    min="0"
                    max="100"
                    value={formData.priority}
                    onChange={(e) => setFormData({ ...formData, priority: parseInt(e.target.value) || 0 })}
                    placeholder="50"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Regras com maior prioridade são aplicadas primeiro
                  </p>
                </div>

                <Button type="submit" className="w-full">
                  Criar Regra
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="text-center py-4">Carregando...</div>
        ) : categorizationRules.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <Bot className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>Nenhuma regra de categorização configurada</p>
            <p className="text-sm">Crie regras para categorizar transações automaticamente</p>
          </div>
        ) : (
          <div className="space-y-4">
            {categorizationRules
              .sort((a, b) => b.priority - a.priority)
              .map((rule, index) => (
                <motion.div
                  key={rule.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="border rounded-lg p-4 space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">{rule.rule_name}</h4>
                      <p className="text-sm text-muted-foreground">
                        → {getCategoryName(rule.category_id)}
                      </p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge variant={getPriorityColor(rule.priority)}>
                        {getPriorityLabel(rule.priority)}
                      </Badge>
                      <Switch checked={rule.is_active} disabled />
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-1">
                    {rule.keywords.map((keyword, keywordIndex) => (
                      <Badge key={keywordIndex} variant="outline" className="text-xs">
                        {keyword}
                      </Badge>
                    ))}
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">
                      Prioridade: {rule.priority}
                    </span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => deleteCategorizationRule(rule.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      Remover
                    </Button>
                  </div>
                </motion.div>
              ))}
            
            <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <h5 className="font-medium text-blue-900 dark:text-blue-100 mb-2">
                💡 Como funciona?
              </h5>
              <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-1">
                <li>• As regras são aplicadas por ordem de prioridade (maior para menor)</li>
                <li>• Quando uma transação contém uma palavra-chave, a categoria é sugerida automaticamente</li>
                <li>• Use palavras-chave específicas para melhor precisão</li>
                <li>• Regras com maior prioridade sobrepõem regras com menor prioridade</li>
              </ul>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AutoCategorization;