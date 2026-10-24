import { Model, DataTypes, Optional } from "sequelize";
import { sequelize } from "../configs/database.js";

export interface CrewAllocationAttributes {
  id: string;
  companyName: string;
  branchName: string;
  vehicleId: string;
  vehiclePlate: string;
  primaryDriverId: string;
  primaryDriverName: string;
  primaryDriverPhone: string;
  secondaryDriverId?: string | null;
  secondaryDriverName?: string | null;
  cleanerId?: string | null;
  cleanerName?: string | null;
  shiftName: string;
  startDate: string;
  endDate?: string | null;
  dutyStatus: "on_duty" | "off_duty" | "standby";
  notes?: string | null;
  isActive: boolean;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date | null;
}

export interface CrewAllocationCreationAttributes
  extends Optional<
    CrewAllocationAttributes,
    | "id"
    | "companyName"
    | "branchName"
    | "secondaryDriverId"
    | "secondaryDriverName"
    | "cleanerId"
    | "cleanerName"
    | "shiftName"
    | "endDate"
    | "dutyStatus"
    | "notes"
    | "isActive"
    | "createdAt"
    | "updatedAt"
    | "deletedAt"
  > {}

export class CrewAllocation
  extends Model<CrewAllocationAttributes, CrewAllocationCreationAttributes>
  implements CrewAllocationAttributes
{
  declare id: string;
  declare companyName: string;
  declare branchName: string;
  declare vehicleId: string;
  declare vehiclePlate: string;
  declare primaryDriverId: string;
  declare primaryDriverName: string;
  declare primaryDriverPhone: string;
  declare secondaryDriverId?: string | null;
  declare secondaryDriverName?: string | null;
  declare cleanerId?: string | null;
  declare cleanerName?: string | null;
  declare shiftName: string;
  declare startDate: string;
  declare endDate?: string | null;
  declare dutyStatus: "on_duty" | "off_duty" | "standby";
  declare notes?: string | null;
  declare isActive: boolean;

  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;
  declare readonly deletedAt: Date | null;
}

CrewAllocation.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      allowNull: false
    },
    companyName: {
      type: DataTypes.STRING(150),
      allowNull: false,
      defaultValue: "inOrbit Logistics",
      field: "company_name"
    },
    branchName: {
      type: DataTypes.STRING(150),
      allowNull: false,
      defaultValue: "All Branches",
      field: "branch_name"
    },
    vehicleId: {
      type: DataTypes.STRING(100),
      allowNull: false,
      field: "vehicle_id"
    },
    vehiclePlate: {
      type: DataTypes.STRING(50),
      allowNull: false,
      field: "vehicle_plate"
    },
    primaryDriverId: {
      type: DataTypes.STRING(100),
      allowNull: false,
      field: "primary_driver_id"
    },
    primaryDriverName: {
      type: DataTypes.STRING(150),
      allowNull: false,
      field: "primary_driver_name"
    },
    primaryDriverPhone: {
      type: DataTypes.STRING(50),
      allowNull: false,
      field: "primary_driver_phone"
    },
    secondaryDriverId: {
      type: DataTypes.STRING(100),
      allowNull: true,
      field: "secondary_driver_id"
    },
    secondaryDriverName: {
      type: DataTypes.STRING(150),
      allowNull: true,
      field: "secondary_driver_name"
    },
    cleanerId: {
      type: DataTypes.STRING(100),
      allowNull: true,
      field: "cleaner_id"
    },
    cleanerName: {
      type: DataTypes.STRING(150),
      allowNull: true,
      field: "cleaner_name"
    },
    shiftName: {
      type: DataTypes.STRING(100),
      allowNull: false,
      defaultValue: "Day Shift",
      field: "shift_name"
    },
    startDate: {
      type: DataTypes.DATEONLY,
      allowNull: false,
      field: "start_date"
    },
    endDate: {
      type: DataTypes.DATEONLY,
      allowNull: true,
      field: "end_date"
    },
    dutyStatus: {
      type: DataTypes.STRING(50),
      allowNull: false,
      defaultValue: "on_duty",
      field: "duty_status"
    },
    notes: {
      type: DataTypes.TEXT,
      allowNull: true,
      field: "notes"
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
      field: "is_active"
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      field: "created_at"
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      field: "updated_at"
    },
    deletedAt: {
      type: DataTypes.DATE,
      allowNull: true,
      field: "deleted_at"
    }
  },
  {
    sequelize,
    tableName: "crew_allocations",
    modelName: "CrewAllocation",
    paranoid: true,
    timestamps: true,
    underscored: true
  }
);
