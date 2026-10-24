import { Request, Response, NextFunction } from "express";
import { geofenceService } from "../services/geofence.service.js";

export class GeofenceController {
  static async list(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const data = await geofenceService.listGeofences(req.query as any);
      res.status(200).json(data);
    } catch (err) {
      next(err);
    }
  }

  static async getById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = String(req.params.id);
      const data = await geofenceService.getGeofenceById(id);
      res.status(200).json({ success: true, data });
    } catch (err) {
      next(err);
    }
  }

  static async create(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const data = await geofenceService.createGeofence(req.body);
      res.status(201).json({ success: true, message: "Geofence created successfully", data });
    } catch (err) {
      next(err);
    }
  }

  static async update(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = String(req.params.id);
      const data = await geofenceService.updateGeofence(id, req.body);
      res.status(200).json({ success: true, message: "Geofence updated successfully", data });
    } catch (err) {
      next(err);
    }
  }

  static async delete(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = String(req.params.id);
      const result = await geofenceService.deleteGeofence(id);
      res.status(200).json(result);
    } catch (err) {
      next(err);
    }
  }

  static async getSummaryA(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const data = await geofenceService.getSummaryA(req.query as any);
      res.status(200).json(data);
    } catch (err) {
      next(err);
    }
  }

  static async getSummaryB(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const data = await geofenceService.getSummaryB(req.query as any);
      res.status(200).json(data);
    } catch (err) {
      next(err);
    }
  }

  static async getOutOfGeofence(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const data = await geofenceService.getOutOfGeofence(req.query as any);
      res.status(200).json(data);
    } catch (err) {
      next(err);
    }
  }

  static async acknowledgeDeviation(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = String(req.params.id);
      res.status(200).json({ success: true, message: "Deviation acknowledged", id });
    } catch (err) {
      next(err);
    }
  }

  static async export(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      await geofenceService.streamExportGeofences(res, req.query as any);
    } catch (err) {
      next(err);
    }
  }
}
