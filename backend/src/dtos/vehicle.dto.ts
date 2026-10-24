import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsNumber,
  IsBoolean,
  IsIn
} from "class-validator";

export class CreateVehicleDto {
  @IsString()
  @IsNotEmpty({ message: "Plate number is required" })
  plateNumber!: string;

  @IsString()
  @IsNotEmpty({ message: "Make & Model is required" })
  makeModel!: string;

  @IsOptional()
  @IsString()
  category?: string;

  @IsOptional()
  @IsString()
  @IsIn(["moving", "idling", "stopped", "inactive"], {
    message: "status must be moving, idling, stopped, or inactive"
  })
  status?: "moving" | "idling" | "stopped" | "inactive";

  @IsOptional()
  @IsNumber()
  speed?: number;

  @IsOptional()
  @IsNumber()
  heading?: number;

  @IsOptional()
  @IsNumber()
  latitude?: number;

  @IsOptional()
  @IsNumber()
  longitude?: number;

  @IsOptional()
  @IsBoolean()
  ignition?: boolean;

  @IsOptional()
  @IsNumber()
  fuelPercent?: number;

  @IsOptional()
  @IsNumber()
  batteryPercent?: number;

  @IsOptional()
  @IsNumber()
  odometer?: number;

  @IsOptional()
  @IsNumber()
  engineTemp?: number;

  @IsOptional()
  @IsString()
  lastLocation?: string;

  @IsString()
  @IsNotEmpty({ message: "Device IMEI is required" })
  deviceImei!: string;

  @IsOptional()
  @IsString()
  driverId?: string;

  @IsOptional()
  @IsString()
  companyName?: string;

  @IsOptional()
  @IsNumber()
  todayDistance?: number;

  @IsOptional()
  @IsString()
  @IsIn(["locked", "unlocked"], { message: "immobilizerState must be locked or unlocked" })
  immobilizerState?: "locked" | "unlocked";
}

export class UpdateVehicleDto {
  @IsOptional()
  @IsString()
  plateNumber?: string;

  @IsOptional()
  @IsString()
  makeModel?: string;

  @IsOptional()
  @IsString()
  category?: string;

  @IsOptional()
  @IsString()
  @IsIn(["moving", "idling", "stopped", "inactive"])
  status?: "moving" | "idling" | "stopped" | "inactive";

  @IsOptional()
  @IsNumber()
  speed?: number;

  @IsOptional()
  @IsNumber()
  heading?: number;

  @IsOptional()
  @IsNumber()
  latitude?: number;

  @IsOptional()
  @IsNumber()
  longitude?: number;

  @IsOptional()
  @IsBoolean()
  ignition?: boolean;

  @IsOptional()
  @IsNumber()
  fuelPercent?: number;

  @IsOptional()
  @IsNumber()
  batteryPercent?: number;

  @IsOptional()
  @IsNumber()
  odometer?: number;

  @IsOptional()
  @IsNumber()
  engineTemp?: number;

  @IsOptional()
  @IsString()
  lastLocation?: string;

  @IsOptional()
  @IsString()
  deviceImei?: string;

  @IsOptional()
  @IsString()
  driverId?: string;

  @IsOptional()
  @IsString()
  companyName?: string;

  @IsOptional()
  @IsNumber()
  todayDistance?: number;

  @IsOptional()
  @IsString()
  @IsIn(["locked", "unlocked"])
  immobilizerState?: "locked" | "unlocked";
}

export class ImmobilizeVehicleDto {
  @IsString()
  @IsNotEmpty({ message: "Action is required" })
  @IsIn(["lock", "unlock", "locked", "unlocked", "cut_off"])
  action!: "lock" | "unlock" | "locked" | "unlocked" | "cut_off";

  @IsOptional()
  @IsString()
  reason?: string;

  @IsOptional()
  @IsString()
  notes?: string;
}
