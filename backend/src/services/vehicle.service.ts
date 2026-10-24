import { Response } from "express";
import { Op, WhereOptions } from "sequelize";
import { Vehicle, Driver, ImmobilizerAudit, sequelize } from "../models/index.js";
import { CreateVehicleDto, UpdateVehicleDto, ImmobilizeVehicleDto } from "../dtos/vehicle.dto.js";
import { streamCsvResponse, ExportColumn } from "../utils/streamingExport.js";

export interface VehicleFilterParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
  category?: string;
  companyName?: string;
}

export class VehicleService {
  async listVehicles(params: VehicleFilterParams = {}) {
    const page = Math.max(1, Number(params.page) || 1);
    const limit = Math.min(100, Math.max(1, Number(params.limit) || 20));
    const offset = (page - 1) * limit;

    const where: WhereOptions = {};

    if (params.search) {
      const q = `%${params.search.trim()}%`;
      where[Op.or as any] = [
        { plateNumber: { [Op.iLike]: q } },
        { makeModel: { [Op.iLike]: q } },
        { deviceImei: { [Op.iLike]: q } },
        { lastLocation: { [Op.iLike]: q } },
        { companyName: { [Op.iLike]: q } }
      ];
    }

    if (params.status && params.status !== "all") {
      where.status = params.status as any;
    }

    if (params.category && params.category !== "all") {
      where.category = params.category;
    }

    if (params.companyName && params.companyName !== "all") {
      where.companyName = params.companyName;
    }

    const { count, rows } = await Vehicle.findAndCountAll({
      where,
      limit,
      offset,
      order: [["created_at", "DESC"]],
      include: [
        {
          model: Driver,
          as: "driver",
          attributes: ["id", "name", "phone", "licenseNumber", "avatar", "rating"]
        }
      ]
    });

    return {
      data: rows,
      total: count,
      page,
      limit,
      totalPages: Math.ceil(count / limit) || 1
    };
  }

  async getVehicleById(id: string) {
    const vehicle = await Vehicle.findByPk(id, {
      include: [
        {
          model: Driver,
          as: "driver",
          attributes: ["id", "name", "phone", "licenseNumber", "avatar", "rating"]
        }
      ]
    });

    if (!vehicle) {
      const err: any = new Error(`Vehicle with ID ${id} not found`);
      err.status = 404;
      throw err;
    }
    return vehicle;
  }

  async getFleetStats() {
    const totalAssets = await Vehicle.count();
    const moving = await Vehicle.count({ where: { status: "moving" } });
    const idling = await Vehicle.count({ where: { status: "idling" } });
    const stopped = await Vehicle.count({ where: { status: "stopped" } });
    const inactive = await Vehicle.count({ where: { status: "inactive" } });

    return {
      totalAssets,
      moving,
      idling,
      stopped,
      inactive
    };
  }

  async createVehicle(dto: CreateVehicleDto) {
    return await sequelize.transaction(async (t) => {
      const existing = await Vehicle.findOne({
        where: { plateNumber: dto.plateNumber.trim() },
        transaction: t
      });
      if (existing) {
        const err: any = new Error(`Vehicle with plate ${dto.plateNumber} already exists`);
        err.status = 400;
        throw err;
      }

      return await Vehicle.create(
        {
          plateNumber: dto.plateNumber.trim(),
          makeModel: dto.makeModel.trim(),
          category: dto.category || "heavy_truck",
          status: dto.status || "stopped",
          speed: dto.speed ?? 0,
          heading: dto.heading ?? 0,
          latitude: dto.latitude ?? 28.6139,
          longitude: dto.longitude ?? 77.209,
          ignition: dto.ignition ?? false,
          fuelPercent: dto.fuelPercent ?? 100,
          batteryPercent: dto.batteryPercent ?? 100,
          odometer: dto.odometer ?? 0,
          engineTemp: dto.engineTemp ?? 25,
          lastLocation: dto.lastLocation || "Depot",
          lastUpdated: "Just now",
          deviceImei: dto.deviceImei.trim(),
          driverId: dto.driverId || null,
          companyName: dto.companyName || "InOrbit Logistics",
          todayDistance: dto.todayDistance ?? 0,
          immobilizerState: dto.immobilizerState || "unlocked"
        },
        { transaction: t }
      );
    });
  }

  async updateVehicle(id: string, dto: UpdateVehicleDto) {
    return await sequelize.transaction(async (t) => {
      const vehicle = await Vehicle.findByPk(id, { transaction: t });
      if (!vehicle) {
        const err: any = new Error(`Vehicle with ID ${id} not found`);
        err.status = 404;
        throw err;
      }

      await vehicle.update(dto, { transaction: t });
      return vehicle;
    });
  }

  async deleteVehicle(id: string) {
    return await sequelize.transaction(async (t) => {
      const vehicle = await Vehicle.findByPk(id, { transaction: t });
      if (!vehicle) {
        const err: any = new Error(`Vehicle with ID ${id} not found`);
        err.status = 404;
        throw err;
      }

      await vehicle.destroy({ transaction: t });
      return { success: true, message: `Vehicle ${id} deleted successfully` };
    });
  }

