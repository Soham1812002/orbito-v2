export type ReminderStatus = "Upcoming" | "Scheduled" | "Overdue" | "Completed";

export interface MaintenanceReminder {
  id: string;
  companyName: string;
  branchName: string;
  vehicleId: string;
  vehiclePlate: string;
  vehicleGroup?: string;
  reminderType: string;
  reminderName: string;
  description?: string;
  lastServiceDate?: string;
  lastMileage?: number;
  nextServiceDate: string;
  nextMileage: number;
  nextDays?: number | string;
  reminderTime?: string;
  repeatIntervalMonths?: number;
  repeatIntervalKm?: number;
  notifyBeforeDays?: number;
  notifyBeforeKm?: number;
  notifyUser?: string;
  notifyEmail?: boolean;
  notifySms?: boolean;
  notifyApp?: boolean;
  status: ReminderStatus;
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface ReminderFilterParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
  company?: string;
  branch?: string;
  vehicle?: string;
}

export interface ReminderListResponse {
  rows: MaintenanceReminder[];
  totalCount: number;
  page: number;
  limit: number;
  totalPages: number;
  summary?: {
    totalConfigured: number;
    reportType: string;
  };
}
