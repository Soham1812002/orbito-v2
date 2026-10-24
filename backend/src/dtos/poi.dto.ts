import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsNumber,
  IsBoolean
} from "class-validator";

export class CreatePoiDto {
  @IsString()
  @IsNotEmpty({ message: "Name is required" })
  name!: string;

  @IsString()
  @IsNotEmpty({ message: "Company is required" })
  company!: string;

  @IsOptional()
  @IsString()
  branch?: string;

  @IsString()
  @IsNotEmpty({ message: "GeoCode is required" })
  geoCode!: string;

  @IsString()
  @IsNotEmpty({ message: "Category is required" })
  category!: string;

  @IsString()
  @IsNotEmpty({ message: "Street is required" })
  street!: string;

  @IsString()
  @IsNotEmpty({ message: "City is required" })
  city!: string;

  @IsString()
  @IsNotEmpty({ message: "State is required" })
  state!: string;

  @IsNumber()
  latitude!: number;

  @IsNumber()
  longitude!: number;

  @IsOptional()
  @IsNumber()
  radiusMeters?: number;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}

export class UpdatePoiDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  company?: string;

  @IsOptional()
  @IsString()
  branch?: string;

  @IsOptional()
  @IsString()
  geoCode?: string;

  @IsOptional()
  @IsString()
  category?: string;

  @IsOptional()
  @IsString()
  street?: string;

  @IsOptional()
  @IsString()
  city?: string;

  @IsOptional()
  @IsString()
  state?: string;

  @IsOptional()
  @IsNumber()
  latitude?: number;

  @IsOptional()
  @IsNumber()
  longitude?: number;

  @IsOptional()
  @IsNumber()
  radiusMeters?: number;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}

export interface PoiQueryDto {
  page?: number;
  limit?: number;
  search?: string;
  category?: string;
  company?: string;
  branch?: string;
}

