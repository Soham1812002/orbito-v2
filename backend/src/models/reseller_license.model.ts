import { Model, DataTypes, Optional } from "sequelize";
import { sequelize } from "../configs/database.js";

export interface ResellerLicenseAttributes {
  id: string;
  reseller: string;
  contactPerson: string;
  telephone: string;
  licenseNumber: string;
  licenseModel: string;
  activationDate: string;
  expiryDate: string;
  extendedDate?: string;
  allocatedClients: number;
  allocatedVehicles: number;
  vehicleQuota: number;
  paymentReference?: string;
  notificationEmail?: string;
  renewalReminder?: string;
  remark?: string;
  paymentCompleted?: boolean;
  sendExpiryNotification?: boolean;
  status: "ACTIVE" | "EXPIRES_TODAY" | "EXPIRING_SOON" | "EXPIRED";
  statusLabel?: string;
  isActive: boolean;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date | null;
}

export interface ResellerLicenseCreationAttributes
  extends Optional<
    ResellerLicenseAttributes,
    | "id"
    | "extendedDate"
    | "allocatedClients"
    | "allocatedVehicles"
    | "vehicleQuota"
    | "paymentReference"
    | "notificationEmail"
    | "renewalReminder"
    | "remark"
    | "paymentCompleted"
    | "sendExpiryNotification"
    | "status"
    | "statusLabel"
    | "isActive"
    | "createdAt"
    | "updatedAt"
    | "deletedAt"
  > {}

export class ResellerLicense
  extends Model<ResellerLicenseAttributes, ResellerLicenseCreationAttributes>
  implements ResellerLicenseAttributes {
  declare id: string;
  declare reseller: string;
  declare contactPerson: string;
  declare telephone: string;
  declare licenseNumber: string;
  declare licenseModel: string;
  declare activationDate: string;
  declare expiryDate: string;
  declare extendedDate: string;
  declare allocatedClients: number;
  declare allocatedVehicles: number;
  declare vehicleQuota: number;
  declare paymentReference: string;
  declare notificationEmail: string;
  declare renewalReminder: string;
  declare remark: string;
  declare paymentCompleted: boolean;
  declare sendExpiryNotification: boolean;
  declare status: "ACTIVE" | "EXPIRES_TODAY" | "EXPIRING_SOON" | "EXPIRED";
  declare statusLabel: string;
  declare isActive: boolean;
  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;
  declare readonly deletedAt: Date | null;
}

ResellerLicense.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    reseller: {
      type: DataTypes.STRING(120),
      allowNull: false
    },
    contactPerson: {
      type: DataTypes.STRING(120),
      allowNull: false,
      field: "contact_person"
    },
    telephone: {
      type: DataTypes.STRING(30),
      allowNull: false
    },
    licenseNumber: {
      type: DataTypes.STRING(80),
      allowNull: false,
      unique: true,
      field: "license_number"
    },
    licenseModel: {
      type: DataTypes.STRING(100),
      allowNull: false,
      defaultValue: "Tier-1 Distribution",
      field: "license_model"
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
    extendedDate: {
      type: DataTypes.STRING(30),
      allowNull: true,
      defaultValue: "—",
      field: "extended_date"
    },
    allocatedClients: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      field: "allocated_clients"
    },
    allocatedVehicles: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      field: "allocated_vehicles"
    },
    vehicleQuota: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 100,
      field: "vehicle_quota"
    },
    paymentReference: {
      type: DataTypes.STRING(100),
      allowNull: true,
      defaultValue: "N/A",
      field: "payment_reference"
    },
    notificationEmail: {
      type: DataTypes.STRING(150),
      allowNull: true,
      defaultValue: "",
      field: "notification_email"
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
    paymentCompleted: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
      field: "payment_completed"
    },
    sendExpiryNotification: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
      field: "send_expiry_notification"
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
    tableName: "reseller_licenses",
    modelName: "ResellerLicense",
    paranoid: true,
    underscored: true
  }
);
