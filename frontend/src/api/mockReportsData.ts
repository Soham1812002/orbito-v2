import {
  TravelSummaryRow,
  TripOverviewRow,
  TripDetailEvent,
  StoppageOverviewRow,
  StoppageEvent,
  IdleOverviewRow,
  IdleEvent,
  InactiveOverviewRow,
  InactiveEvent,
  DigitalPortOverviewRow,
  DigitalPortEvent,
  AcSummaryOverviewRow,
  AcEvent,
  SmsEmailSummaryRow,
  VehicleStatusRow,
  VehicleLocationRow,
  DeviceTelemetryPacket,
  SystemLogRow,
  ScheduledReportItem,
  VehicleActivationRow,
  IgnitionSummaryOverviewRow,
  IgnitionEvent,
  ReportKpiMetric
} from "@/types/reports.types";

// 02. Travel Summary Mock Data
export const mockTravelSummaryKpis: ReportKpiMetric[] = [
  { label: "VEHICLES MONITORED", value: "247", unit: "VEHICLES", subtext: "Active in reporting period", status: "info" },
  { label: "TOTAL DISTANCE", value: "42,400.6", unit: "km", subtext: "Avg 171.6 km / vehicle", status: "success" },
  { label: "OPERATING TIME", value: "08h 24m", subtext: "Average per vehicle", status: "info" },
  { label: "STATUS DURATION", value: "4h 52m", subtext: "Drive / 1h 26m Idle", status: "warning" },
  { label: "SPEED PERFORMANCE", value: "46", unit: "km/h", subtext: "78 km/h max · Verified", status: "success" }
];

export const mockTravelSummaryRows: TravelSummaryRow[] = [
  {
    id: "trav-1",
    vehicleNo: "GJ 01 TX 2045",
    group: "Apex Freight Central",
    driverName: "Ramesh Patel",
    driverPhone: "+91 98250 18421",
    startLocation: "Narol, Ahmedabad",
    endLocation: "Vapi Industrial Estate",
    startOdometer: 42216.0,
    endOdometer: 42400.6,
    totalDistanceKm: 184.6,
    operatingDuration: "08h 24m",
    driveDuration: "4h 52m",
    stoppageDuration: "1h 39m",
    idleDuration: "1h 26m",
    inactiveDuration: "27m",
    avgSpeedKmH: 46,
    maxSpeedKmH: 78,
    speedStatus: "Verified"
  },
  {
    id: "trav-2",
    vehicleNo: "GJ 01 RT 4821",
    group: "Ahmedabad Central Express",
    driverName: "Dinesh Sharma",
    driverPhone: "+91 98980 44211",
    startLocation: "Odhav Ring Road, Ahmedabad",
    endLocation: "Sanand GIDC Gateway",
    startOdometer: 68140.2,
    endOdometer: 68310.8,
    totalDistanceKm: 170.6,
    operatingDuration: "07h 45m",
    driveDuration: "4h 15m",
    stoppageDuration: "2h 10m",
    idleDuration: "50m",
    inactiveDuration: "30m",
    avgSpeedKmH: 42,
    maxSpeedKmH: 72,
    speedStatus: "Verified"
  },
  {
    id: "trav-3",
    vehicleNo: "MH 12 QX 9812",
    group: "Western Fleet Corridor",
    driverName: "Amitabh Kulkarni",
    driverPhone: "+91 97654 32109",
    startLocation: "Bhiwandi Logistics Hub",
    endLocation: "Pune Chakan MIDC",
    startOdometer: 114520.0,
    endOdometer: 114763.2,
    totalDistanceKm: 243.2,
    operatingDuration: "09h 15m",
    driveDuration: "5h 31m",
    stoppageDuration: "2h 24m",
    idleDuration: "1h 05m",
    inactiveDuration: "15m",
    avgSpeedKmH: 51,
    maxSpeedKmH: 84,
    speedStatus: "Speeding"
  },
  {
    id: "trav-4",
    vehicleNo: "GJ 05 AB 1234",
    group: "Surat Express Line",
    driverName: "Vijay Solanki",
    driverPhone: "+91 98765 43210",
    startLocation: "Sachin GIDC, Surat",
    endLocation: "Ankleshwar Industrial Estate",
    startOdometer: 31200.0,
    endOdometer: 31335.5,
    totalDistanceKm: 135.5,
    operatingDuration: "06h 10m",
    driveDuration: "3h 40m",
    stoppageDuration: "1h 45m",
    idleDuration: "40m",
    inactiveDuration: "05m",
    avgSpeedKmH: 48,
    maxSpeedKmH: 75,
    speedStatus: "Verified"
  }
];

// 03 & 04. Trip Summary Mock Data
export const mockTripOverviewKpis: ReportKpiMetric[] = [
  { label: "MONITORED VEHICLES", value: "4", unit: "VEHICLES", status: "info" },
  { label: "TOTAL TRIPS", value: "28", unit: "COMPLETED", status: "success" },
  { label: "FLEET DISTANCE", value: "733.9", unit: "km", status: "info" },
  { label: "TOTAL DRIVE TIME", value: "18h 18m", status: "warning" },
  { label: "FLEET ALERTS", value: "6", unit: "TRIP ALERTS", status: "danger" }
];

