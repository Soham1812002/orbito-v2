import apiClient from "../../utils/api";

export interface AppConfigItem extends Record<string, any> {
  id: string;
  _id?: string;
  moduleKey?: string;
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface AppConfigStats {
  companies: number;
  branches: number;
  vehicles: number;
  devices: number;
  employees: number;
  totalConfigs: number;
  counts: Record<string, number>;
}

export const appConfigApi = {
  getConfigs: async (moduleKey: string, signal?: AbortSignal): Promise<AppConfigItem[]> => {
    const response = await apiClient.get(`/app-configs/${moduleKey}`, { signal });
    if (Array.isArray(response.data?.result)) {
      return response.data.result;
    }
    if (Array.isArray(response.data?.items)) {
      return response.data.items;
    }
    return [];
  },

  getConfigById: async (id: string, signal?: AbortSignal): Promise<AppConfigItem> => {
    const response = await apiClient.get(`/app-configs/item/${id}`, { signal });
    return response.data?.result;
  },

  createConfig: async (
    moduleKey: string,
    payload: Record<string, any>
  ): Promise<AppConfigItem> => {
    const response = await apiClient.post(`/app-configs/${moduleKey}`, payload);
    return response.data?.result;
  },

  updateConfig: async (
    id: string,
    payload: Record<string, any>
  ): Promise<AppConfigItem> => {
    const response = await apiClient.put(`/app-configs/${id}`, payload);
    return response.data?.result;
  },

  deleteConfig: async (id: string): Promise<{ id: string }> => {
    const response = await apiClient.delete(`/app-configs/${id}`);
    return response.data?.result;
  },

  bulkImport: async (
    moduleKey: string,
    items: Record<string, any>[]
  ): Promise<{ count: number; items: any[] }> => {
    const response = await apiClient.post(`/app-configs/${moduleKey}/bulk`, { items });
    return response.data?.result;
  },

  archiveDecommission: async (payload: {
    entityType: string;
    entityId: string;
    entityName?: string;
    reason: string;
    notes?: string;
    operatorName?: string;
  }): Promise<{ success: boolean; archiveId: string; entityId: string }> => {
    const response = await apiClient.post("/app-configs/decommission/archive", payload);
    return response.data?.result;
  },

  getStats: async (signal?: AbortSignal): Promise<AppConfigStats> => {
    const response = await apiClient.get("/app-configs/stats/summary", { signal });
    return response.data?.result;
  }
};
