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

  static async getInactiveSummary(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const data = await reportService.getInactiveSummary(req.query as any);
      res.status(200).json({ success: true, result: data });
    } catch (err) {
      next(err);
    }
  }

  static async getInactiveDetails(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const vehicleId = String(req.params.vehicleId);
      const date = req.query.date ? String(req.query.date) : undefined;
      const data = await reportService.getInactiveDetails(vehicleId, date);
      res.status(200).json({ success: true, result: data });
    } catch (err) {
      next(err);
    }
  }

  static async getDigitalPortSummary(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const data = await reportService.getDigitalPortSummary(req.query as any);
      res.status(200).json({ success: true, result: data });
    } catch (err) {
      next(err);
    }
  }

  static async getDigitalPortDetails(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const vehicleId = String(req.params.vehicleId);
      const date = req.query.date ? String(req.query.date) : undefined;
      const data = await reportService.getDigitalPortDetails(vehicleId, date);
      res.status(200).json({ success: true, result: data });
    } catch (err) {
      next(err);
    }
  }

  static async getAcSummary(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const data = await reportService.getAcSummary(req.query as any);
      res.status(200).json({ success: true, result: data });
    } catch (err) {
      next(err);
    }
  }

  static async getAcDetails(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const vehicleId = String(req.params.vehicleId);
      const date = req.query.date ? String(req.query.date) : undefined;
      const data = await reportService.getAcDetails(vehicleId, date);
      res.status(200).json({ success: true, result: data });
    } catch (err) {
      next(err);
    }
  }

  static async getSmsEmailSummary(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const data = await reportService.getSmsEmailSummary(req.query as any);
      res.status(200).json({ success: true, result: data });
    } catch (err) {
      next(err);
    }
  }

  static async getVehicleLocation(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const data = await reportService.getVehicleLocation(req.query as any);
      res.status(200).json({ success: true, result: data });
    } catch (err) {
      next(err);
    }
  }

  static async getDeviceTelemetryPacket(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const imei = String(req.params.imei);
      const data = await reportService.getDeviceTelemetryPacket(imei);
      res.status(200).json({ success: true, result: data });
    } catch (err) {
      next(err);
    }
  }

  static async getScheduledReports(_req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const data = await reportService.getScheduledReports();
      res.status(200).json({ success: true, result: data });
    } catch (err) {
      next(err);
    }
  }

  static async createScheduledReport(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const data = await reportService.createScheduledReport(req.body);
      res.status(201).json({ success: true, result: data });
    } catch (err) {
      next(err);
    }
  }

  static async toggleScheduledReport(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = String(req.params.id);
      const data = await reportService.toggleScheduledReport(id);
      res.status(200).json({ success: true, result: data });
    } catch (err) {
      next(err);
    }
  }

  static async deleteScheduledReport(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = String(req.params.id);
      const data = await reportService.deleteScheduledReport(id);
      res.status(200).json({ success: true, result: data });
    } catch (err) {
      next(err);
    }
  }

  static async getVehicleActivation(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const data = await reportService.getVehicleActivation(req.query as any);
      res.status(200).json({ success: true, result: data });
    } catch (err) {
      next(err);
    }
  }

  static async getTripDetails(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const vehicleId = String(req.params.vehicleId);
      const date = req.query.date ? String(req.query.date) : undefined;
      const data = await reportService.getTripDetails(vehicleId, date);
      res.status(200).json({ success: true, result: data });
    } catch (err) {
      next(err);
    }
  }

  static async getStoppageDetails(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const vehicleId = String(req.params.vehicleId);
      const date = req.query.date ? String(req.query.date) : undefined;
      const data = await reportService.getStoppageDetails(vehicleId, date);
      res.status(200).json({ success: true, result: data });
    } catch (err) {
      next(err);
    }
  }

  static async getIdleDetails(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const vehicleId = String(req.params.vehicleId);
      const date = req.query.date ? String(req.query.date) : undefined;
      const data = await reportService.getIdleDetails(vehicleId, date);
      res.status(200).json({ success: true, result: data });
    } catch (err) {
      next(err);
    }
  }

  static async getIgnitionDetails(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const vehicleId = String(req.params.vehicleId);
      const date = req.query.date ? String(req.query.date) : undefined;
      const data = await reportService.getIgnitionDetails(vehicleId, date);
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
