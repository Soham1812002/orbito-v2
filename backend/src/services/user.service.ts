import { Response } from "express";
import bcrypt from "bcrypt";
import { Op, WhereOptions } from "sequelize";
import {
  User,
  Role,
  Permission,
  UserRole,
  UserPasswordHistory,
  UserGroup,
  sequelize
} from "../models/index.js";
import { PaginationParams, buildPaginatedEnvelope } from "../utils/pagination.util.js";
import { CreateUserDto, UpdateUserDto } from "../dtos/user.dto.js";
import { streamCsvResponse, ExportColumn } from "../utils/streamingExport.js";

const BCRYPT_ROUNDS = 10;

export class UserService {
  static async listUsers(params: PaginationParams) {
    const where: WhereOptions = {};

    // Search filter across text columns
    if (params.search) {
      const searchTerm = `%${params.search}%`;
      where[Op.or as any] = [
        { email: { [Op.iLike]: searchTerm } },
        { firstName: { [Op.iLike]: searchTerm } },
        { lastName: { [Op.iLike]: searchTerm } },
        { company: { [Op.iLike]: searchTerm } },
        { phone: { [Op.iLike]: searchTerm } }
      ];
    }

    // Key-value filtering
    if (params.filters.isActive !== undefined && params.filters.isActive !== "all") {
      where.isActive = params.filters.isActive === "true" || params.filters.isActive === true;
    }

    if (params.filters.company && params.filters.company !== "ALL") {
      where.company = params.filters.company;
    }

    // Sorting
    let order: [string, string][] = [["created_at", "DESC"]];
    if (params.sortBy) {
      const sortColumnMap: Record<string, string> = {
        firstName: "first_name",
        lastName: "last_name",
        createdAt: "created_at",
        updatedAt: "updated_at",
        isActive: "is_active",
        email: "email",
        id: "id"
      };
      const column = sortColumnMap[params.sortBy] || params.sortBy;
      order = [[column, params.sortDir]];
    }

    const { count, rows } = await User.findAndCountAll({
      where,
      limit: params.limit,
      offset: params.skip,
      order,
      distinct: true,
      include: [
        {
          model: Role,
          as: "roles",
          through: { attributes: [] },
          include: [
            {
              model: Permission,
              as: "permissions",
              through: { attributes: [] }
            }
          ]
        },
        {
          model: UserGroup,
          as: "group",
          attributes: ["id", "name"]
        }
      ]
    });

    const items = rows.map((u) => {
      const roles = u.roles?.map((r) => r.name) || [];
      const primaryRole = roles[0] || "USER";
      return {
        id: u.id,
        _id: u.id,
        email: u.email,
        firstName: u.firstName,
        lastName: u.lastName,
        fullName: `${u.firstName} ${u.lastName}`.trim(),
        company: u.company || "InOrbit Fleet Logistics",
        branch: u.branch || "Depot Alpha",
        reseller: u.reseller || "Direct Enterprise",
        group: u.group?.name || "Fleet Operations Core",
        groupId: u.groupId || null,
        role: primaryRole,
        roles,
        roleIds: u.roles?.map((r) => r.id) || [],
        phone: u.phone || "+91 98000 00000",
        allocationGroup: u.allocationGroup || "Western Corridor",
        expiryDate: u.expiryDate || "2028-12-31",
        isActive: u.isActive,
        language: u.language || "en",
        timezone: u.timezone || "Asia/Kolkata",
        dateFormat: u.dateFormat || "DD/MM/YYYY",
        measurementUnit: u.measurementUnit || "km",
        features: u.features || { liveTracking: true, dashboardCharts: true, routePlayback: true, emailAlerts: true },
        createdAt: u.createdAt,
        updatedAt: u.updatedAt
      };
    });

    return buildPaginatedEnvelope(items, count, params.page, params.limit);
  }

