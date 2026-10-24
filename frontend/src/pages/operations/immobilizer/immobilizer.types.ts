export interface ImmobilizerAudit {
  id: string;
  companyName?: string;
  branchName?: string;
  vehicleId: string;
  vehiclePlate: string;
  command: "STOP_ENGINE" | "RESUME_ENGINE";
  status: "executed" | "pending" | "failed" | "cancelled";
  operatorId: string;
  operatorName: string;
  reason: string;
  relayVoltage?: number;
  speedAtExecution?: number;
  latitude: number;
  longitude: number;
  locationAddress?: string;
  responseTimeMs?: number;
  createdAt: string;
}

export interface ImmobilizerFilters {
  search?: string;
  command?: string;
  status?: string;
  page?: number;
  limit?: number;
}

export interface LogImmobilizerCommandData {
  vehicleId: string;
  vehiclePlate: string;
  command: "STOP_ENGINE" | "RESUME_ENGINE";
  status?: "executed" | "pending" | "failed" | "cancelled";
  operatorId: string;
  operatorName: string;
  reason: string;
  relayVoltage?: number;
  speedAtExecution?: number;
  latitude: number;
  longitude: number;
  locationAddress?: string;
  responseTimeMs?: number;
}
