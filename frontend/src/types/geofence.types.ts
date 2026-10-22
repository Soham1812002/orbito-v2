export type GeofenceType = "polygon" | "circular";
export type GeofenceCategory = "Warehouse" | "Plant" | "Yard" | "Restricted Zone" | "Customer Depot";

export interface GeofenceCoordinate {
  lat: number;
  lng: number;
}

export interface GeofenceItem {
  id: string;
  name: string;
  type: GeofenceType;
  category: GeofenceCategory;
  company: string;
  branch: string;
  centerLatitude: number;
  centerLongitude: number;
  radiusMeters?: number; // Used for circular geofences
  coordinates?: GeofenceCoordinate[]; // Used for polygon vertices
  speedLimitKmh?: number;
  assignedVehiclesCount: number;
  alertOnEnter: boolean;
  alertOnExit: boolean;
  alertOnOverstay: boolean;
  maxDwellMinutes?: number;
  description?: string;
  isActive: boolean;
  createdAt?: string;
}

export interface GeofenceSummaryAItem {
  id: string;
  company: string;
  branch: string;
  geofenceName: string;
  type: GeofenceType;
  category: GeofenceCategory;
  totalEntries: number;
  totalExits: number;
  activeVehiclesInside: number;
  totalDwellTime: string; // HH:MM:SS
  avgDwellTime: string;   // HH:MM:SS
}

export interface GeofenceSummaryBItem {
  id: string;
  company: string;
  branch: string;
  vehicleRegNo: string;
  vehicleModel: string;
  geofenceName: string;
  entryTime: string;
  exitTime?: string;
  dwellDuration: string; // HH:MM:SS
  speedOnEntry: number;  // km/h
  status: "INSIDE" | "EXITED";
}

export interface OutOfGeofenceItem {
  id: string;
  company: string;
  branch: string;
  vehicleRegNo: string;
  vehicleModel: string;
  driverName: string;
  deviationLocation: string;
  deviationTime: string;
  distanceOutsideKm: number;
  severity: "low" | "medium" | "high";
  acknowledged: boolean;
}

export interface GeofenceFilterParams {
  search?: string;
  company?: string;
  branch?: string;
  type?: string;
  category?: string;
  page?: number;
  limit?: number;
}
