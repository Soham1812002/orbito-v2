import {
  GeofenceItem,
  GeofenceSummaryAItem,
  GeofenceSummaryBItem,
  OutOfGeofenceItem
} from "@/types/geofence.types";

export const initialMockGeofenceList: GeofenceItem[] = [
  {
    id: "geo-001",
    name: "Ahmedabad Western Logistics Hub Yard",
    type: "circular",
    category: "Yard",
    company: "InOrbit Logistics",
    branch: "Western Hub",
    centerLatitude: 22.9868,
    centerLongitude: 72.4876,
    radiusMeters: 500,
    speedLimitKmh: 20,
    assignedVehiclesCount: 48,
    alertOnEnter: true,
    alertOnExit: true,
    alertOnOverstay: true,
    maxDwellMinutes: 120,
    description: "Container yard parking perimeter with 20 km/h yard speed enforcement.",
    isActive: true,
    createdAt: "2026-01-10T09:00:00Z"
  },
  {
    id: "geo-002",
    name: "Sanand Auto Industrial Corridor Zone",
    type: "polygon",
    category: "Plant",
    company: "InOrbit Logistics",
    branch: "Western Hub",
    centerLatitude: 22.9922,
    centerLongitude: 72.3789,
    coordinates: [
      { lat: 22.995, lng: 72.375 },
      { lat: 22.996, lng: 72.385 },
      { lat: 22.988, lng: 72.386 },
      { lat: 22.987, lng: 72.376 }
    ],
    speedLimitKmh: 30,
    assignedVehiclesCount: 32,
    alertOnEnter: true,
    alertOnExit: true,
    alertOnOverstay: false,
    description: "Manufacturing zone and inward parts receiving security boundary.",
    isActive: true,
    createdAt: "2026-01-14T11:30:00Z"
  },
  {
    id: "geo-003",
    name: "Delhi Capital Freight Depot Perimeter",
    type: "circular",
    category: "Warehouse",
    company: "InOrbit Logistics",
    branch: "North Region",
    centerLatitude: 28.5355,
    centerLongitude: 77.1264,
    radiusMeters: 750,
    speedLimitKmh: 25,
    assignedVehiclesCount: 64,
    alertOnEnter: true,
    alertOnExit: true,
    alertOnOverstay: true,
    maxDwellMinutes: 180,
    description: "Airport logistics and arterial container handling perimeter.",
    isActive: true,
    createdAt: "2026-01-20T14:00:00Z"
  },
  {
    id: "geo-004",
    name: "Pune Chakan Heavy Vehicle Yard",
    type: "polygon",
    category: "Yard",
    company: "Apex Fleetworks",
    branch: "Maharashtra Central",
    centerLatitude: 18.7606,
    centerLongitude: 73.8567,
    coordinates: [
      { lat: 18.765, lng: 73.852 },
      { lat: 18.766, lng: 73.862 },
      { lat: 18.756, lng: 73.861 },
      { lat: 18.755, lng: 73.851 }
    ],
    speedLimitKmh: 15,
    assignedVehiclesCount: 28,
    alertOnEnter: true,
    alertOnExit: true,
    alertOnOverstay: true,
    maxDwellMinutes: 240,
    description: "Heavy truck maintenance depot with automated dispatch alerts.",
    isActive: true,
    createdAt: "2026-02-05T10:15:00Z"
  },
  {
    id: "geo-005",
    name: "Yamuna Expressway Toll Monitoring Zone",
    type: "circular",
    category: "Restricted Zone",
    company: "InOrbit Logistics",
    branch: "North Region",
    centerLatitude: 28.1206,
    centerLongitude: 77.5382,
    radiusMeters: 300,
    speedLimitKmh: 40,
    assignedVehiclesCount: 86,
    alertOnEnter: true,
    alertOnExit: true,
    alertOnOverstay: false,
    description: "Expressway toll checkpoint tracking zone.",
    isActive: true,
    createdAt: "2026-02-12T16:20:00Z"
  }
];

