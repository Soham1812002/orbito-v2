import { Response } from "express";
import { Op, WhereOptions } from "sequelize";
import {
  CompanyLicense,
  UserLicense,
  VehicleLicense,
  ResellerLicense,
  sequelize
} from "../models/index.js";
import {
  CreateCompanyLicenseDto,
  UpdateCompanyLicenseDto,
  CreateUserLicenseDto,
  UpdateUserLicenseDto,
  CreateVehicleLicenseDto,
  UpdateVehicleLicenseDto,
  CreateResellerLicenseDto,
  UpdateResellerLicenseDto
} from "../dtos/licensing.dto.js";
import { streamCsvResponse, ExportColumn } from "../utils/streamingExport.js";

export interface LicenseFilterParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
}

export class LicensingService {
  async getStats() {
    const [companyLicensesCount, userLicensesCount, vehicleLicensesCount, resellerLicensesCount] =
      await Promise.all([
        CompanyLicense.count(),
        UserLicense.count(),
        VehicleLicense.count(),
        ResellerLicense.count()
      ]);
    const expiringSoonCount = await CompanyLicense.count({ where: { status: "EXPIRING_SOON" } });
    const expiredCount = await CompanyLicense.count({ where: { status: "EXPIRED" } });

    return {
      companyLicensesCount,
      userLicensesCount,
      vehicleLicensesCount,
      resellerLicensesCount,
      expiringSoonCount,
      expiredCount
    };
  }

  // ==========================================
  // 1. Company Licenses
  // ==========================================
  async listCompanyLicenses(params: LicenseFilterParams = {}) {
    const page = Math.max(1, Number(params.page) || 1);
    const limit = Math.min(100, Math.max(1, Number(params.limit) || 10));
    const offset = (page - 1) * limit;

    const where: WhereOptions = {};
    if (params.search) {
      const q = `%${params.search.trim()}%`;
      where[Op.or as any] = [
        { company: { [Op.iLike]: q } },
        { branch: { [Op.iLike]: q } },
        { licenseNumber: { [Op.iLike]: q } },
        { contactPerson: { [Op.iLike]: q } }
      ];
    }
    if (params.status && params.status !== "all") {
      where.status = params.status as any;
    }

    const { count, rows } = await CompanyLicense.findAndCountAll({
      where,
      limit,
      offset,
      order: [["created_at", "DESC"]]
    });

    return {
      rows,
      total: count,
      page,
      pageSize: limit,
      totalPages: Math.ceil(count / limit) || 1
    };
  }

  async getCompanyLicenseById(id: string) {
    const item = await CompanyLicense.findByPk(id);
    if (!item) {
      const err: any = new Error(`Company license ${id} not found`);
      err.status = 404;
      throw err;
    }
    return item;
  }

  async createCompanyLicense(dto: CreateCompanyLicenseDto) {
    return await sequelize.transaction(async (t) => {
      return await CompanyLicense.create(dto as any, { transaction: t });
    });
  }

  async updateCompanyLicense(id: string, dto: UpdateCompanyLicenseDto) {
    return await sequelize.transaction(async (t) => {
      const item = await CompanyLicense.findByPk(id, { transaction: t });
      if (!item) {
        const err: any = new Error(`Company license ${id} not found`);
        err.status = 404;
        throw err;
      }
      await item.update(dto, { transaction: t });
      return item;
    });
  }

  async deleteCompanyLicense(id: string) {
    return await sequelize.transaction(async (t) => {
      const item = await CompanyLicense.findByPk(id, { transaction: t });
      if (!item) {
        const err: any = new Error(`Company license ${id} not found`);
        err.status = 404;
        throw err;
      }
      await item.destroy({ transaction: t });
      return { success: true, message: `Company license ${id} deleted` };
    });
  }

