import { Op, WhereOptions } from "sequelize";
import { AppConfig } from "../models/app_config.model.js";
import { AuditLog } from "../models/audit_log.model.js";
import { sequelize } from "../configs/database.js";
import { PaginationParams, buildPaginatedEnvelope } from "../utils/pagination.util.js";

export class AppConfigService {
  /**
   * Aggregated metrics for the App Configuration Hub overview
   */
  static async getStats() {
    const moduleCounts = (await AppConfig.findAll({
      attributes: [
        "moduleKey",
        [sequelize.fn("COUNT", sequelize.col("id")), "count"]
      ],
      group: ["moduleKey"],
      raw: true
    })) as unknown as { moduleKey: string; count: string }[];

    const counts: Record<string, number> = {
      companies: 0,
      branches: 0,
      vehicles: 0,
      employees: 0,
      "sim-cards": 0,
      "gps-devices": 0,
      "master-data": 0,
      "company-rules": 0,
      "remove-entity": 0,
      "sms-allocation": 0,
      "added-devices": 0
    };

    for (const row of moduleCounts) {
      counts[row.moduleKey] = parseInt(String(row.count), 10) || 0;
    }

    return {
      companies: counts.companies || 0,
      branches: counts.branches || 0,
      vehicles: counts.vehicles || 0,
      devices: (counts["gps-devices"] || 0) + (counts["added-devices"] || 0),
      employees: counts.employees || 0,
      totalConfigs: Object.values(counts).reduce((sum, v) => sum + v, 0),
      counts
    };
  }

  /**
   * List configuration entities for a specific module with database-level search & pagination
   */
  static async listByModule(moduleKey: string, params?: Partial<PaginationParams>) {
    const where: any = { moduleKey };

    if (params?.filters?.isActive !== undefined) {
      where.isActive = params.filters.isActive === "true" || params.filters.isActive === true;
    }

    // High-performance PostgreSQL JSONB text search
    if (params?.search && params.search.trim().length > 0) {
      where[Op.and] = [
        sequelize.where(
          sequelize.cast(sequelize.col("data"), "text"),
          { [Op.iLike]: `%${params.search.trim()}%` }
        )
      ];
    }

    // Database-level pagination when page and limit are specified
    if (params?.page && params?.limit) {
      const { count, rows } = await AppConfig.findAndCountAll({
        where,
        order: [["created_at", "DESC"]],
        limit: params.limit,
        offset: (params.page - 1) * params.limit
      });

      const items = rows.map((r) => ({
        id: r.id,
        _id: r.id,
        moduleKey: r.moduleKey,
        ...r.data,
        isActive: r.isActive,
        createdAt: r.createdAt,
        updatedAt: r.updatedAt
      }));

      return buildPaginatedEnvelope(items, count, params.page, params.limit);
    }

    const rows = await AppConfig.findAll({
      where,
      order: [["created_at", "DESC"]]
    });

    const items = rows.map((r) => ({
      id: r.id,
      _id: r.id,
      moduleKey: r.moduleKey,
      ...r.data,
      isActive: r.isActive,
      createdAt: r.createdAt,
      updatedAt: r.updatedAt
    }));

    return {
      result: items,
      total: items.length
    };
  }

  /**
   * Retrieve a single configuration entity by UUID
   */
  static async getById(id: string) {
    const item = await AppConfig.findByPk(id);
    if (!item) {
      const err: any = new Error("App configuration item not found");
      err.status = 404;
      throw err;
    }

    return {
      id: item.id,
      _id: item.id,
      moduleKey: item.moduleKey,
      ...item.data,
      isActive: item.isActive,
      createdAt: item.createdAt,
      updatedAt: item.updatedAt
    };
  }

  /**
   * Create a new configuration entity in a module
   */
  static async create(moduleKey: string, payload: Record<string, any>) {
    const { isActive, id, _id, moduleKey: _m, createdAt, updatedAt, deletedAt, ...restData } = payload;

    const record = await AppConfig.create({
      moduleKey,
      data: restData,
      isActive: isActive !== undefined ? Boolean(isActive) : true
    });

    return {
      id: record.id,
      _id: record.id,
      moduleKey: record.moduleKey,
      ...record.data,
      isActive: record.isActive,
      createdAt: record.createdAt,
      updatedAt: record.updatedAt
    };
  }

