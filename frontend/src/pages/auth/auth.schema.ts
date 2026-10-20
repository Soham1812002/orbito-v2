import * as z from "zod";

export const signInSchema = z.object({
  email: z
    .string()
    .min(1, "Email or mobile number is required")
    .refine((val) => {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      const phoneRegex = /^[+]?[(]?[0-9]{1,4}[)]?[-\s./0-9]{7,15}$/;
      return emailRegex.test(val) || phoneRegex.test(val);
    }, "Please enter a valid email address or phone number"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  rememberMe: z.boolean().default(true)
});

export const forgotPasswordSchema = z
  .object({
    method: z.enum(["email", "whatsapp"]),
    email: z.string().optional(),
    phone: z.string().optional()
  })
  .superRefine((data, ctx) => {
    if (data.method === "email") {
      if (!data.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["email"],
          message: "Please enter a valid email address"
        });
      }
    } else if (data.method === "whatsapp") {
      if (!data.phone || data.phone.trim().length < 8) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["phone"],
          message: "Please enter a valid WhatsApp phone number"
        });
      }
    }
  });

export type SignInSchema = z.infer<typeof signInSchema>;
export type ForgotPasswordSchema = z.infer<typeof forgotPasswordSchema>;
