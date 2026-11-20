import { Response } from "express";
import { Vehicle, Driver, AppConfig, sequelize } from "../models/index.js";
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
      order: [["created_at", "DESC"]]
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
      vehicleType: v.makeModel || "Heavy Commercial",
      driverName: v.driver?.name || "Driver Unassigned",
      totalTrips: 2 + (idx % 3),
      tripCount: 2 + (idx % 3),
      totalDistanceKm: Number((v.todayDistance || 150).toFixed(1)),
      startLocation: "Consolidation Hub Alpha",
      endLocation: v.lastLocation,
      startTime: "2026-10-24 06:30 AM",
      endTime: "2026-10-24 04:45 PM",
      driveTime: "10h 15m",
      tripDuration: "10h 15m",
      idleTime: "45m",
      idleDuration: "45m",
      avgSpeedKmH: 52,
      avgSpeed: 52,
      maxSpeedKmH: Math.max(v.speed + 15, 76),
      maxSpeed: Math.max(v.speed + 15, 76),
      alertsCount: idx % 2 === 0 ? 1 : 0
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
      branch: v.companyName || "Western Fleet",
      driverName: v.driver?.name || "Staff Assigned",
      totalStoppages: 3 + (idx % 4),
      stoppageCount: 3 + (idx % 4),
      totalStoppageTime: `01h ${20 + idx * 5}m`,
      totalStoppageDuration: `01h ${20 + idx * 5}m`,
      longestStoppage: "42m",
      longestStoppageDuration: "42m",
      avgStoppageTime: "24m",
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
      branch: v.companyName || "Western Fleet",
      driverName: v.driver?.name || "Staff Assigned",
      totalIdleEvents: 2 + (idx % 3),
      idleCount: 2 + (idx % 3),
      totalIdleTime: `00h ${35 + idx * 4}m`,
      totalIdleDuration: `00h ${35 + idx * 4}m`,
      longestIdle: "25m",
      fuelWastedLitres: Number((1.8 + idx * 0.4).toFixed(1)),
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
      order: [["created_at", "DESC"]]
    });

    const rows = vehicles.map((v) => {
      const statusTitle = v.status ? v.status.charAt(0).toUpperCase() + v.status.slice(1) : "Running";
      return {
        id: `stat-${v.id}`,
        organization: v.companyName || "InOrbit Logistics",
        vehicleNo: v.plateNumber,
        vehicleType: v.makeModel.split(" ")[0] || "Rigid Truck",
        model: v.makeModel,
        bodyType: "Rigid Truck",
        powerIgnition: (v.ignition ? "ON" : "OFF") as "ON" | "OFF",
        status: statusTitle as any,
        speedKmH: v.speed,
        speedKmh: v.speed,
        batteryVoltage: "24.2 V",
        connectivity: "4G LTE (Online)",
        imei: v.deviceImei || "867492048129482",
        simNumber: "8991829384729108",
        lastCommunication: v.lastUpdated || "Just now",
        location: v.lastLocation,
        ignition: v.ignition ? "ON" : "OFF",
        batteryPercent: v.batteryPercent,
        fuelPercent: v.fuelPercent,
        odometerKm: v.odometer,
        lastLocation: v.lastLocation,
        lastPingTime: v.lastUpdated,
        driverName: v.driver?.name || "Unassigned"
      };
    });

    return {
      kpis: [
        { label: "TOTAL MONITORED", value: String(rows.length), status: "info" },
        { label: "MOVING", value: String(rows.filter((r) => r.status.toLowerCase() === "moving" || r.status.toLowerCase() === "running").length), status: "success" },
        { label: "IDLING", value: String(rows.filter((r) => r.status.toLowerCase() === "idling" || r.status.toLowerCase() === "idle").length), status: "warning" },
        { label: "STOPPED", value: String(rows.filter((r) => r.status.toLowerCase() === "stopped").length), status: "info" }
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
      company: v.companyName || "InOrbit Logistics",
      branch: "Northern Terminal",
      vehicleNo: v.plateNumber,
      driverName: v.driver?.name || "Assigned Driver",
      imei: v.deviceImei || "867492048129482",
      ignitionOnDuration: `07h ${10 + idx * 5}m`,
      ignitionOffDuration: `03h ${20 + idx * 4}m`,
      runningTime: `06h ${45 + idx * 3}m`,
      idleTime: `00h ${25 + idx * 2}m`,
      distanceKm: Number(v.todayDistance || (145 + idx * 20).toFixed(1)),
      ignitionCycles: 4 + (idx % 3),
      ignitionOnCount: 4 + (idx % 3),
      currentStatus: (v.ignition ? "Engine running" : "Stopped") as "Engine running" | "Stopped",
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
    const vehicles = await Vehicle.findAll({ limit: 5 });
    const rows = vehicles.map((v, idx) => ({
      id: `log-${v.id || idx + 1}`,
      timestamp: "2026-10-24 15:42:10",
      company: v.companyName || "InOrbit Logistics",
      branch: "Western Operations",
      deviceImei: v.deviceImei || `86749204812948${idx + 2}`,
      simNumber: `899182938472910${idx + 1}`,
      vehicleNo: v.plateNumber,
      coordinates: `${Number(v.latitude || 28.6139).toFixed(4)}° N, ${Number(v.longitude || 77.2090).toFixed(4)}° E`,
      signals: "12 Sats · -68 dBm (4G)",
      movementStatus: v.status === "moving" ? `Moving (${v.speed} km/h)` : "Stationary (0 km/h)",
      packetTimingMs: 42 + idx * 12,
      firmware: "Teltonika_v03.28.02",
      gpsValid: true,
      severity: (idx === 2 ? "WARN" : "INFO") as "INFO" | "WARN" | "ERROR",
      eventType: "TELEMETRY_PACKET",
      packetStatus: "ACK_RECEIVED",
      gpsFix: "3D_FIX (11 Sats)",
      signalStrength: "-72 dBm (4G LTE)",
      payloadBytes: 128
    }));

    return {
      kpis: [
        { label: "PACKETS RECEIVED", value: "1,420,890", status: "success" },
        { label: "GPS LOCK RATE", value: "99.8%", status: "success" },
        { label: "LATENCY AVG", value: "142 ms", status: "info" }
      ],
      rows
    };
  }

  // 8. Inactive Summary & Details
  async getInactiveSummary(params: ReportFilterParams = {}) {
    const vehicles = await Vehicle.findAll({
      include: [{ model: Driver, as: "driver" }],
      order: [["created_at", "DESC"]]
    });

    const rows = vehicles.map((v, idx) => ({
      id: `inact-${v.id}`,
      vehicleNo: v.plateNumber,
      branch: v.companyName || "Central Fleet",
      driverName: v.driver?.name || "Unassigned Staff",
      inactiveSince: "2026-10-22 18:00",
      inactiveDuration: `0${1 + (idx % 3)}d 0${4 + idx}h`,
      lastLocation: v.lastLocation,
      gpsStatus: (idx % 2 === 0 ? "OFFLINE GPS" : "OVER 24 HR") as any,
      eventCount: 1 + (idx % 3)
    }));

    return {
      kpis: [
        { label: "INACTIVE ASSETS", value: String(rows.length), status: "warning" as const },
        { label: "AVG INACTIVE DURATION", value: "32h", status: "info" as const }
      ],
      rows
    };
  }

  async getInactiveDetails(vehicleId: string, date?: string) {
    const vehicle = await Vehicle.findByPk(vehicleId);
    return {
      vehicleId,
      events: [
        {
          id: `inact-evt-1`,
          date: date || new Date().toISOString().split("T")[0],
          startTime: "09:00 AM",
          endTime: "05:00 PM",
          duration: "08h 00m",
          reason: "Scheduled Depot Staging & Maintenance Inspection",
          lastKnownLocation: vehicle?.lastLocation || "Central NCR Logistics Hub",
          batteryStatus: "Battery Health: 94%"
        }
      ]
    };
  }

  // 9. Digital Port Sensor Telemetry
  async getDigitalPortSummary(params: ReportFilterParams = {}) {
    const vehicles = await Vehicle.findAll({
      include: [{ model: Driver, as: "driver" }],
      order: [["created_at", "DESC"]]
    });

    const rows = vehicles.map((v, idx) => ({
      id: `dp-${v.id}`,
      vehicleNo: v.plateNumber,
      organisation: v.companyName || "InOrbit Logistics",
      model: v.makeModel,
      driverCode: `DRV-00${idx + 1}`,
      driverName: v.driver?.name || "Staff Assigned",
      openEvents: 4 + (idx % 3),
      closeEvents: 4 + (idx % 3),
      portDuration: `04h ${15 + idx * 5}m`,
      activePortsCount: 3
    }));

    return {
      kpis: [
        { label: "DIGITAL SENSORS ONLINE", value: String(rows.length * 3), status: "success" as const },
        { label: "PORT TRANSITIONS TODAY", value: String(rows.length * 8), status: "info" as const }
      ],
      rows
    };
  }

  async getDigitalPortDetails(vehicleId: string, _date?: string) {
    const vehicle = await Vehicle.findByPk(vehicleId);
    return {
      vehicleId,
      events: [
        {
          portNumber: "DIN 1",
          portName: "Primary Ignition Sensor",
          imei: vehicle?.deviceImei || "867492048129482",
          onDuration: "06h 40m",
          timesOn: 5,
          offDuration: "02h 15m",
          timesOff: 5,
          gpsStatus: "Online" as const,
          currentStatus: "Open" as const
        },
        {
          portNumber: "DIN 2",
          portName: "Cargo Security Door Switch",
          imei: vehicle?.deviceImei || "867492048129482",
          onDuration: "00h 45m",
          timesOn: 4,
          offDuration: "08h 10m",
          timesOff: 4,
          gpsStatus: "Online" as const,
          currentStatus: "Closed" as const
        }
      ]
    };
  }

  // 10. AC & Temperature Telemetry
  async getAcSummary(params: ReportFilterParams = {}) {
    const vehicles = await Vehicle.findAll({
      include: [{ model: Driver, as: "driver" }],
      order: [["created_at", "DESC"]]
    });

    const rows = vehicles.map((v, idx) => ({
      id: `ac-${v.id}`,
      branch: v.companyName || "Central Fleet",
      vehicleNo: v.plateNumber,
      vehicleName: v.makeModel,
      brand: v.makeModel.split(" ")[0] || "Fleet",
      model: v.makeModel,
      driverName: v.driver?.name || "Assigned Driver",
      imei: v.deviceImei || "867492048129482",
      acOnDistanceKm: Number((Number(v.todayDistance || 100) * 0.75).toFixed(1)),
      acOnDuration: `05h ${20 + idx * 5}m`,
      acOffDuration: `02h ${10 + idx * 2}m`,
      acCycles: 3 + (idx % 3),
      currentStatus: (v.ignition ? "AC ON" : "AC OFF") as any
    }));

    return {
      kpis: [
        { label: "AC ENABLED FLEET", value: String(rows.length), status: "info" as const },
        { label: "AVG AC RUNTIME", value: "05h 25m", status: "success" as const }
      ],
      rows
    };
  }

  async getAcDetails(vehicleId: string, _date?: string) {
    const vehicle = await Vehicle.findByPk(vehicleId);
    return {
      vehicleId,
      events: [
        {
          id: `ac-evt-1`,
          eventTime: "2026-10-24 09:15 AM",
          acStatus: "ON" as const,
          runtime: "03h 40m",
          ignitionStatus: "ON" as const,
          location: vehicle?.lastLocation || "Yamuna Expressway, KM-42",
          overlapDuration: "03h 40m"
        }
      ]
    };
  }

  // 11. SMS & Email Communications Summary
  async getSmsEmailSummary(params: ReportFilterParams = {}) {
    const vehicles = await Vehicle.findAll({
      include: [{ model: Driver, as: "driver" }],
      order: [["created_at", "DESC"]]
    });

    const rows = vehicles.map((v, idx) => ({
      id: `comms-${v.id}`,
      company: v.companyName || "InOrbit Logistics",
      branch: "Western Operations",
      vehicleNo: v.plateNumber,
      vehicleBrand: v.makeModel.split(" ")[0] || "Fleet",
      vehicleModel: v.makeModel,
      sentSms: 12 + (idx % 4),
      sentEmail: 4 + (idx % 2),
      deliveredSms: 12 + (idx % 4),
      failedSms: 0,
      lastTriggerType: idx % 2 === 0 ? "OVERSPEED_ALERT" : "GEOFENCE_EXIT",
      lastSentTimestamp: "2026-10-24 14:15"
    }));

    return {
      kpis: [
        { label: "SMS DELIVERED TODAY", value: String(rows.length * 12), status: "success" as const },
        { label: "DELIVERY SUCCESS RATE", value: "100%", status: "success" as const }
      ],
      rows
    };
  }

  // 12. Vehicle Location Report
  async getVehicleLocation(params: ReportFilterParams = {}) {
    const vehicles = await Vehicle.findAll({
      include: [{ model: Driver, as: "driver" }],
      order: [["created_at", "DESC"]]
    });

    const rows = vehicles.map((v) => ({
      id: `loc-${v.id}`,
      company: v.companyName || "InOrbit Logistics",
      branch: "Regional Fleet",
      vehicleNo: v.plateNumber,
      driverName: v.driver?.name || "Unassigned",
      driverPhone: v.driver?.phone || "N/A",
      imei: v.deviceImei || "867492048129482",
      currentAddress: v.lastLocation,
      latitude: Number(v.latitude),
      longitude: Number(v.longitude),
      speedKmH: v.speed,
      heading: `${v.heading}° Forward`,
      gpsSignal: "ONLINE" as const,
      lastUpdated: v.lastUpdated || "Just now"
    }));

    return {
      kpis: [
        { label: "LIVE ASSETS MAPPED", value: String(rows.length), status: "success" as const },
        { label: "ONLINE ACCURACY", value: "99.8%", status: "success" as const }
      ],
      rows
    };
  }

  // 13. Raw Device Telemetry Packet Log
  async getDeviceTelemetryPacket(imei: string) {
    const vehicle = await Vehicle.findOne({ where: { deviceImei: imei } });
    return {
      imei,
      company: vehicle?.companyName || "InOrbit Logistics",
      branch: "Fleet Terminal",
      vehicleNo: vehicle?.plateNumber || "DL 01 CA 9876",
      vehicleModel: vehicle?.makeModel || "Tata Signa 4825.TK",
      deviceModel: "Teltonika FMC130",
      status: "ONLINE" as const,
      timestamp: new Date().toISOString(),
      rawPacketString: "$$0028,867492048129482,AA01,28.6139,77.2090,64,78,1,78,94,142850*4F",
      gpsValid: true,
      latitude: Number(vehicle?.latitude || 28.6139),
      longitude: Number(vehicle?.longitude || 77.2090),
      altitudeM: 214,
      speedKmH: vehicle?.speed || 64,
      satellites: 12,
      gsmSignalDbm: -68,
      externalVoltageV: 24.2,
      internalBatteryV: 3.8,
      ignition: vehicle?.ignition ?? true,
      digitalInputs: "DIN1:1, DIN2:0, DIN3:0",
      digitalOutputs: "DOUT1:0, DOUT2:0"
    };
  }

  // 14. Scheduled Automated Reports - Stored persistently in PostgreSQL (app_configs)
  async getScheduledReports() {
    let records = await AppConfig.findAll({
      where: { moduleKey: "scheduled-reports" },
      order: [["created_at", "DESC"]]
    });

    // Seed defaults into PostgreSQL if table is empty
    if (records.length === 0) {
      await AppConfig.bulkCreate([
        {
          moduleKey: "scheduled-reports",
          data: {
            scheduleName: "Weekly Travel Fleet Summary",
            reportType: "Travel Summary",
            company: "InOrbit Logistics",
            branch: "All Branches",
            vehicleScope: "Whole Commercial Fleet (100+)",
            frequency: "Weekly",
            fileFormat: "Excel (.xlsx)",
            nextDelivery: "Monday, 06:00 AM",
            recipients: ["fleet-ops@inorbit.com", "director@inorbit.com"],
            lastDelivered: "2026-10-20 06:00 AM",
            deliveryStatus: "Active"
          },
          isActive: true
        },
        {
          moduleKey: "scheduled-reports",
          data: {
            scheduleName: "Daily Critical Stoppage Audit",
            reportType: "Stoppage Summary",
            company: "InOrbit Logistics",
            branch: "West Hub",
            vehicleScope: "Linehaul Trucks",
            frequency: "Daily",
            fileFormat: "PDF",
            nextDelivery: "Tomorrow, 07:00 AM",
            recipients: ["dispatch@inorbit.com"],
            lastDelivered: "Today, 07:00 AM",
            deliveryStatus: "Active"
          },
          isActive: true
        }
      ]);

      records = await AppConfig.findAll({
        where: { moduleKey: "scheduled-reports" },
        order: [["created_at", "DESC"]]
      });
    }

    const items = records.map((r) => ({
      id: r.id,
      scheduleName: r.data?.scheduleName || "Untitled Schedule",
      reportType: r.data?.reportType || "Travel Summary",
      company: r.data?.company || "InOrbit Logistics",
      branch: r.data?.branch || "All Branches",
      vehicleScope: r.data?.vehicleScope || "All Vehicles",
      frequency: r.data?.frequency || "Daily",
      fileFormat: r.data?.fileFormat || "Excel (.xlsx)",
      nextDelivery: r.data?.nextDelivery || "Tomorrow, 06:00 AM",
      recipients: Array.isArray(r.data?.recipients) ? r.data.recipients : [r.data?.recipients].filter(Boolean),
      isActive: r.isActive,
      lastDelivered: r.data?.lastDelivered || "Pending Delivery",
      deliveryStatus: r.isActive ? "Active" : "Paused"
    }));

    const activeCount = items.filter((i) => i.isActive).length;

    return {
      kpis: [
        { label: "ACTIVE CRON SCHEDULES", value: String(activeCount), status: "success" as const },
        { label: "NEXT DELIVERY WINDOW", value: "06:00 AM", status: "info" as const }
      ],
      items
    };
  }

  async createScheduledReport(payload: any) {
    const record = await AppConfig.create({
      moduleKey: "scheduled-reports",
      data: {
        scheduleName: payload.scheduleName || "Custom Scheduled Report",
        reportType: payload.reportType || "Travel Summary",
        company: payload.company || "InOrbit Logistics",
        branch: payload.branch || "All Branches",
        vehicleScope: payload.vehicles || payload.vehicleScope || "All Vehicles",
        frequency: payload.frequency || "Daily",
        fileFormat: payload.fileFormat || "Excel (.xlsx)",
        nextDelivery: "Tomorrow, 06:00 AM",
        recipients: typeof payload.recipients === "string" ? payload.recipients.split(",") : payload.recipients || [],
        deliveryStatus: "Active"
      },
      isActive: true
    });

    return {
      id: record.id,
      ...record.data,
      isActive: record.isActive
    };
  }

  async toggleScheduledReport(id: string) {
    const record = await AppConfig.findByPk(id);
    if (!record) {
      const err: any = new Error("Scheduled report not found");
      err.status = 404;
      throw err;
    }
    await record.update({ isActive: !record.isActive });
    return { id: record.id, isActive: record.isActive };
  }

  async deleteScheduledReport(id: string) {
    const record = await AppConfig.findByPk(id);
    if (!record) {
      const err: any = new Error("Scheduled report not found");
      err.status = 404;
      throw err;
    }
    await record.destroy();
    return { id, deleted: true };
  }

  // 15. Vehicle Activation Report
  async getVehicleActivation(params: ReportFilterParams = {}) {
    const vehicles = await Vehicle.findAll({
      include: [{ model: Driver, as: "driver" }],
      order: [["created_at", "DESC"]]
    });

    const rows = vehicles.map((v, idx) => ({
      id: `act-${v.id}`,
      company: v.companyName || "InOrbit Logistics",
      branch: "Regional Logistics Hub",
      vehicleType: v.makeModel.split(" ")[0] || "Fleet Vehicle",
      vehicleNo: v.plateNumber,
      model: v.makeModel,
      imei: v.deviceImei || "867492048129482",
      simNo: `899182938472910${idx}`,
      simNumber: `899182938472910${idx}`,
      deviceModel: "Teltonika FMC130",
      vehicleCreationDate: "2025-10-10",
      gpsCreationDate: "2025-10-12",
      vehicleActivationDate: "2025-10-15",
      activationDate: "2025-10-15",
      expiryDate: "2027-10-15",
      activatedBy: "Rakesh Verma (Authorized OEM)",
      technicianName: "Rakesh Verma (Authorized OEM)",
      status: "ACTIVATED" as const,
      daysRemaining: 730
    }));

    return {
      kpis: [
        { label: "ACTIVATED TELEMATICS", value: String(rows.length), status: "success" as const },
        { label: "EXPIRING IN 30 DAYS", value: "0", status: "success" as const }
      ],
      rows
    };
  }

  // 16. Detailed Event Breakdown Methods
  async getTripDetails(vehicleId: string, _date?: string) {
    const vehicle = await Vehicle.findByPk(vehicleId, {
      include: [{ model: Driver, as: "driver" }]
    });

    return {
      vehicleId,
      trips: [
        {
          tripId: "TRIP-2026-001",
          date: _date || new Date().toISOString().split("T")[0],
          startTime: "06:30 AM",
          endTime: "11:45 AM",
          duration: "05h 15m",
          startLocation: "Depot Alpha, Greater Noida Hub",
          endLocation: vehicle?.lastLocation || "Yamuna Expressway KM-42, UP",
          distanceKm: Number(vehicle?.todayDistance || 184.2),
          driveTime: "04h 30m",
          idleTime: "00h 45m",
          avgSpeedKmH: 54,
          maxSpeedKmH: 78,
          driverName: vehicle?.driver?.name || "Rajesh Kumar",
          status: "Completed" as const
        }
      ]
    };
  }

  async getStoppageDetails(vehicleId: string, _date?: string) {
    const vehicle = await Vehicle.findByPk(vehicleId);
    return {
      vehicleId,
      events: [
        {
          id: "stop-evt-1",
          eventNumber: "#01",
          date: _date || new Date().toISOString().split("T")[0],
          startTime: "08:15 AM",
          endTime: "08:45 AM",
          duration: "00h 30m",
          location: vehicle?.lastLocation || "Jewar Toll Plaza Rest Area, UP",
          coordinates: `${vehicle?.latitude || 28.6139}, ${vehicle?.longitude || 77.2090}`,
          ignitionState: "OFF" as const,
          nearbyPoi: "Yamuna Toll Rest Plaza"
        }
      ]
    };
  }

  async getIdleDetails(vehicleId: string, _date?: string) {
    const vehicle = await Vehicle.findByPk(vehicleId);
    return {
      vehicleId,
      events: [
        {
          id: "idle-evt-1",
          eventNumber: "#01",
          date: _date || new Date().toISOString().split("T")[0],
          startTime: "11:20 AM",
          endTime: "11:45 AM",
          duration: "00h 25m",
          location: vehicle?.lastLocation || "Industrial Cluster Loading Bay, Sector 8",
          ignitionState: "Engine idle" as const,
          batteryVoltage: "24.2 V"
        }
      ]
    };
  }

  async getIgnitionDetails(vehicleId: string, _date?: string) {
    const vehicle = await Vehicle.findByPk(vehicleId, {
      include: [{ model: Driver, as: "driver" }]
    });
    return {
      vehicleId,
      events: [
        {
          id: "ign-evt-1",
          eventNumber: "#01",
          routeName: "Depot Alpha → Greater Noida Logistic Hub",
          ignitionOnTime: "06:30 AM",
          ignitionOffTime: "11:45 AM",
          runningTime: "05h 15m",
          idleTime: "00h 25m",
          distanceKm: Number(vehicle?.todayDistance || 184.2),
          avgSpeedKmH: 52,
          maxSpeedKmH: 76,
          startAddress: "Depot Alpha Staging Yard, Sector 12",
          endAddress: vehicle?.lastLocation || "Active Corridor SH-24, KM 42",
          duration: "05h 15m",
          batteryVoltage: "24.2 V",
          driverName: vehicle?.driver?.name || "Assigned Driver"
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
