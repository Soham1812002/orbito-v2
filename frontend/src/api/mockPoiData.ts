import {
  PoiItem,
  PoiSummaryAItem,
  PoiSummaryBItem,
  MissedPoiItem,
  CollectionAddressItem
} from "@/types/poi.types";

export const initialMockPoiList: PoiItem[] = [
  {
    id: "poi-001",
    name: "Ahmedabad Warehouse Depot",
    company: "InOrbit Logistics",
    branch: "Western Hub",
    geoCode: "AHM-DPT-001",
    category: "Depot",
    street: "Sarkhej–Sanand Highway",
    city: "Ahmedabad",
    state: "Gujarat",
    latitude: 22.9868,
    longitude: 72.4876,
    description: "Main consolidation point for north-western regional parcel dispatches.",
    isActive: true,
    createdAt: "2026-01-15T08:30:00Z"
  },
  {
    id: "poi-002",
    name: "Sanand Manufacturing Plant",
    company: "InOrbit Logistics",
    branch: "Western Hub",
    geoCode: "SND-PLT-014",
    category: "Plant",
    street: "GIDC Phase II",
    city: "Sanand",
    state: "Gujarat",
    latitude: 22.9922,
    longitude: 72.3789,
    description: "Automotive component stamping facility and outward cargo docks.",
    isActive: true,
    createdAt: "2026-01-18T10:15:00Z"
  },
  {
    id: "poi-003",
    name: "Delhi Logistics Hub",
    company: "InOrbit Logistics",
    branch: "North Region",
    geoCode: "DEL-HUB-002",
    category: "Logistics Hub",
    street: "NH 8, Mahipalpur",
    city: "New Delhi",
    state: "Delhi",
    latitude: 28.5355,
    longitude: 77.1264,
    description: "Capital freight interchange for northern arterial corridors.",
    isActive: true,
    createdAt: "2026-02-01T12:00:00Z"
  },
  {
    id: "poi-004",
    name: "Chakan Staging Yard",
    company: "Apex Fleetworks",
    branch: "Maharashtra Central",
    geoCode: "CHK-WHS-008",
    category: "Staging Yard",
    street: "Talegaon Chakan Road",
    city: "Pune",
    state: "Maharashtra",
    latitude: 18.7606,
    longitude: 73.8567,
    description: "Heavy commercial truck parking, inspection bays, and driver changeover.",
    isActive: true,
    createdAt: "2026-02-10T14:45:00Z"
  },
  {
    id: "poi-005",
    name: "Jewar Toll Plaza",
    company: "InOrbit Logistics",
    branch: "North Region",
    geoCode: "JWR-TOL-005",
    category: "Toll Plaza",
    street: "Yamuna Expressway",
    city: "Jewar",
    state: "Uttar Pradesh",
    latitude: 28.1206,
    longitude: 77.5382,
    description: "Primary automated fast-tag logging gate on the Yamuna Expressway corridor.",
    isActive: true,
    createdAt: "2026-02-15T09:20:00Z"
  },
  {
    id: "poi-006",
    name: "Bhiwandi Central Depot",
    company: "Apex Fleetworks",
    branch: "Maharashtra Central",
    geoCode: "BHW-DPT-009",
    category: "Depot",
    street: "Mumbai-Nashik Expressway",
    city: "Bhiwandi",
    state: "Maharashtra",
    latitude: 19.2967,
    longitude: 73.0631,
    description: "High-density retail cross-dock and e-commerce regional dispatch.",
    isActive: true,
    createdAt: "2026-02-20T16:10:00Z"
  },
  {
    id: "poi-007",
    name: "Chennai Port Container Gate 4",
    company: "TransGlobal Freight",
    branch: "Southern Maritime",
    geoCode: "CHN-PRT-003",
    category: "Client Site",
    street: "Harbour Terminal Road",
    city: "Chennai",
    state: "Tamil Nadu",
    latitude: 13.0827,
    longitude: 80.2974,
    description: "Customs bonded import/export container handling lane.",
    isActive: true,
    createdAt: "2026-03-01T11:00:00Z"
  },
  {
    id: "poi-008",
    name: "Electronic City Gateway",
    company: "TransGlobal Freight",
    branch: "Southern Maritime",
    geoCode: "BLR-HUB-011",
    category: "Logistics Hub",
    street: "Hosur Main Road",
    city: "Bangalore",
    state: "Karnataka",
    latitude: 12.8399,
    longitude: 77.677,
    description: "Tech corridor express transit depot and night dispatch facility.",
    isActive: true,
    createdAt: "2026-03-05T07:40:00Z"
  }
];

