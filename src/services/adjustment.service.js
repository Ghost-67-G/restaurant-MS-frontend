import api from '../lib/api';

const adjustmentService = {
  createAdjustment: async (adjustmentData) => {
    const response = await api.post('/adjustments', adjustmentData);
    return response.data;
  },

  getAdjustments: async (params) => {
    const response = await api.get('/adjustments', { params });
    return response.data;
  },

  getAdjustment: async (adjustmentId) => {
    const response = await api.get(`/adjustments/${adjustmentId}`);
    return response.data;
  },

  getOrderAdjustments: async (orderId) => {
    const response = await api.get(`/adjustments/order/${orderId}`);
    return response.data;
  },

  refundOrder: async (orderId, amount, reason) => {
    return adjustmentService.createAdjustment({
      orderId,
      type: 'REFUND',
      amount,
      reason,
    });
  },

  voidOrder: async (orderId, amount, reason) => {
    return adjustmentService.createAdjustment({
      orderId,
      type: 'VOID',
      amount,
      reason,
    });
  },
};

export default adjustmentService;
