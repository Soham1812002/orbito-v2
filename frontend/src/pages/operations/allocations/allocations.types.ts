export interface RoutePathAllocation {
  id: string;
  companyName?: string;
  branchName?: string;
  routePathId: string;
  routeCode?: string;
  routeName?: string;
  originName?: string;
  destinationName?: string;
  vehicleId: string;
  vehiclePlate: string;
  allocationName: string;
  scheduleType: "daily" | "weekdays" | "custom" | "on_demand";
  activeDays?: string[];
  departureTime?: string;
  maxTransitHours?: number;
  allowDeviation: boolean;
  deviationAlertThresholdMeters: number;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface RouteAllocationFilters {
  search?: string;
  scheduleType?: string;
  routePathId?: string;
  isActive?: string;
  page?: number;
  limit?: number;
}

export interface RouteAllocationFormData {
  companyName?: string;
  branchName?: string;
  routePathId: string;
  vehicleId: string;
  vehiclePlate: string;
  allocationName: string;
  scheduleType: "daily" | "weekdays" | "custom" | "on_demand";
  activeDays?: string[];
  departureTime?: string;
  maxTransitHours?: number;
  allowDeviation: boolean;
  deviationAlertThresholdMeters: number;
  isActive: boolean;
}
