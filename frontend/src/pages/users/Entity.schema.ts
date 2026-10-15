import * as z from "zod";

export const userFormSchema = z.object({
  email: z.string().email("Valid email is required"),
  firstName: z.string().min(2, "First name must be at least 2 characters"),
  lastName: z.string().min(2, "Last name must be at least 2 characters"),
  password: z.string().optional(),
  isActive: z.boolean().default(true),
  roleIds: z.array(z.string()).default([])
});

export type UserFormData = z.infer<typeof userFormSchema>;
