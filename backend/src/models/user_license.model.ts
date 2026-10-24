import { Model, DataTypes, Optional } from "sequelize";
import { sequelize } from "../configs/database.js";

export interface UserLicenseAttributes {
  id: string;
  user: string;
  userId?: string;
  userEmail?: string;
  userRole: string;
  company: string;
  branch: string;
  telephone: string;
  licenseType: string;
  licenseNumber: string;
  licenseKey?: string;
  allocatedVehicles: number;
  activationDate: string;
  expiryDate: string;
  extendDate?: string;
  licenseAmount?: string;
  paymentStatus?: string;
  paymentReference?: string;
  renewalReminder?: string;
  remark?: string;
  sendActivationEmail?: boolean;
  sendRenewalNotification?: boolean;
  status: "ACTIVE" | "EXPIRES_TODAY" | "EXPIRING_SOON" | "EXPIRED";
  statusLabel?: string;
  isActive: boolean;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date | null;
}

export interface UserLicenseCreationAttributes
  extends Optional<
    UserLicenseAttributes,
    | "id"
    | "userId"
    | "userEmail"
    | "licenseKey"
    | "allocatedVehicles"
    | "extendDate"
    | "licenseAmount"
    | "paymentStatus"
    | "paymentReference"
    | "renewalReminder"
    | "remark"
    | "sendActivationEmail"
    | "sendRenewalNotification"
    | "status"
    | "statusLabel"
    | "isActive"
    | "createdAt"
    | "updatedAt"
    | "deletedAt"
  > {}

export class UserLicense
  extends Model<UserLicenseAttributes, UserLicenseCreationAttributes>
  implements UserLicenseAttributes {
  declare id: string;
  declare user: string;
  declare userId: string;
  declare userEmail: string;
  declare userRole: string;
  declare company: string;
  declare branch: string;
  declare telephone: string;
  declare licenseType: string;
  declare licenseNumber: string;
  declare licenseKey: string;
  declare allocatedVehicles: number;
  declare activationDate: string;
  declare expiryDate: string;
  declare extendDate: string;
  declare licenseAmount: string;
  declare paymentStatus: string;
  declare paymentReference: string;
  declare renewalReminder: string;
  declare remark: string;
  declare sendActivationEmail: boolean;
  declare sendRenewalNotification: boolean;
  declare status: "ACTIVE" | "EXPIRES_TODAY" | "EXPIRING_SOON" | "EXPIRED";
  declare statusLabel: string;
  declare isActive: boolean;
  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;
  declare readonly deletedAt: Date | null;
}

UserLicense.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    user: {
      type: DataTypes.STRING(120),
      allowNull: false
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: true,
      field: "user_id"
    },
    userEmail: {
      type: DataTypes.STRING(255),
      allowNull: true,
      field: "user_email"
    },
    userRole: {
      type: DataTypes.STRING(50),
      allowNull: false,
      defaultValue: "VIEWER",
      field: "user_role"
    },
    company: {
      type: DataTypes.STRING(120),
      allowNull: false
    },
    branch: {
      type: DataTypes.STRING(120),
      allowNull: false
    },
    telephone: {
      type: DataTypes.STRING(30),
      allowNull: false
    },
    licenseType: {
      type: DataTypes.STRING(100),
      allowNull: false,
      defaultValue: "Standard Seat License",
      field: "license_type"
    },
    licenseNumber: {
      type: DataTypes.STRING(80),
      allowNull: false,
      unique: true,
      field: "license_number"
    },
    licenseKey: {
      type: DataTypes.STRING(100),
      allowNull: true,
      field: "license_key"
    },
    allocatedVehicles: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 10,
      field: "allocated_vehicles"
    },
    activationDate: {
      type: DataTypes.STRING(30),
      allowNull: false,
      field: "activation_date"
    },
    expiryDate: {
      type: DataTypes.STRING(30),
      allowNull: false,
      field: "expiry_date"
    },
    extendDate: {
      type: DataTypes.STRING(30),
      allowNull: true,
      defaultValue: "—",
      field: "extend_date"
    },
    licenseAmount: {
      type: DataTypes.STRING(50),
      allowNull: true,
      defaultValue: "₹2,400/yr",
      field: "license_amount"
    },
    paymentStatus: {
      type: DataTypes.STRING(50),
      allowNull: true,
      defaultValue: "PAID",
      field: "payment_status"
    },
    paymentReference: {
      type: DataTypes.STRING(100),
      allowNull: true,
      defaultValue: "N/A",
      field: "payment_reference"
    },
    renewalReminder: {
      type: DataTypes.STRING(100),
      allowNull: true,
      defaultValue: "30 days before expiry",
      field: "renewal_reminder"
    },
    remark: {
      type: DataTypes.STRING(255),
      allowNull: true,
      defaultValue: ""
    },
    sendActivationEmail: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
      field: "send_activation_email"
    },
    sendRenewalNotification: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
      field: "send_renewal_notification"
    },
    status: {
      type: DataTypes.ENUM("ACTIVE", "EXPIRES_TODAY", "EXPIRING_SOON", "EXPIRED"),
      allowNull: false,
      defaultValue: "ACTIVE"
    },
    statusLabel: {
      type: DataTypes.STRING(50),
      allowNull: true,
      defaultValue: "Active",
      field: "status_label"
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
      field: "is_active"
    }
  },
  {
    sequelize,
    tableName: "user_licenses",
    modelName: "UserLicense",
    paranoid: true,
    underscored: true
  }
);
