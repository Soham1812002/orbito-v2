import {
  IsNotEmpty,
  IsString,
  IsOptional,
  IsNumber,
  IsBoolean,
  Min
} from "class-validator";

export class CreateVehicleExpenseDto {
  @IsString()
  @IsNotEmpty({ message: "companyName is required" })
  companyName!: string;

  @IsString()
  @IsNotEmpty({ message: "branchName is required" })
  branchName!: string;

  @IsString()
  @IsNotEmpty({ message: "vehicleId is required" })
  vehicleId!: string;

  @IsString()
  @IsNotEmpty({ message: "vehiclePlate is required" })
  vehiclePlate!: string;

  @IsOptional()
  @IsString()
  driverName?: string;

  @IsString()
  @IsNotEmpty({ message: "expenseType is required" })
  expenseType!: string;

  @IsOptional()
  @IsString()
  maintenanceType?: string;

  @IsString()
  @IsNotEmpty({ message: "expenseDate is required" })
  expenseDate!: string;

  @IsOptional()
  @IsString()
  fuelType?: string;

  @IsOptional()
  @IsString()
  fuelStation?: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  fuelQuantity?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  fuelRate?: number;

  @IsNumber()
  @Min(0)
  @IsNotEmpty({ message: "expenseAmount is required" })
  expenseAmount!: number;

  @IsNumber()
  @Min(0)
  @IsNotEmpty({ message: "odometer is required" })
  odometer!: number;

  @IsString()
  @IsNotEmpty({ message: "paymentMode is required" })
  paymentMode!: string;

  @IsOptional()
  @IsString()
  invoiceNumber?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  receiptUrl?: string;

  @IsOptional()
  @IsBoolean()
  isReimbursable?: boolean;

  @IsOptional()
  @IsBoolean()
  attachReceiptLater?: boolean;
}

export class UpdateVehicleExpenseDto {
  @IsOptional()
  @IsString()
  companyName?: string;

  @IsOptional()
  @IsString()
  branchName?: string;

  @IsOptional()
  @IsString()
  vehicleId?: string;

  @IsOptional()
  @IsString()
  vehiclePlate?: string;

  @IsOptional()
  @IsString()
  driverName?: string;

  @IsOptional()
  @IsString()
  expenseType?: string;

  @IsOptional()
  @IsString()
  maintenanceType?: string;

  @IsOptional()
  @IsString()
  expenseDate?: string;

  @IsOptional()
  @IsString()
  fuelType?: string;

  @IsOptional()
  @IsString()
  fuelStation?: string;

  @IsOptional()
  @IsNumber()
  fuelQuantity?: number;

  @IsOptional()
  @IsNumber()
  fuelRate?: number;

  @IsOptional()
  @IsNumber()
  expenseAmount?: number;

  @IsOptional()
  @IsNumber()
  odometer?: number;

  @IsOptional()
  @IsString()
  paymentMode?: string;

  @IsOptional()
  @IsString()
  invoiceNumber?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  receiptUrl?: string;

  @IsOptional()
  @IsBoolean()
  isReimbursable?: boolean;

  @IsOptional()
  @IsBoolean()
  attachReceiptLater?: boolean;
}
