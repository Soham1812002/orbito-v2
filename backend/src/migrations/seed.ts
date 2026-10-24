import bcrypt from "bcrypt";
import { sequelize } from "../configs/database.js";
import { logger } from "../configs/logger.js";
import {
  User,
  Role,
  Permission,
  UserRole,
  RolePermission,
  UserPasswordHistory,
  AuditLog,
  SystemConfig,
  AppConfig,
  Driver,
  Vehicle,
  UserGroup,
  CompanyLicense,
  ResellerLicense,
  VehicleLicense,
  UserLicense,
  Geofence,
  Poi
} from "../models/index.js";
import { PERMISSIONS, ROLES } from "../utils/constants.js";
import {
  SEED_USERS,
  SEED_AUDIT_LOGS,
  SEED_SYSTEM_CONFIGS,
  SEED_APP_CONFIGS,
  SEED_DRIVERS,
  SEED_VEHICLES,
  SEED_USER_GROUPS,
  SEED_COMPANY_LICENSES,
  SEED_RESELLER_LICENSES,
  SEED_VEHICLE_LICENSES,
  SEED_USER_LICENSES,
  SEED_GEOFENCES,
  SEED_POIS
} from "./seedData.js";

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
      { code: PERMISSIONS.UPDATE_ROLE, action: "UPDATE", entity: "ROLE", description: "Update roles" },
      { code: PERMISSIONS.VIEW_AUDIT_LOG, action: "VIEW", entity: "AUDIT_LOG", description: "View system audit logs" },
      { code: PERMISSIONS.VIEW_SYSTEM_CONFIG, action: "VIEW", entity: "SYSTEM_CONFIG", description: "View system configuration modules" },
      { code: PERMISSIONS.MANAGE_SYSTEM_CONFIG, action: "MANAGE", entity: "SYSTEM_CONFIG", description: "Create and update system configurations" },
      { code: PERMISSIONS.VIEW_APP_CONFIG, action: "VIEW", entity: "APP_CONFIG", description: "View app configuration modules" },
      { code: PERMISSIONS.MANAGE_APP_CONFIG, action: "MANAGE", entity: "APP_CONFIG", description: "Create and update app configurations" },
      { code: PERMISSIONS.VIEW_MAINTENANCE, action: "VIEW", entity: "MAINTENANCE", description: "View vehicle maintenance reminders and schedules" },
      { code: PERMISSIONS.MANAGE_MAINTENANCE, action: "MANAGE", entity: "MAINTENANCE", description: "Create, update, and manage maintenance reminders" },
      { code: PERMISSIONS.VIEW_EXPENSE, action: "VIEW", entity: "EXPENSE", description: "View vehicle expenses and operating costs" },
      { code: PERMISSIONS.MANAGE_EXPENSE, action: "MANAGE", entity: "EXPENSE", description: "Record and manage vehicle operating expenses" },
      { code: PERMISSIONS.VIEW_ALERT, action: "VIEW", entity: "ALERT", description: "View vehicle alerts and triggered incidents" },
      { code: PERMISSIONS.MANAGE_ALERT, action: "MANAGE", entity: "ALERT", description: "Configure alert rules and acknowledge incident events" },
      { code: PERMISSIONS.VIEW_DISPATCH, action: "VIEW", entity: "DISPATCH", description: "View routes, allocations, crew rosters, and immobilizer logs" },
      { code: PERMISSIONS.MANAGE_DISPATCH, action: "MANAGE", entity: "DISPATCH", description: "Create and manage corridors, allocations, crew, and commands" },
      { code: PERMISSIONS.VIEW_COMPLIANCE, action: "VIEW", entity: "COMPLIANCE", description: "View statutory and regulatory compliance reminders" },
      { code: PERMISSIONS.MANAGE_COMPLIANCE, action: "MANAGE", entity: "COMPLIANCE", description: "Create and update statutory compliance reminders" }
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
      { name: ROLES.FLEET_MANAGER, description: "Operational lead managing vehicles, routes, and telematics" },
      { name: ROLES.BRANCH_OPERATOR, description: "Branch dispatcher managing regional operations and trips" },
      { name: ROLES.OPERATIONS_LEAD, description: "Supervises fleet health, incidents, and daily compliance" },
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

    const rolePermAssignments: Record<string, string[]> = {
      [ROLES.ADMIN]: [
        PERMISSIONS.VIEW_USER,
        PERMISSIONS.CREATE_USER,
        PERMISSIONS.UPDATE_USER,
        PERMISSIONS.DELETE_USER,
        PERMISSIONS.VIEW_ROLE,
        PERMISSIONS.VIEW_AUDIT_LOG,
        PERMISSIONS.VIEW_SYSTEM_CONFIG,
        PERMISSIONS.MANAGE_SYSTEM_CONFIG,
        PERMISSIONS.VIEW_APP_CONFIG,
        PERMISSIONS.MANAGE_APP_CONFIG,
        PERMISSIONS.VIEW_MAINTENANCE,
        PERMISSIONS.MANAGE_MAINTENANCE,
        PERMISSIONS.VIEW_EXPENSE,
        PERMISSIONS.MANAGE_EXPENSE,
        PERMISSIONS.VIEW_ALERT,
        PERMISSIONS.MANAGE_ALERT,
        PERMISSIONS.VIEW_DISPATCH,
        PERMISSIONS.MANAGE_DISPATCH,
        PERMISSIONS.VIEW_COMPLIANCE,
        PERMISSIONS.MANAGE_COMPLIANCE
      ],
      [ROLES.FLEET_MANAGER]: [
        PERMISSIONS.VIEW_USER,
        PERMISSIONS.VIEW_AUDIT_LOG,
        PERMISSIONS.VIEW_SYSTEM_CONFIG,
        PERMISSIONS.MANAGE_SYSTEM_CONFIG,
        PERMISSIONS.VIEW_APP_CONFIG,
        PERMISSIONS.MANAGE_APP_CONFIG,
        PERMISSIONS.VIEW_MAINTENANCE,
        PERMISSIONS.MANAGE_MAINTENANCE,
        PERMISSIONS.VIEW_EXPENSE,
        PERMISSIONS.MANAGE_EXPENSE,
        PERMISSIONS.VIEW_ALERT,
        PERMISSIONS.MANAGE_ALERT,
        PERMISSIONS.VIEW_DISPATCH,
        PERMISSIONS.MANAGE_DISPATCH,
        PERMISSIONS.VIEW_COMPLIANCE,
        PERMISSIONS.MANAGE_COMPLIANCE
      ],
      [ROLES.BRANCH_OPERATOR]: [
        PERMISSIONS.VIEW_USER,
        PERMISSIONS.VIEW_AUDIT_LOG,
        PERMISSIONS.VIEW_SYSTEM_CONFIG,
        PERMISSIONS.VIEW_APP_CONFIG,
        PERMISSIONS.MANAGE_APP_CONFIG,
        PERMISSIONS.VIEW_MAINTENANCE,
        PERMISSIONS.VIEW_EXPENSE,
        PERMISSIONS.VIEW_ALERT,
        PERMISSIONS.MANAGE_ALERT,
        PERMISSIONS.VIEW_DISPATCH,
        PERMISSIONS.MANAGE_DISPATCH,
        PERMISSIONS.VIEW_COMPLIANCE
      ],
      [ROLES.OPERATIONS_LEAD]: [
        PERMISSIONS.VIEW_USER,
        PERMISSIONS.VIEW_AUDIT_LOG,
        PERMISSIONS.VIEW_SYSTEM_CONFIG,
        PERMISSIONS.VIEW_APP_CONFIG,
        PERMISSIONS.MANAGE_APP_CONFIG,
        PERMISSIONS.VIEW_MAINTENANCE,
        PERMISSIONS.VIEW_EXPENSE,
        PERMISSIONS.VIEW_ALERT,
        PERMISSIONS.MANAGE_ALERT,
        PERMISSIONS.VIEW_DISPATCH,
        PERMISSIONS.MANAGE_DISPATCH,
        PERMISSIONS.VIEW_COMPLIANCE,
        PERMISSIONS.MANAGE_COMPLIANCE
      ],
      [ROLES.USER]: [
        PERMISSIONS.VIEW_USER,
        PERMISSIONS.VIEW_SYSTEM_CONFIG,
        PERMISSIONS.VIEW_APP_CONFIG,
        PERMISSIONS.VIEW_ALERT
      ]
    };

    for (const [roleName, permCodes] of Object.entries(rolePermAssignments)) {
      const role = rolesMap.get(roleName);
      if (!role) continue;
      for (const code of permCodes) {
        const perm = permissionsMap.get(code);
        if (perm) {
          await RolePermission.findOrCreate({
            where: { roleId: role.id, permissionId: perm.id },
            transaction
          });
        }
      }
    }
    logger.info("Role permissions linked.");

    // 4. Seed Users
    for (const seedUser of SEED_USERS) {
      const existing = await User.findOne({ where: { email: seedUser.email }, transaction });
      const targetRole = rolesMap.get(seedUser.role) || rolesMap.get(ROLES.USER)!;

      if (!existing) {
        const passwordHash = await bcrypt.hash(seedUser.password, BCRYPT_ROUNDS);
        const user = await User.create(
          {
            email: seedUser.email,
            passwordHash,
            firstName: seedUser.firstName,
            lastName: seedUser.lastName,
            isActive: seedUser.isActive,
            passwordChangedAt: new Date()
          },
          { transaction }
        );

        await UserRole.create(
          { userId: user.id, roleId: targetRole.id },
          { transaction }
        );

        await UserPasswordHistory.create(
          { userId: user.id, passwordHash },
          { transaction }
        );
        logger.info(`User created: ${seedUser.email} (${seedUser.role})`);
      } else {
        // Ensure user has their role mapped
        await UserRole.findOrCreate({
          where: { userId: existing.id, roleId: targetRole.id },
          transaction
        });
      }
    }
    logger.info("Users seeded.");

    // 5. Seed Audit Logs
    for (const log of SEED_AUDIT_LOGS) {
      const existing = await AuditLog.findOne({
        where: { details: log.details, action: log.action },
        transaction
      });
      if (!existing) {
        await AuditLog.create(log, { transaction });
      }
    }
    logger.info(`Audit logs seeded (${SEED_AUDIT_LOGS.length} records).`);

    // 6. Seed System Configs
    for (const configItem of SEED_SYSTEM_CONFIGS) {
      // Uniqueness check: module_key + name / code / providerName / featureName
      const identifier =
        configItem.data.code ||
        configItem.data.name ||
        configItem.data.providerName ||
        configItem.data.featureName ||
        configItem.data.planName ||
        configItem.data.modelCode ||
        configItem.data.typeName ||
        configItem.data.modelName ||
        configItem.data.alertName ||
        configItem.data.groupId ||
        configItem.data.profileName ||
        configItem.data.moduleName ||
        configItem.data.customizationName;

      const existing = await SystemConfig.findOne({
        where: {
          moduleKey: configItem.moduleKey,
          data: { [sequelize.fn("jsonb_extract_path_text", sequelize.col("data"), "name") as any]: identifier }
        },
        transaction
      }).catch(() => null);

      if (!existing) {
        // Find by checking moduleKey items count or create directly
        const count = await SystemConfig.count({
          where: { moduleKey: configItem.moduleKey },
          transaction
        });
        if (count < 10) {
          await SystemConfig.create(
            {
              moduleKey: configItem.moduleKey,
              data: configItem.data,
              isActive: configItem.isActive ?? true
            },
            { transaction }
          );
        }
      }
    }
    logger.info(`System configs seeded (${SEED_SYSTEM_CONFIGS.length} items).`);

    // 7. Seed App Configs
    for (const configItem of SEED_APP_CONFIGS) {
      const count = await AppConfig.count({
        where: { moduleKey: configItem.moduleKey },
        transaction
      });
      if (count < 10) {
        await AppConfig.create(
          {
            moduleKey: configItem.moduleKey,
            data: configItem.data,
            isActive: configItem.isActive ?? true
          },
          { transaction }
        );
      }
    }
    logger.info(`App configs seeded (${SEED_APP_CONFIGS.length} items).`);

    // 8. Seed Drivers
    for (const driver of SEED_DRIVERS) {
      await Driver.findOrCreate({
        where: { licenseNumber: driver.licenseNumber },
        defaults: driver,
        transaction
      });
    }
    logger.info(`Drivers seeded (${SEED_DRIVERS.length} records).`);

    // 9. Seed Vehicles
    for (const vehicle of SEED_VEHICLES) {
      await Vehicle.findOrCreate({
        where: { plateNumber: vehicle.plateNumber },
        defaults: vehicle as any,
        transaction
      });
    }
    logger.info(`Vehicles seeded (${SEED_VEHICLES.length} records).`);

    // 10. Seed User Groups
    for (const group of SEED_USER_GROUPS) {
      await UserGroup.findOrCreate({
        where: { name: group.name, company: group.company },
        defaults: group as any,
        transaction
      });
    }
    logger.info(`User groups seeded (${SEED_USER_GROUPS.length} records).`);

    // 11. Seed Company Licenses
    for (const compLic of SEED_COMPANY_LICENSES) {
      await CompanyLicense.findOrCreate({
        where: { licenseNumber: compLic.licenseNumber },
        defaults: compLic as any,
        transaction
      });
    }
    logger.info(`Company licenses seeded (${SEED_COMPANY_LICENSES.length} records).`);

    // 12. Seed Reseller Licenses
    for (const resLic of SEED_RESELLER_LICENSES) {
      await ResellerLicense.findOrCreate({
        where: { licenseNumber: resLic.licenseNumber },
        defaults: resLic as any,
        transaction
      });
    }
    logger.info(`Reseller licenses seeded (${SEED_RESELLER_LICENSES.length} records).`);

    // 13. Seed Vehicle Licenses
    for (const vehLic of SEED_VEHICLE_LICENSES) {
      await VehicleLicense.findOrCreate({
        where: { licenseNumber: vehLic.licenseNumber },
        defaults: vehLic as any,
        transaction
      });
    }
    logger.info(`Vehicle licenses seeded (${SEED_VEHICLE_LICENSES.length} records).`);

    // 14. Seed User Licenses
    for (const userLic of SEED_USER_LICENSES) {
      await UserLicense.findOrCreate({
        where: { licenseNumber: userLic.licenseNumber },
        defaults: userLic as any,
        transaction
      });
    }
    logger.info(`User licenses seeded (${SEED_USER_LICENSES.length} records).`);

    // 15. Seed Geofences
    for (const geo of SEED_GEOFENCES) {
      await Geofence.findOrCreate({
        where: { name: geo.name },
        defaults: geo as any,
        transaction
      });
    }
    logger.info(`Geofences seeded (${SEED_GEOFENCES.length} records).`);

    // 16. Seed POIs
    for (const poiItem of SEED_POIS) {
      await Poi.findOrCreate({
        where: { geoCode: poiItem.geoCode },
        defaults: poiItem as any,
        transaction
      });
    }
    logger.info(`POIs seeded (${SEED_POIS.length} records).`);

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
