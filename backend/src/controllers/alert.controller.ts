import { Request, Response, NextFunction } from "express";
import { AlertService } from "../services/alert.service.js";

const alertService = new AlertService();

export class AlertController {
  // ─── LOGS ───────────────────────────────────────────────────────────────────

  static async listLogs(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { page, limit, search, severity, alertType, status, vehiclePlate } = req.query;
      const data = await alertService.getAlertLogs({
        page: page ? Number(page) : undefined,
        limit: limit ? Number(limit) : undefined,
        search: search ? String(search) : undefined,
        severity: severity ? String(severity) : undefined,
        alertType: alertType ? String(alertType) : undefined,
        status: status ? String(status) : undefined,
        vehiclePlate: vehiclePlate ? String(vehiclePlate) : undefined
      });
      res.status(200).json(data);
    } catch (err) {
      next(err);
    }
  }

  static async getRecentFeed(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const limit = req.query.limit ? Number(req.query.limit) : 10;
      const data = await alertService.getRecentAlertsFeed(limit);
      res.status(200).json({ items: data });
    } catch (err) {
      next(err);
    }
  }

  static async getLogById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = String(req.params.id);
      const data = await alertService.getAlertLogById(id);
      res.status(200).json({ result: data });
    } catch (err) {
      next(err);
    }
  }

  static async acknowledgeLog(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = String(req.params.id);
      const { resolutionNotes } = req.body;
      const data = await alertService.acknowledgeAlert(id, (req as any).user, resolutionNotes);
      res.status(200).json({
        message: "Alert incident acknowledged successfully",
        result: data
      });
    } catch (err) {
      next(err);
    }
  }

  // ─── RULES ──────────────────────────────────────────────────────────────────

  static async listRules(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { page, limit, search, alertType, severity, isActive } = req.query;
      const data = await alertService.getAlertRules({
        page: page ? Number(page) : undefined,
        limit: limit ? Number(limit) : undefined,
        search: search ? String(search) : undefined,
        alertType: alertType ? String(alertType) : undefined,
        severity: severity ? String(severity) : undefined,
        isActive: isActive !== undefined ? isActive === "true" : undefined
      });
      res.status(200).json(data);
    } catch (err) {
      next(err);
    }
  }

  static async getRuleById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = String(req.params.id);
      const data = await alertService.getAlertRuleById(id);
      res.status(200).json({ result: data });
    } catch (err) {
      next(err);
    }
  }

  static async createRule(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const data = await alertService.createAlertRule(req.body, (req as any).user);
      res.status(201).json({
        message: "Alert rule created successfully",
        result: data
      });
    } catch (err) {
      next(err);
    }
  }

  static async updateRule(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = String(req.params.id);
      const data = await alertService.updateAlertRule(id, req.body, (req as any).user);
      res.status(200).json({
        message: "Alert rule updated successfully",
        result: data
      });
    } catch (err) {
      next(err);
    }
  }

  static async toggleRuleActive(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = String(req.params.id);
      const data = await alertService.toggleRuleActive(id, (req as any).user);
      res.status(200).json({
        message: `Alert rule status updated to ${data.isActive ? "Active" : "Inactive"}`,
        result: data
      });
    } catch (err) {
      next(err);
    }
  }

  static async deleteRule(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = String(req.params.id);
      const data = await alertService.deleteAlertRule(id, (req as any).user);
      res.status(200).json(data);
    } catch (err) {
      next(err);
    }
  }
}