export const mockTripOverviewRows: TripOverviewRow[] = [
  {
    id: "GJ 01 TX 2045",
    vehicleNo: "GJ 01 TX 2045",
    vehicleType: "Container Truck · Tata Prima 5530",
    totalTrips: 6,
    totalDistanceKm: 184.6,
    driveTime: "4h 52m",
    idleTime: "1h 26m",
    avgSpeedKmH: 46,
    maxSpeedKmH: 78,
    alertsCount: 2
  },
  {
    id: "GJ 01 RT 4821",
    vehicleNo: "GJ 01 RT 4821",
    vehicleType: "18 FT Container · Tata Ultra 1518",
    totalTrips: 8,
    totalDistanceKm: 243.2,
    driveTime: "5h 31m",
    idleTime: "50m",
    avgSpeedKmH: 51,
    maxSpeedKmH: 84,
    alertsCount: 1
  },
  {
    id: "MH 12 QX 9812",
    vehicleNo: "MH 12 QX 9812",
    vehicleType: "Heavy Multi-axle · Ashok Leyland 4220",
    totalTrips: 5,
    totalDistanceKm: 170.6,
    driveTime: "4h 15m",
    idleTime: "1h 05m",
    avgSpeedKmH: 42,
    maxSpeedKmH: 72,
    alertsCount: 0
  },
  {
    id: "GJ 05 AB 1234",
    vehicleNo: "GJ 05 AB 1234",
    vehicleType: "Light Commercial · Eicher Pro 2049",
    totalTrips: 9,
    totalDistanceKm: 135.5,
    driveTime: "3h 40m",
    idleTime: "40m",
    avgSpeedKmH: 48,
    maxSpeedKmH: 75,
    alertsCount: 3
  }
];

export const mockVehicleTripDetails: TripDetailEvent[] = [
  {
    tripId: "TRP-2026-0816-01",
    date: "16 Aug 2026",
    startTime: "06:14 AM",
    endTime: "08:22 AM",
    duration: "02h 08m",
    startLocation: "Narol Hub, Ahmedabad",
    endLocation: "Anand Bypass toll plaza",
    distanceKm: 68.4,
    driveTime: "01h 48m",
    idleTime: "20m",
    avgSpeedKmH: 44,
    maxSpeedKmH: 76,
    driverName: "Ramesh Patel",
    status: "Completed"
  },
  {
    tripId: "TRP-2026-0816-02",
    date: "16 Aug 2026",
    startTime: "09:38 AM",
    endTime: "11:12 AM",
    duration: "01h 34m",
    startLocation: "Anand Bypass toll plaza",
    endLocation: "Vadodara Golden Chokdi",
    distanceKm: 46.2,
    driveTime: "01h 18m",
    idleTime: "16m",
    avgSpeedKmH: 48,
    maxSpeedKmH: 74,
    driverName: "Ramesh Patel",
    status: "Completed"
  },
  {
    tripId: "TRP-2026-0816-03",
    date: "16 Aug 2026",
    startTime: "12:10 PM",
    endTime: "01h 35m PM",
    duration: "01h 25m",
    startLocation: "Vadodara Golden Chokdi",
    endLocation: "Bharuch Narmada Bridge Entry",
    distanceKm: 38.6,
    driveTime: "01h 10m",
    idleTime: "15m",
    avgSpeedKmH: 45,
    maxSpeedKmH: 70,
    driverName: "Ramesh Patel",
    status: "Completed"
  },
  {
    tripId: "TRP-2026-0816-04",
    date: "16 Aug 2026",
    startTime: "02:46 PM",
    endTime: "04:18 PM",
    duration: "01h 32m",
    startLocation: "Bharuch Narmada Bridge Entry",
    endLocation: "Ankleshwar GIDC Phase 2",
    distanceKm: 31.4,
    driveTime: "01h 06m",
    idleTime: "26m",
    avgSpeedKmH: 42,
    maxSpeedKmH: 68,
    driverName: "Ramesh Patel",
    status: "Completed"
  }
];

// 05 & 06. Stoppage Summary Mock Data
export const mockStoppageOverviewKpis: ReportKpiMetric[] = [
  { label: "TOTAL STOPPAGE EVENTS", value: "72", unit: "EVENTS", status: "warning" },
  { label: "TOTAL STOPPAGE TIME", value: "24h 46m", status: "danger" },
  { label: "LONGEST STOPPAGE", value: "03h 12m", subtext: "GJ 01 RT 4821", status: "danger" },
  { label: "AVERAGE STOPPAGE", value: "20.6m", subtext: "Across fleet", status: "info" }
];

export const mockStoppageOverviewRows: StoppageOverviewRow[] = [
  {
    id: "GJ 01 RT 4821",
    vehicleNo: "GJ 01 RT 4821",
    branch: "Ahmedabad Central",
    driverName: "Ramesh Patel",
    totalStoppages: 18,
    totalStoppageTime: "06h 42m",
    longestStoppage: "01h 24m",
    avgStoppageTime: "22.3m",
    lastStoppageLocation: "Odhav Ring Road, Ahmedabad"
  },
  {
    id: "GJ 01 TX 2045",
    vehicleNo: "GJ 01 TX 2045",
    branch: "Apex Freight Central",
    driverName: "Dinesh Sharma",
    totalStoppages: 14,
    totalStoppageTime: "04h 18m",
    longestStoppage: "58m",
    avgStoppageTime: "18.4m",
    lastStoppageLocation: "Vapi Industrial Estate Gate 3"
  },
  {
    id: "MH 12 QX 9812",
    vehicleNo: "MH 12 QX 9812",
    branch: "Western Fleet Hub",
    driverName: "Amitabh Kulkarni",
    totalStoppages: 22,
    totalStoppageTime: "07h 56m",
    longestStoppage: "02h 10m",
    avgStoppageTime: "21.6m",
    lastStoppageLocation: "Pune Chakan Phase 1"
  },
  {
    id: "GJ 05 AB 1234",
    vehicleNo: "GJ 05 AB 1234",
    branch: "Surat Logistics",
    driverName: "Vijay Solanki",
    totalStoppages: 18,
    totalStoppageTime: "05h 50m",
    longestStoppage: "01h 05m",
    avgStoppageTime: "19.4m",
    lastStoppageLocation: "Sachin GIDC Main Road"
  }
];

