import { Request, Response, NextFunction } from "express";
import { SystemConfigService } from "../services/system_config.service.js";
import { parsePaginationParams } from "../utils/pagination.util.js";

export class SystemConfigController {
  static async getStats(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const result = await SystemConfigService.getStats();
      res.status(200).json({ result });
    } catch (err) {
      next(err);
    }
  }

  static async list(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const moduleKey = String(req.params.moduleKey);
      const paginationParams = parsePaginationParams(req);
      const data = await SystemConfigService.listByModule(moduleKey, paginationParams);
      res.status(200).json(data);
    } catch (err) {
      next(err);
    }
  }

  static async getById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = String(req.params.id);
      const result = await SystemConfigService.getById(id);
      res.status(200).json({ result });
    } catch (err) {
      next(err);
    }
  }

  static async create(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const moduleKey = String(req.params.moduleKey);
      const result = await SystemConfigService.create(moduleKey, req.body);
      res.status(201).json({
        message: "Configuration item created successfully",
        result
      });
    } catch (err) {
      next(err);
    }
  }

  static async update(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = String(req.params.id);
      const result = await SystemConfigService.update(id, req.body);
      res.status(200).json({
        message: "Configuration item updated successfully",
        result
      });
    } catch (err) {
      next(err);
    }
  }

  static async delete(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = String(req.params.id);
      const result = await SystemConfigService.delete(id);
      res.status(200).json({
        message: "Configuration item deleted successfully",
        result
      });
    } catch (err) {
      next(err);
    }
  }
}
