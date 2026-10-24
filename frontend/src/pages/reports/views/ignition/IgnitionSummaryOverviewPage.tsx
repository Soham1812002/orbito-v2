import React, { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import type { ColDef } from "ag-grid-community";
import { Flame, ArrowUpRight } from "lucide-react";
import { ReportBreadcrumbs } from "@/pages/reports/components/ReportBreadcrumbs";
import { ReportKpiCards } from "@/pages/reports/components/ReportKpiCards";
import { ReportFilterBar } from "@/pages/reports/components/ReportFilterBar";
import { ReportExportToolbar } from "@/pages/reports/components/ReportExportToolbar";
import { AppDataTable } from "@/components/common/AppDataTable";
import { reportsApi } from "@/api/reports.api";
import { IgnitionSummaryOverviewRow, ReportKpiMetric, ReportFilterState } from "@/types/reports.types";

export const IgnitionSummaryOverviewPage: React.FC = () => {
  const [kpis, setKpis] = useState<ReportKpiMetric[]>([]);
  const [rows, setRows] = useState<IgnitionSummaryOverviewRow[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filters, setFilters] = useState<ReportFilterState>({
    search: "",
    dateRange: "Today"
  });

  const loadData = async () => {
    setIsLoading(true);
    try {
      const data = await reportsApi.getIgnitionOverview(filters);
      setKpis(data.kpis);
      setRows(data.rows);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [filters.search, filters.dateRange, filters.vehicle]);

  const columns = useMemo<ColDef<IgnitionSummaryOverviewRow>[]>(
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
            <div className="text-[10px] text-slate-400 font-mono">IMEI: {params.data?.imei}</div>
          </div>
        )
      },
      {
        headerName: "Company & Branch",
        field: "company",
        minWidth: 160,
        cellRenderer: (params: any) => (
          <div>
            <div className="font-medium text-slate-800 dark:text-slate-200">{params.value}</div>
            <div className="text-[11px] text-slate-500">{params.data?.branch}</div>
          </div>
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
        headerName: "Ignition ON / OFF",
        field: "ignitionOnDuration",
        minWidth: 160,
        cellRenderer: (params: any) => (
          <div className="font-mono text-2xs">
            <span className="text-emerald-600 dark:text-emerald-400 font-semibold">{params.value}</span>
            <span className="text-slate-400 mx-1">/</span>
            <span className="text-slate-500">{params.data?.ignitionOffDuration}</span>
          </div>
        )
      },
      {
        headerName: "Run / Idle Time",
        field: "runningTime",
        minWidth: 150,
        cellRenderer: (params: any) => (
          <div className="font-mono text-2xs">
            <span className="text-blue-600 dark:text-blue-400 font-semibold">{params.value}</span>
            <span className="text-slate-400 mx-1">·</span>
            <span className="text-amber-500">{params.data?.idleTime}</span>
          </div>
        )
      },
      {
        headerName: "Distance",
        field: "distanceKm",
        minWidth: 110,
        cellRenderer: (params: any) => (
          <span className="font-mono font-bold text-2xs text-slate-900 dark:text-white">
            {params.value} <span className="text-[10px] text-slate-400 font-normal">km</span>
          </span>
        )
      },
      {
        headerName: "Cycles",
        field: "ignitionCycles",
        minWidth: 90,
        cellRenderer: (params: any) => (
          <span className="font-mono font-bold text-2xs text-slate-700 dark:text-slate-300">
            {params.value}
          </span>
        )
      },
      {
        headerName: "Current State",
        field: "currentStatus",
        minWidth: 130,
        cellRenderer: (params: any) => (
          <span
            className={`inline-block text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full border ${
              params.value === "Engine running"
                ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800/60"
                : "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300 border-slate-200 dark:border-slate-700"
            }`}
          >
            {params.value}
          </span>
        )
      },
      {
        headerName: "Actions",
        field: "vehicleNo",
        minWidth: 110,
        sortable: false,
        filter: false,
        cellRenderer: (params: any) => (
          <Link
            to={`/reports/ignition-summary/${encodeURIComponent(params.value)}`}
            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 hover:bg-blue-600 hover:text-white font-semibold text-2xs transition-colors"
          >
            <span>Events</span>
            <ArrowUpRight className="h-3.5 w-3.5" />
          </Link>
        )
      }
    ],
    []
  );

  return (
    <div className="space-y-6">
      <ReportBreadcrumbs items={[{ label: "Telemetry & Sensors" }, { label: "Ignition Summary" }]} />

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="space-y-1">
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            Ignition Summary
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Ignition events, distance, operating time, driver allocation, and latest vehicle state.
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
        reportTitle="Ignition Summary Report"
        reportType="ignition-summary"
        filters={filters}
        dataToExport={rows}
      />

      {/* Responsive Data Table using AppDataTable */}
      <div className="-mx-4 sm:mx-0 overflow-x-auto">
        <AppDataTable<IgnitionSummaryOverviewRow>
          rowData={rows}
          columnDefs={columns}
          isLoading={isLoading}
          total={rows.length}
        />
      </div>
    </div>
  );
};

export default IgnitionSummaryOverviewPage;
