import { useQuery, useMutation } from "@tanstack/react-query";
import { orderService } from "../services/order.service";
import { queryClient } from "../lib/queryClient";

export const useOrders = (params = {}, options = {}) => {
  return useQuery({
    queryKey: ["orders", params],
    queryFn: () => orderService.getOrders(params),
    ...options,
  });
};

export const useOrder = (orderId) => {
  return useQuery({
    queryKey: ["order", orderId],
    queryFn: () => orderService.getOrder(orderId),
    enabled: !!orderId,
  });
};

export const useCreateOrder = () => {
  return useMutation({
    mutationFn: orderService.createOrder,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["orders"] });
    },
  });
};

export const useUpdateOrder = () => {
  return useMutation({
    mutationFn: ({ orderId, data }) => orderService.updateOrder(orderId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["orders"] });
    },
  });
};

export const useDeleteOrder = () => {
  return useMutation({
    mutationFn: orderService.deleteOrder,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["orders"] });
    },
  });
};
