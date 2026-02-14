import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { wasteService } from '../services/waste.service';

// Record waste
export const useRecordWaste = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (wasteData) => wasteService.recordWaste(wasteData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['waste'] });
      queryClient.invalidateQueries({ queryKey: ['inventory'] });
      queryClient.invalidateQueries({ queryKey: ['alerts'] });
    },
  });
};

// Get all waste
export const useWaste = (params) => {
  return useQuery({
    queryKey: ['waste', params],
    queryFn: () => wasteService.getAllWaste(params),
  });
};

// Get waste by ingredient
export const useWasteByIngredient = (ingredientId, params) => {
  return useQuery({
    queryKey: ['waste', 'ingredient', ingredientId, params],
    queryFn: () => wasteService.getWasteByIngredient(ingredientId, params),
    enabled: !!ingredientId,
  });
};

// Get waste statistics
export const useWasteStats = (params) => {
  return useQuery({
    queryKey: ['waste', 'stats', params],
    queryFn: () => wasteService.getWasteStats(params),
  });
};
