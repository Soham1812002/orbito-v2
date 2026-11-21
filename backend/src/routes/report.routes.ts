import { Router } from "express";
import { ReportController } from "../controllers/report.controller.js";
import { authenticate } from "../middlewares/auth.middleware.js";
import { checkPermissions } from "../middlewares/rbac.middleware.js";
import { PERMISSIONS } from "../utils/constants.js";

const router = Router();

router.use(authenticate);

router.get("/:reportType/export", ReportController.export);
router.get("/travel-summary", ReportController.getTravelSummary);

// Trip Overview & Summary aliases
router.get("/trip-overview", ReportController.getTripOverview);
router.get("/trip-summary", ReportController.getTripOverview);
router.get("/trip-summary/:vehicleId", ReportController.getTripDetails);

// Stoppage Overview & Summary aliases
router.get("/stoppage-overview", ReportController.getStoppageOverview);
router.get("/stoppage-summary", ReportController.getStoppageOverview);
router.get("/stoppage-summary/:vehicleId", ReportController.getStoppageDetails);

// Idle Overview & Summary aliases
router.get("/idle-overview", ReportController.getIdleOverview);
router.get("/idle-summary", ReportController.getIdleOverview);
router.get("/idle-summary/:vehicleId", ReportController.getIdleDetails);

// Inactive Vehicle Reports
router.get("/inactive-summary", ReportController.getInactiveSummary);
router.get("/inactive-summary/:vehicleId", ReportController.getInactiveDetails);

// Digital Port Telemetry Reports
router.get("/digital-port-summary", ReportController.getDigitalPortSummary);
router.get("/digital-port-summary/:vehicleId", ReportController.getDigitalPortDetails);

// AC Telemetry Reports
router.get("/ac-summary", ReportController.getAcSummary);
router.get("/ac-summary/:vehicleId", ReportController.getAcDetails);

// Communication, Location & Device Logs
router.get("/sms-email-summary", ReportController.getSmsEmailSummary);
router.get("/vehicle-location", ReportController.getVehicleLocation);
router.get("/device-log/:imei", ReportController.getDeviceTelemetryPacket);

router.get("/vehicle-status", ReportController.getVehicleStatus);
router.get("/ignition-summary", ReportController.getIgnitionSummary);
router.get("/ignition-summary/:vehicleId", ReportController.getIgnitionDetails);

// System Log aliases (singular & plural)
router.get("/system-logs", ReportController.getSystemLogs);
router.get("/system-log", ReportController.getSystemLogs);

// Scheduled Automated Reports
router.get("/scheduled-reports", ReportController.getScheduledReports);
router.post(
  "/scheduled-reports",
  checkPermissions([PERMISSIONS.MANAGE_APP_CONFIG]),
  ReportController.createScheduledReport
);
router.patch(
  "/scheduled-reports/:id/toggle",
  checkPermissions([PERMISSIONS.MANAGE_APP_CONFIG]),
  ReportController.toggleScheduledReport
);
router.delete(
  "/scheduled-reports/:id",
  checkPermissions([PERMISSIONS.MANAGE_APP_CONFIG]),
  ReportController.deleteScheduledReport
);

// Vehicle Activation Reports
router.get("/vehicle-activation", ReportController.getVehicleActivation);

export default router;