export const mockStoppageEvents: StoppageEvent[] = [
  {
    id: "stp-1",
    eventNumber: "Event 01",
    date: "16 Aug 2026",
    startTime: "09:14 AM",
    endTime: "09:38 AM",
    duration: "24m",
    location: "Narol Circle Goods Terminus, Ahmedabad",
    coordinates: "22.9814° N, 72.5932° E",
    ignitionState: "OFF",
    nearbyPoi: "Apex Central Warehouse"
  },
  {
    id: "stp-2",
    eventNumber: "Event 02",
    date: "16 Aug 2026",
    startTime: "10:06 AM",
    endTime: "10:23 AM",
    duration: "17m",
    location: "Bareja Toll Plaza Highway Parking",
    coordinates: "22.8412° N, 72.6318° E",
    ignitionState: "OFF",
    nearbyPoi: "NH 48 Toll 01"
  },
  {
    id: "stp-3",
    eventNumber: "Event 03",
    date: "16 Aug 2026",
    startTime: "11:12 AM",
    endTime: "11:49 AM",
    duration: "37m",
    location: "Kheda Express Fuel Station & Rest Area",
    coordinates: "22.7533° N, 72.6841° E",
    ignitionState: "OFF",
    nearbyPoi: "IOCL Swagat Fuel Center"
  },
  {
    id: "stp-4",
    eventNumber: "Event 04",
    date: "16 Aug 2026",
    startTime: "12:28 PM",
    endTime: "12:46 PM",
    duration: "18m",
    location: "Nadiad Bypass Overbridge Layby",
    coordinates: "22.6912° N, 72.8611° E",
    ignitionState: "OFF",
    nearbyPoi: "Nadiad Freight Parking"
  },
  {
    id: "stp-5",
    eventNumber: "Event 05",
    date: "16 Aug 2026",
    startTime: "01:35 PM",
    endTime: "02:01 PM",
    duration: "26m",
    location: "Anand Transport Nagar Gate 2",
    coordinates: "22.5645° N, 72.9284° E",
    ignitionState: "OFF",
    nearbyPoi: "Amul Distribution Hub"
  },
  {
    id: "stp-6",
    eventNumber: "Event 06",
    date: "16 Aug 2026",
    startTime: "05:18 PM",
    endTime: "06:09 PM",
    duration: "51m",
    location: "Odhav Ring Road Logistics Yard, Ahmedabad",
    coordinates: "23.0182° N, 72.6591° E",
    ignitionState: "OFF",
    nearbyPoi: "Apex Ring Road Depot"
  }
];

// 07 & 08. Idle Summary Mock Data
export const mockIdleOverviewKpis: ReportKpiMetric[] = [
  { label: "TOTAL IDLE EVENTS", value: "48", unit: "EVENTS", status: "warning" },
  { label: "TOTAL IDLE TIME", value: "14h 28m", status: "warning" },
  { label: "ESTIMATED FUEL WASTED", value: "28.9", unit: "Litres", status: "danger" },
  { label: "AVG IDLE RATIO", value: "18.2%", subtext: "Of total operating duration", status: "info" }
];

export const mockIdleOverviewRows: IdleOverviewRow[] = [
  {
    id: "GJ 01 RT 4821",
    vehicleNo: "GJ 01 RT 4821",
    branch: "Ahmedabad Central",
    driverName: "Ramesh Patel",
    totalIdleEvents: 18,
    totalIdleTime: "04h 26m",
    longestIdle: "44m",
    fuelWastedLitres: 8.8
  },
  {
    id: "GJ 01 TX 2045",
    vehicleNo: "GJ 01 TX 2045",
    branch: "Apex Freight Central",
    driverName: "Dinesh Sharma",
    totalIdleEvents: 11,
    totalIdleTime: "02h 50m",
    longestIdle: "28m",
    fuelWastedLitres: 5.6
  },
  {
    id: "MH 12 QX 9812",
    vehicleNo: "MH 12 QX 9812",
    branch: "Western Fleet Hub",
    driverName: "Amitabh Kulkarni",
    totalIdleEvents: 12,
    totalIdleTime: "03h 42m",
    longestIdle: "35m",
    fuelWastedLitres: 7.4
  },
  {
    id: "GJ 05 AB 1234",
    vehicleNo: "GJ 05 AB 1234",
    branch: "Surat Logistics",
    driverName: "Vijay Solanki",
    totalIdleEvents: 7,
    totalIdleTime: "01h 30m",
    longestIdle: "20m",
    fuelWastedLitres: 3.0
  }
];

export const mockIdleEvents: IdleEvent[] = [
  {
    id: "idl-1",
    eventNumber: "Event 01",
    date: "16 Aug 2026",
    startTime: "09:14 AM",
    endTime: "09:38 AM",
    duration: "24m",
    location: "Narol Circle Goods Terminus",
    ignitionState: "Engine idle",
    batteryVoltage: "12.8V"
  },
  {
    id: "idl-2",
    eventNumber: "Event 02",
    date: "16 Aug 2026",
    startTime: "10:06 AM",
    endTime: "10:23 AM",
    duration: "17m",
    location: "Bareja Toll Lineup",
    ignitionState: "Engine idle",
    batteryVoltage: "13.1V"
  },
  {
    id: "idl-3",
    eventNumber: "Event 03",
    date: "16 Aug 2026",
    startTime: "11:12 AM",
    endTime: "11:49 AM",
    duration: "37m",
    location: "Kheda Express Unloading Bay",
    ignitionState: "Engine idle",
    batteryVoltage: "12.9V"
  },
  {
    id: "idl-4",
    eventNumber: "Event 04",
    date: "16 Aug 2026",
    startTime: "03:04 PM",
    endTime: "03:48 PM",
    duration: "44m",
    location: "Odhav Ring Road, Ahmedabad",
    ignitionState: "Engine idle",
    batteryVoltage: "13.0V"
  },
  {
    id: "idl-5",
    eventNumber: "Event 05",
    date: "16 Aug 2026",
    startTime: "04:16 PM",
    endTime: "04:36 PM",
    duration: "20m",
    location: "Sanand GIDC Gate 1 Security Check",
    ignitionState: "Engine idle",
    batteryVoltage: "13.2V"
  }
];

