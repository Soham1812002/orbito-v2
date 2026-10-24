import { Response } from "express";
import { Op, WhereOptions } from "sequelize";
import { Geofence, sequelize } from "../models/index.js";
import { CreateGeofenceDto, UpdateGeofenceDto, GeofenceQueryDto } from "../dtos/geofence.dto.js";
import { streamCsvResponse, ExportColumn } from "../utils/streamingExport.js";

export class GeofenceService {
  async listGeofences(params: GeofenceQueryDto) {
    const page = Math.max(1, Number(params.page) || 1);
    const limit = Math.min(200, Math.max(1, Number(params.limit) || 20));
    const offset = (page - 1) * limit;

    const where: WhereOptions = {};

    if (params.search) {
      const q = `%${params.search.trim()}%`;
      where[Op.or as any] = [
        { name: { [Op.iLike]: q } },
        { category: { [Op.iLike]: q } },
        { company: { [Op.iLike]: q } },
        { branch: { [Op.iLike]: q } }
      ];
    }

    if (params.type && params.type !== "ALL") {
      where.type = params.type as any;
    }

    if (params.category && params.category !== "ALL") {
      where.category = params.category;
    }

    if (params.company && params.company !== "ALL") {
      where.company = params.company;
    }

    const { count, rows } = await Geofence.findAndCountAll({
      where,
      limit,
      offset,
      order: [["createdAt", "DESC"]]
    });

    return {
      items: rows,
      total: count,
      page,
      limit,
      totalPages: Math.ceil(count / limit) || 1
    };
  }

  async getGeofenceById(id: string) {
    const geofence = await Geofence.findByPk(id);
    if (!geofence) {
      throw new Error(`Geofence not found with id: ${id}`);
    }
    return geofence;
  }

  async createGeofence(data: CreateGeofenceDto) {
    return await sequelize.transaction(async (t) => {
      return await Geofence.create(data as any, { transaction: t });
    });
  }

  async updateGeofence(id: string, data: UpdateGeofenceDto) {
    return await sequelize.transaction(async (t) => {
      const geofence = await Geofence.findByPk(id, { transaction: t });
      if (!geofence) {
        throw new Error(`Geofence not found with id: ${id}`);
      }
      await geofence.update(data as any, { transaction: t });
      return geofence;
    });
  }

  async deleteGeofence(id: string) {
    return await sequelize.transaction(async (t) => {
      const geofence = await Geofence.findByPk(id, { transaction: t });
      if (!geofence) {
        throw new Error(`Geofence not found with id: ${id}`);
      }
      await geofence.destroy({ transaction: t });
      return { success: true, id };
    });
  }

  async getSummaryA(params: { search?: string; company?: string }) {
    // Zone Activity Aggregation
    const where: WhereOptions = {};
    if (params.search) {
      where.name = { [Op.iLike]: `%${params.search.trim()}%` };
    }
    if (params.company && params.company !== "ALL") {
      where.company = params.company;
    }

    const geofences = await Geofence.findAll({ where, order: [["createdAt", "DESC"]] });

    return geofences.map((g, idx) => ({
      id: `sum-a-${g.id}`,
      geofenceId: g.id,
      geofenceName: g.name,
      type: g.type,
      category: g.category,
      company: g.company,
      branch: g.branch || "Headquarters",
      activeVehiclesInside: Math.floor((g.assignedVehiclesCount || 10) * 0.4),
      totalEntriesToday: Math.floor((g.assignedVehiclesCount || 10) * 1.8),
      totalExitsToday: Math.floor((g.assignedVehiclesCount || 10) * 1.6),
      avgDwellTimeMinutes: 45 + (idx % 3) * 15,
      speedViolationsCount: idx % 2 === 0 ? 3 : 0,
      lastEventTime: new Date(Date.now() - (idx * 15 + 5) * 60000).toISOString()
    }));
  }

