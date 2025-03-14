
import { useEffect } from "react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const Assistente = () => {
  useEffect(() => {
    document.title = "MoMoney | Assistente IA";
  }, []);

  return (
    <DashboardLayout activePage="Assistente IA">
      <div className="grid gap-6">
        <Card className="w-full animate-fade-in">
          <CardHeader>
            <CardTitle>Assistente de Inteligência Artificial</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Conteúdo da página do Assistente IA estará disponível em breve.</p>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default Assistente;
