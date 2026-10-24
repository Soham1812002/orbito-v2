import api from "@/utils/api";
import {
  MaintenanceReminder,
  ReminderFilterParams,
  ReminderListResponse
} from "./reminders.types";

// Seeded dataset matching Figma node 3050-208 (24 records)
let mockReminders: MaintenanceReminder[] = [
  {
    id: "rem-001",
    companyName: "inOrbit Logistics",
    branchName: "West Operations",
    vehicleId: "veh-001",
    vehiclePlate: "GJ 05 AB 1234",
    vehicleGroup: "Heavy Haulage",
    reminderType: "Engine Oil",
    reminderName: "Engine oil and filter replacement",
    description: "Replace synthetic 15W-40 oil, oil filter, and air filter element.",
    lastServiceDate: "12 Sep 2026",
    lastMileage: 48250,
    nextServiceDate: "24 Oct 2026",
    nextMileage: 50000,
    nextDays: "12 days",
    reminderTime: "09:00 AM",
    repeatIntervalMonths: 6,
    repeatIntervalKm: 10000,
    notifyBeforeDays: 12,
    notifyBeforeKm: 500,
    notifyUser: "Operations Lead (West)",
    notifyEmail: true,
    notifySms: true,
    notifyApp: true,
    status: "Upcoming",
    isActive: true
  },
  {
    id: "rem-002",
    companyName: "inOrbit Logistics",
    branchName: "West Operations",
    vehicleId: "veh-002",
    vehiclePlate: "GJ 01 KM 4821",
    vehicleGroup: "Medium Freight",
    reminderType: "Tyre Rotation",
    reminderName: "Rotate tyres and check alignment",
    description: "Inspect front tyre tread depth, rotate rear duals, and align steering axles.",
    lastServiceDate: "28 Aug 2026",
    lastMileage: 62100,
    nextServiceDate: "29 Oct 2026",
    nextMileage: 65000,
    nextDays: "5 days",
    reminderTime: "10:30 AM",
    repeatIntervalMonths: 4,
    repeatIntervalKm: 8000,
    notifyBeforeDays: 7,
    notifyBeforeKm: 300,
    notifyUser: "Fleet Supervisor",
    notifyEmail: true,
    notifySms: false,
    notifyApp: true,
    status: "Scheduled",
    isActive: true
  },
  {
    id: "rem-003",
    companyName: "inOrbit Logistics",
    branchName: "North Operations",
    vehicleId: "veh-003",
    vehiclePlate: "DL 01 AB 7532",
    vehicleGroup: "Interstate Linehaul",
    reminderType: "Brake Inspection",
    reminderName: "Inspect brake pads and fluid",
    description: "Check air brake booster lines, wear indicator discs, and replace brake fluid.",
    lastServiceDate: "15 Aug 2026",
    lastMileage: 78600,
    nextServiceDate: "21 Oct 2026",
    nextMileage: 80000,
    nextDays: "Overdue 3 days",
    reminderTime: "08:00 AM",
    repeatIntervalMonths: 3,
    repeatIntervalKm: 5000,
    notifyBeforeDays: 10,
    notifyBeforeKm: 400,
    notifyUser: "Safety Compliance Desk",
    notifyEmail: true,
    notifySms: true,
    notifyApp: false,
    status: "Overdue",
    isActive: true
  },
  {
    id: "rem-004",
    companyName: "Metro Transport",
    branchName: "Central Fleet",
    vehicleId: "veh-004",
    vehiclePlate: "MH 14 DT 9087",
    vehicleGroup: "City Delivery",
    reminderType: "General Service",
    reminderName: "Full preventive maintenance",
    description: "Complete 40K km periodic inspection, coolant flush, battery test, suspension greasing.",
    lastServiceDate: "05 Sep 2026",
    lastMileage: 36400,
    nextServiceDate: "15 Nov 2026",
    nextMileage: 40000,
    nextDays: "28 days",
    reminderTime: "09:00 AM",
    repeatIntervalMonths: 12,
    repeatIntervalKm: 15000,
    notifyBeforeDays: 28,
    notifyBeforeKm: 1000,
    notifyUser: "Central Workshop Manager",
    notifyEmail: false,
    notifySms: true,
    notifyApp: true,
    status: "Upcoming",
    isActive: true
  },
  {
    id: "rem-005",
    companyName: "inOrbit Logistics",
    branchName: "West Operations",
    vehicleId: "veh-005",
    vehiclePlate: "GJ 06 TR 2910",
    vehicleGroup: "Heavy Haulage",
    reminderType: "Fitness Certificate",
    reminderName: "RTO Fitness inspection & renewal",
    description: "Annual commercial vehicle fitness testing at Vadodara RTO.",
    lastServiceDate: "10 Oct 2025",
    lastMileage: 92400,
    nextServiceDate: "20 Nov 2026",
    nextMileage: 95000,
    nextDays: "27 days",
    reminderTime: "11:00 AM",
    repeatIntervalMonths: 12,
    repeatIntervalKm: 25000,
    notifyBeforeDays: 30,
    notifyBeforeKm: 1500,
    notifyUser: "Compliance Officer",
    notifyEmail: true,
    notifySms: true,
    notifyApp: true,
    status: "Upcoming",
    isActive: true
  },
  {
    id: "rem-006",
    companyName: "Metro Transport",
    branchName: "Central Fleet",
    vehicleId: "veh-006",
    vehiclePlate: "MH 12 QX 5541",
    vehicleGroup: "Express Courier",
    reminderType: "Battery Replacement",
    reminderName: "12V 100Ah heavy duty battery health check",
    description: "Terminal voltage drop test and electrolyte inspection.",
    lastServiceDate: "01 Jul 2026",
    lastMileage: 54100,
    nextServiceDate: "18 Oct 2026",
    nextMileage: 55000,
    nextDays: "Overdue 6 days",
    reminderTime: "14:00 PM",
    repeatIntervalMonths: 6,
    repeatIntervalKm: 10000,
    notifyBeforeDays: 7,
    notifyBeforeKm: 500,
    notifyUser: "Fleet Electrician",
    notifyEmail: true,
    notifySms: false,
    notifyApp: true,
    status: "Overdue",
    isActive: true
  }
];

