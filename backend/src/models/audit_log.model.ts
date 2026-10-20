import { Model, DataTypes, Optional } from "sequelize";
import { sequelize } from "../configs/database.js";

export interface AuditLogAttributes {
  id: string;
  timestamp: Date;
  userName: string;
  userRole: string;
  userInitials: string;
  action: string;
  module: string;
  ipAddress: string;
  status: "SUCCESS" | "WARNING" | "FAILED";
  details: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface AuditLogCreationAttributes
  extends Optional<AuditLogAttributes, "id" | "timestamp" | "createdAt" | "updatedAt"> {}

export class AuditLog extends Model<AuditLogAttributes, AuditLogCreationAttributes> implements AuditLogAttributes {
  declare id: string;
  declare timestamp: Date;
  declare userName: string;
  declare userRole: string;
  declare userInitials: string;
  declare action: string;
  declare module: string;
  declare ipAddress: string;
  declare status: "SUCCESS" | "WARNING" | "FAILED";
  declare details: string;
  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;
}

AuditLog.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    timestamp: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW
    },
    userName: {
      type: DataTypes.STRING(255),
      allowNull: false,
      field: "user_name"
    },
    userRole: {
      type: DataTypes.STRING(100),
      allowNull: false,
      field: "user_role"
    },
    userInitials: {
      type: DataTypes.STRING(10),
      allowNull: false,
      field: "user_initials"
    },
    action: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    module: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    ipAddress: {
      type: DataTypes.STRING(64),
      allowNull: false,
      field: "ip_address"
    },
    status: {
      type: DataTypes.STRING(20),
      allowNull: false
    },
    details: {
      type: DataTypes.TEXT,
      allowNull: false
    }
  },
  {
    sequelize,
    tableName: "audit_logs",
    timestamps: true,
    paranoid: false,
    underscored: true
  }
);
