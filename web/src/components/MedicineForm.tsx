import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Save, X } from "lucide-react";
import type { Medicine, CreateMedicineRequest } from "../types";

const medicineSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().optional(),
  location: z.string().min(1, "Location is required"),
  category: z.string().min(1, "Category is required"),
  expiryDate: z.string().optional(),
  quantity: z.string().min(1, "Quantity must be at least 1"),
  notes: z.string().optional(),
});

type MedicineFormData = z.infer<typeof medicineSchema>;

interface MedicineFormProps {
  medicine?: Medicine;
  onSubmit: (data: CreateMedicineRequest) => void;
  onCancel?: () => void;
  loading?: boolean;
}

export const MedicineForm = ({
  medicine,
  onSubmit,
  onCancel,
  loading = false,
}: MedicineFormProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<MedicineFormData>({
    resolver: zodResolver(medicineSchema),
    defaultValues: {
      name: medicine?.name || "",
      description: medicine?.description || "",
      location: medicine?.location || "",
      category: medicine?.category || "",
      expiryDate: medicine?.expiryDate
        ? new Date(medicine.expiryDate).toISOString().split("T")[0]
        : "",
      quantity: medicine?.quantity ? String(medicine.quantity) : "1",
      notes: medicine?.notes || "",
    },
  });

  const onFormSubmit = (data: MedicineFormData) => {
    const submitData = {
      ...data,
      quantity: Number(data.quantity),
    };

    // Convert date string to ISO datetime if expiryDate is provided
    if (submitData.expiryDate) {
      const date = new Date(submitData.expiryDate);
      // Set time to end of day to avoid timezone issues
      date.setHours(23, 59, 59, 999);
      submitData.expiryDate = date.toISOString();
    }

    onSubmit(submitData);
  };

  const categories = [
    "Analgésicos",
    "Antibióticos",
    "Antigripe",
    "Digestivos",
    "Cardiovasculares",
    "Vitaminas",
    "Dermatológicos",
    "Controlados",
    "Pediátricos",
    "Homeopáticos",
    "Primeiros Socorros",
    "Outros",
  ];

  const locations = [
    "Armário do quarto",
    "Mesa de cabeceira",
    "Cozinha - armário",
    "Banheiro - armário",
    "Geladeira",
    "Sala de estar",
    "Escritório",
    "Outros",
  ];

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-900">
          {medicine ? "Edit Medicine" : "Adicionar novo Medicamento"}
        </h2>
        {onCancel && (
          <button
            onClick={onCancel}
            className="p-2 hover:bg-gray-100 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Name */}
          <div className="md:col-span-2">
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Nome *
            </label>
            <input
              {...register("name")}
              id="name"
              type="text"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Digite o nome do medicamento"
            />
            {errors.name && (
              <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
            )}
          </div>

          {/* Category */}
          <div>
            <label
              htmlFor="category"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Categoria *
            </label>
            <select
              {...register("category")}
              id="category"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Selecione uma categoria</option>
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
            {errors.category && (
              <p className="mt-1 text-sm text-red-600">
                {errors.category.message}
              </p>
            )}
          </div>

          {/* Location */}
          <div>
            <label
              htmlFor="location"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Localização *
            </label>
            <select
              {...register("location")}
              id="location"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Selecione uma localização</option>
              {locations.map((location) => (
                <option key={location} value={location}>
                  {location}
                </option>
              ))}
            </select>
            {errors.location && (
              <p className="mt-1 text-sm text-red-600">
                {errors.location.message}
              </p>
            )}
          </div>

          {/* Quantity */}
          <div>
            <label
              htmlFor="quantity"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Quantidade *
            </label>
            <input
              {...register("quantity")}
              id="quantity"
              type="number"
              min="1"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="1"
            />
            {errors.quantity && (
              <p className="mt-1 text-sm text-red-600">
                {errors.quantity.message}
              </p>
            )}
          </div>

          {/* Expiry Date */}
          <div>
            <label
              htmlFor="expiryDate"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Data de Validade
            </label>
            <input
              {...register("expiryDate")}
              id="expiryDate"
              type="date"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            {errors.expiryDate && (
              <p className="mt-1 text-sm text-red-600">
                {errors.expiryDate.message}
              </p>
            )}
          </div>

          {/* Description */}
          <div className="md:col-span-2">
            <label
              htmlFor="description"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Descrição
            </label>
            <textarea
              {...register("description")}
              id="description"
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Digite uma breve descrição do medicamento"
            />
          </div>

          {/* Notes */}
          <div className="md:col-span-2">
            <label
              htmlFor="notes"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Anotações
            </label>
            <textarea
              {...register("notes")}
              id="notes"
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Instruções de uso, dosagem, etc."
            />
          </div>
        </div>

        <div className="flex justify-end space-x-3 pt-6 border-t">
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 border border-gray-300 text-gray-700 hover:bg-gray-50 rounded-md transition-colors"
            >
              Cancelar
            </button>
          )}
          <button
            type="submit"
            disabled={loading}
            className="flex items-center px-4 py-2 bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-md transition-colors"
          >
            <Save className="w-4 h-4 mr-2" />
            {loading ? "Salvando..." : "Salvar Medicamento"}
          </button>
        </div>
      </form>
    </div>
  );
};
