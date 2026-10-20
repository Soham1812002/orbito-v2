import apiClient from "../../../utils/api";
import { NormalizedListResult, listAdapter } from "../../../lib/listAdapter";

export interface AuditLogItem {
  id: string;
  _id?: string;
  timestamp: string;
  userName: string;
  userRole: string;
  userInitials: string;
  action: string;
  module: string;
  ipAddress: string;
  status: "SUCCESS" | "WARNING" | "FAILED";
  details: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface AuditLogQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  filter?: {
    status?: string;
    module?: string;
    userRole?: string;
  };
}

export const auditLogApi = {
  getAuditLogs: async (
    params: AuditLogQueryParams,
    signal?: AbortSignal
  ): Promise<NormalizedListResult<AuditLogItem>> => {
    const response = await apiClient.get("/audit-logs", {
      params,
      signal
    });
    return listAdapter<AuditLogItem>(response.data);
  }
};
