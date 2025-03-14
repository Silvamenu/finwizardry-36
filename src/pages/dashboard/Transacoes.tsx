
import { useEffect } from "react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const Transacoes = () => {
  useEffect(() => {
    document.title = "MoMoney | Transações";
  }, []);

  return (
    <DashboardLayout activePage="Transações">
      <div className="grid gap-6">
        <Card className="w-full animate-fade-in">
          <CardHeader>
            <CardTitle>Histórico de Transações</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Conteúdo da página de Transações estará disponível em breve.</p>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default Transacoes;
