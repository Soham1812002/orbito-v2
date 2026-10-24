import { Request, Response, NextFunction } from "express";
import { DispatchService } from "../services/dispatch.service.js";

export class DispatchController {
  // ─── 1. ROUTE PATHS ────────────────────────────────────────────────────────
  static async listRoutes(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const data = await DispatchService.listRoutePaths(req.query as any);
      res.status(200).json(data);
    } catch (err) {
      next(err);
    }
  }

  static async getRouteById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const data = await DispatchService.getRoutePathById(req.params.id as string);
      res.status(200).json({ result: data });
    } catch (err) {
      next(err);
    }
  }

  static async createRoute(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const data = await DispatchService.createRoutePath(req.body, (req as any).user);
      res.status(201).json({
        message: "Route path created successfully",
        result: data
      });
    } catch (err) {
      next(err);
    }
  }

  static async updateRoute(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const data = await DispatchService.updateRoutePath(req.params.id as string, req.body, (req as any).user);
      res.status(200).json({
        message: "Route path updated successfully",
        result: data
      });
    } catch (err) {
      next(err);
    }
  }

  static async deleteRoute(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const data = await DispatchService.deleteRoutePath(req.params.id as string, (req as any).user);
      res.status(200).json({
        message: "Route path deleted successfully",
        result: data
      });
    } catch (err) {
      next(err);
    }
  }

  // ─── 2. ROUTE ALLOCATIONS ──────────────────────────────────────────────────
  static async listAllocations(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const data = await DispatchService.listAllocations(req.query as any);
      res.status(200).json(data);
    } catch (err) {
      next(err);
    }
  }

  static async createAllocation(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const data = await DispatchService.createAllocation(req.body, (req as any).user);
      res.status(201).json({
        message: "Route allocation created successfully",
        result: data
      });
    } catch (err) {
      next(err);
    }
  }

  static async updateAllocation(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const data = await DispatchService.updateAllocation(req.params.id as string, req.body, (req as any).user);
      res.status(200).json({
        message: "Route allocation updated successfully",
        result: data
      });
    } catch (err) {
      next(err);
    }
  }

  static async deleteAllocation(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const data = await DispatchService.deleteAllocation(req.params.id as string, (req as any).user);
      res.status(200).json({
        message: "Route allocation deleted successfully",
        result: data
      });
    } catch (err) {
      next(err);
    }
  }

  // ─── 3. CREW ALLOCATIONS ───────────────────────────────────────────────────
  static async listCrew(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const data = await DispatchService.listCrewAllocations(req.query as any);
      res.status(200).json(data);
    } catch (err) {
      next(err);
    }
  }

  static async createCrew(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const data = await DispatchService.createCrewAllocation(req.body, (req as any).user);
      res.status(201).json({
        message: "Crew allocation roster assigned successfully",
        result: data
      });
    } catch (err) {
      next(err);
    }
  }

  static async updateCrew(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const data = await DispatchService.updateCrewAllocation(req.params.id as string, req.body, (req as any).user);
      res.status(200).json({
        message: "Crew allocation roster updated successfully",
        result: data
      });
    } catch (err) {
      next(err);
    }
  }

  static async deleteCrew(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const data = await DispatchService.deleteCrewAllocation(req.params.id as string, (req as any).user);
      res.status(200).json({
        message: "Crew allocation roster removed successfully",
        result: data
      });
    } catch (err) {
      next(err);
    }
  }

  // ─── 4. IMMOBILIZER AUDIT ──────────────────────────────────────────────────
  static async listImmobilizerAudits(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const data = await DispatchService.listImmobilizerAudits(req.query as any);
      res.status(200).json(data);
    } catch (err) {
      next(err);
    }
  }

  static async logImmobilizer(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const data = await DispatchService.logImmobilizerCommand(req.body, (req as any).user);
      res.status(201).json({
        message: "Immobilizer command logged successfully",
        result: data
      });
    } catch (err) {
      next(err);
    }
  }

  // ─── 5. COMPLIANCE REMINDERS ───────────────────────────────────────────────
  static async listCompliance(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const data = await DispatchService.listComplianceReminders(req.query as any);
      res.status(200).json(data);
    } catch (err) {
      next(err);
    }
  }

  static async createCompliance(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const data = await DispatchService.createComplianceReminder(req.body, (req as any).user);
      res.status(201).json({
        message: "Compliance statutory reminder registered successfully",
        result: data
      });
    } catch (err) {
      next(err);
    }
  }

  static async updateCompliance(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const data = await DispatchService.updateComplianceReminder(req.params.id as string, req.body, (req as any).user);
      res.status(200).json({
        message: "Compliance statutory reminder updated successfully",
        result: data
      });
    } catch (err) {
      next(err);
    }
  }

  static async deleteCompliance(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const data = await DispatchService.deleteComplianceReminder(req.params.id as string, (req as any).user);
      res.status(200).json({
        message: "Compliance statutory reminder deleted successfully",
        result: data
      });
    } catch (err) {
      next(err);
    }
  }
}
