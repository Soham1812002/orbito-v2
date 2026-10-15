import { Model, DataTypes } from "sequelize";
import { sequelize } from "../configs/database.js";

export class RolePermission extends Model {
  declare roleId: string;
  declare permissionId: string;
}

RolePermission.init(
  {
    roleId: {
      type: DataTypes.UUID,
      allowNull: false,
      primaryKey: true,
      field: "role_id",
      references: {
        model: "roles",
        key: "id"
      },
      onDelete: "CASCADE"
    },
    permissionId: {
      type: DataTypes.UUID,
      allowNull: false,
      primaryKey: true,
      field: "permission_id",
      references: {
        model: "permissions",
        key: "id"
      },
      onDelete: "CASCADE"
    }
  },
  {
    sequelize,
    tableName: "role_permissions",
    modelName: "RolePermission",
    timestamps: false
  }
);