  async streamExportCompanyLicenses(res: Response, params: LicenseFilterParams = {}) {
    const where: WhereOptions = {};
    if (params.search) {
      const q = `%${params.search.trim()}%`;
      where[Op.or as any] = [
        { company: { [Op.iLike]: q } },
        { branch: { [Op.iLike]: q } },
        { licenseNumber: { [Op.iLike]: q } }
      ];
    }
    if (params.status && params.status !== "all") {
      where.status = params.status as any;
    }

    const columns: ExportColumn<CompanyLicense>[] = [
      { key: "company", label: "Company" },
      { key: "branch", label: "Branch" },
      { key: "contactPerson", label: "Contact Person" },
      { key: "telephone", label: "Telephone" },
      { key: "licenseName", label: "License Name" },
      { key: "licenseNumber", label: "License Number" },
      { key: "issuingAuthority", label: "Issuing Authority" },
      { key: "addedVehicles", label: "Vehicles Count", format: (_: any, c: any) => `${c.addedVehicles} / ${c.maxVehicles}` },
      { key: "status", label: "Status" },
      { key: "expiryDate", label: "Expiry Date" }
    ];

    await streamCsvResponse(
      res,
      `company_licenses_${new Date().toISOString().slice(0, 10)}.csv`,
      columns,
      async (batchSize: number, offset: number) => {
        return await CompanyLicense.findAll({
          where,
          limit: batchSize,
          offset,
          order: [["created_at", "DESC"]]
        });
      }
    );
  }

  // ==========================================
  // 2. User Licenses
  // ==========================================
  async listUserLicenses(params: LicenseFilterParams = {}) {
    const page = Math.max(1, Number(params.page) || 1);
    const limit = Math.min(100, Math.max(1, Number(params.limit) || 10));
    const offset = (page - 1) * limit;

    const where: WhereOptions = {};
    if (params.search) {
      const q = `%${params.search.trim()}%`;
      where[Op.or as any] = [
        { user: { [Op.iLike]: q } },
        { userEmail: { [Op.iLike]: q } },
        { company: { [Op.iLike]: q } },
        { licenseNumber: { [Op.iLike]: q } }
      ];
    }
    if (params.status && params.status !== "all") {
      where.status = params.status as any;
    }

    const { count, rows } = await UserLicense.findAndCountAll({
      where,
      limit,
      offset,
      order: [["created_at", "DESC"]]
    });

    return {
      rows,
      total: count,
      page,
      pageSize: limit,
      totalPages: Math.ceil(count / limit) || 1
    };
  }

  async getUserLicenseById(id: string) {
    const item = await UserLicense.findByPk(id);
    if (!item) {
      const err: any = new Error(`User license ${id} not found`);
      err.status = 404;
      throw err;
    }
    return item;
  }

  async createUserLicense(dto: CreateUserLicenseDto) {
    return await sequelize.transaction(async (t) => {
      return await UserLicense.create(dto as any, { transaction: t });
    });
  }

  async updateUserLicense(id: string, dto: UpdateUserLicenseDto) {
    return await sequelize.transaction(async (t) => {
      const item = await UserLicense.findByPk(id, { transaction: t });
      if (!item) {
        const err: any = new Error(`User license ${id} not found`);
        err.status = 404;
        throw err;
      }
      await item.update(dto, { transaction: t });
      return item;
    });
  }

  async deleteUserLicense(id: string) {
    return await sequelize.transaction(async (t) => {
      const item = await UserLicense.findByPk(id, { transaction: t });
      if (!item) {
        const err: any = new Error(`User license ${id} not found`);
        err.status = 404;
        throw err;
      }
      await item.destroy({ transaction: t });
      return { success: true, message: `User license ${id} deleted` };
    });
  }

  async streamExportUserLicenses(res: Response, params: LicenseFilterParams = {}) {
    const where: WhereOptions = {};
    if (params.search) {
      const q = `%${params.search.trim()}%`;
      where[Op.or as any] = [
        { user: { [Op.iLike]: q } },
        { userEmail: { [Op.iLike]: q } },
        { company: { [Op.iLike]: q } },
        { licenseNumber: { [Op.iLike]: q } }
      ];
    }
    if (params.status && params.status !== "all") {
      where.status = params.status as any;
    }

    const columns: ExportColumn<UserLicense>[] = [
      { key: "user", label: "User Name" },
      { key: "userEmail", label: "Email Address" },
      { key: "userRole", label: "Role" },
      { key: "company", label: "Company" },
      { key: "licenseNumber", label: "License Number" },
      { key: "allocatedVehicles", label: "Allocated Vehicles" },
      { key: "paymentStatus", label: "Payment Status" },
      { key: "status", label: "Status" },
      { key: "expiryDate", label: "Expiry Date" }
    ];

    await streamCsvResponse(
      res,
      `user_licenses_${new Date().toISOString().slice(0, 10)}.csv`,
      columns,
      async (batchSize: number, offset: number) => {
        return await UserLicense.findAll({
          where,
          limit: batchSize,
          offset,
          order: [["created_at", "DESC"]]
        });
      }
    );
  }

