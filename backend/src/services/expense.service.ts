import { Op } from "sequelize";
import { sequelize, VehicleExpense } from "../models/index.js";
import { CreateVehicleExpenseDto, UpdateVehicleExpenseDto } from "../dtos/expense.dto.js";

export interface ExpenseFilterParams {
  page?: number;
  limit?: number;
  search?: string;
  expenseType?: string;
  company?: string;
  branch?: string;
  vehicle?: string;
}

export class ExpenseService {
  async getExpenses(params: ExpenseFilterParams = {}) {
    const page = Math.max(1, Number(params.page) || 1);
    const limit = Math.min(100, Math.max(1, Number(params.limit) || 10));
    const offset = (page - 1) * limit;

    const where: any = {};

    if (params.search) {
      const searchRegex = `%${params.search.trim()}%`;
      where[Op.or] = [
        { vehiclePlate: { [Op.iLike]: searchRegex } },
        { companyName: { [Op.iLike]: searchRegex } },
        { driverName: { [Op.iLike]: searchRegex } },
        { invoiceNumber: { [Op.iLike]: searchRegex } },
        { maintenanceType: { [Op.iLike]: searchRegex } }
      ];
    }

    if (params.expenseType && params.expenseType !== "all") {
      where.expenseType = params.expenseType;
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

    const { rows, count } = await VehicleExpense.findAndCountAll({
      where,
      limit,
      offset,
      order: [["expense_date", "DESC"]]
    });

    return {
      rows,
      totalCount: count,
      page,
      limit,
      totalPages: Math.ceil(count / limit)
    };
  }

  async getExpenseById(id: string) {
    const expense = await VehicleExpense.findByPk(id);
    if (!expense) {
      throw new Error(`Expense with ID ${id} not found`);
    }
    return expense;
  }

  async createExpense(dto: CreateVehicleExpenseDto) {
    return await sequelize.transaction(async (transaction) => {
      return await VehicleExpense.create(
        {
          companyName: dto.companyName,
          branchName: dto.branchName,
          vehicleId: dto.vehicleId,
          vehiclePlate: dto.vehiclePlate,
          driverName: dto.driverName || null,
          expenseType: dto.expenseType,
          maintenanceType: dto.maintenanceType || null,
          expenseDate: dto.expenseDate,
          fuelType: dto.fuelType || null,
          fuelStation: dto.fuelStation || null,
          fuelQuantity: dto.fuelQuantity ?? null,
          fuelRate: dto.fuelRate ?? null,
          expenseAmount: dto.expenseAmount,
          odometer: dto.odometer,
          paymentMode: dto.paymentMode,
          invoiceNumber: dto.invoiceNumber || null,
          description: dto.description || null,
          receiptUrl: dto.receiptUrl || null,
          isReimbursable: dto.isReimbursable ?? true,
          attachReceiptLater: dto.attachReceiptLater ?? false
        },
        { transaction }
      );
    });
  }

  async updateExpense(id: string, dto: UpdateVehicleExpenseDto) {
    return await sequelize.transaction(async (transaction) => {
      const expense = await VehicleExpense.findByPk(id, { transaction });
      if (!expense) {
        throw new Error(`Expense with ID ${id} not found`);
      }

      await expense.update(dto, { transaction });
      return expense;
    });
  }

  async deleteExpense(id: string) {
    return await sequelize.transaction(async (transaction) => {
      const expense = await VehicleExpense.findByPk(id, { transaction });
      if (!expense) {
        throw new Error(`Expense with ID ${id} not found`);
      }

      await expense.destroy({ transaction });
      return { success: true, message: `Expense record ${id} deleted successfully` };
    });
  }

  async getExpenseHistory(params: ExpenseFilterParams = {}) {
    const listResult = await this.getExpenses(params);

    // Group expenses by vehicle for the aggregate overview
    const vehicleMap = new Map<string, {
      company: string;
      branch: string;
      vehicle: string;
      fuelExpense: number;
      maintenanceExpense: number;
      totalExpense: number;
      distance: number;
    }>();

    for (const exp of listResult.rows) {
      const key = exp.vehiclePlate;
      const current = vehicleMap.get(key) || {
        company: exp.companyName,
        branch: exp.branchName,
        vehicle: exp.vehiclePlate,
        fuelExpense: 0,
        maintenanceExpense: 0,
        totalExpense: 0,
        distance: Math.round(Number(exp.odometer) % 10000 + 2000)
      };

      const amt = Number(exp.expenseAmount) || 0;
      if (exp.expenseType.toLowerCase() === "fuel") {
        current.fuelExpense += amt;
      } else if (exp.expenseType.toLowerCase() === "maintenance") {
        current.maintenanceExpense += amt;
      }
      current.totalExpense += amt;

      vehicleMap.set(key, current);
    }

    return {
      rows: Array.from(vehicleMap.values()),
      totalRecords: vehicleMap.size,
      page: listResult.page,
      limit: listResult.limit
    };
  }
}

export const expenseService = new ExpenseService();
