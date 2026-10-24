import { z } from "zod";

export const expenseFormSchema = z.object({
  companyName: z.string().min(1, "Please select a company"),
  branchName: z.string().min(1, "Please select a branch"),
  vehicleId: z.string().min(1, "Please select a vehicle"),
  vehiclePlate: z.string().min(1, "Vehicle plate is required"),
  driverName: z.string().optional(),
  expenseType: z.enum(["Fuel", "Maintenance", "Toll", "Parking", "Other"]),
  maintenanceType: z.string().optional(),
  expenseDate: z.string().min(1, "Expense date is required"),
  fuelType: z.string().optional(),
  fuelStation: z.string().optional(),
  fuelQuantity: z.coerce.number().optional(),
  fuelRate: z.coerce.number().optional(),
  expenseAmount: z.coerce.number().min(1, "Expense amount must be greater than 0"),
  odometer: z.coerce.number().min(0, "Odometer value must be positive"),
  paymentMode: z.string().min(1, "Please select a payment mode"),
  invoiceNumber: z.string().optional(),
  description: z.string().optional(),
  receiptUrl: z.string().optional(),
  isReimbursable: z.boolean().default(true),
  attachReceiptLater: z.boolean().default(false)
});

export type ExpenseFormData = z.infer<typeof expenseFormSchema>;