  static async getUserById(id: string) {
    const user = await User.findByPk(id, {
      include: [
        {
          model: Role,
          as: "roles",
          through: { attributes: [] }
        },
        {
          model: UserGroup,
          as: "group",
          attributes: ["id", "name"]
        }
      ]
    });

    if (!user) {
      const error: any = new Error("User not found");
      error.status = 404;
      throw error;
    }

    const roles = user.roles?.map((r) => r.name) || [];
    return {
      id: user.id,
      _id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      fullName: `${user.firstName} ${user.lastName}`.trim(),
      company: user.company || "InOrbit Fleet Logistics",
      branch: user.branch || "Depot Alpha",
      reseller: user.reseller || "Direct Enterprise",
      group: user.group?.name || "Fleet Operations Core",
      groupId: user.groupId || null,
      role: roles[0] || "USER",
      roles,
      roleIds: user.roles?.map((r) => r.id) || [],
      phone: user.phone || "+91 98000 00000",
      allocationGroup: user.allocationGroup || "Western Corridor",
      expiryDate: user.expiryDate || "2028-12-31",
      isActive: user.isActive,
      language: user.language || "en",
      timezone: user.timezone || "Asia/Kolkata",
      dateFormat: user.dateFormat || "DD/MM/YYYY",
      measurementUnit: user.measurementUnit || "km",
      features: user.features || { liveTracking: true, dashboardCharts: true, routePlayback: true, emailAlerts: true },
      createdAt: user.createdAt,
      updatedAt: user.updatedAt
    };
  }

  static async createUser(dto: CreateUserDto) {
    const existing = await User.findOne({
      where: { email: dto.email.trim().toLowerCase() }
    });

    if (existing) {
      const error: any = new Error("User with this email already exists");
      error.status = 400;
      throw error;
    }

    const t = await sequelize.transaction();
    try {
      const passwordHash = await bcrypt.hash(dto.password, BCRYPT_ROUNDS);

      const user = await User.create(
        {
          email: dto.email.trim().toLowerCase(),
          passwordHash,
          firstName: dto.firstName.trim(),
          lastName: dto.lastName.trim(),
          phone: dto.phone || undefined,
          company: dto.company || "InOrbit Fleet Logistics",
          branch: dto.branch || "Depot Alpha",
          reseller: dto.reseller || "Direct Enterprise",
          groupId: dto.groupId || null,
          allocationGroup: dto.allocationGroup || "Western Corridor",
          expiryDate: dto.expiryDate || "2028-12-31",
          isActive: dto.isActive !== undefined ? dto.isActive : true,
          language: dto.language || "en",
          timezone: dto.timezone || "Asia/Kolkata",
          dateFormat: dto.dateFormat || "DD/MM/YYYY",
          measurementUnit: dto.measurementUnit || "km",
          features: (dto.features as Record<string, boolean>) || { liveTracking: true, dashboardCharts: true, routePlayback: true, emailAlerts: true },
          passwordChangedAt: new Date()
        },
        { transaction: t }
      );

      // Record in password history
      await UserPasswordHistory.create(
        {
          userId: user.id,
          passwordHash
        },
        { transaction: t }
      );

      // Assign roles
      if (dto.roleIds && dto.roleIds.length > 0) {
        for (const roleId of dto.roleIds) {
          await UserRole.create(
            {
              userId: user.id,
              roleId
            },
            { transaction: t }
          );
        }
      } else if (dto.role) {
        // Find role by name if provided
        const roleRecord = await Role.findOne({ where: { name: dto.role }, transaction: t });
        if (roleRecord) {
          await UserRole.create({ userId: user.id, roleId: roleRecord.id }, { transaction: t });
        }
      }

      await t.commit();
      return { id: user.id };
    } catch (err) {
      await t.rollback();
      throw err;
    }
  }