// 09 & 10. Inactive Summary Mock Data
export const mockInactiveOverviewKpis: ReportKpiMetric[] = [
  { label: "INACTIVE VEHICLES", value: "14", unit: "VEHICLES", status: "danger" },
  { label: "TOTAL INACTIVE TIME", value: "9h 18m", status: "warning" },
  { label: "OFFLINE GPS", value: "11", unit: "UNITS", status: "danger" },
  { label: "OVER 24 HR INACTIVE", value: "4", unit: "VEHICLES", status: "danger" }
];

export const mockInactiveOverviewRows: InactiveOverviewRow[] = [
  {
    id: "GJ 01 RT 4821",
    vehicleNo: "GJ 01 RT 4821",
    branch: "Ahmedabad Central",
    driverName: "Ramesh Patel",
    inactiveSince: "19 Aug, 18:42",
    inactiveDuration: "18h 24m",
    lastLocation: "Naroda GIDC, Ahmedabad",
    gpsStatus: "OFFLINE GPS",
    eventCount: 12
  },
  {
    id: "GJ 01 TX 2045",
    vehicleNo: "GJ 01 TX 2045",
    branch: "Apex Freight Central",
    driverName: "Dinesh Sharma",
    inactiveSince: "19 Aug, 08:15",
    inactiveDuration: "28h 50m",
    lastLocation: "Vapi GIDC Yard",
    gpsStatus: "OVER 24 HR",
    eventCount: 8
  },
  {
    id: "MH 12 QX 9812",
    vehicleNo: "MH 12 QX 9812",
    branch: "Western Fleet Hub",
    driverName: "Amitabh Kulkarni",
    inactiveSince: "20 Aug, 02:10",
    inactiveDuration: "11h 05m",
    lastLocation: "Chakan Phase 2 Parking",
    gpsStatus: "OFFLINE GPS",
    eventCount: 6
  }
];

export const mockInactiveEvents: InactiveEvent[] = [
  {
    id: "ina-1",
    date: "16 Aug 2026",
    startTime: "00:08 AM",
    endTime: "05:42 AM",
    duration: "5h 34m",
    reason: "Scheduled Depot Overnight Stay",
    lastKnownLocation: "Odhav Central Hub",
    batteryStatus: "Maintained 12.6V"
  },
  {
    id: "ina-2",
    date: "16 Aug 2026",
    startTime: "08:22 AM",
    endTime: "09:14 AM",
    duration: "52m",
    reason: "Dock Wait / No Ignition",
    lastKnownLocation: "Narol GIDC Gate 2",
    batteryStatus: "12.7V"
  },
  {
    id: "ina-3",
    date: "16 Aug 2026",
    startTime: "10:23 AM",
    endTime: "11:12 AM",
    duration: "49m",
    reason: "Signal Lost / Deep Tunnel Transit",
    lastKnownLocation: "NH 48 Bypass Underpass",
    batteryStatus: "12.8V"
  },
  {
    id: "ina-4",
    date: "16 Aug 2026",
    startTime: "02:01 PM",
    endTime: "03:04 PM",
    duration: "1h 03m",
    reason: "Driver Lunch Break",
    lastKnownLocation: "Highway Oasis, Anand",
    batteryStatus: "12.6V"
  }
];

// 11 & 12. Digital Port Summary Mock Data
export const mockDigitalPortKpis: ReportKpiMetric[] = [
  { label: "MONITORED PORTS", value: "48", unit: "DEVICES", status: "info" },
  { label: "OPEN EVENTS", value: "34", unit: "CYCLES", status: "warning" },
  { label: "CLOSE EVENTS", value: "34", unit: "CYCLES", status: "success" },
  { label: "PORT DURATION", value: "18:42:16", subtext: "Total active telemetry duration", status: "info" }
];

export const mockDigitalPortRows: DigitalPortOverviewRow[] = [
  {
    id: "GJ 05 AB 1234",
    vehicleNo: "GJ 05 AB 1234",
    organisation: "Transit Alpha Logistics",
    model: "Tata Prima 5530",
    driverCode: "EMP-1042",
    driverName: "Ramesh Patel",
    openEvents: 14,
    closeEvents: 14,
    portDuration: "06:14:22",
    activePortsCount: 3
  },
  {
    id: "GJ 01 RT 4821",
    vehicleNo: "GJ 01 RT 4821",
    organisation: "Ahmedabad Central Express",
    model: "Tata Ultra 1518",
    driverCode: "EMP-1088",
    driverName: "Dinesh Sharma",
    openEvents: 12,
    closeEvents: 12,
    portDuration: "08:42:00",
    activePortsCount: 5
  },
  {
    id: "MH 12 QX 9812",
    vehicleNo: "MH 12 QX 9812",
    organisation: "Western Freight Network",
    model: "Ashok Leyland 4220",
    driverCode: "EMP-2041",
    driverName: "Amitabh Kulkarni",
    openEvents: 8,
    closeEvents: 8,
    portDuration: "03:45:54",
    activePortsCount: 2
  }
];

