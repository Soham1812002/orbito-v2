import { Request, Response, NextFunction } from "express";
import { AuditLogService } from "../services/audit_log.service.js";
import { parsePaginationParams } from "../utils/pagination.util.js";

export class AuditLogController {
  static async list(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const paginationParams = parsePaginationParams(req);
      const data = await AuditLogService.listAuditLogs(paginationParams);
      res.status(200).json(data);
    } catch (err) {
      next(err);
    }
  }
}
