import { Request, Response, NextFunction } from "express";
import { licensingService } from "../services/licensing.service.js";

export class LicensingController {
  static async getStats(_req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const stats = await licensingService.getStats();
      res.status(200).json({ success: true, data: stats });
    } catch (err) {
      next(err);
    }
  }

  // 1. Company Licenses
  static async listCompany(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const data = await licensingService.listCompanyLicenses(req.query);
      res.status(200).json(data);
    } catch (err) {
      next(err);
    }
  }

  static async getCompanyById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = String(req.params.id);
      const data = await licensingService.getCompanyLicenseById(id);
      res.status(200).json({ success: true, data });
    } catch (err) {
      next(err);
    }
  }

  static async createCompany(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const data = await licensingService.createCompanyLicense(req.body);
      res.status(201).json({ success: true, message: "Company license created", data });
    } catch (err) {
      next(err);
    }
  }

  static async updateCompany(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = String(req.params.id);
      const data = await licensingService.updateCompanyLicense(id, req.body);
      res.status(200).json({ success: true, message: "Company license updated", data });
    } catch (err) {
      next(err);
    }
  }

  static async deleteCompany(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = String(req.params.id);
      const result = await licensingService.deleteCompanyLicense(id);
      res.status(200).json(result);
    } catch (err) {
      next(err);
    }
  }

  static async exportCompany(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      await licensingService.streamExportCompanyLicenses(res, req.query);
    } catch (err) {
      next(err);
    }
  }

  // 2. User Licenses
  static async listUser(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const data = await licensingService.listUserLicenses(req.query);
      res.status(200).json(data);
    } catch (err) {
      next(err);
    }
  }

  static async getUserById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = String(req.params.id);
      const data = await licensingService.getUserLicenseById(id);
      res.status(200).json({ success: true, data });
    } catch (err) {
      next(err);
    }
  }

  static async createUser(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const data = await licensingService.createUserLicense(req.body);
      res.status(201).json({ success: true, message: "User license created", data });
    } catch (err) {
      next(err);
    }
  }

  static async updateUser(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = String(req.params.id);
      const data = await licensingService.updateUserLicense(id, req.body);
      res.status(200).json({ success: true, message: "User license updated", data });
    } catch (err) {
      next(err);
    }
  }

  static async deleteUser(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = String(req.params.id);
      const result = await licensingService.deleteUserLicense(id);
      res.status(200).json(result);
    } catch (err) {
      next(err);
    }
  }

  static async exportUser(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      await licensingService.streamExportUserLicenses(res, req.query);
    } catch (err) {
      next(err);
    }
  }

  // 3. Vehicle Licenses
  static async listVehicle(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const data = await licensingService.listVehicleLicenses(req.query);
      res.status(200).json(data);
    } catch (err) {
      next(err);
    }
  }

  static async getVehicleById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = String(req.params.id);
      const data = await licensingService.getVehicleLicenseById(id);
      res.status(200).json({ success: true, data });
    } catch (err) {
      next(err);
    }
  }

  static async createVehicle(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const data = await licensingService.createVehicleLicense(req.body);
      res.status(201).json({ success: true, message: "Vehicle license created", data });
    } catch (err) {
      next(err);
    }
  }

  static async updateVehicle(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = String(req.params.id);
      const data = await licensingService.updateVehicleLicense(id, req.body);
      res.status(200).json({ success: true, message: "Vehicle license updated", data });
    } catch (err) {
      next(err);
    }
  }

  static async deleteVehicle(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = String(req.params.id);
      const result = await licensingService.deleteVehicleLicense(id);
      res.status(200).json(result);
    } catch (err) {
      next(err);
    }
  }

  static async exportVehicle(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      await licensingService.streamExportVehicleLicenses(res, req.query);
    } catch (err) {
      next(err);
    }
  }

  // 4. Reseller Licenses
  static async listReseller(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const data = await licensingService.listResellerLicenses(req.query);
      res.status(200).json(data);
    } catch (err) {
      next(err);
    }
  }

  static async getResellerById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = String(req.params.id);
      const data = await licensingService.getResellerLicenseById(id);
      res.status(200).json({ success: true, data });
    } catch (err) {
      next(err);
    }
  }

  static async createReseller(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const data = await licensingService.createResellerLicense(req.body);
      res.status(201).json({ success: true, message: "Reseller license created", data });
    } catch (err) {
      next(err);
    }
  }

  static async updateReseller(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = String(req.params.id);
      const data = await licensingService.updateResellerLicense(id, req.body);
      res.status(200).json({ success: true, message: "Reseller license updated", data });
    } catch (err) {
      next(err);
    }
  }

  static async deleteReseller(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = String(req.params.id);
      const result = await licensingService.deleteResellerLicense(id);
      res.status(200).json(result);
    } catch (err) {
      next(err);
    }
  }

  static async exportReseller(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      await licensingService.streamExportResellerLicenses(res, req.query);
    } catch (err) {
      next(err);
    }
  }
}
