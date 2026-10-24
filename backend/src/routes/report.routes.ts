import { Router } from "express";
import { ReportController } from "../controllers/report.controller.js";
import { authenticate } from "../middlewares/auth.middleware.js";

const router = Router();

router.use(authenticate);

router.get("/:reportType/export", ReportController.export);
router.get("/travel-summary", ReportController.getTravelSummary);
router.get("/trip-overview", ReportController.getTripOverview);
router.get("/stoppage-overview", ReportController.getStoppageOverview);
router.get("/idle-overview", ReportController.getIdleOverview);
router.get("/vehicle-status", ReportController.getVehicleStatus);
router.get("/ignition-summary", ReportController.getIgnitionSummary);
router.get("/system-logs", ReportController.getSystemLogs);

export default router;
