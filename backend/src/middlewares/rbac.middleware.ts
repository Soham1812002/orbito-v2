import { Request, Response, NextFunction } from "express";
import { PERMISSIONS } from "../utils/constants.js";

export const checkPermissions = (requiredPermissions: string[]) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const user = req.user;

    if (!user) {
      res.status(401).json({ message: "Unauthorized: User not authenticated" });
      return;
    }

    const userPermissions = user.permissions || [];

    // SuperAdmin bypass: OPERATE:ALL grants access to every endpoint
    if (userPermissions.includes(PERMISSIONS.OPERATE_ALL)) {
      next();
      return;
    }

    // Check if user has ALL required permissions (or if any is sufficient; typically requires all or at least one)
    const hasAllPermissions = requiredPermissions.every((perm) => userPermissions.includes(perm));

    if (!hasAllPermissions) {
      res.status(403).json({
        message: "Forbidden: Insufficient permissions",
        required: requiredPermissions
      });
      return;
    }

    next();
  };
};
