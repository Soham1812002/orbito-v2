export type PoiCategory =
  | "Toll Plaza"
  | "Depot"
  | "Plant"
  | "Logistics Hub"
  | "Staging Yard"
  | "Client Site";

export interface PoiItem {
  id: string;
  name: string;
  company: string;
  branch: string;
  geoCode: string;
  category: PoiCategory;
  street: string;
  city: string;
  state: string;
  latitude: number;
  longitude: number;
  description?: string;
  isActive: boolean;
  createdAt?: string;
}

export interface PoiSummaryAItem {
  id: string;
  company: string;
  branch: string;
  geoCode: string;
  pointOfInterest: string;
  category: PoiCategory;
  noOfVisitors: number;
  totalStopTime: string; // HH:MM:SS
  avgStopTime: string;   // HH:MM:SS
}

export interface PoiSummaryBItem {
  id: string;
  company: string;
  branch: string;
  vehicleModel: string;
  vehicleType: string;
  vehicleRegNo: string;
  imeiNo: string;
  visitCount: number;
  totalStopTime: string; // HH:MM:SS
  avgStopTime: string;   // HH:MM:SS
}

export interface MissedPoiItem {
  id: string;
  company: string;
  branch: string;
  vehicleRegNo: string;
  vehicleModel: string;
  vehicleType: string;
  scheduledPoiCount: number;
  visitedCount: number;
  missedCount: number;
}

export interface CollectionAddressItem {
  id: string;
  company: string;
  branch: string;
  vehicleRegNo: string;
  visitedCount: number;
  missedCount: number;
  totalScheduled: number;
}

export interface PoiFilterParams {
  search?: string;
  company?: string;
  branch?: string;
  category?: string;
  page?: number;
  limit?: number;
}
