import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ingredientService, ledgerService } from '../services/ingredient.service';
import { toast } from 'react-hot-toast';

export const useIngredients = (params) => {
  return useQuery({
    queryKey: ['ingredients', params],
    queryFn: () => ingredientService.getIngredients(params),
  });
};

export const useIngredient = (id) => {
  return useQuery({
    queryKey: ['ingredient', id],
    queryFn: () => ingredientService.getIngredient(id),
    enabled: !!id,
  });
};

export const useLowStockIngredients = () => {
  return useQuery({
    queryKey: ['ingredients', 'low-stock'],
    queryFn: () => ingredientService.getLowStock(),
  });
};

export const useCreateIngredient = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ingredientService.createIngredient,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ingredients'] });
      toast.success('Ingredient created successfully');
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to create ingredient');
    },
  });
};

export const useUpdateIngredient = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }) => ingredientService.updateIngredient(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['ingredients'] });
      queryClient.invalidateQueries({ queryKey: ['ingredient', variables.id] });
      toast.success('Ingredient updated successfully');
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to update ingredient');
    },
  });
};

export const useDeleteIngredient = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ingredientService.deleteIngredient,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ingredients'] });
      toast.success('Ingredient deleted successfully');
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to delete ingredient');
    },
  });
};

export const useUpdateStock = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, quantity, reason, referenceType }) => ingredientService.updateStock(id, quantity, reason, referenceType),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['ingredients'] });
      queryClient.invalidateQueries({ queryKey: ['ingredient', variables.id] });
      queryClient.invalidateQueries({ queryKey: ['ledger'] });
      toast.success('Stock updated successfully');
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to update stock');
    },
  });
};

// Ledger hooks
export const useLedgerEntries = (params) => {
  return useQuery({
    queryKey: ['ledger', params],
    queryFn: () => ledgerService.getLedgerEntries(params),
  });
};

export const useLedgerByIngredient = (ingredientId, params) => {
  return useQuery({
    queryKey: ['ledger', 'ingredient', ingredientId, params],
    queryFn: () => ledgerService.getLedgerByIngredient(ingredientId, params),
    enabled: !!ingredientId,
  });
};

export const useLedgerStats = (ingredientId, startDate, endDate) => {
  return useQuery({
    queryKey: ['ledger', 'stats', ingredientId, startDate, endDate],
    queryFn: () => ledgerService.getLedgerStats(ingredientId, startDate, endDate),
    enabled: !!ingredientId,
  });
};
