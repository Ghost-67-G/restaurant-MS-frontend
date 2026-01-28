import api from "../lib/api";

export const orderService = {
  createOrder: async (data) => {
    const response = await api.post("/orders", data);
    return response.data;
  },

  getOrders: async (params = {}) => {
    const { page = 1, limit = 10, status, sortBy } = params;
    const response = await api.get("/orders", {
      params: { page, limit, status, sortBy },
    });
    return response.data;
  },

  getOrder: async (orderId) => {
    const response = await api.get(`/orders/${orderId}`);
    return response.data;
  },

  updateOrder: async (orderId, data) => {
    const response = await api.patch(`/orders/${orderId}`, data);
    return response.data;
  },

  deleteOrder: async (orderId) => {
    const response = await api.delete(`/orders/${orderId}`);
    return response.data;
  },
};
