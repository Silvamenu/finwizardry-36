
import { useEffect } from "react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const Metas = () => {
  useEffect(() => {
    document.title = "MoMoney | Metas";
  }, []);

  return (
    <DashboardLayout activePage="Metas">
      <div className="grid gap-6">
        <Card className="w-full animate-fade-in">
          <CardHeader>
            <CardTitle>Suas Metas Financeiras</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Conteúdo da página de Metas estará disponível em breve.</p>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default Metas;