  /**
   * Update an existing configuration entity
   */
  static async update(id: string, payload: Record<string, any>) {
    const record = await AppConfig.findByPk(id);
    if (!record) {
      const err: any = new Error("App configuration item not found");
      err.status = 404;
      throw err;
    }

    const { isActive, id: _idKey, _id, moduleKey, createdAt, updatedAt, deletedAt, ...restData } = payload;

    const mergedData = {
      ...record.data,
      ...restData
    };

    await record.update({
      data: mergedData,
      ...(isActive !== undefined ? { isActive: Boolean(isActive) } : {})
    });

    return {
      id: record.id,
      _id: record.id,
      moduleKey: record.moduleKey,
      ...record.data,
      isActive: record.isActive,
      createdAt: record.createdAt,
      updatedAt: record.updatedAt
    };
  }

  /**
   * Validate bottom-up hierarchical dependency before deletion
   * Company -> Branch -> Vehicle -> Device
   */
  private static async validateHierarchyDeletion(
    moduleKey: string,
    data: Record<string, any>,
    id: string
  ): Promise<void> {
    const normalizedKey = moduleKey.toLowerCase().trim();

    // 1. Company Deletion Guard: Block if active branches exist under this company
    if (normalizedKey === "companies" || normalizedKey === "company") {
      const companyName = data?.name || data?.companyName || "";
      const companyCode = data?.code || "";
      const targets = [id, companyName, companyCode].filter(Boolean);

      const branchCount = await AppConfig.count({
        where: {
          moduleKey: "branches",
          [Op.or]: targets.flatMap((t) => [
            sequelize.where(
              sequelize.fn("jsonb_extract_path_text", sequelize.col("data"), "companyId"),
              t
            ),
            sequelize.where(
              sequelize.fn("jsonb_extract_path_text", sequelize.col("data"), "company"),
              t
            ),
            sequelize.where(
              sequelize.fn("jsonb_extract_path_text", sequelize.col("data"), "companyName"),
              t
            ),
            sequelize.where(
              sequelize.cast(sequelize.col("data"), "text"),
              { [Op.iLike]: `%"companyId": "${t}"%` }
            ),
            sequelize.where(
              sequelize.cast(sequelize.col("data"), "text"),
              { [Op.iLike]: `%"companyId":"${t}"%` }
            )
          ])
        }
      });

      if (branchCount > 0) {
        const branchWord = branchCount === 1 ? "branch is" : "branches are";
        const err: any = new Error(
          `Cannot delete "${companyName || id}": ${branchCount} ${branchWord} still linked to this company. Please reassign or delete branches first.`
        );
        err.status = 409;
        throw err;
      }
    }

    // 2. Branch Deletion Guard: Block if active vehicles exist under this branch (scoped to owning company)
    if (normalizedKey === "branches" || normalizedKey === "branch") {
      const branchName = data?.name || data?.branchName || "";
      const branchCode = data?.code || "";
      const branchCompany = data?.companyId || data?.company || data?.companyName || "";
      const companyTargets = [branchCompany].filter(Boolean);
      const nameTargets = [branchName, branchCode].filter(Boolean);

      const branchUuidMatchConditions = [
        sequelize.where(
          sequelize.fn("jsonb_extract_path_text", sequelize.col("data"), "branchId"),
          id
        ),
        sequelize.where(
          sequelize.cast(sequelize.col("data"), "text"),
          { [Op.iLike]: `%"branchId": "${id}"%` }
        ),
        sequelize.where(
          sequelize.cast(sequelize.col("data"), "text"),
          { [Op.iLike]: `%"branchId":"${id}"%` }
        )
      ];

      const branchNameMatchConditions = nameTargets.flatMap((t) => [
        sequelize.where(
          sequelize.fn("jsonb_extract_path_text", sequelize.col("data"), "branchId"),
          t
        ),
        sequelize.where(
          sequelize.fn("jsonb_extract_path_text", sequelize.col("data"), "branch"),
          t
        ),
        sequelize.where(
          sequelize.fn("jsonb_extract_path_text", sequelize.col("data"), "branchName"),
          t
        )
      ]);

      const companyMatchConditions = companyTargets.flatMap((ct) => [
        sequelize.where(
          sequelize.fn("jsonb_extract_path_text", sequelize.col("data"), "companyId"),
          ct
        ),
        sequelize.where(
          sequelize.fn("jsonb_extract_path_text", sequelize.col("data"), "company"),
          ct
        ),
        sequelize.where(
          sequelize.fn("jsonb_extract_path_text", sequelize.col("data"), "companyName"),
          ct
        )
      ]);

      const branchVehicleOrConditions: any[] = [...branchUuidMatchConditions];

      if (branchNameMatchConditions.length > 0 && companyMatchConditions.length > 0) {
        branchVehicleOrConditions.push({
          [Op.and]: [
            { [Op.or]: branchNameMatchConditions },
            { [Op.or]: companyMatchConditions }
          ]
        });
      } else if (branchNameMatchConditions.length > 0) {
        branchVehicleOrConditions.push(...branchNameMatchConditions);
      }

      const vehicleCount = await AppConfig.count({
        where: {
          moduleKey: "vehicles",
          [Op.or]: branchVehicleOrConditions
        }
      });

      if (vehicleCount > 0) {
        const vehicleWord = vehicleCount === 1 ? "vehicle is" : "vehicles are";
        const err: any = new Error(
          `Cannot delete "${branchName || id}": ${vehicleCount} ${vehicleWord} still registered under this branch. Please reassign or remove vehicles first.`
        );
        err.status = 409;
        throw err;
      }
    }

    // 3. Vehicle Deletion Guard: Block if GPS device is mounted or bound in Added Devices
    if (normalizedKey === "vehicles" || normalizedKey === "vehicle") {
      const plateNumber = data?.plateNumber || data?.vehiclePlate || data?.regNo || "";
      const boundImei = data?.deviceImei || data?.gpsImei || data?.imei || "";

      if (
        boundImei &&
        String(boundImei).trim() !== "" &&
        String(boundImei).toLowerCase() !== "unassigned"
      ) {
        const err: any = new Error(
          `Cannot delete vehicle "${plateNumber || id}": GPS Device (IMEI: ${boundImei}) is currently mounted. Please unmount the device first.`
        );
        err.status = 409;
        throw err;
      }

      if (plateNumber || id) {
        const targets = [plateNumber, id].filter(Boolean);
        const bundleCount = await AppConfig.count({
          where: {
            moduleKey: "added-devices",
            [Op.or]: targets.flatMap((t) => [
              sequelize.where(
                sequelize.fn("jsonb_extract_path_text", sequelize.col("data"), "vehiclePlate"),
                t
              ),
              sequelize.where(
                sequelize.fn("jsonb_extract_path_text", sequelize.col("data"), "plateNumber"),
                t
              ),
              sequelize.where(
                sequelize.fn("jsonb_extract_path_text", sequelize.col("data"), "vehicleId"),
                t
              ),
              sequelize.where(
                sequelize.cast(sequelize.col("data"), "text"),
                { [Op.iLike]: `%"vehiclePlate": "${t}"%` }
              ),
              sequelize.where(
                sequelize.cast(sequelize.col("data"), "text"),
                { [Op.iLike]: `%"vehiclePlate":"${t}"%` }
              ),
              sequelize.where(
                sequelize.cast(sequelize.col("data"), "text"),
                { [Op.iLike]: `%"vehicleId": "${t}"%` }
              )
            ])
          }
        });

        if (bundleCount > 0) {
          const err: any = new Error(
            `Cannot delete vehicle "${plateNumber || id}": Telemetry GPS device is still attached in Added Devices. Please unlink or decommission the device first.`
          );
          err.status = 409;
          throw err;
        }
      }
    }
  }

