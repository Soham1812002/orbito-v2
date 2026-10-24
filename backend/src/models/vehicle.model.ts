import { Model, DataTypes, Optional } from "sequelize";
import { sequelize } from "../configs/database.js";
import { Driver } from "./driver.model.js";

export interface VehicleAttributes {
  id: string;
  plateNumber: string;
  makeModel: string;
  category: string;
  status: "moving" | "idling" | "stopped" | "inactive";
  speed: number;
  heading: number;
  latitude: number;
  longitude: number;
  ignition: boolean;
  fuelPercent: number;
  batteryPercent: number;
  odometer: number;
  engineTemp: number;
  lastLocation: string;
  lastUpdated: string;
  deviceImei: string;
  driverId?: string | null;
  companyName: string;
  todayDistance: number;
  immobilizerState: "locked" | "unlocked";
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date | null;
}

export interface VehicleCreationAttributes
  extends Optional<
    VehicleAttributes,
    | "id"
    | "speed"
    | "heading"
    | "latitude"
    | "longitude"
    | "ignition"
    | "fuelPercent"
    | "batteryPercent"
    | "odometer"
    | "engineTemp"
    | "lastLocation"
    | "lastUpdated"
    | "driverId"
    | "todayDistance"
    | "immobilizerState"
    | "createdAt"
    | "updatedAt"
    | "deletedAt"
  > {}

export class Vehicle extends Model<VehicleAttributes, VehicleCreationAttributes> implements VehicleAttributes {
  declare id: string;
  declare plateNumber: string;
  declare makeModel: string;
  declare category: string;
  declare status: "moving" | "idling" | "stopped" | "inactive";
  declare speed: number;
  declare heading: number;
  declare latitude: number;
  declare longitude: number;
  declare ignition: boolean;
  declare fuelPercent: number;
  declare batteryPercent: number;
  declare odometer: number;
  declare engineTemp: number;
  declare lastLocation: string;
  declare lastUpdated: string;
  declare deviceImei: string;
  declare driverId: string | null;
  declare companyName: string;
  declare todayDistance: number;
  declare immobilizerState: "locked" | "unlocked";
  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;
  declare readonly deletedAt: Date | null;

  // Association
  declare driver?: Driver;
}

Vehicle.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    plateNumber: {
      type: DataTypes.STRING(30),
      allowNull: false,
      unique: true,
      field: "plate_number"
    },
    makeModel: {
      type: DataTypes.STRING(100),
      allowNull: false,
      field: "make_model"
    },
    category: {
      type: DataTypes.STRING(50),
      allowNull: false,
      defaultValue: "heavy_truck"
    },
    status: {
      type: DataTypes.ENUM("moving", "idling", "stopped", "inactive"),
      allowNull: false,
      defaultValue: "stopped"
    },
    speed: {
      type: DataTypes.FLOAT,
      allowNull: false,
      defaultValue: 0
    },
    heading: {
      type: DataTypes.FLOAT,
      allowNull: false,
      defaultValue: 0
    },
    latitude: {
      type: DataTypes.DECIMAL(10, 7),
      allowNull: false,
      defaultValue: 28.6139
    },
    longitude: {
      type: DataTypes.DECIMAL(10, 7),
      allowNull: false,
      defaultValue: 77.209
    },
    ignition: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    fuelPercent: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 100,
      field: "fuel_percent"
    },
    batteryPercent: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 100,
      field: "battery_percent"
    },
    odometer: {
      type: DataTypes.FLOAT,
      allowNull: false,
      defaultValue: 0
    },
    engineTemp: {
      type: DataTypes.FLOAT,
      allowNull: false,
      defaultValue: 25,
      field: "engine_temp"
    },
    lastLocation: {
      type: DataTypes.STRING(255),
      allowNull: false,
      defaultValue: "Depot",
      field: "last_location"
    },
    lastUpdated: {
      type: DataTypes.STRING(50),
      allowNull: false,
      defaultValue: "Just now",
      field: "last_updated"
    },
    deviceImei: {
      type: DataTypes.STRING(50),
      allowNull: false,
      field: "device_imei"
    },
    driverId: {
      type: DataTypes.UUID,
      allowNull: true,
      field: "driver_id",
      references: {
        model: "drivers",
        key: "id"
      }
    },
    companyName: {
      type: DataTypes.STRING(120),
      allowNull: false,
      defaultValue: "InOrbit Logistics",
      field: "company_name"
    },
    todayDistance: {
      type: DataTypes.FLOAT,
      allowNull: false,
      defaultValue: 0,
      field: "today_distance"
    },
    immobilizerState: {
      type: DataTypes.ENUM("locked", "unlocked"),
      allowNull: false,
      defaultValue: "unlocked",
      field: "immobilizer_state"
    }
  },
  {
    sequelize,
    tableName: "vehicles",
    modelName: "Vehicle",
    paranoid: true,
    underscored: true
  }
);
