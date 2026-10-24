import { Model, DataTypes, Optional } from "sequelize";
import { sequelize } from "../configs/database.js";

export interface ImmobilizerAuditAttributes {
  id: string;
  vehicleId: string;
  vehiclePlate: string;
  companyName: string;
  branchName: string;
  command: "STOP_ENGINE" | "RESUME_ENGINE";
  status: "executed" | "pending" | "failed" | "cancelled";
  operatorId: string;
  operatorName: string;
  reason: string;
  relayVoltage?: number | null;
  speedAtExecution?: number | null;
  latitude: number;
  longitude: number;
  locationAddress?: string | null;
  responseTimeMs?: number | null;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date | null;
}

export interface ImmobilizerAuditCreationAttributes
  extends Optional<
    ImmobilizerAuditAttributes,
    | "id"
    | "companyName"
    | "branchName"
    | "status"
    | "relayVoltage"
    | "speedAtExecution"
    | "locationAddress"
    | "responseTimeMs"
    | "createdAt"
    | "updatedAt"
    | "deletedAt"
  > {}

export class ImmobilizerAudit
  extends Model<ImmobilizerAuditAttributes, ImmobilizerAuditCreationAttributes>
  implements ImmobilizerAuditAttributes
{
  declare id: string;
  declare vehicleId: string;
  declare vehiclePlate: string;
  declare companyName: string;
  declare branchName: string;
  declare command: "STOP_ENGINE" | "RESUME_ENGINE";
  declare status: "executed" | "pending" | "failed" | "cancelled";
  declare operatorId: string;
  declare operatorName: string;
  declare reason: string;
  declare relayVoltage?: number | null;
  declare speedAtExecution?: number | null;
  declare latitude: number;
  declare longitude: number;
  declare locationAddress?: string | null;
  declare responseTimeMs?: number | null;

  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;
  declare readonly deletedAt: Date | null;
}

ImmobilizerAudit.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      allowNull: false
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
    command: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    status: {
      type: DataTypes.STRING(50),
      allowNull: false,
      defaultValue: "executed"
    },
    operatorId: {
      type: DataTypes.STRING(100),
      allowNull: false,
      field: "operator_id"
    },
    operatorName: {
      type: DataTypes.STRING(150),
      allowNull: false,
      field: "operator_name"
    },
    reason: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    relayVoltage: {
      type: DataTypes.DOUBLE,
      allowNull: true,
      field: "relay_voltage"
    },
    speedAtExecution: {
      type: DataTypes.DOUBLE,
      allowNull: true,
      field: "speed_at_execution"
    },
    latitude: {
      type: DataTypes.DOUBLE,
      allowNull: false
    },
    longitude: {
      type: DataTypes.DOUBLE,
      allowNull: false
    },
    locationAddress: {
      type: DataTypes.TEXT,
      allowNull: true,
      field: "location_address"
    },
    responseTimeMs: {
      type: DataTypes.INTEGER,
      allowNull: true,
      field: "response_time_ms"
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
    tableName: "immobilizer_audits",
    modelName: "ImmobilizerAudit",
    paranoid: true,
    timestamps: true,
    underscored: true
  }
);
