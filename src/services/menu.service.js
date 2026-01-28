import api from "../lib/api";

export const menuService = {
  getMenuItems: async (params = {}) => {
    const { page = 1, limit = 10, name, categoryId, isAvailable } = params;
    const queryParams = { page, limit };
    
    // Only add optional params if they have values
    if (name) queryParams.name = name;
    if (categoryId) queryParams.categoryId = categoryId;
    if (isAvailable !== undefined) queryParams.isAvailable = isAvailable;
    
    const response = await api.get("/menu/items", {
      params: queryParams,
    });
    return response.data;
  },

  getMenuItem: async (id) => {
    const response = await api.get(`/menu/items/${id}`);
    return response.data;
  },

  createMenuItem: async (data) => {
    const response = await api.post("/menu/items", data);
    return response.data;
  },

  updateMenuItem: async (id, data) => {
    const response = await api.patch(`/menu/items/${id}`, data);
    return response.data;
  },

  deleteMenuItem: async (id) => {
    const response = await api.delete(`/menu/items/${id}`);
    return response.data;
  },
};
