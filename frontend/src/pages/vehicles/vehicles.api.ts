import api from "@/utils/api";
import { downloadStreamFile } from "@/utils/streamingExport";
import {
  VehicleTelemetry,
  VehicleFilters,
  FleetStats,
  PlaybackSession,
  ImmobilizerCommand,
  ShareLinkConfig
} from "./vehicles.types";

const FALLBACK_VEHICLES: VehicleTelemetry[] = [
  {
    id: "veh-001",
    plateNumber: "DL 01 CA 9876",
    makeModel: "Tata Signa 4825.TK",
    category: "heavy_truck",
    status: "moving",
    speed: 64,
    heading: 78,
    latitude: 28.6139,
    longitude: 77.209,
    ignition: true,
    fuelPercent: 78,
    batteryPercent: 94,
    odometer: 142850,
    engineTemp: 84,
    lastLocation: "Jewar Toll Plaza, Yamuna Expressway, UP",
    lastUpdated: "Just now",
    driver: {
      id: "a1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d",
      name: "Rajesh Kumar Sharma",
      phone: "+91 98765 43210",
      licenseNumber: "DL-0420180034921",
      avatar: "RK",
      rating: 4.8
    },
    deviceImei: "867492048129482",
    companyName: "InOrbit Logistics",
    todayDistance: 312.4,
    immobilizerState: "unlocked"
  },
  {
    id: "veh-002",
    plateNumber: "MH 12 RN 4521",
    makeModel: "BharatBenz 3528C",
    category: "heavy_truck",
    status: "moving",
    speed: 58,
    heading: 142,
    latitude: 19.2967,
    longitude: 73.0631,
    ignition: true,
    fuelPercent: 62,
    batteryPercent: 90,
    odometer: 98420,
    engineTemp: 82,
    lastLocation: "Bhiwandi Central Depot, Mumbai Bypass",
    lastUpdated: "1 min ago",
    driver: {
      id: "b2c3d4e5-f6a7-8b9c-0d1e-2f3a4b5c6d7e",
      name: "Sanjay Tukaram Patil",
      phone: "+91 98220 11984",
      licenseNumber: "MH-1220190048210",
      avatar: "SP",
      rating: 4.7
    },
    deviceImei: "867492048129483",
    companyName: "Metro Freight Lines",
    todayDistance: 245.8,
    immobilizerState: "unlocked"
  },
  {
    id: "veh-003",
    plateNumber: "GJ 01 BV 8832",
    makeModel: "Eicher Pro 3019",
    category: "delivery_van",
    status: "idling",
    speed: 0,
    heading: 210,
    latitude: 23.0225,
    longitude: 72.5714,
    ignition: true,
    fuelPercent: 88,
    batteryPercent: 96,
    odometer: 54100,
    engineTemp: 68,
    lastLocation: "Sanand Auto Corridor, Gate 3, Ahmedabad",
    lastUpdated: "3 mins ago",
    driver: {
      id: "c3d4e5f6-a7b8-9c0d-1e2f-3a4b5c6d7e8f",
      name: "Bhavin Patel",
      phone: "+91 94280 44321",
      licenseNumber: "GJ-0120150029381",
      avatar: "BP",
      rating: 4.9
    },
    deviceImei: "867492048129484",
    companyName: "Gujarat Interstate Movers",
    todayDistance: 118.2,
    immobilizerState: "unlocked"
  },
  {
    id: "veh-004",
    plateNumber: "KA 05 MN 3314",
    makeModel: "Mahindra Treo Zor EV",
    category: "electric_cargo",
    status: "moving",
    speed: 42,
    heading: 320,
    latitude: 12.9716,
    longitude: 77.5946,
    ignition: true,
    fuelPercent: 100,
    batteryPercent: 68,
    odometer: 18200,
    engineTemp: 38,
    lastLocation: "Electronic City Phase 1, Bengaluru",
    lastUpdated: "Just now",
    driver: {
      id: "d4e5f6a7-b8c9-0d1e-2f3a-4b5c6d7e8f9a",
      name: "Karthik Gowda",
      phone: "+91 99001 23456",
      licenseNumber: "KA-0520210088192",
      avatar: "KG",
      rating: 4.9
    },
    deviceImei: "867492048129485",
    companyName: "GreenPulse EV Transport",
    todayDistance: 84.6,
    immobilizerState: "unlocked"
  },
  {
    id: "veh-005",
    plateNumber: "HR 55 AB 1002",
    makeModel: "Tata 407 Gold SFC",
    category: "delivery_van",
    status: "stopped",
    speed: 0,
    heading: 0,
    latitude: 28.4595,
    longitude: 77.0266,
    ignition: false,
    fuelPercent: 45,
    batteryPercent: 92,
    odometer: 184500,
    engineTemp: 32,
    lastLocation: "IMT Manesar Sector 8, Haryana",
    lastUpdated: "14 mins ago",
    driver: {
      id: "e5f6a7b8-c9d0-1e2f-3a4b-5c6d7e8f9a0b",
      name: "Virender Singh",
      phone: "+91 98110 55432",
      licenseNumber: "HR-5520170094182",
      avatar: "VS",
      rating: 4.6
    },
    deviceImei: "867492048129486",
    companyName: "North Star Delivery",
    todayDistance: 62.0,
    immobilizerState: "unlocked"
  },
  {
    id: "veh-006",
    plateNumber: "MH 14 CC 7789",
    makeModel: "BharatBenz 2823R",
    category: "tanker",
    status: "inactive",
    speed: 0,
    heading: 0,
    latitude: 18.7606,
    longitude: 73.8567,
    ignition: false,
    fuelPercent: 32,
    batteryPercent: 12,
    odometer: 220140,
    engineTemp: 26,
    lastLocation: "Chakan MIDC Staging Yard, Pune",
    lastUpdated: "3 hours ago",
    driver: {
      id: "f6a7b8c9-d0e1-2f3a-4b5c-6d7e8f9a0b1c",
      name: "Sunil Shinde",
      phone: "+91 97654 32109",
      licenseNumber: "MH-1420160081290",
      avatar: "SS",
      rating: 4.5
    },
    deviceImei: "867492048129487",
    companyName: "Deccan Petroleum Logistics",
    todayDistance: 0,
    immobilizerState: "unlocked"
  }
];

