import { Model, DataTypes, Optional } from "sequelize";
import { sequelize } from "../configs/database.js";

export interface SystemConfigAttributes {
  id: string;
  moduleKey: string;
  data: Record<string, any>;
  isActive: boolean;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date | null;
}

export interface SystemConfigCreationAttributes
  extends Optional<SystemConfigAttributes, "id" | "isActive" | "createdAt" | "updatedAt" | "deletedAt"> {}

export class SystemConfig extends Model<SystemConfigAttributes, SystemConfigCreationAttributes> implements SystemConfigAttributes {
  declare id: string;
  declare moduleKey: string;
  declare data: Record<string, any>;
  declare isActive: boolean;
  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;
  declare readonly deletedAt: Date | null;
}

SystemConfig.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    moduleKey: {
      type: DataTypes.STRING(64),
      allowNull: false,
      field: "module_key"
    },
    data: {
      type: DataTypes.JSONB,
      allowNull: false
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
      field: "is_active"
    },
    createdAt: {
      type: DataTypes.DATE,
      field: "created_at"
    },
    updatedAt: {
      type: DataTypes.DATE,
      field: "updated_at"
    },
    deletedAt: {
      type: DataTypes.DATE,
      field: "deleted_at"
    }
  },
  {
    sequelize,
    tableName: "system_configs",
    timestamps: true,
    paranoid: true,
    underscored: true
  }
);
