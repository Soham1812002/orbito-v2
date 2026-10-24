import { Op } from "sequelize";
import { sequelize, AlertRule, AlertLog, AuditLog } from "../models/index.js";
import { CreateAlertRuleDto, UpdateAlertRuleDto, CreateAlertLogDto } from "../dtos/alert.dto.js";

export interface AlertLogFilterParams {
  page?: number;
  limit?: number;
  search?: string;
  severity?: string;
  alertType?: string;
  status?: string;
  vehiclePlate?: string;
}

export interface AlertRuleFilterParams {
  page?: number;
  limit?: number;
  search?: string;
  alertType?: string;
  severity?: string;
  isActive?: boolean;
}

export class AlertService {
  // ─── INCIDENT LOGS ──────────────────────────────────────────────────────────

  async getAlertLogs(params: AlertLogFilterParams = {}) {
    const page = Math.max(1, Number(params.page) || 1);
    const limit = Math.min(100, Math.max(1, Number(params.limit) || 10));
    const offset = (page - 1) * limit;

    const where: any = {};

    if (params.search) {
      const searchRegex = `%${params.search.trim()}%`;
      where[Op.or] = [
        { plateNumber: { [Op.iLike]: searchRegex } },
        { alertName: { [Op.iLike]: searchRegex } },
        { alertType: { [Op.iLike]: searchRegex } },
        { address: { [Op.iLike]: searchRegex } },
        { companyName: { [Op.iLike]: searchRegex } }
      ];
    }

    if (params.severity && params.severity !== "all") {
      where.severity = params.severity;
    }

    if (params.alertType && params.alertType !== "all") {
      where.alertType = params.alertType;
    }

    if (params.status && params.status !== "all") {
      where.status = params.status;
    }

    if (params.vehiclePlate && params.vehiclePlate !== "all") {
      where.plateNumber = params.vehiclePlate;
    }

    const { rows, count } = await AlertLog.findAndCountAll({
      where,
      limit,
      offset,
      order: [["created_at", "DESC"]]
    });

    return {
      rows,
      totalCount: count,
      page,
      limit,
      totalPages: Math.ceil(count / limit)
    };
  }

  async getRecentAlertsFeed(limit: number = 10) {
    const safeLimit = Math.min(50, Math.max(1, limit));
    const logs = await AlertLog.findAll({
      limit: safeLimit,
      order: [["created_at", "DESC"]]
    });
    return logs;
  }

  async getAlertLogById(id: string) {
    const log = await AlertLog.findByPk(id);
    if (!log) {
      throw new Error(`Alert log with ID ${id} not found`);
    }
    return log;
  }

  async acknowledgeAlert(id: string, operatorUser: any, resolutionNotes?: string) {
    return await sequelize.transaction(async (transaction) => {
      const log = await AlertLog.findByPk(id, { transaction });
      if (!log) {
        throw new Error(`Alert log with ID ${id} not found`);
      }

      await log.update(
        {
          status: "acknowledged",
          acknowledgedBy: operatorUser?.name || "Fleet Operator",
          acknowledgedAt: new Date(),
          resolutionNotes: resolutionNotes || log.resolutionNotes
        },
        { transaction }
      );

      await AuditLog.create(
        {
          userName: operatorUser?.name || "System Admin",
          userRole: operatorUser?.role || "ADMIN",
          userInitials: "SA",
          action: "ACKNOWLEDGE_ALERT",
          module: "Alerts Module",
          ipAddress: "127.0.0.1",
          status: "SUCCESS",
          details: `Acknowledged alert ${id} for vehicle ${log.plateNumber}`
        },
        { transaction }
      );

      return log;
    });
  }

  async createAlertLog(dto: CreateAlertLogDto) {
    return await AlertLog.create(dto as any);
  }

  // ─── CONFIGURED RULES ───────────────────────────────────────────────────────

