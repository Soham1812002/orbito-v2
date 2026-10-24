import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsBoolean,
  IsArray
} from "class-validator";

export class CreateUserGroupDto {
  @IsString()
  @IsNotEmpty({ message: "Group name is required" })
  name!: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsString()
  @IsNotEmpty({ message: "Company name is required" })
  company!: string;

  @IsOptional()
  @IsString()
  branch?: string;

  @IsOptional()
  @IsString()
  reseller?: string;

  @IsOptional()
  @IsString()
  adminRole?: string;

  @IsOptional()
  @IsBoolean()
  allowExcelExport?: boolean;

  @IsOptional()
  @IsBoolean()
  allowOperationalManage?: boolean;

  @IsOptional()
  @IsBoolean()
  isSystemAdmin?: boolean;

  @IsOptional()
  @IsArray()
  permissions?: any[];

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}

export class UpdateUserGroupDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  company?: string;

  @IsOptional()
  @IsString()
  branch?: string;

  @IsOptional()
  @IsString()
  reseller?: string;

  @IsOptional()
  @IsString()
  adminRole?: string;

  @IsOptional()
  @IsBoolean()
  allowExcelExport?: boolean;

  @IsOptional()
  @IsBoolean()
  allowOperationalManage?: boolean;

  @IsOptional()
  @IsBoolean()
  isSystemAdmin?: boolean;

  @IsOptional()
  @IsArray()
  permissions?: any[];

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
