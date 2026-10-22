import apiClient from "@/utils/api";
import {
  PoiItem,
  PoiSummaryAItem,
  PoiSummaryBItem,
  MissedPoiItem,
  CollectionAddressItem,
  PoiFilterParams
} from "@/types/poi.types";
import { PoiFormData } from "@/schemas/poi.schema";
import {
  initialMockPoiList,
  mockPoiSummaryAList,
  mockPoiSummaryBList,
  mockMissedPoiList,
  mockCollectionAddressList
} from "./mockPoiData";

// In-memory working state for offline client-side interaction
let inMemoryPoiList: PoiItem[] = [...initialMockPoiList];

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const poiApi = {
  // 1. Get POI Directory
  getPoiList: async (params?: PoiFilterParams): Promise<{ items: PoiItem[]; total: number }> => {
    try {
      const response = await apiClient.get("/poi", { params });
      return response.data?.result || response.data;
    } catch {
      await delay(120);
      let filtered = [...inMemoryPoiList];

      if (params?.search) {
        const query = params.search.toLowerCase().trim();
        filtered = filtered.filter(
          (p) =>
            p.name.toLowerCase().includes(query) ||
            p.geoCode.toLowerCase().includes(query) ||
            p.street.toLowerCase().includes(query) ||
            p.city.toLowerCase().includes(query)
        );
      }

      if (params?.company && params.company !== "ALL") {
        filtered = filtered.filter((p) => p.company === params.company);
      }

      if (params?.branch && params.branch !== "ALL") {
        filtered = filtered.filter((p) => p.branch === params.branch);
      }

      if (params?.category && params.category !== "ALL") {
        filtered = filtered.filter((p) => p.category === params.category);
      }

      return {
        items: filtered,
        total: filtered.length
      };
    }
  },

  // 2. Get Single POI by ID
  getPoiById: async (id: string): Promise<PoiItem> => {
    try {
      const response = await apiClient.get(`/poi/${id}`);
      return response.data?.result || response.data;
    } catch {
      await delay(80);
      const found = inMemoryPoiList.find((p) => p.id === id);
      if (!found) {
        throw new Error(`POI with id ${id} not found`);
      }
      return found;
    }
  },

  // 3. Create POI
  createPoi: async (data: PoiFormData): Promise<PoiItem> => {
    try {
      const response = await apiClient.post("/poi", data);
      return response.data?.result || response.data;
    } catch {
      await delay(150);
      const newPoi: PoiItem = {
        id: `poi-${Date.now()}`,
        name: data.name,
        company: data.company,
        branch: data.branch,
        geoCode: `${data.city.slice(0, 3).toUpperCase()}-${data.category.slice(0, 3).toUpperCase()}-${Math.floor(
          100 + Math.random() * 900
        )}`,
        category: data.category,
        street: data.street,
        city: data.city,
        state: data.state,
        latitude: data.latitude,
        longitude: data.longitude,
        description: data.description,
        isActive: data.isActive,
        createdAt: new Date().toISOString()
      };
      inMemoryPoiList = [newPoi, ...inMemoryPoiList];
      return newPoi;
    }
  },

  // 4. Update POI
  updatePoi: async (id: string, data: Partial<PoiFormData>): Promise<PoiItem> => {
    try {
      const response = await apiClient.put(`/poi/${id}`, data);
      return response.data?.result || response.data;
    } catch {
      await delay(120);
      const index = inMemoryPoiList.findIndex((p) => p.id === id);
      if (index === -1) throw new Error("POI not found");
      const updated = { ...inMemoryPoiList[index], ...data };
      inMemoryPoiList[index] = updated;
      return updated;
    }
  },

  // 5. Delete POI
  deletePoi: async (id: string): Promise<{ success: boolean }> => {
    try {
      const response = await apiClient.delete(`/poi/${id}`);
      return response.data?.result || response.data;
    } catch {
      await delay(100);
      inMemoryPoiList = inMemoryPoiList.filter((p) => p.id !== id);
      return { success: true };
    }
  },

  // 6. Get POI Summary-A (Location Stop Summary)
  getPoiSummaryA: async (params?: PoiFilterParams): Promise<PoiSummaryAItem[]> => {
    try {
      const response = await apiClient.get("/poi/summary-a", { params });
      return response.data?.result || response.data;
    } catch {
      await delay(100);
      let data = [...mockPoiSummaryAList];
      if (params?.search) {
        const q = params.search.toLowerCase();
        data = data.filter(
          (d) =>
            d.pointOfInterest.toLowerCase().includes(q) ||
            d.geoCode.toLowerCase().includes(q) ||
            d.branch.toLowerCase().includes(q)
        );
      }
      return data;
    }
  },

  // 7. Get POI Summary-B (Vehicle Stop Summary)
  getPoiSummaryB: async (params?: PoiFilterParams): Promise<PoiSummaryBItem[]> => {
    try {
      const response = await apiClient.get("/poi/summary-b", { params });
      return response.data?.result || response.data;
    } catch {
      await delay(100);
      let data = [...mockPoiSummaryBList];
      if (params?.search) {
        const q = params.search.toLowerCase();
        data = data.filter(
          (d) =>
            d.vehicleRegNo.toLowerCase().includes(q) ||
            d.vehicleModel.toLowerCase().includes(q) ||
            d.imeiNo.includes(q)
        );
      }
      return data;
    }
  },

  // 8. Get Missed POI Summary
  getMissedPoiList: async (params?: PoiFilterParams): Promise<MissedPoiItem[]> => {
    try {
      const response = await apiClient.get("/poi/missed", { params });
      return response.data?.result || response.data;
    } catch {
      await delay(100);
      let data = [...mockMissedPoiList];
      if (params?.search) {
        const q = params.search.toLowerCase();
        data = data.filter(
          (d) =>
            d.vehicleRegNo.toLowerCase().includes(q) ||
            d.vehicleModel.toLowerCase().includes(q)
        );
      }
      return data;
    }
  },

  // 9. Get Collection Address Summary
  getCollectionAddressList: async (params?: PoiFilterParams): Promise<CollectionAddressItem[]> => {
    try {
      const response = await apiClient.get("/poi/collection-address", { params });
      return response.data?.result || response.data;
    } catch {
      await delay(100);
      let data = [...mockCollectionAddressList];
      if (params?.search) {
        const q = params.search.toLowerCase();
        data = data.filter((d) => d.vehicleRegNo.toLowerCase().includes(q));
      }
      return data;
    }
  }
};

export default poiApi;
