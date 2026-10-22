import apiClient from "@/utils/api";
import { NormalizedListResult, listAdapter } from "@/lib/listAdapter";
import { AuditLogItem, AuditLogQueryParams } from "@/types/auditLog.types";

export type { AuditLogItem, AuditLogQueryParams };

const mockAuditLogs: AuditLogItem[] = [
  {
    id: "log-1",
    timestamp: "2026-10-22 17:42:10",
    userName: "Soham Parekh",
    userRole: "SUPER_ADMIN",
    userInitials: "SP",
    action: "UPDATE_CONFIG",
    module: "Fleet Tracking",
    ipAddress: "192.168.1.42",
    status: "SUCCESS",
    details: "Updated GPS telemetry polling interval to 10 seconds for vehicle GJ 01 TX 2045"
  },
  {
    id: "log-2",
    timestamp: "2026-10-22 17:15:02",
    userName: "Rahul Sharma",
    userRole: "OPERATOR",
    userInitials: "RS",
    action: "EXPORT_REPORT",
    module: "Travel Summary",
    ipAddress: "10.0.4.18",
    status: "SUCCESS",
    details: "Exported Excel sheet of 247 fleet vehicles (Range: Today)"
  },
  {
    id: "log-3",
    timestamp: "2026-10-22 16:50:33",
    userName: "Dinesh Mehta",
    userRole: "MAINTENANCE",
    userInitials: "DM",
    action: "SIM_PROVISION",
    module: "Hardware & SIM",
    ipAddress: "192.168.2.11",
    status: "WARNING",
    details: "SIM IMSI 404018274917264 flagged with high roaming latency"
  },
  {
    id: "log-4",
    timestamp: "2026-10-22 15:30:19",
    userName: "System Daemon",
    userRole: "SYSTEM",
    userInitials: "SD",
    action: "AUTH_FAILURE",
    module: "Gateway Authentication",
    ipAddress: "203.192.21.84",
    status: "FAILED",
    details: "Repeated invalid token attempts from unauthorized device gateway IP"
  },
  {
    id: "log-5",
    timestamp: "2026-10-22 14:10:05",
    userName: "Priya Nair",
    userRole: "ADMIN",
    userInitials: "PN",
    action: "ADD_SCHEDULED_REPORT",
    module: "Automation",
    ipAddress: "192.168.1.88",
    status: "SUCCESS",
    details: "Created weekly Stoppage Summary automated schedule for Western Fleet"
  }
];

export const auditLogApi = {
  getAuditLogs: async (
    params: AuditLogQueryParams,
    signal?: AbortSignal
  ): Promise<NormalizedListResult<AuditLogItem>> => {
    try {
      const response = await apiClient.get("/audit-logs", {
        params,
        signal
      });
      if (response.data?.result || response.data?.items) {
        return listAdapter<AuditLogItem>(response.data);
      }
    } catch {
      // Graceful fallback to mock audit trail
    }

    let items = [...mockAuditLogs];
    if (params.search) {
      const q = params.search.toLowerCase();
      items = items.filter(
        (i) =>
          i.userName.toLowerCase().includes(q) ||
          i.action.toLowerCase().includes(q) ||
          i.module.toLowerCase().includes(q) ||
          i.details.toLowerCase().includes(q) ||
          i.ipAddress.includes(q)
      );
    }
    if (params.filter?.status && params.filter.status !== "ALL") {
      items = items.filter((i) => i.status === params.filter?.status);
    }

    return listAdapter<AuditLogItem>({
      rows: items,
      total: items.length,
      page: params.page || 1,
      pageSize: params.limit || 50,
      totalPages: 1
    });
  }
};