export const mockGeofenceSummaryAList: GeofenceSummaryAItem[] = [
  {
    id: "geo-sum-a-001",
    company: "InOrbit Logistics",
    branch: "Western Hub",
    geofenceName: "Ahmedabad Western Logistics Hub Yard",
    type: "circular",
    category: "Yard",
    totalEntries: 248,
    totalExits: 236,
    activeVehiclesInside: 12,
    totalDwellTime: "312:45:10",
    avgDwellTime: "01:15:40"
  },
  {
    id: "geo-sum-a-002",
    company: "InOrbit Logistics",
    branch: "Western Hub",
    geofenceName: "Sanand Auto Industrial Corridor Zone",
    type: "polygon",
    category: "Plant",
    totalEntries: 186,
    totalExits: 178,
    activeVehiclesInside: 8,
    totalDwellTime: "246:18:30",
    avgDwellTime: "01:22:15"
  },
  {
    id: "geo-sum-a-003",
    company: "InOrbit Logistics",
    branch: "North Region",
    geofenceName: "Delhi Capital Freight Depot Perimeter",
    type: "circular",
    category: "Warehouse",
    totalEntries: 312,
    totalExits: 298,
    activeVehiclesInside: 14,
    totalDwellTime: "420:12:40",
    avgDwellTime: "01:24:50"
  },
  {
    id: "geo-sum-a-004",
    company: "Apex Fleetworks",
    branch: "Maharashtra Central",
    geofenceName: "Pune Chakan Heavy Vehicle Yard",
    type: "polygon",
    category: "Yard",
    totalEntries: 142,
    totalExits: 135,
    activeVehiclesInside: 7,
    totalDwellTime: "198:40:15",
    avgDwellTime: "01:28:12"
  }
];

export const mockGeofenceSummaryBList: GeofenceSummaryBItem[] = [
  {
    id: "geo-sum-b-001",
    company: "InOrbit Logistics",
    branch: "Western Hub",
    vehicleRegNo: "GJ 05 AB 1234",
    vehicleModel: "Tata Prima 5530",
    geofenceName: "Ahmedabad Western Logistics Hub Yard",
    entryTime: "2026-03-24T06:45:10Z",
    exitTime: "2026-03-24T08:15:22Z",
    dwellDuration: "01:30:12",
    speedOnEntry: 18,
    status: "EXITED"
  },
  {
    id: "geo-sum-b-002",
    company: "InOrbit Logistics",
    branch: "Western Hub",
    vehicleRegNo: "GJ 01 KM 4821",
    vehicleModel: "Ashok Leyland Dost",
    geofenceName: "Sanand Auto Industrial Corridor Zone",
    entryTime: "2026-03-24T07:12:00Z",
    dwellDuration: "02:18:45",
    speedOnEntry: 24,
    status: "INSIDE"
  },
  {
    id: "geo-sum-b-003",
    company: "InOrbit Logistics",
    branch: "North Region",
    vehicleRegNo: "DL 01 AB 7532",
    vehicleModel: "Eicher Pro 3015",
    geofenceName: "Delhi Capital Freight Depot Perimeter",
    entryTime: "2026-03-24T05:20:15Z",
    exitTime: "2026-03-24T07:05:40Z",
    dwellDuration: "01:45:25",
    speedOnEntry: 22,
    status: "EXITED"
  },
  {
    id: "geo-sum-b-004",
    company: "Apex Fleetworks",
    branch: "Maharashtra Central",
    vehicleRegNo: "MH 14 DT 9087",
    vehicleModel: "BharatBenz 2823C",
    geofenceName: "Pune Chakan Heavy Vehicle Yard",
    entryTime: "2026-03-24T08:00:10Z",
    dwellDuration: "01:10:05",
    speedOnEntry: 14,
    status: "INSIDE"
  }
];

export const mockOutOfGeofenceList: OutOfGeofenceItem[] = [
  {
    id: "out-001",
    company: "InOrbit Logistics",
    branch: "Western Hub",
    vehicleRegNo: "GJ 05 AB 1234",
    vehicleModel: "Tata Prima 5530",
    driverName: "Rajesh Kumar",
    deviationLocation: "NH 48 KM Marker 182 (Off Sanand Bypass)",
    deviationTime: "2026-03-24T09:14:22Z",
    distanceOutsideKm: 4.8,
    severity: "medium",
    acknowledged: false
  },
  {
    id: "out-002",
    company: "InOrbit Logistics",
    branch: "North Region",
    vehicleRegNo: "DL 01 AB 7532",
    vehicleModel: "Eicher Pro 3015",
    driverName: "Sukhwinder Singh",
    deviationLocation: "Jewar Rural Link Road (Unauthorized Corridor)",
    deviationTime: "2026-03-24T10:30:15Z",
    distanceOutsideKm: 8.2,
    severity: "high",
    acknowledged: false
  },
  {
    id: "out-003",
    company: "Apex Fleetworks",
    branch: "Maharashtra Central",
    vehicleRegNo: "MH 14 DT 9087",
    vehicleModel: "BharatBenz 2823C",
    driverName: "Amol Shinde",
    deviationLocation: "Old Pune-Mumbai Highway Service Lane",
    deviationTime: "2026-03-24T11:05:40Z",
    distanceOutsideKm: 1.5,
    severity: "low",
    acknowledged: true
  }
];
