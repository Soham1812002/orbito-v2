import apiClient from "@/utils/api";
import {
  TravelSummaryRow,
  TripOverviewRow,
  TripDetailEvent,
  StoppageOverviewRow,
  StoppageEvent,
  IdleOverviewRow,
  IdleEvent,
  InactiveOverviewRow,
  InactiveEvent,
  DigitalPortOverviewRow,
  DigitalPortEvent,
  AcSummaryOverviewRow,
  AcEvent,
  SmsEmailSummaryRow,
  VehicleStatusRow,
  VehicleLocationRow,
  DeviceTelemetryPacket,
  SystemLogRow,
  ScheduledReportItem,
  VehicleActivationRow,
  IgnitionSummaryOverviewRow,
  IgnitionEvent,
  ReportKpiMetric,
  ReportFilterState
} from "@/types/reports.types";
import {
  mockTravelSummaryKpis,
  mockTravelSummaryRows,
  mockTripOverviewKpis,
  mockTripOverviewRows,
  mockVehicleTripDetails,
  mockStoppageOverviewKpis,
  mockStoppageOverviewRows,
  mockStoppageEvents,
  mockIdleOverviewKpis,
  mockIdleOverviewRows,
  mockIdleEvents,
  mockInactiveOverviewKpis,
  mockInactiveOverviewRows,
  mockInactiveEvents,
  mockDigitalPortKpis,
  mockDigitalPortRows,
  mockDigitalPortEvents,
  mockAcSummaryKpis,
  mockAcSummaryRows,
  mockAcEvents,
  mockSmsEmailKpis,
  mockSmsEmailRows,
  mockVehicleStatusKpis,
  mockVehicleStatusRows,
  mockVehicleLocationKpis,
  mockVehicleLocationRows,
  mockDeviceTelemetryPacket,
  mockSystemLogKpis,
  mockSystemLogs,
  mockScheduledReportsKpis,
  mockScheduledReports,
  mockVehicleActivationKpis,
  mockVehicleActivationRows,
  mockIgnitionSummaryKpis,
  mockIgnitionOverviewRows,
  mockIgnitionEvents
} from "@/api/mockReportsData";

// Helper for simulated network latency
const simulateLatency = (ms = 150) => new Promise((resolve) => setTimeout(resolve, ms));

