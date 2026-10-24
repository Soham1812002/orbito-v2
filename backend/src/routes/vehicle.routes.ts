import { Router } from "express";
import { VehicleController } from "../controllers/vehicle.controller.js";
import { authenticate } from "../middlewares/auth.middleware.js";
import { validateDto } from "../middlewares/validation.middleware.js";
import { CreateVehicleDto, UpdateVehicleDto, ImmobilizeVehicleDto } from "../dtos/vehicle.dto.js";

const router = Router();

router.use(authenticate);

router.get("/stats", VehicleController.getStats);
router.get("/export", VehicleController.export);
router.get("/:id/playback", VehicleController.getPlayback);
router.get("/:id", VehicleController.getById);
router.get("/", VehicleController.list);

router.post("/", validateDto(CreateVehicleDto), VehicleController.create);
router.put("/:id", validateDto(UpdateVehicleDto), VehicleController.update);
router.delete("/:id", VehicleController.delete);
router.post("/:id/immobilize", validateDto(ImmobilizeVehicleDto), VehicleController.immobilize);

export default router;
