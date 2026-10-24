import { z } from "zod";

export const routePathSchema = z.object({
  companyName: z.string().optional(),
  branchName: z.string().optional(),
  routeCode: z
    .string()
    .min(2, "Route code must be at least 2 characters")
    .max(30, "Route code cannot exceed 30 characters"),
  routeName: z
    .string()
    .min(3, "Route name must be at least 3 characters")
    .max(100, "Route name cannot exceed 100 characters"),
  originName: z.string().min(2, "Origin location name is required"),
  originLatitude: z.number().min(-90).max(90, "Origin latitude must be valid"),
  originLongitude: z.number().min(-180).max(180, "Origin longitude must be valid"),
  destinationName: z.string().min(2, "Destination location name is required"),
  destinationLatitude: z.number().min(-90).max(90, "Destination latitude must be valid"),
  destinationLongitude: z.number().min(-180).max(180, "Destination longitude must be valid"),
  distanceKm: z.number().positive("Distance must be greater than 0"),
  estimatedDurationMins: z.number().int().positive("Duration must be a positive integer"),
  maxAllowedSpeed: z.number().min(20).max(150, "Max speed must be between 20 and 150 km/h"),
  bufferRadiusMeters: z.number().min(50).max(5000, "Buffer corridor radius must be 50m - 5000m"),
  waypoints: z
    .array(
      z.object({
        id: z.string(),
        name: z.string().min(1, "Waypoint name required"),
        latitude: z.number(),
        longitude: z.number(),
        stopSequence: z.number(),
        expectedDwellMins: z.number().optional(),
        geofenceRadiusMeters: z.number().optional()
      })
    )
    .optional(),
  isActive: z.boolean().default(true)
});

export type RoutePathSchemaType = z.infer<typeof routePathSchema>;
