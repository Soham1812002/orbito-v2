import { Model, DataTypes, Optional } from "sequelize";
import { sequelize } from "../configs/database.js";

export interface GeofenceCoordinate {
  lat: number;
  lng: number;
}

export interface GeofenceAttributes {
  id: string;
  name: string;
  type: "circular" | "polygon";
  category: string;
  company: string;
  branch?: string | null;
  centerLatitude: number;
  centerLongitude: number;
  radiusMeters?: number | null;
  coordinates?: GeofenceCoordinate[] | null;
  speedLimitKmh?: number | null;
  assignedVehiclesCount: number;
  alertOnEnter: boolean;
  alertOnExit: boolean;
  alertOnOverstay: boolean;
  maxDwellMinutes?: number | null;
  description?: string | null;
  isActive: boolean;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date | null;
}

export interface GeofenceCreationAttributes
  extends Optional<
    GeofenceAttributes,
    | "id"
    | "branch"
    | "radiusMeters"
    | "coordinates"
    | "speedLimitKmh"
    | "assignedVehiclesCount"
    | "alertOnEnter"
    | "alertOnExit"
    | "alertOnOverstay"
    | "maxDwellMinutes"
    | "description"
    | "isActive"
    | "createdAt"
    | "updatedAt"
    | "deletedAt"
  > {}

export class Geofence
  extends Model<GeofenceAttributes, GeofenceCreationAttributes>
  implements GeofenceAttributes
{
  declare id: string;
  declare name: string;
  declare type: "circular" | "polygon";
  declare category: string;
  declare company: string;
  declare branch: string | null;
  declare centerLatitude: number;
  declare centerLongitude: number;
  declare radiusMeters: number | null;
  declare coordinates: GeofenceCoordinate[] | null;
  declare speedLimitKmh: number | null;
  declare assignedVehiclesCount: number;
  declare alertOnEnter: boolean;
  declare alertOnExit: boolean;
  declare alertOnOverstay: boolean;
  declare maxDwellMinutes: number | null;
  declare description: string | null;
  declare isActive: boolean;
  declare createdAt: Date;
  declare updatedAt: Date;
  declare deletedAt: Date | null;
}

Geofence.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      field: "id"
    },
    name: {
      type: DataTypes.STRING(255),
      allowNull: false,
      field: "name"
    },
    type: {
      type: DataTypes.ENUM("circular", "polygon"),
      allowNull: false,
      defaultValue: "circular",
      field: "type"
    },
    category: {
      type: DataTypes.STRING(100),
      allowNull: false,
      field: "category"
    },
    company: {
      type: DataTypes.STRING(255),
      allowNull: false,
      field: "company"
    },
    branch: {
      type: DataTypes.STRING(255),
      allowNull: true,
      field: "branch"
    },
    centerLatitude: {
      type: DataTypes.DECIMAL(10, 6),
      allowNull: false,
      field: "center_latitude",
      get() {
        const val = this.getDataValue("centerLatitude" as any);
        return val === null ? null : parseFloat(val as any);
      }
    },
    centerLongitude: {
      type: DataTypes.DECIMAL(10, 6),
      allowNull: false,
      field: "center_longitude",
      get() {
        const val = this.getDataValue("centerLongitude" as any);
        return val === null ? null : parseFloat(val as any);
      }
    },
    radiusMeters: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 500,
      field: "radius_meters"
    },
    coordinates: {
      type: DataTypes.JSONB,
      allowNull: true,
      defaultValue: null,
      field: "coordinates"
    },
    speedLimitKmh: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 30,
      field: "speed_limit_kmh"
    },
    assignedVehiclesCount: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      field: "assigned_vehicles_count"
    },
    alertOnEnter: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
      field: "alert_on_enter"
    },
    alertOnExit: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
      field: "alert_on_exit"
    },
    alertOnOverstay: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
      field: "alert_on_overstay"
    },
    maxDwellMinutes: {
      type: DataTypes.INTEGER,
      allowNull: true,
      field: "max_dwell_minutes"
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
      field: "description"
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
      field: "is_active"
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
      field: "created_at"
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
      field: "updated_at"
    },
    deletedAt: {
      type: DataTypes.DATE,
      allowNull: true,
      field: "deleted_at"
    }
  },
  {
    sequelize,
    tableName: "geofences",
    timestamps: true,
    paranoid: true,
    underscored: true
  }
);
