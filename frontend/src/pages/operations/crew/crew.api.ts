import apiClient from "@/utils/api";
import { CrewAllocation, CrewAllocationFilters, CrewAllocationFormData } from "./crew.types";

const MOCK_CREW: CrewAllocation[] = [
  {
    id: "crew-001",
    companyName: "inOrbit Logistics",
    branchName: "West Operations Hub",
    vehicleId: "veh-001",
    vehiclePlate: "GJ 05 AB 1234",
    primaryDriverId: "drv-101",
    primaryDriverName: "Rajesh Kumar Sharma",
    primaryDriverPhone: "+91 98250 11223",
    secondaryDriverId: "drv-102",
    secondaryDriverName: "Manoj Singh",
    cleanerId: "cln-201",
    cleanerName: "Praveen Solanki",
    shiftName: "Night Express Shift (20:00 - 08:00)",
    startDate: "2026-10-01",
    endDate: "2026-11-01",
    dutyStatus: "on_duty",
    notes: "Overnight highway long-haul pairing for Mumbai corridor",
    isActive: true,
    createdAt: "2026-10-01T06:00:00Z",
    updatedAt: "2026-10-24T05:00:00Z"
  },
  {
    id: "crew-002",
    companyName: "inOrbit Logistics",
    branchName: "West Operations Hub",
    vehicleId: "veh-002",
    vehiclePlate: "GJ 01 KM 4821",
    primaryDriverId: "drv-103",
    primaryDriverName: "Vikramjit Singh",
    primaryDriverPhone: "+91 98765 44321",
    cleanerId: "cln-202",
    cleanerName: "Ramesh Patel",
    shiftName: "Morning General Shift (06:00 - 18:00)",
    startDate: "2026-10-05",
    dutyStatus: "on_duty",
    notes: "State highway feeder delivery roster",
    isActive: true,
    createdAt: "2026-10-05T07:30:00Z",
    updatedAt: "2026-10-23T14:20:00Z"
  },
  {
    id: "crew-003",
    companyName: "inOrbit Logistics",
    branchName: "North Operations Hub",
    vehicleId: "veh-003",
    vehiclePlate: "DL 01 AB 7582",
    primaryDriverId: "drv-104",
    primaryDriverName: "Harpreet Singh Sodhi",
    primaryDriverPhone: "+91 98112 33445",
    cleanerId: "cln-203",
    cleanerName: "Sunil Verma",
    shiftName: "Split Shift (05:00 - 14:00)",
    startDate: "2026-10-10",
    dutyStatus: "standby",
    notes: "Rest period at Jaipur ICD depot; next dispatch scheduled 16:00",
    isActive: true,
    createdAt: "2026-10-10T09:00:00Z",
    updatedAt: "2026-10-24T02:15:00Z"
  },
  {
    id: "crew-004",
    companyName: "inOrbit Logistics",
    branchName: "South Operations Hub",
    vehicleId: "veh-004",
    vehiclePlate: "KA 03 HA 9922",
    primaryDriverId: "drv-105",
    primaryDriverName: "Anand Venkatesh",
    primaryDriverPhone: "+91 94432 55667",
    secondaryDriverId: "drv-106",
    secondaryDriverName: "Ganesh Moorthy",
    shiftName: "Port Shuttle Continuous Shift",
    startDate: "2026-10-15",
    dutyStatus: "on_duty",
    notes: "Chennai Port container shuttle; dual driver protocol required",
    isActive: true,
    createdAt: "2026-10-15T11:00:00Z",
    updatedAt: "2026-10-24T04:00:00Z"
  },
  {
    id: "crew-005",
    companyName: "inOrbit Logistics",
    branchName: "East Operations Hub",
    vehicleId: "veh-005",
    vehiclePlate: "WB 02 BB 3391",
    primaryDriverId: "drv-107",
    primaryDriverName: "Subrata Banerjee",
    primaryDriverPhone: "+91 98301 88990",
    shiftName: "Day Logistics Shift",
    startDate: "2026-10-12",
    endDate: "2026-10-20",
    dutyStatus: "off_duty",
    notes: "Vehicle undergoing quarterly maintenance; crew on rest roster",
    isActive: false,
    createdAt: "2026-10-12T08:00:00Z",
    updatedAt: "2026-10-20T17:00:00Z"
  }
];

export const crewApi = {
  async getCrewAllocations(params: CrewAllocationFilters = {}): Promise<{
    rows: CrewAllocation[];
    totalCount: number;
    page: number;
    limit: number;
    totalPages: number;
  }> {
    try {
      const res = await apiClient.get("/dispatch/crew", { params });
      return res.data;
    } catch {
      let filtered = [...MOCK_CREW];
      if (params.search) {
        const q = params.search.toLowerCase();
        filtered = filtered.filter(
          (c) =>
            c.vehiclePlate.toLowerCase().includes(q) ||
            c.primaryDriverName.toLowerCase().includes(q) ||
            (c.cleanerName && c.cleanerName.toLowerCase().includes(q)) ||
            c.shiftName.toLowerCase().includes(q)
        );
      }
      if (params.shiftName && params.shiftName !== "all") {
        filtered = filtered.filter((c) => c.shiftName.includes(params.shiftName!));
      }
      if (params.dutyStatus && params.dutyStatus !== "all") {
        filtered = filtered.filter((c) => c.dutyStatus === params.dutyStatus);
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

  async createCrewAllocation(data: CrewAllocationFormData): Promise<CrewAllocation> {
    try {
      const res = await apiClient.post("/dispatch/crew", data);
      return res.data.result;
    } catch {
      const newCrew: CrewAllocation = {
        ...data,
        id: `crew-${Date.now()}`,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      MOCK_CREW.unshift(newCrew);
      return newCrew;
    }
  },

  async updateCrewAllocation(id: string, data: Partial<CrewAllocationFormData>): Promise<CrewAllocation> {
    try {
      const res = await apiClient.put(`/dispatch/crew/${id}`, data);
      return res.data.result;
    } catch {
      const index = MOCK_CREW.findIndex((c) => c.id === id);
      if (index !== -1) {
        MOCK_CREW[index] = {
          ...MOCK_CREW[index],
          ...data,
          updatedAt: new Date().toISOString()
        };
        return MOCK_CREW[index];
      }
      throw new Error(`Crew roster "${id}" not found`);
    }
  },

  async deleteCrewAllocation(id: string): Promise<void> {
    try {
      await apiClient.delete(`/dispatch/crew/${id}`);
    } catch {
      const index = MOCK_CREW.findIndex((c) => c.id === id);
      if (index !== -1) {
        MOCK_CREW.splice(index, 1);
      }
    }
  }
};
