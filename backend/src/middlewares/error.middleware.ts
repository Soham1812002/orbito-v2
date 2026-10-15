import { Request, Response, NextFunction } from "express";
import {
  UniqueConstraintError,
  ForeignKeyConstraintError,
  ValidationError
} from "sequelize";
import { logger } from "../configs/logger.js";

export const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  next: NextFunction
): void => {
  logger.error("Unhandled error caught in middleware:", {
    name: err.name,
    message: err.message,
    stack: err.stack,
    url: req.originalUrl,
    method: req.method
  });

  if (err instanceof UniqueConstraintError) {
    const fields = Object.keys(err.fields || {}).join(", ") || "field";
    res.status(400).json({
      error: "Validation failed",
      errors: [`Duplicate value for field ${fields}`]
    });
    return;
  }

  if (err instanceof ForeignKeyConstraintError) {
    res.status(400).json({
      error: "Constraint violation",
      errors: ["Foreign key constraint violation"]
    });
    return;
  }

  if (err instanceof ValidationError) {
    const messages = err.errors.map((e) => e.message);
    res.status(400).json({
      error: "Validation failed",
      errors: messages
    });
    return;
  }

  if (err.name === "TokenExpiredError") {
    res.status(401).json({
      message: "Token Expired"
    });
    return;
  }

  if (err.status && typeof err.status === "number") {
    res.status(err.status).json({
      message: err.message || "An error occurred"
    });
    return;
  }

  res.status(500).json({
    message: "Internal Server Error"
  });
};
