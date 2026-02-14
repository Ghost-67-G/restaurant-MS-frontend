import api from '../lib/api';

export const wasteService = {
  // Record waste
  recordWaste: async (wasteData) => {
    const response = await api.post('/waste', wasteData);
    return response.data;
  },

  // Get all waste entries
  getAllWaste: async (params) => {
    const response = await api.get('/waste', { params });
    return response.data;
  },

  // Get waste by ingredient
  getWasteByIngredient: async (ingredientId, params) => {
    const response = await api.get(`/waste/ingredient/${ingredientId}`, { params });
    return response.data;
  },

  // Get waste statistics
  getWasteStats: async (params) => {
    const response = await api.get('/waste/stats', { params });
    return response.data;
  },
};
