import { Router } from "express";
import { LicensingController } from "../controllers/licensing.controller.js";
import { authenticate } from "../middlewares/auth.middleware.js";
import { validateDto } from "../middlewares/validation.middleware.js";
import {
  CreateCompanyLicenseDto,
  UpdateCompanyLicenseDto,
  CreateUserLicenseDto,
  UpdateUserLicenseDto,
  CreateVehicleLicenseDto,
  UpdateVehicleLicenseDto,
  CreateResellerLicenseDto,
  UpdateResellerLicenseDto
} from "../dtos/licensing.dto.js";

const router = Router();

router.use(authenticate);

// 0. Statistics
router.get("/stats", LicensingController.getStats);

// 1. Company Licenses
router.get("/company/export", LicensingController.exportCompany);
router.get("/company/:id", LicensingController.getCompanyById);
router.get("/company", LicensingController.listCompany);
router.post("/company", validateDto(CreateCompanyLicenseDto), LicensingController.createCompany);
router.put("/company/:id", validateDto(UpdateCompanyLicenseDto), LicensingController.updateCompany);
router.delete("/company/:id", LicensingController.deleteCompany);

// 2. User Licenses
router.get("/user/export", LicensingController.exportUser);
router.get("/user/:id", LicensingController.getUserById);
router.get("/user", LicensingController.listUser);
router.post("/user", validateDto(CreateUserLicenseDto), LicensingController.createUser);
router.put("/user/:id", validateDto(UpdateUserLicenseDto), LicensingController.updateUser);
router.delete("/user/:id", LicensingController.deleteUser);

// 3. Vehicle Licenses
router.get("/vehicle/export", LicensingController.exportVehicle);
router.get("/vehicle/:id", LicensingController.getVehicleById);
router.get("/vehicle", LicensingController.listVehicle);
router.post("/vehicle", validateDto(CreateVehicleLicenseDto), LicensingController.createVehicle);
router.put("/vehicle/:id", validateDto(UpdateVehicleLicenseDto), LicensingController.updateVehicle);
router.delete("/vehicle/:id", LicensingController.deleteVehicle);

// 4. Reseller Licenses
router.get("/reseller/export", LicensingController.exportReseller);
router.get("/reseller/:id", LicensingController.getResellerById);
router.get("/reseller", LicensingController.listReseller);
router.post("/reseller", validateDto(CreateResellerLicenseDto), LicensingController.createReseller);
router.put("/reseller/:id", validateDto(UpdateResellerLicenseDto), LicensingController.updateReseller);
router.delete("/reseller/:id", LicensingController.deleteReseller);

export default router;
