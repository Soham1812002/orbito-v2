import { Router } from "express";
import { MaintenanceController } from "../controllers/maintenance.controller.js";
import { authenticate } from "../middlewares/auth.middleware.js";
import { checkPermissions } from "../middlewares/rbac.middleware.js";
import { validateDto } from "../middlewares/validation.middleware.js";
import { CreateMaintenanceReminderDto, UpdateMaintenanceReminderDto } from "../dtos/maintenance.dto.js";
import { PERMISSIONS } from "../utils/constants.js";

const router = Router();

router.use(authenticate);

// Reminders listing
router.get(
  "/reminders",
  checkPermissions([PERMISSIONS.VIEW_MAINTENANCE]),
  MaintenanceController.list
);

// Configuration overview matrix (intervals & alert channels)
router.get(
  "/reminders/overview",
  checkPermissions([PERMISSIONS.VIEW_MAINTENANCE]),
  MaintenanceController.getOverview
);

// Single reminder by ID
router.get(
  "/reminders/:id",
  checkPermissions([PERMISSIONS.VIEW_MAINTENANCE]),
  MaintenanceController.getById
);

// Create reminder
router.post(
  "/reminders",
  checkPermissions([PERMISSIONS.MANAGE_MAINTENANCE]),
  validateDto(CreateMaintenanceReminderDto),
  MaintenanceController.create
);

// Update reminder
router.put(
  "/reminders/:id",
  checkPermissions([PERMISSIONS.MANAGE_MAINTENANCE]),
  validateDto(UpdateMaintenanceReminderDto),
  MaintenanceController.update
);

// Delete reminder (soft-delete)
router.delete(
  "/reminders/:id",
  checkPermissions([PERMISSIONS.MANAGE_MAINTENANCE]),
  MaintenanceController.delete
);

export default router;
