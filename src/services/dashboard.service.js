import api from "../lib/api";

export const dashboardService = {
  getTodayStats: async () => {
    const response = await api.get("/dashboard/today");
    return response.data;
  },
};
