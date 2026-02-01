import api from "../lib/api";

export const taxService = {
  getTaxes: async () => {
    const response = await api.get("/tax");
    return response.data;
  },

  getActiveTax: async () => {
    const response = await api.get("/tax/active");
    return response.data;
  },

  getTax: async (taxId) => {
    const response = await api.get(`/tax/${taxId}`);
    return response.data;
  },

  createTax: async (data) => {
    const response = await api.post("/tax", data);
    return response.data;
  },

  updateTax: async (taxId, data) => {
    const response = await api.patch(`/tax/${taxId}`, data);
    return response.data;
  },

  deleteTax: async (taxId) => {
    const response = await api.delete(`/tax/${taxId}`);
    return response.data;
  },
};
