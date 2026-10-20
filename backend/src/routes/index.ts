import { Router } from "express";
import authRoutes from "./auth.routes.js";
import userRoutes from "./user.routes.js";
import roleRoutes from "./role.routes.js";
import auditLogRoutes from "./audit_log.routes.js";
import systemConfigRoutes from "./system_config.routes.js";
import appConfigRoutes from "./app_config.routes.js";

const router = Router();

router.use("/auth", authRoutes);
router.use("/users", userRoutes);
router.use("/roles", roleRoutes);
router.use("/audit-logs", auditLogRoutes);
router.use("/system-configs", systemConfigRoutes);
router.use("/app-configs", appConfigRoutes);

// Health check endpoint
router.get("/health", (req, res) => {
  res.status(200).json({ status: "UP", timestamp: new Date().toISOString() });
});

export default router;
