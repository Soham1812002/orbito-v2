import { z } from "zod";

export const routeAllocationSchema = z.object({
  companyName: z.string().optional(),
  branchName: z.string().optional(),
  routePathId: z.string().min(1, "Please select a route corridor"),
  vehicleId: z.string().min(1, "Vehicle ID is required"),
  vehiclePlate: z
    .string()
    .min(3, "Vehicle plate must be at least 3 characters")
    .max(20, "Vehicle plate too long"),
  allocationName: z
    .string()
    .min(3, "Allocation group name must be at least 3 characters")
    .max(100, "Name too long"),
  scheduleType: z.enum(["daily", "weekdays", "custom", "on_demand"]),
  activeDays: z.array(z.string()).optional(),
  departureTime: z.string().optional(),
  maxTransitHours: z.number().min(1).max(72).optional(),
  allowDeviation: z.boolean().default(false),
  deviationAlertThresholdMeters: z.number().min(50).max(5000),
  isActive: z.boolean().default(true)
});

export type RouteAllocationSchemaType = z.infer<typeof routeAllocationSchema>;
