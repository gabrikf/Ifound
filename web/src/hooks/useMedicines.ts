import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { medicinesApi } from "../lib/api";
import type { CreateMedicineRequest, UpdateMedicineRequest } from "../types";

// Query keys
export const medicineKeys = {
  all: ["medicines"] as const,
  lists: () => [...medicineKeys.all, "list"] as const,
  list: (filters: string) => [...medicineKeys.lists(), { filters }] as const,
  details: () => [...medicineKeys.all, "detail"] as const,
  detail: (id: number) => [...medicineKeys.details(), id] as const,
};

// Get all medicines
export const useMedicines = () => {
  return useQuery({
    queryKey: medicineKeys.lists(),
    queryFn: medicinesApi.getAll,
  });
};

// Get medicine by id
export const useMedicine = (id: number) => {
  return useQuery({
    queryKey: medicineKeys.detail(id),
    queryFn: () => medicinesApi.getById(id),
    enabled: !!id,
  });
};

// Create medicine
export const useCreateMedicine = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateMedicineRequest) => medicinesApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: medicineKeys.lists() });
    },
  });
};

// Update medicine
export const useUpdateMedicine = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateMedicineRequest }) =>
      medicinesApi.update(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: medicineKeys.lists() });
      queryClient.invalidateQueries({ queryKey: medicineKeys.detail(id) });
    },
  });
};

// Delete medicine
export const useDeleteMedicine = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => medicinesApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: medicineKeys.lists() });
    },
  });
};
