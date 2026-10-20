import { Router } from "express";
import { RoleController } from "../controllers/role.controller.js";
import { authenticate } from "../middlewares/auth.middleware.js";

const router = Router();

router.use(authenticate);

router.get("/", RoleController.list);

export default router;
