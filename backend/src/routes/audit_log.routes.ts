import { Router } from "express";
import { AuditLogController } from "../controllers/audit_log.controller.js";
import { authenticate } from "../middlewares/auth.middleware.js";
import { checkPermissions } from "../middlewares/rbac.middleware.js";
import { PERMISSIONS } from "../utils/constants.js";

const router = Router();

router.use(authenticate);

router.get("/", checkPermissions([PERMISSIONS.VIEW_AUDIT_LOG]), AuditLogController.list);

export default router;
