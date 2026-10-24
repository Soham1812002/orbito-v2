import { Model, DataTypes, Optional } from "sequelize";
import { sequelize } from "../configs/database.js";
import { UserGroup } from "./user_group.model.js";

export interface UserAttributes {
  id: string;
  email: string;
  passwordHash: string;
  firstName: string;
  lastName: string;
  phone?: string;
  company?: string;
  branch?: string;
  reseller?: string;
  groupId?: string | null;
  allocationGroup?: string;
  expiryDate?: string | null;
  language?: string;
  timezone?: string;
  dateFormat?: string;
  measurementUnit?: string;
  features?: Record<string, boolean>;
  isActive: boolean;
  passwordChangedAt: Date;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date | null;
}

export interface UserCreationAttributes
  extends Optional<
    UserAttributes,
    | "id"
    | "phone"
    | "company"
    | "branch"
    | "reseller"
    | "groupId"
    | "allocationGroup"
    | "expiryDate"
    | "language"
    | "timezone"
    | "dateFormat"
    | "measurementUnit"
    | "features"
    | "isActive"
    | "passwordChangedAt"
    | "createdAt"
    | "updatedAt"
    | "deletedAt"
  > {}

export class User extends Model<UserAttributes, UserCreationAttributes> implements UserAttributes {
  declare id: string;
  declare email: string;
  declare passwordHash: string;
  declare firstName: string;
  declare lastName: string;
  declare phone: string;
  declare company: string;
  declare branch: string;
  declare reseller: string;
  declare groupId: string | null;
  declare allocationGroup: string;
  declare expiryDate: string | null;
  declare language: string;
  declare timezone: string;
  declare dateFormat: string;
  declare measurementUnit: string;
  declare features: Record<string, boolean>;
  declare isActive: boolean;
  declare passwordChangedAt: Date;
  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;
  declare readonly deletedAt: Date | null;

  // Associations
  declare roles?: any[];
  declare group?: UserGroup;
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
    phone: {
      type: DataTypes.STRING(30),
      allowNull: true,
      defaultValue: "+91 98201 12345"
    },
    company: {
      type: DataTypes.STRING(120),
      allowNull: true,
      defaultValue: "InOrbit Fleet Logistics"
    },
    branch: {
      type: DataTypes.STRING(120),
      allowNull: true,
      defaultValue: "Mumbai Central Hub"
    },
    reseller: {
      type: DataTypes.STRING(120),
      allowNull: true,
      defaultValue: "Direct Enterprise"
    },
    groupId: {
      type: DataTypes.UUID,
      allowNull: true,
      field: "group_id",
      references: {
        model: "user_groups",
        key: "id"
      }
    },
    allocationGroup: {
      type: DataTypes.STRING(120),
      allowNull: true,
      defaultValue: "All India Logistics",
      field: "allocation_group"
    },
    expiryDate: {
      type: DataTypes.STRING(30),
      allowNull: true,
      defaultValue: "2028-12-31",
      field: "expiry_date"
    },
    language: {
      type: DataTypes.STRING(10),
      defaultValue: "en"
    },
    timezone: {
      type: DataTypes.STRING(50),
      defaultValue: "Asia/Kolkata"
    },
    dateFormat: {
      type: DataTypes.STRING(20),
      defaultValue: "DD/MM/YYYY",
      field: "date_format"
    },
    measurementUnit: {
      type: DataTypes.STRING(10),
      defaultValue: "km",
      field: "measurement_unit"
    },
    features: {
      type: DataTypes.JSONB,
      defaultValue: { liveTracking: true, dashboardCharts: true, routePlayback: true, emailAlerts: true }
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
    modelName: "User",
    paranoid: true,
    timestamps: true
  }
);
