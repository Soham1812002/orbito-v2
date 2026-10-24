import apiClient from "@/utils/api";
import { ComplianceReminder, ComplianceFilters, ComplianceFormData } from "./compliance.types";

const MOCK_REMINDERS: ComplianceReminder[] = [
  {
    id: "rem-001",
    companyName: "inOrbit Logistics",
    branchName: "West Operations Hub",
    entityType: "vehicle",
    entityId: "veh-001",
    entityIdentifier: "GJ 05 AB 1234",
    reminderCategory: "Comprehensive Commercial Insurance",
    documentNumber: "POL-ICICI-2025-99812",
    issueDate: "2025-11-10",
    expiryDate: "2026-11-09",
    notifyBeforeDays: 30,
    notifyEmail: true,
    notifySms: true,
    notifyPush: true,
    status: "due_soon",
    notes: "Annual policy renewal through ICICI Lombard; broker: Global Insurance",
    createdAt: "2025-11-10T10:00:00Z",
    updatedAt: "2026-10-20T12:00:00Z"
  },
  {
    id: "rem-002",
    companyName: "inOrbit Logistics",
    branchName: "West Operations Hub",
    entityType: "vehicle",
    entityId: "veh-002",
    entityIdentifier: "GJ 01 KM 4821",
    reminderCategory: "State Fitness Certificate",
    documentNumber: "FC-GJ01-2024-4412",
    issueDate: "2024-10-20",
    expiryDate: "2026-10-19",
    notifyBeforeDays: 15,
    notifyEmail: true,
    notifySms: true,
    notifyPush: true,
    status: "overdue",
    notes: "Vehicle inspection delayed due to suspension overhaul; booked for re-test Monday",
    createdAt: "2024-10-20T08:00:00Z",
    updatedAt: "2026-10-24T06:00:00Z"
  },
  {
    id: "rem-003",
    companyName: "inOrbit Logistics",
    branchName: "North Operations Hub",
    entityType: "vehicle",
    entityId: "veh-003",
    entityIdentifier: "DL 01 AB 7582",
    reminderCategory: "Pollution Under Control (PUC)",
    documentNumber: "PUC-DL-98213",
    issueDate: "2026-05-15",
    expiryDate: "2026-11-14",
    notifyBeforeDays: 15,
    notifyEmail: true,
    notifySms: false,
    notifyPush: true,
    status: "due_soon",
    notes: "Semi-annual BS-VI emission compliance certificate",
    createdAt: "2026-05-15T09:00:00Z",
    updatedAt: "2026-10-22T14:00:00Z"
  },
  {
    id: "rem-004",
    companyName: "inOrbit Logistics",
    branchName: "South Operations Hub",
    entityType: "vehicle",
    entityId: "veh-004",
    entityIdentifier: "KA 03 HA 9922",
    reminderCategory: "National All-India Goods Permit",
    documentNumber: "NP-MORTH-884192",
    issueDate: "2025-01-01",
    expiryDate: "2030-01-01",
    notifyBeforeDays: 60,
    notifyEmail: true,
    notifySms: false,
    notifyPush: false,
    status: "active",
    notes: "5-year MoRTH National Highway permit; consolidated tax paid",
    createdAt: "2025-01-01T10:00:00Z",
    updatedAt: "2026-10-18T16:00:00Z"
  },
  {
    id: "rem-005",
    companyName: "inOrbit Logistics",
    branchName: "West Operations Hub",
    entityType: "driver",
    entityId: "drv-101",
    entityIdentifier: "Rajesh Kumar Sharma",
    reminderCategory: "Heavy Transport Driving License",
    documentNumber: "DL-GJ05-20120008819",
    issueDate: "2021-08-10",
    expiryDate: "2026-12-31",
    notifyBeforeDays: 45,
    notifyEmail: true,
    notifySms: true,
    notifyPush: true,
    status: "active",
    notes: "Commercial hazardous endorsement valid through end of year",
    createdAt: "2021-08-10T08:00:00Z",
    updatedAt: "2026-10-21T11:00:00Z"
  }
];

export const complianceApi = {
  async getComplianceReminders(params: ComplianceFilters = {}): Promise<{
    rows: ComplianceReminder[];
    totalCount: number;
    page: number;
    limit: number;
    totalPages: number;
  }> {
    try {
      const res = await apiClient.get("/dispatch/compliance-reminders", { params });
      return res.data;
    } catch {
      let filtered = [...MOCK_REMINDERS];
      if (params.search) {
        const q = params.search.toLowerCase();
        filtered = filtered.filter(
          (r) =>
            r.entityIdentifier.toLowerCase().includes(q) ||
            r.reminderCategory.toLowerCase().includes(q) ||
            (r.documentNumber && r.documentNumber.toLowerCase().includes(q))
        );
      }
      if (params.entityType && params.entityType !== "all") {
        filtered = filtered.filter((r) => r.entityType === params.entityType);
      }
      if (params.status && params.status !== "all") {
        filtered = filtered.filter((r) => r.status === params.status);
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

  async createComplianceReminder(data: ComplianceFormData): Promise<ComplianceReminder> {
    try {
      const res = await apiClient.post("/dispatch/compliance-reminders", data);
      return res.data.result;
    } catch {
      const newReminder: ComplianceReminder = {
        ...data,
        id: `rem-${Date.now()}`,
        status: data.status || "active",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      MOCK_REMINDERS.unshift(newReminder);
      return newReminder;
    }
  },

  async updateComplianceReminder(id: string, data: Partial<ComplianceFormData>): Promise<ComplianceReminder> {
    try {
      const res = await apiClient.put(`/dispatch/compliance-reminders/${id}`, data);
      return res.data.result;
    } catch {
      const index = MOCK_REMINDERS.findIndex((r) => r.id === id);
      if (index !== -1) {
        MOCK_REMINDERS[index] = {
          ...MOCK_REMINDERS[index],
          ...data,
          updatedAt: new Date().toISOString()
        };
        return MOCK_REMINDERS[index];
      }
      throw new Error(`Compliance reminder "${id}" not found`);
    }
  },

  async deleteComplianceReminder(id: string): Promise<void> {
    try {
      await apiClient.delete(`/dispatch/compliance-reminders/${id}`);
    } catch {
      const index = MOCK_REMINDERS.findIndex((r) => r.id === id);
      if (index !== -1) {
        MOCK_REMINDERS.splice(index, 1);
      }
    }
  }
};
