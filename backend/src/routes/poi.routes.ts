import { Router } from "express";
import { PoiController } from "../controllers/poi.controller.js";
import { authenticate } from "../middlewares/auth.middleware.js";
import { validateDto } from "../middlewares/validation.middleware.js";
import { CreatePoiDto, UpdatePoiDto } from "../dtos/poi.dto.js";

const router = Router();

router.use(authenticate);

router.get("/export", PoiController.export);
router.get("/summary-a", PoiController.getSummaryA);
router.get("/summary-b", PoiController.getSummaryB);
router.get("/missed", PoiController.getMissed);
router.get("/collection-address", PoiController.getCollectionAddress);
router.get("/:id", PoiController.getById);
router.get("/", PoiController.list);

router.post("/", validateDto(CreatePoiDto), PoiController.create);
router.put("/:id", validateDto(UpdatePoiDto), PoiController.update);
router.delete("/:id", PoiController.delete);

export default router;
