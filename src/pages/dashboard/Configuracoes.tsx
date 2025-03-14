
import { useEffect } from "react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const Configuracoes = () => {
  useEffect(() => {
    document.title = "MoMoney | Configurações";
  }, []);

  return (
    <DashboardLayout activePage="Configurações">
      <div className="grid gap-6">
        <Card className="w-full animate-fade-in">
          <CardHeader>
            <CardTitle>Configurações do Sistema</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Conteúdo da página de Configurações estará disponível em breve.</p>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default Configuracoes;
