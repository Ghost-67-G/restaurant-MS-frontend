import api from '../lib/api';

export const ingredientService = {
  getIngredients: async (params = {}) => {
    const { page = 1, limit = 10, name, unit, isActive } = params;
    const queryParams = { page, limit };

    if (name) queryParams.name = name;
    if (unit) queryParams.unit = unit;
    if (isActive !== undefined) queryParams.isActive = isActive;

    const response = await api.get('/ingredients', {
      params: queryParams,
    });
    return response.data;
  },

  getIngredient: async (id) => {
    const response = await api.get(`/ingredients/${id}`);
    return response.data;
  },

  createIngredient: async (data) => {
    const response = await api.post('/ingredients', data);
    return response.data;
  },

  updateIngredient: async (id, data) => {
    const response = await api.patch(`/ingredients/${id}`, data);
    return response.data;
  },

  deleteIngredient: async (id) => {
    const response = await api.delete(`/ingredients/${id}`);
    return response.data;
  },

  updateStock: async (id, quantity, reason, referenceType = 'MANUAL') => {
    const response = await api.patch(`/ingredients/${id}/stock`, { 
      quantity, 
      reason,
      referenceType 
    });
    return response.data;
  },

  getLowStock: async () => {
    const response = await api.get('/ingredients/low-stock');
    return response.data;
  },
};

export const recipeService = {
  getRecipesByMenuItem: async (menuItemId) => {
    const response = await api.get(`/recipes/menu-item/${menuItemId}`);
    return response.data;
  },

  getRecipesByIngredient: async (ingredientId) => {
    const response = await api.get(`/recipes/ingredient/${ingredientId}`);
    return response.data;
  },

  createRecipe: async (data) => {
    const response = await api.post('/recipes', data);
    return response.data;
  },

  updateRecipe: async (id, data) => {
    const response = await api.patch(`/recipes/${id}`, data);
    return response.data;
  },

  deleteRecipe: async (id) => {
    const response = await api.delete(`/recipes/${id}`);
    return response.data;
  },

  updateMenuItemRecipes: async (menuItemId, recipes) => {
    const response = await api.put(`/recipes/menu-item/${menuItemId}`, { recipes });
    return response.data;
  },
};

export const ledgerService = {
  getLedgerEntries: async (params = {}) => {
    const { page = 1, limit = 10, ingredientId, type, referenceType } = params;
    const queryParams = { page, limit };

    if (ingredientId) queryParams.ingredientId = ingredientId;
    if (type) queryParams.type = type;
    if (referenceType) queryParams.referenceType = referenceType;

    const response = await api.get('/ledger', {
      params: queryParams,
    });
    return response.data;
  },

  getLedgerByIngredient: async (ingredientId, params = {}) => {
    const { page = 1, limit = 10 } = params;
    const response = await api.get(`/ledger/ingredient/${ingredientId}`, {
      params: { page, limit },
    });
    return response.data;
  },

  getLedgerEntry: async (id) => {
    const response = await api.get(`/ledger/${id}`);
    return response.data;
  },

  getLedgerStats: async (ingredientId, startDate, endDate) => {
    const params = {};
    if (startDate) params.startDate = startDate;
    if (endDate) params.endDate = endDate;

    const response = await api.get(`/ledger/ingredient/${ingredientId}/stats`, { params });
    return response.data;
  },
};