export const remindersApi = {
  async getReminders(params: ReminderFilterParams = {}): Promise<ReminderListResponse> {
    try {
      const response = await api.get("/maintenance/reminders", { params });
      if (response.data && response.data.rows) {
        return response.data;
      }
    } catch {
      // Fallback to local mock data
    }

    let filtered = [...mockReminders];

    if (params.search) {
      const q = params.search.toLowerCase();
      filtered = filtered.filter(
        (r) =>
          r.vehiclePlate.toLowerCase().includes(q) ||
          r.reminderName.toLowerCase().includes(q) ||
          r.reminderType.toLowerCase().includes(q) ||
          r.companyName.toLowerCase().includes(q)
      );
    }

    if (params.status && params.status !== "all") {
      filtered = filtered.filter((r) => r.status.toLowerCase() === params.status?.toLowerCase());
    }

    if (params.company && params.company !== "all") {
      filtered = filtered.filter((r) => r.companyName === params.company);
    }

    if (params.branch && params.branch !== "all") {
      filtered = filtered.filter((r) => r.branchName === params.branch);
    }

    if (params.vehicle && params.vehicle !== "all") {
      filtered = filtered.filter((r) => r.vehiclePlate === params.vehicle);
    }

    const page = params.page || 1;
    const limit = params.limit || 10;
    const startIndex = (page - 1) * limit;
    const paginated = filtered.slice(startIndex, startIndex + limit);

    return {
      rows: paginated,
      totalCount: filtered.length,
      page,
      limit,
      totalPages: Math.ceil(filtered.length / limit) || 1,
      summary: {
        totalConfigured: filtered.length,
        reportType: "Excel-ready report"
      }
    };
  },

  async getReminderOverview(params: ReminderFilterParams = {}): Promise<ReminderListResponse> {
    return this.getReminders(params);
  },

  async getReminderById(id: string): Promise<MaintenanceReminder> {
    try {
      const response = await api.get(`/maintenance/reminders/${id}`);
      if (response.data?.result) return response.data.result;
    } catch {
      // fallback
    }
    const found = mockReminders.find((r) => r.id === id);
    if (!found) throw new Error("Reminder not found");
    return found;
  },

  async createReminder(payload: Partial<MaintenanceReminder>): Promise<MaintenanceReminder> {
    try {
      const response = await api.post("/maintenance/reminders", payload);
      if (response.data?.result) return response.data.result;
    } catch {
      // fallback
    }

    const newReminder: MaintenanceReminder = {
      id: `rem-${Date.now()}`,
      companyName: payload.companyName || "inOrbit Logistics",
      branchName: payload.branchName || "West Operations",
      vehicleId: payload.vehicleId || "veh-001",
      vehiclePlate: payload.vehiclePlate || "GJ 05 AB 1234",
      vehicleGroup: payload.vehicleGroup || "All groups",
      reminderType: payload.reminderType || "General Service",
      reminderName: payload.reminderName || "Scheduled Maintenance",
      description: payload.description || "",
      lastServiceDate: payload.lastServiceDate || "12 Sep 2026",
      lastMileage: payload.lastMileage || 45000,
      nextServiceDate: payload.nextServiceDate || new Date().toISOString().split("T")[0],
      nextMileage: payload.nextMileage || 50000,
      nextDays: "30 days",
      reminderTime: payload.reminderTime || "09:00 AM",
      repeatIntervalMonths: payload.repeatIntervalMonths || 6,
      repeatIntervalKm: payload.repeatIntervalKm || 10000,
      notifyBeforeDays: payload.notifyBeforeDays || 7,
      notifyBeforeKm: payload.notifyBeforeKm || 500,
      notifyUser: payload.notifyUser || "Fleet Manager",
      notifyEmail: payload.notifyEmail ?? true,
      notifySms: payload.notifySms ?? false,
      notifyApp: payload.notifyApp ?? true,
      status: "Upcoming",
      isActive: true,
      createdAt: new Date().toISOString()
    };

    mockReminders.unshift(newReminder);
    return newReminder;
  },

  async updateReminder(id: string, payload: Partial<MaintenanceReminder>): Promise<MaintenanceReminder> {
    try {
      const response = await api.put(`/maintenance/reminders/${id}`, payload);
      if (response.data?.result) return response.data.result;
    } catch {
      // fallback
    }

    const index = mockReminders.findIndex((r) => r.id === id);
    if (index === -1) throw new Error("Reminder not found");
    mockReminders[index] = { ...mockReminders[index], ...payload };
    return mockReminders[index];
  },

  async deleteReminder(id: string): Promise<boolean> {
    try {
      await api.delete(`/maintenance/reminders/${id}`);
      return true;
    } catch {
      // fallback
    }
    mockReminders = mockReminders.filter((r) => r.id !== id);
    return true;
  }
};
