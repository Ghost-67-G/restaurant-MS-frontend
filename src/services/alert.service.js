import api from '../lib/api';

export const alertService = {
  // Get all alerts
  getAlerts: async (params) => {
    const response = await api.get('/alerts', { params });
    return response.data;
  },

  // Get active alerts
  getActiveAlerts: async (params) => {
    const response = await api.get('/alerts/active', { params });
    return response.data;
  },

  // Get pending count
  getPendingCount: async () => {
    const response = await api.get('/alerts/pending/count');
    return response.data;
  },

  // Get single alert
  getAlert: async (alertId) => {
    const response = await api.get(`/alerts/${alertId}`);
    return response.data;
  },

  // Acknowledge alert
  acknowledgeAlert: async (alertId) => {
    const response = await api.patch(`/alerts/${alertId}/acknowledge`);
    return response.data;
  },

  // Acknowledge multiple alerts
  acknowledgeMultipleAlerts: async (alertIds) => {
    const response = await api.post('/alerts/acknowledge-multiple', { alertIds });
    return response.data;
  },

  // Check and create alerts
  checkAlerts: async () => {
    const response = await api.post('/alerts/check');
    return response.data;
  },
};
