import React, { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import type { ColDef } from "ag-grid-community";
import { Radio, ArrowUpRight } from "lucide-react";
import { ReportBreadcrumbs } from "@/pages/reports/components/ReportBreadcrumbs";
import { ReportKpiCards } from "@/pages/reports/components/ReportKpiCards";
import { ReportFilterBar } from "@/pages/reports/components/ReportFilterBar";
import { ReportExportToolbar } from "@/pages/reports/components/ReportExportToolbar";
import { AppDataTable } from "@/components/common/AppDataTable";
import { reportsApi } from "@/api/reports.api";
import { InactiveOverviewRow, ReportKpiMetric, ReportFilterState } from "@/types/reports.types";

export const InactiveSummaryOverviewPage: React.FC = () => {
  const [kpis, setKpis] = useState<ReportKpiMetric[]>([]);
  const [rows, setRows] = useState<InactiveOverviewRow[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filters, setFilters] = useState<ReportFilterState>({
    search: "",
    dateRange: "Today"
  });

  const loadData = async () => {
    setIsLoading(true);
    try {
      const data = await reportsApi.getInactiveOverview(filters);
      setKpis(data.kpis);
      setRows(data.rows);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [filters.search, filters.dateRange, filters.vehicle]);

  const columns = useMemo<ColDef<InactiveOverviewRow>[]>(
    () => [
      {
        headerName: "Vehicle Details",
        field: "vehicleNo",
        minWidth: 170,
        cellRenderer: (params: any) => (
          <div>
            <div className="font-bold text-slate-900 dark:text-white font-mono text-xs">
              {params.value}
            </div>
            <div className="text-[11px] text-slate-400">{params.data?.driverName}</div>
          </div>
        )
      },
      {
        headerName: "Branch",
        field: "branch",
        minWidth: 140,
        cellRenderer: (params: any) => (
          <span className="text-slate-700 dark:text-slate-300 font-medium">
            {params.value}
          </span>
        )
      },
      {
        headerName: "Inactive Since",
        field: "inactiveSince",
        minWidth: 160,
        cellRenderer: (params: any) => (
          <span className="font-mono text-2xs text-slate-600 dark:text-slate-300">
            {params.value}
          </span>
        )
      },
      {
        headerName: "Last Reported Location",
        field: "lastLocation",
        minWidth: 220,
        cellRenderer: (params: any) => (
          <span className="text-slate-600 dark:text-slate-300 truncate" title={params.value}>
            {params.value}
          </span>
        )
      },
      {
        headerName: "Inactive Duration",
        field: "inactiveDuration",
        minWidth: 140,
        cellRenderer: (params: any) => (
          <span className="font-mono font-bold text-2xs text-rose-600 dark:text-rose-400">
            {params.value}
          </span>
        )
      },
      {
        headerName: "GPS Status",
        field: "gpsStatus",
        minWidth: 130,
        cellRenderer: (params: any) => (
          <span
            className={`inline-block text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full border ${
              params.value === "OVER 24 HR"
                ? "bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-400 border-rose-200 dark:border-rose-800/60"
                : "bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400 border-amber-200 dark:border-amber-800/60"
            }`}
          >
            {params.value}
          </span>
        )
      },
      {
        headerName: "Actions",
        field: "vehicleNo",
        minWidth: 130,
        sortable: false,
        filter: false,
        cellRenderer: (params: any) => (
          <Link
            to={`/reports/inactive-summary/${encodeURIComponent(params.value)}`}
            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-rose-50 dark:bg-rose-950/30 text-rose-700 dark:text-rose-400 hover:bg-rose-600 hover:text-white font-semibold text-2xs transition-colors"
          >
            <span>Events ({params.data?.eventCount || 0})</span>
            <ArrowUpRight className="h-3.5 w-3.5" />
          </Link>
        )
      }
    ],
    []
  );

  return (
    <div className="space-y-6">
      <ReportBreadcrumbs items={[{ label: "Telemetry & Sensors" }, { label: "Inactive Summary" }]} />

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="space-y-1">
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            Inactive Summary
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Review inactive vehicles, last communication times, and complete inactivity status by branch.
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
        reportTitle="Inactive Summary Report"
        dataToExport={rows}
      />

      {/* Responsive Data Table using AppDataTable */}
      <div className="-mx-4 sm:mx-0 overflow-x-auto">
        <AppDataTable<InactiveOverviewRow>
          rowData={rows}
          columnDefs={columns}
          isLoading={isLoading}
          total={rows.length}
        />
      </div>
    </div>
  );
};

export default InactiveSummaryOverviewPage;
