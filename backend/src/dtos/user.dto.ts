import {
  IsEmail,
  IsNotEmpty,
  IsString,
  MinLength,
  MaxLength,
  IsOptional,
  IsBoolean,
  IsArray,
  IsUUID,
  IsObject
} from "class-validator";

export class CreateUserDto {
  @IsEmail({}, { message: "email must be an email" })
  @IsNotEmpty({ message: "email is required" })
  email!: string;

  @IsString({ message: "password must be a string" })
  @MinLength(6, { message: "password must be longer than or equal to 6 characters" })
  @IsNotEmpty({ message: "password is required" })
  password!: string;

  @IsString({ message: "firstName must be a string" })
  @MinLength(2, { message: "firstName must be longer than or equal to 2 characters" })
  @MaxLength(100)
  @IsNotEmpty({ message: "firstName is required" })
  firstName!: string;

  @IsString({ message: "lastName must be a string" })
  @MinLength(2, { message: "lastName must be longer than or equal to 2 characters" })
  @MaxLength(100)
  @IsNotEmpty({ message: "lastName is required" })
  lastName!: string;

  @IsOptional()
  @IsString()
  phone?: string;

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
  groupId?: string;

  @IsOptional()
  @IsString()
  role?: string;

  @IsOptional()
  @IsString()
  allocationGroup?: string;

  @IsOptional()
  @IsString()
  expiryDate?: string;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @IsOptional()
  @IsString()
  language?: string;

  @IsOptional()
  @IsString()
  timezone?: string;

  @IsOptional()
  @IsString()
  dateFormat?: string;

  @IsOptional()
  @IsString()
  measurementUnit?: string;

  @IsOptional()
  @IsObject()
  features?: Record<string, any>;

  @IsOptional()
  @IsArray()
  @IsUUID("4", { each: true, message: "Each roleId must be a valid UUID" })
  roleIds?: string[];
}

export class UpdateUserDto {
  @IsOptional()
  @IsEmail({}, { message: "email must be an email" })
  email?: string;

  @IsOptional()
  @IsString({ message: "password must be a string" })
  @MinLength(6, { message: "password must be longer than or equal to 6 characters" })
  password?: string;

  @IsOptional()
  @IsString()
  @MinLength(2, { message: "firstName must be longer than or equal to 2 characters" })
  @MaxLength(100)
  firstName?: string;

  @IsOptional()
  @IsString()
  @MinLength(2, { message: "lastName must be longer than or equal to 2 characters" })
  @MaxLength(100)
  lastName?: string;

  @IsOptional()
  @IsString()
  phone?: string;

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
  groupId?: string;

  @IsOptional()
  @IsString()
  role?: string;

  @IsOptional()
  @IsString()
  allocationGroup?: string;

  @IsOptional()
  @IsString()
  expiryDate?: string;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @IsOptional()
  @IsString()
  language?: string;

  @IsOptional()
  @IsString()
  timezone?: string;

  @IsOptional()
  @IsString()
  dateFormat?: string;

  @IsOptional()
  @IsString()
  measurementUnit?: string;

  @IsOptional()
  @IsObject()
  features?: Record<string, any>;

  @IsOptional()
  @IsArray()
  @IsUUID("4", { each: true, message: "Each roleId must be a valid UUID" })
  roleIds?: string[];
}
