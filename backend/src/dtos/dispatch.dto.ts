import {
  IsNotEmpty,
  IsString,
  IsOptional,
  IsBoolean,
  IsNumber,
  IsIn,
  IsArray
} from "class-validator";

// 1. Route Path DTOs
export class CreateRoutePathDto {
  @IsOptional()
  @IsString()
  companyName?: string;

  @IsOptional()
  @IsString()
  branchName?: string;

  @IsString()
  @IsNotEmpty({ message: "Route code is required" })
  routeCode!: string;

  @IsString()
  @IsNotEmpty({ message: "Route name is required" })
  routeName!: string;

  @IsString()
  @IsNotEmpty({ message: "Origin name is required" })
  originName!: string;

  @IsNumber()
  originLatitude!: number;

  @IsNumber()
  originLongitude!: number;

  @IsString()
  @IsNotEmpty({ message: "Destination name is required" })
  destinationName!: string;

  @IsNumber()
  destinationLatitude!: number;

  @IsNumber()
  destinationLongitude!: number;

  @IsNumber()
  distanceKm!: number;

  @IsNumber()
  estimatedDurationMins!: number;

  @IsOptional()
  @IsNumber()
  maxAllowedSpeed?: number;

  @IsOptional()
  @IsNumber()
  bufferRadiusMeters?: number;

  @IsOptional()
  @IsArray()
  waypoints?: any[];

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}

export class UpdateRoutePathDto {
  @IsOptional()
  @IsString()
  routeName?: string;

  @IsOptional()
  @IsString()
  originName?: string;

  @IsOptional()
  @IsNumber()
  originLatitude?: number;

  @IsOptional()
  @IsNumber()
  originLongitude?: number;

  @IsOptional()
  @IsString()
  destinationName?: string;

  @IsOptional()
  @IsNumber()
  destinationLatitude?: number;

  @IsOptional()
  @IsNumber()
  destinationLongitude?: number;

  @IsOptional()
  @IsNumber()
  distanceKm?: number;

  @IsOptional()
  @IsNumber()
  estimatedDurationMins?: number;

  @IsOptional()
  @IsNumber()
  maxAllowedSpeed?: number;

  @IsOptional()
  @IsNumber()
  bufferRadiusMeters?: number;

  @IsOptional()
  @IsArray()
  waypoints?: any[];

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}

// 2. Route Allocation DTOs
export class CreateRouteAllocationDto {
  @IsString()
  @IsNotEmpty({ message: "routePathId is required" })
  routePathId!: string;

  @IsString()
  @IsNotEmpty({ message: "vehicleId is required" })
  vehicleId!: string;

  @IsString()
  @IsNotEmpty({ message: "vehiclePlate is required" })
  vehiclePlate!: string;

  @IsOptional()
  @IsString()
  companyName?: string;

  @IsOptional()
  @IsString()
  branchName?: string;

  @IsString()
  @IsNotEmpty({ message: "allocationName is required" })
  allocationName!: string;

  @IsOptional()
  @IsString()
  @IsIn(["daily", "weekdays", "custom", "on_demand"])
  scheduleType?: "daily" | "weekdays" | "custom" | "on_demand";

  @IsOptional()
  @IsArray()
  activeDays?: string[];

  @IsOptional()
  @IsString()
  departureTime?: string;

  @IsOptional()
  @IsNumber()
  maxTransitHours?: number;

  @IsOptional()
  @IsBoolean()
  allowDeviation?: boolean;

  @IsOptional()
  @IsNumber()
  deviationAlertThresholdMeters?: number;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}

export class UpdateRouteAllocationDto {
  @IsOptional()
  @IsString()
  allocationName?: string;

  @IsOptional()
  @IsString()
  @IsIn(["daily", "weekdays", "custom", "on_demand"])
  scheduleType?: "daily" | "weekdays" | "custom" | "on_demand";

  @IsOptional()
  @IsArray()
  activeDays?: string[];

  @IsOptional()
  @IsString()
  departureTime?: string;

  @IsOptional()
  @IsNumber()
  maxTransitHours?: number;

  @IsOptional()
  @IsBoolean()
  allowDeviation?: boolean;

  @IsOptional()
  @IsNumber()
  deviationAlertThresholdMeters?: number;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}

// 3. Crew Allocation DTOs
export class CreateCrewAllocationDto {
  @IsOptional()
  @IsString()
  companyName?: string;

  @IsOptional()
  @IsString()
  branchName?: string;

  @IsString()
  @IsNotEmpty({ message: "vehicleId is required" })
  vehicleId!: string;

  @IsString()
  @IsNotEmpty({ message: "vehiclePlate is required" })
  vehiclePlate!: string;

  @IsString()
  @IsNotEmpty({ message: "primaryDriverId is required" })
  primaryDriverId!: string;

  @IsString()
  @IsNotEmpty({ message: "primaryDriverName is required" })
  primaryDriverName!: string;

  @IsString()
  @IsNotEmpty({ message: "primaryDriverPhone is required" })
  primaryDriverPhone!: string;

  @IsOptional()
  @IsString()
  secondaryDriverId?: string;

  @IsOptional()
  @IsString()
  secondaryDriverName?: string;

