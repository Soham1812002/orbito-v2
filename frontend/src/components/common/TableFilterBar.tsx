import React from "react";
import { Search, RefreshCw, Download, Plus } from "lucide-react";
import { Button } from "./Button";

export interface StatusFilterOption {
  label: string;
  value: string;
}

export interface TableFilterBarProps {
  search: string;
  onSearchChange: (value: string) => void;
  searchPlaceholder?: string;
  statusFilter?: string;
  onStatusFilterChange?: (status: string) => void;
  statusOptions?: (string | StatusFilterOption)[];
  filters?: React.ReactNode;
  onRefresh?: () => void;
  isRefreshing?: boolean;
  onExport?: () => void;
  exportLabel?: string;
  onCreateNew?: () => void;
  createLabel?: string;
  extraActions?: React.ReactNode;
  className?: string;
}

export const TableFilterBar: React.FC<TableFilterBarProps> = ({
  search,
  onSearchChange,
  searchPlaceholder = "Search records...",
  statusFilter,
  onStatusFilterChange,
  statusOptions = ["ALL", "ACTIVE", "INACTIVE"],
  filters,
  onRefresh,
  isRefreshing = false,
  onExport,
  exportLabel = "Export CSV",
  onCreateNew,
  createLabel = "Add Record",
  extraActions,
  className = ""
}) => {
  return (
    <div className={`panel-card p-3 sm:p-4 mb-4 ${className}`}>
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3">
        {/* Left Side: Search + Status Chips + Additional Custom Filters */}
        <div className="flex flex-1 flex-col sm:flex-row flex-wrap items-stretch sm:items-center gap-2.5">
          {/* Search Box */}
          <div className="relative w-full sm:w-60 lg:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 dark:text-slate-500" />
            <input
              type="text"
              value={search}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder={searchPlaceholder}
              className="w-full h-10 pl-9 pr-3 text-xs sm:text-sm rounded-xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900 text-slate-800 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors"
            />
          </div>

          {/* Optional Status Filter Chips */}
          {statusFilter !== undefined && onStatusFilterChange && (
            <div className="inline-flex items-center rounded-xl border border-slate-200 dark:border-slate-800 p-0.5 bg-slate-50 dark:bg-slate-950/60 overflow-x-auto">
              {statusOptions.map((opt) => {
                const val = typeof opt === "string" ? opt : opt.value;
                const label = typeof opt === "string" ? opt : opt.label;
                const isSelected = statusFilter === val;

                return (
                  <button
                    key={val}
                    type="button"
                    onClick={() => onStatusFilterChange(val)}
                    className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap cursor-pointer ${
                      isSelected
                        ? "bg-blue-600 text-white shadow-xs dark:bg-blue-600 dark:text-white"
                        : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                    }`}
                  >
                    {label}
                  </button>
                );
              })}
            </div>
          )}

          {/* Additional Filter Slots */}
          {filters}
        </div>

        {/* Right Side: Standard Action Buttons (Refresh, Export, Create) */}
        <div className="flex items-center gap-2 self-end lg:self-auto shrink-0 flex-wrap">
          {onRefresh && (
            <Button
              variant="outline"
              size="sm"
              onClick={onRefresh}
              isLoading={isRefreshing}
              title="Refresh table records"
            >
              <RefreshCw className={`h-3.5 w-3.5 ${isRefreshing ? "animate-spin" : ""}`} />
            </Button>
          )}

          {onExport && (
            <Button
              variant="outline"
              size="sm"
              onClick={onExport}
              leftIcon={<Download className="h-3.5 w-3.5" />}
            >
              {exportLabel}
            </Button>
          )}

          {onCreateNew && (
            <Button
              variant="primary"
              size="sm"
              onClick={onCreateNew}
              leftIcon={<Plus className="h-3.5 w-3.5" />}
            >
              {createLabel}
            </Button>
          )}

          {extraActions}
        </div>
      </div>
    </div>
  );
};

export default TableFilterBar;
