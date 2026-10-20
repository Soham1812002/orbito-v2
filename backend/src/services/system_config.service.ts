import { Op, WhereOptions } from "sequelize";
import { SystemConfig } from "../models/system_config.model.js";
import { User } from "../models/user.model.js";
import { AuditLog } from "../models/audit_log.model.js";
import { sequelize } from "../configs/database.js";
import { PaginationParams, buildPaginatedEnvelope } from "../utils/pagination.util.js";

export class SystemConfigService {
  static async getStats() {
    const totalUsers = await User.count();
    const activeUsers = await User.count({ where: { isActive: true } });
    const totalAuditLogs = await AuditLog.count();

    const moduleCounts = (await SystemConfig.findAll({
      attributes: [
        "moduleKey",
        [sequelize.fn("COUNT", sequelize.col("id")), "count"]
      ],
      group: ["moduleKey"],
      raw: true
    })) as unknown as { moduleKey: string; count: string }[];

    const counts: Record<string, number> = {
      users: totalUsers,
      "audit-log": totalAuditLogs
    };

    for (const row of moduleCounts) {
      counts[row.moduleKey] = parseInt(String(row.count), 10) || 0;
    }

    const totalConfigs = Object.entries(counts)
      .filter(([k]) => k !== "users" && k !== "audit-log")
      .reduce((sum, [, v]) => sum + v, 0);

    return {
      users: {
        total: totalUsers,
        active: activeUsers,
        inactive: totalUsers - activeUsers
      },
      auditLogs: {
        total: totalAuditLogs
      },
      totalConfigs,
      counts
    };
  }

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
      const { count, rows } = await SystemConfig.findAndCountAll({
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

    const rows = await SystemConfig.findAll({
      where,
      order: [["created_at", "DESC"]]
    });

    // Map rows to flattened objects
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

  static async getById(id: string) {
    const item = await SystemConfig.findByPk(id);
    if (!item) {
      const err: any = new Error("System configuration item not found");
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

  static async create(moduleKey: string, payload: Record<string, any>) {
    const { isActive, id, _id, moduleKey: _m, createdAt, updatedAt, deletedAt, ...restData } = payload;

    const record = await SystemConfig.create({
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

  static async update(id: string, payload: Record<string, any>) {
    const record = await SystemConfig.findByPk(id);
    if (!record) {
      const err: any = new Error("System configuration item not found");
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

  static async delete(id: string) {
    const record = await SystemConfig.findByPk(id);
    if (!record) {
      const err: any = new Error("System configuration item not found");
      err.status = 404;
      throw err;
    }

    await record.destroy();
    return { id };
  }
}
