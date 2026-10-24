import apiClient from "@/utils/api";
import { RoutePath, RoutePathFilters, RoutePathFormData } from "./routes.types";

const MOCK_ROUTES: RoutePath[] = [
  {
    id: "route-001",
    companyName: "inOrbit Logistics",
    branchName: "West Operations Hub",
    routeCode: "COR-AHM-MUM-01",
    routeName: "Ahmedabad - Mumbai Express Freight",
    originName: "Ahmedabad Central Distribution Centre",
    originLatitude: 23.0225,
    originLongitude: 72.5714,
    destinationName: "Bhiwandi Logistics Park, Mumbai",
    destinationLatitude: 19.2967,
    destinationLongitude: 73.0631,
    distanceKm: 524.5,
    estimatedDurationMins: 540,
    maxAllowedSpeed: 80,
    bufferRadiusMeters: 500,
    isActive: true,
    allocationsCount: 14,
    waypoints: [
      { id: "wp-1", name: "Vadodara Bypass Toll", latitude: 22.3072, longitude: 73.1812, stopSequence: 1, expectedDwellMins: 10, geofenceRadiusMeters: 200 },
      { id: "wp-2", name: "Surat Ring Road Fuel Depot", latitude: 21.1702, longitude: 72.8311, stopSequence: 2, expectedDwellMins: 30, geofenceRadiusMeters: 300 },
      { id: "wp-3", name: "Vapi State Checkpost", latitude: 20.3893, longitude: 72.9106, stopSequence: 3, expectedDwellMins: 15, geofenceRadiusMeters: 150 }
    ],
    createdAt: "2026-10-15T08:00:00Z",
    updatedAt: "2026-10-22T10:30:00Z"
  },
  {
    id: "route-002",
    companyName: "inOrbit Logistics",
    branchName: "North Operations Hub",
    routeCode: "COR-DEL-JAI-02",
    routeName: "Delhi - Jaipur Fast Freight",
    originName: "Gurugram ICD Garhi Harsaru",
    originLatitude: 28.4595,
    originLongitude: 77.0266,
    destinationName: "Sitapura Industrial Area, Jaipur",
    destinationLatitude: 26.9124,
    destinationLongitude: 75.7873,
    distanceKm: 278.0,
    estimatedDurationMins: 310,
    maxAllowedSpeed: 85,
    bufferRadiusMeters: 400,
    isActive: true,
    allocationsCount: 9,
    waypoints: [
      { id: "wp-4", name: "Dharuhera Rest Stop", latitude: 28.2054, longitude: 76.7937, stopSequence: 1, expectedDwellMins: 20, geofenceRadiusMeters: 250 },
      { id: "wp-5", name: "Kotputli Fuel Hub", latitude: 27.7029, longitude: 76.1983, stopSequence: 2, expectedDwellMins: 15, geofenceRadiusMeters: 200 }
    ],
    createdAt: "2026-10-16T09:15:00Z",
    updatedAt: "2026-10-23T14:00:00Z"
  },
  {
    id: "route-003",
    companyName: "inOrbit Logistics",
    branchName: "South Operations Hub",
    routeCode: "COR-BLR-CHN-03",
    routeName: "Bangalore - Chennai Port Intermodal",
    originName: "Electronic City Tech Freight Gate",
    originLatitude: 12.8399,
    originLongitude: 77.677,
    destinationName: "Chennai Harbour Gate 10",
    destinationLatitude: 13.0827,
    destinationLongitude: 80.2707,
    distanceKm: 345.8,
    estimatedDurationMins: 420,
    maxAllowedSpeed: 75,
    bufferRadiusMeters: 350,
    isActive: true,
    allocationsCount: 18,
    waypoints: [
      { id: "wp-6", name: "Hosur Industrial Checkpost", latitude: 12.7409, longitude: 77.8253, stopSequence: 1, expectedDwellMins: 15, geofenceRadiusMeters: 150 },
      { id: "wp-7", name: "Vellore Bypass Station", latitude: 12.9165, longitude: 79.1325, stopSequence: 2, expectedDwellMins: 25, geofenceRadiusMeters: 200 },
      { id: "wp-8", name: "Sriperumbudur Auto Corridor", latitude: 12.9675, longitude: 79.9436, stopSequence: 3, expectedDwellMins: 15, geofenceRadiusMeters: 250 }
    ],
    createdAt: "2026-10-18T11:00:00Z",
    updatedAt: "2026-10-24T04:20:00Z"
  },
  {
    id: "route-004",
    companyName: "inOrbit Logistics",
    branchName: "East Operations Hub",
    routeCode: "COR-KOL-DGP-04",
    routeName: "Kolkata - Durgapur Industrial Supply",
    originName: "Dankuni Railway Freight Terminal",
    originLatitude: 22.6864,
    originLongitude: 88.2933,
    destinationName: "Durgapur Steel Complex Depot",
    destinationLatitude: 23.5204,
    destinationLongitude: 87.3119,
    distanceKm: 172.4,
    estimatedDurationMins: 210,
    maxAllowedSpeed: 70,
    bufferRadiusMeters: 300,
    isActive: false,
    allocationsCount: 0,
    waypoints: [
      { id: "wp-9", name: "Burdwan Junction Bypass", latitude: 23.2324, longitude: 87.8615, stopSequence: 1, expectedDwellMins: 20, geofenceRadiusMeters: 200 }
    ],
    createdAt: "2026-10-10T14:30:00Z",
    updatedAt: "2026-10-20T16:45:00Z"
  },
  {
    id: "route-005",
    companyName: "inOrbit Logistics",
    branchName: "West Operations Hub",
    routeCode: "COR-PUN-HYD-05",
    routeName: "Pune - Hyderabad Highway Courier",
    originName: "Chakan Auto Cluster Gate 3",
    originLatitude: 18.7606,
    originLongitude: 73.8567,
    destinationName: "Shamshabad Cargo Village, Hyderabad",
    destinationLatitude: 17.2403,
    destinationLongitude: 78.4294,
    distanceKm: 560.2,
    estimatedDurationMins: 600,
    maxAllowedSpeed: 80,
    bufferRadiusMeters: 600,
    isActive: true,
    allocationsCount: 11,
    waypoints: [
      { id: "wp-10", name: "Solapur Bypass Fuel Center", latitude: 17.6599, longitude: 75.9064, stopSequence: 1, expectedDwellMins: 30, geofenceRadiusMeters: 300 }
    ],
    createdAt: "2026-10-21T07:10:00Z",
    updatedAt: "2026-10-24T01:00:00Z"
  }
];