export const mockDigitalPortEvents: DigitalPortEvent[] = [
  {
    portNumber: "DIN 1",
    portName: "Rear Container Door Sensor",
    imei: "867530049218476",
    onDuration: "01h 14m",
    timesOn: 6,
    offDuration: "22h 44m",
    timesOff: 6,
    gpsStatus: "Online",
    currentStatus: "Closed"
  },
  {
    portNumber: "DIN 2",
    portName: "Cabin Panic / SOS Button",
    imei: "867530049218476",
    onDuration: "00m 00s",
    timesOn: 0,
    offDuration: "24h 00m",
    timesOff: 0,
    gpsStatus: "Online",
    currentStatus: "Closed"
  },
  {
    portNumber: "DIN 3",
    portName: "Power Take-Off (PTO) Switch",
    imei: "867530049218476",
    onDuration: "02h 35m",
    timesOn: 4,
    offDuration: "21h 25m",
    timesOff: 4,
    gpsStatus: "Online",
    currentStatus: "Closed"
  },
  {
    portNumber: "DIN 4",
    portName: "Fuel Cap Magnetic Sensor",
    imei: "867530049218476",
    onDuration: "14m 20s",
    timesOn: 2,
    offDuration: "23h 45m",
    timesOff: 2,
    gpsStatus: "Online",
    currentStatus: "Closed"
  }
];

// 13 & 14. AC Summary Mock Data
export const mockAcSummaryKpis: ReportKpiMetric[] = [
  { label: "AC ON DISTANCE", value: "2,846", unit: "km", status: "success" },
  { label: "AC ON DURATION", value: "426h 18m", status: "warning" },
  { label: "AC CYCLES", value: "186", unit: "CYCLES", status: "info" },
  { label: "IGNITION OVERLAP", value: "5h 54m", subtext: "Today · Active since 20:47", status: "success" }
];

export const mockAcSummaryRows: AcSummaryOverviewRow[] = [
  {
    id: "GJ 01 RT 4821",
    branch: "Ahmedabad Central",
    vehicleNo: "GJ 01 RT 4821",
    vehicleName: "Apex Cold Express 01",
    brand: "Tata Motors",
    model: "Ultra 1518 Reefer",
    driverName: "Ramesh Patel",
    imei: "867530049218476",
    acOnDistanceKm: 2846,
    acOnDuration: "426h 18m",
    acOffDuration: "184h 12m",
    acCycles: 186,
    currentStatus: "AC ON"
  },
  {
    id: "GJ 01 TX 2045",
    branch: "Apex Freight Central",
    vehicleNo: "GJ 01 TX 2045",
    vehicleName: "Pharma Liner 04",
    brand: "Eicher",
    model: "Pro 3019",
    driverName: "Dinesh Sharma",
    imei: "867530049218477",
    acOnDistanceKm: 1940,
    acOnDuration: "312h 45m",
    acOffDuration: "140h 20m",
    acCycles: 142,
    currentStatus: "AC OFF"
  }
];

export const mockAcEvents: AcEvent[] = [
  {
    id: "ac-1",
    eventTime: "20:47:16",
    acStatus: "ON",
    runtime: "00:25:57",
    ignitionStatus: "ON",
    location: "Ahmedabad Central Cold Hub",
    overlapDuration: "25m"
  },
  {
    id: "ac-2",
    eventTime: "17:15:00",
    acStatus: "OFF",
    runtime: "01h 45m",
    ignitionStatus: "ON",
    location: "Nadiad Bypass Rest Area",
    overlapDuration: "01h 45m"
  },
  {
    id: "ac-3",
    eventTime: "13:20:10",
    acStatus: "ON",
    runtime: "03h 10m",
    ignitionStatus: "ON",
    location: "Vadodara Pharma Gate 4",
    overlapDuration: "03h 10m"
  }
];

// 15. SMS & Email Summary Mock Data
export const mockSmsEmailKpis: ReportKpiMetric[] = [
  { label: "TOTAL SENT", value: "12,486", unit: "NOTIFICATIONS", status: "info" },
  { label: "SENT SMS", value: "8,742", unit: "SMS DELIVERED", status: "success" },
  { label: "SENT EMAIL", value: "3,744", unit: "EMAILS", status: "info" },
  { label: "VEHICLES REACHED", value: "48", unit: "VEHICLES", status: "info" },
  { label: "FAILED DELIVERIES", value: "12", unit: "RETRY QUEUED", status: "danger" }
];

export const mockSmsEmailRows: SmsEmailSummaryRow[] = [
  {
    id: "sms-1",
    company: "Apex Logistics",
    branch: "Ahmedabad Central",
    vehicleNo: "GJ 01 RT 4821",
    vehicleBrand: "Tata Motors",
    vehicleModel: "Ultra 1518",
    sentSms: 248,
    sentEmail: 114,
    deliveredSms: 246,
    failedSms: 2,
    lastTriggerType: "Geofence Exit · Sanand GIDC",
    lastSentTimestamp: "Today, 10:42 AM"
  },
  {
    id: "sms-2",
    company: "Apex Logistics",
    branch: "Surat Express",
    vehicleNo: "GJ 05 AB 1234",
    vehicleBrand: "Tata Motors",
    vehicleModel: "Prima 5530",
    sentSms: 192,
    sentEmail: 88,
    deliveredSms: 192,
    failedSms: 0,
    lastTriggerType: "Overspeed Alert (>80 km/h)",
    lastSentTimestamp: "Today, 09:18 AM"
  },
  {
    id: "sms-3",
    company: "Western Express",
    branch: "Pune Chakan",
    vehicleNo: "MH 12 QX 9812",
    vehicleBrand: "Ashok Leyland",
    vehicleModel: "4220 Cowl",
    sentSms: 310,
    sentEmail: 140,
    deliveredSms: 304,
    failedSms: 6,
    lastTriggerType: "SOS Emergency Trigger",
    lastSentTimestamp: "Yesterday, 18:22 PM"
  }
];

