import { Request, Response, NextFunction } from "express";
import { maintenanceService } from "../services/maintenance.service.js";

export class MaintenanceController {
  static async list(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const data = await maintenanceService.getReminders(req.query as any);
      res.status(200).json(data);
    } catch (err) {
      next(err);
    }
  }

  static async getOverview(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const data = await maintenanceService.getReminderOverview(req.query as any);
      res.status(200).json(data);
    } catch (err) {
      next(err);
    }
  }

  static async getById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = String(req.params.id);
      const result = await maintenanceService.getReminderById(id);
      res.status(200).json({ result });
    } catch (err) {
      next(err);
    }
  }

  static async create(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const result = await maintenanceService.createReminder(req.body);
      res.status(201).json({
        message: "Maintenance reminder scheduled successfully",
        result
      });
    } catch (err) {
      next(err);
    }
  }

  static async update(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = String(req.params.id);
      const result = await maintenanceService.updateReminder(id, req.body);
      res.status(200).json({
        message: "Maintenance reminder updated successfully",
        result
      });
    } catch (err) {
      next(err);
    }
  }

  static async delete(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = String(req.params.id);
      const result = await maintenanceService.deleteReminder(id);
      res.status(200).json(result);
    } catch (err) {
      next(err);
    }
  }
}
