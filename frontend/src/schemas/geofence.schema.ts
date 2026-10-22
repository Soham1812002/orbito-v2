import { z } from "zod";

export const geofenceFormSchema = z.object({
  name: z
    .string()
    .min(2, "Geofence name must be at least 2 characters")
    .max(100, "Geofence name cannot exceed 100 characters"),
  type: z.enum(["polygon", "circular"], {
    required_error: "Please select boundary type"
  }),
  category: z.enum([
    "Warehouse",
    "Plant",
    "Yard",
    "Restricted Zone",
    "Customer Depot"
  ], {
    required_error: "Please select a zone category"
  }),
  company: z.string().min(1, "Company is required"),
  branch: z.string().min(1, "Branch is required"),
  centerLatitude: z
    .number({ invalid_type_error: "Center latitude must be a valid number" })
    .min(-90, "Latitude must be between -90 and 90")
    .max(90, "Latitude must be between -90 and 90"),
  centerLongitude: z
    .number({ invalid_type_error: "Center longitude must be a valid number" })
    .min(-180, "Longitude must be between -180 and 180")
    .max(180, "Longitude must be between -180 and 180"),
  radiusMeters: z
    .number({ invalid_type_error: "Radius must be a number" })
    .min(50, "Minimum geofence radius is 50 meters")
    .max(50000, "Maximum geofence radius is 50,000 meters")
    .optional(),
  speedLimitKmh: z
    .number()
    .min(5, "Minimum speed limit is 5 km/h")
    .max(150, "Maximum speed limit is 150 km/h")
    .optional(),
  alertOnEnter: z.boolean().default(true),
  alertOnExit: z.boolean().default(true),
  alertOnOverstay: z.boolean().default(false),
  maxDwellMinutes: z.number().min(5).max(1440).optional(),
  description: z.string().max(500, "Description cannot exceed 500 characters").optional(),
  isActive: z.boolean().default(true)
});

export type GeofenceFormData = z.infer<typeof geofenceFormSchema>;
