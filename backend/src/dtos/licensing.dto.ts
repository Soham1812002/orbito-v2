import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsNumber,
  IsBoolean,
  IsIn
} from "class-validator";

// 1. Company License DTOs
export class CreateCompanyLicenseDto {
  @IsString()
  @IsNotEmpty({ message: "Company name is required" })
  company!: string;

  @IsOptional()
  @IsString()
  branch?: string;

  @IsOptional()
  @IsString()
  contactPerson?: string;

  @IsOptional()
  @IsString()
  telephone?: string;

  @IsOptional()
  @IsString()
  licenseType?: string;

  @IsString()
  @IsNotEmpty({ message: "License name is required" })
  licenseName!: string;

  @IsString()
  @IsNotEmpty({ message: "License number is required" })
  licenseNumber!: string;

  @IsOptional()
  @IsString()
  issuingAuthority?: string;

  @IsOptional()
  @IsString()
  licenseIssueDate?: string;

  @IsOptional()
  @IsString()
  activationDate?: string;

  @IsOptional()
  @IsString()
  expiryDate?: string;

  @IsOptional()
  @IsString()
  extendDate?: string;

  @IsOptional()
  @IsNumber()
  addedVehicles?: number;

  @IsOptional()
  @IsNumber()
  maxVehicles?: number;

  @IsOptional()
  @IsString()
  @IsIn(["ACTIVE", "EXPIRES_TODAY", "EXPIRING_SOON", "EXPIRED"])
  status?: "ACTIVE" | "EXPIRES_TODAY" | "EXPIRING_SOON" | "EXPIRED";

  @IsOptional()
  @IsString()
  statusLabel?: string;

  @IsOptional()
  @IsString()
  remark?: string;

  @IsOptional()
  @IsString()
  renewalReminder?: string;

  @IsOptional()
  @IsBoolean()
  sendRenewalNotification?: boolean;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}

export class UpdateCompanyLicenseDto {
  @IsOptional()
  @IsString()
  company?: string;

  @IsOptional()
  @IsString()
  branch?: string;

  @IsOptional()
  @IsString()
  contactPerson?: string;

  @IsOptional()
  @IsString()
  telephone?: string;

  @IsOptional()
  @IsString()
  licenseType?: string;

  @IsOptional()
  @IsString()
  licenseName?: string;

  @IsOptional()
  @IsString()
  licenseNumber?: string;

  @IsOptional()
  @IsString()
  issuingAuthority?: string;

  @IsOptional()
  @IsString()
  licenseIssueDate?: string;

  @IsOptional()
  @IsString()
  activationDate?: string;

  @IsOptional()
  @IsString()
  expiryDate?: string;

  @IsOptional()
  @IsString()
  extendDate?: string;

  @IsOptional()
  @IsNumber()
  addedVehicles?: number;

  @IsOptional()
  @IsNumber()
  maxVehicles?: number;

  @IsOptional()
  @IsString()
  @IsIn(["ACTIVE", "EXPIRES_TODAY", "EXPIRING_SOON", "EXPIRED"])
  status?: "ACTIVE" | "EXPIRES_TODAY" | "EXPIRING_SOON" | "EXPIRED";

  @IsOptional()
  @IsString()
  statusLabel?: string;

  @IsOptional()
  @IsString()
  remark?: string;

  @IsOptional()
  @IsString()
  renewalReminder?: string;

  @IsOptional()
  @IsBoolean()
  sendRenewalNotification?: boolean;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}

// 2. User License DTOs
export class CreateUserLicenseDto {
  @IsString()
  @IsNotEmpty({ message: "User name is required" })
  user!: string;

  @IsOptional()
  @IsString()
  userId?: string;

  @IsString()
  @IsNotEmpty({ message: "User email is required" })
  userEmail!: string;

  @IsOptional()
  @IsString()
  userRole?: string;

  @IsOptional()
  @IsString()
  company?: string;

  @IsOptional()
  @IsString()
  branch?: string;

  @IsOptional()
  @IsString()
  telephone?: string;

  @IsOptional()
  @IsString()
  licenseType?: string;

  @IsString()
  @IsNotEmpty({ message: "License number is required" })
  licenseNumber!: string;

  @IsOptional()
  @IsString()
  licenseKey?: string;

  @IsOptional()
  @IsNumber()
  allocatedVehicles?: number;

  @IsOptional()
  @IsString()
  activationDate?: string;

  @IsOptional()
  @IsString()
  expiryDate?: string;

  @IsOptional()
  @IsString()
  extendDate?: string;

  @IsOptional()
  @IsString()
  licenseAmount?: string;

  @IsOptional()
  @IsString()
  paymentStatus?: string;

  @IsOptional()
  @IsString()
  paymentReference?: string;

  @IsOptional()
  @IsString()
  renewalReminder?: string;

  @IsOptional()
  @IsString()
  remark?: string;

