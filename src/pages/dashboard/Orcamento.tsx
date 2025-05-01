
import { useEffect, useState } from "react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import BudgetProgress from "@/components/dashboard/BudgetProgress";
import { CategoryForm } from "@/components/transactions/CategoryForm"; 
import { useCategories, CategoryFormData } from "@/hooks/useCategories";
import { toast } from "sonner";

const Orcamento = () => {
  const [categoryFormOpen, setCategoryFormOpen] = useState(false);
  const { addCategory } = useCategories();
  
  useEffect(() => {
    document.title = "MoMoney | Orçamento";
  }, []);

  const handleAddCategory = async (data: CategoryFormData) => {
    try {
      await addCategory(data);
      toast.success("Categoria adicionada com sucesso!");
      setCategoryFormOpen(false);
    } catch (error) {
      console.error("Erro ao adicionar categoria:", error);
      toast.error("Erro ao adicionar categoria");
    }
  };

  return (
    <DashboardLayout activePage="Orçamento">
      {/* Formulário para adicionar categoria */}
      <CategoryForm 
        open={categoryFormOpen} 
        onOpenChange={setCategoryFormOpen}
        onSubmit={handleAddCategory}
        isEditing={false}
      />
      
      <div className="grid gap-6">
        <div className="flex flex-col md:flex-row gap-6 md:items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">Orçamento</h1>
            <p className="text-gray-500">Acompanhe e gerencie seus gastos mensais</p>
          </div>
          <div className="flex gap-3">
            <Button onClick={() => setCategoryFormOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Nova Categoria
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2">
            <Card className="h-full">
              <CardHeader>
                <CardTitle>Visão Geral do Orçamento</CardTitle>
              </CardHeader>
              <CardContent>
                {/* Conteúdo do orçamento */}
                <div className="text-center text-gray-500 py-10">
                  Implemente aqui suas categorias e limites de orçamento
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div>
            <BudgetProgress />
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Orcamento;
