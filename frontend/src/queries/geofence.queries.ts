import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { geofenceApi } from "@/api/geofence.api";
import { GeofenceFilterParams } from "@/types/geofence.types";
import { GeofenceFormData } from "@/schemas/geofence.schema";

export const GEOFENCE_KEYS = {
  all: ["geofence"] as const,
  lists: () => [...GEOFENCE_KEYS.all, "list"] as const,
  list: (params?: GeofenceFilterParams) => [...GEOFENCE_KEYS.lists(), params] as const,
  details: () => [...GEOFENCE_KEYS.all, "detail"] as const,
  detail: (id: string) => [...GEOFENCE_KEYS.details(), id] as const,
  summaryA: (params?: GeofenceFilterParams) => [...GEOFENCE_KEYS.all, "summary-a", params] as const,
  summaryB: (params?: GeofenceFilterParams) => [...GEOFENCE_KEYS.all, "summary-b", params] as const,
  deviations: (params?: GeofenceFilterParams) =>
    [...GEOFENCE_KEYS.all, "deviations", params] as const
};

export function useGeofenceList(params?: GeofenceFilterParams) {
  return useQuery({
    queryKey: GEOFENCE_KEYS.list(params),
    queryFn: () => geofenceApi.getGeofenceList(params),
    staleTime: 60 * 1000
  });
}

export function useGeofenceDetail(id: string) {
  return useQuery({
    queryKey: GEOFENCE_KEYS.detail(id),
    queryFn: () => geofenceApi.getGeofenceById(id),
    enabled: !!id
  });
}

export function useCreateGeofence() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: GeofenceFormData) => geofenceApi.createGeofence(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: GEOFENCE_KEYS.lists() });
    }
  });
}

export function useUpdateGeofence() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<GeofenceFormData> }) =>
      geofenceApi.updateGeofence(id, data),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: GEOFENCE_KEYS.lists() });
      queryClient.invalidateQueries({ queryKey: GEOFENCE_KEYS.detail(variables.id) });
    }
  });
}

export function useDeleteGeofence() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => geofenceApi.deleteGeofence(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: GEOFENCE_KEYS.lists() });
    }
  });
}

export function useGeofenceSummaryA(params?: GeofenceFilterParams) {
  return useQuery({
    queryKey: GEOFENCE_KEYS.summaryA(params),
    queryFn: () => geofenceApi.getGeofenceSummaryA(params),
    staleTime: 60 * 1000
  });
}

export function useGeofenceSummaryB(params?: GeofenceFilterParams) {
  return useQuery({
    queryKey: GEOFENCE_KEYS.summaryB(params),
    queryFn: () => geofenceApi.getGeofenceSummaryB(params),
    staleTime: 60 * 1000
  });
}

export function useOutOfGeofenceList(params?: GeofenceFilterParams) {
  return useQuery({
    queryKey: GEOFENCE_KEYS.deviations(params),
    queryFn: () => geofenceApi.getOutOfGeofenceList(params),
    staleTime: 60 * 1000
  });
}

export function useAcknowledgeDeviation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => geofenceApi.acknowledgeDeviation(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: GEOFENCE_KEYS.deviations() });
    }
  });
}