  async immobilize(id: string, dto: ImmobilizeVehicleDto, dispatchedBy: string = "Fleet Admin") {
    return await sequelize.transaction(async (t) => {
      const vehicle = await Vehicle.findByPk(id, { transaction: t });
      if (!vehicle) {
        const err: any = new Error(`Vehicle with ID ${id} not found`);
        err.status = 404;
        throw err;
      }

      const isLock = dto.action === "lock" || dto.action === "locked" || dto.action === "cut_off";
      const targetState: "locked" | "unlocked" = isLock ? "locked" : "unlocked";

      await vehicle.update({ immobilizerState: targetState }, { transaction: t });

      // Audit log the immobilizer command
      await ImmobilizerAudit.create(
        {
          companyName: vehicle.companyName,
          branchName: "Central Control Room",
          vehiclePlate: vehicle.plateNumber,
          vehicleId: vehicle.id,
          command: isLock ? "STOP_ENGINE" : "RESUME_ENGINE",
          status: "executed",
          operatorId: vehicle.id,
          operatorName: dispatchedBy,
          reason: dto.notes || dto.reason || `Remote ${targetState} triggered by operator`,
          latitude: Number(vehicle.latitude) || 28.6139,
          longitude: Number(vehicle.longitude) || 77.209
        },
        { transaction: t }
      );

      return {
        vehicleId: vehicle.id,
        plateNumber: vehicle.plateNumber,
        action: targetState,
        immobilizerState: targetState,
        dispatchedAt: new Date().toISOString(),
        status: "success"
      };
    });
  }

  async getPlaybackSession(id: string, date: string) {
    const vehicle = await this.getVehicleById(id);
    const baseLat = Number(vehicle.latitude) || 28.5355;
    const baseLng = Number(vehicle.longitude) || 77.391;

    const points = Array.from({ length: 24 }, (_, i) => {
      const hour = 8 + Math.floor(i / 2);
      const minute = (i % 2) * 30;
      const speed = i === 5 || i === 12 ? 0 : 50 + (i % 5) * 8;
      return {
        id: `pt-${i}`,
        timestamp: `${date || "2026-10-24"}T${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}:00Z`,
        latitude: Number((baseLat + i * 0.025 + Math.sin(i) * 0.005).toFixed(5)),
        longitude: Number((baseLng + i * 0.035 + Math.cos(i) * 0.005).toFixed(5)),
        speed,
        heading: (70 + i * 5) % 360,
        ignition: speed > 0 || i === 5,
        stoppage: speed === 0 && i === 12,
        idle: speed === 0 && i === 5,
        locationName: `${vehicle.lastLocation} Point #${i + 1}`
      };
    });

    return {
      vehicleId: vehicle.id,
      vehiclePlate: vehicle.plateNumber,
      date: date || new Date().toISOString().split("T")[0],
      startTime: "08:30 AM",
      endTime: "06:30 PM",
      totalDistance: vehicle.todayDistance || 218.4,
      maxSpeed: 82,
      avgSpeed: 54,
      stoppageCount: 3,
      idleDurationMinutes: 45,
      points
    };
  }

  async streamExport(res: Response, params: VehicleFilterParams = {}) {
    const where: WhereOptions = {};
    if (params.search) {
      const q = `%${params.search.trim()}%`;
      where[Op.or as any] = [
        { plateNumber: { [Op.iLike]: q } },
        { makeModel: { [Op.iLike]: q } },
        { deviceImei: { [Op.iLike]: q } },
        { lastLocation: { [Op.iLike]: q } },
        { companyName: { [Op.iLike]: q } }
      ];
    }
    if (params.status && params.status !== "all") {
      where.status = params.status as any;
    }
    if (params.category && params.category !== "all") {
      where.category = params.category;
    }
    if (params.companyName && params.companyName !== "all") {
      where.companyName = params.companyName;
    }

    const columns: ExportColumn<Vehicle>[] = [
      { key: "plateNumber", label: "Plate Number" },
      { key: "makeModel", label: "Make & Model" },
      { key: "category", label: "Category" },
      { key: "status", label: "Status" },
      { key: "speed", label: "Speed (km/h)" },
      { key: "heading", label: "Heading (°)" },
      { key: "latitude", label: "Latitude" },
      { key: "longitude", label: "Longitude" },
      { key: "ignition", label: "Ignition", format: (v: any) => (v ? "ON" : "OFF") },
      { key: "fuelPercent", label: "Fuel (%)" },
      { key: "batteryPercent", label: "Battery (%)" },
      { key: "odometer", label: "Odometer (km)" },
      { key: "engineTemp", label: "Engine Temp (°C)" },
      { key: "lastLocation", label: "Last Location" },
      { key: "driverName", label: "Driver Name", format: (_: any, row: any) => row.driver?.name || "Unassigned" },
      { key: "driverPhone", label: "Driver Phone", format: (_: any, row: any) => row.driver?.phone || "—" },
      { key: "deviceImei", label: "Device IMEI" },
      { key: "companyName", label: "Company" },
      { key: "immobilizerState", label: "Immobilizer" },
      { key: "todayDistance", label: "Today Distance (km)" }
    ];

    await streamCsvResponse(
      res,
      `vehicle_telematics_${new Date().toISOString().slice(0, 10)}.csv`,
      columns,
      async (batchSize: number, offset: number) => {
        return await Vehicle.findAll({
          where,
          limit: batchSize,
          offset,
          order: [["created_at", "DESC"]],
          include: [
            {
              model: Driver,
              as: "driver",
              attributes: ["id", "name", "phone", "licenseNumber"]
            }
          ]
        });
      }
    );
  }
}

export const vehicleService = new VehicleService();
