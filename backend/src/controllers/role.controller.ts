import { Request, Response, NextFunction } from "express";
import { RoleService } from "../services/role.service.js";

export class RoleController {
  static async list(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const result = await RoleService.listRoles();
      res.status(200).json({ result });
    } catch (err) {
      next(err);
    }
  }
}