  async getAlertRules(params: AlertRuleFilterParams = {}) {
    const page = Math.max(1, Number(params.page) || 1);
    const limit = Math.min(100, Math.max(1, Number(params.limit) || 10));
    const offset = (page - 1) * limit;

    const where: any = {};

    if (params.search) {
      const searchRegex = `%${params.search.trim()}%`;
      where[Op.or] = [
        { name: { [Op.iLike]: searchRegex } },
        { alertType: { [Op.iLike]: searchRegex } }
      ];
    }

    if (params.alertType && params.alertType !== "all") {
      where.alertType = params.alertType;
    }

    if (params.severity && params.severity !== "all") {
      where.severity = params.severity;
    }

    if (typeof params.isActive === "boolean") {
      where.isActive = params.isActive;
    }

    const { rows, count } = await AlertRule.findAndCountAll({
      where,
      limit,
      offset,
      order: [["created_at", "DESC"]]
    });

    return {
      rows,
      totalCount: count,
      page,
      limit,
      totalPages: Math.ceil(count / limit)
    };
  }

  async getAlertRuleById(id: string) {
    const rule = await AlertRule.findByPk(id);
    if (!rule) {
      throw new Error(`Alert rule with ID ${id} not found`);
    }
    return rule;
  }

  async createAlertRule(dto: CreateAlertRuleDto, operatorUser?: any) {
    return await sequelize.transaction(async (transaction) => {
      const rule = await AlertRule.create(dto as any, { transaction });

      await AuditLog.create(
        {
          userName: operatorUser?.name || "System Admin",
          userRole: operatorUser?.role || "ADMIN",
          userInitials: "SA",
          action: "CREATE_ALERT_RULE",
          module: "Alerts Module",
          ipAddress: "127.0.0.1",
          status: "SUCCESS",
          details: `Created alert rule ${rule.name} (${rule.alertType})`
        },
        { transaction }
      );

      return rule;
    });
  }

  async updateAlertRule(id: string, dto: UpdateAlertRuleDto, operatorUser?: any) {
    return await sequelize.transaction(async (transaction) => {
      const rule = await AlertRule.findByPk(id, { transaction });
      if (!rule) {
        throw new Error(`Alert rule with ID ${id} not found`);
      }

      await rule.update(dto as any, { transaction });

      await AuditLog.create(
        {
          userName: operatorUser?.name || "System Admin",
          userRole: operatorUser?.role || "ADMIN",
          userInitials: "SA",
          action: "UPDATE_ALERT_RULE",
          module: "Alerts Module",
          ipAddress: "127.0.0.1",
          status: "SUCCESS",
          details: `Updated alert rule ${rule.id} (${rule.name})`
        },
        { transaction }
      );

      return rule;
    });
  }

  async toggleRuleActive(id: string, operatorUser?: any) {
    return await sequelize.transaction(async (transaction) => {
      const rule = await AlertRule.findByPk(id, { transaction });
      if (!rule) {
        throw new Error(`Alert rule with ID ${id} not found`);
      }

      await rule.update({ isActive: !rule.isActive }, { transaction });

      await AuditLog.create(
        {
          userName: operatorUser?.name || "System Admin",
          userRole: operatorUser?.role || "ADMIN",
          userInitials: "SA",
          action: "TOGGLE_ALERT_RULE",
          module: "Alerts Module",
          ipAddress: "127.0.0.1",
          status: "SUCCESS",
          details: `Toggled alert rule ${rule.id} status to ${rule.isActive}`
        },
        { transaction }
      );

      return rule;
    });
  }

  async deleteAlertRule(id: string, operatorUser?: any) {
    return await sequelize.transaction(async (transaction) => {
      const rule = await AlertRule.findByPk(id, { transaction });
      if (!rule) {
        throw new Error(`Alert rule with ID ${id} not found`);
      }

      await rule.destroy({ transaction });

      await AuditLog.create(
        {
          userName: operatorUser?.name || "System Admin",
          userRole: operatorUser?.role || "ADMIN",
          userInitials: "SA",
          action: "DELETE_ALERT_RULE",
          module: "Alerts Module",
          ipAddress: "127.0.0.1",
          status: "SUCCESS",
          details: `Deleted alert rule ${id}`
        },
        { transaction }
      );

      return { success: true, message: `Alert rule ${id} deleted successfully` };
    });
  }
}