  // ==========================================
  // 3. Vehicle Licenses
  // ==========================================
  async listVehicleLicenses(params: LicenseFilterParams = {}) {
    const page = Math.max(1, Number(params.page) || 1);
    const limit = Math.min(100, Math.max(1, Number(params.limit) || 10));
    const offset = (page - 1) * limit;

    const where: WhereOptions = {};
    if (params.search) {
      const q = `%${params.search.trim()}%`;
      where[Op.or as any] = [
        { vehicle: { [Op.iLike]: q } },
        { registrationNumber: { [Op.iLike]: q } },
        { imei: { [Op.iLike]: q } },
        { simNumber: { [Op.iLike]: q } },
        { company: { [Op.iLike]: q } }
      ];
    }
    if (params.status && params.status !== "all") {
      where.status = params.status as any;
    }

    const { count, rows } = await VehicleLicense.findAndCountAll({
      where,
      limit,
      offset,
      order: [["created_at", "DESC"]]
    });

    return {
      rows,
      total: count,
      page,
      pageSize: limit,
      totalPages: Math.ceil(count / limit) || 1
    };
  }

  async getVehicleLicenseById(id: string) {
    const item = await VehicleLicense.findByPk(id);
    if (!item) {
      const err: any = new Error(`Vehicle license ${id} not found`);
      err.status = 404;
      throw err;
    }
    return item;
  }

  async createVehicleLicense(dto: CreateVehicleLicenseDto) {
    return await sequelize.transaction(async (t) => {
      return await VehicleLicense.create(dto as any, { transaction: t });
    });
  }

  async updateVehicleLicense(id: string, dto: UpdateVehicleLicenseDto) {
    return await sequelize.transaction(async (t) => {
      const item = await VehicleLicense.findByPk(id, { transaction: t });
      if (!item) {
        const err: any = new Error(`Vehicle license ${id} not found`);
        err.status = 404;
        throw err;
      }
      await item.update(dto, { transaction: t });
      return item;
    });
  }

  async deleteVehicleLicense(id: string) {
    return await sequelize.transaction(async (t) => {
      const item = await VehicleLicense.findByPk(id, { transaction: t });
      if (!item) {
        const err: any = new Error(`Vehicle license ${id} not found`);
        err.status = 404;
        throw err;
      }
      await item.destroy({ transaction: t });
      return { success: true, message: `Vehicle license ${id} deleted` };
    });
  }

  async streamExportVehicleLicenses(res: Response, params: LicenseFilterParams = {}) {
    const where: WhereOptions = {};
    if (params.search) {
      const q = `%${params.search.trim()}%`;
      where[Op.or as any] = [
        { vehicle: { [Op.iLike]: q } },
        { registrationNumber: { [Op.iLike]: q } },
        { imei: { [Op.iLike]: q } },
        { company: { [Op.iLike]: q } }
      ];
    }
    if (params.status && params.status !== "all") {
      where.status = params.status as any;
    }

    const columns: ExportColumn<VehicleLicense>[] = [
      { key: "registrationNumber", label: "Vehicle Plate" },
      { key: "vehicle", label: "Vehicle Model" },
      { key: "imei", label: "Device IMEI" },
      { key: "simNumber", label: "SIM Number" },
      { key: "company", label: "Company" },
      { key: "licenseNumber", label: "License Number" },
      { key: "assignedUser", label: "Assigned User" },
      { key: "status", label: "Status" },
      { key: "expiryDate", label: "Expiry Date" }
    ];

    await streamCsvResponse(
      res,
      `vehicle_licenses_${new Date().toISOString().slice(0, 10)}.csv`,
      columns,
      async (batchSize: number, offset: number) => {
        return await VehicleLicense.findAll({
          where,
          limit: batchSize,
          offset,
          order: [["created_at", "DESC"]]
        });
      }
    );
  }