  @IsOptional()
  @IsBoolean()
  sendActivationEmail?: boolean;

  @IsOptional()
  @IsBoolean()
  sendRenewalNotification?: boolean;

  @IsOptional()
  @IsString()
  @IsIn(["ACTIVE", "EXPIRES_TODAY", "EXPIRING_SOON", "EXPIRED"])
  status?: "ACTIVE" | "EXPIRES_TODAY" | "EXPIRING_SOON" | "EXPIRED";

  @IsOptional()
  @IsString()
  statusLabel?: string;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}

export class UpdateUserLicenseDto {
  @IsOptional()
  @IsString()
  user?: string;

  @IsOptional()
  @IsString()
  userId?: string;

  @IsOptional()
  @IsString()
  userEmail?: string;

  @IsOptional()
  @IsString()
  userRole?: string;

  @IsOptional()
  @IsString()
  company?: string;

  @IsOptional()
  @IsString()
  branch?: string;

  @IsOptional()
  @IsString()
  telephone?: string;

  @IsOptional()
  @IsString()
  licenseType?: string;

  @IsOptional()
  @IsString()
  licenseNumber?: string;

  @IsOptional()
  @IsString()
  licenseKey?: string;

  @IsOptional()
  @IsNumber()
  allocatedVehicles?: number;

  @IsOptional()
  @IsString()
  activationDate?: string;

  @IsOptional()
  @IsString()
  expiryDate?: string;

  @IsOptional()
  @IsString()
  extendDate?: string;

  @IsOptional()
  @IsString()
  licenseAmount?: string;

  @IsOptional()
  @IsString()
  paymentStatus?: string;

  @IsOptional()
  @IsString()
  paymentReference?: string;

  @IsOptional()
  @IsString()
  renewalReminder?: string;

  @IsOptional()
  @IsString()
  remark?: string;

  @IsOptional()
  @IsBoolean()
  sendActivationEmail?: boolean;

  @IsOptional()
  @IsBoolean()
  sendRenewalNotification?: boolean;

  @IsOptional()
  @IsString()
  @IsIn(["ACTIVE", "EXPIRES_TODAY", "EXPIRING_SOON", "EXPIRED"])
  status?: "ACTIVE" | "EXPIRES_TODAY" | "EXPIRING_SOON" | "EXPIRED";

  @IsOptional()
  @IsString()
  statusLabel?: string;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}

// 3. Vehicle License DTOs
export class CreateVehicleLicenseDto {
  @IsString()
  @IsNotEmpty({ message: "Company is required" })
  company!: string;

  @IsOptional()
  @IsString()
  branch?: string;

  @IsString()
  @IsNotEmpty({ message: "Vehicle model is required" })
  vehicle!: string;

  @IsString()
  @IsNotEmpty({ message: "Registration number is required" })
  registrationNumber!: string;

  @IsOptional()
  @IsString()
  gpsDevice?: string;

  @IsString()
  @IsNotEmpty({ message: "Device IMEI is required" })
  imei!: string;

  @IsOptional()
  @IsString()
  simNumber?: string;

  @IsOptional()
  @IsString()
  licenseType?: string;

  @IsString()
  @IsNotEmpty({ message: "License number is required" })
  licenseNumber!: string;

  @IsOptional()
  @IsString()
  issuingAuthority?: string;

  @IsOptional()
  @IsString()
  licenseIssueDate?: string;

  @IsOptional()
  @IsString()
  activationDate?: string;

  @IsOptional()
  @IsString()
  expiryDate?: string;

  @IsOptional()
  @IsString()
  extendedDate?: string;

  @IsOptional()
  @IsString()
  assignedUser?: string;

  @IsOptional()
  @IsString()
  licenseAmount?: string;

  @IsOptional()
  @IsString()
  paymentReference?: string;

  @IsOptional()
  @IsString()
  renewalReminder?: string;

  @IsOptional()
  @IsString()
  notificationEmail?: string;

  @IsOptional()
  @IsBoolean()
  paymentCompleted?: boolean;

  @IsOptional()
  @IsBoolean()
  sendExpiryNotification?: boolean;

  @IsOptional()
  @IsString()
  @IsIn(["ACTIVE", "EXPIRES_TODAY", "EXPIRING_SOON", "EXPIRED"])
  status?: "ACTIVE" | "EXPIRES_TODAY" | "EXPIRING_SOON" | "EXPIRED";

  @IsOptional()
  @IsString()
  statusLabel?: string;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}

export class UpdateVehicleLicenseDto {
  @IsOptional()
  @IsString()
  company?: string;

  @IsOptional()
  @IsString()
  branch?: string;

  @IsOptional()
  @IsString()
  vehicle?: string;

  @IsOptional()
  @IsString()
  registrationNumber?: string;

  @IsOptional()
  @IsString()
  gpsDevice?: string;

