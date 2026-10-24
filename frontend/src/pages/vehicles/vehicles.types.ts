export type VehicleStatus = "moving" | "idling" | "stopped" | "inactive";

export type VehicleCategory = 
  | "heavy_truck" 
  | "delivery_van" 
  | "container_carrier" 
  | "tanker" 
  | "electric_cargo";

export interface DriverInfo {
  id: string;
  name: string;
  phone: string;
  licenseNumber: string;
  avatar?: string;
  rating?: number;
}

export interface VehicleTelemetry {
  id: string;
  plateNumber: string;
  makeModel: string;
  category: VehicleCategory;
  status: VehicleStatus;
  speed: number; // km/h
  heading: number; // 0 - 360 deg
  latitude: number;
  longitude: number;
  ignition: boolean;
  fuelPercent: number; // 0 - 100
  batteryPercent: number; // 0 - 100
  odometer: number; // km
  engineTemp: number; // °C
  lastLocation: string;
  lastUpdated: string;
  driver: DriverInfo;
  deviceImei: string;
  immobilizerState: "unlocked" | "cut_off" | "pending";
  todayDistance: number; // km
  telematicsVendor?: string;
  companyName: string;
}

export interface PlaybackPoint {
  id: string;
  timestamp: string; // ISO string
  latitude: number;
  longitude: number;
  speed: number;
  heading: number;
  ignition: boolean;
  stoppage?: boolean;
  idle?: boolean;
  locationName?: string;
}

export interface PlaybackSession {
  vehicleId: string;
  vehiclePlate: string;
  date: string;
  startTime: string;
  endTime: string;
  totalDistance: number;
  maxSpeed: number;
  avgSpeed: number;
  stoppageCount: number;
  idleDurationMinutes: number;
  points: PlaybackPoint[];
}

export interface ImmobilizerCommand {
  vehicleId: string;
  action: "lock" | "unlock";
  pin: string;
  reason: string;
  dispatchedAt: string;
  status: "success" | "pending" | "failed";
}

export interface ShareLinkConfig {
  vehicleId: string;
  expiryHours: number;
  passcode?: string;
  allowPlayback: boolean;
  shareUrl: string;
  createdAt: string;
  expiresAt: string;
}

export interface VehicleFilters {
  search: string;
  status: VehicleStatus | "all";
  category: VehicleCategory | "all";
  company: string;
}

export interface FleetStats {
  totalAssets: number;
  moving: number;
  idling: number;
  stopped: number;
  inactive: number;
}
