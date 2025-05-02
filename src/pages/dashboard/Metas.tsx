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
  
  const exportGoals = (format: 'csv' | 'json' = 'csv') => {
    try {
      if (format === 'csv') {
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
        
        // Fix: Use template string instead of String()
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
          <div>
            <h1 className="text-3xl font-bold mb-2">Metas Financeiras</h1>
            <p className="text-gray-500">Defina e acompanhe suas metas financeiras</p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" onClick={() => exportGoals('csv')}>
              <Download className="h-4 w-4 mr-2" />
              Exportar
            </Button>
            <Button onClick={() => setShowNewGoalModal(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Nova Meta
            </Button>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Target className="h-5 w-5 mr-2 text-blue-600" />
              Minhas Metas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="all">
              <TabsList>
                <TabsTrigger value="all">Todas</TabsTrigger>
                <TabsTrigger value="active">Em andamento</TabsTrigger>
                <TabsTrigger value="completed">Concluídas</TabsTrigger>
              </TabsList>
              
              <TabsContent value="all" className="mt-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {goals.map(goal => (
                    <Card key={goal.id} className="overflow-hidden hover:shadow-md transition-shadow">
                      <div className={`h-2 ${goal.status === 'concluída' ? 'bg-green-500' : 'bg-blue-500'}`}></div>
                      <CardContent className="pt-6">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex items-center">
                            <span className="text-3xl mr-3">{getCategoryIcon(goal.category)}</span>
                            <div>
                              <h3 className="font-medium">{goal.name}</h3>
                              <p className="text-sm text-gray-500">
                                Data limite: {format(goal.deadline, 'dd MMM yyyy', { locale: ptBR })}
                              </p>
                            </div>
                          </div>
                          <Badge variant={goal.status === 'concluída' ? "secondary" : "default"}>
                            {goal.status}
                          </Badge>
                        </div>
                        
                        <div className="mt-4">
                          <div className="flex justify-between text-sm mb-1">
                            <span>{formatCurrency(goal.currentAmount)}</span>
                            <span>{formatCurrency(goal.targetAmount)}</span>
                          </div>
                          <Progress value={goal.progress} className="h-2" />
                          <div className="flex justify-between text-xs text-gray-500 mt-1">
                            <span>Progresso: {goal.progress}%</span>
                            <span>{goal.status === 'concluída' ? <Check className="h-3 w-3 text-green-500" /> : 'Em andamento'}</span>
                          </div>
                        </div>
                        
                        <Button variant="ghost" className="w-full mt-4 text-blue-600">
                          <span>Detalhes</span>
                          <ArrowRight className="h-4 w-4 ml-2" />
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>
              
              {/* Outras abas serão filtradas por status */}
              <TabsContent value="active">
                {/* Filtro por metas em andamento */}
              </TabsContent>
              
              <TabsContent value="completed">
                {/* Filtro por metas concluídas */}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default Metas;
