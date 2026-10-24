import { Request, Response, NextFunction } from "express";
import { reportService } from "../services/report.service.js";

export class ReportController {
  static async getTravelSummary(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const data = await reportService.getTravelSummary(req.query as any);
      res.status(200).json({ success: true, result: data });
    } catch (err) {
      next(err);
    }
  }

  static async getTripOverview(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const data = await reportService.getTripOverview(req.query as any);
      res.status(200).json({ success: true, result: data });
    } catch (err) {
      next(err);
    }
  }

  static async getStoppageOverview(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const data = await reportService.getStoppageOverview(req.query as any);
      res.status(200).json({ success: true, result: data });
    } catch (err) {
      next(err);
    }
  }

  static async getIdleOverview(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const data = await reportService.getIdleOverview(req.query as any);
      res.status(200).json({ success: true, result: data });
    } catch (err) {
      next(err);
    }
  }

  static async getVehicleStatus(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const data = await reportService.getVehicleStatus(req.query as any);
      res.status(200).json({ success: true, result: data });
    } catch (err) {
      next(err);
    }
  }

  static async getIgnitionSummary(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const data = await reportService.getIgnitionSummary(req.query as any);
      res.status(200).json({ success: true, result: data });
    } catch (err) {
      next(err);
    }
  }

  static async getSystemLogs(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const data = await reportService.getSystemLogs(req.query as any);
      res.status(200).json({ success: true, result: data });
    } catch (err) {
      next(err);
    }
  }

  static async export(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const reportType = String(req.params.reportType || "travel-summary");
      await reportService.streamExportReport(res, reportType, req.query as any);
    } catch (err) {
      next(err);
    }
  }
}
