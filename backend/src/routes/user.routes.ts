import { Router } from "express";
import { UserController } from "../controllers/user.controller.js";
import { authenticate } from "../middlewares/auth.middleware.js";
import { checkPermissions } from "../middlewares/rbac.middleware.js";
import { validateDto } from "../middlewares/validation.middleware.js";
import { CreateUserDto, UpdateUserDto } from "../dtos/user.dto.js";
import { PERMISSIONS } from "../utils/constants.js";

const router = Router();

router.use(authenticate);

router.get("/", checkPermissions([PERMISSIONS.VIEW_USER]), UserController.list);
router.get("/:id", checkPermissions([PERMISSIONS.VIEW_USER]), UserController.getById);
router.post(
  "/",
  checkPermissions([PERMISSIONS.CREATE_USER]),
  validateDto(CreateUserDto),
  UserController.create
);
router.put(
  "/:id",
  checkPermissions([PERMISSIONS.UPDATE_USER]),
  validateDto(UpdateUserDto),
  UserController.update
);
router.delete("/:id", checkPermissions([PERMISSIONS.DELETE_USER]), UserController.delete);

export default router;
