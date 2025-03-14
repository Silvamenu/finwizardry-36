
import { useEffect } from "react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const Investimentos = () => {
  useEffect(() => {
    document.title = "MoMoney | Investimentos";
  }, []);

  return (
    <DashboardLayout activePage="Investimentos">
      <div className="grid gap-6">
        <Card className="w-full animate-fade-in">
          <CardHeader>
            <CardTitle>Seus Investimentos</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Conteúdo da página de Investimentos estará disponível em breve.</p>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default Investimentos;
