import { sequelize } from "../configs/database.js";
import { User } from "./user.model.js";
import { Role } from "./role.model.js";
import { Permission } from "./permission.model.js";
import { UserRole } from "./user_role.model.js";
import { RolePermission } from "./role_permission.model.js";
import { UserPasswordHistory } from "./user_password_history.model.js";

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

export {
  sequelize,
  User,
  Role,
  Permission,
  UserRole,
  RolePermission,
  UserPasswordHistory
};
