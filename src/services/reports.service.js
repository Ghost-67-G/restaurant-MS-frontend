import api from "../lib/api";

export const reportsService = {
  getSummary: async (params = {}) => {
    const response = await api.get("/reports/summary", { params });
    return response.data;
  },
};