// 16. Vehicle Status Report Mock Data
export const mockVehicleStatusKpis: ReportKpiMetric[] = [
  { label: "TOTAL VEHICLES", value: "48", unit: "REGISTERED", status: "info" },
  { label: "RUNNING", value: "19", unit: "ON ROUTE", status: "success" },
  { label: "STOPPED", value: "17", unit: "ENG OFF", status: "info" },
  { label: "IDLE", value: "4", unit: "ENG ON", status: "warning" },
  { label: "OFFLINE", value: "8", unit: "NO GPS", status: "danger" }
];

export const mockVehicleStatusRows: VehicleStatusRow[] = [
  {
    id: "stat-1",
    organization: "Apex Logistics · Ahmedabad Central",
    vehicleNo: "GJ 01 RT 4821",
    vehicleType: "Truck · Tata Ultra 1518",
    model: "18 FT Container",
    bodyType: "Heavy Commercial",
    powerIgnition: "ON",
    status: "Running",
    speedKmH: 48,
    batteryVoltage: "13.4V",
    connectivity: "AT-09 · Airtel 4G",
    imei: "867530049218476",
    simNumber: "98250 18421",
    lastCommunication: "Just now · 10:42 AM",
    location: "Narol Ring Road, Ahmedabad"
  },
  {
    id: "stat-2",
    organization: "Apex Logistics · Vapi Corridor",
    vehicleNo: "GJ 01 TX 2045",
    vehicleType: "Trailer · Tata Prima 5530",
    model: "40 FT Flatbed",
    bodyType: "Multi Axle",
    powerIgnition: "OFF",
    status: "Stopped",
    speedKmH: 0,
    batteryVoltage: "12.6V",
    connectivity: "AT-09 · Jio 4G",
    imei: "867530049218477",
    simNumber: "98980 44211",
    lastCommunication: "12m ago",
    location: "Vapi GIDC Gate 3"
  },
  {
    id: "stat-3",
    organization: "Western Fleet · Chakan Hub",
    vehicleNo: "MH 12 QX 9812",
    vehicleType: "Tipper · Ashok Leyland 4220",
    model: "24 CuM Tipper",
    bodyType: "Heavy Mining",
    powerIgnition: "ON",
    status: "Idle",
    speedKmH: 0,
    batteryVoltage: "13.0V",
    connectivity: "FMB920 · VI 4G",
    imei: "867530049218478",
    simNumber: "97654 32109",
    lastCommunication: "4m ago",
    location: "Pune Chakan Phase 2"
  },
  {
    id: "stat-4",
    organization: "Surat Express · Sachin Branch",
    vehicleNo: "GJ 05 AB 1234",
    vehicleType: "LCV · Eicher Pro 2049",
    model: "14 FT Closed Body",
    bodyType: "Light Freight",
    powerIgnition: "OFF",
    status: "Offline",
    speedKmH: 0,
    batteryVoltage: "11.8V",
    connectivity: "AT-09 · Airtel 4G",
    imei: "867530049218479",
    simNumber: "98765 43210",
    lastCommunication: "2d ago",
    location: "Sachin GIDC Main Depot"
  }
];

// 17. Vehicle Location Report Mock Data
export const mockVehicleLocationKpis: ReportKpiMetric[] = [
  { label: "MONITORED VEHICLES", value: "48", unit: "VEHICLES", status: "info" },
  { label: "GPS ONLINE", value: "42", unit: "REPORTING", status: "success" },
  { label: "LAST UPDATED", value: "10:42 AM", subtext: "Synchronized live", status: "info" },
  { label: "NO SIGNAL / OFFLINE", value: "6", unit: "ATTENTION", status: "danger" }
];

export const mockVehicleLocationRows: VehicleLocationRow[] = [
  {
    id: "loc-1",
    company: "Apex Logistics",
    branch: "Ahmedabad Central",
    vehicleNo: "GJ 01 RT 4821",
    driverName: "Ramesh Patel",
    driverPhone: "+91 98250 18421",
    imei: "867530049218476",
    currentAddress: "Narol-Sarkhej Highway, Near Ujala Circle, Ahmedabad",
    latitude: 22.9814,
    longitude: 72.5932,
    speedKmH: 48,
    heading: "South-West (210°)",
    gpsSignal: "ONLINE",
    lastUpdated: "10:42:21 AM"
  },
  {
    id: "loc-2",
    company: "Apex Logistics",
    branch: "Vapi Corridor",
    vehicleNo: "GJ 01 TX 2045",
    driverName: "Dinesh Sharma",
    driverPhone: "+91 98980 44211",
    imei: "867530049218477",
    currentAddress: "Vapi Industrial Estate Gate 3, Gujarat",
    latitude: 20.3712,
    longitude: 72.9104,
    speedKmH: 0,
    heading: "Stationary (0°)",
    gpsSignal: "ONLINE",
    lastUpdated: "10:30:15 AM"
  },
  {
    id: "loc-3",
    company: "Western Fleet",
    branch: "Pune Chakan",
    vehicleNo: "MH 12 QX 9812",
    driverName: "Amitabh Kulkarni",
    driverPhone: "+91 97654 32109",
    imei: "867530049218478",
    currentAddress: "Chakan Phase 2 Industrial Park, Pune, Maharashtra",
    latitude: 18.7611,
    longitude: 73.8524,
    speedKmH: 0,
    heading: "North-East (45°)",
    gpsSignal: "ONLINE",
    lastUpdated: "10:38:00 AM"
  },
  {
    id: "loc-4",
    company: "Surat Logistics",
    branch: "Sachin Branch",
    vehicleNo: "GJ 05 AB 1234",
    driverName: "Vijay Solanki",
    driverPhone: "+91 98765 43210",
    imei: "867530049218479",
    currentAddress: "Sachin GIDC Main Depot, Surat, Gujarat",
    latitude: 21.0821,
    longitude: 72.8812,
    speedKmH: 0,
    heading: "Unknown",
    gpsSignal: "NO SIGNAL",
    lastUpdated: "18 Aug 2026, 14:10 PM"
  }
];

