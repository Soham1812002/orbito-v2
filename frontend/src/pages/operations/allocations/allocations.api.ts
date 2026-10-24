import apiClient from "@/utils/api";
import { RoutePathAllocation, RouteAllocationFilters, RouteAllocationFormData } from "./allocations.types";

const MOCK_ALLOCATIONS: RoutePathAllocation[] = [
  {
    id: "alloc-001",
    companyName: "inOrbit Logistics",
    branchName: "West Operations Hub",
    routePathId: "route-001",
    routeCode: "COR-AHM-MUM-01",
    routeName: "Ahmedabad - Mumbai Express Freight",
    originName: "Ahmedabad Central Depot",
    destinationName: "Bhiwandi Logistics Park, Mumbai",
    vehicleId: "veh-001",
    vehiclePlate: "GJ 05 AB 1234",
    allocationName: "Daily Overnight Express Shuttle A",
    scheduleType: "daily",
    activeDays: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    departureTime: "20:00",
    maxTransitHours: 12,
    allowDeviation: false,
    deviationAlertThresholdMeters: 300,
    isActive: true,
    createdAt: "2026-10-18T10:00:00Z",
    updatedAt: "2026-10-23T15:00:00Z"
  },
  {
    id: "alloc-002",
    companyName: "inOrbit Logistics",
    branchName: "West Operations Hub",
    routePathId: "route-001",
    routeCode: "COR-AHM-MUM-01",
    routeName: "Ahmedabad - Mumbai Express Freight",
    originName: "Ahmedabad Central Depot",
    destinationName: "Bhiwandi Logistics Park, Mumbai",
    vehicleId: "veh-002",
    vehiclePlate: "GJ 01 KM 4821",
    allocationName: "Weekday High-Value Transit Run",
    scheduleType: "weekdays",
    activeDays: ["Mon", "Tue", "Wed", "Thu", "Fri"],
    departureTime: "06:30",
    maxTransitHours: 11,
    allowDeviation: false,
    deviationAlertThresholdMeters: 250,
    isActive: true,
    createdAt: "2026-10-19T08:30:00Z",
    updatedAt: "2026-10-24T05:00:00Z"
  },
  {
    id: "alloc-003",
    companyName: "inOrbit Logistics",
    branchName: "North Operations Hub",
    routePathId: "route-002",
    routeCode: "COR-DEL-JAI-02",
    routeName: "Delhi - Jaipur Fast Freight",
    originName: "Gurugram ICD Garhi Harsaru",
    destinationName: "Sitapura Industrial Area, Jaipur",
    vehicleId: "veh-003",
    vehiclePlate: "DL 01 AB 7582",
    allocationName: "Morning Component Supply",
    scheduleType: "daily",
    activeDays: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
    departureTime: "05:00",
    maxTransitHours: 6,
    allowDeviation: true,
    deviationAlertThresholdMeters: 500,
    isActive: true,
    createdAt: "2026-10-20T11:00:00Z",
    updatedAt: "2026-10-23T18:00:00Z"
  },
  {
    id: "alloc-004",
    companyName: "inOrbit Logistics",
    branchName: "South Operations Hub",
    routePathId: "route-003",
    routeCode: "COR-BLR-CHN-03",
    routeName: "Bangalore - Chennai Port Intermodal",
    originName: "Electronic City Gate",
    destinationName: "Chennai Harbour Gate 10",
    vehicleId: "veh-004",
    vehiclePlate: "KA 03 HA 9922",
    allocationName: "Container Port Transfer B",
    scheduleType: "on_demand",
    departureTime: "22:00",
    maxTransitHours: 10,
    allowDeviation: false,
    deviationAlertThresholdMeters: 400,
    isActive: true,
    createdAt: "2026-10-22T14:00:00Z",
    updatedAt: "2026-10-24T02:00:00Z"
  },
  {
    id: "alloc-005",
    companyName: "inOrbit Logistics",
    branchName: "East Operations Hub",
    routePathId: "route-004",
    routeCode: "COR-KOL-DGP-04",
    routeName: "Kolkata - Durgapur Industrial Supply",
    originName: "Dankuni Railway Terminal",
    destinationName: "Durgapur Steel Complex",
    vehicleId: "veh-005",
    vehiclePlate: "WB 02 BB 3391",
    allocationName: "Raw Ore Haulage Group",
    scheduleType: "custom",
    activeDays: ["Tue", "Thu", "Sat"],
    departureTime: "04:00",
    maxTransitHours: 5,
    allowDeviation: false,
    deviationAlertThresholdMeters: 300,
    isActive: false,
    createdAt: "2026-10-15T09:00:00Z",
    updatedAt: "2026-10-21T12:00:00Z"
  }
];

export const allocationsApi = {
  async getAllocations(params: RouteAllocationFilters = {}): Promise<{
    rows: RoutePathAllocation[];
    totalCount: number;
    page: number;
    limit: number;
    totalPages: number;
  }> {
    try {
      const res = await apiClient.get("/dispatch/allocations", { params });
      return res.data;
    } catch {
      let filtered = [...MOCK_ALLOCATIONS];
      if (params.search) {
        const q = params.search.toLowerCase();
        filtered = filtered.filter(
          (a) =>
            a.allocationName.toLowerCase().includes(q) ||
            a.vehiclePlate.toLowerCase().includes(q) ||
            (a.routeCode && a.routeCode.toLowerCase().includes(q))
        );
      }
      if (params.scheduleType && params.scheduleType !== "all") {
        filtered = filtered.filter((a) => a.scheduleType === params.scheduleType);
      }
      if (params.routePathId && params.routePathId !== "all") {
        filtered = filtered.filter((a) => a.routePathId === params.routePathId);
      }
      return {
        rows: filtered,
        totalCount: filtered.length,
        page: params.page || 1,
        limit: params.limit || 20,
        totalPages: Math.ceil(filtered.length / (params.limit || 20))
      };
    }
  },

  async createAllocation(data: RouteAllocationFormData): Promise<RoutePathAllocation> {
    try {
      const res = await apiClient.post("/dispatch/allocations", data);
      return res.data.result;
    } catch {
      const newAlloc: RoutePathAllocation = {
        ...data,
        id: `alloc-${Date.now()}`,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      MOCK_ALLOCATIONS.unshift(newAlloc);
      return newAlloc;
    }
  },

  async updateAllocation(id: string, data: Partial<RouteAllocationFormData>): Promise<RoutePathAllocation> {
    try {
      const res = await apiClient.put(`/dispatch/allocations/${id}`, data);
      return res.data.result;
    } catch {
      const index = MOCK_ALLOCATIONS.findIndex((a) => a.id === id);
      if (index !== -1) {
        MOCK_ALLOCATIONS[index] = {
          ...MOCK_ALLOCATIONS[index],
          ...data,
          updatedAt: new Date().toISOString()
        };
        return MOCK_ALLOCATIONS[index];
      }
      throw new Error(`Allocation "${id}" not found`);
    }
  },

  async deleteAllocation(id: string): Promise<void> {
    try {
      await apiClient.delete(`/dispatch/allocations/${id}`);
    } catch {
      const index = MOCK_ALLOCATIONS.findIndex((a) => a.id === id);
      if (index !== -1) {
        MOCK_ALLOCATIONS.splice(index, 1);
      }
    }
  }
};
