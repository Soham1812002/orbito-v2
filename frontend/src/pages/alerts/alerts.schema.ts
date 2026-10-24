import { z } from "zod";

export const alertRuleFormSchema = z.object({
  name: z.string().min(2, "Alert name must be at least 2 characters"),
  alertType: z.string().min(1, "Please select an alert type"),
  severity: z.enum(["critical", "warning", "info"], {
    errorMap: () => ({ message: "Severity must be critical, warning, or info" })
  }),
  vehicleScope: z.enum(["all", "group", "specific"], {
    errorMap: () => ({ message: "Select vehicle scope" })
  }),
  vehicleIds: z.array(z.string()).optional(),
  speedLimit: z.number().min(10).max(200).optional(),
  durationSeconds: z.number().min(0).max(3600).optional(),
  geofenceId: z.string().optional(),
  temperatureThreshold: z.number().optional(),
  idleMinutes: z.number().min(1).max(1440).optional(),
  activeDays: z.array(z.string()).min(1, "Select at least one active day"),
  startTime: z.string().min(1, "Start time is required"),
  endTime: z.string().min(1, "End time is required"),
  notifySms: z.boolean().default(false),
  notifyEmail: z.boolean().default(true),
  notifyPush: z.boolean().default(true),
  recipients: z.array(z.string()).default([]),
  isActive: z.boolean().default(true)
});

export type AlertRuleFormSchema = z.infer<typeof alertRuleFormSchema>;
