import { Router } from "express";
import { ExpenseController } from "../controllers/expense.controller.js";
import { authenticate } from "../middlewares/auth.middleware.js";
import { checkPermissions } from "../middlewares/rbac.middleware.js";
import { validateDto } from "../middlewares/validation.middleware.js";
import { CreateVehicleExpenseDto, UpdateVehicleExpenseDto } from "../dtos/expense.dto.js";
import { PERMISSIONS } from "../utils/constants.js";

const router = Router();

router.use(authenticate);

// Aggregated fleet expense history (grouped by vehicle)
router.get(
  "/history",
  checkPermissions([PERMISSIONS.VIEW_EXPENSE]),
  ExpenseController.getHistory
);

// Granular line-item expense register
router.get(
  "/",
  checkPermissions([PERMISSIONS.VIEW_EXPENSE]),
  ExpenseController.list
);

// Single expense by ID
router.get(
  "/:id",
  checkPermissions([PERMISSIONS.VIEW_EXPENSE]),
  ExpenseController.getById
);

// Record new expense
router.post(
  "/",
  checkPermissions([PERMISSIONS.MANAGE_EXPENSE]),
  validateDto(CreateVehicleExpenseDto),
  ExpenseController.create
);

// Update expense
router.put(
  "/:id",
  checkPermissions([PERMISSIONS.MANAGE_EXPENSE]),
  validateDto(UpdateVehicleExpenseDto),
  ExpenseController.update
);

// Delete expense (soft-delete)
router.delete(
  "/:id",
  checkPermissions([PERMISSIONS.MANAGE_EXPENSE]),
  ExpenseController.delete
);

export default router;
