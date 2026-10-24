import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { crewApi } from "./crew.api";
import { CrewAllocationFilters, CrewAllocationFormData } from "./crew.types";
import { showToast } from "@/lib/toast";

export const CREW_KEYS = {
  all: ["crew-allocations"] as const,
  lists: () => [...CREW_KEYS.all, "list"] as const,
  list: (filters: CrewAllocationFilters) => [...CREW_KEYS.lists(), filters] as const
};

export function useCrewAllocations(filters: CrewAllocationFilters = {}) {
  return useQuery({
    queryKey: CREW_KEYS.list(filters),
    queryFn: () => crewApi.getCrewAllocations(filters),
    staleTime: 30000
  });
}

export function useCreateCrewAllocation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CrewAllocationFormData) => crewApi.createCrewAllocation(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CREW_KEYS.all });
      showToast.success("Crew roster paired successfully");
    },
    onError: (err: any) => {
      showToast.error(err?.response?.data?.message || err?.message || "Failed to assign crew");
    }
  });
}

export function useUpdateCrewAllocation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<CrewAllocationFormData> }) =>
      crewApi.updateCrewAllocation(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CREW_KEYS.all });
      showToast.success("Crew roster updated successfully");
    },
    onError: (err: any) => {
      showToast.error(err?.response?.data?.message || err?.message || "Failed to update crew roster");
    }
  });
}

export function useDeleteCrewAllocation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => crewApi.deleteCrewAllocation(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CREW_KEYS.all });
      showToast.success("Crew roster assignment removed");
    },
    onError: (err: any) => {
      showToast.error(err?.response?.data?.message || err?.message || "Failed to remove crew");
    }
  });
}
