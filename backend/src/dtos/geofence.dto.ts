import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsNumber,
  IsBoolean,
  IsIn,
  IsArray
} from "class-validator";

export class CreateGeofenceDto {
  @IsString()
  @IsNotEmpty({ message: "Name is required" })
  name!: string;

  @IsOptional()
  @IsString()
  @IsIn(["circular", "polygon"], { message: "type must be circular or polygon" })
  type?: "circular" | "polygon";

  @IsString()
  @IsNotEmpty({ message: "Category is required" })
  category!: string;

  @IsString()
  @IsNotEmpty({ message: "Company is required" })
  company!: string;

  @IsOptional()
  @IsString()
  branch?: string;

  @IsNumber()
  centerLatitude!: number;

  @IsNumber()
  centerLongitude!: number;

  @IsOptional()
  @IsNumber()
  radiusMeters?: number;

  @IsOptional()
  @IsArray()
  coordinates?: { lat: number; lng: number }[];

  @IsOptional()
  @IsNumber()
  speedLimitKmh?: number;

  @IsOptional()
  @IsBoolean()
  alertOnEnter?: boolean;

  @IsOptional()
  @IsBoolean()
  alertOnExit?: boolean;

  @IsOptional()
  @IsBoolean()
  alertOnOverstay?: boolean;

  @IsOptional()
  @IsNumber()
  maxDwellMinutes?: number;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}

export class UpdateGeofenceDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  @IsIn(["circular", "polygon"])
  type?: "circular" | "polygon";

  @IsOptional()
  @IsString()
  category?: string;

  @IsOptional()
  @IsString()
  company?: string;

  @IsOptional()
  @IsString()
  branch?: string;

  @IsOptional()
  @IsNumber()
  centerLatitude?: number;

  @IsOptional()
  @IsNumber()
  centerLongitude?: number;

  @IsOptional()
  @IsNumber()
  radiusMeters?: number;

  @IsOptional()
  @IsArray()
  coordinates?: { lat: number; lng: number }[];

  @IsOptional()
  @IsNumber()
  speedLimitKmh?: number;

  @IsOptional()
  @IsBoolean()
  alertOnEnter?: boolean;

  @IsOptional()
  @IsBoolean()
  alertOnExit?: boolean;

  @IsOptional()
  @IsBoolean()
  alertOnOverstay?: boolean;

  @IsOptional()
  @IsNumber()
  maxDwellMinutes?: number;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}

export interface GeofenceQueryDto {
  page?: number;
  limit?: number;
  search?: string;
  type?: string;
  category?: string;
  company?: string;
}