  // ==========================================
  // 4. Reseller Licenses
  // ==========================================
  async listResellerLicenses(params: LicenseFilterParams = {}) {
    const page = Math.max(1, Number(params.page) || 1);
    const limit = Math.min(100, Math.max(1, Number(params.limit) || 10));
    const offset = (page - 1) * limit;

    const where: WhereOptions = {};
    if (params.search) {
      const q = `%${params.search.trim()}%`;
      where[Op.or as any] = [
        { reseller: { [Op.iLike]: q } },
        { contactPerson: { [Op.iLike]: q } },
        { licenseNumber: { [Op.iLike]: q } },
        { telephone: { [Op.iLike]: q } }
      ];
    }
    if (params.status && params.status !== "all") {
      where.status = params.status as any;
    }

    const { count, rows } = await ResellerLicense.findAndCountAll({
      where,
      limit,
      offset,
      order: [["created_at", "DESC"]]
    });

    return {
      rows,
      total: count,
      page,
      pageSize: limit,
      totalPages: Math.ceil(count / limit) || 1
    };
  }

  async getResellerLicenseById(id: string) {
    const item = await ResellerLicense.findByPk(id);
    if (!item) {
      const err: any = new Error(`Reseller license ${id} not found`);
      err.status = 404;
      throw err;
    }
    return item;
  }

  async createResellerLicense(dto: CreateResellerLicenseDto) {
    return await sequelize.transaction(async (t) => {
      return await ResellerLicense.create(dto as any, { transaction: t });
    });
  }

  async updateResellerLicense(id: string, dto: UpdateResellerLicenseDto) {
    return await sequelize.transaction(async (t) => {
      const item = await ResellerLicense.findByPk(id, { transaction: t });
      if (!item) {
        const err: any = new Error(`Reseller license ${id} not found`);
        err.status = 404;
        throw err;
      }
      await item.update(dto, { transaction: t });
      return item;
    });
  }

  async deleteResellerLicense(id: string) {
    return await sequelize.transaction(async (t) => {
      const item = await ResellerLicense.findByPk(id, { transaction: t });
      if (!item) {
        const err: any = new Error(`Reseller license ${id} not found`);
        err.status = 404;
        throw err;
      }
      await item.destroy({ transaction: t });
      return { success: true, message: `Reseller license ${id} deleted` };
    });
  }

  async streamExportResellerLicenses(res: Response, params: LicenseFilterParams = {}) {
    const where: WhereOptions = {};
    if (params.search) {
      const q = `%${params.search.trim()}%`;
      where[Op.or as any] = [
        { reseller: { [Op.iLike]: q } },
        { contactPerson: { [Op.iLike]: q } },
        { licenseNumber: { [Op.iLike]: q } }
      ];
    }
    if (params.status && params.status !== "all") {
      where.status = params.status as any;
    }

    const columns: ExportColumn<ResellerLicense>[] = [
      { key: "reseller", label: "Partner Name" },
      { key: "contactPerson", label: "Contact Person" },
      { key: "telephone", label: "Telephone" },
      { key: "licenseNumber", label: "License Number" },
      { key: "licenseModel", label: "License Model" },
      { key: "allocatedClients", label: "Clients Allocated" },
      { key: "vehicleQuota", label: "Vehicle Quota", format: (_: any, r: any) => `${r.allocatedVehicles} / ${r.vehicleQuota}` },
      { key: "status", label: "Status" },
      { key: "expiryDate", label: "Expiry Date" }
    ];

    await streamCsvResponse(
      res,
      `reseller_licenses_${new Date().toISOString().slice(0, 10)}.csv`,
      columns,
      async (batchSize: number, offset: number) => {
        return await ResellerLicense.findAll({
          where,
          limit: batchSize,
          offset,
          order: [["created_at", "DESC"]]
        });
      }
    );
  }
}

export const licensingService = new LicensingService();
