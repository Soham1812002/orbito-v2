import { Model, DataTypes, Optional } from "sequelize";
import { sequelize } from "../configs/database.js";

export interface MaintenanceReminderAttributes {
  id: string;
  companyName: string;
  branchName: string;
  vehicleId: string;
  vehiclePlate: string;
  vehicleGroup: string;
  reminderType: string;
  reminderName: string;
  description?: string | null;
  lastServiceDate?: string | null;
  lastMileage?: number | null;
  nextServiceDate: string;
  nextMileage: number;
  reminderTime?: string | null;
  repeatIntervalMonths?: number | null;
  repeatIntervalKm?: number | null;
  notifyBeforeDays: number;
  notifyBeforeKm: number;
  notifyUser?: string | null;
  notifyEmail: boolean;
  notifySms: boolean;
  notifyApp: boolean;
  status: string;
  isActive: boolean;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date | null;
}

export interface MaintenanceReminderCreationAttributes
  extends Optional<
    MaintenanceReminderAttributes,
    | "id"
    | "vehicleGroup"
    | "description"
    | "lastServiceDate"
    | "lastMileage"
    | "reminderTime"
    | "repeatIntervalMonths"
    | "repeatIntervalKm"
    | "notifyBeforeDays"
    | "notifyBeforeKm"
    | "notifyUser"
    | "notifyEmail"
    | "notifySms"
    | "notifyApp"
    | "status"
    | "isActive"
    | "createdAt"
    | "updatedAt"
    | "deletedAt"
  > {}

export class MaintenanceReminder
  extends Model<MaintenanceReminderAttributes, MaintenanceReminderCreationAttributes>
  implements MaintenanceReminderAttributes
{
  declare id: string;
  declare companyName: string;
  declare branchName: string;
  declare vehicleId: string;
  declare vehiclePlate: string;
  declare vehicleGroup: string;
  declare reminderType: string;
  declare reminderName: string;
  declare description: string | null;
  declare lastServiceDate: string | null;
  declare lastMileage: number | null;
  declare nextServiceDate: string;
  declare nextMileage: number;
  declare reminderTime: string | null;
  declare repeatIntervalMonths: number | null;
  declare repeatIntervalKm: number | null;
  declare notifyBeforeDays: number;
  declare notifyBeforeKm: number;
  declare notifyUser: string | null;
  declare notifyEmail: boolean;
  declare notifySms: boolean;
  declare notifyApp: boolean;
  declare status: string;
  declare isActive: boolean;
  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;
  declare readonly deletedAt: Date | null;
}

MaintenanceReminder.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    companyName: {
      type: DataTypes.STRING(150),
      allowNull: false,
      field: "company_name"
    },
    branchName: {
      type: DataTypes.STRING(150),
      allowNull: false,
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
    vehicleGroup: {
      type: DataTypes.STRING(100),
      allowNull: false,
      defaultValue: "All groups",
      field: "vehicle_group"
    },
    reminderType: {
      type: DataTypes.STRING(100),
      allowNull: false,
      field: "reminder_type"
    },
    reminderName: {
      type: DataTypes.STRING(255),
      allowNull: false,
      field: "reminder_name"
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    lastServiceDate: {
      type: DataTypes.DATEONLY,
      allowNull: true,
      field: "last_service_date"
    },
    lastMileage: {
      type: DataTypes.INTEGER,
      allowNull: true,
      field: "last_mileage"
    },
    nextServiceDate: {
      type: DataTypes.DATEONLY,
      allowNull: false,
      field: "next_service_date"
    },
    nextMileage: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: "next_mileage"
    },
    reminderTime: {
      type: DataTypes.STRING(20),
      allowNull: true,
      defaultValue: "09:00 AM",
      field: "reminder_time"
    },
    repeatIntervalMonths: {
      type: DataTypes.INTEGER,
      allowNull: true,
      field: "repeat_interval_months"
    },
    repeatIntervalKm: {
      type: DataTypes.INTEGER,
      allowNull: true,
      field: "repeat_interval_km"
    },
    notifyBeforeDays: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 7,
      field: "notify_before_days"
    },
    notifyBeforeKm: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 500,
      field: "notify_before_km"
    },
    notifyUser: {
      type: DataTypes.STRING(150),
      allowNull: true,
      field: "notify_user"
    },
    notifyEmail: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
      field: "notify_email"
    },
    notifySms: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
      field: "notify_sms"
    },
    notifyApp: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
      field: "notify_app"
    },
    status: {
      type: DataTypes.STRING(50),
      allowNull: false,
      defaultValue: "Upcoming"
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
      field: "is_active"
    }
  },
  {
    sequelize,
    tableName: "maintenance_reminders",
    timestamps: true,
    paranoid: true,
    underscored: true
  }
);