// 18. Device Log Mock Data
export const mockDeviceTelemetryPacket: DeviceTelemetryPacket = {
  imei: "867530049218476",
  company: "Apex Logistics",
  branch: "Ahmedabad Central",
  vehicleNo: "GJ 01 RT 4821",
  vehicleModel: "Tata Ultra 1518",
  deviceModel: "Teltonika FMB920",
  status: "ONLINE",
  timestamp: "22 Aug 2026, 10:42:21",
  rawPacketString:
    "000000000000004e08010000018f294dfb6800164c4c280dc5824c004200d20c00000030040101010200030004000500150d00160d00170e00000100004245",
  gpsValid: true,
  latitude: 22.98142,
  longitude: 72.59321,
  altitudeM: 53.4,
  speedKmH: 48,
  satellites: 14,
  gsmSignalDbm: -68,
  externalVoltageV: 24.2,
  internalBatteryV: 3.82,
  ignition: true,
  digitalInputs: "DIN1: HIGH, DIN2: LOW, DIN3: LOW",
  digitalOutputs: "DOUT1: OFF, DOUT2: OFF"
};

// 19. System Log Mock Data
export const mockSystemLogKpis: ReportKpiMetric[] = [
  { label: "LOG RECORDS STREAMED", value: "48,210", unit: "PACKETS", status: "info" },
  { label: "GPS VALID RATE", value: "47 / 48", unit: "97.9%", status: "success" },
  { label: "GATEWAY LATENCY", value: "46 ms", subtext: "Average roundtrip", status: "success" },
  { label: "EXCEPTIONS / PARSE ERRORS", value: "3", unit: "TODAY", status: "warning" }
];

export const mockSystemLogs: SystemLogRow[] = [
  {
    id: "sys-1",
    timestamp: "22 Aug 2026, 10:42:21.412",
    company: "Apex Logistics",
    branch: "Ahmedabad Central",
    deviceImei: "867530049218476",
    simNumber: "98250 18421",
    coordinates: "22.9814° N, 72.5932° E",
    signals: "Sat: 14 · GSM: -68 dBm",
    movementStatus: "Speed: 48 km/h · Angle: 210°",
    packetTimingMs: 42,
    firmware: "03.28.02.Rev.41",
    gpsValid: true,
    severity: "INFO"
  },
  {
    id: "sys-2",
    timestamp: "22 Aug 2026, 10:42:19.108",
    company: "Apex Logistics",
    branch: "Vapi Corridor",
    deviceImei: "867530049218477",
    simNumber: "98980 44211",
    coordinates: "20.3712° N, 72.9104° E",
    signals: "Sat: 12 · GSM: -72 dBm",
    movementStatus: "Speed: 0 km/h · Angle: 0°",
    packetTimingMs: 38,
    firmware: "03.28.02.Rev.41",
    gpsValid: true,
    severity: "INFO"
  },
  {
    id: "sys-3",
    timestamp: "22 Aug 2026, 10:42:15.890",
    company: "Surat Logistics",
    branch: "Sachin Branch",
    deviceImei: "867530049218479",
    simNumber: "98765 43210",
    coordinates: "0.0000° N, 0.0000° E",
    signals: "Sat: 0 · GSM: -105 dBm",
    movementStatus: "No GPS fix",
    packetTimingMs: 240,
    firmware: "03.27.01.Rev.12",
    gpsValid: false,
    severity: "WARN"
  }
];

// 20 & 21. Scheduled Reports Mock Data
export const mockScheduledReportsKpis: ReportKpiMetric[] = [
  { label: "ACTIVE SCHEDULES", value: "12", unit: "ACTIVE", status: "success" },
  { label: "DUE TODAY", value: "4", unit: "PENDING RUN", status: "warning" },
  { label: "DELIVERED THIS WEEK", value: "38", unit: "EMAILS", status: "info" },
  { label: "FAILED DELIVERIES", value: "0", unit: "HEALTHY", status: "success" }
];

export const mockScheduledReports: ScheduledReportItem[] = [
  {
    id: "sched-1",
    scheduleName: "Daily Operations Summary",
    reportType: "Travel Summary",
    company: "Apex Logistics",
    branch: "All Branches",
    vehicleScope: "All active vehicles (48)",
    frequency: "Daily",
    fileFormat: "Excel (.xlsx)",
    nextDelivery: "Tomorrow at 07:00 AM",
    recipients: ["fleet-ops@apexlogistics.in", "director@apexlogistics.in"],
    isActive: true,
    lastDelivered: "Today, 07:00 AM",
    deliveryStatus: "Active"
  },
  {
    id: "sched-2",
    scheduleName: "Weekly Stoppage & Idle Audit",
    reportType: "Stoppage Summary",
    company: "Apex Logistics",
    branch: "Ahmedabad Central",
    vehicleScope: "Container Fleet (18)",
    frequency: "Weekly",
    fileFormat: "PDF",
    nextDelivery: "Monday at 08:30 AM",
    recipients: ["ops-lead@apexlogistics.in"],
    isActive: true,
    lastDelivered: "19 Aug, 08:30 AM",
    deliveryStatus: "Active"
  },
  {
    id: "sched-3",
    scheduleName: "Cold Chain AC Compliance Log",
    reportType: "AC Summary",
    company: "Apex Logistics",
    branch: "Ahmedabad Central",
    vehicleScope: "Reefer Vehicles (8)",
    frequency: "Daily",
    fileFormat: "Excel (.xlsx)",
    nextDelivery: "Today at 21:00 PM",
    recipients: ["coldchain-qa@apexlogistics.in", "compliance@inorbit.io"],
    isActive: true,
    lastDelivered: "Yesterday, 21:00 PM",
    deliveryStatus: "Due Today"
  }
];

