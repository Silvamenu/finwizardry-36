import { useState, useEffect } from "react";
import { 
  Card, 
  CardHeader, 
  CardTitle, 
  CardContent 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Bot, Sparkles, TrendingUp, TrendingDown, AlertTriangle, Lightbulb } from "lucide-react";
import AnimatedIcon from "@/components/AnimatedIcon";

// Simulated AI insights
const insights = [
  {
    id: 1,
    title: "Padrão de gasto excessivo detectado",
    description: "Identificamos um aumento de 28% em gastos com delivery nos últimos 30 dias comparado à sua média histórica. Considere reduzir a frequência de pedidos para atingir sua meta de economia.",
    type: "alert",
    icon: AlertTriangle,
    color: "red"
  },
  {
    id: 2,
    title: "Oportunidade de investimento",
    description: "Com base no seu perfil conservador e no seu saldo disponível, recomendamos alocar R$ 1.500 em um CDB com liquidez diária e rentabilidade de 102% do CDI.",
    type: "opportunity",
    icon: TrendingUp,
    color: "green"
  },
  {
    id: 3,
    title: "Economia potencial identificada",
    description: "Você está pagando R$ 59,90 por mês em uma assinatura de streaming que não utiliza há 3 meses. Cancelando este serviço, você economizaria R$ 718,80 por ano.",
    type: "saving",
    icon: Lightbulb,
    color: "amber"
  },
  {
    id: 4,
    title: "Alerta de orçamento",
    description: "Você já utilizou 85% do seu orçamento mensal para Alimentação, e ainda faltam 12 dias para o fechamento do mês. Considere ajustar seus gastos para evitar estourar o limite.",
    type: "alert",
    icon: TrendingDown,
    color: "orange"
  },
];

// New simulated insights that appear when the user asks for more
const additionalInsights = [
  {
    id: 5,
    title: "Dica fiscal",
    description: "Baseado nos seus gastos com saúde, você pode deduzir aproximadamente R$ 3.200 no seu próximo Imposto de Renda, resultando em uma restituição estimada de R$ 960.",
    type: "opportunity",
    icon: TrendingUp,
    color: "blue"
  },
  {
    id: 6,
    title: "Inadimplência evitada",
    description: "Detectamos que sua fatura do cartão de crédito vence em 3 dias e você ainda não possui saldo suficiente na conta principal. Recomendamos uma transferência de R$ 1.750 da sua reserva de emergência.",
    type: "alert",
    icon: AlertTriangle,
    color: "red"
  },
];

type InsightType = {
  id: number;
  title: string;
  description: string;
  type: string;
  icon: React.ElementType;
  color: string;
};