export const mockPoiSummaryAList: PoiSummaryAItem[] = [
  {
    id: "sum-a-001",
    company: "InOrbit Logistics",
    branch: "Western Hub",
    geoCode: "AHM-DPT-001",
    pointOfInterest: "Ahmedabad Warehouse Depot",
    category: "Depot",
    noOfVisitors: 142,
    totalStopTime: "186:42:18",
    avgStopTime: "01:18:53"
  },
  {
    id: "sum-a-002",
    company: "InOrbit Logistics",
    branch: "Western Hub",
    geoCode: "SND-PLT-014",
    pointOfInterest: "Sanand Manufacturing Plant",
    category: "Plant",
    noOfVisitors: 96,
    totalStopTime: "92:16:40",
    avgStopTime: "00:57:41"
  },
  {
    id: "sum-a-003",
    company: "InOrbit Logistics",
    branch: "North Region",
    geoCode: "DEL-HUB-002",
    pointOfInterest: "Delhi Logistics Hub",
    category: "Logistics Hub",
    noOfVisitors: 118,
    totalStopTime: "154:08:12",
    avgStopTime: "01:18:23"
  },
  {
    id: "sum-a-004",
    company: "Apex Fleetworks",
    branch: "Maharashtra Central",
    geoCode: "CHK-WHS-008",
    pointOfInterest: "Chakan Staging Yard",
    category: "Staging Yard",
    noOfVisitors: 83,
    totalStopTime: "110:34:06",
    avgStopTime: "01:19:55"
  },
  {
    id: "sum-a-005",
    company: "InOrbit Logistics",
    branch: "North Region",
    geoCode: "JWR-TOL-005",
    pointOfInterest: "Jewar Toll Plaza",
    category: "Toll Plaza",
    noOfVisitors: 215,
    totalStopTime: "48:12:30",
    avgStopTime: "00:13:26"
  },
  {
    id: "sum-a-006",
    company: "Apex Fleetworks",
    branch: "Maharashtra Central",
    geoCode: "BHW-DPT-009",
    pointOfInterest: "Bhiwandi Central Depot",
    category: "Depot",
    noOfVisitors: 124,
    totalStopTime: "142:50:18",
    avgStopTime: "01:09:07"
  }
];

export const mockPoiSummaryBList: PoiSummaryBItem[] = [
  {
    id: "sum-b-001",
    company: "InOrbit Logistics",
    branch: "Western Hub",
    vehicleModel: "Tata Prima 5530",
    vehicleType: "Heavy-duty cargo truck",
    vehicleRegNo: "GJ 05 AB 1234",
    imeiNo: "862170062341908",
    visitCount: 12,
    totalStopTime: "26:42:18",
    avgStopTime: "01:28:59"
  },
  {
    id: "sum-b-002",
    company: "InOrbit Logistics",
    branch: "Western Hub",
    vehicleModel: "Ashok Leyland Dost",
    vehicleType: "Light commercial vehicle",
    vehicleRegNo: "GJ 01 KM 4821",
    imeiNo: "862170062341916",
    visitCount: 15,
    totalStopTime: "14:16:40",
    avgStopTime: "01:11:23"
  },
  {
    id: "sum-b-003",
    company: "InOrbit Logistics",
    branch: "North Region",
    vehicleModel: "Eicher Pro 3015",
    vehicleType: "Regional delivery truck",
    vehicleRegNo: "DL 01 AB 7532",
    imeiNo: "862170062341924",
    visitCount: 10,
    totalStopTime: "21:08:12",
    avgStopTime: "01:24:33"
  },
  {
    id: "sum-b-004",
    company: "Apex Fleetworks",
    branch: "Maharashtra Central",
    vehicleModel: "BharatBenz 2823C",
    vehicleType: "Bulk distribution truck",
    vehicleRegNo: "MH 14 DT 9087",
    imeiNo: "862170062341932",
    visitCount: 8,
    totalStopTime: "16:34:06",
    avgStopTime: "01:39:25"
  },
  {
    id: "sum-b-005",
    company: "TransGlobal Freight",
    branch: "Southern Maritime",
    vehicleModel: "Tata Signa 4825",
    vehicleType: "Multi-axle haulage",
    vehicleRegNo: "TN 09 BX 4412",
    imeiNo: "862170062341940",
    visitCount: 14,
    totalStopTime: "31:15:45",
    avgStopTime: "01:42:10"
  }
];

