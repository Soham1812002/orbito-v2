import React, { useState } from "react";
import {
  ChevronUp,
  ChevronDown,
  Search,
  Navigation,
  Car,
  Fuel,
  Battery,
  User,
  Crosshair
} from "lucide-react";
import { VehicleTelemetry, VehicleStatus } from "../vehicles.types";

interface LiveVehicleSwitcherProps {
  vehicles: VehicleTelemetry[];
  selectedVehicleId?: string;
  onSelectVehicle: (vehicle: VehicleTelemetry) => void;
}

export const LiveVehicleSwitcher: React.FC<LiveVehicleSwitcherProps> = ({
  vehicles,
  selectedVehicleId,
  onSelectVehicle
}) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const [statusFilter, setStatusFilter] = useState<VehicleStatus | "all">("all");
  const [searchQuery, setSearchQuery] = useState("");

  const counts = {
    all: vehicles.length,
    moving: vehicles.filter((v) => v.status === "moving").length,
    idling: vehicles.filter((v) => v.status === "idling").length,
    stopped: vehicles.filter((v) => v.status === "stopped").length,
    inactive: vehicles.filter((v) => v.status === "inactive").length
  };

  const filteredVehicles = vehicles.filter((v) => {
    const matchesStatus = statusFilter === "all" || v.status === statusFilter;
    const matchesSearch =
      v.plateNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.driver.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.companyName.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const statusColors = {
    moving: "bg-emerald-500",
    idling: "bg-amber-500",
    stopped: "bg-rose-500",
    inactive: "bg-slate-400"
  };

  return (
    <div className="absolute bottom-4 left-4 right-4 sm:right-auto sm:w-[540px] z-20 flex flex-col rounded-2xl border border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md shadow-2xl transition-all duration-300 overflow-hidden">
      {/* Dock Bar / Collapsible Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/40">
        <div className="flex items-center gap-2">
          <Car className="h-4 w-4 text-blue-600 dark:text-blue-400" />
          <span className="text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200">
            Live Fleet Monitor
          </span>
          <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-blue-100 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-900">
            {filteredVehicles.length} of {vehicles.length}
          </span>
        </div>

        <button
          onClick={() => setIsExpanded(!isExpanded)}
          aria-label={isExpanded ? "Collapse fleet switcher" : "Expand fleet switcher"}
          className="flex items-center gap-1 text-xs font-semibold text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 transition-colors"
        >
          <span>{isExpanded ? "Hide" : "Show"}</span>
          {isExpanded ? <ChevronDown className="h-4 w-4" /> : <ChevronUp className="h-4 w-4" />}
        </button>
      </div>

      {isExpanded && (
        <div className="p-3 space-y-3">
          {/* Status Filter Chips */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs no-scrollbar">
            <button
              onClick={() => setStatusFilter("all")}
              className={`px-2.5 py-1 rounded-lg font-medium transition-colors shrink-0 ${
                statusFilter === "all"
                  ? "bg-blue-600 text-white shadow-sm"
                  : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700"
              }`}
            >
              All ({counts.all})
            </button>
            <button
              onClick={() => setStatusFilter("moving")}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-lg font-medium transition-colors shrink-0 ${
                statusFilter === "moving"
                  ? "bg-emerald-600 text-white shadow-sm"
                  : "bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-100"
              }`}
            >
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
              Moving ({counts.moving})
            </button>
            <button
              onClick={() => setStatusFilter("idling")}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-lg font-medium transition-colors shrink-0 ${
                statusFilter === "idling"
                  ? "bg-amber-600 text-white shadow-sm"
                  : "bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 hover:bg-amber-100"
              }`}
            >
              <span className="h-2 w-2 rounded-full bg-amber-400" />
              Idling ({counts.idling})
            </button>
            <button
              onClick={() => setStatusFilter("stopped")}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-lg font-medium transition-colors shrink-0 ${
                statusFilter === "stopped"
                  ? "bg-rose-600 text-white shadow-sm"
                  : "bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 hover:bg-rose-100"
              }`}
            >
              <span className="h-2 w-2 rounded-full bg-rose-400" />
              Stopped ({counts.stopped})
            </button>
            <button
              onClick={() => setStatusFilter("inactive")}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-lg font-medium transition-colors shrink-0 ${
                statusFilter === "inactive"
                  ? "bg-slate-600 text-white shadow-sm"
                  : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200"
              }`}
            >
              <span className="h-2 w-2 rounded-full bg-slate-400" />
              Inactive ({counts.inactive})
            </button>
          </div>

          {/* Quick Search */}
          <div className="relative">
            <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by plate number, driver, or fleet partner..."
              className="w-full rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 pl-8 pr-3 py-1.5 text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Scrollable Vehicle Cards Container */}
          <div className="max-h-56 overflow-y-auto space-y-1.5 pr-1 divide-y divide-slate-100 dark:divide-slate-800/60">
            {filteredVehicles.length === 0 ? (
              <div className="py-6 text-center text-xs text-slate-400">
                No vehicles match the selected filter.
              </div>
            ) : (
              filteredVehicles.map((vehicle) => {
                const isSelected = vehicle.id === selectedVehicleId;
                return (
                  <div
                    key={vehicle.id}
                    onClick={() => onSelectVehicle(vehicle)}
                    className={`pt-1.5 first:pt-0 cursor-pointer rounded-lg p-2 transition-all duration-150 flex items-center justify-between ${
                      isSelected
                        ? "bg-blue-50 dark:bg-blue-950/40 border border-blue-500/40 shadow-sm"
                        : "hover:bg-slate-50 dark:hover:bg-slate-800/40"
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="relative flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-slate-100 dark:bg-slate-800">
                        <Navigation
                          className="h-4 w-4 text-slate-700 dark:text-slate-300"
                          style={{ transform: `rotate(${vehicle.heading}deg)` }}
                        />
                        <span
                          className={`absolute -top-0.5 -right-0.5 h-2 w-2 rounded-full border border-white dark:border-slate-900 ${
                            statusColors[vehicle.status]
                          }`}
                        />
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5">
                          <p className="text-xs font-bold text-slate-900 dark:text-white truncate">
                            {vehicle.plateNumber}
                          </p>
                          <span className="text-[10px] text-slate-400 uppercase font-mono">
                            {vehicle.speed} km/h
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate flex items-center gap-1">
                          <User className="h-3 w-3 shrink-0" />
                          {vehicle.driver.name} • {vehicle.companyName}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 shrink-0">
                      <div className="text-right text-[11px] text-slate-500 hidden sm:block">
                        <p className="font-semibold text-slate-700 dark:text-slate-300">
                          {vehicle.todayDistance} km
                        </p>
                        <p className="text-[10px] text-slate-400">Today</p>
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelectVehicle(vehicle);
                        }}
                        aria-label={`Center ${vehicle.plateNumber} on map`}
                        className="flex h-7 w-7 items-center justify-center rounded-md bg-slate-100 hover:bg-blue-600 hover:text-white dark:bg-slate-800 dark:hover:bg-blue-600 text-slate-500 dark:text-slate-400 transition-colors"
                      >
                        <Crosshair className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
};
