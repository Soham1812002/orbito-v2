import { z } from "zod";

export const complianceSchema = z.object({
  companyName: z.string().optional(),
  branchName: z.string().optional(),
  entityType: z.enum(["vehicle", "driver", "depot"]),
  entityId: z.string().min(1, "Entity identifier is required"),
  entityIdentifier: z.string().min(2, "Entity name or plate is required"),
  reminderCategory: z.string().min(2, "Reminder category is required"),
  documentNumber: z.string().optional(),
  issueDate: z.string().optional(),
  expiryDate: z.string().min(1, "Expiry date is required"),
  notifyBeforeDays: z.number().min(1).max(365),
  notifyEmail: z.boolean().default(true),
  notifySms: z.boolean().default(false),
  notifyPush: z.boolean().default(true),
  status: z.enum(["active", "due_soon", "overdue", "renewed"]).default("active"),
  notes: z.string().optional()
});

export type ComplianceSchemaType = z.infer<typeof complianceSchema>;
