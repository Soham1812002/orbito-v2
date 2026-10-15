import { IsEmail, IsNotEmpty, IsString, MinLength, MaxLength } from "class-validator";

export class LoginDto {
  @IsEmail({}, { message: "email must be an email" })
  @IsNotEmpty({ message: "email is required" })
  email!: string;

  @IsString({ message: "password must be a string" })
  @MinLength(6, { message: "password must be at least 6 characters" })
  @IsNotEmpty({ message: "password is required" })
  password!: string;
}

export class RegisterDto {
  @IsEmail({}, { message: "email must be an email" })
  @IsNotEmpty({ message: "email is required" })
  email!: string;

  @IsString({ message: "password must be a string" })
  @MinLength(8, { message: "password must be at least 8 characters" })
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
}

export class ChangePasswordDto {
  @IsString()
  @IsNotEmpty({ message: "currentPassword is required" })
  currentPassword!: string;

  @IsString()
  @MinLength(8, { message: "newPassword must be at least 8 characters" })
  @IsNotEmpty({ message: "newPassword is required" })
  newPassword!: string;
}
