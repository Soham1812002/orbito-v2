import { Router } from "express";
import { AppConfigController } from "../controllers/app_config.controller.js";
import { authenticate } from "../middlewares/auth.middleware.js";
import { checkPermissions } from "../middlewares/rbac.middleware.js";
import { PERMISSIONS } from "../utils/constants.js";

const router = Router();

router.use(authenticate);

// App configuration summary statistics for Hub
router.get(
  "/stats/summary",
  checkPermissions([PERMISSIONS.VIEW_APP_CONFIG]),
  AppConfigController.getStats
);

// Bulk insert records (XLSX/CSV import)
router.post(
  "/:moduleKey/bulk",
  checkPermissions([PERMISSIONS.MANAGE_APP_CONFIG]),
  AppConfigController.bulkCreate
);

// Controlled decommission and safe archival
router.post(
  "/decommission/archive",
  checkPermissions([PERMISSIONS.MANAGE_APP_CONFIG]),
  AppConfigController.archiveDecommission
);

// Get single item by UUID
router.get(
  "/item/:id",
  checkPermissions([PERMISSIONS.VIEW_APP_CONFIG]),
  AppConfigController.getById
);

// List items for a module
router.get(
  "/:moduleKey",
  checkPermissions([PERMISSIONS.VIEW_APP_CONFIG]),
  AppConfigController.list
);

// Create item in module
router.post(
  "/:moduleKey",
  checkPermissions([PERMISSIONS.MANAGE_APP_CONFIG]),
  AppConfigController.create
);

// Update item by id
router.put(
  "/item/:id",
  checkPermissions([PERMISSIONS.MANAGE_APP_CONFIG]),
  AppConfigController.update
);
router.put(
  "/:id",
  checkPermissions([PERMISSIONS.MANAGE_APP_CONFIG]),
  AppConfigController.update
);

// Soft delete item by id
router.delete(
  "/item/:id",
  checkPermissions([PERMISSIONS.MANAGE_APP_CONFIG]),
  AppConfigController.delete
);
router.delete(
  "/:id",
  checkPermissions([PERMISSIONS.MANAGE_APP_CONFIG]),
  AppConfigController.delete
);

export default router;
