import { Model, DataTypes, Optional } from "sequelize";
import { sequelize } from "../configs/database.js";

export interface UserPasswordHistoryAttributes {
  id: string;
  userId: string;
  passwordHash: string;
  createdAt?: Date;
}

export interface UserPasswordHistoryCreationAttributes
  extends Optional<UserPasswordHistoryAttributes, "id" | "createdAt"> {}

export class UserPasswordHistory
  extends Model<UserPasswordHistoryAttributes, UserPasswordHistoryCreationAttributes>
  implements UserPasswordHistoryAttributes
{
  declare id: string;
  declare userId: string;
  declare passwordHash: string;
  declare readonly createdAt: Date;
}

UserPasswordHistory.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: false,
      field: "user_id",
      references: {
        model: "users",
        key: "id"
      },
      onDelete: "CASCADE"
    },
    passwordHash: {
      type: DataTypes.STRING(255),
      allowNull: false,
      field: "password_hash"
    }
  },
  {
    sequelize,
    tableName: "user_password_history",
    modelName: "UserPasswordHistory",
    updatedAt: false,
    paranoid: false
  }
);