  static async updateUser(id: string, dto: UpdateUserDto) {
    const user = await User.findByPk(id);
    if (!user) {
      const error: any = new Error("User not found");
      error.status = 404;
      throw error;
    }

    const t = await sequelize.transaction();
    try {
      const updateData: Partial<User> = {};

      if (dto.firstName !== undefined) updateData.firstName = dto.firstName;
      if (dto.lastName !== undefined) updateData.lastName = dto.lastName;
      if (dto.phone !== undefined) updateData.phone = dto.phone;
      if (dto.company !== undefined) updateData.company = dto.company;
      if (dto.branch !== undefined) updateData.branch = dto.branch;
      if (dto.reseller !== undefined) updateData.reseller = dto.reseller;
      if (dto.groupId !== undefined) updateData.groupId = dto.groupId;
      if (dto.allocationGroup !== undefined) updateData.allocationGroup = dto.allocationGroup;
      if (dto.expiryDate !== undefined) updateData.expiryDate = dto.expiryDate;
      if (dto.isActive !== undefined) updateData.isActive = dto.isActive;
      if (dto.language !== undefined) updateData.language = dto.language;
      if (dto.timezone !== undefined) updateData.timezone = dto.timezone;
      if (dto.dateFormat !== undefined) updateData.dateFormat = dto.dateFormat;
      if (dto.measurementUnit !== undefined) updateData.measurementUnit = dto.measurementUnit;
      if (dto.features !== undefined) updateData.features = dto.features as Record<string, boolean>;

      if (dto.email !== undefined && dto.email.toLowerCase() !== user.email.toLowerCase()) {
        const existing = await User.findOne({
          where: { email: dto.email.trim().toLowerCase() }
        });
        if (existing) {
          const err: any = new Error("Email is already in use by another account");
          err.status = 400;
          throw err;
        }
        updateData.email = dto.email;
      }

      if (dto.password) {
        const passwordHash = await bcrypt.hash(dto.password, BCRYPT_ROUNDS);
        updateData.passwordHash = passwordHash;
        updateData.passwordChangedAt = new Date();

        await UserPasswordHistory.create(
          {
            userId: user.id,
            passwordHash
          },
          { transaction: t }
        );
      }

      await user.update(updateData, { transaction: t });

      if (dto.roleIds !== undefined) {
        // Clear and re-assign
        await UserRole.destroy({ where: { userId: id }, transaction: t });
        for (const roleId of dto.roleIds) {
          await UserRole.create({ userId: id, roleId }, { transaction: t });
        }
      } else if (dto.role) {
        const roleRecord = await Role.findOne({ where: { name: dto.role }, transaction: t });
        if (roleRecord) {
          await UserRole.destroy({ where: { userId: id }, transaction: t });
          await UserRole.create({ userId: id, roleId: roleRecord.id }, { transaction: t });
        }
      }

      await t.commit();
      return { id: user.id };
    } catch (err) {
      await t.rollback();
      throw err;
    }
  }

  static async deleteUser(id: string) {
    const user = await User.findByPk(id);
    if (!user) {
      const error: any = new Error("User not found");
      error.status = 404;
      throw error;
    }

    // Soft delete (paranoid: true sets deleted_at)
    await user.destroy();
    return { id };
  }

  static async streamExport(res: Response, params: PaginationParams) {
    const where: WhereOptions = {};
    if (params.search) {
      const searchTerm = `%${params.search}%`;
      where[Op.or as any] = [
        { email: { [Op.iLike]: searchTerm } },
        { firstName: { [Op.iLike]: searchTerm } },
        { lastName: { [Op.iLike]: searchTerm } },
        { company: { [Op.iLike]: searchTerm } },
        { phone: { [Op.iLike]: searchTerm } }
      ];
    }
    if (params.filters.isActive !== undefined && params.filters.isActive !== "all") {
      where.isActive = params.filters.isActive === "true" || params.filters.isActive === true;
    }
    if (params.filters.company && params.filters.company !== "ALL") {
      where.company = params.filters.company;
    }

    const columns: ExportColumn<User>[] = [
      { key: "firstName", label: "First Name" },
      { key: "lastName", label: "Last Name" },
      { key: "email", label: "Email Address" },
      { key: "phone", label: "Phone" },
      { key: "company", label: "Company" },
      { key: "branch", label: "Branch" },
      { key: "reseller", label: "Reseller" },
      { key: "group", label: "Group", format: (_: any, u: any) => u.group?.name || "—" },
      { key: "role", label: "Role", format: (_: any, u: any) => (u.roles?.[0]?.name) || "USER" },
      { key: "isActive", label: "Status", format: (val: any) => (val ? "Active" : "Inactive") },
      { key: "expiryDate", label: "Expiry Date" }
    ];

    await streamCsvResponse(
      res,
      `users_${new Date().toISOString().slice(0, 10)}.csv`,
      columns,
      async (batchSize: number, offset: number) => {
        return await User.findAll({
          where,
          limit: batchSize,
          offset,
          order: [["created_at", "DESC"]],
          include: [
            {
              model: UserGroup,
              as: "group",
              attributes: ["id", "name"]
            },
            {
              model: Role,
              as: "roles",
              attributes: ["name"]
            }
          ]
        });
      }
    );
  }
}
