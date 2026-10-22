import React from "react";
import { Search, Filter, RefreshCw, Download, Plus } from "lucide-react";
import { Button } from "@/components/common/Button";

interface PoiFilterBarProps {
  search: string;
  onSearchChange: (value: string) => void;
  company?: string;
  onCompanyChange?: (value: string) => void;
  branch?: string;
  onBranchChange?: (value: string) => void;
  category?: string;
  onCategoryChange?: (value: string) => void;
  onRefresh?: () => void;
  onExport?: () => void;
  onCreateNew?: () => void;
  createLabel?: string;
  isRefreshing?: boolean;
  categories?: string[];
  placeholder?: string;
}

export const PoiFilterBar: React.FC<PoiFilterBarProps> = ({
  search,
  onSearchChange,
  company = "ALL",
  onCompanyChange,
  branch = "ALL",
  onBranchChange,
  category = "ALL",
  onCategoryChange,
  onRefresh,
  onExport,
  onCreateNew,
  createLabel = "Add POI",
  isRefreshing = false,
  categories = [
    "Toll Plaza",
    "Depot",
    "Plant",
    "Logistics Hub",
    "Staging Yard",
    "Client Site"
  ],
  placeholder = "Search by place, geocode, or address..."
}) => {
  return (
    <div className="panel-card p-3 sm:p-4 mb-4">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3">
        {/* Left: Search & Filter Selects */}
        <div className="flex flex-1 flex-col sm:flex-row flex-wrap items-center gap-2.5">
          {/* Search Input */}
          <div className="relative w-full sm:w-64 lg:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 dark:text-slate-500" />
            <input
              type="text"
              value={search}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder={placeholder}
              className="w-full h-10 pl-9 pr-3 text-xs sm:text-sm rounded-xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900 text-slate-800 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors"
            />
          </div>

          {/* Company Filter */}
          {onCompanyChange && (
            <div className="w-full sm:w-44">
              <select
                value={company}
                onChange={(e) => onCompanyChange(e.target.value)}
                className="w-full h-10 px-3 text-xs sm:text-sm rounded-xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors"
              >
                <option value="ALL">All Companies</option>
                <option value="InOrbit Logistics">InOrbit Logistics</option>
                <option value="Apex Fleetworks">Apex Fleetworks</option>
                <option value="TransGlobal Freight">TransGlobal Freight</option>
              </select>
            </div>
          )}

          {/* Branch Filter */}
          {onBranchChange && (
            <div className="w-full sm:w-44">
              <select
                value={branch}
                onChange={(e) => onBranchChange(e.target.value)}
                className="w-full h-10 px-3 text-xs sm:text-sm rounded-xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors"
              >
                <option value="ALL">All Branches</option>
                <option value="Western Hub">Western Hub</option>
                <option value="North Region">North Region</option>
                <option value="Maharashtra Central">Maharashtra Central</option>
                <option value="Southern Maritime">Southern Maritime</option>
              </select>
            </div>
          )}

          {/* Category Filter */}
          {onCategoryChange && categories.length > 0 && (
            <div className="w-full sm:w-44">
              <select
                value={category}
                onChange={(e) => onCategoryChange(e.target.value)}
                className="w-full h-10 px-3 text-xs sm:text-sm rounded-xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors"
              >
                <option value="ALL">All Categories</option>
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>

        {/* Right: Actions (Refresh, Export, Add) */}
        <div className="flex items-center gap-2 self-end lg:self-auto">
          {onRefresh && (
            <Button
              variant="outline"
              size="sm"
              onClick={onRefresh}
              isLoading={isRefreshing}
              className="h-10 px-3"
              title="Refresh table data"
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

export default PoiFilterBar;