export const routesApi = {
  async getRoutePaths(params: RoutePathFilters = {}): Promise<{
    rows: RoutePath[];
    totalCount: number;
    page: number;
    limit: number;
    totalPages: number;
  }> {
    try {
      const res = await apiClient.get("/dispatch/routes", { params });
      return res.data;
    } catch {
      let filtered = [...MOCK_ROUTES];
      if (params.search) {
        const q = params.search.toLowerCase();
        filtered = filtered.filter(
          (r) =>
            r.routeCode.toLowerCase().includes(q) ||
            r.routeName.toLowerCase().includes(q) ||
            r.originName.toLowerCase().includes(q) ||
            r.destinationName.toLowerCase().includes(q)
        );
      }
      if (params.isActive !== undefined && params.isActive !== "all") {
        const activeBool = params.isActive === "true";
        filtered = filtered.filter((r) => r.isActive === activeBool);
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

  async getRoutePathById(id: string): Promise<RoutePath> {
    try {
      const res = await apiClient.get(`/dispatch/routes/${id}`);
      return res.data.result;
    } catch {
      const found = MOCK_ROUTES.find((r) => r.id === id);
      if (found) return found;
      throw new Error(`Route corridor "${id}" not found`);
    }
  },

  async createRoutePath(data: RoutePathFormData): Promise<RoutePath> {
    try {
      const res = await apiClient.post("/dispatch/routes", data);
      return res.data.result;
    } catch {
      const newRoute: RoutePath = {
        ...data,
        id: `route-${Date.now()}`,
        allocationsCount: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      MOCK_ROUTES.unshift(newRoute);
      return newRoute;
    }
  },

  async updateRoutePath(id: string, data: Partial<RoutePathFormData>): Promise<RoutePath> {
    try {
      const res = await apiClient.put(`/dispatch/routes/${id}`, data);
      return res.data.result;
    } catch {
      const index = MOCK_ROUTES.findIndex((r) => r.id === id);
      if (index !== -1) {
        MOCK_ROUTES[index] = {
          ...MOCK_ROUTES[index],
          ...data,
          updatedAt: new Date().toISOString()
        };
        return MOCK_ROUTES[index];
      }
      throw new Error(`Route corridor "${id}" not found`);
    }
  },

  async deleteRoutePath(id: string): Promise<void> {
    try {
      await apiClient.delete(`/dispatch/routes/${id}`);
    } catch {
      const index = MOCK_ROUTES.findIndex((r) => r.id === id);
      if (index !== -1) {
        MOCK_ROUTES.splice(index, 1);
      }
    }
  }
};
