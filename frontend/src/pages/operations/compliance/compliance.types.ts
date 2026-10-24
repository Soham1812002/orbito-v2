export interface ComplianceReminder {
  id: string;
  companyName?: string;
  branchName?: string;
  entityType: "vehicle" | "driver" | "depot";
  entityId: string;
  entityIdentifier: string;
  reminderCategory: string;
  documentNumber?: string;
  issueDate?: string;
  expiryDate: string;
  notifyBeforeDays: number;
  notifyEmail: boolean;
  notifySms: boolean;
  notifyPush: boolean;
  status: "active" | "due_soon" | "overdue" | "renewed";
  notes?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface ComplianceFilters {
  search?: string;
  entityType?: string;
  category?: string;
  status?: string;
  page?: number;
  limit?: number;
}

export interface ComplianceFormData {
  companyName?: string;
  branchName?: string;
  entityType: "vehicle" | "driver" | "depot";
  entityId: string;
  entityIdentifier: string;
  reminderCategory: string;
  documentNumber?: string;
  issueDate?: string;
  expiryDate: string;
  notifyBeforeDays: number;
  notifyEmail: boolean;
  notifySms: boolean;
  notifyPush: boolean;
  status?: "active" | "due_soon" | "overdue" | "renewed";
  notes?: string;
}
