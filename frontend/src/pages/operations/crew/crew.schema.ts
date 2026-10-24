import { z } from "zod";

export const crewAllocationSchema = z.object({
  companyName: z.string().optional(),
  branchName: z.string().optional(),
  vehicleId: z.string().min(1, "Vehicle is required"),
  vehiclePlate: z
    .string()
    .min(3, "Vehicle plate must be at least 3 characters")
    .max(20, "Vehicle plate too long"),
  primaryDriverId: z.string().min(1, "Primary driver ID is required"),
  primaryDriverName: z.string().min(2, "Primary driver name is required"),
  primaryDriverPhone: z.string().min(5, "Contact phone number is required"),
  secondaryDriverId: z.string().optional(),
  secondaryDriverName: z.string().optional(),
  cleanerId: z.string().optional(),
  cleanerName: z.string().optional(),
  shiftName: z.string().min(1, "Shift designation is required"),
  startDate: z.string().min(1, "Roster start date is required"),
  endDate: z.string().optional(),
  dutyStatus: z.enum(["on_duty", "off_duty", "standby"]),
  notes: z.string().optional(),
  isActive: z.boolean().default(true)
});

export type CrewAllocationSchemaType = z.infer<typeof crewAllocationSchema>;
