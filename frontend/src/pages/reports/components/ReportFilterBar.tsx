import React from "react";
import { Search, Calendar, Filter, RotateCw, X } from "lucide-react";
import { ReportFilterState } from "@/types/reports.types";

interface ReportFilterBarProps {
  filters: ReportFilterState;
  onFilterChange: (newFilters: ReportFilterState) => void;
  onRefresh?: () => void;
  isLoading?: boolean;
  vehicleOptions?: string[];
  showVehicleFilter?: boolean;
}

export const ReportFilterBar: React.FC<ReportFilterBarProps> = ({
  filters,
  onFilterChange,
  onRefresh,
  isLoading = false,
  vehicleOptions,
  showVehicleFilter = true
}) => {
  const quickDatePresets = ["Today", "Yesterday", "Last 7 Days", "This Month"];

  const handleSearchChange = (val: string) => {
    onFilterChange({ ...filters, search: val });
  };

  const handleDatePresetClick = (preset: string) => {
    onFilterChange({ ...filters, dateRange: preset });
  };

  const handleVehicleChange = (val: string) => {
    onFilterChange({ ...filters, vehicle: val });
  };

  const clearAllFilters = () => {
    onFilterChange({
      search: "",
      company: undefined,
      branch: undefined,
      vehicle: undefined,
      dateRange: "Today",
      status: undefined
    });
  };

  const hasActiveFilters = Boolean(
    filters.search ||
      filters.vehicle ||
      (filters.dateRange && filters.dateRange !== "Today") ||
      filters.status
  );

  return (
    <div className="panel-card !p-3.5 space-y-3 border border-slate-200/80 dark:border-[#1D293D]">
      {/* Top row: Search input, vehicle filter, and refresh */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        {/* Search Input */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            value={filters.search}
            onChange={(e) => handleSearchChange(e.target.value)}
            placeholder="Search vehicle, driver, route or location..."
            className="w-full pl-9 pr-8 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors"
          />
          {filters.search && (
            <button
              onClick={() => handleSearchChange("")}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>

        {/* Right side controls */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Optional Vehicle Selector */}
          {showVehicleFilter && (
            <div className="relative min-w-[160px]">
              <select
                value={filters.vehicle || ""}
                onChange={(e) => handleVehicleChange(e.target.value)}
                className="w-full text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 py-2 px-3 text-slate-800 dark:text-slate-200 focus:outline-none focus:border-blue-500"
              >
                <option value="">All Vehicles</option>
                {vehicleOptions ? (
                  vehicleOptions.map((v) => (
                    <option key={v} value={v}>
                      {v}
                    </option>
                  ))
                ) : (
                  <>
                    <option value="GJ 01 RT 4821">GJ 01 RT 4821</option>
                    <option value="GJ 01 TX 2045">GJ 01 TX 2045</option>
                    <option value="MH 12 QX 9812">MH 12 QX 9812</option>
                    <option value="GJ 05 AB 1234">GJ 05 AB 1234</option>
                  </>
                )}
              </select>
            </div>
          )}

          {/* Refresh Action */}
          {onRefresh && (
            <button
              onClick={onRefresh}
              title="Refresh Report Data"
              disabled={isLoading}
              className="p-2 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors disabled:opacity-50"
            >
              <RotateCw className={`h-4 w-4 ${isLoading ? "animate-spin text-blue-500" : ""}`} />
            </button>
          )}

          {/* Clear Filters Action */}
          {hasActiveFilters && (
            <button
              onClick={clearAllFilters}
              className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-xs font-medium text-slate-500 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors"
            >
              <X className="h-3.5 w-3.5" />
              <span>Clear</span>
            </button>
          )}
        </div>
      </div>

      {/* Date preset chips */}
      <div className="flex flex-wrap items-center gap-1.5 pt-1 border-t border-slate-100 dark:border-slate-800/60">
        <span className="text-[11px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider mr-1 flex items-center gap-1">
          <Calendar className="h-3 w-3" />
          <span>Range:</span>
        </span>
        {quickDatePresets.map((preset) => {
          const isActive = (filters.dateRange || "Today") === preset;
          return (
            <button
              key={preset}
              onClick={() => handleDatePresetClick(preset)}
              className={`text-xs px-2.5 py-1 rounded-lg font-medium transition-all ${
                isActive
                  ? "bg-blue-600 text-white shadow-xs"
                  : "bg-slate-100 dark:bg-slate-800/80 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700"
              }`}
            >
              {preset}
            </button>
          );
        })}
      </div>
    </div>
  );
};
