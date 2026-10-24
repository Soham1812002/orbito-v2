import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { vehiclesApi } from "./vehicles.api";
import { VehicleFilters, ImmobilizerCommand, ShareLinkConfig } from "./vehicles.types";
import toast from "react-hot-toast";

export const VEHICLE_QUERY_KEYS = {
  all: ["vehicles"] as const,
  lists: () => [...VEHICLE_QUERY_KEYS.all, "list"] as const,
  list: (filters?: Partial<VehicleFilters>) => [...VEHICLE_QUERY_KEYS.lists(), filters] as const,
  details: () => [...VEHICLE_QUERY_KEYS.all, "detail"] as const,
  detail: (id: string) => [...VEHICLE_QUERY_KEYS.details(), id] as const,
  stats: () => [...VEHICLE_QUERY_KEYS.all, "stats"] as const,
  playback: (id: string, date: string) => [...VEHICLE_QUERY_KEYS.all, "playback", id, date] as const
};

export const useVehicles = (filters?: Partial<VehicleFilters>, refetchInterval: number = 5000) => {
  return useQuery({
    queryKey: VEHICLE_QUERY_KEYS.list(filters),
    queryFn: () => vehiclesApi.getVehicles(filters),
    refetchInterval
  });
};

export const useVehicle = (id?: string) => {
  return useQuery({
    queryKey: VEHICLE_QUERY_KEYS.detail(id || ""),
    queryFn: () => vehiclesApi.getVehicleById(id!),
    enabled: Boolean(id)
  });
};

export const useFleetStats = () => {
  return useQuery({
    queryKey: VEHICLE_QUERY_KEYS.stats(),
    queryFn: () => vehiclesApi.getFleetStats(),
    refetchInterval: 10000
  });
};

export const usePlaybackSession = (vehicleId: string, date: string) => {
  return useQuery({
    queryKey: VEHICLE_QUERY_KEYS.playback(vehicleId, date),
    queryFn: () => vehiclesApi.getPlaybackSession(vehicleId, date),
    enabled: Boolean(vehicleId)
  });
};

export const useImmobilizeVehicle = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (cmd: Omit<ImmobilizerCommand, "dispatchedAt" | "status">) =>
      vehiclesApi.dispatchImmobilizer(cmd),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: VEHICLE_QUERY_KEYS.all });
      if (data.action === "lock") {
        toast.success("Remote Engine Immobilizer ACTIVATED. Relay engaged.");
      } else {
        toast.success("Remote Engine Immobilizer RELEASED. Ignition restored.");
      }
    },
    onError: () => {
      toast.error("Failed to transmit immobilizer signal to vehicle telematics unit.");
    }
  });
};

export const useGenerateShareLink = () => {
  return useMutation({
    mutationFn: (config: Omit<ShareLinkConfig, "shareUrl" | "createdAt" | "expiresAt">) =>
      vehiclesApi.generateShareLink(config),
    onSuccess: () => {
      toast.success("Live tracking share link generated successfully!");
    }
  });
};

export const useSendImmobilizerCommand = useImmobilizeVehicle;
export const useCreateShareLink = useGenerateShareLink;
