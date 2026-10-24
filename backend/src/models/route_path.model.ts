import { Model, DataTypes, Optional } from "sequelize";
import { sequelize } from "../configs/database.js";

export interface RouteWaypoint {
  name: string;
  latitude: number;
  longitude: number;
  sequence: number;
}

export interface RoutePathAttributes {
  id: string;
  companyName: string;
  branchName: string;
  routeCode: string;
  routeName: string;
  originName: string;
  originLatitude: number;
  originLongitude: number;
  destinationName: string;
  destinationLatitude: number;
  destinationLongitude: number;
  distanceKm: number;
  estimatedDurationMins: number;
  maxAllowedSpeed: number;
  bufferRadiusMeters: number;
  waypoints: RouteWaypoint[];
  isActive: boolean;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date | null;
}

export interface RoutePathCreationAttributes
  extends Optional<
    RoutePathAttributes,
    | "id"
    | "companyName"
    | "branchName"
    | "maxAllowedSpeed"
    | "bufferRadiusMeters"
    | "waypoints"
    | "isActive"
    | "createdAt"
    | "updatedAt"
    | "deletedAt"
  > {}

export class RoutePath
  extends Model<RoutePathAttributes, RoutePathCreationAttributes>
  implements RoutePathAttributes
{
  declare id: string;
  declare companyName: string;
  declare branchName: string;
  declare routeCode: string;
  declare routeName: string;
  declare originName: string;
  declare originLatitude: number;
  declare originLongitude: number;
  declare destinationName: string;
  declare destinationLatitude: number;
  declare destinationLongitude: number;
  declare distanceKm: number;
  declare estimatedDurationMins: number;
  declare maxAllowedSpeed: number;
  declare bufferRadiusMeters: number;
  declare waypoints: RouteWaypoint[];
  declare isActive: boolean;

  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;
  declare readonly deletedAt: Date | null;
}

RoutePath.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      allowNull: false
    },
    companyName: {
      type: DataTypes.STRING(150),
      allowNull: false,
      defaultValue: "inOrbit Logistics",
      field: "company_name"
    },
    branchName: {
      type: DataTypes.STRING(150),
      allowNull: false,
      defaultValue: "All Branches",
      field: "branch_name"
    },
    routeCode: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: true,
      field: "route_code"
    },
    routeName: {
      type: DataTypes.STRING(255),
      allowNull: false,
      field: "route_name"
    },
    originName: {
      type: DataTypes.STRING(255),
      allowNull: false,
      field: "origin_name"
    },
    originLatitude: {
      type: DataTypes.DOUBLE,
      allowNull: false,
      field: "origin_latitude"
    },
    originLongitude: {
      type: DataTypes.DOUBLE,
      allowNull: false,
      field: "origin_longitude"
    },
    destinationName: {
      type: DataTypes.STRING(255),
      allowNull: false,
      field: "destination_name"
    },
    destinationLatitude: {
      type: DataTypes.DOUBLE,
      allowNull: false,
      field: "destination_latitude"
    },
    destinationLongitude: {
      type: DataTypes.DOUBLE,
      allowNull: false,
      field: "destination_longitude"
    },
    distanceKm: {
      type: DataTypes.DOUBLE,
      allowNull: false,
      field: "distance_km"
    },
    estimatedDurationMins: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: "estimated_duration_mins"
    },
    maxAllowedSpeed: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 80,
      field: "max_allowed_speed"
    },
    bufferRadiusMeters: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 500,
      field: "buffer_radius_meters"
    },
    waypoints: {
      type: DataTypes.JSONB,
      allowNull: false,
      defaultValue: []
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
      field: "created_at"
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
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
    tableName: "route_paths",
    modelName: "RoutePath",
    paranoid: true,
    timestamps: true,
    underscored: true
  }
);
