import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { User, Role, Permission, UserRole, UserPasswordHistory, sequelize } from "../models/index.js";
import { ENV } from "../utils/env.util.js";
import { ROLES } from "../utils/constants.js";

const BCRYPT_ROUNDS = 10;
const PASSWORD_EXPIRATION_DAYS = 30;

export class AuthService {
  static async login(email: string, password: string) {
    const user = await User.findOne({
      where: { email: email.trim().toLowerCase() },
      include: [
        {
          model: Role,
          as: "roles",
          include: [
            {
              model: Permission,
              as: "permissions"
            }
          ]
        }
      ]
    });

    if (!user) {
      const error: any = new Error("Invalid email or password");
      error.status = 401;
      throw error;
    }

    if (!user.isActive) {
      const error: any = new Error("Account is disabled. Please contact administrator");
      error.status = 403;
      throw error;
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      const error: any = new Error("Invalid email or password");
      error.status = 401;
      throw error;
    }

    // Check 30-day password expiration
    const passwordAgeDays =
      (Date.now() - new Date(user.passwordChangedAt).getTime()) / (1000 * 60 * 60 * 24);
    const isPasswordExpired = passwordAgeDays > PASSWORD_EXPIRATION_DAYS;

    const roles: string[] = [];
    const permissionsSet = new Set<string>();

    if (user.roles) {
      for (const role of user.roles) {
        roles.push(role.name);
        if (role.permissions) {
          for (const perm of role.permissions) {
            permissionsSet.add(perm.code);
          }
        }
      }
    }

    const token = jwt.sign(
      {
        id: user.id,
        email: user.email
      },
      ENV.JWT_SECRET,
      { expiresIn: ENV.JWT_EXPIRES_IN as any }
    );

    return {
      token,
      isPasswordExpired,
      user: {
        id: user.id,
        _id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        roles,
        permissions: Array.from(permissionsSet),
        createdAt: user.createdAt
      }
    };
  }

  static async register(data: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
  }) {
    const existing = await User.findOne({
      where: { email: data.email.trim().toLowerCase() }
    });

    if (existing) {
      const error: any = new Error("User with this email already exists");
      error.status = 400;
      throw error;
    }

    const t = await sequelize.transaction();
    try {
      const passwordHash = await bcrypt.hash(data.password, BCRYPT_ROUNDS);

      const user = await User.create(
        {
          email: data.email,
          passwordHash,
          firstName: data.firstName,
          lastName: data.lastName,
          isActive: true,
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

      // Find or assign default USER role
      const defaultRole = await Role.findOne({
        where: { name: ROLES.USER },
        transaction: t
      });

      if (defaultRole) {
        await UserRole.create(
          {
            userId: user.id,
            roleId: defaultRole.id
          },
          { transaction: t }
        );
      }

      await t.commit();

      return {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName
      };
    } catch (err) {
      await t.rollback();
      throw err;
    }
  }

  static async changePassword(userId: string, currentPass: string, newPass: string) {
    const user = await User.findByPk(userId);
    if (!user) {
      const error: any = new Error("User not found");
      error.status = 404;
      throw error;
    }

    const isMatch = await bcrypt.compare(currentPass, user.passwordHash);
    if (!isMatch) {
      const error: any = new Error("Current password is incorrect");
      error.status = 400;
      throw error;
    }

    // Password reuse check: Prohibit reuse of the user's last 3 password hashes
    const recentHistories = await UserPasswordHistory.findAll({
      where: { userId },
      order: [["created_at", "DESC"]],
      limit: 3
    });

    for (const record of recentHistories) {
      const isReused = await bcrypt.compare(newPass, record.passwordHash);
      if (isReused) {
        const error: any = new Error(
          "Password cannot be one of your last 3 recently used passwords"
        );
        error.status = 400;
        throw error;
      }
    }

    const t = await sequelize.transaction();
    try {
      const newHash = await bcrypt.hash(newPass, BCRYPT_ROUNDS);

      await user.update(
        {
          passwordHash: newHash,
          passwordChangedAt: new Date()
        },
        { transaction: t }
      );

      await UserPasswordHistory.create(
        {
          userId,
          passwordHash: newHash
        },
        { transaction: t }
      );

      await t.commit();
      return { success: true };
    } catch (err) {
      await t.rollback();
      throw err;
    }
  }

  static async getProfile(userId: string) {
    const user = await User.findByPk(userId, {
      include: [
        {
          model: Role,
          as: "roles",
          include: [
            {
              model: Permission,
              as: "permissions"
            }
          ]
        }
      ]
    });

    if (!user) {
      const error: any = new Error("User not found");
      error.status = 404;
      throw error;
    }

    const roles: string[] = [];
    const permissionsSet = new Set<string>();

    if (user.roles) {
      for (const role of user.roles) {
        roles.push(role.name);
        if (role.permissions) {
          for (const perm of role.permissions) {
            permissionsSet.add(perm.code);
          }
        }
      }
    }

    return {
      id: user.id,
      _id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      isActive: user.isActive,
      roles,
      permissions: Array.from(permissionsSet),
      createdAt: user.createdAt,
      updatedAt: user.updatedAt
    };
  }
}
