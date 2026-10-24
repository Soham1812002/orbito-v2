import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { immobilizerApi } from "./immobilizer.api";
import { ImmobilizerFilters, LogImmobilizerCommandData } from "./immobilizer.types";
import { showToast } from "@/lib/toast";

export const IMMOBILIZER_KEYS = {
  all: ["immobilizer-audits"] as const,
  lists: () => [...IMMOBILIZER_KEYS.all, "list"] as const,
  list: (filters: ImmobilizerFilters) => [...IMMOBILIZER_KEYS.lists(), filters] as const
};

export function useImmobilizerAudits(filters: ImmobilizerFilters = {}) {
  return useQuery({
    queryKey: IMMOBILIZER_KEYS.list(filters),
    queryFn: () => immobilizerApi.getImmobilizerAudits(filters),
    staleTime: 30000
  });
}

export function useLogImmobilizerCommand() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: LogImmobilizerCommandData) => immobilizerApi.logImmobilizerCommand(data),
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: IMMOBILIZER_KEYS.all });
      showToast.success(`Relay command "${res.command}" dispatched (${res.status})`);
    },
    onError: (err: any) => {
      showToast.error(err?.response?.data?.message || err?.message || "Failed to execute immobilizer command");
    }
  });
}
