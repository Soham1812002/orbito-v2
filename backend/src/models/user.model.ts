import { Model, DataTypes, Optional } from "sequelize";
import { sequelize } from "../configs/database.js";

export interface UserAttributes {
  id: string;
  email: string;
  passwordHash: string;
  firstName: string;
  lastName: string;
  isActive: boolean;
  passwordChangedAt: Date;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date | null;
}

export interface UserCreationAttributes
  extends Optional<UserAttributes, "id" | "isActive" | "passwordChangedAt" | "createdAt" | "updatedAt" | "deletedAt"> {}

export class User extends Model<UserAttributes, UserCreationAttributes> implements UserAttributes {
  declare id: string;
  declare email: string;
  declare passwordHash: string;
  declare firstName: string;
  declare lastName: string;
  declare isActive: boolean;
  declare passwordChangedAt: Date;
  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;
  declare readonly deletedAt: Date | null;

  // Associations
  declare roles?: any[];
}

User.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    email: {
      type: DataTypes.STRING(255),
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true
      },
      set(val: string) {
        this.setDataValue("email", val.trim().toLowerCase());
      }
    },
    passwordHash: {
      type: DataTypes.STRING(255),
      allowNull: false,
      field: "password_hash"
    },
    firstName: {
      type: DataTypes.STRING(100),
      allowNull: false,
      field: "first_name"
    },
    lastName: {
      type: DataTypes.STRING(100),
      allowNull: false,
      field: "last_name"
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
      field: "is_active"
    },
    passwordChangedAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
      field: "password_changed_at"
    }
  },
  {
    sequelize,
    tableName: "users",
    modelName: "User"
  }
);
