import { Router } from "express";
import { UserController } from "../controllers/user.controller.js";
import { UserGroupController } from "../controllers/user_group.controller.js";
import { authenticate } from "../middlewares/auth.middleware.js";
import { checkPermissions } from "../middlewares/rbac.middleware.js";
import { validateDto } from "../middlewares/validation.middleware.js";
import { CreateUserDto, UpdateUserDto } from "../dtos/user.dto.js";
import { CreateUserGroupDto, UpdateUserGroupDto } from "../dtos/user_group.dto.js";
import { PERMISSIONS } from "../utils/constants.js";

const router = Router();

router.use(authenticate);

// User Groups
router.get("/groups/export", UserGroupController.export);
router.get("/groups/:id", UserGroupController.getById);
router.get("/groups", UserGroupController.list);
router.post(
  "/groups",
  checkPermissions([PERMISSIONS.UPDATE_USER]),
  validateDto(CreateUserGroupDto),
  UserGroupController.create
);
router.put(
  "/groups/:id",
  checkPermissions([PERMISSIONS.UPDATE_USER]),
  validateDto(UpdateUserGroupDto),
  UserGroupController.update
);
router.delete(
  "/groups/:id",
  checkPermissions([PERMISSIONS.DELETE_USER]),
  UserGroupController.delete
);

// Users Export & List
router.get("/export", checkPermissions([PERMISSIONS.VIEW_USER]), UserController.export);
router.get("/:id", checkPermissions([PERMISSIONS.VIEW_USER]), UserController.getById);
router.get("/", checkPermissions([PERMISSIONS.VIEW_USER]), UserController.list);

// User CRUD
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
