import { Request, Response, NextFunction } from "express";
import { UserService } from "../services/user.service.js";
import { parsePaginationParams } from "../utils/pagination.util.js";

export class UserController {
  static async list(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const paginationParams = parsePaginationParams(req);
      const data = await UserService.listUsers(paginationParams);
      res.status(200).json(data);
    } catch (err) {
      next(err);
    }
  }

  static async getById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = String(req.params.id);
      const user = await UserService.getUserById(id);
      res.status(200).json({ result: user });
    } catch (err) {
      next(err);
    }
  }

  static async create(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const result = await UserService.createUser(req.body);
      res.status(201).json({
        message: "User created successfully",
        result
      });
    } catch (err) {
      next(err);
    }
  }

  static async update(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = String(req.params.id);
      const result = await UserService.updateUser(id, req.body);
      res.status(200).json({
        message: "User updated successfully",
        result
      });
    } catch (err) {
      next(err);
    }
  }

  static async delete(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = String(req.params.id);
      const result = await UserService.deleteUser(id);
      res.status(200).json({
        message: "User deleted successfully",
        result
      });
    } catch (err) {
      next(err);
    }
  }
}
