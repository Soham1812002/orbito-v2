import { Model, DataTypes, Optional } from "sequelize";
import { sequelize } from "../configs/database.js";

export interface CompanyLicenseAttributes {
  id: string;
  company: string;
  branch: string;
  contactPerson: string;
  telephone: string;
  licenseType: string;
  licenseName: string;
  licenseNumber: string;
  issuingAuthority: string;
  licenseIssueDate: string;
  activationDate: string;
  expiryDate: string;
  extendDate: string;
  addedVehicles: number;
  maxVehicles: number;
  status: "ACTIVE" | "EXPIRES_TODAY" | "EXPIRING_SOON" | "EXPIRED";
  statusLabel: string;
  remark: string;
  renewalReminder: string;
  sendRenewalNotification: boolean;
  isActive: boolean;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date | null;
}

export interface CompanyLicenseCreationAttributes
  extends Optional<
    CompanyLicenseAttributes,
    | "id"
    | "extendDate"
    | "addedVehicles"
    | "maxVehicles"
    | "status"
    | "statusLabel"
    | "remark"
    | "renewalReminder"
    | "sendRenewalNotification"
    | "isActive"
    | "createdAt"
    | "updatedAt"
    | "deletedAt"
  > {}

export class CompanyLicense
  extends Model<CompanyLicenseAttributes, CompanyLicenseCreationAttributes>
  implements CompanyLicenseAttributes {
  declare id: string;
  declare company: string;
  declare branch: string;
  declare contactPerson: string;
  declare telephone: string;
  declare licenseType: string;
  declare licenseName: string;
  declare licenseNumber: string;
  declare issuingAuthority: string;
  declare licenseIssueDate: string;
  declare activationDate: string;
  declare expiryDate: string;
  declare extendDate: string;
  declare addedVehicles: number;
  declare maxVehicles: number;
  declare status: "ACTIVE" | "EXPIRES_TODAY" | "EXPIRING_SOON" | "EXPIRED";
  declare statusLabel: string;
  declare remark: string;
  declare renewalReminder: string;
  declare sendRenewalNotification: boolean;
  declare isActive: boolean;
  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;
  declare readonly deletedAt: Date | null;
}

CompanyLicense.init(
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
    contactPerson: {
      type: DataTypes.STRING(120),
      allowNull: false,
      field: "contact_person"
    },
    telephone: {
      type: DataTypes.STRING(30),
      allowNull: false
    },
    licenseType: {
      type: DataTypes.STRING(100),
      allowNull: false,
      field: "license_type"
    },
    licenseName: {
      type: DataTypes.STRING(150),
      allowNull: false,
      field: "license_name"
    },
    licenseNumber: {
      type: DataTypes.STRING(80),
      allowNull: false,
      unique: true,
      field: "license_number"
    },
    issuingAuthority: {
      type: DataTypes.STRING(150),
      allowNull: false,
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
    extendDate: {
      type: DataTypes.STRING(30),
      allowNull: false,
      defaultValue: "—",
      field: "extend_date"
    },
    addedVehicles: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      field: "added_vehicles"
    },
    maxVehicles: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 50,
      field: "max_vehicles"
    },
    status: {
      type: DataTypes.ENUM("ACTIVE", "EXPIRES_TODAY", "EXPIRING_SOON", "EXPIRED"),
      allowNull: false,
      defaultValue: "ACTIVE"
    },
    statusLabel: {
      type: DataTypes.STRING(50),
      allowNull: false,
      defaultValue: "Active",
      field: "status_label"
    },
    remark: {
      type: DataTypes.STRING(255),
      allowNull: true,
      defaultValue: "",
      field: "remark"
    },
    renewalReminder: {
      type: DataTypes.STRING(100),
      allowNull: false,
      defaultValue: "30 days before expiry",
      field: "renewal_reminder"
    },
    sendRenewalNotification: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
      field: "send_renewal_notification"
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
      field: "is_active"
    }
  },
  {
    sequelize,
    tableName: "company_licenses",
    modelName: "CompanyLicense",
    paranoid: true,
    underscored: true
  }
);
