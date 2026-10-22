import { LucideIcon } from "lucide-react";

export type ReportCategory =
  | "All"
  | "Activity & Motion"
  | "Telemetry & Sensors"
  | "Operations & Tracking"
  | "Communications & Logs"
  | "Automation";

export interface ReportItemMeta {
  key: string;
  name: string;
  path: string;
  category: ReportCategory;
  icon: LucideIcon;
  badge?: string;
  badgeVariant?: "cyan" | "alert" | "counter";
  description: string;
  hasEventView?: boolean;
}

export interface ReportKpiMetric {
  label: string;
  value: string | number;
  unit?: string;
  subtext?: string;
  trend?: "up" | "down" | "neutral";
  status?: "success" | "warning" | "danger" | "info";
  icon?: LucideIcon;
}

export interface ReportFilterState {
  search: string;
  company?: string;
  branch?: string;
  vehicle?: string;
  dateRange?: string;
  status?: string;
}

// 02. Travel Summary Types
export interface TravelSummaryRow {
  id: string;
  vehicleNo: string;
  group: string;
  driverName: string;
  driverPhone: string;
  startLocation: string;
  endLocation: string;
  startOdometer: number;
  endOdometer: number;
  totalDistanceKm: number;
  operatingDuration: string;
  driveDuration: string;
  stoppageDuration: string;
  idleDuration: string;
  inactiveDuration: string;
  avgSpeedKmH: number;
  maxSpeedKmH: number;
  speedStatus: "Verified" | "Caution" | "Speeding";
}

// 03 & 04. Trip Summary Types
export interface TripOverviewRow {
  id: string;
  vehicleNo: string;
  vehicleType: string;
  totalTrips: number;
  totalDistanceKm: number;
  driveTime: string;
  idleTime: string;
  avgSpeedKmH: number;
  maxSpeedKmH: number;
  alertsCount: number;
}

export interface TripDetailEvent {
  tripId: string;
  date: string;
  startTime: string;
  endTime: string;
  duration: string;
  startLocation: string;
  endLocation: string;
  distanceKm: number;
  driveTime: string;
  idleTime: string;
  avgSpeedKmH: number;
  maxSpeedKmH: number;
  driverName: string;
  status: "Completed" | "In Progress";
}

// 05 & 06. Stoppage Summary Types
export interface StoppageOverviewRow {
  id: string;
  vehicleNo: string;
  branch: string;
  driverName: string;
  totalStoppages: number;
  totalStoppageTime: string;
  longestStoppage: string;
  avgStoppageTime: string;
  lastStoppageLocation: string;
}

export interface StoppageEvent {
  id: string;
  eventNumber: string;
  date: string;
  startTime: string;
  endTime: string;
  duration: string;
  location: string;
  coordinates: string;
  ignitionState: "OFF" | "ON";
  nearbyPoi?: string;
}

// 07 & 08. Idle Summary Types
export interface IdleOverviewRow {
  id: string;
  vehicleNo: string;
  branch: string;
  driverName: string;
  totalIdleEvents: number;
  totalIdleTime: string;
  longestIdle: string;
  fuelWastedLitres: number;
}

export interface IdleEvent {
  id: string;
  eventNumber: string;
  date: string;
  startTime: string;
  endTime: string;
  duration: string;
  location: string;
  ignitionState: "Engine idle";
  batteryVoltage: string;
}

// 09 & 10. Inactive Summary Types
export interface InactiveOverviewRow {
  id: string;
  vehicleNo: string;
  branch: string;
  driverName: string;
  inactiveSince: string;
  inactiveDuration: string;
  lastLocation: string;
  gpsStatus: "OFFLINE GPS" | "OVER 24 HR" | "DISCONNECTED";
  eventCount: number;
}

export interface InactiveEvent {
  id: string;
  date: string;
  startTime: string;
  endTime: string;
  duration: string;
  reason: string;
  lastKnownLocation: string;
  batteryStatus: string;
}

// 11 & 12. Digital Port Summary Types
export interface DigitalPortOverviewRow {
  id: string;
  vehicleNo: string;
  organisation: string;
  model: string;
  driverCode: string;
  driverName: string;
  openEvents: number;
  closeEvents: number;
  portDuration: string;
  activePortsCount: number;
}

export interface DigitalPortEvent {
  portNumber: string;
  portName: string;
  imei: string;
  onDuration: string;
  timesOn: number;
  offDuration: string;
  timesOff: number;
  gpsStatus: "Online" | "Offline";
  currentStatus: "Open" | "Closed";
}

// 13 & 14. AC Summary Types
export interface AcSummaryOverviewRow {
  id: string;
  branch: string;
  vehicleNo: string;
  vehicleName: string;
  brand: string;
  model: string;
  driverName: string;
  imei: string;
  acOnDistanceKm: number;
  acOnDuration: string;
  acOffDuration: string;
  acCycles: number;
  currentStatus: "AC ON" | "AC OFF";
}

