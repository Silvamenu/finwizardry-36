
import { useEffect, useState } from "react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Target, Plus, Download, ArrowRight, Check } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import NewGoalModal from "@/components/goals/NewGoalModal";
import { toast } from "sonner";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { useFormatters } from "@/hooks/useFormatters";

// Mock data for goals
const mockGoals = [
  {
    id: 'goal-1',
    name: 'Emergência',
    category: 'savings',
    targetAmount: 15000,
    currentAmount: 7500,
    deadline: new Date('2023-12-31'),
    createdAt: new Date('2023-01-15'),
    status: 'em andamento',
    progress: 50
  },
  {
    id: 'goal-2',
    name: 'Viagem Europa',
    category: 'travel',
    targetAmount: 25000,
    currentAmount: 12000,
    deadline: new Date('2024-07-15'),
    createdAt: new Date('2023-03-10'),
    status: 'em andamento',
    progress: 48
  },
  {
    id: 'goal-3',
    name: 'MacBook Pro',
    category: 'other',
    targetAmount: 12000,
    currentAmount: 12000,
    deadline: new Date('2023-10-30'),
    createdAt: new Date('2023-05-01'),
    status: 'concluída',
    progress: 100
  }
];

const Metas = () => {
  const [showNewGoalModal, setShowNewGoalModal] = useState(false);
  const [goals, setGoals] = useState(mockGoals);
  const { formatCurrency } = useFormatters();
  
  useEffect(() => {
    document.title = "MoMoney | Metas";
  }, []);

  const handleAddGoal = (goal: any) => {
    setGoals([...goals, goal]);
    toast.success("Meta adicionada com sucesso!");
    setShowNewGoalModal(false);
  };
  
  const exportGoals = (exportFormat: 'csv' | 'json' = 'csv') => {
    try {
      if (exportFormat === 'csv') {
        // Converter para CSV
        const headers = ['Nome', 'Categoria', 'Valor alvo', 'Valor atual', 'Progresso', 'Data limite', 'Status'];
        const csvRows = [headers.join(',')];
        
        goals.forEach(goal => {
          const row = [
            `"${goal.name.replace(/"/g, '""')}"`,
            `"${goal.category.replace(/"/g, '""')}"`,
            goal.targetAmount,
            goal.currentAmount,
            `${goal.progress}%`,
            format(goal.deadline, 'yyyy-MM-dd'),
            `"${goal.status.replace(/"/g, '""')}"`
          ];
          csvRows.push(row.join(','));
        });
        
        // Create CSV string by joining rows with newlines
        const csvString = csvRows.join('\n');
        const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        
        link.setAttribute('href', url);
        link.setAttribute('download', `metas_${new Date().toISOString().split('T')[0]}.csv`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        toast.success('Metas exportadas com sucesso!');
      } else {
        // JSON
        const dataStr = JSON.stringify(goals, null, 2);
        const blob = new Blob([dataStr], { type: 'application/json' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        
        link.setAttribute('href', url);
        link.setAttribute('download', `metas_${new Date().toISOString().split('T')[0]}.json`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        toast.success('Metas exportadas com sucesso!');
      }
    } catch (err: any) {
      console.error('Erro ao exportar metas:', err);
      toast.error('Erro ao exportar metas');
    }
  };

  const getCategoryIcon = (category: string) => {
    const icons: Record<string, string> = {
      'savings': '💰',
      'travel': '✈️',
      'education': '🎓',
      'property': '🏠',
      'vehicle': '🚗',
      'other': '📦'
    };
    return icons[category] || '📌';
  };

  return (
    <DashboardLayout activePage="Metas">
      {/* New Goal Modal */}
      <NewGoalModal 
        open={showNewGoalModal} 
        onOpenChange={setShowNewGoalModal}
        onAddGoal={handleAddGoal}
      />
      
      <div className="grid gap-6">
        <div className="flex flex-col md:flex-row gap-6 md:items-center justify-between">
          <div className="animate-fade-in">
            <h1 className="text-3xl font-bold mb-2 gradient-text">Metas Financeiras</h1>
            <p className="text-gray-500">Defina e acompanhe suas metas financeiras</p>
          </div>
          <div className="flex gap-3 animate-fade-in reveal-delay-1">
            <Button variant="outline" onClick={() => exportGoals('csv')} className="minimalist-button group">
              <Download className="h-4 w-4 mr-2 group-hover:scale-110 transition-transform" />
              Exportar
            </Button>
            <Button onClick={() => setShowNewGoalModal(true)} className="minimalist-button minimalist-button-primary">
              <Plus className="h-4 w-4 mr-2" />
              Nova Meta
            </Button>
          </div>
        </div>

        <Card className="minimalist-card overflow-hidden animate-fade-in reveal-delay-2">
          <CardHeader className="bg-gradient-to-r from-blue-50 to-sky-50 dark:from-blue-900/20 dark:to-sky-900/20 border-b border-blue-100/50 dark:border-blue-800/50">
            <CardTitle className="flex items-center">
              <Target className="h-5 w-5 mr-2 text-blue-600 dark:text-blue-400" />
              Minhas Metas
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <Tabs defaultValue="all" className="w-full">
              <TabsList className="grid grid-cols-3 mb-6 w-full max-w-md mx-auto">
                <TabsTrigger value="all" className="data-[state=active]:gradient-bg data-[state=active]:text-white">Todas</TabsTrigger>
                <TabsTrigger value="active" className="data-[state=active]:gradient-bg data-[state=active]:text-white">Em andamento</TabsTrigger>
                <TabsTrigger value="completed" className="data-[state=active]:gradient-bg data-[state=active]:text-white">Concluídas</TabsTrigger>
              </TabsList>
              
              <TabsContent value="all" className="mt-4 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {goals.map((goal, index) => (
                    <div key={goal.id} 
                      className="animate-fade-in"
                      style={{ animationDelay: `${index * 0.1 + 0.3}s` }}
                    >
                      <Card className="card-hover-effect overflow-hidden h-full flex flex-col">
                        <div className={`h-1.5 ${goal.status === 'concluída' ? 'bg-green-500' : 'gradient-bg'}`}></div>
                        <CardContent className="pt-6 flex flex-col h-full">
                          <div className="flex items-start justify-between mb-4">
                            <div className="flex items-center">
                              <span className="text-3xl mr-3 animate-pulse-soft">{getCategoryIcon(goal.category)}</span>
                              <div>
                                <h3 className="font-medium">{goal.name}</h3>
                                <p className="text-sm text-gray-500">
                                  Data limite: {format(goal.deadline, 'dd MMM yyyy', { locale: ptBR })}
                                </p>
                              </div>
                            </div>
                            <Badge variant={goal.status === 'concluída' ? "secondary" : "default"} className="animate-pulse-soft">
                              {goal.status}
                            </Badge>
                          </div>
                          
                          <div className="mt-4 flex-grow">
                            <div className="flex justify-between text-sm mb-2">
                              <span className="font-medium">{formatCurrency(goal.currentAmount)}</span>
                              <span className="text-gray-500">{formatCurrency(goal.targetAmount)}</span>
                            </div>
                            <Progress value={goal.progress} className="h-2 bg-gray-100 dark:bg-gray-800" />
                            <div className="flex justify-between text-xs text-gray-500 mt-2">
                              <span>Progresso: {goal.progress}%</span>
                              <span>{goal.status === 'concluída' ? 
                                <span className="flex items-center text-green-500">
                                  <Check className="h-3 w-3 mr-1" /> Concluída
                                </span> : 'Em andamento'}
                              </span>
                            </div>
                          </div>
                          
                          <Button variant="ghost" className="w-full mt-6 text-blue-600 dark:text-blue-400 group">
                            <span>Detalhes</span>
                            <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
                          </Button>
                        </CardContent>
                      </Card>
                    </div>
                  ))}
                </div>
              </TabsContent>
              
              <TabsContent value="active">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {goals.filter(goal => goal.status !== 'concluída').map((goal, index) => (
                    <div key={goal.id} 
                      className="animate-fade-in"
                      style={{ animationDelay: `${index * 0.1 + 0.3}s` }}
                    >
                      <Card className="card-hover-effect overflow-hidden h-full flex flex-col">
                        <div className="h-1.5 gradient-bg"></div>
                        <CardContent className="pt-6 flex flex-col h-full">
                          <div className="flex items-start justify-between mb-4">
                            <div className="flex items-center">
                              <span className="text-3xl mr-3 animate-pulse-soft">{getCategoryIcon(goal.category)}</span>
                              <div>
                                <h3 className="font-medium">{goal.name}</h3>
                                <p className="text-sm text-gray-500">
                                  Data limite: {format(goal.deadline, 'dd MMM yyyy', { locale: ptBR })}
                                </p>
                              </div>
                            </div>
                            <Badge variant="default" className="animate-pulse-soft">
                              {goal.status}
                            </Badge>
                          </div>
                          
                          <div className="mt-4 flex-grow">
                            <div className="flex justify-between text-sm mb-2">
                              <span className="font-medium">{formatCurrency(goal.currentAmount)}</span>
                              <span className="text-gray-500">{formatCurrency(goal.targetAmount)}</span>
                            </div>
                            <Progress value={goal.progress} className="h-2 bg-gray-100 dark:bg-gray-800" />
                            <div className="flex justify-between text-xs text-gray-500 mt-2">
                              <span>Progresso: {goal.progress}%</span>
                              <span>Em andamento</span>
                            </div>
                          </div>
                          
                          <Button variant="ghost" className="w-full mt-6 text-blue-600 dark:text-blue-400 group">
                            <span>Detalhes</span>
                            <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
                          </Button>
                        </CardContent>
                      </Card>
                    </div>
                  ))}
                </div>
              </TabsContent>
              
              <TabsContent value="completed">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {goals.filter(goal => goal.status === 'concluída').map((goal, index) => (
                    <div key={goal.id} 
                      className="animate-fade-in"
                      style={{ animationDelay: `${index * 0.1 + 0.3}s` }}
                    >
                      <Card className="card-hover-effect overflow-hidden h-full flex flex-col">
                        <div className="h-1.5 bg-green-500"></div>
                        <CardContent className="pt-6 flex flex-col h-full">
                          <div className="flex items-start justify-between mb-4">
                            <div className="flex items-center">
                              <span className="text-3xl mr-3 animate-pulse-soft">{getCategoryIcon(goal.category)}</span>
                              <div>
                                <h3 className="font-medium">{goal.name}</h3>
                                <p className="text-sm text-gray-500">
                                  Data limite: {format(goal.deadline, 'dd MMM yyyy', { locale: ptBR })}
                                </p>
                              </div>
                            </div>
                            <Badge variant="secondary" className="animate-pulse-soft">
                              {goal.status}
                            </Badge>
                          </div>
                          
                          <div className="mt-4 flex-grow">
                            <div className="flex justify-between text-sm mb-2">
                              <span className="font-medium">{formatCurrency(goal.currentAmount)}</span>
                              <span className="text-gray-500">{formatCurrency(goal.targetAmount)}</span>
                            </div>
                            <Progress value={goal.progress} className="h-2 bg-gray-100 dark:bg-gray-800" />
                            <div className="flex justify-between text-xs text-gray-500 mt-2">
                              <span>Progresso: {goal.progress}%</span>
                              <span className="flex items-center text-green-500">
                                <Check className="h-3 w-3 mr-1" /> Concluída
                              </span>
                            </div>
                          </div>
                          
                          <Button variant="ghost" className="w-full mt-6 text-blue-600 dark:text-blue-400 group">
                            <span>Detalhes</span>
                            <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
                          </Button>
                        </CardContent>
                      </Card>
                    </div>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default Metas;
