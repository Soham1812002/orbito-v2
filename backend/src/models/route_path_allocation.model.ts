import { Model, DataTypes, Optional } from "sequelize";
import { sequelize } from "../configs/database.js";
import { RoutePath } from "./route_path.model.js";

export interface RoutePathAllocationAttributes {
  id: string;
  routePathId: string;
  vehicleId: string;
  vehiclePlate: string;
  companyName: string;
  branchName: string;
  allocationName: string;
  scheduleType: "daily" | "weekdays" | "custom" | "on_demand";
  activeDays: string[];
  departureTime: string;
  maxTransitHours: number;
  allowDeviation: boolean;
  deviationAlertThresholdMeters: number;
  isActive: boolean;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date | null;
}

export interface RoutePathAllocationCreationAttributes
  extends Optional<
    RoutePathAllocationAttributes,
    | "id"
    | "companyName"
    | "branchName"
    | "scheduleType"
    | "activeDays"
    | "departureTime"
    | "maxTransitHours"
    | "allowDeviation"
    | "deviationAlertThresholdMeters"
    | "isActive"
    | "createdAt"
    | "updatedAt"
    | "deletedAt"
  > {}

export class RoutePathAllocation
  extends Model<RoutePathAllocationAttributes, RoutePathAllocationCreationAttributes>
  implements RoutePathAllocationAttributes
{
  declare id: string;
  declare routePathId: string;
  declare vehicleId: string;
  declare vehiclePlate: string;
  declare companyName: string;
  declare branchName: string;
  declare allocationName: string;
  declare scheduleType: "daily" | "weekdays" | "custom" | "on_demand";
  declare activeDays: string[];
  declare departureTime: string;
  declare maxTransitHours: number;
  declare allowDeviation: boolean;
  declare deviationAlertThresholdMeters: number;
  declare isActive: boolean;

  declare readonly routePath?: RoutePath;
  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;
  declare readonly deletedAt: Date | null;
}

RoutePathAllocation.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      allowNull: false
    },
    routePathId: {
      type: DataTypes.UUID,
      allowNull: false,
      field: "route_path_id",
      references: {
        model: "route_paths",
        key: "id"
      }
    },
    vehicleId: {
      type: DataTypes.STRING(100),
      allowNull: false,
      field: "vehicle_id"
    },
    vehiclePlate: {
      type: DataTypes.STRING(50),
      allowNull: false,
      field: "vehicle_plate"
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
    allocationName: {
      type: DataTypes.STRING(255),
      allowNull: false,
      field: "allocation_name"
    },
    scheduleType: {
      type: DataTypes.STRING(50),
      allowNull: false,
      defaultValue: "daily",
      field: "schedule_type"
    },
    activeDays: {
      type: DataTypes.JSONB,
      allowNull: false,
      defaultValue: ["Mon", "Tue", "Wed", "Thu", "Fri"],
      field: "active_days"
    },
    departureTime: {
      type: DataTypes.STRING(10),
      allowNull: false,
      defaultValue: "08:00",
      field: "departure_time"
    },
    maxTransitHours: {
      type: DataTypes.DOUBLE,
      allowNull: false,
      defaultValue: 8,
      field: "max_transit_hours"
    },
    allowDeviation: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
      field: "allow_deviation"
    },
    deviationAlertThresholdMeters: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1000,
      field: "deviation_alert_threshold_meters"
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
    tableName: "route_path_allocations",
    modelName: "RoutePathAllocation",
    paranoid: true,
    timestamps: true,
    underscored: true
  }
);
