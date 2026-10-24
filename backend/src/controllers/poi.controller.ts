import { Request, Response, NextFunction } from "express";
import { poiService } from "../services/poi.service.js";

export class PoiController {
  static async list(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const data = await poiService.listPois(req.query as any);
      res.status(200).json(data);
    } catch (err) {
      next(err);
    }
  }

  static async getById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = String(req.params.id);
      const data = await poiService.getPoiById(id);
      res.status(200).json({ success: true, data });
    } catch (err) {
      next(err);
    }
  }

  static async create(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const data = await poiService.createPoi(req.body);
      res.status(201).json({ success: true, message: "POI created successfully", data });
    } catch (err) {
      next(err);
    }
  }

  static async update(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = String(req.params.id);
      const data = await poiService.updatePoi(id, req.body);
      res.status(200).json({ success: true, message: "POI updated successfully", data });
    } catch (err) {
      next(err);
    }
  }

  static async delete(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = String(req.params.id);
      const result = await poiService.deletePoi(id);
      res.status(200).json(result);
    } catch (err) {
      next(err);
    }
  }

  static async getSummaryA(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const data = await poiService.getSummaryA(req.query as any);
      res.status(200).json(data);
    } catch (err) {
      next(err);
    }
  }

  static async getSummaryB(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const data = await poiService.getSummaryB(req.query as any);
      res.status(200).json(data);
    } catch (err) {
      next(err);
    }
  }

  static async getMissed(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const data = await poiService.getMissedPois(req.query as any);
      res.status(200).json(data);
    } catch (err) {
      next(err);
    }
  }

  static async getCollectionAddress(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const data = await poiService.getCollectionAddresses(req.query as any);
      res.status(200).json(data);
    } catch (err) {
      next(err);
    }
  }

  static async export(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      await poiService.streamExportPois(res, req.query as any);
    } catch (err) {
      next(err);
    }
  }
}
