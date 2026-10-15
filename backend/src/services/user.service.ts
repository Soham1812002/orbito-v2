import bcrypt from "bcrypt";
import { Op, WhereOptions } from "sequelize";
import { User, Role, Permission, UserRole, UserPasswordHistory, sequelize } from "../models/index.js";
import { PaginationParams, buildPaginatedEnvelope } from "../utils/pagination.util.js";
import { CreateUserDto, UpdateUserDto } from "../dtos/user.dto.js";

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
        { lastName: { [Op.iLike]: searchTerm } }
      ];
    }

    // Key-value filtering
    if (params.filters.isActive !== undefined) {
      where.isActive = params.filters.isActive === "true" || params.filters.isActive === true;
    }

    // Sorting
    let order: [string, string][] = [["created_at", "DESC"]];
    if (params.sortBy) {
      // Map frontend camelCase to column names if needed
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
        }
      ]
    });

    const items = rows.map((u) => {
      const roles = u.roles?.map((r) => r.name) || [];
      return {
        id: u.id,
        _id: u.id,
        email: u.email,
        firstName: u.firstName,
        lastName: u.lastName,
        fullName: `${u.firstName} ${u.lastName}`.trim(),
        isActive: u.isActive,
        roles,
        roleIds: u.roles?.map((r) => r.id) || [],
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
        }
      ]
    });

    if (!user) {
      const error: any = new Error("User not found");
      error.status = 404;
      throw error;
    }

    return {
      id: user.id,
      _id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      fullName: `${user.firstName} ${user.lastName}`.trim(),
      isActive: user.isActive,
      roles: user.roles?.map((r) => r.name) || [],
      roleIds: user.roles?.map((r) => r.id) || [],
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
          email: dto.email,
          passwordHash,
          firstName: dto.firstName,
          lastName: dto.lastName,
          isActive: dto.isActive !== undefined ? dto.isActive : true,
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
      if (dto.isActive !== undefined) updateData.isActive = dto.isActive;
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
}
