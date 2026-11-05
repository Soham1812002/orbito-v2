import React, { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import type { ColDef } from "ag-grid-community";
import { Cpu, ArrowUpRight } from "lucide-react";
import { ReportBreadcrumbs } from "@/pages/reports/components/ReportBreadcrumbs";
import { ReportKpiCards } from "@/pages/reports/components/ReportKpiCards";
import { ReportFilterBar } from "@/pages/reports/components/ReportFilterBar";
import { ReportExportToolbar } from "@/pages/reports/components/ReportExportToolbar";
import { AppDataTable } from "@/components/common/AppDataTable";
import { reportsApi } from "@/api/reports.api";
import { DigitalPortOverviewRow, ReportKpiMetric, ReportFilterState } from "@/types/reports.types";

export const DigitalPortSummaryOverviewPage: React.FC = () => {
  const [kpis, setKpis] = useState<ReportKpiMetric[]>([]);
  const [rows, setRows] = useState<DigitalPortOverviewRow[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filters, setFilters] = useState<ReportFilterState>({
    search: "",
    dateRange: "Today"
  });

  const loadData = async () => {
    setIsLoading(true);
    try {
      const data = await reportsApi.getDigitalPortOverview(filters);
      setKpis(data.kpis);
      setRows(data.rows);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [filters.search, filters.dateRange, filters.vehicle]);

  const columns = useMemo<ColDef<DigitalPortOverviewRow>[]>(
    () => [
      {
        headerName: "Vehicle Details",
        field: "vehicleNo",
        minWidth: 160,
        cellRenderer: (params: any) => (
          <div className="flex items-center h-full font-bold text-slate-900 dark:text-white font-mono text-xs">
            {params.value}
          </div>
        )
      },
      {
        headerName: "Organisation",
        field: "organisation",
        minWidth: 150,
        cellRenderer: (params: any) => (
          <div className="flex items-center h-full font-semibold text-slate-800 dark:text-slate-200">
            {params.value}
          </div>
        )
      },
      {
        headerName: "Driver Allocation",
        field: "driverName",
        minWidth: 150,
        cellRenderer: (params: any) => (
          <div className="flex items-center h-full text-slate-800 dark:text-slate-200 font-medium">
            {params.value}
          </div>
        )
      },
      {
        headerName: "Open Events",
        field: "openEvents",
        minWidth: 110,
        cellRenderer: (params: any) => (
          <div className="flex items-center h-full font-mono font-bold text-[11px] text-emerald-600 dark:text-emerald-400">
            {params.value}
          </div>
        )
      },
      {
        headerName: "Close Events",
        field: "closeEvents",
        minWidth: 110,
        cellRenderer: (params: any) => (
          <div className="flex items-center h-full font-mono font-bold text-[11px] text-slate-700 dark:text-slate-300">
            {params.value}
          </div>
        )
      },
      {
        headerName: "Port Duration",
        field: "portDuration",
        minWidth: 120,
        cellRenderer: (params: any) => (
          <div className="flex items-center h-full font-mono font-semibold text-[11px] text-blue-600 dark:text-blue-400">
            {params.value}
          </div>
        )
      },
      {
        headerName: "Monitored Ports",
        field: "activePortsCount",
        minWidth: 130,
        cellRenderer: (params: any) => (
          <div className="flex items-center h-full">
            <span className="px-2 py-0.5 rounded-full font-mono text-[11px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700">
              {params.value} Ports
            </span>
          </div>
        )
      },
      {
        headerName: "Actions",
        field: "vehicleNo",
        minWidth: 120,
        sortable: false,
        filter: false,
        cellRenderer: (params: any) => (
          <div className="flex items-center h-full">
            <Link
              to={`/reports/digital-port-summary/${encodeURIComponent(params.value)}`}
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 hover:bg-blue-600 hover:text-white font-semibold text-[11px] transition-colors"
            >
              <span>Port Events</span>
              <ArrowUpRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        )
      }
    ],
    []
  );

  return (
    <div className="space-y-6">
      <ReportBreadcrumbs items={[{ label: "Telemetry & Sensors" }, { label: "Digital Port Summary" }]} />

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="space-y-1">
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            Digital Port Summary
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Monitor digital input and output activity, sensor mappings, and port-level telemetry across the fleet.
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
        reportTitle="Digital_Port_Summary"
        dataToExport={rows}
      />

      {/* Responsive Data Table using AppDataTable */}
      <div className="w-full">
        <AppDataTable<DigitalPortOverviewRow>
          rowData={rows}
          columnDefs={columns}
          isLoading={isLoading}
          total={rows.length}
        />
      </div>
    </div>
  );
};

export default DigitalPortSummaryOverviewPage;
