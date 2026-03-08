import { useQuery } from "@tanstack/react-query";
import { reportsService } from "../services/reports.service";

export const useReportsSummary = (params = {}) => {
  return useQuery({
    queryKey: ["reports", "summary", params],
    queryFn: () => reportsService.getSummary(params),
  });
};
