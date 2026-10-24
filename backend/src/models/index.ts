import { sequelize } from "../configs/database.js";
import { User } from "./user.model.js";
import { Role } from "./role.model.js";
import { Permission } from "./permission.model.js";
import { UserRole } from "./user_role.model.js";
import { RolePermission } from "./role_permission.model.js";
import { UserPasswordHistory } from "./user_password_history.model.js";
import { AuditLog } from "./audit_log.model.js";
import { SystemConfig } from "./system_config.model.js";
import { AppConfig } from "./app_config.model.js";
import { MaintenanceReminder } from "./maintenance_reminder.model.js";
import { VehicleExpense } from "./vehicle_expense.model.js";
import { AlertRule } from "./alert_rule.model.js";
import { AlertLog } from "./alert_log.model.js";
import { RoutePath } from "./route_path.model.js";
import { RoutePathAllocation } from "./route_path_allocation.model.js";
import { CrewAllocation } from "./crew_allocation.model.js";
import { ImmobilizerAudit } from "./immobilizer_audit.model.js";
import { ComplianceReminder } from "./compliance_reminder.model.js";

// Phase 1 Core Fleet & Access Models
import { Driver } from "./driver.model.js";
import { Vehicle } from "./vehicle.model.js";
import { UserGroup } from "./user_group.model.js";
import { CompanyLicense } from "./company_license.model.js";
import { ResellerLicense } from "./reseller_license.model.js";
import { VehicleLicense } from "./vehicle_license.model.js";
import { UserLicense } from "./user_license.model.js";
import { Geofence } from "./geofence.model.js";
import { Poi } from "./poi.model.js";
import { RefreshToken } from "./refresh_token.model.js";

// User <-> Role (Many-to-Many)
User.belongsToMany(Role, {
  through: UserRole,
  foreignKey: "userId",
  otherKey: "roleId",
  as: "roles"
});

Role.belongsToMany(User, {
  through: UserRole,
  foreignKey: "roleId",
  otherKey: "userId",
  as: "users"
});

// Role <-> Permission (Many-to-Many)
Role.belongsToMany(Permission, {
  through: RolePermission,
  foreignKey: "roleId",
  otherKey: "permissionId",
  as: "permissions"
});

Permission.belongsToMany(Role, {
  through: RolePermission,
  foreignKey: "permissionId",
  otherKey: "roleId",
  as: "roles"
});

// User <-> UserPasswordHistory (One-to-Many)
User.hasMany(UserPasswordHistory, {
  foreignKey: "userId",
  as: "passwordHistories",
  onDelete: "CASCADE"
});

UserPasswordHistory.belongsTo(User, {
  foreignKey: "userId",
  as: "user"
});

// User <-> UserGroup
User.belongsTo(UserGroup, {
  foreignKey: "groupId",
  as: "group"
});

UserGroup.hasMany(User, {
  foreignKey: "groupId",
  as: "users"
});

// Vehicle <-> Driver
Vehicle.belongsTo(Driver, {
  foreignKey: "driverId",
  as: "driver"
});

Driver.hasMany(Vehicle, {
  foreignKey: "driverId",
  as: "vehicles"
});

// Alerts
AlertRule.hasMany(AlertLog, {
  foreignKey: "ruleId",
  as: "logs"
});

AlertLog.belongsTo(AlertRule, {
  foreignKey: "ruleId",
  as: "rule"
});

// Dispatch & Corridors
RoutePath.hasMany(RoutePathAllocation, {
  foreignKey: "routePathId",
  as: "allocations"
});

RoutePathAllocation.belongsTo(RoutePath, {
  foreignKey: "routePathId",
  as: "routePath"
});

// User <-> RefreshToken (One-to-Many)
User.hasMany(RefreshToken, {
  foreignKey: "userId",
  as: "refreshTokens",
  onDelete: "CASCADE"
});

RefreshToken.belongsTo(User, {
  foreignKey: "userId",
  as: "user"
});

export {
  sequelize,
  User,
  Role,
  Permission,
  UserRole,
  RolePermission,
  UserPasswordHistory,
  AuditLog,
  SystemConfig,
  AppConfig,
  MaintenanceReminder,
  VehicleExpense,
  AlertRule,
  AlertLog,
  RoutePath,
  RoutePathAllocation,
  CrewAllocation,
  ImmobilizerAudit,
  ComplianceReminder,
  Driver,
  Vehicle,
  UserGroup,
  CompanyLicense,
  ResellerLicense,
  VehicleLicense,
  UserLicense,
  Geofence,
  Poi,
  RefreshToken
};