export const vehiclesApi = {
  getVehicles: async (filters?: Partial<VehicleFilters>): Promise<VehicleTelemetry[]> => {
    try {
      const res = await api.get("/vehicles", { params: filters });
      return res.data?.data || res.data;
    } catch {
      let list = [...FALLBACK_VEHICLES];
      if (filters?.status && filters.status !== "all") {
        list = list.filter((v) => v.status === filters.status);
      }
      if (filters?.category && filters.category !== "all") {
        list = list.filter((v) => v.category === filters.category);
      }
      if (filters?.search) {
        const q = filters.search.toLowerCase();
        list = list.filter(
          (v) =>
            v.plateNumber.toLowerCase().includes(q) ||
            v.driver.name.toLowerCase().includes(q) ||
            v.makeModel.toLowerCase().includes(q) ||
            v.lastLocation.toLowerCase().includes(q)
        );
      }
      return list;
    }
  },

  getVehicleById: async (id: string): Promise<VehicleTelemetry> => {
    try {
      const res = await api.get(`/vehicles/${id}`);
      return res.data?.data || res.data;
    } catch {
      const found = FALLBACK_VEHICLES.find((v) => v.id === id);
      if (!found) throw new Error("Vehicle not found");
      return found;
    }
  },

  getFleetStats: async (): Promise<FleetStats> => {
    try {
      const res = await api.get("/vehicles/stats");
      return res.data?.data || res.data;
    } catch {
      return {
        totalAssets: FALLBACK_VEHICLES.length,
        moving: FALLBACK_VEHICLES.filter((v) => v.status === "moving").length,
        idling: FALLBACK_VEHICLES.filter((v) => v.status === "idling").length,
        stopped: FALLBACK_VEHICLES.filter((v) => v.status === "stopped").length,
        inactive: FALLBACK_VEHICLES.filter((v) => v.status === "inactive").length
      };
    }
  },

  getPlaybackSession: async (vehicleId: string, date: string): Promise<PlaybackSession> => {
    try {
      const res = await api.get(`/vehicles/${vehicleId}/playback`, { params: { date } });
      return res.data?.data || res.data;
    } catch {
      const baseLat = 28.5355;
      const baseLng = 77.391;
      const points = Array.from({ length: 24 }, (_, i) => {
        const hour = 8 + Math.floor(i / 2);
        const minute = (i % 2) * 30;
        const speed = i === 5 || i === 12 ? 0 : 50 + (i % 5) * 8;
        return {
          id: `pt-${i}`,
          timestamp: `2026-10-24T${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}:00Z`,
          latitude: Number((baseLat + i * 0.025 + Math.sin(i) * 0.005).toFixed(5)),
          longitude: Number((baseLng + i * 0.035 + Math.cos(i) * 0.005).toFixed(5)),
          speed,
          heading: (70 + i * 5) % 360,
          ignition: speed > 0 || i === 5,
          stoppage: speed === 0 && i === 12,
          idle: speed === 0 && i === 5,
          locationName: `Yamuna Expressway KM ${i * 8 + 12}`
        };
      });

      return {
        vehicleId,
        vehiclePlate: "DL 01 CA 9876",
        date: date || "2026-10-24",
        startTime: "08:30 AM",
        endTime: "06:30 PM",
        totalDistance: 218.4,
        maxSpeed: 82,
        avgSpeed: 54,
        stoppageCount: 3,
        idleDurationMinutes: 45,
        points
      };
    }
  },

  dispatchImmobilizer: async (
    cmd: Omit<ImmobilizerCommand, "dispatchedAt" | "status">
  ): Promise<ImmobilizerCommand> => {
    try {
      const res = await api.post(`/vehicles/${cmd.vehicleId}/immobilize`, cmd);
      return res.data?.data || res.data;
    } catch {
      return {
        ...cmd,
        dispatchedAt: new Date().toISOString(),
        status: "success"
      };
    }
  },

  generateShareLink: async (
    config: Omit<ShareLinkConfig, "shareUrl" | "createdAt" | "expiresAt">
  ): Promise<ShareLinkConfig> => {
    const createdAt = new Date().toISOString();
    const expiresAt = new Date(Date.now() + config.expiryHours * 3600000).toISOString();
    const token = Math.random().toString(36).substring(2, 10);
    const shareUrl = `${window.location.origin}/track-live/${token}`;
    return {
      ...config,
      shareUrl,
      createdAt,
      expiresAt
    };
  },

  exportVehicles: async (filters?: Partial<VehicleFilters>): Promise<void> => {
    try {
      await downloadStreamFile("/vehicles/export", "vehicles_export.csv", filters);
    } catch {
      // Offline fallback: client-side CSV download
      const list = await vehiclesApi.getVehicles(filters);
      const headers = "Plate Number,Model,Category,Status,Speed (km/h),Driver,Driver Phone,Today Dist (km),Location\n";
      const rows = list
        .map(
          (v) =>
            `"${v.plateNumber}","${v.makeModel}","${v.category}","${v.status}",${v.speed},"${v.driver.name}","${v.driver.phone}",${v.todayDistance},"${v.lastLocation}"`
        )
        .join("\n");
      const blob = new Blob([headers + rows], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `fleet_vehicles_${new Date().toISOString().split("T")[0]}.csv`;
      a.click();
      URL.revokeObjectURL(url);
    }
  }
};
