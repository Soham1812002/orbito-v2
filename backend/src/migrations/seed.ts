import bcrypt from "bcrypt";
import { sequelize } from "../configs/database.js";
import { logger } from "../configs/logger.js";
import { User, Role, Permission, UserRole, RolePermission, UserPasswordHistory } from "../models/index.js";
import { PERMISSIONS, ROLES } from "../utils/constants.js";

const BCRYPT_ROUNDS = 10;

export async function runSeeds(): Promise<void> {
  const transaction = await sequelize.transaction();
  try {
    logger.info("Starting database seeding...");

    // 1. Seed Permissions
    const permissionData = [
      { code: PERMISSIONS.OPERATE_ALL, action: "OPERATE", entity: "ALL", description: "Super Admin bypass" },
      { code: PERMISSIONS.VIEW_USER, action: "VIEW", entity: "USER", description: "View user profiles and list" },
      { code: PERMISSIONS.CREATE_USER, action: "CREATE", entity: "USER", description: "Create new user accounts" },
      { code: PERMISSIONS.UPDATE_USER, action: "UPDATE", entity: "USER", description: "Update existing user accounts" },
      { code: PERMISSIONS.DELETE_USER, action: "DELETE", entity: "USER", description: "Soft delete user accounts" },
      { code: PERMISSIONS.VIEW_ROLE, action: "VIEW", entity: "ROLE", description: "View role listings" },
      { code: PERMISSIONS.CREATE_ROLE, action: "CREATE", entity: "ROLE", description: "Create new roles" },
      { code: PERMISSIONS.UPDATE_ROLE, action: "UPDATE", entity: "ROLE", description: "Update roles" }
    ];

    const permissionsMap = new Map<string, Permission>();
    for (const p of permissionData) {
      const [perm] = await Permission.findOrCreate({
        where: { code: p.code },
        defaults: p,
        transaction
      });
      permissionsMap.set(p.code, perm);
    }
    logger.info("Permissions seeded.");

    // 2. Seed Roles
    const rolesData = [
      { name: ROLES.SUPER_ADMIN, description: "Super Administrator with complete bypass privileges" },
      { name: ROLES.ADMIN, description: "Administrator with user and role management access" },
      { name: ROLES.USER, description: "Standard user account" }
    ];

    const rolesMap = new Map<string, Role>();
    for (const r of rolesData) {
      const [role] = await Role.findOrCreate({
        where: { name: r.name },
        defaults: r,
        transaction
      });
      rolesMap.set(r.name, role);
    }
    logger.info("Roles seeded.");

    // 3. Link Role Permissions
    const superAdminRole = rolesMap.get(ROLES.SUPER_ADMIN)!;
    const operateAllPerm = permissionsMap.get(PERMISSIONS.OPERATE_ALL)!;
    await RolePermission.findOrCreate({
      where: { roleId: superAdminRole.id, permissionId: operateAllPerm.id },
      transaction
    });

    const adminRole = rolesMap.get(ROLES.ADMIN)!;
    const adminPermCodes = [
      PERMISSIONS.VIEW_USER,
      PERMISSIONS.CREATE_USER,
      PERMISSIONS.UPDATE_USER,
      PERMISSIONS.VIEW_ROLE
    ];
    for (const code of adminPermCodes) {
      const perm = permissionsMap.get(code);
      if (perm) {
        await RolePermission.findOrCreate({
          where: { roleId: adminRole.id, permissionId: perm.id },
          transaction
        });
      }
    }

    const userRole = rolesMap.get(ROLES.USER)!;
    const userPerm = permissionsMap.get(PERMISSIONS.VIEW_USER);
    if (userPerm) {
      await RolePermission.findOrCreate({
        where: { roleId: userRole.id, permissionId: userPerm.id },
        transaction
      });
    }

    // 4. Seed SuperAdmin User
    const adminEmail = "admin@example.com";
    const existingAdmin = await User.findOne({ where: { email: adminEmail }, transaction });

    if (!existingAdmin) {
      const adminPasswordHash = await bcrypt.hash("Admin@123456", BCRYPT_ROUNDS);
      const adminUser = await User.create(
        {
          email: adminEmail,
          passwordHash: adminPasswordHash,
          firstName: "System",
          lastName: "Admin",
          isActive: true,
          passwordChangedAt: new Date()
        },
        { transaction }
      );

      await UserRole.create(
        { userId: adminUser.id, roleId: superAdminRole.id },
        { transaction }
      );

      await UserPasswordHistory.create(
        { userId: adminUser.id, passwordHash: adminPasswordHash },
        { transaction }
      );
      logger.info(`Super Admin user created (${adminEmail})`);
    }

    // 5. Seed Demo User
    const demoEmail = "user@example.com";
    const existingDemo = await User.findOne({ where: { email: demoEmail }, transaction });

    if (!existingDemo) {
      const demoPasswordHash = await bcrypt.hash("User@123456", BCRYPT_ROUNDS);
      const demoUser = await User.create(
        {
          email: demoEmail,
          passwordHash: demoPasswordHash,
          firstName: "Demo",
          lastName: "User",
          isActive: true,
          passwordChangedAt: new Date()
        },
        { transaction }
      );

      await UserRole.create(
        { userId: demoUser.id, roleId: userRole.id },
        { transaction }
      );

      await UserPasswordHistory.create(
        { userId: demoUser.id, passwordHash: demoPasswordHash },
        { transaction }
      );
      logger.info(`Demo user created (${demoEmail})`);
    }

    await transaction.commit();
    logger.info("Database seeding completed successfully!");
  } catch (error) {
    await transaction.rollback();
    logger.error("Database seeding failed!", error);
    throw error;
  }
}

if (process.argv[1]?.includes("seed.ts")) {
  (async () => {
    try {
      await sequelize.authenticate();
      await runSeeds();
      process.exit(0);
    } catch (err) {
      process.exit(1);
    }
  })();
}
