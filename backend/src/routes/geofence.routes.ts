import { Router } from "express";
import { GeofenceController } from "../controllers/geofence.controller.js";
import { authenticate } from "../middlewares/auth.middleware.js";
import { validateDto } from "../middlewares/validation.middleware.js";
import { CreateGeofenceDto, UpdateGeofenceDto } from "../dtos/geofence.dto.js";

const router = Router();

router.use(authenticate);

router.get("/export", GeofenceController.export);
router.get("/summary-a", GeofenceController.getSummaryA);
router.get("/summary-b", GeofenceController.getSummaryB);
router.get("/out-of-geofence", GeofenceController.getOutOfGeofence);
router.post("/out-of-geofence/:id/acknowledge", GeofenceController.acknowledgeDeviation);
router.get("/:id", GeofenceController.getById);
router.get("/", GeofenceController.list);

router.post("/", validateDto(CreateGeofenceDto), GeofenceController.create);
router.put("/:id", validateDto(UpdateGeofenceDto), GeofenceController.update);
router.delete("/:id", GeofenceController.delete);

export default router;
