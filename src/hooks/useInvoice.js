import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import invoiceService from '../services/invoice.service';

export const useOrderInvoice = (orderId) => {
  return useQuery({
    queryKey: ['invoices', 'order', orderId],
    queryFn: () => invoiceService.getOrderInvoice(orderId),
    enabled: !!orderId,
    retry: false, // Don't retry if invoice doesn't exist
  });
};

export const useInvoices = (params) => {
  return useQuery({
    queryKey: ['invoices', params],
    queryFn: () => invoiceService.getInvoices(params),
  });
};

export const useInvoice = (invoiceId) => {
  return useQuery({
    queryKey: ['invoices', invoiceId],
    queryFn: () => invoiceService.getInvoice(invoiceId),
    enabled: !!invoiceId,
  });
};

export const useCreateInvoice = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: invoiceService.createInvoice,
    onSuccess: (data) => {
      // Invalidate order invoice queries
      queryClient.invalidateQueries({ queryKey: ['invoices', 'order', data.orderId] });
      // Invalidate all invoices list
      queryClient.invalidateQueries({ queryKey: ['invoices'] });
    },
  });
};
