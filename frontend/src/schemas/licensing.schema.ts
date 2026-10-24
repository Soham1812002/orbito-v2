import { z } from "zod";

export const licenseStatusEnum = z.enum(["ACTIVE", "EXPIRES_TODAY", "EXPIRING_SOON", "EXPIRED"]);

export const companyLicenseFormSchema = z.object({
  company: z.string().min(1, "Company is required"),
  branch: z.string().min(1, "Branch is required"),
  licenseType: z.string().min(1, "License type is required"),
  licenseName: z.string().min(1, "License name is required"),
  licenseNumber: z.string().min(1, "License number is required"),
  issuingAuthority: z.string().min(1, "Issuing authority is required"),
  licenseIssueDate: z.string().min(1, "Issue date is required"),
  expiryDate: z.string().min(1, "Expiry date is required"),
  status: licenseStatusEnum.default("ACTIVE"),
  renewalReminder: z.string().default("30 days before expiry"),
  remarks: z.string().optional(),
  sendRenewalNotification: z.boolean().default(true),
  isActive: z.boolean().default(true)
});

export const userLicenseFormSchema = z.object({
  company: z.string().min(1, "Company is required"),
  branch: z.string().min(1, "Branch is required"),
  user: z.string().min(1, "User is required"),
  userRole: z.string().min(1, "User role is required"),
  licenseType: z.string().min(1, "License type is required"),
  licenseNumber: z.string().min(1, "License number is required"),
  licenseKey: z.string().optional(),
  startDate: z.string().min(1, "Start date is required"),
  expiryDate: z.string().min(1, "Expiry date is required"),
  status: licenseStatusEnum.default("ACTIVE"),
  licenseAmount: z.string().optional(),
  paymentStatus: z.string().default("Paid"),
  paymentReference: z.string().optional(),
  renewalReminder: z.string().default("30 days before expiry"),
  remarks: z.string().optional(),
  sendActivationEmail: z.boolean().default(true),
  sendRenewalNotification: z.boolean().default(true),
  isActive: z.boolean().default(true)
});

export const vehicleLicenseFormSchema = z.object({
  company: z.string().min(1, "Company is required"),
  branch: z.string().optional().default(""),
  vehicle: z.string().min(1, "Vehicle plate is required"),
  registrationNumber: z.string().min(1, "Registration number is required"),
  licenseNumber: z.string().min(1, "License number is required"),
  issuingAuthority: z.string().min(1, "Issuing authority is required"),
  issueDate: z.string().min(1, "Issue date is required"),
  activationDate: z.string().optional().default(""),
  expiryDate: z.string().min(1, "Expiry date is required"),
  extendedUntil: z.string().optional(),
  status: licenseStatusEnum.default("ACTIVE"),
  licenseAmount: z.string().optional(),
  paymentReference: z.string().optional(),
  renewalReminder: z.string().default("30 days before expiry"),
  notificationEmail: z.string().email("Invalid notification email").optional().or(z.literal("")),
  remarks: z.string().optional(),
  paymentCompleted: z.boolean().default(true),
  sendExpiryNotification: z.boolean().default(true),
  isActive: z.boolean().default(true)
});

export const resellerLicenseFormSchema = z.object({
  reseller: z.string().min(1, "Reseller is required"),
  licenseStatus: licenseStatusEnum.default("ACTIVE"),
  licenseNumber: z.string().min(1, "License number is required"),
  activationDate: z.string().min(1, "Activation date is required"),
  expiryDate: z.string().min(1, "Expiry date is required"),
  extendedUntil: z.string().optional(),
  noOfVehicles: z.coerce.number().min(1, "Quota must be at least 1 vehicle"),
  licenseModel: z.string().min(1, "License model is required"),
  paymentReference: z.string().optional(),
  notificationEmail: z.string().email("Invalid notification email").optional().or(z.literal("")),
  renewalReminder: z.string().default("30 days before expiry"),
  remarks: z.string().optional(),
  paymentCompleted: z.boolean().default(true),
  sendExpiryNotification: z.boolean().default(true),
  isActive: z.boolean().default(true)
});

export type CompanyLicenseFormValues = z.infer<typeof companyLicenseFormSchema>;
export type UserLicenseFormValues = z.infer<typeof userLicenseFormSchema>;
export type VehicleLicenseFormValues = z.infer<typeof vehicleLicenseFormSchema>;
export type ResellerLicenseFormValues = z.infer<typeof resellerLicenseFormSchema>;
