import * as z from "zod";

export const userFormSchema = z.object({
  firstName: z.string().min(2, "First name must be at least 2 characters"),
  lastName: z.string().min(2, "Last name must be at least 2 characters"),
  email: z.string().email("Valid email address is required"),
  phone: z
    .string()
    .min(1, "Phone number is required")
    .refine(
      (val) => {
        const cleaned = val.trim();
        if (!/^[\d\s\-+]+$/.test(cleaned)) return false;

        if (cleaned.startsWith("+91")) {
          const digitsAfterCode = cleaned.slice(3).replace(/\D/g, "");
          return digitsAfterCode.length === 10;
        }
        if (cleaned.startsWith("+")) {
          const digitsOnly = cleaned.replace(/\D/g, "");
          return digitsOnly.length >= 10 && digitsOnly.length <= 15;
        }
        const digits = cleaned.replace(/\D/g, "");
        return digits.length === 10 || (digits.startsWith("91") && digits.length === 12);
      },
      { message: "Please enter a valid 10-digit mobile number" }
    ),
  password: z
    .string()
    .optional()
    .refine((val) => !val || val.length >= 6, {
      message: "Password must be at least 6 characters"
    }),
  confirmPassword: z.string().optional(),
  company: z.string().min(1, "Company selection is required"),
  branch: z.string().optional(),
  reseller: z.string().optional(),
  allocationGroup: z.string().min(1, "Allocation group is required"),
  groupId: z.string().optional().nullable(),
  role: z.string().min(1, "System role is required"),
  roleIds: z.array(z.string()).default([]),
  isActive: z.boolean().default(true),
  language: z.string().default("en"),
  timezone: z.string().default("Asia/Kolkata"),
  dateFormat: z.string().default("DD/MM/YYYY"),
  measurementUnit: z.enum(["km", "mph"]).default("km"),
  features: z.object({
    liveTracking: z.boolean().default(true),
    dashboardCharts: z.boolean().default(true),
    routePlayback: z.boolean().default(true),
    emailAlerts: z.boolean().default(true)
  }).default({
    liveTracking: true,
    dashboardCharts: true,
    routePlayback: true,
    emailAlerts: true
  })
}).refine((data) => {
  if (data.password && (!data.confirmPassword || data.password !== data.confirmPassword)) {
    return false;
  }
  return true;
}, {
  message: "Passwords do not match",
  path: ["confirmPassword"]
});

export type UserFormData = z.infer<typeof userFormSchema>;

export const modulePermissionSchema = z.object({
  id: z.string(),
  category: z.string(),
  module: z.string(),
  accessLevel: z.enum(["full", "view", "custom", "none"]).default("custom"),
  view: z.boolean().default(false),
  add: z.boolean().default(false),
  edit: z.boolean().default(false),
  delete: z.boolean().default(false),
  export: z.boolean().default(false),
  control: z.boolean().default(false)
});

export const userGroupFormSchema = z.object({
  name: z.string().min(2, "Group name must be at least 2 characters"),
  description: z.string().min(5, "Description must be at least 5 characters"),
  company: z.string().min(1, "Company selection is required"),
  branch: z.string().optional(),
  reseller: z.string().optional(),
  adminRole: z.string().min(1, "Administrative role is required"),
  duplicateGroupId: z.string().optional(),
  isActive: z.boolean().default(true),
  allowExcelExport: z.boolean().default(true),
  allowOperationalManage: z.boolean().default(false),
  isSystemAdmin: z.boolean().default(false),
  permissions: z.array(modulePermissionSchema).default([])
});

export type UserGroupFormData = z.infer<typeof userGroupFormSchema>;
