import { useQuery } from "@tanstack/react-query";
import { dashboardService } from "../services/dashboard.service";

export const useDashboard = () => {
  return useQuery({
    queryKey: ["dashboard", "today"],
    queryFn: dashboardService.getTodayStats,
    refetchInterval: 30000, // Refetch every 30 seconds for real-time updates
  });
};
