import { Model, DataTypes, Optional } from "sequelize";
import { sequelize } from "../configs/database.js";

export interface DriverAttributes {
  id: string;
  name: string;
  phone: string;
  licenseNumber: string;
  avatar?: string;
  rating?: number;
  isActive: boolean;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date | null;
}

export interface DriverCreationAttributes
  extends Optional<DriverAttributes, "id" | "avatar" | "rating" | "isActive" | "createdAt" | "updatedAt" | "deletedAt"> {}

export class Driver extends Model<DriverAttributes, DriverCreationAttributes> implements DriverAttributes {
  declare id: string;
  declare name: string;
  declare phone: string;
  declare licenseNumber: string;
  declare avatar: string;
  declare rating: number;
  declare isActive: boolean;
  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;
  declare readonly deletedAt: Date | null;
}

Driver.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    name: {
      type: DataTypes.STRING(120),
      allowNull: false
    },
    phone: {
      type: DataTypes.STRING(30),
      allowNull: false
    },
    licenseNumber: {
      type: DataTypes.STRING(50),
      allowNull: false,
      field: "license_number"
    },
    avatar: {
      type: DataTypes.STRING(255),
      allowNull: true,
      defaultValue: "DRV"
    },
    rating: {
      type: DataTypes.FLOAT,
      allowNull: false,
      defaultValue: 5.0
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
      field: "is_active"
    }
  },
  {
    sequelize,
    tableName: "drivers",
    modelName: "Driver",
    paranoid: true,
    underscored: true
  }
);
