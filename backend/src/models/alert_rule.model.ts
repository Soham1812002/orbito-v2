import { Model, DataTypes, Optional } from "sequelize";
import { sequelize } from "../configs/database.js";

export interface AlertRuleAttributes {
  id: string;
  companyName: string;
  branchName: string;
  name: string;
  alertType: string;
  severity: "critical" | "warning" | "info";
  vehicleScope: "all" | "group" | "specific";
  vehicleIds: string[];
  conditions: Record<string, any>;
  schedule: {
    days: string[];
    start: string;
    end: string;
  };
  channels: {
    sms: boolean;
    email: boolean;
    push: boolean;
  };
  recipients: string[];
  isActive: boolean;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date | null;
}

export interface AlertRuleCreationAttributes
  extends Optional<
    AlertRuleAttributes,
    | "id"
    | "companyName"
    | "branchName"
    | "severity"
    | "vehicleScope"
    | "vehicleIds"
    | "conditions"
    | "schedule"
    | "channels"
    | "recipients"
    | "isActive"
    | "createdAt"
    | "updatedAt"
    | "deletedAt"
  > {}

export class AlertRule
  extends Model<AlertRuleAttributes, AlertRuleCreationAttributes>
  implements AlertRuleAttributes
{
  declare id: string;
  declare companyName: string;
  declare branchName: string;
  declare name: string;
  declare alertType: string;
  declare severity: "critical" | "warning" | "info";
  declare vehicleScope: "all" | "group" | "specific";
  declare vehicleIds: string[];
  declare conditions: Record<string, any>;
  declare schedule: {
    days: string[];
    start: string;
    end: string;
  };
  declare channels: {
    sms: boolean;
    email: boolean;
    push: boolean;
  };
  declare recipients: string[];
  declare isActive: boolean;
  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;
  declare readonly deletedAt: Date | null;
}

AlertRule.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
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
    name: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    alertType: {
      type: DataTypes.STRING(64),
      allowNull: false,
      field: "alert_type"
    },
    severity: {
      type: DataTypes.STRING(32),
      allowNull: false,
      defaultValue: "warning"
    },
    vehicleScope: {
      type: DataTypes.STRING(32),
      allowNull: false,
      defaultValue: "all",
      field: "vehicle_scope"
    },
    vehicleIds: {
      type: DataTypes.JSONB,
      allowNull: false,
      defaultValue: [],
      field: "vehicle_ids"
    },
    conditions: {
      type: DataTypes.JSONB,
      allowNull: false,
      defaultValue: {}
    },
    schedule: {
      type: DataTypes.JSONB,
      allowNull: false,
      defaultValue: {
        days: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
        start: "00:00",
        end: "23:59"
      }
    },
    channels: {
      type: DataTypes.JSONB,
      allowNull: false,
      defaultValue: {
        sms: false,
        email: true,
        push: true
      }
    },
    recipients: {
      type: DataTypes.JSONB,
      allowNull: false,
      defaultValue: []
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
      field: "is_active"
    }
  },
  {
    sequelize,
    tableName: "alert_rules",
    timestamps: true,
    paranoid: true,
    underscored: true
  }
);
