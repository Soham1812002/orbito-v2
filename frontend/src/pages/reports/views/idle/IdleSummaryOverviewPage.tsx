import React, { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import type { ColDef } from "ag-grid-community";
import { Clock, ArrowUpRight } from "lucide-react";
import { ReportBreadcrumbs } from "@/pages/reports/components/ReportBreadcrumbs";
import { ReportKpiCards } from "@/pages/reports/components/ReportKpiCards";
import { ReportFilterBar } from "@/pages/reports/components/ReportFilterBar";
import { ReportExportToolbar } from "@/pages/reports/components/ReportExportToolbar";
import { AppDataTable } from "@/components/common/AppDataTable";
import { reportsApi } from "@/api/reports.api";
import { IdleOverviewRow, ReportKpiMetric, ReportFilterState } from "@/types/reports.types";

export const IdleSummaryOverviewPage: React.FC = () => {
  const [kpis, setKpis] = useState<ReportKpiMetric[]>([]);
  const [rows, setRows] = useState<IdleOverviewRow[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filters, setFilters] = useState<ReportFilterState>({
    search: "",
    dateRange: "Today"
  });

  const loadData = async () => {
    setIsLoading(true);
    try {
      const data = await reportsApi.getIdleOverview(filters);
      setKpis(data.kpis);
      setRows(data.rows);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [filters.search, filters.dateRange, filters.vehicle]);

  const columns = useMemo<ColDef<IdleOverviewRow>[]>(
    () => [
      {
        headerName: "Vehicle Details",
        field: "vehicleNo",
        minWidth: 160,
        cellRenderer: (params: any) => (
          <span className="font-bold text-slate-900 dark:text-white font-mono text-xs">
            {params.value}
          </span>
        )
      },
      {
        headerName: "Branch",
        field: "branch",
        minWidth: 130,
        cellRenderer: (params: any) => (
          <span className="text-slate-700 dark:text-slate-300">
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
        headerName: "Total Idle Events",
        field: "totalIdleEvents",
        minWidth: 130,
        cellRenderer: (params: any) => (
          <span className="px-2.5 py-0.5 rounded-full font-mono text-2xs font-bold bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800/60">
            {params.value} Events
          </span>
        )
      },
      {
        headerName: "Idle Duration",
        field: "totalIdleTime",
        minWidth: 120,
        cellRenderer: (params: any) => (
          <span className="font-mono font-bold text-2xs text-amber-600 dark:text-amber-400">
            {params.value}
          </span>
        )
      },
      {
        headerName: "Longest Idle",
        field: "longestIdle",
        minWidth: 120,
        cellRenderer: (params: any) => (
          <span className="font-mono text-2xs text-slate-600 dark:text-slate-300">
            {params.value}
          </span>
        )
      },
      {
        headerName: "Est. Fuel Wasted",
        field: "fuelWastedLitres",
        minWidth: 130,
        cellRenderer: (params: any) => (
          <span className="font-mono font-semibold text-2xs text-rose-600 dark:text-rose-400">
            {params.value} L
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
            to={`/reports/idle-summary/${encodeURIComponent(params.value)}`}
            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-amber-50 dark:bg-amber-950/30 text-amber-700 dark:text-amber-400 hover:bg-amber-600 hover:text-white font-semibold text-2xs transition-colors"
          >
            <span>Idle Events</span>
            <ArrowUpRight className="h-3.5 w-3.5" />
          </Link>
        )
      }
    ],
    []
  );

  return (
    <div className="space-y-6">
      <ReportBreadcrumbs items={[{ label: "Fleet Activity" }, { label: "Idle Summary" }]} />

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="space-y-1">
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            Idle Summary
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Review vehicle idle events, duration trends, and fuel wastage by branch.
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
        reportTitle="Idle Summary Report"
        dataToExport={rows}
      />

      {/* Responsive Data Table using AppDataTable */}
      <div className="-mx-4 sm:mx-0 overflow-x-auto">
        <AppDataTable<IdleOverviewRow>
          rowData={rows}
          columnDefs={columns}
          isLoading={isLoading}
          total={rows.length}
        />
      </div>
    </div>
  );
};

export default IdleSummaryOverviewPage;
