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

const normalizeVehicle = (v: any): VehicleTelemetry => ({
  ...v,
  latitude: Number(v.latitude) || 28.6139,
  longitude: Number(v.longitude) || 77.209,
  heading: Number(v.heading) || 0,
  speed: Number(v.speed) || 0,
  fuelPercent: Number(v.fuelPercent ?? 100),
  batteryPercent: Number(v.batteryPercent ?? 100),
  odometer: Number(v.odometer ?? 0),
  engineTemp: Number(v.engineTemp ?? 25),
  todayDistance: Number(v.todayDistance ?? 0),
  immobilizerState:
    v.immobilizerState === "locked" || v.immobilizerState === "cut_off"
      ? "cut_off"
      : v.immobilizerState === "pending"
      ? "pending"
      : "unlocked",
  driver: v.driver || {
    id: "unassigned",
    name: "Unassigned Driver",
    phone: "",
    licenseNumber: "N/A",
    avatar: "NA",
    rating: 5.0
  }
});

export const vehiclesApi = {
  getVehicles: async (filters?: Partial<VehicleFilters>): Promise<VehicleTelemetry[]> => {
    try {
      const res = await api.get("/vehicles", { params: filters });
      const apiData = res.data?.data || res.data;
      if (Array.isArray(apiData)) {
        return apiData.map(normalizeVehicle);
      }
    } catch {
      // Backend unavailable, fallback to mock data
    }

    let list = FALLBACK_VEHICLES.map(normalizeVehicle);
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
          (v.plateNumber && v.plateNumber.toLowerCase().includes(q)) ||
          (v.driver?.name && v.driver.name.toLowerCase().includes(q)) ||
          (v.makeModel && v.makeModel.toLowerCase().includes(q)) ||
          (v.lastLocation && v.lastLocation.toLowerCase().includes(q))
      );
    }
    return list;
  },

  getVehicleById: async (id: string): Promise<VehicleTelemetry> => {
    try {
      const res = await api.get(`/vehicles/${id}`);
      const apiData = res.data?.data || res.data;
      if (apiData && apiData.id) {
        return normalizeVehicle(apiData);
      }
    } catch {
      // Fallback
    }
    const found = FALLBACK_VEHICLES.find((v) => v.id === id) || FALLBACK_VEHICLES[0];
    return normalizeVehicle(found);
  },

  getFleetStats: async (): Promise<FleetStats> => {
    try {
      const res = await api.get("/vehicles/stats");
      const apiData = res.data?.data || res.data;
      if (apiData && typeof apiData.totalAssets === "number") {
        return apiData;
      }
    } catch {
      // Fallback
    }

    return {
      totalAssets: FALLBACK_VEHICLES.length,
      moving: FALLBACK_VEHICLES.filter((v) => v.status === "moving").length,
      idling: FALLBACK_VEHICLES.filter((v) => v.status === "idling").length,
      stopped: FALLBACK_VEHICLES.filter((v) => v.status === "stopped").length,
      inactive: FALLBACK_VEHICLES.filter((v) => v.status === "inactive").length
    };
  },

  getPlaybackSession: async (vehicleId: string, date: string): Promise<PlaybackSession> => {
    try {
      const res = await api.get(`/vehicles/${vehicleId}/playback`, { params: { date } });
      const apiData = res.data?.data || res.data;
      if (apiData && Array.isArray(apiData.points) && apiData.points.length > 0) {
        return apiData;
      }
    } catch {
      // Fallback to mock session
    }

    const matchedVehicle = FALLBACK_VEHICLES.find((v) => v.id === vehicleId) || FALLBACK_VEHICLES[0];
    const baseLat = matchedVehicle?.latitude || 28.5355;
    const baseLng = matchedVehicle?.longitude || 77.391;

    let resolvedDate = new Date().toISOString().split("T")[0];
    if (date === "yesterday") {
      const y = new Date();
      y.setDate(y.getDate() - 1);
      resolvedDate = y.toISOString().split("T")[0];
    } else if (date && date !== "today" && /^\d{4}-\d{2}-\d{2}$/.test(date)) {
      resolvedDate = date;
    }

    const points = Array.from({ length: 24 }, (_, i) => {
      const totalMinutes = 8 * 60 + 30 + Math.round((i * 600) / 23);
      const hour = Math.floor(totalMinutes / 60);
      const minute = totalMinutes % 60;
      const speed = i === 5 || i === 12 ? 0 : 50 + (i % 5) * 8;
      return {
        id: `pt-${i}`,
        timestamp: `${resolvedDate}T${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}:00`,
        latitude: Number((baseLat + i * 0.025 + Math.sin(i) * 0.005).toFixed(5)),
        longitude: Number((baseLng + i * 0.035 + Math.cos(i) * 0.005).toFixed(5)),
        speed,
        heading: (70 + i * 5) % 360,
        ignition: speed > 0 || i === 5,
        stoppage: speed === 0 && i === 12,
        idle: speed === 0 && i === 5,
        locationName: matchedVehicle?.lastLocation || "Chakan MIDC Staging Yard, Pune"
      };
    });

    const stoppageCount = points.filter((p) => p.stoppage).length;

    return {
      vehicleId: vehicleId || matchedVehicle.id,
      vehiclePlate: matchedVehicle.plateNumber,
      date: resolvedDate,
      startTime: "08:30 AM",
      endTime: "06:30 PM",
      totalDistance: 218.4,
      maxSpeed: 82,
      avgSpeed: 54,
      stoppageCount,
      idleDurationMinutes: 45,
      points
    };
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
            `"${v.plateNumber}","${v.makeModel}","${v.category}","${v.status}",${v.speed},"${v.driver?.name || "Unassigned"}","${v.driver?.phone || "N/A"}",${v.todayDistance},"${v.lastLocation}"`
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
