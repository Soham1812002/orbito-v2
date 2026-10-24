import { Response } from "express";
import { Op, WhereOptions } from "sequelize";
import { Poi, sequelize } from "../models/index.js";
import { CreatePoiDto, UpdatePoiDto, PoiQueryDto } from "../dtos/poi.dto.js";
import { streamCsvResponse, ExportColumn } from "../utils/streamingExport.js";

export class PoiService {
  async listPois(params: PoiQueryDto) {
    const page = Math.max(1, Number(params.page) || 1);
    const limit = Math.min(200, Math.max(1, Number(params.limit) || 20));
    const offset = (page - 1) * limit;

    const where: WhereOptions = {};

    if (params.search) {
      const q = `%${params.search.trim()}%`;
      where[Op.or as any] = [
        { name: { [Op.iLike]: q } },
        { geoCode: { [Op.iLike]: q } },
        { category: { [Op.iLike]: q } },
        { street: { [Op.iLike]: q } },
        { city: { [Op.iLike]: q } },
        { state: { [Op.iLike]: q } },
        { company: { [Op.iLike]: q } }
      ];
    }

    if (params.category && params.category !== "ALL") {
      where.category = params.category;
    }

    if (params.company && params.company !== "ALL") {
      where.company = params.company;
    }

    if (params.branch && params.branch !== "ALL") {
      where.branch = params.branch;
    }

    const { count, rows } = await Poi.findAndCountAll({
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

  async getPoiById(id: string) {
    const poi = await Poi.findByPk(id);
    if (!poi) {
      throw new Error(`POI not found with id: ${id}`);
    }
    return poi;
  }

  async createPoi(data: CreatePoiDto) {
    return await sequelize.transaction(async (t) => {
      return await Poi.create(data as any, { transaction: t });
    });
  }

  async updatePoi(id: string, data: UpdatePoiDto) {
    return await sequelize.transaction(async (t) => {
      const poi = await Poi.findByPk(id, { transaction: t });
      if (!poi) {
        throw new Error(`POI not found with id: ${id}`);
      }
      await poi.update(data as any, { transaction: t });
      return poi;
    });
  }

  async deletePoi(id: string) {
    return await sequelize.transaction(async (t) => {
      const poi = await Poi.findByPk(id, { transaction: t });
      if (!poi) {
        throw new Error(`POI not found with id: ${id}`);
      }
      await poi.destroy({ transaction: t });
      return { success: true, id };
    });
  }

  async getSummaryA(params: { search?: string }) {
    // Location Stop Summary
    return [
      {
        id: "poi-sum-a-1",
        pointOfInterest: "Ahmedabad Warehouse Depot",
        geoCode: "AHM-DPT-001",
        category: "Depot",
        branch: "Western Hub",
        totalVisitsToday: 34,
        uniqueVehiclesCount: 18,
        avgStopDurationMinutes: 52,
        peakArrivalHour: "10:00 AM - 11:00 AM",
        currentVehiclesOnSite: 4
      },
      {
        id: "poi-sum-a-2",
        pointOfInterest: "Sanand Manufacturing Plant",
        geoCode: "SND-PLT-014",
        category: "Plant",
        branch: "Western Hub",
        totalVisitsToday: 22,
        uniqueVehiclesCount: 12,
        avgStopDurationMinutes: 84,
        peakArrivalHour: "02:00 PM - 03:00 PM",
        currentVehiclesOnSite: 6
      },
      {
        id: "poi-sum-a-3",
        pointOfInterest: "Delhi Logistics Hub",
        geoCode: "DEL-HUB-002",
        category: "Logistics Hub",
        branch: "North Region",
        totalVisitsToday: 48,
        uniqueVehiclesCount: 26,
        avgStopDurationMinutes: 40,
        peakArrivalHour: "08:00 AM - 09:00 AM",
        currentVehiclesOnSite: 8
      }
    ];
  }

  async getSummaryB(params: { search?: string }) {
    // Vehicle Stop Summary
    return [
      {
        id: "poi-sum-b-1",
        vehicleRegNo: "DL 01 CA 9876",
        vehicleModel: "Tata Signa 4825.TK",
        imeiNo: "867492048129482",
        driverName: "Rajesh Kumar Sharma",
        poiName: "Ahmedabad Warehouse Depot",
        arrivalTime: "2026-10-24T08:15:00Z",
        departureTime: "2026-10-24T09:12:00Z",
        durationMinutes: 57,
        odometerKm: 142850
      },
      {
        id: "poi-sum-b-2",
        vehicleRegNo: "MH 12 RN 4521",
        vehicleModel: "BharatBenz 3528C",
        imeiNo: "867492048129483",
        driverName: "Kunal Verma",
        poiName: "Sanand Manufacturing Plant",
        arrivalTime: "2026-10-24T11:30:00Z",
        departureTime: "2026-10-24T13:00:00Z",
        durationMinutes: 90,
        odometerKm: 98420
      }
    ];
  }

  async getMissedPois(params: { search?: string }) {
    return [
      {
        id: "miss-001",
        vehicleRegNo: "DL 01 CA 9876",
        vehicleModel: "Tata Signa 4825.TK",
        assignedRoute: "Delhi-Ahmedabad Arterial Corridor",
        scheduledPoiName: "Jaipur Highway Rest Point",
        geoCode: "JAI-RST-003",
        expectedArrivalTime: "2026-10-24T04:30:00Z",
        status: "MISSED",
        reason: "Driver bypassed scheduled stop due to highway detour"
      }
    ];
  }

  async getCollectionAddresses(params: { search?: string }) {
    return [
      {
        id: "col-001",
        vehicleRegNo: "DL 01 CA 9876",
        driverName: "Rajesh Kumar Sharma",
        clientName: "Gujarat Steel Traders",
        address: "Plot 42, GIDC Phase 1, Vatva, Ahmedabad",
        scheduledTime: "2026-10-24T10:00:00Z",
        completedTime: "2026-10-24T10:28:00Z",
        status: "COMPLETED",
        packagesCount: 14
      }
    ];
  }

  async streamExportPois(res: Response, params: PoiQueryDto) {
    const filename = `poi_export_${Date.now()}.csv`;

    const columns: ExportColumn<Poi>[] = [
      { key: "id", label: "POI ID" },
      { key: "name", label: "Name" },
      { key: "company", label: "Company" },
      { key: "branch", label: "Branch", format: (v) => v || "—" },
      { key: "geoCode", label: "Geo Code" },
      { key: "category", label: "Category" },
      { key: "street", label: "Street" },
      { key: "city", label: "City" },
      { key: "state", label: "State" },
      { key: "latitude", label: "Latitude" },
      { key: "longitude", label: "Longitude" },
      { key: "radiusMeters", label: "Radius (m)" },
      { key: "description", label: "Description", format: (v) => v || "—" },
      { key: "isActive", label: "Status", format: (v) => (v ? "Active" : "Inactive") },
      { key: "createdAt", label: "Created Date", format: (v) => (v ? new Date(v).toISOString() : "—") }
    ];

    const where: WhereOptions = {};
    if (params.search) {
      const q = `%${params.search.trim()}%`;
      where[Op.or as any] = [
        { name: { [Op.iLike]: q } },
        { geoCode: { [Op.iLike]: q } },
        { category: { [Op.iLike]: q } },
        { city: { [Op.iLike]: q } },
        { company: { [Op.iLike]: q } }
      ];
    }
    if (params.category && params.category !== "ALL") where.category = params.category;
    if (params.company && params.company !== "ALL") where.company = params.company;
    if (params.branch && params.branch !== "ALL") where.branch = params.branch;

    await streamCsvResponse(res, filename, columns, async (offset, limit) => {
      const rows = await Poi.findAll({
        where,
        offset,
        limit,
        order: [["createdAt", "DESC"]]
      });
      return rows;
    });
  }
}

export const poiService = new PoiService();