export interface AcEvent {
  id: string;
  eventTime: string;
  acStatus: "ON" | "OFF";
  runtime: string;
  ignitionStatus: "ON" | "OFF";
  location: string;
  overlapDuration: string;
}

// 15. SMS & Email Summary
export interface SmsEmailSummaryRow {
  id: string;
  company: string;
  branch: string;
  vehicleNo: string;
  vehicleBrand: string;
  vehicleModel: string;
  sentSms: number;
  sentEmail: number;
  deliveredSms: number;
  failedSms: number;
  lastTriggerType: string;
  lastSentTimestamp: string;
}

// 16. Vehicle Status Report
export interface VehicleStatusRow {
  id: string;
  organization: string;
  vehicleNo: string;
  vehicleType: string;
  model: string;
  bodyType: string;
  powerIgnition: "ON" | "OFF";
  status: "Running" | "Stopped" | "Idle" | "Offline";
  speedKmH: number;
  batteryVoltage: string;
  connectivity: string;
  imei: string;
  simNumber: string;
  lastCommunication: string;
  location: string;
}

// 17. Vehicle Location Report
export interface VehicleLocationRow {
  id: string;
  company: string;
  branch: string;
  vehicleNo: string;
  driverName: string;
  driverPhone: string;
  imei: string;
  currentAddress: string;
  latitude: number;
  longitude: number;
  speedKmH: number;
  heading: string;
  gpsSignal: "ONLINE" | "NO SIGNAL" | "WEAK";
  lastUpdated: string;
}

// 18. Device Log
export interface DeviceTelemetryPacket {
  imei: string;
  company: string;
  branch: string;
  vehicleNo: string;
  vehicleModel: string;
  deviceModel: string;
  status: "ONLINE" | "OFFLINE";
  timestamp: string;
  rawPacketString: string;
  gpsValid: boolean;
  latitude: number;
  longitude: number;
  altitudeM: number;
  speedKmH: number;
  satellites: number;
  gsmSignalDbm: number;
  externalVoltageV: number;
  internalBatteryV: number;
  ignition: boolean;
  digitalInputs: string;
  digitalOutputs: string;
}

// 19. System Log
export interface SystemLogRow {
  id: string;
  timestamp: string;
  company: string;
  branch: string;
  deviceImei: string;
  simNumber: string;
  coordinates: string;
  signals: string;
  movementStatus: string;
  packetTimingMs: number;
  firmware: string;
  gpsValid: boolean;
  severity: "INFO" | "WARN" | "ERROR";
}

// 20 & 21. Scheduled Reports
export interface ScheduledReportItem {
  id: string;
  scheduleName: string;
  reportType: string;
  company: string;
  branch: string;
  vehicleScope: string;
  frequency: "Daily" | "Weekly" | "Monthly";
  fileFormat: "Excel (.xlsx)" | "PDF" | "CSV";
  nextDelivery: string;
  recipients: string[];
  isActive: boolean;
  lastDelivered?: string;
  deliveryStatus: "Active" | "Due Today" | "Delivered" | "Failed";
}

export interface ScheduledReportFormData {
  scheduleName: string;
  reportType: string;
  fileFormat: "Excel (.xlsx)" | "PDF" | "CSV";
  company: string;
  branch: string;
  vehicles: string;
  frequency: "Daily" | "Weekly" | "Monthly";
  deliveryTime: string;
  recipients: string;
  subject: string;
  notes?: string;
}

// 22. Vehicle Activation Report
export interface VehicleActivationRow {
  id: string;
  company: string;
  branch: string;
  vehicleType: string;
  vehicleNo: string;
  imei: string;
  simNo: string;
  vehicleCreationDate: string;
  gpsCreationDate: string;
  vehicleActivationDate: string;
  activatedBy: string;
  status: "ACTIVATED" | "PENDING" | "ATTENTION" | "EXPIRED";
}

// 23 & 24. Ignition Summary Types
export interface IgnitionSummaryOverviewRow {
  id: string;
  company: string;
  branch: string;
  vehicleNo: string;
  driverName: string;
  imei: string;
  ignitionOnDuration: string;
  ignitionOffDuration: string;
  runningTime: string;
  idleTime: string;
  distanceKm: number;
  ignitionCycles: number;
  currentStatus: "Engine running" | "Stopped";
}

export interface IgnitionEvent {
  id: string;
  eventNumber: string;
  routeName: string;
  ignitionOnTime: string;
  ignitionOffTime: string;
  runningTime: string;
  idleTime: string;
  distanceKm: number;
  avgSpeedKmH: number;
  maxSpeedKmH: number;
  startAddress: string;
  endAddress: string;
}
