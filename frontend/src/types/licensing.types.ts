export type LicenseStatusType = "ACTIVE" | "EXPIRES_TODAY" | "EXPIRING_SOON" | "EXPIRED";

export interface CompanyLicense {
  id: string;
  company: string;
  branch: string;
  contactPerson: string;
  telephone: string;
  licenseType: string;
  licenseName: string;
  licenseNumber: string;
  issuingAuthority: string;
  licenseIssueDate: string;
  activationDate: string;
  expiryDate: string;
  extendDate?: string;
  addedVehicles: number;
  maxVehicles: number;
  status: LicenseStatusType;
  statusLabel?: string;
  remark?: string;
  renewalReminder?: string;
  sendRenewalNotification?: boolean;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface UserLicense {
  id: string;
  user: string;
  userId?: string;
  userEmail?: string;
  userRole: string;
  company: string;
  branch: string;
  telephone: string;
  licenseType: string;
  licenseNumber: string;
  licenseKey?: string;
  allocatedVehicles: number;
  activationDate: string;
  expiryDate: string;
  extendDate?: string;
  licenseAmount?: string;
  paymentStatus?: string;
  paymentReference?: string;
  renewalReminder?: string;
  remark?: string;
  sendActivationEmail?: boolean;
  sendRenewalNotification?: boolean;
  status: LicenseStatusType;
  statusLabel?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface VehicleLicense {
  id: string;
  company: string;
  branch: string;
  vehicle: string;
  vehicleId?: string;
  registrationNumber: string;
  gpsDevice: string;
  imei: string;
  simNumber: string;
  licenseType?: string;
  licenseNumber: string;
  issuingAuthority?: string;
  licenseIssueDate: string;
  activationDate: string;
  expiryDate: string;
  extendedDate?: string;
  assignedUser?: string;
  licenseAmount?: string;
  paymentReference?: string;
  renewalReminder?: string;
  notificationEmail?: string;
  paymentCompleted?: boolean;
  sendExpiryNotification?: boolean;
  status: LicenseStatusType;
  statusLabel?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ResellerLicense {
  id: string;
  reseller: string;
  contactPerson: string;
  telephone: string;
  licenseNumber: string;
  licenseModel: string;
  activationDate: string;
  expiryDate: string;
  extendedDate?: string;
  allocatedClients: number;
  allocatedVehicles: number;
  vehicleQuota: number;
  paymentReference?: string;
  notificationEmail?: string;
  renewalReminder?: string;
  remark?: string;
  paymentCompleted?: boolean;
  sendExpiryNotification?: boolean;
  status: LicenseStatusType;
  statusLabel?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface LicenseFilterParams {
  page?: number;
  limit?: number;
  search?: string;
  company?: string;
  status?: string;
  expiryPeriod?: string;
}

export interface CompanyLicenseFormData {
  company: string;
  branch: string;
  licenseType: string;
  licenseName: string;
  licenseNumber: string;
  issuingAuthority: string;
  licenseIssueDate: string;
  expiryDate: string;
  status: LicenseStatusType;
  renewalReminder: string;
  remarks?: string;
  sendRenewalNotification: boolean;
  isActive: boolean;
}

export interface UserLicenseFormData {
  company: string;
  branch: string;
  user: string;
  userRole: string;
  licenseType: string;
  licenseNumber: string;
  licenseKey?: string;
  startDate: string;
  expiryDate: string;
  status: LicenseStatusType;
  licenseAmount?: string;
  paymentStatus: string;
  paymentReference?: string;
  renewalReminder: string;
  remarks?: string;
  sendActivationEmail: boolean;
  sendRenewalNotification: boolean;
  isActive: boolean;
}

export interface VehicleLicenseFormData {
  company: string;
  branch: string;
  vehicle: string;
  registrationNumber: string;
  licenseNumber: string;
  issuingAuthority: string;
  issueDate: string;
  activationDate?: string;
  expiryDate: string;
  extendedUntil?: string;
  status: LicenseStatusType;
  licenseAmount?: string;
  paymentReference?: string;
  renewalReminder: string;
  notificationEmail?: string;
  remarks?: string;
  paymentCompleted: boolean;
  sendExpiryNotification: boolean;
  isActive: boolean;
}

export interface ResellerLicenseFormData {
  reseller: string;
  licenseStatus: LicenseStatusType;
  licenseNumber: string;
  activationDate: string;
  expiryDate: string;
  extendedUntil?: string;
  noOfVehicles: number;
  licenseModel: string;
  paymentReference?: string;
  notificationEmail?: string;
  renewalReminder: string;
  remarks?: string;
  paymentCompleted: boolean;
  sendExpiryNotification: boolean;
  isActive: boolean;
}
