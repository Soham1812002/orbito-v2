import { z } from "zod";

export const reminderFormSchema = z.object({
  companyName: z.string().min(1, "Please select a company"),
  branchName: z.string().min(1, "Please select a branch"),
  vehicleId: z.string().min(1, "Please select a vehicle"),
  vehiclePlate: z.string().min(1, "Vehicle plate is required"),
  vehicleGroup: z.string().default("All groups"),
  reminderType: z.string().min(1, "Please select a reminder type"),
  reminderName: z.string().min(2, "Reminder name must be at least 2 characters"),
  reminderDate: z.string().min(1, "Reminder date is required"),
  reminderTime: z.string().default("09:00 AM"),
  odometerDue: z.coerce.number().min(0, "Odometer due must be a positive number"),
  repeat: z.string().default("Does not repeat"),
  repeatIntervalMonths: z.coerce.number().optional(),
  repeatIntervalKm: z.coerce.number().optional(),
  notifyBeforeDays: z.coerce.number().default(7),
  notifyUser: z.string().optional(),
  description: z.string().optional(),
  notifyEmail: z.boolean().default(true),
  notifySms: z.boolean().default(false),
  notifyApp: z.boolean().default(true),
  isActive: z.boolean().default(true)
});

export type ReminderFormData = z.infer<typeof reminderFormSchema>;
