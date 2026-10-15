import { Model, DataTypes } from "sequelize";
import { sequelize } from "../configs/database.js";

export class UserRole extends Model {
  declare userId: string;
  declare roleId: string;
}

UserRole.init(
  {
    userId: {
      type: DataTypes.UUID,
      allowNull: false,
      primaryKey: true,
      field: "user_id",
      references: {
        model: "users",
        key: "id"
      },
      onDelete: "CASCADE"
    },
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
    }
  },
  {
    sequelize,
    tableName: "user_roles",
    modelName: "UserRole",
    timestamps: false
  }
);
