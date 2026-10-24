import { Request, Response, NextFunction } from "express";
import { vehicleService } from "../services/vehicle.service.js";

export class VehicleController {
  static async list(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const data = await vehicleService.listVehicles(req.query);
      res.status(200).json(data);
    } catch (err) {
      next(err);
    }
  }

  static async getStats(_req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const stats = await vehicleService.getFleetStats();
      res.status(200).json({ success: true, data: stats });
    } catch (err) {
      next(err);
    }
  }

  static async getById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = String(req.params.id);
      const data = await vehicleService.getVehicleById(id);
      res.status(200).json({ success: true, data });
    } catch (err) {
      next(err);
    }
  }

  static async create(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const data = await vehicleService.createVehicle(req.body);
      res.status(201).json({ success: true, message: "Vehicle created successfully", data });
    } catch (err) {
      next(err);
    }
  }

  static async update(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = String(req.params.id);
      const data = await vehicleService.updateVehicle(id, req.body);
      res.status(200).json({ success: true, message: "Vehicle updated successfully", data });
    } catch (err) {
      next(err);
    }
  }

  static async delete(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = String(req.params.id);
      const result = await vehicleService.deleteVehicle(id);
      res.status(200).json(result);
    } catch (err) {
      next(err);
    }
  }

  static async immobilize(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = String(req.params.id);
      const user = (req as any).user;
      const userName = user ? `${user.firstName || ""} ${user.lastName || ""}`.trim() : "Fleet Admin";
      const result = await vehicleService.immobilize(id, req.body, userName || "Fleet Admin");
      res.status(200).json({ success: true, data: result });
    } catch (err) {
      next(err);
    }
  }

  static async getPlayback(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = String(req.params.id);
      const date = (req.query.date as string) || new Date().toISOString().split("T")[0];
      const data = await vehicleService.getPlaybackSession(id, date);
      res.status(200).json({ success: true, data });
    } catch (err) {
      next(err);
    }
  }

  static async export(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      await vehicleService.streamExport(res, req.query);
    } catch (err) {
      next(err);
    }
  }
}
