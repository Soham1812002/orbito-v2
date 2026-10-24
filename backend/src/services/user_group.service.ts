import { Response } from "express";
import { Op, WhereOptions } from "sequelize";
import { UserGroup, User, sequelize } from "../models/index.js";
import { CreateUserGroupDto, UpdateUserGroupDto } from "../dtos/user_group.dto.js";
import { streamCsvResponse, ExportColumn } from "../utils/streamingExport.js";

export interface UserGroupFilterParams {
  page?: number;
  limit?: number;
  search?: string;
  company?: string;
}

export class UserGroupService {
  async listUserGroups(params: UserGroupFilterParams = {}) {
    const page = Math.max(1, Number(params.page) || 1);
    const limit = Math.min(100, Math.max(1, Number(params.limit) || 10));
    const offset = (page - 1) * limit;

    const where: WhereOptions = {};

    if (params.search) {
      const q = `%${params.search.trim()}%`;
      where[Op.or as any] = [
        { name: { [Op.iLike]: q } },
        { description: { [Op.iLike]: q } },
        { company: { [Op.iLike]: q } },
        { adminRole: { [Op.iLike]: q } }
      ];
    }

    if (params.company && params.company !== "ALL") {
      where.company = params.company;
    }

    const { count, rows } = await UserGroup.findAndCountAll({
      where,
      limit,
      offset,
      order: [["created_at", "DESC"]]
    });

    // Populate user counts dynamically
    const groupItems = await Promise.all(
      rows.map(async (grp) => {
        const userCount = await User.count({ where: { groupId: grp.id } });
        return {
          id: grp.id,
          _id: grp.id,
          name: grp.name,
          description: grp.description,
          company: grp.company,
          branch: grp.branch,
          reseller: grp.reseller,
          adminRole: grp.adminRole,
          allowExcelExport: grp.allowExcelExport,
          allowOperationalManage: grp.allowOperationalManage,
          isSystemAdmin: grp.isSystemAdmin,
          permissions: grp.permissions || [],
          isActive: grp.isActive,
          userCount,
          createdAt: grp.createdAt,
          updatedAt: grp.updatedAt
        };
      })
    );

    return {
      rows: groupItems,
      total: count,
      page,
      pageSize: limit,
      totalPages: Math.ceil(count / limit) || 1
    };
  }

  async getUserGroupById(id: string) {
    const group = await UserGroup.findByPk(id);
    if (!group) {
      const err: any = new Error(`User group ${id} not found`);
      err.status = 404;
      throw err;
    }
    const userCount = await User.count({ where: { groupId: group.id } });
    return {
      ...group.toJSON(),
      userCount
    };
  }

  async createUserGroup(dto: CreateUserGroupDto) {
    return await sequelize.transaction(async (t) => {
      const group = await UserGroup.create(
        {
          name: dto.name,
          description: dto.description || "",
          company: dto.company,
          branch: dto.branch || "Headquarters",
          reseller: dto.reseller || "Direct Enterprise",
          adminRole: dto.adminRole || "FLEET_MANAGER",
          allowExcelExport: dto.allowExcelExport ?? true,
          allowOperationalManage: dto.allowOperationalManage ?? false,
          isSystemAdmin: dto.isSystemAdmin ?? false,
          permissions: dto.permissions || [],
          isActive: dto.isActive ?? true
        },
        { transaction: t }
      );
      return { id: group.id };
    });
  }

  async updateUserGroup(id: string, dto: UpdateUserGroupDto) {
    return await sequelize.transaction(async (t) => {
      const group = await UserGroup.findByPk(id, { transaction: t });
      if (!group) {
        const err: any = new Error(`User group ${id} not found`);
        err.status = 404;
        throw err;
      }
      await group.update(dto, { transaction: t });
      return { id: group.id };
    });
  }

  async deleteUserGroup(id: string) {
    return await sequelize.transaction(async (t) => {
      const group = await UserGroup.findByPk(id, { transaction: t });
      if (!group) {
        const err: any = new Error(`User group ${id} not found`);
        err.status = 404;
        throw err;
      }
      await group.destroy({ transaction: t });
      return { id: group.id };
    });
  }

  async streamExport(res: Response, params: UserGroupFilterParams = {}) {
    const where: WhereOptions = {};
    if (params.search) {
      const q = `%${params.search.trim()}%`;
      where[Op.or as any] = [
        { name: { [Op.iLike]: q } },
        { description: { [Op.iLike]: q } },
        { company: { [Op.iLike]: q } },
        { adminRole: { [Op.iLike]: q } }
      ];
    }
    if (params.company && params.company !== "ALL") {
      where.company = params.company;
    }

    const columns: ExportColumn<UserGroup>[] = [
      { key: "name", label: "Group Name" },
      { key: "company", label: "Company" },
      { key: "branch", label: "Branch" },
      { key: "reseller", label: "Reseller" },
      { key: "adminRole", label: "Admin Role" },
      { key: "allowExcelExport", label: "Excel Export Allowed", format: (val: any) => (val ? "Yes" : "No") },
      { key: "allowOperationalManage", label: "Operational Control", format: (val: any) => (val ? "Yes" : "No") },
      { key: "isActive", label: "Status", format: (val: any) => (val ? "Active" : "Inactive") },
      { key: "description", label: "Description" }
    ];

    await streamCsvResponse(
      res,
      `user_groups_${new Date().toISOString().slice(0, 10)}.csv`,
      columns,
      async (batchSize: number, offset: number) => {
        return await UserGroup.findAll({
          where,
          limit: batchSize,
          offset,
          order: [["created_at", "DESC"]]
        });
      }
    );
  }
}

export const userGroupService = new UserGroupService();
