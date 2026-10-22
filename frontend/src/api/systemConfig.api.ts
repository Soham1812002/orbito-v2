import apiClient from "@/utils/api";
import { SystemConfigItem } from "@/types/config.types";

export type { SystemConfigItem };

export const systemConfigApi = {
  getConfigs: async (moduleKey: string, signal?: AbortSignal): Promise<SystemConfigItem[]> => {
    const response = await apiClient.get(`/system-configs/${moduleKey}`, { signal });
    if (Array.isArray(response.data?.result)) {
      return response.data.result;
    }
    if (Array.isArray(response.data?.items)) {
      return response.data.items;
    }
    return [];
  },

  createConfig: async (
    moduleKey: string,
    payload: Record<string, any>
  ): Promise<SystemConfigItem> => {
    const response = await apiClient.post(`/system-configs/${moduleKey}`, payload);
    return response.data?.result;
  },

  updateConfig: async (
    id: string,
    payload: Record<string, any>
  ): Promise<SystemConfigItem> => {
    const response = await apiClient.put(`/system-configs/${id}`, payload);
    return response.data?.result;
  },

  deleteConfig: async (id: string): Promise<{ id: string }> => {
    const response = await apiClient.delete(`/system-configs/${id}`);
    return response.data?.result;
  },

  getStats: async (signal?: AbortSignal) => {
    const response = await apiClient.get("/system-configs/stats/summary", { signal });
    return response.data?.result;
  }
};
