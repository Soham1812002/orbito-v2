import React, { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import type { ColDef } from "ag-grid-community";
import { SquareSlash, ArrowUpRight } from "lucide-react";
import { ReportBreadcrumbs } from "@/pages/reports/components/ReportBreadcrumbs";
import { ReportKpiCards } from "@/pages/reports/components/ReportKpiCards";
import { ReportFilterBar } from "@/pages/reports/components/ReportFilterBar";
import { ReportExportToolbar } from "@/pages/reports/components/ReportExportToolbar";
import { AppDataTable } from "@/components/common/AppDataTable";
import { reportsApi } from "@/api/reports.api";
import { StoppageOverviewRow, ReportKpiMetric, ReportFilterState } from "@/types/reports.types";

export const StoppageSummaryOverviewPage: React.FC = () => {
  const [kpis, setKpis] = useState<ReportKpiMetric[]>([]);
  const [rows, setRows] = useState<StoppageOverviewRow[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filters, setFilters] = useState<ReportFilterState>({
    search: "",
    dateRange: "Today"
  });

  const loadData = async () => {
    setIsLoading(true);
    try {
      const data = await reportsApi.getStoppageOverview(filters);
      setKpis(data.kpis);
      setRows(data.rows);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [filters.search, filters.dateRange, filters.vehicle]);

  const columns = useMemo<ColDef<StoppageOverviewRow>[]>(
    () => [
      {
        headerName: "Vehicle Details",
        field: "vehicleNo",
        minWidth: 160,
        cellRenderer: (params: any) => {
          const row: StoppageOverviewRow = params.data;
          if (!row) return null;
          return (
            <div>
              <div className="font-bold text-slate-900 dark:text-white font-mono text-xs">
                {row.vehicleNo}
              </div>
              <div className="text-2xs text-slate-400 truncate max-w-xs">
                Last: {row.lastStoppageLocation}
              </div>
            </div>
          );
        }
      },
      {
        headerName: "Branch",
        field: "branch",
        minWidth: 130,
        cellRenderer: (params: any) => (
          <span className="text-slate-700 dark:text-slate-300 font-medium">
            {params.value}
          </span>
        )
      },
      {
        headerName: "Assigned Driver",
        field: "driverName",
        minWidth: 140,
        cellRenderer: (params: any) => (
          <span className="font-semibold text-slate-800 dark:text-slate-200">
            {params.value}
          </span>
        )
      },
      {
        headerName: "Total Stoppages",
        field: "totalStoppages",
        minWidth: 130,
        cellRenderer: (params: any) => (
          <span className="px-2.5 py-0.5 rounded-full font-mono text-2xs font-bold bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800/60">
            {params.value} Events
          </span>
        )
      },
      {
        headerName: "Stoppage Time",
        field: "totalStoppageTime",
        minWidth: 130,
        cellRenderer: (params: any) => (
          <span className="font-mono font-bold text-2xs text-rose-600 dark:text-rose-400">
            {params.value}
          </span>
        )
      },
      {
        headerName: "Longest Stoppage",
        field: "longestStoppage",
        minWidth: 130,
        cellRenderer: (params: any) => (
          <span className="font-mono text-2xs text-slate-700 dark:text-slate-300">
            {params.value}
          </span>
        )
      },
      {
        headerName: "Avg Stoppage",
        field: "avgStoppageTime",
        minWidth: 120,
        cellRenderer: (params: any) => (
          <span className="font-mono text-2xs text-slate-500">
            {params.value}
          </span>
        )
      },
      {
        headerName: "Actions",
        field: "vehicleNo",
        minWidth: 120,
        sortable: false,
        filter: false,
        cellRenderer: (params: any) => (
          <Link
            to={`/reports/stoppage-summary/${encodeURIComponent(params.value)}`}
            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-amber-50 dark:bg-amber-950/30 text-amber-700 dark:text-amber-400 hover:bg-amber-600 hover:text-white font-semibold text-2xs transition-colors"
          >
            <span>View Events</span>
            <ArrowUpRight className="h-3.5 w-3.5" />
          </Link>
        )
      }
    ],
    []
  );

  return (
    <div className="space-y-6">
      <ReportBreadcrumbs items={[{ label: "Fleet Activity" }, { label: "Stoppage Summary" }]} />

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="space-y-1">
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            Stoppage Summary
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Review vehicle stoppage events, duration trends, and complete stoppage activity by branch.
          </p>
        </div>
      </div>

      <ReportKpiCards metrics={kpis} />

      <ReportFilterBar
        filters={filters}
        onFilterChange={setFilters}
        onRefresh={loadData}
        isLoading={isLoading}
      />

      <ReportExportToolbar
        totalCount={rows.length}
        reportTitle="Stoppage Summary Report"
        dataToExport={rows}
      />

      {/* Responsive Data Table using AppDataTable */}
      <div className="-mx-4 sm:mx-0 overflow-x-auto">
        <AppDataTable<StoppageOverviewRow>
          rowData={rows}
          columnDefs={columns}
          isLoading={isLoading}
          total={rows.length}
        />
      </div>
    </div>
  );
};

export default StoppageSummaryOverviewPage;