export const reportsApi = {
  // 02. Travel Summary
  getTravelSummary: async (
    filters?: ReportFilterState,
    signal?: AbortSignal
  ): Promise<{ kpis: ReportKpiMetric[]; rows: TravelSummaryRow[] }> => {
    try {
      const response = await apiClient.get("/reports/travel-summary", { params: filters, signal });
      if (response.data?.result) return response.data.result;
    } catch {
      // Graceful fallback to rich mock data
    }
    await simulateLatency();
    let filteredRows = [...mockTravelSummaryRows];
    if (filters?.search) {
      const q = filters.search.toLowerCase();
      filteredRows = filteredRows.filter(
        (r) =>
          r.vehicleNo.toLowerCase().includes(q) ||
          r.driverName.toLowerCase().includes(q) ||
          r.startLocation.toLowerCase().includes(q) ||
          r.endLocation.toLowerCase().includes(q)
      );
    }
    return { kpis: mockTravelSummaryKpis, rows: filteredRows };
  },

  // 03. Trip Summary Overview
  getTripOverview: async (
    filters?: ReportFilterState,
    signal?: AbortSignal
  ): Promise<{ kpis: ReportKpiMetric[]; rows: TripOverviewRow[] }> => {
    try {
      const response = await apiClient.get("/reports/trip-summary", { params: filters, signal });
      if (response.data?.result) return response.data.result;
    } catch {
      // Graceful fallback
    }
    await simulateLatency();
    let filteredRows = [...mockTripOverviewRows];
    if (filters?.search) {
      const q = filters.search.toLowerCase();
      filteredRows = filteredRows.filter(
        (r) => r.vehicleNo.toLowerCase().includes(q) || r.vehicleType.toLowerCase().includes(q)
      );
    }
    return { kpis: mockTripOverviewKpis, rows: filteredRows };
  },

  // 04. Trip Details (Event View)
  getVehicleTripDetails: async (
    vehicleId: string,
    filters?: ReportFilterState,
    signal?: AbortSignal
  ): Promise<{ vehicleId: string; trips: TripDetailEvent[] }> => {
    try {
      const response = await apiClient.get(`/reports/trip-summary/${vehicleId}`, {
        params: filters,
        signal
      });
      if (response.data?.result) return response.data.result;
    } catch {
      // Fallback
    }
    await simulateLatency();
    return { vehicleId, trips: mockVehicleTripDetails };
  },

  // 05. Stoppage Summary Overview
  getStoppageOverview: async (
    filters?: ReportFilterState,
    signal?: AbortSignal
  ): Promise<{ kpis: ReportKpiMetric[]; rows: StoppageOverviewRow[] }> => {
    try {
      const response = await apiClient.get("/reports/stoppage-summary", { params: filters, signal });
      if (response.data?.result) return response.data.result;
    } catch {
      // Fallback
    }
    await simulateLatency();
    return { kpis: mockStoppageOverviewKpis, rows: mockStoppageOverviewRows };
  },

  // 06. Stoppage Event View
  getStoppageEvents: async (
    vehicleId: string,
    filters?: ReportFilterState,
    signal?: AbortSignal
  ): Promise<{ vehicleId: string; events: StoppageEvent[] }> => {
    try {
      const response = await apiClient.get(`/reports/stoppage-summary/${vehicleId}`, {
        params: filters,
        signal
      });
      if (response.data?.result) return response.data.result;
    } catch {
      // Fallback
    }
    await simulateLatency();
    return { vehicleId, events: mockStoppageEvents };
  },

  // 07. Idle Summary Overview
  getIdleOverview: async (
    filters?: ReportFilterState,
    signal?: AbortSignal
  ): Promise<{ kpis: ReportKpiMetric[]; rows: IdleOverviewRow[] }> => {
    try {
      const response = await apiClient.get("/reports/idle-summary", { params: filters, signal });
      if (response.data?.result) return response.data.result;
    } catch {
      // Fallback
    }
    await simulateLatency();
    return { kpis: mockIdleOverviewKpis, rows: mockIdleOverviewRows };
  },

  // 08. Idle Event View
  getIdleEvents: async (
    vehicleId: string,
    filters?: ReportFilterState,
    signal?: AbortSignal
  ): Promise<{ vehicleId: string; events: IdleEvent[] }> => {
    try {
      const response = await apiClient.get(`/reports/idle-summary/${vehicleId}`, {
        params: filters,
        signal
      });
      if (response.data?.result) return response.data.result;
    } catch {
      // Fallback
    }
    await simulateLatency();
    return { vehicleId, events: mockIdleEvents };
  },

  // 09. Inactive Summary Overview
  getInactiveOverview: async (
    filters?: ReportFilterState,
    signal?: AbortSignal
  ): Promise<{ kpis: ReportKpiMetric[]; rows: InactiveOverviewRow[] }> => {
    try {
      const response = await apiClient.get("/reports/inactive-summary", { params: filters, signal });
      if (response.data?.result) return response.data.result;
    } catch {
      // Fallback
    }
    await simulateLatency();
    return { kpis: mockInactiveOverviewKpis, rows: mockInactiveOverviewRows };
  },

  // 10. Inactive Event View
  getInactiveEvents: async (
    vehicleId: string,
    filters?: ReportFilterState,
    signal?: AbortSignal
  ): Promise<{ vehicleId: string; events: InactiveEvent[] }> => {
    try {
      const response = await apiClient.get(`/reports/inactive-summary/${vehicleId}`, {
        params: filters,
        signal
      });
      if (response.data?.result) return response.data.result;
    } catch {
      // Fallback
    }
    await simulateLatency();
    return { vehicleId, events: mockInactiveEvents };
  },

  // 11. Digital Port Summary Overview
  getDigitalPortOverview: async (
    filters?: ReportFilterState,
    signal?: AbortSignal
  ): Promise<{ kpis: ReportKpiMetric[]; rows: DigitalPortOverviewRow[] }> => {
    try {
      const response = await apiClient.get("/reports/digital-port-summary", {
        params: filters,
        signal
      });
      if (response.data?.result) return response.data.result;
    } catch {
      // Fallback
    }
    await simulateLatency();
    return { kpis: mockDigitalPortKpis, rows: mockDigitalPortRows };
  },

  // 12. Digital Port Event View
  getDigitalPortEvents: async (
    vehicleId: string,
    filters?: ReportFilterState,
    signal?: AbortSignal
  ): Promise<{ vehicleId: string; events: DigitalPortEvent[] }> => {
    try {
      const response = await apiClient.get(`/reports/digital-port-summary/${vehicleId}`, {
        params: filters,
        signal
      });
      if (response.data?.result) return response.data.result;
    } catch {
      // Fallback
    }
    await simulateLatency();
    return { vehicleId, events: mockDigitalPortEvents };
  },

  // 13. AC Summary Overview
  getAcSummaryOverview: async (
    filters?: ReportFilterState,
    signal?: AbortSignal
  ): Promise<{ kpis: ReportKpiMetric[]; rows: AcSummaryOverviewRow[] }> => {
    try {
      const response = await apiClient.get("/reports/ac-summary", { params: filters, signal });
      if (response.data?.result) return response.data.result;
    } catch {
      // Fallback
    }
    await simulateLatency();
    return { kpis: mockAcSummaryKpis, rows: mockAcSummaryRows };
  },

  // 14. AC Event View
  getAcEvents: async (
    vehicleId: string,
    filters?: ReportFilterState,
    signal?: AbortSignal
  ): Promise<{ vehicleId: string; events: AcEvent[] }> => {
    try {
      const response = await apiClient.get(`/reports/ac-summary/${vehicleId}`, {
        params: filters,
        signal
      });
      if (response.data?.result) return response.data.result;
    } catch {
      // Fallback
    }
    await simulateLatency();
    return { vehicleId, events: mockAcEvents };
  },

  // 15. SMS & Email Summary
  getSmsEmailSummary: async (
    filters?: ReportFilterState,
    signal?: AbortSignal
  ): Promise<{ kpis: ReportKpiMetric[]; rows: SmsEmailSummaryRow[] }> => {
    try {
      const response = await apiClient.get("/reports/sms-email-summary", { params: filters, signal });
      if (response.data?.result) return response.data.result;
    } catch {
      // Fallback
    }
    await simulateLatency();
    return { kpis: mockSmsEmailKpis, rows: mockSmsEmailRows };
  },

  // 16. Vehicle Status Report
  getVehicleStatusReport: async (
    filters?: ReportFilterState,
    signal?: AbortSignal
  ): Promise<{ kpis: ReportKpiMetric[]; rows: VehicleStatusRow[] }> => {
    try {
      const response = await apiClient.get("/reports/vehicle-status", { params: filters, signal });
      if (response.data?.result) return response.data.result;
    } catch {
      // Fallback
    }
    await simulateLatency();
    return { kpis: mockVehicleStatusKpis, rows: mockVehicleStatusRows };
  },

  // 17. Vehicle Location Report
  getVehicleLocationReport: async (
    filters?: ReportFilterState,
    signal?: AbortSignal
  ): Promise<{ kpis: ReportKpiMetric[]; rows: VehicleLocationRow[] }> => {
    try {
      const response = await apiClient.get("/reports/vehicle-location", { params: filters, signal });
      if (response.data?.result) return response.data.result;
    } catch {
      // Fallback
    }
    await simulateLatency();
    return { kpis: mockVehicleLocationKpis, rows: mockVehicleLocationRows };
  },

  // 18. Device Log (IMEI Lookup)
  getDeviceTelemetryPacket: async (
    imei: string,
    signal?: AbortSignal
  ): Promise<DeviceTelemetryPacket> => {
    try {
      const response = await apiClient.get(`/reports/device-log/${imei}`, { signal });
      if (response.data?.result) return response.data.result;
    } catch {
      // Fallback
    }
    await simulateLatency();
    return { ...mockDeviceTelemetryPacket, imei };
  },

  // 19. System Log
  getSystemLogs: async (
    filters?: ReportFilterState,
    signal?: AbortSignal
  ): Promise<{ kpis: ReportKpiMetric[]; logs: SystemLogRow[] }> => {
    try {
      const response = await apiClient.get("/reports/system-log", { params: filters, signal });
      if (response.data?.result) return response.data.result;
    } catch {
      // Fallback
    }
    await simulateLatency();
    return { kpis: mockSystemLogKpis, logs: mockSystemLogs };
  },

  // 20. Scheduled Reports List
  getScheduledReports: async (
    signal?: AbortSignal
  ): Promise<{ kpis: ReportKpiMetric[]; items: ScheduledReportItem[] }> => {
    try {
      const response = await apiClient.get("/reports/scheduled-reports", { signal });
      if (response.data?.result) return response.data.result;
    } catch {
      // Fallback
    }
    await simulateLatency();
    return { kpis: mockScheduledReportsKpis, items: mockScheduledReports };
  },

  // 21. Create Scheduled Report
  createScheduledReport: async (
    payload: Partial<ScheduledReportItem>
  ): Promise<ScheduledReportItem> => {
    try {
      const response = await apiClient.post("/reports/scheduled-reports", payload);
      if (response.data?.result) return response.data.result;
    } catch {
      // Fallback
    }
    await simulateLatency();
    return {
      id: `sched-${Date.now()}`,
      scheduleName: payload.scheduleName || "Untitled Schedule",
      reportType: payload.reportType || "Travel Summary",
      company: payload.company || "Apex Logistics",
      branch: payload.branch || "All Branches",
      vehicleScope: payload.vehicleScope || "All active vehicles (48)",
      frequency: payload.frequency || "Daily",
      fileFormat: payload.fileFormat || "Excel (.xlsx)",
      nextDelivery: "Tomorrow at 07:00 AM",
      recipients: payload.recipients || ["fleet-ops@apexlogistics.in"],
      isActive: true,
      deliveryStatus: "Active"
    };
  },

  // 22. Vehicle Activation Report
  getVehicleActivationReport: async (
    filters?: ReportFilterState,
    signal?: AbortSignal
  ): Promise<{ kpis: ReportKpiMetric[]; rows: VehicleActivationRow[] }> => {
    try {
      const response = await apiClient.get("/reports/vehicle-activation", {
        params: filters,
        signal
      });
      if (response.data?.result) return response.data.result;
    } catch {
      // Fallback
    }
    await simulateLatency();
    return { kpis: mockVehicleActivationKpis, rows: mockVehicleActivationRows };
  },

  // 23. Ignition Summary Overview
  getIgnitionOverview: async (
    filters?: ReportFilterState,
    signal?: AbortSignal
  ): Promise<{ kpis: ReportKpiMetric[]; rows: IgnitionSummaryOverviewRow[] }> => {
    try {
      const response = await apiClient.get("/reports/ignition-summary", { params: filters, signal });
      if (response.data?.result) return response.data.result;
    } catch {
      // Fallback
    }
    await simulateLatency();
    return { kpis: mockIgnitionSummaryKpis, rows: mockIgnitionOverviewRows };
  },

  // 24. Ignition Detailed Event View
  getIgnitionEvents: async (
    vehicleId: string,
    filters?: ReportFilterState,
    signal?: AbortSignal
  ): Promise<{ vehicleId: string; events: IgnitionEvent[] }> => {
    try {
      const response = await apiClient.get(`/reports/ignition-summary/${vehicleId}`, {
        params: filters,
        signal
      });
      if (response.data?.result) return response.data.result;
    } catch {
      // Fallback
    }
    await simulateLatency();
    return { vehicleId, events: mockIgnitionEvents };
  }
};
