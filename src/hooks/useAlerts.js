import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { alertService } from '../services/alert.service';

// Get all alerts
export const useAlerts = (params) => {
  return useQuery({
    queryKey: ['alerts', params],
    queryFn: () => alertService.getAlerts(params),
  });
};

// Get active alerts
export const useActiveAlerts = (params) => {
  return useQuery({
    queryKey: ['alerts', 'active', params],
    queryFn: () => alertService.getActiveAlerts(params),
    refetchInterval: 60000, // Refetch every minute
  });
};

// Get pending count
export const usePendingAlertsCount = () => {
  return useQuery({
    queryKey: ['alerts', 'pending', 'count'],
    queryFn: () => alertService.getPendingCount(),
    refetchInterval: 30000, // Refetch every 30 seconds
  });
};

// Get single alert
export const useAlert = (alertId) => {
  return useQuery({
    queryKey: ['alerts', alertId],
    queryFn: () => alertService.getAlert(alertId),
    enabled: !!alertId,
  });
};

// Acknowledge alert
export const useAcknowledgeAlert = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (alertId) => alertService.acknowledgeAlert(alertId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['alerts'] });
    },
  });
};

// Acknowledge multiple alerts
export const useAcknowledgeMultipleAlerts = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (alertIds) => alertService.acknowledgeMultipleAlerts(alertIds),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['alerts'] });
    },
  });
};

// Check alerts
export const useCheckAlerts = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => alertService.checkAlerts(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['alerts'] });
    },
  });
};
