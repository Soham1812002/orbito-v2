import { Request, Response, NextFunction } from "express";
import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";

export const validateDto = (dtoClass: any, type: "body" | "query" | "params" = "body") => {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const source = (req as any)[type];
      // Supports multipart/form-data where JSON is passed as a stringified "data" field
      let payload = source;
      if (typeof source?.data === "string") {
        try {
          payload = JSON.parse(source.data);
        } catch {
          payload = source;
        }
      }

      const dtoObject = plainToInstance(dtoClass, payload);
      const errors = await validate(dtoObject, { whitelist: true, forbidNonWhitelisted: true });

      if (errors.length > 0) {
        const messages = errors.flatMap((e) => Object.values(e.constraints || {}));
        res.status(400).json({ error: "Validation failed", errors: messages });
        return;
      }

      (req as any)[type] = dtoObject;
      next();
    } catch (err: any) {
      res.status(400).json({ error: "Validation failed", errors: [err.message || "Invalid payload"] });
    }
  };
};