  /**
   * Soft delete a configuration entity with hierarchical dependency enforcement
   * Supports optional atomic cascade deletion to clean entire branch/vehicle tree and free devices to inventory
   */
  static async delete(id: string, cascade: boolean = false) {
    const record = await AppConfig.findByPk(id);
    if (!record) {
      const err: any = new Error("App configuration item not found");
      err.status = 404;
      throw err;
    }

    if (!cascade) {
      // Validate Bottom-Up Hierarchy before deletion
      await this.validateHierarchyDeletion(record.moduleKey, record.data, record.id);
      await record.destroy();
      return { id, cascaded: false };
    }

    // Atomic Cascade Deletion across the hierarchy tree
    return await sequelize.transaction(async (transaction) => {
      const normalizedKey = record.moduleKey.toLowerCase().trim();
      let cascadedBranches = 0;
      let cascadedVehicles = 0;
      let unlinkedDevices = 0;

      if (normalizedKey === "companies" || normalizedKey === "company") {
        const companyName = record.data?.name || record.data?.companyName || "";
        const companyCode = record.data?.code || "";
        const targets = [id, companyName, companyCode].filter(Boolean);

        // 1. Find all branches linked to this company
        const branches = await AppConfig.findAll({
          where: {
            moduleKey: "branches",
            [Op.or]: targets.flatMap((t) => [
              sequelize.where(
                sequelize.fn("jsonb_extract_path_text", sequelize.col("data"), "companyId"),
                t
              ),
              sequelize.where(
                sequelize.fn("jsonb_extract_path_text", sequelize.col("data"), "company"),
                t
              ),
              sequelize.where(
                sequelize.fn("jsonb_extract_path_text", sequelize.col("data"), "companyName"),
                t
              ),
              sequelize.where(
                sequelize.cast(sequelize.col("data"), "text"),
                { [Op.iLike]: `%"companyId": "${t}"%` }
              )
            ])
          },
          transaction
        });

        const branchUuids = branches.map((b) => b.id).filter(Boolean);
        const branchNames = branches.flatMap((b) => [
          b.data?.name,
          b.data?.branchName,
          b.data?.code
        ]).filter(Boolean);

        const companyMatchConditions = targets.flatMap((t) => [
          sequelize.where(
            sequelize.fn("jsonb_extract_path_text", sequelize.col("data"), "companyId"),
            t
          ),
          sequelize.where(
            sequelize.fn("jsonb_extract_path_text", sequelize.col("data"), "company"),
            t
          ),
          sequelize.where(
            sequelize.fn("jsonb_extract_path_text", sequelize.col("data"), "companyName"),
            t
          ),
          sequelize.where(
            sequelize.cast(sequelize.col("data"), "text"),
            { [Op.iLike]: `%"companyId": "${t}"%` }
          ),
          sequelize.where(
            sequelize.cast(sequelize.col("data"), "text"),
            { [Op.iLike]: `%"companyId":"${t}"%` }
          )
        ]);

        const branchUuidMatchConditions = branchUuids.flatMap((uid) => [
          sequelize.where(
            sequelize.fn("jsonb_extract_path_text", sequelize.col("data"), "branchId"),
            uid
          ),
          sequelize.where(
            sequelize.cast(sequelize.col("data"), "text"),
            { [Op.iLike]: `%"branchId": "${uid}"%` }
          ),
          sequelize.where(
            sequelize.cast(sequelize.col("data"), "text"),
            { [Op.iLike]: `%"branchId":"${uid}"%` }
          )
        ]);

        const branchNameMatchConditions = branchNames.flatMap((bn) => [
          sequelize.where(
            sequelize.fn("jsonb_extract_path_text", sequelize.col("data"), "branchId"),
            bn
          ),
          sequelize.where(
            sequelize.fn("jsonb_extract_path_text", sequelize.col("data"), "branch"),
            bn
          ),
          sequelize.where(
            sequelize.fn("jsonb_extract_path_text", sequelize.col("data"), "branchName"),
            bn
          )
        ]);

        // Vehicle matching criteria strictly scoped to this company:
        // 1. Direct company match
        // 2. Stable branch UUID match (globally unique to this company's branches)
        // 3. Legacy branch name match scoped STRICTLY to this company (prevents cross-company deletion)
        const vehicleOrConditions: any[] = [
          ...companyMatchConditions,
          ...branchUuidMatchConditions
        ];

        if (branchNameMatchConditions.length > 0 && companyMatchConditions.length > 0) {
          vehicleOrConditions.push({
            [Op.and]: [
              { [Op.or]: branchNameMatchConditions },
              { [Op.or]: companyMatchConditions }
            ]
          });
        }

        // 2. Find all vehicles linked to these branches or this company
        const vehicles = await AppConfig.findAll({
          where: {
            moduleKey: "vehicles",
            [Op.or]: vehicleOrConditions
          },
          transaction
        });

        // 3. For each vehicle, unlink attached GPS devices in added-devices back to available stock
        for (const v of vehicles) {
          const plate = v.data?.plateNumber || v.data?.vehiclePlate || "";
          if (plate || v.id) {
            const addedDevices = await AppConfig.findAll({
              where: {
                moduleKey: "added-devices",
                [Op.or]: [
                  ...(plate ? [sequelize.where(sequelize.fn("jsonb_extract_path_text", sequelize.col("data"), "vehiclePlate"), plate)] : []),
                  sequelize.where(sequelize.fn("jsonb_extract_path_text", sequelize.col("data"), "vehicleId"), v.id)
                ]
              },
              transaction
            });

            for (const ad of addedDevices) {
              await ad.update({
                data: {
                  ...ad.data,
                  vehiclePlate: "Unassigned",
                  vehicleId: null,
                  status: "Available"
                }
              }, { transaction });
              unlinkedDevices++;
            }
          }
          await v.destroy({ transaction });
          cascadedVehicles++;
        }

        // 4. Archive branches
        for (const b of branches) {
          await b.destroy({ transaction });
          cascadedBranches++;
        }

        // 5. Archive company
        await record.destroy({ transaction });

        // 6. Audit Log
        await AuditLog.create({
          userName: "Fleet Admin",
          userRole: "ADMIN",
          userInitials: "FA",
          action: "CASCADE_DELETE_COMPANY",
          module: "App Config",
          ipAddress: "127.0.0.1",
          status: "SUCCESS",
          details: `Cascade deleted Company "${companyName}" with ${cascadedBranches} branches, ${cascadedVehicles} vehicles, and unlinked ${unlinkedDevices} devices to stock.`
        }, { transaction });

        return {
          id,
          cascaded: true,
          cascadedBranches,
          cascadedVehicles,
          unlinkedDevices
        };
      }

      if (normalizedKey === "branches" || normalizedKey === "branch") {
        const branchName = record.data?.name || record.data?.branchName || "";
        const branchCode = record.data?.code || "";
        const branchCompany = record.data?.companyId || record.data?.company || record.data?.companyName || "";
        const companyTargets = [branchCompany].filter(Boolean);
        const nameTargets = [branchName, branchCode].filter(Boolean);

        const branchUuidMatchConditions = [
          sequelize.where(
            sequelize.fn("jsonb_extract_path_text", sequelize.col("data"), "branchId"),
            record.id
          ),
          sequelize.where(
            sequelize.cast(sequelize.col("data"), "text"),
            { [Op.iLike]: `%"branchId": "${record.id}"%` }
          ),
          sequelize.where(
            sequelize.cast(sequelize.col("data"), "text"),
            { [Op.iLike]: `%"branchId":"${record.id}"%` }
          )
        ];

        const branchNameMatchConditions = nameTargets.flatMap((t) => [
          sequelize.where(
            sequelize.fn("jsonb_extract_path_text", sequelize.col("data"), "branchId"),
            t
          ),
          sequelize.where(
            sequelize.fn("jsonb_extract_path_text", sequelize.col("data"), "branch"),
            t
          ),
          sequelize.where(
            sequelize.fn("jsonb_extract_path_text", sequelize.col("data"), "branchName"),
            t
          )
        ]);

        const companyMatchConditions = companyTargets.flatMap((ct) => [
          sequelize.where(
            sequelize.fn("jsonb_extract_path_text", sequelize.col("data"), "companyId"),
            ct
          ),
          sequelize.where(
            sequelize.fn("jsonb_extract_path_text", sequelize.col("data"), "company"),
            ct
          ),
          sequelize.where(
            sequelize.fn("jsonb_extract_path_text", sequelize.col("data"), "companyName"),
            ct
          )
        ]);

        const branchVehicleOrConditions: any[] = [...branchUuidMatchConditions];

        if (branchNameMatchConditions.length > 0 && companyMatchConditions.length > 0) {
          branchVehicleOrConditions.push({
            [Op.and]: [
              { [Op.or]: branchNameMatchConditions },
              { [Op.or]: companyMatchConditions }
            ]
          });
        } else if (branchNameMatchConditions.length > 0) {
          branchVehicleOrConditions.push(...branchNameMatchConditions);
        }

        const vehicles = await AppConfig.findAll({
          where: {
            moduleKey: "vehicles",
            [Op.or]: branchVehicleOrConditions
          },
          transaction
        });

        for (const v of vehicles) {
          const plate = v.data?.plateNumber || v.data?.vehiclePlate || "";
          if (plate || v.id) {
            const addedDevices = await AppConfig.findAll({
              where: {
                moduleKey: "added-devices",
                [Op.or]: [
                  ...(plate ? [sequelize.where(sequelize.fn("jsonb_extract_path_text", sequelize.col("data"), "vehiclePlate"), plate)] : []),
                  sequelize.where(sequelize.fn("jsonb_extract_path_text", sequelize.col("data"), "vehicleId"), v.id)
                ]
              },
              transaction
            });

            for (const ad of addedDevices) {
              await ad.update({
                data: {
                  ...ad.data,
                  vehiclePlate: "Unassigned",
                  vehicleId: null,
                  status: "Available"
                }
              }, { transaction });
              unlinkedDevices++;
            }
          }
          await v.destroy({ transaction });
          cascadedVehicles++;
        }

        await record.destroy({ transaction });

        await AuditLog.create({
          userName: "Fleet Admin",
          userRole: "ADMIN",
          userInitials: "FA",
          action: "CASCADE_DELETE_BRANCH",
          module: "App Config",
          ipAddress: "127.0.0.1",
          status: "SUCCESS",
          details: `Cascade deleted Branch "${branchName}" with ${cascadedVehicles} vehicles, and unlinked ${unlinkedDevices} devices to stock.`
        }, { transaction });

        return {
          id,
          cascaded: true,
          cascadedVehicles,
          unlinkedDevices
        };
      }

      if (normalizedKey === "vehicles" || normalizedKey === "vehicle") {
        const plate = record.data?.plateNumber || record.data?.vehiclePlate || "";
        if (plate || id) {
          const addedDevices = await AppConfig.findAll({
            where: {
              moduleKey: "added-devices",
              [Op.or]: [
                ...(plate ? [sequelize.where(sequelize.fn("jsonb_extract_path_text", sequelize.col("data"), "vehiclePlate"), plate)] : []),
                sequelize.where(sequelize.fn("jsonb_extract_path_text", sequelize.col("data"), "vehicleId"), id)
              ]
            },
            transaction
          });

          for (const ad of addedDevices) {
            await ad.update({
              data: {
                ...ad.data,
                vehiclePlate: "Unassigned",
                vehicleId: null,
                status: "Available"
              }
            }, { transaction });
            unlinkedDevices++;
          }
        }

        await record.destroy({ transaction });

        await AuditLog.create({
          userName: "Fleet Admin",
          userRole: "ADMIN",
          userInitials: "FA",
          action: "CASCADE_DELETE_VEHICLE",
          module: "App Config",
          ipAddress: "127.0.0.1",
          status: "SUCCESS",
          details: `Deleted Vehicle "${plate || id}" and unlinked ${unlinkedDevices} GPS device(s) back to stock.`
        }, { transaction });

        return {
          id,
          cascaded: true,
          unlinkedDevices
        };
      }

      await record.destroy({ transaction });
      return { id, cascaded: false };
    });
  }

