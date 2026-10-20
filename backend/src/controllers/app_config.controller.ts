import { Request, Response, NextFunction } from "express";
import { AppConfigService } from "../services/app_config.service.js";
import { parsePaginationParams } from "../utils/pagination.util.js";

export class AppConfigController {
  static async getStats(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const result = await AppConfigService.getStats();
      res.status(200).json({ result });
    } catch (err) {
      next(err);
    }
  }

  static async list(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const moduleKey = String(req.params.moduleKey);
      const paginationParams = parsePaginationParams(req);
      const data = await AppConfigService.listByModule(moduleKey, paginationParams);
      res.status(200).json(data);
    } catch (err) {
      next(err);
    }
  }

  static async getById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = String(req.params.id);
      const result = await AppConfigService.getById(id);
      res.status(200).json({ result });
    } catch (err) {
      next(err);
    }
  }

  static async create(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const moduleKey = String(req.params.moduleKey);
      const result = await AppConfigService.create(moduleKey, req.body);
      res.status(201).json({
        message: "App configuration item created successfully",
        result
      });
    } catch (err) {
      next(err);
    }
  }

  static async update(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = String(req.params.id);
      const result = await AppConfigService.update(id, req.body);
      res.status(200).json({
        message: "App configuration item updated successfully",
        result
      });
    } catch (err) {
      next(err);
    }
  }

  static async delete(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = String(req.params.id);
      const result = await AppConfigService.delete(id);
      res.status(200).json({
        message: "App configuration item deleted successfully",
        result
      });
    } catch (err) {
      next(err);
    }
  }

  static async bulkCreate(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const moduleKey = String(req.params.moduleKey);
      const items = Array.isArray(req.body.items) ? req.body.items : [];
      const result = await AppConfigService.bulkCreate(moduleKey, items);
      res.status(201).json({
        message: `Successfully imported ${result.count} records`,
        result
      });
    } catch (err) {
      next(err);
    }
  }

  static async archiveDecommission(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const result = await AppConfigService.archiveDecommission(req.body);
      res.status(200).json({
        message: "Entity successfully decommissioned and archived",
        result
      });
    } catch (err) {
      next(err);
    }
  }
}
