import { Op } from "sequelize";
import {
  sequelize,
  RoutePath,
  RoutePathAllocation,
  CrewAllocation,
  ImmobilizerAudit,
  ComplianceReminder,
  AuditLog
} from "../models/index.js";
import {
  CreateRoutePathDto,
  UpdateRoutePathDto,
  CreateRouteAllocationDto,
  UpdateRouteAllocationDto,
  CreateCrewAllocationDto,
  UpdateCrewAllocationDto,
  CreateImmobilizerAuditDto,
  CreateComplianceReminderDto,
  UpdateComplianceReminderDto
} from "../dtos/dispatch.dto.js";

async function recordAudit(action: string, details: string, user: any, transaction: any) {
  try {
    await AuditLog.create(
      {
        userName: user?.name || user?.username || "Operations Dispatcher",
        userRole: user?.role || "OPERATIONS_LEAD",
        userInitials: user?.name ? user.name.slice(0, 2).toUpperCase() : "OD",
        action,
        module: "Operations & Dispatch",
        ipAddress: "127.0.0.1",
        status: "SUCCESS",
        details
      },
      { transaction }
    );
  } catch (err) {
    // Non-blocking audit log failure
  }
}

export class DispatchService {
  // ==========================================
  // 1. ROUTE PATHS
  // ==========================================
  static async listRoutePaths(params: {
    page?: number;
    limit?: number;
    search?: string;
    isActive?: string;
  }) {
    const page = Number(params.page) || 1;
    const limit = Number(params.limit) || 20;
    const offset = (page - 1) * limit;

    const where: any = {};
    if (params.search) {
      where[Op.or] = [
        { routeCode: { [Op.iLike]: `%${params.search}%` } },
        { routeName: { [Op.iLike]: `%${params.search}%` } },
        { originName: { [Op.iLike]: `%${params.search}%` } },
        { destinationName: { [Op.iLike]: `%${params.search}%` } }
      ];
    }
    if (params.isActive !== undefined && params.isActive !== "all") {
      where.isActive = params.isActive === "true";
    }

    const { count, rows } = await RoutePath.findAndCountAll({
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

  static async getRoutePathById(id: string) {
    const record = await RoutePath.findByPk(id, {
      include: [{ model: RoutePathAllocation, as: "allocations" }]
    });
    if (!record) {
      throw new Error(`Route path with ID "${id}" not found`);
    }
    return record;
  }

  static async createRoutePath(dto: CreateRoutePathDto, user: any) {
    return await sequelize.transaction(async (t) => {
      const existing = await RoutePath.findOne({
        where: { routeCode: dto.routeCode },
        transaction: t
      });
      if (existing) {
        throw new Error(`Route code "${dto.routeCode}" is already in use`);
      }

      const created = await RoutePath.create(dto as any, { transaction: t });

      await recordAudit(
        "CREATE:ROUTE_PATH",
        `Created route corridor ${created.routeCode} (${created.routeName}) from ${created.originName} to ${created.destinationName}`,
        user,
        t
      );

      return created;
    });
  }

  static async updateRoutePath(id: string, dto: UpdateRoutePathDto, user: any) {
    return await sequelize.transaction(async (t) => {
      const record = await RoutePath.findByPk(id, { transaction: t });
      if (!record) {
        throw new Error(`Route path with ID "${id}" not found`);
      }

      await record.update(dto as any, { transaction: t });

      await recordAudit(
        "UPDATE:ROUTE_PATH",
        `Updated route corridor ${record.routeCode}: modified fields [${Object.keys(dto).join(", ")}]`,
        user,
        t
      );

      return record;
    });
  }

  static async deleteRoutePath(id: string, user: any) {
    return await sequelize.transaction(async (t) => {
      const record = await RoutePath.findByPk(id, { transaction: t });
      if (!record) {
        throw new Error(`Route path with ID "${id}" not found`);
      }

      await record.destroy({ transaction: t });

      await recordAudit(
        "DELETE:ROUTE_PATH",
        `Deleted route corridor ${record.routeCode} (${record.routeName})`,
        user,
        t
      );

      return { success: true };
    });
  }

  // ==========================================
  // 2. ROUTE PATH ALLOCATIONS
  // ==========================================
  static async listAllocations(params: {
    page?: number;
    limit?: number;
    search?: string;
    routePathId?: string;
    vehicleId?: string;
    scheduleType?: string;
  }) {
    const page = Number(params.page) || 1;
    const limit = Number(params.limit) || 20;
    const offset = (page - 1) * limit;

    const where: any = {};
    if (params.search) {
      where[Op.or] = [
        { allocationName: { [Op.iLike]: `%${params.search}%` } },
        { vehiclePlate: { [Op.iLike]: `%${params.search}%` } }
      ];
    }
    if (params.routePathId) where.routePathId = params.routePathId;
    if (params.vehicleId) where.vehicleId = params.vehicleId;
    if (params.scheduleType && params.scheduleType !== "all") where.scheduleType = params.scheduleType;

    const { count, rows } = await RoutePathAllocation.findAndCountAll({
      where,
      limit,
      offset,
      include: [{ model: RoutePath, as: "routePath" }],
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

  static async createAllocation(dto: CreateRouteAllocationDto, user: any) {
    return await sequelize.transaction(async (t) => {
      const route = await RoutePath.findByPk(dto.routePathId, { transaction: t });
      if (!route) {
        throw new Error(`Target route path with ID "${dto.routePathId}" does not exist`);
      }

      const created = await RoutePathAllocation.create(dto as any, { transaction: t });

      await recordAudit(
        "CREATE:ROUTE_ALLOCATION",
        `Allocated vehicle ${created.vehiclePlate} to route corridor ${route.routeCode} (${created.allocationName})`,
        user,
        t
      );

      return created;
    });
  }

  static async updateAllocation(id: string, dto: UpdateRouteAllocationDto, user: any) {
    return await sequelize.transaction(async (t) => {
      const record = await RoutePathAllocation.findByPk(id, { transaction: t });
      if (!record) {
        throw new Error(`Route allocation with ID "${id}" not found`);
      }

      await record.update(dto as any, { transaction: t });

      await recordAudit(
        "UPDATE:ROUTE_ALLOCATION",
        `Updated corridor allocation for vehicle ${record.vehiclePlate}: modified [${Object.keys(dto).join(", ")}]`,
        user,
        t
      );

      return record;
    });
  }

  static async deleteAllocation(id: string, user: any) {
    return await sequelize.transaction(async (t) => {
      const record = await RoutePathAllocation.findByPk(id, { transaction: t });
      if (!record) {
        throw new Error(`Route allocation with ID "${id}" not found`);
      }

      await record.destroy({ transaction: t });

      await recordAudit(
        "DELETE:ROUTE_ALLOCATION",
        `Removed corridor allocation for vehicle ${record.vehiclePlate}`,
        user,
        t
      );

      return { success: true };
    });
  }

  // ==========================================
  // 3. CREW ALLOCATIONS (Driver & Cleaner)
  // ==========================================
  static async listCrewAllocations(params: {
    page?: number;
    limit?: number;
    search?: string;
    shiftName?: string;
    dutyStatus?: string;
  }) {
    const page = Number(params.page) || 1;
    const limit = Number(params.limit) || 20;
    const offset = (page - 1) * limit;

    const where: any = {};
    if (params.search) {
      where[Op.or] = [
        { vehiclePlate: { [Op.iLike]: `%${params.search}%` } },
        { primaryDriverName: { [Op.iLike]: `%${params.search}%` } },
        { cleanerName: { [Op.iLike]: `%${params.search}%` } }
      ];
    }
    if (params.shiftName && params.shiftName !== "all") where.shiftName = params.shiftName;
    if (params.dutyStatus && params.dutyStatus !== "all") where.dutyStatus = params.dutyStatus;

    const { count, rows } = await CrewAllocation.findAndCountAll({
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

  static async createCrewAllocation(dto: CreateCrewAllocationDto, user: any) {
    return await sequelize.transaction(async (t) => {
      const created = await CrewAllocation.create(dto as any, { transaction: t });

      await recordAudit(
        "CREATE:CREW_ALLOCATION",
        `Assigned crew roster to vehicle ${created.vehiclePlate}: Driver ${created.primaryDriverName}${created.cleanerName ? `, Cleaner ${created.cleanerName}` : ""}`,
        user,
        t
      );

      return created;
    });
  }

  static async updateCrewAllocation(id: string, dto: UpdateCrewAllocationDto, user: any) {
    return await sequelize.transaction(async (t) => {
      const record = await CrewAllocation.findByPk(id, { transaction: t });
      if (!record) {
        throw new Error(`Crew allocation with ID "${id}" not found`);
      }

      await record.update(dto as any, { transaction: t });

      await recordAudit(
        "UPDATE:CREW_ALLOCATION",
        `Updated crew roster for vehicle ${record.vehiclePlate}: modified [${Object.keys(dto).join(", ")}]`,
        user,
        t
      );

      return record;
    });
  }

  static async deleteCrewAllocation(id: string, user: any) {
    return await sequelize.transaction(async (t) => {
      const record = await CrewAllocation.findByPk(id, { transaction: t });
      if (!record) {
        throw new Error(`Crew allocation with ID "${id}" not found`);
      }

      await record.destroy({ transaction: t });

      await recordAudit(
        "DELETE:CREW_ALLOCATION",
        `Removed crew roster assignment for vehicle ${record.vehiclePlate}`,
        user,
        t
      );

      return { success: true };
    });
  }

  // ==========================================
  // 4. IMMOBILIZER AUDIT LOG
  // ==========================================
  static async listImmobilizerAudits(params: {
    page?: number;
    limit?: number;
    search?: string;
    status?: string;
    command?: string;
  }) {
    const page = Number(params.page) || 1;
    const limit = Number(params.limit) || 20;
    const offset = (page - 1) * limit;

    const where: any = {};
    if (params.search) {
      where[Op.or] = [
        { vehiclePlate: { [Op.iLike]: `%${params.search}%` } },
        { operatorName: { [Op.iLike]: `%${params.search}%` } },
        { reason: { [Op.iLike]: `%${params.search}%` } }
      ];
    }
    if (params.status && params.status !== "all") where.status = params.status;
    if (params.command && params.command !== "all") where.command = params.command;

    const { count, rows } = await ImmobilizerAudit.findAndCountAll({
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

  static async logImmobilizerCommand(dto: CreateImmobilizerAuditDto, user: any) {
    return await sequelize.transaction(async (t) => {
      const record = await ImmobilizerAudit.create(
        {
          ...dto,
          operatorId: user?.id || dto.operatorId,
          operatorName: user?.username || dto.operatorName
        } as any,
        { transaction: t }
      );

      await recordAudit(
        "EXECUTE:IMMOBILIZER_COMMAND",
        `Executed ${record.command} on vehicle ${record.vehiclePlate} (${record.status}). Reason: ${record.reason}`,
        user,
        t
      );

      return record;
    });
  }

  // ==========================================
  // 5. COMPLIANCE & STATUTORY REMINDERS
  // ==========================================
  static async listComplianceReminders(params: {
    page?: number;
    limit?: number;
    search?: string;
    entityType?: string;
    category?: string;
    status?: string;
  }) {
    const page = Number(params.page) || 1;
    const limit = Number(params.limit) || 20;
    const offset = (page - 1) * limit;

    const where: any = {};
    if (params.search) {
      where[Op.or] = [
        { entityIdentifier: { [Op.iLike]: `%${params.search}%` } },
        { documentNumber: { [Op.iLike]: `%${params.search}%` } },
        { reminderCategory: { [Op.iLike]: `%${params.search}%` } }
      ];
    }
    if (params.entityType && params.entityType !== "all") where.entityType = params.entityType;
    if (params.category && params.category !== "all") where.reminderCategory = params.category;
    if (params.status && params.status !== "all") where.status = params.status;

    const { count, rows } = await ComplianceReminder.findAndCountAll({
      where,
      limit,
      offset,
      order: [["expiry_date", "ASC"]]
    });

    return {
      rows,
      totalCount: count,
      page,
      limit,
      totalPages: Math.ceil(count / limit)
    };
  }

  static async createComplianceReminder(dto: CreateComplianceReminderDto, user: any) {
    return await sequelize.transaction(async (t) => {
      const created = await ComplianceReminder.create(dto as any, { transaction: t });

      await recordAudit(
        "CREATE:COMPLIANCE_REMINDER",
        `Created statutory compliance reminder for ${created.entityIdentifier} (${created.reminderCategory}) expiring on ${created.expiryDate}`,
        user,
        t
      );

      return created;
    });
  }

  static async updateComplianceReminder(id: string, dto: UpdateComplianceReminderDto, user: any) {
    return await sequelize.transaction(async (t) => {
      const record = await ComplianceReminder.findByPk(id, { transaction: t });
      if (!record) {
        throw new Error(`Compliance reminder with ID "${id}" not found`);
      }

      await record.update(dto as any, { transaction: t });

      await recordAudit(
        "UPDATE:COMPLIANCE_REMINDER",
        `Updated statutory compliance reminder for ${record.entityIdentifier}: modified [${Object.keys(dto).join(", ")}]`,
        user,
        t
      );

      return record;
    });
  }

  static async deleteComplianceReminder(id: string, user: any) {
    return await sequelize.transaction(async (t) => {
      const record = await ComplianceReminder.findByPk(id, { transaction: t });
      if (!record) {
        throw new Error(`Compliance reminder with ID "${id}" not found`);
      }

      await record.destroy({ transaction: t });

      await recordAudit(
        "DELETE:COMPLIANCE_REMINDER",
        `Removed statutory compliance reminder for ${record.entityIdentifier} (${record.reminderCategory})`,
        user,
        t
      );

      return { success: true };
    });
  }
}
