import { Request, Response, NextFunction } from "express";
import { userGroupService } from "../services/user_group.service.js";

export class UserGroupController {
  static async list(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const data = await userGroupService.listUserGroups(req.query);
      res.status(200).json(data);
    } catch (err) {
      next(err);
    }
  }

  static async getById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = String(req.params.id);
      const data = await userGroupService.getUserGroupById(id);
      res.status(200).json({ success: true, data });
    } catch (err) {
      next(err);
    }
  }

  static async create(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const result = await userGroupService.createUserGroup(req.body);
      res.status(201).json({ success: true, message: "User group created successfully", result });
    } catch (err) {
      next(err);
    }
  }

  static async update(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = String(req.params.id);
      const result = await userGroupService.updateUserGroup(id, req.body);
      res.status(200).json({ success: true, message: "User group updated successfully", result });
    } catch (err) {
      next(err);
    }
  }

  static async delete(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = String(req.params.id);
      const result = await userGroupService.deleteUserGroup(id);
      res.status(200).json(result);
    } catch (err) {
      next(err);
    }
  }

  static async export(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      await userGroupService.streamExport(res, req.query);
    } catch (err) {
      next(err);
    }
  }
}
