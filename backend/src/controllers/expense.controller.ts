import { Request, Response, NextFunction } from "express";
import { expenseService } from "../services/expense.service.js";

export class ExpenseController {
  static async list(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const data = await expenseService.getExpenses(req.query as any);
      res.status(200).json(data);
    } catch (err) {
      next(err);
    }
  }

  static async getHistory(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const data = await expenseService.getExpenseHistory(req.query as any);
      res.status(200).json(data);
    } catch (err) {
      next(err);
    }
  }

  static async getById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = String(req.params.id);
      const result = await expenseService.getExpenseById(id);
      res.status(200).json({ result });
    } catch (err) {
      next(err);
    }
  }

  static async create(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const result = await expenseService.createExpense(req.body);
      res.status(201).json({
        message: "Expense entry recorded successfully",
        result
      });
    } catch (err) {
      next(err);
    }
  }

  static async update(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = String(req.params.id);
      const result = await expenseService.updateExpense(id, req.body);
      res.status(200).json({
        message: "Expense entry updated successfully",
        result
      });
    } catch (err) {
      next(err);
    }
  }

  static async delete(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = String(req.params.id);
      const result = await expenseService.deleteExpense(id);
      res.status(200).json(result);
    } catch (err) {
      next(err);
    }
  }
}
