import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import adjustmentService from '../services/adjustment.service';

export const useOrderAdjustments = (orderId) => {
  return useQuery({
    queryKey: ['adjustments', 'order', orderId],
    queryFn: () => adjustmentService.getOrderAdjustments(orderId),
    enabled: !!orderId,
  });
};

export const useAdjustments = (params) => {
  return useQuery({
    queryKey: ['adjustments', params],
    queryFn: () => adjustmentService.getAdjustments(params),
  });
};

export const useCreateAdjustment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: adjustmentService.createAdjustment,
    onSuccess: (data) => {
      // Invalidate order adjustments
      queryClient.invalidateQueries({ queryKey: ['adjustments', 'order', data.orderId] });
      // Invalidate specific order
      queryClient.invalidateQueries({ queryKey: ['orders', data.orderId] });
      // Invalidate all orders list
      queryClient.invalidateQueries({ queryKey: ['orders'] });
    },
  });
};

export const useRefundOrder = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ orderId, amount, reason }) =>
      adjustmentService.refundOrder(orderId, amount, reason),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['adjustments', 'order', data.orderId] });
      queryClient.invalidateQueries({ queryKey: ['orders', data.orderId] });
      queryClient.invalidateQueries({ queryKey: ['orders'] });
    },
  });
};

export const useVoidOrder = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ orderId, amount, reason }) =>
      adjustmentService.voidOrder(orderId, amount, reason),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['adjustments', 'order', data.orderId] });
      queryClient.invalidateQueries({ queryKey: ['orders', data.orderId] });
      queryClient.invalidateQueries({ queryKey: ['orders'] });
    },
  });
};
