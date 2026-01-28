import api from "../lib/api";

export const inventoryService = {
  getInventoryItems: async (params = {}) => {
    const response = await api.get("/inventory", { params });
    return response.data;
  },

  getInventoryItem: async (inventoryId) => {
    const response = await api.get(`/inventory/${inventoryId}`);
    return response.data;
  },

  createInventoryItem: async (data) => {
    const response = await api.post("/inventory", data);
    return response.data;
  },

  updateInventoryItem: async (inventoryId, data) => {
    const response = await api.patch(`/inventory/${inventoryId}`, data);
    return response.data;
  },

  deleteInventoryItem: async (inventoryId) => {
    const response = await api.delete(`/inventory/${inventoryId}`);
    return response.data;
  },
};
