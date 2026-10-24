import { Model, DataTypes, Optional } from "sequelize";
import { sequelize } from "../configs/database.js";

export interface AlertLogAttributes {
  id: string;
  ruleId?: string | null;
  vehicleId: string;
  plateNumber: string;
  companyName: string;
  branchName: string;
  alertType: string;
  alertName: string;
  severity: "critical" | "warning" | "info";
  message: string;
  triggerValue?: string | null;
  latitude: number;
  longitude: number;
  address: string;
  status: "pending" | "acknowledged" | "resolved";
  acknowledgedBy?: string | null;
  acknowledgedAt?: Date | null;
  resolutionNotes?: string | null;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date | null;
}

export interface AlertLogCreationAttributes
  extends Optional<
    AlertLogAttributes,
    | "id"
    | "ruleId"
    | "companyName"
    | "branchName"
    | "severity"
    | "triggerValue"
    | "status"
    | "acknowledgedBy"
    | "acknowledgedAt"
    | "resolutionNotes"
    | "createdAt"
    | "updatedAt"
    | "deletedAt"
  > {}

export class AlertLog
  extends Model<AlertLogAttributes, AlertLogCreationAttributes>
  implements AlertLogAttributes
{
  declare id: string;
  declare ruleId?: string | null;
  declare vehicleId: string;
  declare plateNumber: string;
  declare companyName: string;
  declare branchName: string;
  declare alertType: string;
  declare alertName: string;
  declare severity: "critical" | "warning" | "info";
  declare message: string;
  declare triggerValue?: string | null;
  declare latitude: number;
  declare longitude: number;
  declare address: string;
  declare status: "pending" | "acknowledged" | "resolved";
  declare acknowledgedBy?: string | null;
  declare acknowledgedAt?: Date | null;
  declare resolutionNotes?: string | null;
  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;
  declare readonly deletedAt: Date | null;
}

AlertLog.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    ruleId: {
      type: DataTypes.UUID,
      allowNull: true,
      field: "rule_id"
    },
    vehicleId: {
      type: DataTypes.STRING(100),
      allowNull: false,
      field: "vehicle_id"
    },
    plateNumber: {
      type: DataTypes.STRING(50),
      allowNull: false,
      field: "plate_number"
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
      defaultValue: "West Operations",
      field: "branch_name"
    },
    alertType: {
      type: DataTypes.STRING(64),
      allowNull: false,
      field: "alert_type"
    },
    alertName: {
      type: DataTypes.STRING(255),
      allowNull: false,
      field: "alert_name"
    },
    severity: {
      type: DataTypes.STRING(32),
      allowNull: false,
      defaultValue: "warning"
    },
    message: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    triggerValue: {
      type: DataTypes.STRING(128),
      allowNull: true,
      field: "trigger_value"
    },
    latitude: {
      type: DataTypes.FLOAT,
      allowNull: false
    },
    longitude: {
      type: DataTypes.FLOAT,
      allowNull: false
    },
    address: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    status: {
      type: DataTypes.STRING(32),
      allowNull: false,
      defaultValue: "pending"
    },
    acknowledgedBy: {
      type: DataTypes.STRING(100),
      allowNull: true,
      field: "acknowledged_by"
    },
    acknowledgedAt: {
      type: DataTypes.DATE,
      allowNull: true,
      field: "acknowledged_at"
    },
    resolutionNotes: {
      type: DataTypes.TEXT,
      allowNull: true,
      field: "resolution_notes"
    }
  },
  {
    sequelize,
    tableName: "alert_logs",
    timestamps: true,
    paranoid: true,
    underscored: true
  }
);