const AIInsights = () => {
  const [currentInsights, setCurrentInsights] = useState<InsightType[]>(insights);
  const [loading, setLoading] = useState(false);
  const [thinking, setThinking] = useState(false);
  const [question, setQuestion] = useState("");
  const [response, setResponse] = useState<string | null>(null);

  const handleAskMore = () => {
    setLoading(true);
    
    // Simulate loading
    setTimeout(() => {
      setCurrentInsights([...currentInsights, ...additionalInsights]);
      setLoading(false);
    }, 1500);
  };

  const handleAskQuestion = () => {
    if (!question.trim()) return;
    
    setThinking(true);
    setResponse(null);
    
    // Simulate AI thinking and responding
    setTimeout(() => {
      // Generate a contextual response based on the question
      const lowerQuestion = question.toLowerCase();
      let aiResponse = "";
      
      if (lowerQuestion.includes("investir") || lowerQuestion.includes("investimento")) {
        aiResponse = "Com base na sua reserva atual de R$ 15.840 e seu perfil de investidor moderado, recomendo distribuir seus investimentos da seguinte forma: 40% em renda fixa (CDBs e Tesouro Direto), 30% em fundos multimercado, 20% em ações de empresas consolidadas e 10% em investimentos alternativos. Esta estratégia otimiza seu retorno enquanto mantém um nível de risco aceitável para seu perfil.";
      } else if (lowerQuestion.includes("economia") || lowerQuestion.includes("economizar") || lowerQuestion.includes("poupar")) {
        aiResponse = "Analisando seus gastos dos últimos 6 meses, identifiquei três áreas com potencial de economia: (1) Serviços de streaming - você possui 5 assinaturas com sobreposição de conteúdo, economize R$79,70/mês cancelando serviços duplicados; (2) Delivery - reduzindo em 30% os pedidos, você economizaria R$320/mês; (3) Compras por impulso - estabeleça um limite de 48h para compras acima de R$200, isso pode reduzir gastos em até R$450/mês.";
      } else if (lowerQuestion.includes("dívida") || lowerQuestion.includes("débito") || lowerQuestion.includes("negativo")) {
        aiResponse = "Baseado na sua dívida atual de R$8.200 no cartão de crédito com juros de 12% ao mês, recomendo priorizar a quitação total utilizando parte da sua reserva de emergência, já que a taxa de retorno dos seus investimentos atuais (cerca de 1,2% ao mês) é muito inferior aos juros que você está pagando. Em seguida, reconstrua sua reserva gradualmente com 25% da sua renda mensal.";
      } else {
        aiResponse = "Analisei seus padrões financeiros e posso sugerir algumas ações: 1) Sua reserva de emergência está abaixo do ideal para seu estilo de vida - aumente de 3 para 6 meses de despesas; 2) Seus gastos com alimentação aumentaram 22% nos últimos 3 meses - revise hábitos de consumo; 3) Existe uma oportunidade de renegociação do seu seguro auto que pode gerar economia de até 15% no próximo ano.";
      }
      
      setThinking(false);
      setResponse(aiResponse);
      setQuestion("");
    }, 2500);
  };

  const getColorClass = (color: string) => {
    switch (color) {
      case 'red': return 'bg-red-100 text-red-700';
      case 'green': return 'bg-green-100 text-green-700';
      case 'blue': return 'bg-blue-100 text-blue-700';
      case 'amber': return 'bg-amber-100 text-amber-700';
      case 'orange': return 'bg-orange-100 text-orange-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <Card className="animate-fade-in reveal-delay-2">
      <CardHeader className="flex flex-row items-center justify-between">
        <div className="flex items-center">
          <AnimatedIcon 
            icon={Bot} 
            className="mr-2 h-6 w-6 text-momoney-600" 
            animation="pulse"
          />
          <CardTitle className="text-lg font-medium">Insights Inteligentes</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        
      
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {currentInsights.map((insight) => (
            <div 
              key={insight.id} 
              className="p-4 border rounded-lg hover:shadow-md transition-shadow"
            >
              <div className="flex items-start">
                <div className={`p-2 rounded-full ${getColorClass(insight.color)} mr-3`}>
                  <insight.icon className="h-5 w-5" />
                </div>
                <div>
                  <div className="flex items-center mb-1">
                    <h3 className="font-medium">{insight.title}</h3>
                    <Badge 
                      variant="outline" 
                      className={`ml-2 ${
                        insight.type === 'alert' 
                          ? 'border-red-300 text-red-700' 
                          : insight.type === 'opportunity' 
                            ? 'border-green-300 text-green-700' 
                            : 'border-amber-300 text-amber-700'
                      }`}
                    >
                      {insight.type === 'alert' 
                        ? 'Alerta' 
                        : insight.type === 'opportunity' 
                          ? 'Oportunidade' 
                          : 'Economia'}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-600">{insight.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <div className="flex justify-center mt-4">
          <Button 
            variant="outline" 
            onClick={handleAskMore}
            disabled={loading || currentInsights.length > insights.length}
            className="group"
          >
            {loading ? (
              <span className="flex items-center">
                <span className="animate-spin mr-2 h-4 w-4 border-2 border-momoney-500 border-t-transparent rounded-full"></span>
                Analisando...
              </span>
            ) : currentInsights.length > insights.length ? (
              "Todos os insights exibidos"
            ) : (
              <span className="flex items-center">
                <Sparkles className="mr-2 h-4 w-4 group-hover:animate-pulse" />
                Gerar mais insights
              </span>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default AIInsights;
