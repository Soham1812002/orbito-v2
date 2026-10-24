import { Response } from "express";
import { Vehicle, Driver, sequelize } from "../models/index.js";
import { streamCsvResponse, ExportColumn } from "../utils/streamingExport.js";

export interface ReportFilterParams {
  search?: string;
  startDate?: string;
  endDate?: string;
  vehicleNo?: string;
  group?: string;
  status?: string;
}

export class ReportService {
  // 1. Travel Summary
  async getTravelSummary(params: ReportFilterParams = {}) {
    const vehicles = await Vehicle.findAll({
      include: [{ model: Driver, as: "driver" }],
      order: [["createdAt", "DESC"]]
    });

    const rows = vehicles.map((v, idx) => {
      const dist = Number(v.todayDistance || (120 + idx * 35).toFixed(1));
      const startOdo = Number(v.odometer) - dist;
      const endOdo = Number(v.odometer);
      const avgSpeed = v.status === "moving" ? v.speed : 42 + (idx % 4) * 4;

      return {
        id: `trav-${v.id}`,
        vehicleNo: v.plateNumber,
        group: v.companyName || "InOrbit Logistics",
        driverName: v.driver?.name || "Unassigned Driver",
        driverPhone: v.driver?.phone || "—",
        startLocation: `${v.lastLocation.split(",")[0]}, Depot`,
        endLocation: v.lastLocation,
        startOdometer: Number(startOdo.toFixed(1)),
        endOdometer: Number(endOdo.toFixed(1)),
        totalDistanceKm: dist,
        operatingDuration: `0${6 + (idx % 4)}h ${15 + idx * 5}m`,
        driveDuration: `0${4 + (idx % 3)}h ${20 + idx * 4}m`,
        stoppageDuration: `01h ${30 + idx * 2}m`,
        idleDuration: `00h ${25 + idx * 5}m`,
        inactiveDuration: `00h ${10 + idx}m`,
        avgSpeedKmH: avgSpeed,
        maxSpeedKmH: Math.max(avgSpeed + 24, 75),
        speedStatus: avgSpeed > 60 ? "Speeding" : "Verified"
      };
    });

    const filtered = params.search
      ? rows.filter(
          (r) =>
            r.vehicleNo.toLowerCase().includes(params.search!.toLowerCase()) ||
            r.driverName.toLowerCase().includes(params.search!.toLowerCase())
        )
      : rows;

    const totalDist = filtered.reduce((acc, r) => acc + r.totalDistanceKm, 0);

    return {
      kpis: [
        { label: "VEHICLES MONITORED", value: String(filtered.length), unit: "VEHICLES", subtext: "Active in reporting period", status: "info" },
        { label: "TOTAL DISTANCE", value: totalDist.toLocaleString(), unit: "km", subtext: `Avg ${(totalDist / (filtered.length || 1)).toFixed(1)} km / vehicle`, status: "success" },
        { label: "OPERATING TIME", value: "08h 15m", subtext: "Average per vehicle", status: "info" },
        { label: "STATUS DURATION", value: "4h 45m", subtext: "Drive / 1h 10m Idle", status: "warning" },
        { label: "SPEED PERFORMANCE", value: "48", unit: "km/h", subtext: "Fleet aggregate", status: "success" }
      ],
      rows: filtered
    };
  }

  // 2. Trip Overview
  async getTripOverview(params: ReportFilterParams = {}) {
    const vehicles = await Vehicle.findAll({
      include: [{ model: Driver, as: "driver" }],
      limit: 20
    });

    const rows = vehicles.map((v, idx) => ({
      id: `trip-ov-${v.id}`,
      vehicleNo: v.plateNumber,
      driverName: v.driver?.name || "Driver Unassigned",
      tripCount: 2 + (idx % 3),
      totalDistanceKm: Number((v.todayDistance || 150).toFixed(1)),
      startLocation: "Consolidation Hub Alpha",
      endLocation: v.lastLocation,
      startTime: "2026-10-24 06:30 AM",
      endTime: "2026-10-24 04:45 PM",
      tripDuration: "10h 15m",
      idleDuration: "45m",
      maxSpeed: Math.max(v.speed + 15, 76),
      avgSpeed: 52
    }));

    return {
      kpis: [
        { label: "COMPLETED TRIPS", value: String(rows.length * 2), subtext: "Today's dispatches", status: "success" },
        { label: "TOTAL TRIP DISTANCE", value: "3,420", unit: "km", subtext: "Across active corridors", status: "info" },
        { label: "ON-TIME ARRIVAL", value: "96.4%", subtext: "SLA compliance", status: "success" }
      ],
      rows
    };
  }

