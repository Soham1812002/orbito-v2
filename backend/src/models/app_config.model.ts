import { Model, DataTypes, Optional } from "sequelize";
import { sequelize } from "../configs/database.js";

export interface AppConfigAttributes {
  id: string;
  moduleKey: string;
  data: Record<string, any>;
  isActive: boolean;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date | null;
}

export interface AppConfigCreationAttributes
  extends Optional<AppConfigAttributes, "id" | "isActive" | "createdAt" | "updatedAt" | "deletedAt"> {}

export class AppConfig extends Model<AppConfigAttributes, AppConfigCreationAttributes> implements AppConfigAttributes {
  declare id: string;
  declare moduleKey: string;
  declare data: Record<string, any>;
  declare isActive: boolean;
  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;
  declare readonly deletedAt: Date | null;
}

AppConfig.init(
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
    }
  },
  {
    sequelize,
    tableName: "app_configs",
    timestamps: true,
    paranoid: true,
    underscored: true
  }
);