export const mockMissedPoiList: MissedPoiItem[] = [
  {
    id: "missed-001",
    company: "InOrbit Logistics",
    branch: "Western Hub",
    vehicleRegNo: "GJ 05 AB 1234",
    vehicleModel: "Tata Prima 5530",
    vehicleType: "Heavy-duty cargo truck",
    scheduledPoiCount: 15,
    visitedCount: 12,
    missedCount: 3
  },
  {
    id: "missed-002",
    company: "InOrbit Logistics",
    branch: "Western Hub",
    vehicleRegNo: "GJ 01 KM 4821",
    vehicleModel: "Ashok Leyland Dost",
    vehicleType: "Light commercial vehicle",
    scheduledPoiCount: 16,
    visitedCount: 15,
    missedCount: 1
  },
  {
    id: "missed-003",
    company: "InOrbit Logistics",
    branch: "North Region",
    vehicleRegNo: "DL 01 AB 7532",
    vehicleModel: "Eicher Pro 3015",
    vehicleType: "Regional delivery truck",
    scheduledPoiCount: 14,
    visitedCount: 10,
    missedCount: 4
  },
  {
    id: "missed-004",
    company: "Apex Fleetworks",
    branch: "Maharashtra Central",
    vehicleRegNo: "MH 14 DT 9087",
    vehicleModel: "BharatBenz 2823C",
    vehicleType: "Bulk distribution truck",
    scheduledPoiCount: 10,
    visitedCount: 8,
    missedCount: 2
  },
  {
    id: "missed-005",
    company: "TransGlobal Freight",
    branch: "Southern Maritime",
    vehicleRegNo: "TN 09 BX 4412",
    vehicleModel: "Tata Signa 4825",
    vehicleType: "Multi-axle haulage",
    scheduledPoiCount: 18,
    visitedCount: 14,
    missedCount: 4
  }
];

export const mockCollectionAddressList: CollectionAddressItem[] = [
  {
    id: "col-001",
    company: "InOrbit Logistics",
    branch: "Western Hub",
    vehicleRegNo: "GJ 05 AB 1234",
    visitedCount: 18,
    missedCount: 3,
    totalScheduled: 21
  },
  {
    id: "col-002",
    company: "InOrbit Logistics",
    branch: "Western Hub",
    vehicleRegNo: "GJ 01 KM 4821",
    visitedCount: 12,
    missedCount: 1,
    totalScheduled: 13
  },
  {
    id: "col-003",
    company: "InOrbit Logistics",
    branch: "North Region",
    vehicleRegNo: "DL 01 AB 7532",
    visitedCount: 15,
    missedCount: 4,
    totalScheduled: 19
  },
  {
    id: "col-004",
    company: "Apex Fleetworks",
    branch: "Maharashtra Central",
    vehicleRegNo: "MH 14 DT 9087",
    visitedCount: 10,
    missedCount: 2,
    totalScheduled: 12
  },
  {
    id: "col-005",
    company: "TransGlobal Freight",
    branch: "Southern Maritime",
    vehicleRegNo: "TN 09 BX 4412",
    visitedCount: 22,
    missedCount: 2,
    totalScheduled: 24
  }
];