  async getSummaryB(params: { search?: string; geofenceId?: string }) {
    // Vehicle Zone Crossing Telemetry
    return [
      {
        id: "evt-001",
        vehicleRegNo: "DL 01 CA 9876",
        driverName: "Rajesh Kumar Sharma",
        geofenceName: "Ahmedabad Western Logistics Hub Yard",
        geofenceType: "circular",
        eventType: "ENTRY",
        eventTimestamp: new Date(Date.now() - 25 * 60000).toISOString(),
        speedAtEventKmh: 18,
        speedLimitKmh: 20,
        dwellTimeMinutes: 25,
        status: "COMPLIANT"
      },
      {
        id: "evt-002",
        vehicleRegNo: "MH 12 RN 4521",
        driverName: "Kunal Verma",
        geofenceName: "Sanand Auto Industrial Corridor Zone",
        geofenceType: "polygon",
        eventType: "EXIT",
        eventTimestamp: new Date(Date.now() - 55 * 60000).toISOString(),
        speedAtEventKmh: 34,
        speedLimitKmh: 30,
        dwellTimeMinutes: 110,
        status: "SPEED_VIOLATION"
      },
      {
        id: "evt-003",
        vehicleRegNo: "KA 03 AA 1122",
        driverName: "Siddharth Rao",
        geofenceName: "Yamuna Expressway Toll Monitoring Zone",
        geofenceType: "circular",
        eventType: "ENTRY",
        eventTimestamp: new Date(Date.now() - 85 * 60000).toISOString(),
        speedAtEventKmh: 38,
        speedLimitKmh: 40,
        dwellTimeMinutes: 8,
        status: "COMPLIANT"
      }
    ];
  }

  async getOutOfGeofence(params: { search?: string }) {
    // Deviation Incidents
    return [
      {
        id: "dev-001",
        vehicleRegNo: "GJ 01 TT 9021",
        driverName: "Manish Solanki",
        driverPhone: "+91 98765 44001",
        assignedCorridor: "Western Freight Express Corridor",
        lastKnownLocation: "Morbi Bypass SH-24 KM 42",
        deviationDistanceKm: 14.8,
        speedKmh: 52,
        detectedAt: new Date(Date.now() - 32 * 60000).toISOString(),
        severity: "CRITICAL",
        acknowledged: false
      },
      {
        id: "dev-002",
        vehicleRegNo: "HR 26 DQ 7800",
        driverName: "Harpreet Singh",
        driverPhone: "+91 98765 44002",
        assignedCorridor: "Northern Industrial Transit Ring",
        lastKnownLocation: "Kundli Border Service Lane",
        deviationDistanceKm: 6.2,
        speedKmh: 38,
        detectedAt: new Date(Date.now() - 75 * 60000).toISOString(),
        severity: "WARNING",
        acknowledged: true
      }
    ];
  }

  async streamExportGeofences(res: Response, params: GeofenceQueryDto) {
    const filename = `geofence_export_${Date.now()}.csv`;

    const columns: ExportColumn<Geofence>[] = [
      { key: "id", label: "Geofence ID" },
      { key: "name", label: "Geofence Name" },
      { key: "type", label: "Type" },
      { key: "category", label: "Category" },
      { key: "company", label: "Company" },
      { key: "branch", label: "Branch", format: (v) => v || "—" },
      { key: "centerLatitude", label: "Center Latitude" },
      { key: "centerLongitude", label: "Center Longitude" },
      { key: "radiusMeters", label: "Radius (m)", format: (v) => v || "—" },
      { key: "speedLimitKmh", label: "Speed Limit (km/h)", format: (v) => v || "—" },
      { key: "assignedVehiclesCount", label: "Assigned Vehicles" },
      { key: "alertOnEnter", label: "Alert On Enter", format: (v) => (v ? "Yes" : "No") },
      { key: "alertOnExit", label: "Alert On Exit", format: (v) => (v ? "Yes" : "No") },
      { key: "alertOnOverstay", label: "Alert On Overstay", format: (v) => (v ? "Yes" : "No") },
      { key: "maxDwellMinutes", label: "Max Dwell (min)", format: (v) => v || "—" },
      { key: "isActive", label: "Status", format: (v) => (v ? "Active" : "Inactive") },
      { key: "createdAt", label: "Created Date", format: (v) => (v ? new Date(v).toISOString() : "—") }
    ];

    const where: WhereOptions = {};
    if (params.search) {
      const q = `%${params.search.trim()}%`;
      where[Op.or as any] = [
        { name: { [Op.iLike]: q } },
        { category: { [Op.iLike]: q } },
        { company: { [Op.iLike]: q } }
      ];
    }
    if (params.type && params.type !== "ALL") where.type = params.type as any;
    if (params.category && params.category !== "ALL") where.category = params.category;
    if (params.company && params.company !== "ALL") where.company = params.company;

    await streamCsvResponse(res, filename, columns, async (offset, limit) => {
      const rows = await Geofence.findAll({
        where,
        offset,
        limit,
        order: [["createdAt", "DESC"]]
      });
      return rows;
    });
  }
}

export const geofenceService = new GeofenceService();
