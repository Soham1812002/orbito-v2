import {
  IsNotEmpty,
  IsString,
  IsOptional,
  IsNumber,
  IsBoolean,
  Min
} from "class-validator";

export class CreateMaintenanceReminderDto {
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
  vehicleGroup?: string;

  @IsString()
  @IsNotEmpty({ message: "reminderType is required" })
  reminderType!: string;

  @IsString()
  @IsNotEmpty({ message: "reminderName is required" })
  reminderName!: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  lastServiceDate?: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  lastMileage?: number;

  @IsString()
  @IsNotEmpty({ message: "nextServiceDate is required" })
  nextServiceDate!: string;

  @IsNumber()
  @Min(0)
  @IsNotEmpty({ message: "nextMileage is required" })
  nextMileage!: number;

  @IsOptional()
  @IsString()
  reminderTime?: string;

  @IsOptional()
  @IsNumber()
  @Min(1)
  repeatIntervalMonths?: number;

  @IsOptional()
  @IsNumber()
  @Min(100)
  repeatIntervalKm?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  notifyBeforeDays?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  notifyBeforeKm?: number;

  @IsOptional()
  @IsString()
  notifyUser?: string;

  @IsOptional()
  @IsBoolean()
  notifyEmail?: boolean;

  @IsOptional()
  @IsBoolean()
  notifySms?: boolean;

  @IsOptional()
  @IsBoolean()
  notifyApp?: boolean;

  @IsOptional()
  @IsString()
  status?: string;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}

export class UpdateMaintenanceReminderDto {
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
  vehicleGroup?: string;

  @IsOptional()
  @IsString()
  reminderType?: string;

  @IsOptional()
  @IsString()
  reminderName?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  lastServiceDate?: string;

  @IsOptional()
  @IsNumber()
  lastMileage?: number;

  @IsOptional()
  @IsString()
  nextServiceDate?: string;

  @IsOptional()
  @IsNumber()
  nextMileage?: number;

  @IsOptional()
  @IsString()
  reminderTime?: string;

  @IsOptional()
  @IsNumber()
  repeatIntervalMonths?: number;

  @IsOptional()
  @IsNumber()
  repeatIntervalKm?: number;

  @IsOptional()
  @IsNumber()
  notifyBeforeDays?: number;

  @IsOptional()
  @IsNumber()
  notifyBeforeKm?: number;

  @IsOptional()
  @IsString()
  notifyUser?: string;

  @IsOptional()
  @IsBoolean()
  notifyEmail?: boolean;

  @IsOptional()
  @IsBoolean()
  notifySms?: boolean;

  @IsOptional()
  @IsBoolean()
  notifyApp?: boolean;

  @IsOptional()
  @IsString()
  status?: string;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
