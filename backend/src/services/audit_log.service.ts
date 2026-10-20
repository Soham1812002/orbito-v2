import { Op, WhereOptions } from "sequelize";
import { AuditLog, AuditLogAttributes } from "../models/audit_log.model.js";
import { PaginationParams, buildPaginatedEnvelope } from "../utils/pagination.util.js";

export class AuditLogService {
  static async listAuditLogs(params: PaginationParams) {
    const where: WhereOptions = {};

    // Search filter across text columns
    if (params.search) {
      const searchTerm = `%${params.search}%`;
      where[Op.or as any] = [
        { userName: { [Op.iLike]: searchTerm } },
        { action: { [Op.iLike]: searchTerm } },
        { module: { [Op.iLike]: searchTerm } },
        { details: { [Op.iLike]: searchTerm } },
        { ipAddress: { [Op.iLike]: searchTerm } }
      ];
    }

    // Key-value filtering
    if (params.filters.status) {
      where.status = params.filters.status;
    }
    if (params.filters.module) {
      where.module = params.filters.module;
    }
    if (params.filters.userRole) {
      where.userRole = params.filters.userRole;
    }

    // Sorting
    let order: [string, string][] = [["timestamp", "DESC"]];
    if (params.sortBy) {
      const sortColumnMap: Record<string, string> = {
        timestamp: "timestamp",
        userName: "user_name",
        userRole: "user_role",
        action: "action",
        module: "module",
        status: "status",
        ipAddress: "ip_address",
        createdAt: "created_at"
      };
      const column = sortColumnMap[params.sortBy] || params.sortBy;
      order = [[column, params.sortDir]];
    }

    const { count, rows } = await AuditLog.findAndCountAll({
      where,
      limit: params.limit,
      offset: params.skip,
      order
    });

    const items = rows.map((log) => ({
      id: log.id,
      _id: log.id,
      timestamp: log.timestamp,
      userName: log.userName,
      userRole: log.userRole,
      userInitials: log.userInitials,
      action: log.action,
      module: log.module,
      ipAddress: log.ipAddress,
      status: log.status,
      details: log.details,
      createdAt: log.createdAt,
      updatedAt: log.updatedAt
    }));

    return buildPaginatedEnvelope(items, count, params.page, params.limit);
  }

  static async createLog(data: Omit<AuditLogAttributes, "id" | "createdAt" | "updatedAt">) {
    return AuditLog.create(data);
  }
}
