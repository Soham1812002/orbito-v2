import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { allocationsApi } from "./allocations.api";
import { RouteAllocationFilters, RouteAllocationFormData } from "./allocations.types";
import { showToast } from "@/lib/toast";

export const ALLOCATION_KEYS = {
  all: ["route-allocations"] as const,
  lists: () => [...ALLOCATION_KEYS.all, "list"] as const,
  list: (filters: RouteAllocationFilters) => [...ALLOCATION_KEYS.lists(), filters] as const
};

export function useRouteAllocations(filters: RouteAllocationFilters = {}) {
  return useQuery({
    queryKey: ALLOCATION_KEYS.list(filters),
    queryFn: () => allocationsApi.getAllocations(filters),
    staleTime: 30000
  });
}

export function useCreateRouteAllocation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: RouteAllocationFormData) => allocationsApi.createAllocation(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ALLOCATION_KEYS.all });
      showToast.success("Corridor allocation assigned successfully");
    },
    onError: (err: any) => {
      showToast.error(err?.response?.data?.message || err?.message || "Failed to create allocation");
    }
  });
}

export function useUpdateRouteAllocation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<RouteAllocationFormData> }) =>
      allocationsApi.updateAllocation(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ALLOCATION_KEYS.all });
      showToast.success("Corridor allocation updated successfully");
    },
    onError: (err: any) => {
      showToast.error(err?.response?.data?.message || err?.message || "Failed to update allocation");
    }
  });
}

export function useDeleteRouteAllocation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => allocationsApi.deleteAllocation(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ALLOCATION_KEYS.all });
      showToast.success("Corridor allocation removed successfully");
    },
    onError: (err: any) => {
      showToast.error(err?.response?.data?.message || err?.message || "Failed to remove allocation");
    }
  });
}