  /**
   * Bulk insert records inside a transaction (e.g. from XLS import)
   */
  static async bulkCreate(moduleKey: string, items: Record<string, any>[]) {
    return await sequelize.transaction(async (transaction) => {
      const recordsToCreate = items.map((item) => {
        const { isActive, id, _id, moduleKey: _m, createdAt, updatedAt, deletedAt, ...restData } = item;
        return {
          moduleKey,
          data: restData,
          isActive: isActive !== undefined ? Boolean(isActive) : true
        };
      });

      const created = await AppConfig.bulkCreate(recordsToCreate, { transaction });
      return {
        count: created.length,
        items: created.map((r) => ({ id: r.id, ...r.data }))
      };
    });
  }

  /**
   * Controlled entity decommission & safe archival
   */
  static async archiveDecommission(payload: {
    entityType: string;
    entityId: string;
    entityName?: string;
    reason: string;
    notes?: string;
    operatorName?: string;
  }) {
    // Validate Bottom-Up Hierarchy before decommission
    await this.validateHierarchyDeletion(
      payload.entityType,
      {
        name: payload.entityName,
        plateNumber: payload.entityId,
        vehiclePlate: payload.entityId
      },
      payload.entityId
    );

    return await sequelize.transaction(async (transaction) => {
      // 1. Log to remove-entity history
      const archiveRecord = await AppConfig.create(
        {
          moduleKey: "remove-entity",
          data: {
            entityType: payload.entityType,
            entityId: payload.entityId,
            entityName: payload.entityName || payload.entityId,
            reason: payload.reason,
            notes: payload.notes || "",
            decommissionedBy: payload.operatorName || "Fleet Admin",
            decommissionedAt: new Date().toISOString()
          },
          isActive: false
        },
        { transaction }
      );

      // 2. Log in AuditLog table
      await AuditLog.create(
        {
          userName: payload.operatorName || "Fleet Admin",
          userRole: "ADMIN",
          userInitials: "FA",
          action: "DECOMMISSION_ENTITY",
          module: "App Config",
          ipAddress: "127.0.0.1",
          status: "SUCCESS",
          details: `Decommissioned ${payload.entityType} (${payload.entityId}). Reason: ${payload.reason}`
        },
        { transaction }
      );

      return {
        success: true,
        archiveId: archiveRecord.id,
        entityId: payload.entityId
      };
    });
  }
}