  @IsOptional()
  @IsString()
  cleanerId?: string;

  @IsOptional()
  @IsString()
  cleanerName?: string;

  @IsOptional()
  @IsString()
  shiftName?: string;

  @IsString()
  @IsNotEmpty({ message: "startDate is required" })
  startDate!: string;

  @IsOptional()
  @IsString()
  endDate?: string;

  @IsOptional()
  @IsString()
  @IsIn(["on_duty", "off_duty", "standby"])
  dutyStatus?: "on_duty" | "off_duty" | "standby";

  @IsOptional()
  @IsString()
  notes?: string;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}

export class UpdateCrewAllocationDto {
  @IsOptional()
  @IsString()
  primaryDriverId?: string;

  @IsOptional()
  @IsString()
  primaryDriverName?: string;

  @IsOptional()
  @IsString()
  primaryDriverPhone?: string;

  @IsOptional()
  @IsString()
  secondaryDriverId?: string;

  @IsOptional()
  @IsString()
  secondaryDriverName?: string;

  @IsOptional()
  @IsString()
  cleanerId?: string;

  @IsOptional()
  @IsString()
  cleanerName?: string;

  @IsOptional()
  @IsString()
  shiftName?: string;

  @IsOptional()
  @IsString()
  startDate?: string;

  @IsOptional()
  @IsString()
  endDate?: string;

  @IsOptional()
  @IsString()
  @IsIn(["on_duty", "off_duty", "standby"])
  dutyStatus?: "on_duty" | "off_duty" | "standby";

  @IsOptional()
  @IsString()
  notes?: string;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}

// 4. Immobilizer Audit DTO
export class CreateImmobilizerAuditDto {
  @IsString()
  @IsNotEmpty({ message: "vehicleId is required" })
  vehicleId!: string;

  @IsString()
  @IsNotEmpty({ message: "vehiclePlate is required" })
  vehiclePlate!: string;

  @IsOptional()
  @IsString()
  companyName?: string;

  @IsOptional()
  @IsString()
  branchName?: string;

  @IsString()
  @IsIn(["STOP_ENGINE", "RESUME_ENGINE"])
  command!: "STOP_ENGINE" | "RESUME_ENGINE";

  @IsOptional()
  @IsString()
  status?: "executed" | "pending" | "failed" | "cancelled";

  @IsString()
  @IsNotEmpty({ message: "operatorId is required" })
  operatorId!: string;

  @IsString()
  @IsNotEmpty({ message: "operatorName is required" })
  operatorName!: string;

  @IsString()
  @IsNotEmpty({ message: "reason is required" })
  reason!: string;

  @IsOptional()
  @IsNumber()
  relayVoltage?: number;

  @IsOptional()
  @IsNumber()
  speedAtExecution?: number;

  @IsNumber()
  latitude!: number;

  @IsNumber()
  longitude!: number;

  @IsOptional()
  @IsString()
  locationAddress?: string;

  @IsOptional()
  @IsNumber()
  responseTimeMs?: number;
}

// 5. Compliance Reminder DTOs
export class CreateComplianceReminderDto {
  @IsOptional()
  @IsString()
  companyName?: string;

  @IsOptional()
  @IsString()
  branchName?: string;

  @IsOptional()
  @IsString()
  @IsIn(["vehicle", "driver", "depot"])
  entityType?: "vehicle" | "driver" | "depot";

  @IsString()
  @IsNotEmpty({ message: "entityId is required" })
  entityId!: string;

  @IsString()
  @IsNotEmpty({ message: "entityIdentifier is required" })
  entityIdentifier!: string;

  @IsString()
  @IsNotEmpty({ message: "reminderCategory is required" })
  reminderCategory!: string;

  @IsOptional()
  @IsString()
  documentNumber?: string;

  @IsOptional()
  @IsString()
  issueDate?: string;

  @IsString()
  @IsNotEmpty({ message: "expiryDate is required" })
  expiryDate!: string;

  @IsOptional()
  @IsNumber()
  notifyBeforeDays?: number;

  @IsOptional()
  @IsBoolean()
  notifyEmail?: boolean;

  @IsOptional()
  @IsBoolean()
  notifySms?: boolean;

  @IsOptional()
  @IsBoolean()
  notifyPush?: boolean;

  @IsOptional()
  @IsString()
  status?: "active" | "due_soon" | "overdue" | "renewed";

  @IsOptional()
  @IsString()
  notes?: string;
}

export class UpdateComplianceReminderDto {
  @IsOptional()
  @IsString()
  reminderCategory?: string;

  @IsOptional()
  @IsString()
  documentNumber?: string;

  @IsOptional()
  @IsString()
  issueDate?: string;

  @IsOptional()
  @IsString()
  expiryDate?: string;

  @IsOptional()
  @IsNumber()
  notifyBeforeDays?: number;

  @IsOptional()
  @IsBoolean()
  notifyEmail?: boolean;

  @IsOptional()
  @IsBoolean()
  notifySms?: boolean;

  @IsOptional()
  @IsBoolean()
  notifyPush?: boolean;

  @IsOptional()
  @IsString()
  status?: "active" | "due_soon" | "overdue" | "renewed";

  @IsOptional()
  @IsString()
  notes?: string;
}
