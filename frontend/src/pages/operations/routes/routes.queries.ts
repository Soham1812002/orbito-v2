import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { routesApi } from "./routes.api";
import { RoutePathFilters, RoutePathFormData } from "./routes.types";
import { showToast } from "@/lib/toast";

export const ROUTE_KEYS = {
  all: ["route-paths"] as const,
  lists: () => [...ROUTE_KEYS.all, "list"] as const,
  list: (filters: RoutePathFilters) => [...ROUTE_KEYS.lists(), filters] as const,
  details: () => [...ROUTE_KEYS.all, "detail"] as const,
  detail: (id: string) => [...ROUTE_KEYS.details(), id] as const
};

export function useRoutePaths(filters: RoutePathFilters = {}) {
  return useQuery({
    queryKey: ROUTE_KEYS.list(filters),
    queryFn: () => routesApi.getRoutePaths(filters),
    staleTime: 30000
  });
}

export function useRoutePathById(id: string) {
  return useQuery({
    queryKey: ROUTE_KEYS.detail(id),
    queryFn: () => routesApi.getRoutePathById(id),
    enabled: Boolean(id)
  });
}

export function useCreateRoutePath() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: RoutePathFormData) => routesApi.createRoutePath(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ROUTE_KEYS.all });
      showToast.success("Route corridor created successfully");
    },
    onError: (err: any) => {
      showToast.error(err?.response?.data?.message || err?.message || "Failed to create route");
    }
  });
}

export function useUpdateRoutePath() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<RoutePathFormData> }) =>
      routesApi.updateRoutePath(id, data),
    onSuccess: (_, vars) => {
      queryClient.invalidateQueries({ queryKey: ROUTE_KEYS.all });
      queryClient.invalidateQueries({ queryKey: ROUTE_KEYS.detail(vars.id) });
      showToast.success("Route corridor updated successfully");
    },
    onError: (err: any) => {
      showToast.error(err?.response?.data?.message || err?.message || "Failed to update route");
    }
  });
}

export function useDeleteRoutePath() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => routesApi.deleteRoutePath(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ROUTE_KEYS.all });
      showToast.success("Route corridor removed successfully");
    },
    onError: (err: any) => {
      showToast.error(err?.response?.data?.message || err?.message || "Failed to delete route");
    }
  });
}