// 22. Vehicle Activation Report Mock Data
export const mockVehicleActivationKpis: ReportKpiMetric[] = [
  { label: "ACTIVATED FLEET", value: "42", unit: "VEHICLES", status: "success" },
  { label: "GPS CREATED", value: "45", unit: "HARDWARE", status: "info" },
  { label: "PENDING ACTIVATION", value: "3", unit: "IN QUEUE", status: "warning" },
  { label: "ATTENTION / EXPIRED", value: "1", unit: "EXPIRING", status: "danger" }
];

export const mockVehicleActivationRows: VehicleActivationRow[] = [
  {
    id: "act-1",
    company: "Apex Logistics",
    branch: "Ahmedabad Central",
    vehicleType: "18 FT Container",
    vehicleNo: "GJ 01 RT 4821",
    imei: "867530049218476",
    simNo: "98250 18421",
    vehicleCreationDate: "12 May 2026",
    gpsCreationDate: "14 May 2026",
    vehicleActivationDate: "15 May 2026",
    activatedBy: "Mahesh Panchal · Tech Ops",
    status: "ACTIVATED"
  },
  {
    id: "act-2",
    company: "Apex Logistics",
    branch: "Vapi Corridor",
    vehicleType: "40 FT Flatbed",
    vehicleNo: "GJ 01 TX 2045",
    imei: "867530049218477",
    simNo: "98980 44211",
    vehicleCreationDate: "04 Jun 2026",
    gpsCreationDate: "05 Jun 2026",
    vehicleActivationDate: "06 Jun 2026",
    activatedBy: "Ketan Rao · Field Engineer",
    status: "ACTIVATED"
  },
  {
    id: "act-3",
    company: "Surat Logistics",
    branch: "Sachin Branch",
    vehicleType: "14 FT Closed Body",
    vehicleNo: "GJ 05 AB 1234",
    imei: "867530049218479",
    simNo: "98765 43210",
    vehicleCreationDate: "10 Aug 2026",
    gpsCreationDate: "11 Aug 2026",
    vehicleActivationDate: "—",
    activatedBy: "Pending Verification",
    status: "PENDING"
  }
];

// 23 & 24. Ignition Summary Mock Data
export const mockIgnitionSummaryKpis: ReportKpiMetric[] = [
  { label: "ON DISTANCE", value: "3,482", unit: "km", status: "success" },
  { label: "ON DURATION", value: "512h 46m", status: "info" },
  { label: "IGNITION CYCLES", value: "248", unit: "CYCLES", status: "warning" },
  { label: "ENGINE RUNNING TIME", value: "4h 52m", subtext: "1h 26m idle time today", status: "success" }
];

export const mockIgnitionOverviewRows: IgnitionSummaryOverviewRow[] = [
  {
    id: "GJ 01 RT 4821",
    company: "Apex Logistics",
    branch: "Ahmedabad Central",
    vehicleNo: "GJ 01 RT 4821",
    driverName: "Ramesh Patel",
    imei: "867530049218476",
    ignitionOnDuration: "06h 18m",
    ignitionOffDuration: "17h 42m",
    runningTime: "4h 52m",
    idleTime: "1h 26m",
    distanceKm: 186.4,
    ignitionCycles: 8,
    currentStatus: "Engine running"
  },
  {
    id: "GJ 01 TX 2045",
    vehicleNo: "GJ 01 TX 2045",
    company: "Apex Logistics",
    branch: "Apex Freight Central",
    driverName: "Dinesh Sharma",
    imei: "867530049218477",
    ignitionOnDuration: "05h 40m",
    ignitionOffDuration: "18h 20m",
    runningTime: "4h 15m",
    idleTime: "1h 25m",
    distanceKm: 172.0,
    ignitionCycles: 6,
    currentStatus: "Stopped"
  }
];

export const mockIgnitionEvents: IgnitionEvent[] = [
  {
    id: "ign-1",
    eventNumber: "Event 01",
    routeName: "Morning dispatch & highway corridor",
    ignitionOnTime: "08:14:22 AM",
    ignitionOffTime: "10:06:41 AM",
    runningTime: "01h 52m",
    idleTime: "24m",
    distanceKm: 72.4,
    avgSpeedKmH: 42,
    maxSpeedKmH: 74,
    startAddress: "Narol Goods Yard, Ahmedabad",
    endAddress: "Bareja Toll Bypass"
  },
  {
    id: "ign-2",
    eventNumber: "Event 02",
    routeName: "Midday inter-city freight delivery",
    ignitionOnTime: "10:24:16 AM",
    ignitionOffTime: "12:10:09 PM",
    runningTime: "01h 46m",
    idleTime: "31m",
    distanceKm: 61.2,
    avgSpeedKmH: 38,
    maxSpeedKmH: 68,
    startAddress: "Bareja Toll Bypass",
    endAddress: "Kheda Express Unloading Hub"
  },
  {
    id: "ign-3",
    eventNumber: "Event 03",
    routeName: "Active journey — Final terminal return",
    ignitionOnTime: "12:41:35 PM",
    ignitionOffTime: "Event in progress",
    runningTime: "01h 14m",
    idleTime: "37m",
    distanceKm: 52.8,
    avgSpeedKmH: 40,
    maxSpeedKmH: 72,
    startAddress: "Kheda Express Unloading Hub",
    endAddress: "Odhav Ring Road Depot"
  }
];