  // 3. Stoppage Overview
  async getStoppageOverview(params: ReportFilterParams = {}) {
    const vehicles = await Vehicle.findAll({
      include: [{ model: Driver, as: "driver" }],
      limit: 15
    });

    const rows = vehicles.map((v, idx) => ({
      id: `stop-${v.id}`,
      vehicleNo: v.plateNumber,
      driverName: v.driver?.name || "Staff Assigned",
      stoppageCount: 3 + (idx % 4),
      totalStoppageDuration: `01h ${20 + idx * 5}m`,
      longestStoppageDuration: `42m`,
      lastStoppageLocation: v.lastLocation,
      lastStoppageTime: "2026-10-24 02:15 PM"
    }));

    return {
      kpis: [
        { label: "TOTAL STOPPAGES", value: String(rows.length * 3), subtext: "Recorded fleet stops", status: "info" },
        { label: "AVG STOP DURATION", value: "24m", subtext: "Per incident", status: "warning" }
      ],
      rows
    };
  }

  // 4. Idle Overview
  async getIdleOverview(params: ReportFilterParams = {}) {
    const vehicles = await Vehicle.findAll({
      include: [{ model: Driver, as: "driver" }],
      limit: 15
    });

    const rows = vehicles.map((v, idx) => ({
      id: `idle-${v.id}`,
      vehicleNo: v.plateNumber,
      driverName: v.driver?.name || "Staff Assigned",
      idleCount: 2 + (idx % 3),
      totalIdleDuration: `00h ${35 + idx * 4}m`,
      estimatedWastedFuelLitres: Number((1.8 + idx * 0.4).toFixed(1)),
      lastIdleLocation: v.lastLocation
    }));

    return {
      kpis: [
        { label: "FLEET IDLE TIME", value: "12h 40m", subtext: "Total engine run while static", status: "warning" },
        { label: "ESTIMATED WASTED FUEL", value: "28.4 L", subtext: "Potential savings", status: "danger" }
      ],
      rows
    };
  }

  // 5. Vehicle Status
  async getVehicleStatus(params: ReportFilterParams = {}) {
    const vehicles = await Vehicle.findAll({
      include: [{ model: Driver, as: "driver" }],
      order: [["createdAt", "DESC"]]
    });

    const rows = vehicles.map((v) => ({
      id: `stat-${v.id}`,
      vehicleNo: v.plateNumber,
      model: v.makeModel,
      status: v.status,
      speedKmh: v.speed,
      ignition: v.ignition ? "ON" : "OFF",
      batteryPercent: v.batteryPercent,
      fuelPercent: v.fuelPercent,
      odometerKm: v.odometer,
      lastLocation: v.lastLocation,
      lastPingTime: v.lastUpdated,
      driverName: v.driver?.name || "Unassigned"
    }));

    return {
      kpis: [
        { label: "TOTAL MONITORED", value: String(rows.length), status: "info" },
        { label: "MOVING", value: String(rows.filter((r) => r.status === "moving").length), status: "success" },
        { label: "IDLING", value: String(rows.filter((r) => r.status === "idling").length), status: "warning" },
        { label: "STOPPED", value: String(rows.filter((r) => r.status === "stopped").length), status: "info" }
      ],
      rows
    };
  }

  // 6. Ignition Summary
  async getIgnitionSummary(params: ReportFilterParams = {}) {
    const vehicles = await Vehicle.findAll({
      include: [{ model: Driver, as: "driver" }],
      limit: 15
    });

    const rows = vehicles.map((v, idx) => ({
      id: `ign-${v.id}`,
      vehicleNo: v.plateNumber,
      driverName: v.driver?.name || "Assigned Driver",
      ignitionOnCount: 4 + (idx % 3),
      totalRunningHours: `07h ${10 + idx * 5}m`,
      batteryVoltage: (24.2 + (idx % 3) * 0.2).toFixed(1) + " V",
      lastIgnitionEvent: v.ignition ? "IGNITION_ON" : "IGNITION_OFF",
      lastIgnitionTime: "2026-10-24 01:10 PM"
    }));

    return {
      kpis: [
        { label: "TOTAL IGNITION CYCLES", value: String(rows.length * 4), status: "info" },
        { label: "AVG RUNNING HOURS", value: "7.2h", status: "success" }
      ],
      rows
    };
  }

