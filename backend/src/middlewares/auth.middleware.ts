import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { ENV } from "../utils/env.util.js";
import { User, Role, Permission } from "../models/index.js";

interface JwtPayload {
  id: string;
  email: string;
}

export const authenticate = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  let token = req.cookies?.orbito_access_token;

  if (!token) {
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith("Bearer ")) {
      token = authHeader.split(" ")[1];
    }
  }

  if (!token) {
    res.status(401).json({
      message: "Unauthorized: Invalid or missing token",
      code: "UNAUTHORIZED"
    });
    return;
  }

  try {
    const decoded = jwt.verify(token, ENV.JWT_SECRET) as JwtPayload;

    // Fetch user with roles and permissions
    const user = await User.findByPk(decoded.id, {
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

    if (!user || !user.isActive) {
      res.status(401).json({
        message: "Unauthorized: User not found or inactive",
        code: "UNAUTHORIZED"
      });
      return;
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

    req.user = {
      id: user.id,
      email: user.email,
      roles,
      permissions: Array.from(permissionsSet)
    };

    next();
  } catch (err: any) {
    if (err.name === "TokenExpiredError") {
      res.status(401).json({
        message: "Token Expired",
        code: "TOKEN_EXPIRED"
      });
      return;
    }
    res.status(401).json({
      message: "Unauthorized: Invalid token",
      code: "UNAUTHORIZED"
    });
  }
};
