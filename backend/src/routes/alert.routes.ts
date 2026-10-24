import { Router } from "express";
import { AlertController } from "../controllers/alert.controller.js";
import { authenticate } from "../middlewares/auth.middleware.js";
import { checkPermissions } from "../middlewares/rbac.middleware.js";
import { validateDto } from "../middlewares/validation.middleware.js";
import { CreateAlertRuleDto, UpdateAlertRuleDto, AcknowledgeAlertDto } from "../dtos/alert.dto.js";
import { PERMISSIONS } from "../utils/constants.js";

const router = Router();

// Protect all routes with JWT authentication
router.use(authenticate);

// ─── INCIDENT LOGS ──────────────────────────────────────────────────────────

// Recent alerts feed for live map slide-over drawer
router.get(
  "/feed",
  checkPermissions([PERMISSIONS.VIEW_ALERT]),
  AlertController.getRecentFeed
);

// Paginated incident logs
router.get(
  "/logs",
  checkPermissions([PERMISSIONS.VIEW_ALERT]),
  AlertController.listLogs
);

// Fallback GET / for logs default
router.get(
  "/",
  checkPermissions([PERMISSIONS.VIEW_ALERT]),
  AlertController.listLogs
);

router.get(
  "/logs/:id",
  checkPermissions([PERMISSIONS.VIEW_ALERT]),
  AlertController.getLogById
);

router.post(
  "/logs/:id/acknowledge",
  checkPermissions([PERMISSIONS.MANAGE_ALERT]),
  validateDto(AcknowledgeAlertDto),
  AlertController.acknowledgeLog
);

// ─── CONFIGURED RULES ───────────────────────────────────────────────────────

router.get(
  "/rules",
  checkPermissions([PERMISSIONS.VIEW_ALERT]),
  AlertController.listRules
);

router.get(
  "/rules/:id",
  checkPermissions([PERMISSIONS.VIEW_ALERT]),
  AlertController.getRuleById
);

router.post(
  "/rules",
  checkPermissions([PERMISSIONS.MANAGE_ALERT]),
  validateDto(CreateAlertRuleDto),
  AlertController.createRule
);

router.put(
  "/rules/:id",
  checkPermissions([PERMISSIONS.MANAGE_ALERT]),
  validateDto(UpdateAlertRuleDto),
  AlertController.updateRule
);

router.patch(
  "/rules/:id/toggle",
  checkPermissions([PERMISSIONS.MANAGE_ALERT]),
  AlertController.toggleRuleActive
);

router.delete(
  "/rules/:id",
  checkPermissions([PERMISSIONS.MANAGE_ALERT]),
  AlertController.deleteRule
);

export default router;
