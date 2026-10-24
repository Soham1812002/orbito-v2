import crypto from "crypto";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import {
  User,
  Role,
  Permission,
  UserRole,
  UserPasswordHistory,
  RefreshToken,
  sequelize
} from "../models/index.js";
import { ENV } from "../utils/env.util.js";
import { ROLES } from "../utils/constants.js";

const BCRYPT_ROUNDS = 10;
const PASSWORD_EXPIRATION_DAYS = 30;

function hashToken(token: string): string {
  return crypto.createHash("sha256").update(token).digest("hex");
}

export class AuthService {
  static async login(
    email: string,
    password: string,
    context?: { ip?: string; userAgent?: string }
  ) {
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

    const familyId = crypto.randomUUID();

    // 1. Generate 15-minute Access Token
    const accessToken = jwt.sign(
      {
        id: user.id,
        email: user.email,
        roles
      },
      ENV.JWT_SECRET,
      { expiresIn: ENV.JWT_ACCESS_EXPIRES_IN as any }
    );

    // 2. Generate 7-day Refresh Token
    const refreshToken = jwt.sign(
      {
        id: user.id,
        familyId
      },
      ENV.JWT_REFRESH_SECRET,
      { expiresIn: ENV.JWT_REFRESH_EXPIRES_IN as any }
    );

    // 3. Store SHA-256 hashed refresh token in PostgreSQL
    const tokenHash = hashToken(refreshToken);
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

    await RefreshToken.create({
      userId: user.id,
      tokenHash,
      familyId,
      expiresAt,
      ipAddress: context?.ip || null,
      userAgent: context?.userAgent || null
    });

    return {
      token: accessToken,
      accessToken,
      refreshToken,
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

  static async refresh(
    rawRefreshToken: string,
    context?: { ip?: string; userAgent?: string }
  ) {
    if (!rawRefreshToken) {
      const error: any = new Error("Refresh token missing");
      error.status = 401;
      error.code = "REFRESH_TOKEN_MISSING";
      throw error;
    }

    let decoded: any;
    try {
      decoded = jwt.verify(rawRefreshToken, ENV.JWT_REFRESH_SECRET);
    } catch (err: any) {
      const error: any = new Error(
        err.name === "TokenExpiredError" ? "Refresh token expired" : "Invalid refresh token"
      );
      error.status = 401;
      error.code = "REFRESH_TOKEN_INVALID";
      throw error;
    }

    const tokenHash = hashToken(rawRefreshToken);
    const record = await RefreshToken.findOne({
      where: { tokenHash }
    });

    // Case 1: Token not found in database -> Force immediate logout
    if (!record) {
      const error: any = new Error("Session expired or invalid refresh token");
      error.status = 401;
      error.code = "SESSION_NOT_FOUND";
      throw error;
    }

    // Case 2: Token reuse / theft detected -> Revoke entire family for security
    if (record.revokedAt) {
      await RefreshToken.update(
        { revokedAt: new Date() },
        { where: { familyId: record.familyId, revokedAt: null } }
      );
      const error: any = new Error("Security alert: Token reuse detected. Session terminated.");
      error.status = 401;
      error.code = "TOKEN_THEFT_DETECTED";
      throw error;
    }

    // Case 3: Token expired past expiresAt timestamp
    if (new Date(record.expiresAt).getTime() < Date.now()) {
      await record.update({ revokedAt: new Date() });
      const error: any = new Error("Session expired. Please sign in again.");
      error.status = 401;
      error.code = "SESSION_EXPIRED";
      throw error;
    }

    // Case 4: Valid refresh token -> Atomic rotation inside transaction
    const t = await sequelize.transaction();
    try {
      // 4a. Revoke current token
      await record.update({ revokedAt: new Date() }, { transaction: t });

      // 4b. Fetch user
      const user = await User.findByPk(record.userId, {
        include: [
          {
            model: Role,
            as: "roles",
            include: [{ model: Permission, as: "permissions" }]
          }
        ],
        transaction: t
      });

      if (!user || !user.isActive) {
        const error: any = new Error("User account is inactive or not found");
        error.status = 401;
        error.code = "USER_INACTIVE";
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

      // 4c. Issue new rotated tokens (preserving same familyId)
      const newAccessToken = jwt.sign(
        {
          id: user.id,
          email: user.email,
          roles
        },
        ENV.JWT_SECRET,
        { expiresIn: ENV.JWT_ACCESS_EXPIRES_IN as any }
      );

      const newRefreshToken = jwt.sign(
        {
          id: user.id,
          familyId: record.familyId
        },
        ENV.JWT_REFRESH_SECRET,
        { expiresIn: ENV.JWT_REFRESH_EXPIRES_IN as any }
      );

      const newTokenHash = hashToken(newRefreshToken);
      const newExpiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

      await RefreshToken.create(
        {
          userId: user.id,
          tokenHash: newTokenHash,
          familyId: record.familyId,
          expiresAt: newExpiresAt,
          ipAddress: context?.ip || null,
          userAgent: context?.userAgent || null
        },
        { transaction: t }
      );

      await t.commit();

      return {
        accessToken: newAccessToken,
        refreshToken: newRefreshToken,
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
    } catch (err) {
      await t.rollback();
      throw err;
    }
  }

  static async logout(rawRefreshToken?: string) {
    if (rawRefreshToken) {
      const tokenHash = hashToken(rawRefreshToken);
      await RefreshToken.update(
        { revokedAt: new Date() },
        { where: { tokenHash, revokedAt: null } }
      );
    }
    return { success: true };
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
