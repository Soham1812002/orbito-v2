import React, { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import type { ColDef } from "ag-grid-community";
import { Snowflake, ArrowUpRight } from "lucide-react";
import { ReportBreadcrumbs } from "@/pages/reports/components/ReportBreadcrumbs";
import { ReportKpiCards } from "@/pages/reports/components/ReportKpiCards";
import { ReportFilterBar } from "@/pages/reports/components/ReportFilterBar";
import { ReportExportToolbar } from "@/pages/reports/components/ReportExportToolbar";
import { AppDataTable } from "@/components/common/AppDataTable";
import { reportsApi } from "@/api/reports.api";
import { AcSummaryOverviewRow, ReportKpiMetric, ReportFilterState } from "@/types/reports.types";

export const AcSummaryOverviewPage: React.FC = () => {
  const [kpis, setKpis] = useState<ReportKpiMetric[]>([]);
  const [rows, setRows] = useState<AcSummaryOverviewRow[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filters, setFilters] = useState<ReportFilterState>({
    search: "",
    dateRange: "Today"
  });

  const loadData = async () => {
    setIsLoading(true);
    try {
      const data = await reportsApi.getAcSummaryOverview(filters);
      setKpis(data.kpis);
      setRows(data.rows);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [filters.search, filters.dateRange, filters.vehicle]);

  const columns = useMemo<ColDef<AcSummaryOverviewRow>[]>(
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
            <div className="text-[11px] text-slate-500 dark:text-slate-400">
              {params.data?.vehicleName} · {params.data?.model}
            </div>
          </div>
        )
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
        headerName: "Driver",
        field: "driverName",
        minWidth: 140,
        cellRenderer: (params: any) => (
          <span className="font-semibold text-slate-800 dark:text-slate-200">
            {params.value}
          </span>
        )
      },
      {
        headerName: "AC Distance",
        field: "acOnDistanceKm",
        minWidth: 130,
        cellRenderer: (params: any) => (
          <span className="font-mono font-bold text-2xs text-slate-900 dark:text-white">
            {params.value?.toLocaleString()}{" "}
            <span className="text-[10px] text-slate-400 font-normal">km</span>
          </span>
        )
      },
      {
        headerName: "AC ON Duration",
        field: "acOnDuration",
        minWidth: 130,
        cellRenderer: (params: any) => (
          <span className="font-mono font-bold text-2xs text-cyan-600 dark:text-cyan-400">
            {params.value}
          </span>
        )
      },
      {
        headerName: "AC OFF Duration",
        field: "acOffDuration",
        minWidth: 130,
        cellRenderer: (params: any) => (
          <span className="font-mono text-2xs text-slate-500">
            {params.value}
          </span>
        )
      },
      {
        headerName: "AC Cycles",
        field: "acCycles",
        minWidth: 100,
        cellRenderer: (params: any) => (
          <span className="font-mono font-bold text-2xs text-slate-700 dark:text-slate-300">
            {params.value}
          </span>
        )
      },
      {
        headerName: "Current State",
        field: "currentStatus",
        minWidth: 120,
        cellRenderer: (params: any) => (
          <span
            className={`inline-block text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full border ${
              params.value === "AC ON"
                ? "bg-cyan-50 text-cyan-700 dark:bg-cyan-950/40 dark:text-cyan-300 border-cyan-200 dark:border-cyan-800/60 font-mono"
                : "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300 border-slate-200 dark:border-slate-700 font-mono"
            }`}
          >
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
            to={`/reports/ac-summary/${encodeURIComponent(params.value)}`}
            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-cyan-50 dark:bg-cyan-950/30 text-cyan-700 dark:text-cyan-400 hover:bg-cyan-600 hover:text-white font-semibold text-2xs transition-colors"
          >
            <span>AC Events</span>
            <ArrowUpRight className="h-3.5 w-3.5" />
          </Link>
        )
      }
    ],
    []
  );

  return (
    <div className="space-y-6">
      <ReportBreadcrumbs items={[{ label: "Telemetry & Sensors" }, { label: "AC Summary" }]} />

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="space-y-1">
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            AC Summary
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Review air-conditioning usage, distance, operating durations, and vehicle cooling cycles.
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
        reportTitle="AC_Summary_Report"
        dataToExport={rows}
      />

      {/* Responsive Data Table using AppDataTable */}
      <div className="-mx-4 sm:mx-0 overflow-x-auto">
        <AppDataTable<AcSummaryOverviewRow>
          rowData={rows}
          columnDefs={columns}
          isLoading={isLoading}
          total={rows.length}
        />
      </div>
    </div>
  );
};

export default AcSummaryOverviewPage;
