import { Model, DataTypes, Optional } from "sequelize";
import { sequelize } from "../configs/database.js";

export interface ComplianceReminderAttributes {
  id: string;
  companyName: string;
  branchName: string;
  entityType: "vehicle" | "driver" | "depot";
  entityId: string;
  entityIdentifier: string;
  reminderCategory: string; // 'National Permit', 'Road Tax', 'Fitness Certificate', 'Insurance Policy', 'PUC'
  documentNumber?: string | null;
  issueDate?: string | null;
  expiryDate: string;
  notifyBeforeDays: number;
  notifyEmail: boolean;
  notifySms: boolean;
  notifyPush: boolean;
  status: "active" | "due_soon" | "overdue" | "renewed";
  notes?: string | null;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date | null;
}

export interface ComplianceReminderCreationAttributes
  extends Optional<
    ComplianceReminderAttributes,
    | "id"
    | "companyName"
    | "branchName"
    | "entityType"
    | "documentNumber"
    | "issueDate"
    | "notifyBeforeDays"
    | "notifyEmail"
    | "notifySms"
    | "notifyPush"
    | "status"
    | "notes"
    | "createdAt"
    | "updatedAt"
    | "deletedAt"
  > {}

export class ComplianceReminder
  extends Model<ComplianceReminderAttributes, ComplianceReminderCreationAttributes>
  implements ComplianceReminderAttributes
{
  declare id: string;
  declare companyName: string;
  declare branchName: string;
  declare entityType: "vehicle" | "driver" | "depot";
  declare entityId: string;
  declare entityIdentifier: string;
  declare reminderCategory: string;
  declare documentNumber?: string | null;
  declare issueDate?: string | null;
  declare expiryDate: string;
  declare notifyBeforeDays: number;
  declare notifyEmail: boolean;
  declare notifySms: boolean;
  declare notifyPush: boolean;
  declare status: "active" | "due_soon" | "overdue" | "renewed";
  declare notes?: string | null;

  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;
  declare readonly deletedAt: Date | null;
}

ComplianceReminder.init(
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
    entityType: {
      type: DataTypes.STRING(50),
      allowNull: false,
      defaultValue: "vehicle",
      field: "entity_type"
    },
    entityId: {
      type: DataTypes.STRING(100),
      allowNull: false,
      field: "entity_id"
    },
    entityIdentifier: {
      type: DataTypes.STRING(100),
      allowNull: false,
      field: "entity_identifier"
    },
    reminderCategory: {
      type: DataTypes.STRING(100),
      allowNull: false,
      field: "reminder_category"
    },
    documentNumber: {
      type: DataTypes.STRING(100),
      allowNull: true,
      field: "document_number"
    },
    issueDate: {
      type: DataTypes.DATEONLY,
      allowNull: true,
      field: "issue_date"
    },
    expiryDate: {
      type: DataTypes.DATEONLY,
      allowNull: false,
      field: "expiry_date"
    },
    notifyBeforeDays: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 30,
      field: "notify_before_days"
    },
    notifyEmail: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
      field: "notify_email"
    },
    notifySms: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
      field: "notify_sms"
    },
    notifyPush: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
      field: "notify_push"
    },
    status: {
      type: DataTypes.STRING(50),
      allowNull: false,
      defaultValue: "active"
    },
    notes: {
      type: DataTypes.TEXT,
      allowNull: true
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
    tableName: "compliance_reminders",
    modelName: "ComplianceReminder",
    paranoid: true,
    timestamps: true,
    underscored: true
  }
);
