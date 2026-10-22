import React from "react";
import { Search, RefreshCw, Download, Plus } from "lucide-react";
import { Button } from "@/components/common/Button";

interface GeofenceFilterBarProps {
  search: string;
  onSearchChange: (value: string) => void;
  type?: string;
  onTypeChange?: (value: string) => void;
  category?: string;
  onCategoryChange?: (value: string) => void;
  onRefresh?: () => void;
  onExport?: () => void;
  onCreateNew?: () => void;
  createLabel?: string;
  isRefreshing?: boolean;
  placeholder?: string;
}

export const GeofenceFilterBar: React.FC<GeofenceFilterBarProps> = ({
  search,
  onSearchChange,
  type = "ALL",
  onTypeChange,
  category = "ALL",
  onCategoryChange,
  onRefresh,
  onExport,
  onCreateNew,
  createLabel = "Create Geofence",
  isRefreshing = false,
  placeholder = "Search geofence name, category, or branch..."
}) => {
  return (
    <div className="panel-card p-3 sm:p-4 mb-4">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3">
        {/* Left: Filters */}
        <div className="flex flex-1 flex-col sm:flex-row flex-wrap items-center gap-2.5">
          {/* Search */}
          <div className="relative w-full sm:w-64 lg:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder={placeholder}
              className="w-full h-10 pl-9 pr-3 text-xs sm:text-sm rounded-xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900 text-slate-800 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors"
            />
          </div>

          {/* Type Filter */}
          {onTypeChange && (
            <div className="w-full sm:w-40">
              <select
                value={type}
                onChange={(e) => onTypeChange(e.target.value)}
                className="w-full h-10 px-3 text-xs sm:text-sm rounded-xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors"
              >
                <option value="ALL">All Types</option>
                <option value="circular">Circular</option>
                <option value="polygon">Polygon</option>
              </select>
            </div>
          )}

          {/* Category Filter */}
          {onCategoryChange && (
            <div className="w-full sm:w-44">
              <select
                value={category}
                onChange={(e) => onCategoryChange(e.target.value)}
                className="w-full h-10 px-3 text-xs sm:text-sm rounded-xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors"
              >
                <option value="ALL">All Categories</option>
                <option value="Warehouse">Warehouse</option>
                <option value="Plant">Plant</option>
                <option value="Yard">Yard</option>
                <option value="Restricted Zone">Restricted Zone</option>
                <option value="Customer Depot">Customer Depot</option>
              </select>
            </div>
          )}
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-2 self-end lg:self-auto">
          {onRefresh && (
            <Button
              variant="outline"
              size="sm"
              onClick={onRefresh}
              isLoading={isRefreshing}
              className="h-10 px-3"
              title="Refresh geofence data"
            >
              <RefreshCw className={`h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`} />
            </Button>
          )}

          {onExport && (
            <Button
              variant="outline"
              size="sm"
              onClick={onExport}
              leftIcon={<Download className="h-4 w-4" />}
              className="h-10 text-xs font-semibold"
            >
              Export Excel
            </Button>
          )}

          {onCreateNew && (
            <Button
              variant="primary"
              size="sm"
              onClick={onCreateNew}
              leftIcon={<Plus className="h-4 w-4" />}
              className="h-10 text-xs font-semibold bg-[#2563EB] hover:bg-[#1D4ED8] text-white"
            >
              {createLabel}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default GeofenceFilterBar;
