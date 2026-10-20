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
   * Soft delete a configuration entity
   */
  static async delete(id: string) {
    const record = await AppConfig.findByPk(id);
    if (!record) {
      const err: any = new Error("App configuration item not found");
      err.status = 404;
      throw err;
    }

    await record.destroy();
    return { id };
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
