import { Model, DataTypes, Optional } from "sequelize";
import { sequelize } from "../configs/database.js";

export interface UserGroupAttributes {
  id: string;
  name: string;
  description: string;
  company: string;
  branch: string;
  reseller: string;
  adminRole: string;
  allowExcelExport: boolean;
  allowOperationalManage: boolean;
  isSystemAdmin: boolean;
  permissions: any[];
  isActive: boolean;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date | null;
}

export interface UserGroupCreationAttributes
  extends Optional<
    UserGroupAttributes,
    | "id"
    | "allowExcelExport"
    | "allowOperationalManage"
    | "isSystemAdmin"
    | "permissions"
    | "isActive"
    | "createdAt"
    | "updatedAt"
    | "deletedAt"
  > {}

export class UserGroup extends Model<UserGroupAttributes, UserGroupCreationAttributes> implements UserGroupAttributes {
  declare id: string;
  declare name: string;
  declare description: string;
  declare company: string;
  declare branch: string;
  declare reseller: string;
  declare adminRole: string;
  declare allowExcelExport: boolean;
  declare allowOperationalManage: boolean;
  declare isSystemAdmin: boolean;
  declare permissions: any[];
  declare isActive: boolean;
  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;
  declare readonly deletedAt: Date | null;
}

UserGroup.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    name: {
      type: DataTypes.STRING(120),
      allowNull: false
    },
    description: {
      type: DataTypes.STRING(500),
      allowNull: false,
      defaultValue: ""
    },
    company: {
      type: DataTypes.STRING(120),
      allowNull: false,
      defaultValue: "InOrbit Fleet Logistics"
    },
    branch: {
      type: DataTypes.STRING(120),
      allowNull: false,
      defaultValue: "Mumbai Central Hub"
    },
    reseller: {
      type: DataTypes.STRING(120),
      allowNull: false,
      defaultValue: "Direct Enterprise"
    },
    adminRole: {
      type: DataTypes.STRING(50),
      allowNull: false,
      defaultValue: "VIEWER",
      field: "admin_role"
    },
    allowExcelExport: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
      field: "allow_excel_export"
    },
    allowOperationalManage: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
      field: "allow_operational_manage"
    },
    isSystemAdmin: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      field: "is_system_admin"
    },
    permissions: {
      type: DataTypes.JSONB,
      allowNull: false,
      defaultValue: []
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
      field: "is_active"
    }
  },
  {
    sequelize,
    tableName: "user_groups",
    modelName: "UserGroup",
    paranoid: true,
    underscored: true
  }
);
