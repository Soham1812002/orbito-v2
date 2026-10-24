import { Router } from "express";
import authRoutes from "./auth.routes.js";
import userRoutes from "./user.routes.js";
import roleRoutes from "./role.routes.js";
import auditLogRoutes from "./audit_log.routes.js";
import systemConfigRoutes from "./system_config.routes.js";
import appConfigRoutes from "./app_config.routes.js";
import maintenanceRoutes from "./maintenance.routes.js";
import expenseRoutes from "./expense.routes.js";
import alertRoutes from "./alert.routes.js";
import dispatchRoutes from "./dispatch.routes.js";
import vehicleRoutes from "./vehicle.routes.js";
import licensingRoutes from "./licensing.routes.js";
import geofenceRoutes from "./geofence.routes.js";
import poiRoutes from "./poi.routes.js";
import reportRoutes from "./report.routes.js";

const router = Router();

router.use("/auth", authRoutes);
router.use("/users", userRoutes);
router.use("/roles", roleRoutes);
router.use("/audit-logs", auditLogRoutes);
router.use("/system-configs", systemConfigRoutes);
router.use("/app-configs", appConfigRoutes);
router.use("/maintenance", maintenanceRoutes);
router.use("/expenses", expenseRoutes);
router.use("/alerts", alertRoutes);
router.use("/dispatch", dispatchRoutes);
router.use("/vehicles", vehicleRoutes);
router.use("/licensing", licensingRoutes);
router.use("/geofence", geofenceRoutes);
router.use("/poi", poiRoutes);
router.use("/reports", reportRoutes);

// Health check endpoint
router.get("/health", (req, res) => {
  res.status(200).json({ status: "UP", timestamp: new Date().toISOString() });
});

export default router;
