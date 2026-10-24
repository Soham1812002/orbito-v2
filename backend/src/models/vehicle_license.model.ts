import { Model, DataTypes, Optional } from "sequelize";
import { sequelize } from "../configs/database.js";

export interface VehicleLicenseAttributes {
  id: string;
  company: string;
  branch: string;
  vehicle: string;
  vehicleId?: string;
  registrationNumber: string;
  gpsDevice: string;
  imei: string;
  simNumber: string;
  licenseType?: string;
  licenseNumber: string;
  issuingAuthority?: string;
  licenseIssueDate: string;
  activationDate: string;
  expiryDate: string;
  extendedDate?: string;
  assignedUser?: string;
  licenseAmount?: string;
  paymentReference?: string;
  renewalReminder?: string;
  notificationEmail?: string;
  paymentCompleted?: boolean;
  sendExpiryNotification?: boolean;
  status: "ACTIVE" | "EXPIRES_TODAY" | "EXPIRING_SOON" | "EXPIRED";
  statusLabel?: string;
  isActive: boolean;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date | null;
}

export interface VehicleLicenseCreationAttributes
  extends Optional<
    VehicleLicenseAttributes,
    | "id"
    | "vehicleId"
    | "licenseType"
    | "issuingAuthority"
    | "extendedDate"
    | "assignedUser"
    | "licenseAmount"
    | "paymentReference"
    | "renewalReminder"
    | "notificationEmail"
    | "paymentCompleted"
    | "sendExpiryNotification"
    | "status"
    | "statusLabel"
    | "isActive"
    | "createdAt"
    | "updatedAt"
    | "deletedAt"
  > {}

export class VehicleLicense
  extends Model<VehicleLicenseAttributes, VehicleLicenseCreationAttributes>
  implements VehicleLicenseAttributes {
  declare id: string;
  declare company: string;
  declare branch: string;
  declare vehicle: string;
  declare vehicleId: string;
  declare registrationNumber: string;
  declare gpsDevice: string;
  declare imei: string;
  declare simNumber: string;
  declare licenseType: string;
  declare licenseNumber: string;
  declare issuingAuthority: string;
  declare licenseIssueDate: string;
  declare activationDate: string;
  declare expiryDate: string;
  declare extendedDate: string;
  declare assignedUser: string;
  declare licenseAmount: string;
  declare paymentReference: string;
  declare renewalReminder: string;
  declare notificationEmail: string;
  declare paymentCompleted: boolean;
  declare sendExpiryNotification: boolean;
  declare status: "ACTIVE" | "EXPIRES_TODAY" | "EXPIRING_SOON" | "EXPIRED";
  declare statusLabel: string;
  declare isActive: boolean;
  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;
  declare readonly deletedAt: Date | null;
}

VehicleLicense.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    company: {
      type: DataTypes.STRING(120),
      allowNull: false
    },
    branch: {
      type: DataTypes.STRING(120),
      allowNull: false
    },
    vehicle: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    vehicleId: {
      type: DataTypes.UUID,
      allowNull: true,
      field: "vehicle_id"
    },
    registrationNumber: {
      type: DataTypes.STRING(30),
      allowNull: false,
      field: "registration_number"
    },
    gpsDevice: {
      type: DataTypes.STRING(80),
      allowNull: false,
      field: "gps_device"
    },
    imei: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    simNumber: {
      type: DataTypes.STRING(50),
      allowNull: false,
      field: "sim_number"
    },
    licenseType: {
      type: DataTypes.STRING(100),
      allowNull: true,
      defaultValue: "Standard Telematics License",
      field: "license_type"
    },
    licenseNumber: {
      type: DataTypes.STRING(80),
      allowNull: false,
      unique: true,
      field: "license_number"
    },
    issuingAuthority: {
      type: DataTypes.STRING(150),
      allowNull: true,
      defaultValue: "Transport Authority",
      field: "issuing_authority"
    },
    licenseIssueDate: {
      type: DataTypes.STRING(30),
      allowNull: false,
      field: "license_issue_date"
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
    assignedUser: {
      type: DataTypes.STRING(120),
      allowNull: true,
      field: "assigned_user"
    },
    licenseAmount: {
      type: DataTypes.STRING(50),
      allowNull: true,
      defaultValue: "₹4,500/yr",
      field: "license_amount"
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
    notificationEmail: {
      type: DataTypes.STRING(150),
      allowNull: true,
      defaultValue: "",
      field: "notification_email"
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
    tableName: "vehicle_licenses",
    modelName: "VehicleLicense",
    paranoid: true,
    underscored: true
  }
);
