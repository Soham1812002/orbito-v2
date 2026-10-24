import apiClient from "@/utils/api";
import { AlertLog, AlertRule, AlertLogFilters, AlertRuleFilters } from "./alerts.types";

const MOCK_ALERT_LOGS: AlertLog[] = [
  {
    id: "al-101",
    ruleId: "ar-1",
    vehicleId: "veh-001",
    plateNumber: "GJ 05 AB 1234",
    companyName: "inOrbit Logistics",
    branchName: "West Operations",
    alertType: "overspeed",
    alertName: "High Speed Alert (>80 km/h)",
    severity: "critical",
    message: "Vehicle exceeded threshold at 94.6 km/h on Yamuna Expressway",
    triggerValue: "94.6 km/h",
    latitude: 28.4595,
    longitude: 77.0266,
    address: "Yamuna Expressway KM-42, Greater Noida, UP",
    status: "pending",
    createdAt: "2026-10-24T06:15:00.000Z"
  },
  {
    id: "al-102",
    ruleId: "ar-2",
    vehicleId: "veh-002",
    plateNumber: "GJ 01 KM 4821",
    companyName: "inOrbit Logistics",
    branchName: "West Operations",
    alertType: "geofence_breach",
    alertName: "Unscheduled Geofence Exit",
    severity: "warning",
    message: "Vehicle exited Ahmedabad Central Warehouse perimeter outside delivery window",
    triggerValue: "Exit 100m",
    latitude: 23.0225,
    longitude: 72.5714,
    address: "Ahmedabad Central Hub, Ring Road, Gujarat",
    status: "acknowledged",
    acknowledgedBy: "Super Admin",
    acknowledgedAt: "2026-10-24T05:30:00.000Z",
    resolutionNotes: "Driver rerouted due to flyover construction.",
    createdAt: "2026-10-24T05:20:00.000Z"
  },
  {
    id: "al-103",
    ruleId: "ar-3",
    vehicleId: "veh-003",
    plateNumber: "DL 01 AB 7582",
    companyName: "inOrbit Logistics",
    branchName: "North Operations",
    alertType: "power_cut",
    alertName: "GPS Antenna Disconnect",
    severity: "critical",
    message: "Main power feed disconnected from GPS hardware device",
    triggerValue: "0.0 V",
    latitude: 28.7041,
    longitude: 77.1025,
    address: "Karnal Bypass, GT Karnal Road, Delhi",
    status: "pending",
    createdAt: "2026-10-24T04:45:00.000Z"
  },
  {
    id: "al-104",
    ruleId: "ar-4",
    vehicleId: "veh-004",
    plateNumber: "MH 14 DT 9012",
    companyName: "Metro Transport",
    branchName: "Central Fleet",
    alertType: "harsh_braking",
    alertName: "Sudden Deceleration Event",
    severity: "warning",
    message: "Sudden speed drop from 72 km/h to 18 km/h within 1.8 seconds",
    triggerValue: "-0.65 G",
    latitude: 18.5204,
    longitude: 73.8567,
    address: "Mumbai-Pune Expressway Toll Plaza, Maharashtra",
    status: "acknowledged",
    acknowledgedBy: "Rajesh Kumar (Dispatcher)",
    acknowledgedAt: "2026-10-24T03:10:00.000Z",
    resolutionNotes: "Verified camera footage: sudden braking for stray animal.",
    createdAt: "2026-10-24T03:02:00.000Z"
  },
  {
    id: "al-105",
    ruleId: "ar-5",
    vehicleId: "veh-005",
    plateNumber: "HR 26 DQ 5511",
    companyName: "inOrbit Logistics",
    branchName: "North Operations",
    alertType: "idle_timeout",
    alertName: "Excessive Engine Idle (>30m)",
    severity: "info",
    message: "Vehicle engine running with zero speed for 34 consecutive minutes",
    triggerValue: "34 mins",
    latitude: 28.4595,
    longitude: 77.0266,
    address: "Cyber City Phase 2, Gurgaon, Haryana",
    status: "pending",
    createdAt: "2026-10-24T02:15:00.000Z"
  },
  {
    id: "al-106",
    ruleId: "ar-6",
    vehicleId: "veh-001",
    plateNumber: "GJ 05 AB 1234",
    companyName: "inOrbit Logistics",
    branchName: "West Operations",
    alertType: "sos",
    alertName: "Emergency SOS Panic Button",
    severity: "critical",
    message: "Cabin emergency panic button triggered by operator",
    triggerValue: "SOS Press",
    latitude: 28.4595,
    longitude: 77.0266,
    address: "Yamuna Expressway KM-18, UP",
    status: "acknowledged",
    acknowledgedBy: "Super Admin",
    acknowledgedAt: "2026-10-23T22:15:00.000Z",
    resolutionNotes: "False alarm: accidental push during pre-trip inspection.",
    createdAt: "2026-10-23T22:04:00.000Z"
  }
];

