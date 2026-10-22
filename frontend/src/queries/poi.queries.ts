import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { poiApi } from "@/api/poi.api";
import { PoiFilterParams } from "@/types/poi.types";
import { PoiFormData } from "@/schemas/poi.schema";

export const POI_KEYS = {
  all: ["poi"] as const,
  lists: () => [...POI_KEYS.all, "list"] as const,
  list: (params?: PoiFilterParams) => [...POI_KEYS.lists(), params] as const,
  details: () => [...POI_KEYS.all, "detail"] as const,
  detail: (id: string) => [...POI_KEYS.details(), id] as const,
  summaryA: (params?: PoiFilterParams) => [...POI_KEYS.all, "summary-a", params] as const,
  summaryB: (params?: PoiFilterParams) => [...POI_KEYS.all, "summary-b", params] as const,
  missed: (params?: PoiFilterParams) => [...POI_KEYS.all, "missed", params] as const,
  collection: (params?: PoiFilterParams) => [...POI_KEYS.all, "collection", params] as const
};

export function usePoiList(params?: PoiFilterParams) {
  return useQuery({
    queryKey: POI_KEYS.list(params),
    queryFn: () => poiApi.getPoiList(params),
    staleTime: 60 * 1000
  });
}

export function usePoiDetail(id: string) {
  return useQuery({
    queryKey: POI_KEYS.detail(id),
    queryFn: () => poiApi.getPoiById(id),
    enabled: !!id
  });
}

export function useCreatePoi() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: PoiFormData) => poiApi.createPoi(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: POI_KEYS.lists() });
    }
  });
}

export function useUpdatePoi() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<PoiFormData> }) =>
      poiApi.updatePoi(id, data),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: POI_KEYS.lists() });
      queryClient.invalidateQueries({ queryKey: POI_KEYS.detail(variables.id) });
    }
  });
}

export function useDeletePoi() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => poiApi.deletePoi(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: POI_KEYS.lists() });
    }
  });
}

export function usePoiSummaryA(params?: PoiFilterParams) {
  return useQuery({
    queryKey: POI_KEYS.summaryA(params),
    queryFn: () => poiApi.getPoiSummaryA(params),
    staleTime: 60 * 1000
  });
}

export function usePoiSummaryB(params?: PoiFilterParams) {
  return useQuery({
    queryKey: POI_KEYS.summaryB(params),
    queryFn: () => poiApi.getPoiSummaryB(params),
    staleTime: 60 * 1000
  });
}

export function useMissedPoiList(params?: PoiFilterParams) {
  return useQuery({
    queryKey: POI_KEYS.missed(params),
    queryFn: () => poiApi.getMissedPoiList(params),
    staleTime: 60 * 1000
  });
}

export function useCollectionAddressList(params?: PoiFilterParams) {
  return useQuery({
    queryKey: POI_KEYS.collection(params),
    queryFn: () => poiApi.getCollectionAddressList(params),
    staleTime: 60 * 1000
  });
}
