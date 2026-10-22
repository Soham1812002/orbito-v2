import { z } from "zod";

export const poiFormSchema = z.object({
  name: z
    .string()
    .min(2, "POI name must be at least 2 characters")
    .max(100, "POI name cannot exceed 100 characters"),
  company: z.string().min(1, "Company is required"),
  branch: z.string().min(1, "Branch is required"),
  category: z.enum([
    "Toll Plaza",
    "Depot",
    "Plant",
    "Logistics Hub",
    "Staging Yard",
    "Client Site"
  ], {
    required_error: "Please select a POI classification type"
  }),
  street: z.string().min(2, "Street address is required"),
  city: z.string().min(2, "City is required"),
  state: z.string().min(2, "State is required"),
  latitude: z
    .number({ invalid_type_error: "Latitude must be a valid number" })
    .min(-90, "Latitude must be between -90 and 90")
    .max(90, "Latitude must be between -90 and 90"),
  longitude: z
    .number({ invalid_type_error: "Longitude must be a valid number" })
    .min(-180, "Longitude must be between -180 and 180")
    .max(180, "Longitude must be between -180 and 180"),
  description: z.string().max(500, "Description cannot exceed 500 characters").optional(),
  isActive: z.boolean().default(true)
});

export type PoiFormData = z.infer<typeof poiFormSchema>;