const MOCK_ALERT_RULES: AlertRule[] = [
  {
    id: "ar-1",
    companyName: "inOrbit Logistics",
    branchName: "All Branches",
    name: "Expressway Overspeed Threshold",
    alertType: "overspeed",
    severity: "critical",
    vehicleScope: "all",
    vehicleIds: [],
    conditions: { speedLimit: 80, durationSeconds: 15 },
    schedule: { days: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"], start: "00:00", end: "23:59" },
    channels: { sms: true, email: true, push: true },
    recipients: ["Super Admin", "Fleet Safety Desk"],
    isActive: true,
    createdAt: "2026-09-01T08:00:00.000Z"
  },
  {
    id: "ar-2",
    companyName: "inOrbit Logistics",
    branchName: "West Operations",
    name: "Restricted Warehouse Night Exit",
    alertType: "geofence_breach",
    severity: "warning",
    vehicleScope: "group",
    vehicleIds: ["grp-west-heavy"],
    conditions: { geofenceId: "geo-ahmedabad", geofenceName: "Ahmedabad Hub" },
    schedule: { days: ["Mon", "Tue", "Wed", "Thu", "Fri"], start: "21:00", end: "06:00" },
    channels: { sms: false, email: true, push: true },
    recipients: ["Branch Lead - West"],
    isActive: true,
    createdAt: "2026-09-10T10:30:00.000Z"
  },
  {
    id: "ar-3",
    companyName: "inOrbit Logistics",
    branchName: "North Operations",
    name: "GPS Hardware Tamper & Power Cut",
    alertType: "power_cut",
    severity: "critical",
    vehicleScope: "all",
    vehicleIds: [],
    conditions: { durationSeconds: 5 },
    schedule: { days: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"], start: "00:00", end: "23:59" },
    channels: { sms: true, email: true, push: true },
    recipients: ["Fleet Maintenance Lead", "Super Admin"],
    isActive: true,
    createdAt: "2026-09-15T12:00:00.000Z"
  },
  {
    id: "ar-4",
    companyName: "inOrbit Logistics",
    branchName: "All Branches",
    name: "Fuel Wastage Engine Idle Alert",
    alertType: "idle_timeout",
    severity: "info",
    vehicleScope: "all",
    vehicleIds: [],
    conditions: { idleMinutes: 30 },
    schedule: { days: ["Mon", "Tue", "Wed", "Thu", "Fri"], start: "08:00", end: "20:00" },
    channels: { sms: false, email: true, push: true },
    recipients: ["Fleet Dispatch"],
    isActive: true,
    createdAt: "2026-09-20T14:00:00.000Z"
  }
];

export const alertsApi = {
  // ─── LOGS ───────────────────────────────────────────────────────────────────

  async getLogs(params: AlertLogFilters = {}): Promise<{ rows: AlertLog[]; totalCount: number; page: number; limit: number; totalPages: number }> {
    try {
      const response = await apiClient.get("/alerts/logs", { params });
      return response.data;
    } catch {
      let filtered = [...MOCK_ALERT_LOGS];
      if (params.search) {
        const q = params.search.toLowerCase();
        filtered = filtered.filter(
          (l) =>
            l.plateNumber.toLowerCase().includes(q) ||
            l.alertName.toLowerCase().includes(q) ||
            l.address.toLowerCase().includes(q)
        );
      }
      if (params.severity && params.severity !== "all") {
        filtered = filtered.filter((l) => l.severity === params.severity);
      }
      if (params.status && params.status !== "all") {
        filtered = filtered.filter((l) => l.status === params.status);
      }
      if (params.vehiclePlate && params.vehiclePlate !== "all") {
        filtered = filtered.filter((l) => l.plateNumber === params.vehiclePlate);
      }
      return {
        rows: filtered,
        totalCount: filtered.length,
        page: params.page || 1,
        limit: params.limit || 10,
        totalPages: Math.ceil(filtered.length / (params.limit || 10))
      };
    }
  },

  async getRecentFeed(limit: number = 10): Promise<AlertLog[]> {
    try {
      const response = await apiClient.get("/alerts/feed", { params: { limit } });
      return response.data.items || response.data;
    } catch {
      return MOCK_ALERT_LOGS.slice(0, limit);
    }
  },

  async acknowledgeAlert(id: string, resolutionNotes?: string): Promise<AlertLog> {
    try {
      const response = await apiClient.post(`/alerts/logs/${id}/acknowledge`, { resolutionNotes });
      return response.data.result;
    } catch {
      const target = MOCK_ALERT_LOGS.find((l) => l.id === id);
      if (target) {
        target.status = "acknowledged";
        target.acknowledgedBy = "Super Admin";
        target.acknowledgedAt = new Date().toISOString();
        if (resolutionNotes) target.resolutionNotes = resolutionNotes;
        return target;
      }
      throw new Error("Alert incident not found");
    }
  },

  // ─── RULES ──────────────────────────────────────────────────────────────────

  async getRules(params: AlertRuleFilters = {}): Promise<{ rows: AlertRule[]; totalCount: number; page: number; limit: number; totalPages: number }> {
    try {
      const response = await apiClient.get("/alerts/rules", { params });
      return response.data;
    } catch {
      let filtered = [...MOCK_ALERT_RULES];
      if (params.search) {
        const q = params.search.toLowerCase();
        filtered = filtered.filter((r) => r.name.toLowerCase().includes(q) || r.alertType.toLowerCase().includes(q));
      }
      if (params.severity && params.severity !== "all") {
        filtered = filtered.filter((r) => r.severity === params.severity);
      }
      return {
        rows: filtered,
        totalCount: filtered.length,
        page: params.page || 1,
        limit: params.limit || 10,
        totalPages: Math.ceil(filtered.length / (params.limit || 10))
      };
    }
  },

  async getRuleById(id: string): Promise<AlertRule> {
    try {
      const response = await apiClient.get(`/alerts/rules/${id}`);
      return response.data.result;
    } catch {
      const rule = MOCK_ALERT_RULES.find((r) => r.id === id);
      if (!rule) throw new Error("Alert rule not found");
      return rule;
    }
  },

  async createRule(payload: any): Promise<AlertRule> {
    try {
      const response = await apiClient.post("/alerts/rules", payload);
      return response.data.result;
    } catch {
      const newRule: AlertRule = {
        id: `ar-${Date.now()}`,
        companyName: payload.companyName || "inOrbit Logistics",
        branchName: payload.branchName || "All Branches",
        name: payload.name,
        alertType: payload.alertType,
        severity: payload.severity || "warning",
        vehicleScope: payload.vehicleScope || "all",
        vehicleIds: payload.vehicleIds || [],
        conditions: {
          speedLimit: payload.speedLimit,
          durationSeconds: payload.durationSeconds,
          geofenceId: payload.geofenceId,
          temperatureThreshold: payload.temperatureThreshold,
          idleMinutes: payload.idleMinutes
        },
        schedule: {
          days: payload.activeDays || ["Mon", "Tue", "Wed", "Thu", "Fri"],
          start: payload.startTime || "00:00",
          end: payload.endTime || "23:59"
        },
        channels: {
          sms: Boolean(payload.notifySms),
          email: Boolean(payload.notifyEmail),
          push: Boolean(payload.notifyPush)
        },
        recipients: payload.recipients || ["Fleet Dispatch"],
        isActive: payload.isActive !== undefined ? payload.isActive : true,
        createdAt: new Date().toISOString()
      };
      MOCK_ALERT_RULES.unshift(newRule);
      return newRule;
    }
  },

  async updateRule(id: string, payload: any): Promise<AlertRule> {
    try {
      const response = await apiClient.put(`/alerts/rules/${id}`, payload);
      return response.data.result;
    } catch {
      const index = MOCK_ALERT_RULES.findIndex((r) => r.id === id);
      if (index === -1) throw new Error("Alert rule not found");
      MOCK_ALERT_RULES[index] = { ...MOCK_ALERT_RULES[index], ...payload };
      return MOCK_ALERT_RULES[index];
    }
  },

  async toggleRuleActive(id: string): Promise<AlertRule> {
    try {
      const response = await apiClient.patch(`/alerts/rules/${id}/toggle`);
      return response.data.result;
    } catch {
      const rule = MOCK_ALERT_RULES.find((r) => r.id === id);
      if (!rule) throw new Error("Alert rule not found");
      rule.isActive = !rule.isActive;
      return rule;
    }
  },

  async deleteRule(id: string): Promise<{ success: boolean }> {
    try {
      const response = await apiClient.delete(`/alerts/rules/${id}`);
      return response.data;
    } catch {
      const index = MOCK_ALERT_RULES.findIndex((r) => r.id === id);
      if (index !== -1) MOCK_ALERT_RULES.splice(index, 1);
      return { success: true };
    }
  }
};
