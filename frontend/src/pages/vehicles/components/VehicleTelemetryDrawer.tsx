import React from "react";
import {
  X,
  Navigation,
  Gauge,
  Battery,
  Fuel,
  Thermometer,
  ShieldAlert,
  Share2,
  Clock,
  Phone,
  UserCheck,
  Radio,
  MapPin,
  Lock,
  Unlock,
  Copy,
  Check,
  Wrench,
  FileText
} from "lucide-react";
import { VehicleTelemetry } from "../vehicles.types";
import { Button } from "@/components/common/Button";

interface VehicleTelemetryDrawerProps {
  vehicle: VehicleTelemetry | null;
  isOpen: boolean;
  onClose: () => void;
  onImmobilize: (vehicle: VehicleTelemetry) => void;
  onShare: (vehicle: VehicleTelemetry) => void;
  onPlayback: (vehicleId: string) => void;
  onOpenReminders?: (vehicle: VehicleTelemetry) => void;
  onOpenReports?: (vehicle: VehicleTelemetry) => void;
}

export const VehicleTelemetryDrawer: React.FC<VehicleTelemetryDrawerProps> = ({
  vehicle,
  isOpen,
  onClose,
  onImmobilize,
  onShare,
  onPlayback,
  onOpenReminders,
  onOpenReports
}) => {
  const [copiedCoords, setCopiedCoords] = React.useState(false);

  if (!isOpen || !vehicle) return null;

  const handleCopyCoords = () => {
    navigator.clipboard.writeText(`${vehicle.latitude}, ${vehicle.longitude}`);
    setCopiedCoords(true);
    setTimeout(() => setCopiedCoords(false), 2000);
  };

  const statusBadgeConfig = {
    moving: { label: "Moving", bg: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30" },
    idling: { label: "Idling", bg: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30" },
    stopped: { label: "Stopped", bg: "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/30" },
    inactive: { label: "Inactive", bg: "bg-slate-500/10 text-slate-600 dark:text-slate-400 border-slate-500/30" }
  };

  const badge = statusBadgeConfig[vehicle.status];

  return (
    <aside
      aria-label="Vehicle Telemetry Details"
      className="absolute top-4 right-4 bottom-4 z-30 w-full sm:w-96 max-w-[calc(100vw-2rem)] flex flex-col rounded-2xl border border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md shadow-2xl overflow-hidden transition-all duration-300"
    >
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 p-4 bg-slate-50/50 dark:bg-slate-950/40">
        <div className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-600/10 text-blue-600 dark:text-blue-400">
            <Navigation className="h-5 w-5" style={{ transform: `rotate(${vehicle.heading}deg)` }} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-slate-900 dark:text-white tracking-wide">
                {vehicle.plateNumber}
              </h2>
              <span className={`px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider rounded-full border ${badge.bg}`}>
                {badge.label}
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium truncate max-w-[200px]">
              {vehicle.makeModel} • {vehicle.companyName}
            </p>
          </div>
        </div>
        <button
          onClick={onClose}
          aria-label="Close telemetry details"
          className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-800 dark:hover:text-slate-200 transition-colors"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      {/* Content Area - Scrollable */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* Speedometer & Ignition Hub */}
        <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-950/60 p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-baseline gap-1">
              <span className="text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">
                {vehicle.speed}
              </span>
              <span className="text-xs font-semibold text-slate-500 uppercase">km/h</span>
            </div>
            <div className="flex items-center gap-2">
              <span
                className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${
                  vehicle.ignition
                    ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                    : "bg-slate-500/10 text-slate-600 dark:text-slate-400"
                }`}
              >
                <span className={`h-2 w-2 rounded-full ${vehicle.ignition ? "bg-emerald-500 animate-pulse" : "bg-slate-400"}`} />
                {vehicle.ignition ? "IGNITION ON" : "IGNITION OFF"}
              </span>
            </div>
          </div>

          {/* Real-time Telemetry Bars */}
          <div className="mt-4 grid grid-cols-2 gap-3 text-xs">
            <div className="rounded-lg bg-white dark:bg-slate-900 p-2.5 border border-slate-200/60 dark:border-slate-800">
              <div className="flex items-center justify-between text-slate-500 mb-1">
                <span className="flex items-center gap-1">
                  <Fuel className="h-3.5 w-3.5 text-blue-500" /> Fuel / Energy
                </span>
                <span className="font-semibold text-slate-800 dark:text-slate-200">{vehicle.fuelPercent}%</span>
              </div>
              <div className="h-1.5 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                <div className="h-full bg-blue-600 rounded-full" style={{ width: `${vehicle.fuelPercent}%` }} />
              </div>
            </div>

            <div className="rounded-lg bg-white dark:bg-slate-900 p-2.5 border border-slate-200/60 dark:border-slate-800">
              <div className="flex items-center justify-between text-slate-500 mb-1">
                <span className="flex items-center gap-1">
                  <Battery className="h-3.5 w-3.5 text-emerald-500" /> Battery
                </span>
                <span className="font-semibold text-slate-800 dark:text-slate-200">{vehicle.batteryPercent}%</span>
              </div>
              <div className="h-1.5 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${vehicle.batteryPercent}%` }} />
              </div>
            </div>
          </div>

          <div className="mt-3 grid grid-cols-3 gap-2 text-center">
            <div className="rounded-lg bg-white dark:bg-slate-900 p-2 border border-slate-200/60 dark:border-slate-800">
              <p className="text-[10px] text-slate-500">Odometer</p>
              <p className="text-xs font-bold text-slate-800 dark:text-slate-200 mt-0.5">{vehicle.odometer.toLocaleString()} km</p>
            </div>
            <div className="rounded-lg bg-white dark:bg-slate-900 p-2 border border-slate-200/60 dark:border-slate-800">
              <p className="text-[10px] text-slate-500">Today</p>
              <p className="text-xs font-bold text-slate-800 dark:text-slate-200 mt-0.5">{vehicle.todayDistance} km</p>
            </div>
            <div className="rounded-lg bg-white dark:bg-slate-900 p-2 border border-slate-200/60 dark:border-slate-800">
              <p className="text-[10px] text-slate-500">Engine Temp</p>
              <p className="text-xs font-bold text-slate-800 dark:text-slate-200 mt-0.5">{vehicle.engineTemp}°C</p>
            </div>
          </div>
        </div>

        {/* Location & GPS Fix */}
        <div className="rounded-xl border border-slate-200 dark:border-slate-800 p-3.5 space-y-2 bg-white dark:bg-slate-900">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-700 dark:text-slate-300">
            <span className="flex items-center gap-1.5">
              <MapPin className="h-4 w-4 text-rose-500" /> Current Location
            </span>
            <span className="text-[11px] text-slate-400">{vehicle.lastUpdated}</span>
          </div>
          <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
            {vehicle.lastLocation}
          </p>
          <div className="flex items-center justify-between pt-1 border-t border-slate-100 dark:border-slate-800 text-[11px] text-slate-500">
            <span className="font-mono">{vehicle.latitude.toFixed(4)}° N, {vehicle.longitude.toFixed(4)}° E</span>
            <button
              onClick={handleCopyCoords}
              className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-700 dark:text-blue-400 font-medium"
            >
              {copiedCoords ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
              {copiedCoords ? "Copied" : "Copy"}
            </button>
          </div>
        </div>

        {/* Driver Assigned Card */}
        <div className="rounded-xl border border-slate-200 dark:border-slate-800 p-3.5 bg-white dark:bg-slate-900">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
              <UserCheck className="h-4 w-4 text-blue-500" /> Assigned Driver
            </span>
            <span className="text-[11px] font-medium text-amber-500">⭐ {vehicle.driver.rating || 4.8} / 5.0</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-600 text-white font-bold text-sm">
              {vehicle.driver.name.split(" ").map((n) => n[0]).join("")}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold text-slate-900 dark:text-white truncate">
                {vehicle.driver.name}
              </p>
              <p className="text-xs text-slate-500 font-mono">
                {vehicle.driver.licenseNumber}
              </p>
            </div>
            <a
              href={`tel:${vehicle.driver.phone}`}
              className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-100 transition-colors"
              title="Call driver"
            >
              <Phone className="h-4 w-4" />
            </a>
          </div>
        </div>

        {/* Device & Immobilizer Status */}
        <div className="rounded-xl border border-slate-200 dark:border-slate-800 p-3.5 bg-white dark:bg-slate-900 space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-500 flex items-center gap-1.5">
              <Radio className="h-4 w-4 text-slate-400" /> Telematics Device
            </span>
            <span className="font-mono text-slate-700 dark:text-slate-300 text-[11px]">{vehicle.deviceImei}</span>
          </div>
          <div className="flex items-center justify-between pt-1 border-t border-slate-100 dark:border-slate-800 text-xs">
            <span className="text-slate-500 flex items-center gap-1.5">
              {vehicle.immobilizerState === "cut_off" ? (
                <Lock className="h-4 w-4 text-rose-500" />
              ) : (
                <Unlock className="h-4 w-4 text-emerald-500" />
              )}
              Engine Relay
            </span>
            <span
              className={`font-semibold text-[11px] ${
                vehicle.immobilizerState === "cut_off"
                  ? "text-rose-600 dark:text-rose-400"
                  : "text-emerald-600 dark:text-emerald-400"
              }`}
            >
              {vehicle.immobilizerState === "cut_off" ? "CUT-OFF ACTIVE" : "NORMAL (UNLOCKED)"}
            </span>
          </div>
        </div>
      </div>

      {/* Action Triggers Footer */}
      <div className="p-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/40 space-y-2">
        <Button
          variant="primary"
          size="md"
          className="w-full justify-center"
          leftIcon={<Clock className="h-4 w-4" />}
          onClick={() => onPlayback(vehicle.id)}
        >
          Replay Today's Route
        </Button>
        <div className="grid grid-cols-2 gap-2">
          <Button
            variant="outline"
            size="sm"
            className="w-full justify-center border-rose-300 dark:border-rose-900/60 text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30"
            leftIcon={<ShieldAlert className="h-3.5 w-3.5" />}
            onClick={() => onImmobilize(vehicle)}
          >
            Immobilizer
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="w-full justify-center"
            leftIcon={<Share2 className="h-3.5 w-3.5" />}
            onClick={() => onShare(vehicle)}
          >
            Share Link
          </Button>
        </div>
        <div className="grid grid-cols-2 gap-2 pt-1">
          {onOpenReminders && (
            <Button
              variant="outline"
              size="sm"
              className="w-full justify-center text-xs"
              leftIcon={<Wrench className="h-3.5 w-3.5 text-blue-500" />}
              onClick={() => onOpenReminders(vehicle)}
            >
              Reminders
            </Button>
          )}
          {onOpenReports && (
            <Button
              variant="outline"
              size="sm"
              className="w-full justify-center text-xs"
              leftIcon={<FileText className="h-3.5 w-3.5 text-indigo-500" />}
              onClick={() => onOpenReports(vehicle)}
            >
              Reports
            </Button>
          )}
        </div>
      </div>
    </aside>
  );
};
