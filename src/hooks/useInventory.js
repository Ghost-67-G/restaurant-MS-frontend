import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { inventoryService } from "../services/inventory.service";

export const useInventoryItems = (params = {}) => {
  return useQuery({
    queryKey: ["inventory", params],
    queryFn: () => inventoryService.getInventoryItems(params),
  });
};

export const useInventoryItem = (inventoryId) => {
  return useQuery({
    queryKey: ["inventory", inventoryId],
    queryFn: () => inventoryService.getInventoryItem(inventoryId),
    enabled: !!inventoryId,
  });
};

export const useCreateInventoryItem = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: inventoryService.createInventoryItem,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["inventory"] });
    },
  });
};

export const useUpdateInventoryItem = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ inventoryId, data }) =>
      inventoryService.updateInventoryItem(inventoryId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["inventory"] });
    },
  });
};

export const useDeleteInventoryItem = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: inventoryService.deleteInventoryItem,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["inventory"] });
    },
  });
};
