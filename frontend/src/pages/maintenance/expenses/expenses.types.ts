export type ExpenseType = "Fuel" | "Maintenance" | "Toll" | "Parking" | "Other";

export interface VehicleExpense {
  id: string;
  companyName: string;
  branchName: string;
  vehicleId: string;
  vehiclePlate: string;
  driverName?: string;
  expenseType: ExpenseType;
  maintenanceType?: string;
  expenseDate: string;
  fuelType?: string;
  fuelStation?: string;
  fuelQuantity?: number;
  fuelRate?: number;
  expenseAmount: number;
  odometer: number;
  paymentMode: string;
  invoiceNumber?: string;
  description?: string;
  receiptUrl?: string;
  isReimbursable?: boolean;
  attachReceiptLater?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface ExpenseHistoryAggregate {
  company: string;
  branch: string;
  vehicle: string;
  fuelExpense: number;
  maintenanceExpense: number;
  totalExpense: number;
  distance: number;
}

export interface ExpenseFilterParams {
  page?: number;
  limit?: number;
  search?: string;
  expenseType?: string;
  company?: string;
  branch?: string;
  vehicle?: string;
}

export interface ExpenseListResponse {
  rows: VehicleExpense[];
  totalCount: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface ExpenseHistoryResponse {
  rows: ExpenseHistoryAggregate[];
  totalRecords: number;
  page: number;
  limit: number;
}
