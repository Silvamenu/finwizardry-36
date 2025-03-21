
import { useEffect } from "react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { PlusCircle, Calendar, Trophy, Car, Home, Plane, Briefcase, GraduationCap } from "lucide-react";

interface Goal {
  id: number;
  name: string;
  category: string;
  target: number;
  current: number;
  deadline: string;
  icon: any;
  status: "em andamento" | "atrasada" | "completa";
}

const goals: Goal[] = [
  {
    id: 1,
    name: "Fundo de Emergência",
    category: "Poupança",
    target: 10000,
    current: 6500,
    deadline: "Dezembro 2023",
    icon: Briefcase,
    status: "em andamento"
  },
  {
    id: 2,
    name: "Viagem para Europa",
    category: "Lazer",
    target: 15000,
    current: 3200,
    deadline: "Julho 2024",
    icon: Plane,
    status: "em andamento"
  },
  {
    id: 3,
    name: "Novo Carro",
    category: "Bens",
    target: 50000,
    current: 12000,
    deadline: "Outubro 2024",
    icon: Car,
    status: "em andamento"
  },
  {
    id: 4,
    name: "Pós-graduação",
    category: "Educação",
    target: 20000,
    current: 5000,
    deadline: "Janeiro 2024",
    icon: GraduationCap,
    status: "atrasada"
  },
  {
    id: 5,
    name: "Entrada para Casa Própria",
    category: "Imóvel",
    target: 100000,
    current: 35000,
    deadline: "Dezembro 2025",
    icon: Home,
    status: "em andamento"
  }
];

const GoalCard = ({ goal }: { goal: Goal }) => {
  const progress = Math.round((goal.current / goal.target) * 100);
  
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'em andamento':
        return <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">Em andamento</Badge>;
      case 'atrasada':
        return <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">Atrasada</Badge>;
      case 'completa':
        return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Completa</Badge>;
      default:
        return null;
    }
  };
  
  return (
    <Card className="overflow-hidden hover:shadow-md transition-shadow duration-300">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start mb-2">
          <div className="p-2 rounded-lg bg-momoney-100">
            <goal.icon className="h-5 w-5 text-momoney-600" />
          </div>
          {getStatusBadge(goal.status)}
        </div>
        <CardTitle>{goal.name}</CardTitle>
        <CardDescription>{goal.category}</CardDescription>
      </CardHeader>
      <CardContent className="pb-2">
        <div className="space-y-4">
          <div>
            <div className="flex justify-between mb-1 text-sm">
              <span>Progresso: {progress}%</span>
              <span>R$ {goal.current.toLocaleString('pt-BR')} / R$ {goal.target.toLocaleString('pt-BR')}</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
          <div className="flex items-center text-sm text-gray-500">
            <Calendar className="h-4 w-4 mr-1 inline" />
            Prazo: {goal.deadline}
          </div>
        </div>
      </CardContent>
      <CardFooter className="pt-2 flex gap-2">
        <Button variant="outline" size="sm" className="flex-1">Editar</Button>
        <Button variant="clean" size="sm" className="flex-1">Adicionar</Button>
      </CardFooter>
    </Card>
  );
};

const SummaryCard = ({ title, value, icon: Icon, color }: any) => (
  <Card>
    <CardContent className="p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-500">{title}</p>
          <p className="text-2xl font-bold">{value}</p>
        </div>
        <div className={`p-3 rounded-full ${color}`}>
          <Icon className="h-6 w-6 text-white" />
        </div>
      </div>
    </CardContent>
  </Card>
);

const Metas = () => {
  useEffect(() => {
    document.title = "MoMoney | Metas";
  }, []);

  // Calcular estatísticas
  const totalGoals = goals.length;
  const totalSaved = goals.reduce((sum, goal) => sum + goal.current, 0);
  const totalTarget = goals.reduce((sum, goal) => sum + goal.target, 0);
  const avgProgress = Math.round(goals.reduce((sum, goal) => sum + (goal.current / goal.target), 0) / totalGoals * 100);

  return (
    <DashboardLayout activePage="Metas">
      <div className="grid gap-6">
        <div className="flex flex-col md:flex-row gap-6 md:items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">Suas Metas Financeiras</h1>
            <p className="text-gray-500">Acompanhe o progresso das suas metas e realize seus sonhos</p>
          </div>
          <Button className="animate-fade-in" variant="clean">
            <PlusCircle className="h-4 w-4 mr-2" />
            Nova Meta
          </Button>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <SummaryCard 
            title="Total Economizado" 
            value={`R$ ${totalSaved.toLocaleString('pt-BR')}`} 
            icon={Briefcase} 
            color="bg-blue-500" 
          />
          <SummaryCard 
            title="Meta Total" 
            value={`R$ ${totalTarget.toLocaleString('pt-BR')}`} 
            icon={Trophy} 
            color="bg-purple-500" 
          />
          <SummaryCard 
            title="Progresso Médio" 
            value={`${avgProgress}%`} 
            icon={Trophy} 
            color="bg-green-500" 
          />
          <SummaryCard 
            title="Total de Metas" 
            value={totalGoals} 
            icon={Calendar} 
            color="bg-orange-500" 
          />
        </div>

        {/* Goals Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {goals.map(goal => (
            <GoalCard key={goal.id} goal={goal} />
          ))}
          
          {/* Add Goal Card */}
          <Card className="flex flex-col items-center justify-center p-8 border-dashed border-2 bg-gray-50 dark:bg-gray-800/50 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors cursor-pointer">
            <PlusCircle className="h-10 w-10 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-600 dark:text-gray-300">Adicionar Nova Meta</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 text-center mt-2">
              Defina seus objetivos financeiros e acompanhe seu progresso
            </p>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Metas;
