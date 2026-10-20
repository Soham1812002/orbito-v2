import { Router } from "express";
import { SystemConfigController } from "../controllers/system_config.controller.js";
import { authenticate } from "../middlewares/auth.middleware.js";
import { checkPermissions } from "../middlewares/rbac.middleware.js";
import { PERMISSIONS } from "../utils/constants.js";

const router = Router();

router.use(authenticate);

// System configuration summary statistics
router.get(
  "/stats/summary",
  checkPermissions([PERMISSIONS.VIEW_SYSTEM_CONFIG]),
  SystemConfigController.getStats
);

// Get single item
router.get(
  "/item/:id",
  checkPermissions([PERMISSIONS.VIEW_SYSTEM_CONFIG]),
  SystemConfigController.getById
);

// List items for a module
router.get(
  "/:moduleKey",
  checkPermissions([PERMISSIONS.VIEW_SYSTEM_CONFIG]),
  SystemConfigController.list
);

// Create item in module
router.post(
  "/:moduleKey",
  checkPermissions([PERMISSIONS.MANAGE_SYSTEM_CONFIG]),
  SystemConfigController.create
);

// Update item by id
router.put(
  "/item/:id",
  checkPermissions([PERMISSIONS.MANAGE_SYSTEM_CONFIG]),
  SystemConfigController.update
);
router.put(
  "/:id",
  checkPermissions([PERMISSIONS.MANAGE_SYSTEM_CONFIG]),
  SystemConfigController.update
);

// Soft delete item by id
router.delete(
  "/item/:id",
  checkPermissions([PERMISSIONS.MANAGE_SYSTEM_CONFIG]),
  SystemConfigController.delete
);
router.delete(
  "/:id",
  checkPermissions([PERMISSIONS.MANAGE_SYSTEM_CONFIG]),
  SystemConfigController.delete
);

export default router;
