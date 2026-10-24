import { Op } from "sequelize";
import { sequelize, MaintenanceReminder } from "../models/index.js";
import { CreateMaintenanceReminderDto, UpdateMaintenanceReminderDto } from "../dtos/maintenance.dto.js";

export interface ReminderFilterParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
  company?: string;
  branch?: string;
  vehicle?: string;
}

export class MaintenanceService {
  async getReminders(params: ReminderFilterParams = {}) {
    const page = Math.max(1, Number(params.page) || 1);
    const limit = Math.min(100, Math.max(1, Number(params.limit) || 10));
    const offset = (page - 1) * limit;

    const where: any = {};

    if (params.search) {
      const searchRegex = `%${params.search.trim()}%`;
      where[Op.or] = [
        { vehiclePlate: { [Op.iLike]: searchRegex } },
        { reminderName: { [Op.iLike]: searchRegex } },
        { reminderType: { [Op.iLike]: searchRegex } },
        { companyName: { [Op.iLike]: searchRegex } }
      ];
    }

    if (params.status && params.status !== "all") {
      where.status = params.status;
    }

    if (params.company && params.company !== "all") {
      where.companyName = params.company;
    }

    if (params.branch && params.branch !== "all") {
      where.branchName = params.branch;
    }

    if (params.vehicle && params.vehicle !== "all") {
      where.vehiclePlate = params.vehicle;
    }

    const { rows, count } = await MaintenanceReminder.findAndCountAll({
      where,
      limit,
      offset,
      order: [["next_service_date", "ASC"]]
    });

    return {
      rows,
      totalCount: count,
      page,
      limit,
      totalPages: Math.ceil(count / limit)
    };
  }

  async getReminderById(id: string) {
    const reminder = await MaintenanceReminder.findByPk(id);
    if (!reminder) {
      throw new Error(`Maintenance reminder with ID ${id} not found`);
    }
    return reminder;
  }

  async createReminder(dto: CreateMaintenanceReminderDto) {
    return await sequelize.transaction(async (transaction) => {
      return await MaintenanceReminder.create(
        {
          companyName: dto.companyName,
          branchName: dto.branchName,
          vehicleId: dto.vehicleId,
          vehiclePlate: dto.vehiclePlate,
          vehicleGroup: dto.vehicleGroup || "All groups",
          reminderType: dto.reminderType,
          reminderName: dto.reminderName,
          description: dto.description || null,
          lastServiceDate: dto.lastServiceDate || null,
          lastMileage: dto.lastMileage ?? null,
          nextServiceDate: dto.nextServiceDate,
          nextMileage: dto.nextMileage,
          reminderTime: dto.reminderTime || "09:00 AM",
          repeatIntervalMonths: dto.repeatIntervalMonths ?? null,
          repeatIntervalKm: dto.repeatIntervalKm ?? null,
          notifyBeforeDays: dto.notifyBeforeDays ?? 7,
          notifyBeforeKm: dto.notifyBeforeKm ?? 500,
          notifyUser: dto.notifyUser || null,
          notifyEmail: dto.notifyEmail ?? true,
          notifySms: dto.notifySms ?? false,
          notifyApp: dto.notifyApp ?? true,
          status: dto.status || "Upcoming",
          isActive: dto.isActive ?? true
        },
        { transaction }
      );
    });
  }

  async updateReminder(id: string, dto: UpdateMaintenanceReminderDto) {
    return await sequelize.transaction(async (transaction) => {
      const reminder = await MaintenanceReminder.findByPk(id, { transaction });
      if (!reminder) {
        throw new Error(`Maintenance reminder with ID ${id} not found`);
      }

      await reminder.update(dto, { transaction });
      return reminder;
    });
  }

  async deleteReminder(id: string) {
    return await sequelize.transaction(async (transaction) => {
      const reminder = await MaintenanceReminder.findByPk(id, { transaction });
      if (!reminder) {
        throw new Error(`Maintenance reminder with ID ${id} not found`);
      }

      await reminder.destroy({ transaction });
      return { success: true, message: `Maintenance reminder ${id} deleted successfully` };
    });
  }

  async getReminderOverview(params: ReminderFilterParams = {}) {
    const listResult = await this.getReminders(params);
    return {
      ...listResult,
      summary: {
        totalConfigured: listResult.totalCount,
        reportType: "Excel-ready configuration report for recurring intervals and delivery channels"
      }
    };
  }
}

export const maintenanceService = new MaintenanceService();
