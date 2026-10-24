export interface Waypoint {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  stopSequence: number;
  expectedDwellMins?: number;
  geofenceRadiusMeters?: number;
}

export interface RoutePath {
  id: string;
  companyName?: string;
  branchName?: string;
  routeCode: string;
  routeName: string;
  originName: string;
  originLatitude: number;
  originLongitude: number;
  destinationName: string;
  destinationLatitude: number;
  destinationLongitude: number;
  distanceKm: number;
  estimatedDurationMins: number;
  maxAllowedSpeed: number;
  bufferRadiusMeters: number;
  waypoints?: Waypoint[];
  isActive: boolean;
  allocationsCount?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface RoutePathFilters {
  search?: string;
  isActive?: string;
  page?: number;
  limit?: number;
}

export interface RoutePathFormData {
  companyName?: string;
  branchName?: string;
  routeCode: string;
  routeName: string;
  originName: string;
  originLatitude: number;
  originLongitude: number;
  destinationName: string;
  destinationLatitude: number;
  destinationLongitude: number;
  distanceKm: number;
  estimatedDurationMins: number;
  maxAllowedSpeed: number;
  bufferRadiusMeters: number;
  waypoints?: Waypoint[];
  isActive: boolean;
}
