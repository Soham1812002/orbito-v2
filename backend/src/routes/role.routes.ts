import { Router, Request, Response, NextFunction } from "express";
import { Role } from "../models/index.js";
import { authenticate } from "../middlewares/auth.middleware.js";

const router = Router();

router.use(authenticate);

router.get("/", async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const roles = await Role.findAll({
      order: [["name", "ASC"]]
    });
    res.status(200).json({
      result: roles.map((r) => ({
        id: r.id,
        _id: r.id,
        name: r.name,
        description: r.description
      }))
    });
  } catch (err) {
    next(err);
  }
});

export default router;
