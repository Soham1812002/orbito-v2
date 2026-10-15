import { Model, DataTypes, Optional } from "sequelize";
import { sequelize } from "../configs/database.js";

export interface PermissionAttributes {
  id: string;
  code: string;
  action: string;
  entity: string;
  description?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface PermissionCreationAttributes
  extends Optional<PermissionAttributes, "id" | "description" | "createdAt" | "updatedAt"> {}

export class Permission
  extends Model<PermissionAttributes, PermissionCreationAttributes>
  implements PermissionAttributes
{
  declare id: string;
  declare code: string;
  declare action: string;
  declare entity: string;
  declare description?: string;
  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;
}

Permission.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    code: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true
    },
    action: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    entity: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    description: {
      type: DataTypes.STRING(255),
      allowNull: true
    }
  },
  {
    sequelize,
    tableName: "permissions",
    modelName: "Permission",
    paranoid: false // permissions aren't soft deleted
  }
);
