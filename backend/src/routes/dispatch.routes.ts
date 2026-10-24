import { Router } from "express";
import { DispatchController } from "../controllers/dispatch.controller.js";
import { authenticate } from "../middlewares/auth.middleware.js";
import { checkPermissions } from "../middlewares/rbac.middleware.js";
import { validateDto } from "../middlewares/validation.middleware.js";
import {
  CreateRoutePathDto,
  UpdateRoutePathDto,
  CreateRouteAllocationDto,
  UpdateRouteAllocationDto,
  CreateCrewAllocationDto,
  UpdateCrewAllocationDto,
  CreateImmobilizerAuditDto,
  CreateComplianceReminderDto,
  UpdateComplianceReminderDto
} from "../dtos/dispatch.dto.js";
import { PERMISSIONS } from "../utils/constants.js";

const router = Router();

// Require JWT authentication for all dispatch operations
router.use(authenticate);

// ─── 1. ROUTE CORRIDORS ─────────────────────────────────────────────────────
router.get(
  "/routes",
  checkPermissions([PERMISSIONS.VIEW_DISPATCH]),
  DispatchController.listRoutes
);

router.get(
  "/routes/:id",
  checkPermissions([PERMISSIONS.VIEW_DISPATCH]),
  DispatchController.getRouteById
);

router.post(
  "/routes",
  checkPermissions([PERMISSIONS.MANAGE_DISPATCH]),
  validateDto(CreateRoutePathDto),
  DispatchController.createRoute
);

router.put(
  "/routes/:id",
  checkPermissions([PERMISSIONS.MANAGE_DISPATCH]),
  validateDto(UpdateRoutePathDto),
  DispatchController.updateRoute
);

router.delete(
  "/routes/:id",
  checkPermissions([PERMISSIONS.MANAGE_DISPATCH]),
  DispatchController.deleteRoute
);

// ─── 2. ROUTE ALLOCATIONS ───────────────────────────────────────────────────
router.get(
  "/allocations",
  checkPermissions([PERMISSIONS.VIEW_DISPATCH]),
  DispatchController.listAllocations
);

router.post(
  "/allocations",
  checkPermissions([PERMISSIONS.MANAGE_DISPATCH]),
  validateDto(CreateRouteAllocationDto),
  DispatchController.createAllocation
);

router.put(
  "/allocations/:id",
  checkPermissions([PERMISSIONS.MANAGE_DISPATCH]),
  validateDto(UpdateRouteAllocationDto),
  DispatchController.updateAllocation
);

router.delete(
  "/allocations/:id",
  checkPermissions([PERMISSIONS.MANAGE_DISPATCH]),
  DispatchController.deleteAllocation
);

// ─── 3. CREW ALLOCATIONS ────────────────────────────────────────────────────
router.get(
  "/crew",
  checkPermissions([PERMISSIONS.VIEW_DISPATCH]),
  DispatchController.listCrew
);

router.post(
  "/crew",
  checkPermissions([PERMISSIONS.MANAGE_DISPATCH]),
  validateDto(CreateCrewAllocationDto),
  DispatchController.createCrew
);

router.put(
  "/crew/:id",
  checkPermissions([PERMISSIONS.MANAGE_DISPATCH]),
  validateDto(UpdateCrewAllocationDto),
  DispatchController.updateCrew
);

router.delete(
  "/crew/:id",
  checkPermissions([PERMISSIONS.MANAGE_DISPATCH]),
  DispatchController.deleteCrew
);

// ─── 4. IMMOBILIZER AUDIT LOGS ──────────────────────────────────────────────
router.get(
  "/immobilizer-audits",
  checkPermissions([PERMISSIONS.VIEW_DISPATCH]),
  DispatchController.listImmobilizerAudits
);

router.post(
  "/immobilizer-audits",
  checkPermissions([PERMISSIONS.MANAGE_DISPATCH]),
  validateDto(CreateImmobilizerAuditDto),
  DispatchController.logImmobilizer
);

// ─── 5. COMPLIANCE & STATUTORY REMINDERS ────────────────────────────────────
router.get(
  "/compliance-reminders",
  checkPermissions([PERMISSIONS.VIEW_COMPLIANCE]),
  DispatchController.listCompliance
);

router.post(
  "/compliance-reminders",
  checkPermissions([PERMISSIONS.MANAGE_COMPLIANCE]),
  validateDto(CreateComplianceReminderDto),
  DispatchController.createCompliance
);

router.put(
  "/compliance-reminders/:id",
  checkPermissions([PERMISSIONS.MANAGE_COMPLIANCE]),
  validateDto(UpdateComplianceReminderDto),
  DispatchController.updateCompliance
);

router.delete(
  "/compliance-reminders/:id",
  checkPermissions([PERMISSIONS.MANAGE_COMPLIANCE]),
  DispatchController.deleteCompliance
);

export default router;
