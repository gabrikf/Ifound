import { createFileRoute, redirect, useNavigate } from "@tanstack/react-router";
import { useCreateMedicine } from "../../hooks/useMedicines";
import { MedicineForm } from "../../components/MedicineForm";
import type { CreateMedicineRequest } from "../../types";

export const Route = createFileRoute("/medicines/new")({
  beforeLoad: () => {
    const token = localStorage.getItem("token");
    if (!token) {
      throw redirect({
        to: "/login",
      });
    }
  },
  component: NewMedicine,
});

function NewMedicine() {
  const navigate = useNavigate();
  const createMedicineMutation = useCreateMedicine();

  const handleSubmit = async (data: CreateMedicineRequest) => {
    try {
      await createMedicineMutation.mutateAsync(data);
      navigate({ to: "/medicines" });
    } catch (error) {
      console.error("Failed to create medicine:", error);
    }
  };

  const handleCancel = () => {
    navigate({ to: "/medicines" });
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">
          Adicionar novo Medicamento
        </h1>
        <p className="text-gray-600 mt-1">
          Preencha os detalhes abaixo para adicionar um novo medicamento ao seu
          inventário.
        </p>
      </div>

      <MedicineForm
        onSubmit={handleSubmit}
        onCancel={handleCancel}
        loading={createMedicineMutation.isPending}
      />
    </div>
  );
}
