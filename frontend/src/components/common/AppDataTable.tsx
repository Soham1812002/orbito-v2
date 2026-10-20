import React from "react";
import { AgGridReact } from "ag-grid-react";
import { ColDef, GridReadyEvent, ModuleRegistry, AllCommunityModule } from "ag-grid-community";
import { Search, ChevronLeft, ChevronRight, RotateCw } from "lucide-react";
import { useTheme } from "../../context/ThemeContext";

ModuleRegistry.registerModules([AllCommunityModule]);

// Note: AG Grid styles are imported in index.css

interface AppDataTableProps<T = any> {
  rowData: T[];
  columnDefs: ColDef<T>[];
  isLoading?: boolean;
  total?: number;
  page?: number;
  pageSize?: number;
  totalPages?: number;
  onPageChange?: (newPage: number) => void;
  onPageSizeChange?: (newPageSize: number) => void;
  searchTerm?: string;
  onSearchChange?: (term: string) => void;
  onRefresh?: () => void;
  actions?: React.ReactNode;
  height?: string | number;
}

export function AppDataTable<T = any>({
  rowData,
  columnDefs,
  isLoading = false,
  total = 0,
  page = 1,
  pageSize = 10,
  totalPages = 1,
  onPageChange,
  onPageSizeChange,
  searchTerm = "",
  onSearchChange,
  onRefresh,
  actions,
  height = "480px"
}: AppDataTableProps<T>) {
  const { theme } = useTheme();

  const onGridReady = (params: GridReadyEvent) => {
    params.api.sizeColumnsToFit();
  };

  return (
    <div className="flex flex-col gap-3 w-full">
      {/* Table Toolbar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        {onSearchChange && (
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search table records..."
              className="w-full pl-9 pr-3 py-1.5 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-colors"
            />
          </div>
        )}

        <div className="flex items-center gap-2 self-end sm:self-auto">
          {onRefresh && (
            <button
              onClick={onRefresh}
              title="Refresh records"
              className="p-1.5 rounded-lg border border-slate-300 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <RotateCw className={`h-4 w-4 ${isLoading ? "animate-spin text-indigo-500" : ""}`} />
            </button>
          )}
          {actions}
        </div>
      </div>

      {/* Grid Container */}
      <div
        className={`w-full overflow-hidden rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm ag-theme-quartz ${
          theme === "dark" ? "ag-theme-quartz-dark" : ""
        }`}
        style={{ height }}
      >
        <AgGridReact
          theme="legacy"
          rowData={rowData}
          columnDefs={columnDefs}
          onGridReady={onGridReady}
          rowSelection="single"
          animateRows={true}
          loading={isLoading}
          overlayLoadingTemplate={
            '<div class="flex items-center gap-2 text-slate-500 font-medium"><span>Loading records...</span></div>'
          }
          overlayNoRowsTemplate={
            '<div class="text-slate-400 py-6">No matching records found</div>'
          }
        />
      </div>

      {/* Pagination Footer */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-1 py-1 text-xs text-slate-500 dark:text-slate-400">
        <div className="flex items-center gap-2">
          <span>
            Showing <strong className="text-slate-900 dark:text-slate-200">{rowData.length}</strong> of{" "}
            <strong className="text-slate-900 dark:text-slate-200">{total}</strong> total entries
          </span>
          {onPageSizeChange && (
            <div className="flex items-center gap-1.5 ml-4">
              <span>Per page:</span>
              <select
                value={pageSize}
                onChange={(e) => onPageSizeChange(Number(e.target.value))}
                className="rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-2 py-0.5 text-xs text-slate-900 dark:text-slate-100 focus:outline-none focus:border-indigo-500"
              >
                <option value={10}>10</option>
                <option value={25}>25</option>
                <option value={50}>50</option>
                <option value={100}>100</option>
              </select>
            </div>
          )}
        </div>

        {onPageChange && (
          <div className="flex items-center gap-2">
            <span>
              Page <strong className="text-slate-900 dark:text-slate-200">{page}</strong> of{" "}
              <strong className="text-slate-900 dark:text-slate-200">{totalPages}</strong>
            </span>
            <div className="flex items-center gap-1 ml-2">
              <button
                onClick={() => onPageChange(page - 1)}
                disabled={page <= 1 || isLoading}
                className="p-1 rounded border border-slate-300 dark:border-slate-700 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                <ChevronLeft className="h-3.5 w-3.5" />
              </button>
              <button
                onClick={() => onPageChange(page + 1)}
                disabled={page >= totalPages || isLoading}
                className="p-1 rounded border border-slate-300 dark:border-slate-700 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                <ChevronRight className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