  @IsOptional()
  @IsString()
  imei?: string;

  @IsOptional()
  @IsString()
  simNumber?: string;

  @IsOptional()
  @IsString()
  licenseType?: string;

  @IsOptional()
  @IsString()
  licenseNumber?: string;

  @IsOptional()
  @IsString()
  issuingAuthority?: string;

  @IsOptional()
  @IsString()
  licenseIssueDate?: string;

  @IsOptional()
  @IsString()
  activationDate?: string;

  @IsOptional()
  @IsString()
  expiryDate?: string;

  @IsOptional()
  @IsString()
  extendedDate?: string;

  @IsOptional()
  @IsString()
  assignedUser?: string;

  @IsOptional()
  @IsString()
  licenseAmount?: string;

  @IsOptional()
  @IsString()
  paymentReference?: string;

  @IsOptional()
  @IsString()
  renewalReminder?: string;

  @IsOptional()
  @IsString()
  notificationEmail?: string;

  @IsOptional()
  @IsBoolean()
  paymentCompleted?: boolean;

  @IsOptional()
  @IsBoolean()
  sendExpiryNotification?: boolean;

  @IsOptional()
  @IsString()
  @IsIn(["ACTIVE", "EXPIRES_TODAY", "EXPIRING_SOON", "EXPIRED"])
  status?: "ACTIVE" | "EXPIRES_TODAY" | "EXPIRING_SOON" | "EXPIRED";

  @IsOptional()
  @IsString()
  statusLabel?: string;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}

// 4. Reseller License DTOs
export class CreateResellerLicenseDto {
  @IsString()
  @IsNotEmpty({ message: "Reseller partner name is required" })
  reseller!: string;

  @IsOptional()
  @IsString()
  contactPerson?: string;

  @IsOptional()
  @IsString()
  telephone?: string;

  @IsString()
  @IsNotEmpty({ message: "License number is required" })
  licenseNumber!: string;

  @IsOptional()
  @IsString()
  licenseModel?: string;

  @IsOptional()
  @IsString()
  activationDate?: string;

  @IsOptional()
  @IsString()
  expiryDate?: string;

  @IsOptional()
  @IsString()
  extendedDate?: string;

  @IsOptional()
  @IsNumber()
  allocatedClients?: number;

  @IsOptional()
  @IsNumber()
  allocatedVehicles?: number;

  @IsOptional()
  @IsNumber()
  vehicleQuota?: number;

  @IsOptional()
  @IsString()
  paymentReference?: string;

  @IsOptional()
  @IsString()
  notificationEmail?: string;

  @IsOptional()
  @IsString()
  renewalReminder?: string;

  @IsOptional()
  @IsString()
  remark?: string;

  @IsOptional()
  @IsBoolean()
  paymentCompleted?: boolean;

  @IsOptional()
  @IsBoolean()
  sendExpiryNotification?: boolean;

  @IsOptional()
  @IsString()
  @IsIn(["ACTIVE", "EXPIRES_TODAY", "EXPIRING_SOON", "EXPIRED"])
  status?: "ACTIVE" | "EXPIRES_TODAY" | "EXPIRING_SOON" | "EXPIRED";

  @IsOptional()
  @IsString()
  statusLabel?: string;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}

export class UpdateResellerLicenseDto {
  @IsOptional()
  @IsString()
  reseller?: string;

  @IsOptional()
  @IsString()
  contactPerson?: string;

  @IsOptional()
  @IsString()
  telephone?: string;

  @IsOptional()
  @IsString()
  licenseNumber?: string;

  @IsOptional()
  @IsString()
  licenseModel?: string;

  @IsOptional()
  @IsString()
  activationDate?: string;

  @IsOptional()
  @IsString()
  expiryDate?: string;

  @IsOptional()
  @IsString()
  extendedDate?: string;

  @IsOptional()
  @IsNumber()
  allocatedClients?: number;

  @IsOptional()
  @IsNumber()
  allocatedVehicles?: number;

  @IsOptional()
  @IsNumber()
  vehicleQuota?: number;

  @IsOptional()
  @IsString()
  paymentReference?: string;

  @IsOptional()
  @IsString()
  notificationEmail?: string;

  @IsOptional()
  @IsString()
  renewalReminder?: string;

  @IsOptional()
  @IsString()
  remark?: string;

  @IsOptional()
  @IsBoolean()
  paymentCompleted?: boolean;

  @IsOptional()
  @IsBoolean()
  sendExpiryNotification?: boolean;

  @IsOptional()
  @IsString()
  @IsIn(["ACTIVE", "EXPIRES_TODAY", "EXPIRING_SOON", "EXPIRED"])
  status?: "ACTIVE" | "EXPIRES_TODAY" | "EXPIRING_SOON" | "EXPIRED";

  @IsOptional()
  @IsString()
  statusLabel?: string;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
