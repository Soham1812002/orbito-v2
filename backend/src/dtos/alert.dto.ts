import {
  IsNotEmpty,
  IsString,
  IsOptional,
  IsBoolean,
  IsIn,
  IsObject,
  IsArray
} from "class-validator";

export class CreateAlertRuleDto {
  @IsOptional()
  @IsString()
  companyName?: string;

  @IsOptional()
  @IsString()
  branchName?: string;

  @IsString()
  @IsNotEmpty({ message: "Rule name is required" })
  name!: string;

  @IsString()
  @IsNotEmpty({ message: "alertType is required" })
  alertType!: string;

  @IsString()
  @IsIn(["critical", "warning", "info"], { message: "severity must be critical, warning, or info" })
  severity!: "critical" | "warning" | "info";

  @IsString()
  @IsIn(["all", "group", "specific"], { message: "vehicleScope must be all, group, or specific" })
  vehicleScope!: "all" | "group" | "specific";

  @IsOptional()
  @IsArray()
  vehicleIds?: string[];

  @IsOptional()
  @IsObject()
  conditions?: Record<string, any>;

  @IsOptional()
  @IsObject()
  schedule?: {
    days: string[];
    start: string;
    end: string;
  };

  @IsOptional()
  @IsObject()
  channels?: {
    sms: boolean;
    email: boolean;
    push: boolean;
  };

  @IsOptional()
  @IsArray()
  recipients?: string[];

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}

export class UpdateAlertRuleDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  alertType?: string;

  @IsOptional()
  @IsString()
  @IsIn(["critical", "warning", "info"])
  severity?: "critical" | "warning" | "info";

  @IsOptional()
  @IsString()
  @IsIn(["all", "group", "specific"])
  vehicleScope?: "all" | "group" | "specific";

  @IsOptional()
  @IsArray()
  vehicleIds?: string[];

  @IsOptional()
  @IsObject()
  conditions?: Record<string, any>;

  @IsOptional()
  @IsObject()
  schedule?: {
    days: string[];
    start: string;
    end: string;
  };

  @IsOptional()
  @IsObject()
  channels?: {
    sms: boolean;
    email: boolean;
    push: boolean;
  };

  @IsOptional()
  @IsArray()
  recipients?: string[];

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}

export class AcknowledgeAlertDto {
  @IsOptional()
  @IsString()
  resolutionNotes?: string;
}

export class CreateAlertLogDto {
  @IsOptional()
  @IsString()
  ruleId?: string;

  @IsString()
  @IsNotEmpty({ message: "vehicleId is required" })
  vehicleId!: string;

  @IsString()
  @IsNotEmpty({ message: "plateNumber is required" })
  plateNumber!: string;

  @IsOptional()
  @IsString()
  companyName?: string;

  @IsOptional()
  @IsString()
  branchName?: string;

  @IsString()
  @IsNotEmpty({ message: "alertType is required" })
  alertType!: string;

  @IsString()
  @IsNotEmpty({ message: "alertName is required" })
  alertName!: string;

  @IsString()
  @IsIn(["critical", "warning", "info"])
  severity!: "critical" | "warning" | "info";

  @IsString()
  @IsNotEmpty({ message: "message is required" })
  message!: string;

  @IsOptional()
  @IsString()
  triggerValue?: string;

  @IsNotEmpty({ message: "latitude is required" })
  latitude!: number;

  @IsNotEmpty({ message: "longitude is required" })
  longitude!: number;

  @IsString()
  @IsNotEmpty({ message: "address is required" })
  address!: string;
}
