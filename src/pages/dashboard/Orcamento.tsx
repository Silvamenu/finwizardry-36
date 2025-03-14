
import { useEffect } from "react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const Orcamento = () => {
  useEffect(() => {
    document.title = "MoMoney | Orçamento";
  }, []);

  return (
    <DashboardLayout activePage="Orçamento">
      <div className="grid gap-6">
        <Card className="w-full animate-fade-in">
          <CardHeader>
            <CardTitle>Orçamento Mensal</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Conteúdo da página de Orçamento estará disponível em breve.</p>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default Orcamento;
