import { Router } from "express";
import { AuthController } from "../controllers/auth.controller.js";
import { validateDto } from "../middlewares/validation.middleware.js";
import { authenticate } from "../middlewares/auth.middleware.js";
import { LoginDto, RegisterDto, ChangePasswordDto } from "../dtos/auth.dto.js";

const router = Router();

router.post("/login", validateDto(LoginDto), AuthController.login);
router.post("/refresh", AuthController.refresh);
router.post("/logout", AuthController.logout);
router.post("/register", validateDto(RegisterDto), AuthController.register);
router.get("/me", authenticate, AuthController.me);
router.post("/change-password", authenticate, validateDto(ChangePasswordDto), AuthController.changePassword);

export default router;
