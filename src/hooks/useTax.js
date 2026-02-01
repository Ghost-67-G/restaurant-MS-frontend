import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { taxService } from "../services/tax.service";

export const useTaxes = () => {
  return useQuery({
    queryKey: ["taxes"],
    queryFn: taxService.getTaxes,
  });
};

export const useActiveTax = () => {
  return useQuery({
    queryKey: ["activeTax"],
    queryFn: taxService.getActiveTax,
  });
};

export const useTax = (taxId) => {
  return useQuery({
    queryKey: ["tax", taxId],
    queryFn: () => taxService.getTax(taxId),
    enabled: !!taxId,
  });
};

export const useCreateTax = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: taxService.createTax,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["taxes"] });
      queryClient.invalidateQueries({ queryKey: ["activeTax"] });
    },
  });
};

export const useUpdateTax = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ taxId, data }) => taxService.updateTax(taxId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["taxes"] });
      queryClient.invalidateQueries({ queryKey: ["activeTax"] });
    },
  });
};

export const useDeleteTax = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: taxService.deleteTax,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["taxes"] });
      queryClient.invalidateQueries({ queryKey: ["activeTax"] });
    },
  });
};
