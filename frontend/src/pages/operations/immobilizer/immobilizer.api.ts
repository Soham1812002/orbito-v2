import apiClient from "@/utils/api";
import { ImmobilizerAudit, ImmobilizerFilters, LogImmobilizerCommandData } from "./immobilizer.types";

const MOCK_IMMOBILIZER_AUDITS: ImmobilizerAudit[] = [
  {
    id: "imm-001",
    companyName: "inOrbit Logistics",
    branchName: "West Operations Hub",
    vehicleId: "veh-001",
    vehiclePlate: "GJ 05 AB 1234",
    command: "STOP_ENGINE",
    status: "executed",
    operatorId: "usr-01",
    operatorName: "Super Admin",
    reason: "Geofence security breach after midnight curfew; suspicious exit flagged",
    relayVoltage: 12.4,
    speedAtExecution: 0,
    latitude: 23.0338,
    longitude: 72.585,
    locationAddress: "Near Sanand GIDC Ring Road, Ahmedabad, Gujarat",
    responseTimeMs: 820,
    createdAt: "2026-10-24T06:12:00Z"
  },
  {
    id: "imm-002",
    companyName: "inOrbit Logistics",
    branchName: "West Operations Hub",
    vehicleId: "veh-001",
    vehiclePlate: "GJ 05 AB 1234",
    command: "RESUME_ENGINE",
    status: "executed",
    operatorId: "usr-01",
    operatorName: "Super Admin",
    reason: "Driver identity verified via biometrics and dispatch clearance confirmed",
    relayVoltage: 12.6,
    speedAtExecution: 0,
    latitude: 23.0338,
    longitude: 72.585,
    locationAddress: "Near Sanand GIDC Ring Road, Ahmedabad, Gujarat",
    responseTimeMs: 640,
    createdAt: "2026-10-24T06:30:00Z"
  },
  {
    id: "imm-003",
    companyName: "inOrbit Logistics",
    branchName: "North Operations Hub",
    vehicleId: "veh-003",
    vehiclePlate: "DL 01 AB 7582",
    command: "STOP_ENGINE",
    status: "executed",
    operatorId: "usr-02",
    operatorName: "Fleet Lead North",
    reason: "Main power feed cut alert trigger (anti-theft immobilizer circuit trip)",
    relayVoltage: 11.9,
    speedAtExecution: 5.2,
    latitude: 28.7041,
    longitude: 77.1025,
    locationAddress: "Karnal Bypass Highway KM-14, GT Karnal Road, Delhi",
    responseTimeMs: 910,
    createdAt: "2026-10-24T04:46:00Z"
  },
  {
    id: "imm-004",
    companyName: "inOrbit Logistics",
    branchName: "South Operations Hub",
    vehicleId: "veh-004",
    vehiclePlate: "KA 03 HA 9922",
    command: "STOP_ENGINE",
    status: "failed",
    operatorId: "usr-03",
    operatorName: "Regional Dispatcher",
    reason: "Vehicle speed exceeded safety interlock threshold (42 km/h > 15 km/h cap)",
    relayVoltage: 12.5,
    speedAtExecution: 42.1,
    latitude: 12.9165,
    longitude: 79.1325,
    locationAddress: "Vellore Highway Section, Tamil Nadu",
    responseTimeMs: 1400,
    createdAt: "2026-10-23T22:15:00Z"
  },
  {
    id: "imm-005",
    companyName: "inOrbit Logistics",
    branchName: "East Operations Hub",
    vehicleId: "veh-005",
    vehiclePlate: "WB 02 BB 3391",
    command: "RESUME_ENGINE",
    status: "executed",
    operatorId: "usr-04",
    operatorName: "Depot Supervisor",
    reason: "Scheduled workshop overhaul testing completed; restored starter circuit",
    relayVoltage: 12.8,
    speedAtExecution: 0,
    latitude: 22.6864,
    longitude: 88.2933,
    locationAddress: "Dankuni Railway Terminal Workshop Yard, West Bengal",
    responseTimeMs: 710,
    createdAt: "2026-10-22T16:20:00Z"
  }
];

export const immobilizerApi = {
  async getImmobilizerAudits(params: ImmobilizerFilters = {}): Promise<{
    rows: ImmobilizerAudit[];
    totalCount: number;
    page: number;
    limit: number;
    totalPages: number;
  }> {
    try {
      const res = await apiClient.get("/dispatch/immobilizer-audits", { params });
      return res.data;
    } catch {
      let filtered = [...MOCK_IMMOBILIZER_AUDITS];
      if (params.search) {
        const q = params.search.toLowerCase();
        filtered = filtered.filter(
          (i) =>
            i.vehiclePlate.toLowerCase().includes(q) ||
            i.operatorName.toLowerCase().includes(q) ||
            i.reason.toLowerCase().includes(q) ||
            (i.locationAddress && i.locationAddress.toLowerCase().includes(q))
        );
      }
      if (params.command && params.command !== "all") {
        filtered = filtered.filter((i) => i.command === params.command);
      }
      if (params.status && params.status !== "all") {
        filtered = filtered.filter((i) => i.status === params.status);
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

  async logImmobilizerCommand(data: LogImmobilizerCommandData): Promise<ImmobilizerAudit> {
    try {
      const res = await apiClient.post("/dispatch/immobilizer-audits", data);
      return res.data.result;
    } catch {
      const newAudit: ImmobilizerAudit = {
        ...data,
        id: `imm-${Date.now()}`,
        status: data.status || "executed",
        responseTimeMs: 750,
        relayVoltage: 12.5,
        createdAt: new Date().toISOString()
      };
      MOCK_IMMOBILIZER_AUDITS.unshift(newAudit);
      return newAudit;
    }
  }
};