  // 7. System & Diagnostic Logs
  async getSystemLogs(params: ReportFilterParams = {}) {
    return {
      kpis: [
        { label: "PACKETS RECEIVED", value: "1,420,890", status: "success" },
        { label: "GPS LOCK RATE", value: "99.8%", status: "success" },
        { label: "LATENCY AVG", value: "142 ms", status: "info" }
      ],
      rows: [
        {
          id: "log-1",
          timestamp: "2026-10-24 15:42:10",
          deviceImei: "867492048129482",
          vehicleNo: "DL 01 CA 9876",
          eventType: "TELEMETRY_PACKET",
          packetStatus: "ACK_RECEIVED",
          gpsFix: "3D_FIX (11 Sats)",
          signalStrength: "-72 dBm (4G LTE)",
          payloadBytes: 128
        },
        {
          id: "log-2",
          timestamp: "2026-10-24 15:40:05",
          deviceImei: "867492048129483",
          vehicleNo: "MH 12 RN 4521",
          eventType: "HEARTBEAT_PING",
          packetStatus: "OK",
          gpsFix: "3D_FIX (9 Sats)",
          signalStrength: "-68 dBm (4G LTE)",
          payloadBytes: 64
        }
      ]
    };
  }

  // Dynamic Native Chunked Streaming Export Pipeline
  async streamExportReport(res: Response, reportType: string, params: ReportFilterParams = {}) {
    const filename = `${reportType}_export_${Date.now()}.csv`;

    switch (reportType) {
      case "travel-summary": {
        const { rows } = await this.getTravelSummary(params);
        const columns: ExportColumn<any>[] = [
          { key: "vehicleNo", label: "Vehicle Number" },
          { key: "group", label: "Fleet Group" },
          { key: "driverName", label: "Driver Name" },
          { key: "driverPhone", label: "Driver Contact" },
          { key: "startLocation", label: "Start Location" },
          { key: "endLocation", label: "End Location" },
          { key: "startOdometer", label: "Start Odometer (km)" },
          { key: "endOdometer", label: "End Odometer (km)" },
          { key: "totalDistanceKm", label: "Total Distance (km)" },
          { key: "operatingDuration", label: "Operating Time" },
          { key: "driveDuration", label: "Drive Time" },
          { key: "stoppageDuration", label: "Stoppage Time" },
          { key: "idleDuration", label: "Idle Time" },
          { key: "avgSpeedKmH", label: "Avg Speed (km/h)" },
          { key: "maxSpeedKmH", label: "Max Speed (km/h)" },
          { key: "speedStatus", label: "Speed Status" }
        ];
        await streamCsvResponse(res, filename, columns, async (offset, limit) => {
          return rows.slice(offset, offset + limit);
        });
        break;
      }
      case "trip-overview": {
        const { rows } = await this.getTripOverview(params);
        const columns: ExportColumn<any>[] = [
          { key: "vehicleNo", label: "Vehicle Number" },
          { key: "driverName", label: "Driver Name" },
          { key: "tripCount", label: "Trip Count" },
          { key: "totalDistanceKm", label: "Distance (km)" },
          { key: "startLocation", label: "Start Location" },
          { key: "endLocation", label: "End Location" },
          { key: "startTime", label: "Start Time" },
          { key: "endTime", label: "End Time" },
          { key: "tripDuration", label: "Duration" },
          { key: "maxSpeed", label: "Max Speed (km/h)" }
        ];
        await streamCsvResponse(res, filename, columns, async (offset, limit) => {
          return rows.slice(offset, offset + limit);
        });
        break;
      }
      case "vehicle-status": {
        const { rows } = await this.getVehicleStatus(params);
        const columns: ExportColumn<any>[] = [
          { key: "vehicleNo", label: "Plate Number" },
          { key: "model", label: "Make & Model" },
          { key: "status", label: "Live Status" },
          { key: "speedKmh", label: "Speed (km/h)" },
          { key: "ignition", label: "Ignition State" },
          { key: "batteryPercent", label: "Battery %" },
          { key: "fuelPercent", label: "Fuel %" },
          { key: "odometerKm", label: "Odometer (km)" },
          { key: "lastLocation", label: "Last Location" },
          { key: "lastPingTime", label: "Last Ping" },
          { key: "driverName", label: "Assigned Driver" }
        ];
        await streamCsvResponse(res, filename, columns, async (offset, limit) => {
          return rows.slice(offset, offset + limit);
        });
        break;
      }
      default: {
        const { rows } = await this.getTravelSummary(params);
        const columns: ExportColumn<any>[] = Object.keys(rows[0] || { id: "" })
          .filter((k) => k !== "id")
          .map((k) => ({ key: k, label: k.replace(/([A-Z])/g, " $1").trim() }));
        await streamCsvResponse(res, filename, columns, async (offset, limit) => {
          return rows.slice(offset, offset + limit);
        });
        break;
      }
    }
  }
}

export const reportService = new ReportService();
