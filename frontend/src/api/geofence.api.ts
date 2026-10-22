import apiClient from "@/utils/api";
import {
  GeofenceItem,
  GeofenceSummaryAItem,
  GeofenceSummaryBItem,
  OutOfGeofenceItem,
  GeofenceFilterParams
} from "@/types/geofence.types";
import { GeofenceFormData } from "@/schemas/geofence.schema";
import {
  initialMockGeofenceList,
  mockGeofenceSummaryAList,
  mockGeofenceSummaryBList,
  mockOutOfGeofenceList
} from "./mockGeofenceData";

let inMemoryGeofenceList: GeofenceItem[] = [...initialMockGeofenceList];
let inMemoryDeviations: OutOfGeofenceItem[] = [...mockOutOfGeofenceList];

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const geofenceApi = {
  // 1. Get Geofence Directory
  getGeofenceList: async (
    params?: GeofenceFilterParams
  ): Promise<{ items: GeofenceItem[]; total: number }> => {
    try {
      const response = await apiClient.get("/geofence", { params });
      return response.data?.result || response.data;
    } catch {
      await delay(120);
      let filtered = [...inMemoryGeofenceList];

      if (params?.search) {
        const query = params.search.toLowerCase().trim();
        filtered = filtered.filter(
          (g) =>
            g.name.toLowerCase().includes(query) ||
            g.category.toLowerCase().includes(query) ||
            g.company.toLowerCase().includes(query)
        );
      }

      if (params?.type && params.type !== "ALL") {
        filtered = filtered.filter((g) => g.type === params.type);
      }

      if (params?.category && params.category !== "ALL") {
        filtered = filtered.filter((g) => g.category === params.category);
      }

      return {
        items: filtered,
        total: filtered.length
      };
    }
  },

  // 2. Get Geofence by ID
  getGeofenceById: async (id: string): Promise<GeofenceItem> => {
    try {
      const response = await apiClient.get(`/geofence/${id}`);
      return response.data?.result || response.data;
    } catch {
      await delay(80);
      const found = inMemoryGeofenceList.find((g) => g.id === id);
      if (!found) throw new Error("Geofence not found");
      return found;
    }
  },

  // 3. Create Geofence
  createGeofence: async (data: GeofenceFormData): Promise<GeofenceItem> => {
    try {
      const response = await apiClient.post("/geofence", data);
      return response.data?.result || response.data;
    } catch {
      await delay(150);
      const newGeofence: GeofenceItem = {
        id: `geo-${Date.now()}`,
        name: data.name,
        type: data.type,
        category: data.category,
        company: data.company,
        branch: data.branch,
        centerLatitude: data.centerLatitude,
        centerLongitude: data.centerLongitude,
        radiusMeters: data.radiusMeters || 400,
        speedLimitKmh: data.speedLimitKmh || 30,
        assignedVehiclesCount: 0,
        alertOnEnter: data.alertOnEnter,
        alertOnExit: data.alertOnExit,
        alertOnOverstay: data.alertOnOverstay,
        maxDwellMinutes: data.maxDwellMinutes,
        description: data.description,
        isActive: data.isActive,
        createdAt: new Date().toISOString()
      };
      inMemoryGeofenceList = [newGeofence, ...inMemoryGeofenceList];
      return newGeofence;
    }
  },

  // 4. Update Geofence
  updateGeofence: async (id: string, data: Partial<GeofenceFormData>): Promise<GeofenceItem> => {
    try {
      const response = await apiClient.put(`/geofence/${id}`, data);
      return response.data?.result || response.data;
    } catch {
      await delay(120);
      const index = inMemoryGeofenceList.findIndex((g) => g.id === id);
      if (index === -1) throw new Error("Geofence not found");
      const updated = { ...inMemoryGeofenceList[index], ...data };
      inMemoryGeofenceList[index] = updated;
      return updated;
    }
  },

  // 5. Delete Geofence
  deleteGeofence: async (id: string): Promise<{ success: boolean }> => {
    try {
      const response = await apiClient.delete(`/geofence/${id}`);
      return response.data?.result || response.data;
    } catch {
      await delay(100);
      inMemoryGeofenceList = inMemoryGeofenceList.filter((g) => g.id !== id);
      return { success: true };
    }
  },

  // 6. Get Geofence Summary-A
  getGeofenceSummaryA: async (params?: GeofenceFilterParams): Promise<GeofenceSummaryAItem[]> => {
    try {
      const response = await apiClient.get("/geofence/summary-a", { params });
      return response.data?.result || response.data;
    } catch {
      await delay(100);
      let data = [...mockGeofenceSummaryAList];
      if (params?.search) {
        const q = params.search.toLowerCase();
        data = data.filter((d) => d.geofenceName.toLowerCase().includes(q));
      }
      return data;
    }
  },

  // 7. Get Geofence Summary-B
  getGeofenceSummaryB: async (params?: GeofenceFilterParams): Promise<GeofenceSummaryBItem[]> => {
    try {
      const response = await apiClient.get("/geofence/summary-b", { params });
      return response.data?.result || response.data;
    } catch {
      await delay(100);
      let data = [...mockGeofenceSummaryBList];
      if (params?.search) {
        const q = params.search.toLowerCase();
        data = data.filter(
          (d) =>
            d.vehicleRegNo.toLowerCase().includes(q) ||
            d.geofenceName.toLowerCase().includes(q)
        );
      }
      return data;
    }
  },

  // 8. Get Out of Geofence Deviations
  getOutOfGeofenceList: async (params?: GeofenceFilterParams): Promise<OutOfGeofenceItem[]> => {
    try {
      const response = await apiClient.get("/geofence/out-of-geofence", { params });
      return response.data?.result || response.data;
    } catch {
      await delay(100);
      let data = [...inMemoryDeviations];
      if (params?.search) {
        const q = params.search.toLowerCase();
        data = data.filter(
          (d) =>
            d.vehicleRegNo.toLowerCase().includes(q) ||
            d.driverName.toLowerCase().includes(q) ||
            d.deviationLocation.toLowerCase().includes(q)
        );
      }
      return data;
    }
  },

  // 9. Acknowledge Deviation
  acknowledgeDeviation: async (id: string): Promise<OutOfGeofenceItem> => {
    try {
      const response = await apiClient.post(`/geofence/out-of-geofence/${id}/acknowledge`);
      return response.data?.result || response.data;
    } catch {
      await delay(80);
      const index = inMemoryDeviations.findIndex((d) => d.id === id);
      if (index === -1) throw new Error("Deviation alert not found");
      inMemoryDeviations[index].acknowledged = true;
      return inMemoryDeviations[index];
    }
  }
};

export default geofenceApi;
