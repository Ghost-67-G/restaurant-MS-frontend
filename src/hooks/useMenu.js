import { useQuery, useMutation } from "@tanstack/react-query";
import { menuService } from "../services/menu.service";
import { queryClient } from "../lib/queryClient";

export const useMenuItems = (params = {}) => {
  return useQuery({
    queryKey: ["menuItems", params],
    queryFn: () => menuService.getMenuItems(params),
  });
};

export const useMenuItem = (id) => {
  return useQuery({
    queryKey: ["menuItem", id],
    queryFn: () => menuService.getMenuItem(id),
    enabled: !!id,
  });
};

export const useCreateMenuItem = () => {
  return useMutation({
    mutationFn: menuService.createMenuItem,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["menuItems"] });
    },
  });
};

export const useUpdateMenuItem = () => {
  return useMutation({
    mutationFn: ({ id, data }) => menuService.updateMenuItem(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["menuItems"] });
    },
  });
};

export const useDeleteMenuItem = () => {
  return useMutation({
    mutationFn: menuService.deleteMenuItem,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["menuItems"] });
    },
  });
};
