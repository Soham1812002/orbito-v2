export type AlertSeverity = "critical" | "warning" | "info";
export type AlertStatus = "pending" | "acknowledged" | "resolved";
export type VehicleScope = "all" | "group" | "specific";

export interface AlertLog {
  id: string;
  ruleId?: string | null;
  vehicleId: string;
  plateNumber: string;
  companyName: string;
  branchName: string;
  alertType: string;
  alertName: string;
  severity: AlertSeverity;
  message: string;
  triggerValue?: string | null;
  latitude: number;
  longitude: number;
  address: string;
  status: AlertStatus;
  acknowledgedBy?: string | null;
  acknowledgedAt?: string | null;
  resolutionNotes?: string | null;
  createdAt: string;
}

export interface AlertRule {
  id: string;
  companyName: string;
  branchName: string;
  name: string;
  alertType: string;
  severity: AlertSeverity;
  vehicleScope: VehicleScope;
  vehicleIds: string[];
  conditions: {
    speedLimit?: number;
    durationSeconds?: number;
    geofenceId?: string;
    geofenceName?: string;
    temperatureThreshold?: number;
    idleMinutes?: number;
  };
  schedule: {
    days: string[];
    start: string;
    end: string;
  };
  channels: {
    sms: boolean;
    email: boolean;
    push: boolean;
  };
  recipients: string[];
  isActive: boolean;
  createdAt: string;
}

export interface AlertLogFilters {
  page?: number;
  limit?: number;
  search?: string;
  severity?: string;
  alertType?: string;
  status?: string;
  vehiclePlate?: string;
}

export interface AlertRuleFilters {
  page?: number;
  limit?: number;
  search?: string;
  alertType?: string;
  severity?: string;
  isActive?: boolean;
}

export interface AlertRuleFormData {
  name: string;
  alertType: string;
  severity: AlertSeverity;
  vehicleScope: VehicleScope;
  vehicleIds?: string[];
  speedLimit?: number;
  durationSeconds?: number;
  geofenceId?: string;
  temperatureThreshold?: number;
  idleMinutes?: number;
  activeDays: string[];
  startTime: string;
  endTime: string;
  notifySms: boolean;
  notifyEmail: boolean;
  notifyPush: boolean;
  recipients: string[];
  isActive: boolean;
}
