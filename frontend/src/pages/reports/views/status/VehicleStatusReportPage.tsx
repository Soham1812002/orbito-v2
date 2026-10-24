import React, { useState, useEffect, useMemo } from "react";
import type { ColDef } from "ag-grid-community";
import { Car, Zap, Wifi } from "lucide-react";
import { ReportBreadcrumbs } from "@/pages/reports/components/ReportBreadcrumbs";
import { ReportKpiCards } from "@/pages/reports/components/ReportKpiCards";
import { ReportFilterBar } from "@/pages/reports/components/ReportFilterBar";
import { ReportExportToolbar } from "@/pages/reports/components/ReportExportToolbar";
import { AppDataTable } from "@/components/common/AppDataTable";
import { reportsApi } from "@/api/reports.api";
import { VehicleStatusRow, ReportKpiMetric, ReportFilterState } from "@/types/reports.types";

export const VehicleStatusReportPage: React.FC = () => {
  const [kpis, setKpis] = useState<ReportKpiMetric[]>([]);
  const [rows, setRows] = useState<VehicleStatusRow[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filters, setFilters] = useState<ReportFilterState>({
    search: "",
    dateRange: "Today"
  });

  const loadData = async () => {
    setIsLoading(true);
    try {
      const data = await reportsApi.getVehicleStatusReport(filters);
      setKpis(data.kpis);
      setRows(data.rows);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [filters.search, filters.dateRange, filters.vehicle]);

  const columns = useMemo<ColDef<VehicleStatusRow>[]>(
    () => [
      {
        headerName: "Organization & Vehicle",
        field: "vehicleNo",
        minWidth: 170,
        cellRenderer: (params: any) => (
          <div>
            <div className="font-bold text-slate-900 dark:text-white font-mono text-xs">
              {params.value}
            </div>
            <div className="text-[11px] text-slate-500 truncate max-w-xs">{params.data?.organization}</div>
          </div>
        )
      },
      {
        headerName: "Body & Model",
        field: "vehicleType",
        minWidth: 140,
        cellRenderer: (params: any) => (
          <div>
            <div className="font-semibold text-slate-800 dark:text-slate-200">{params.value}</div>
            <div className="text-[11px] text-slate-400">{params.data?.model}</div>
          </div>
        )
      },
      {
        headerName: "Power & Ignition",
        field: "powerIgnition",
        minWidth: 130,
        cellRenderer: (params: any) => (
          <span
            className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold font-mono ${
              params.value === "ON"
                ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300"
                : "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400"
            }`}
          >
            <Zap className="h-3 w-3" />
            {params.value}
          </span>
        )
      },
      {
        headerName: "Telemetry Status",
        field: "status",
        minWidth: 130,
        cellRenderer: (params: any) => {
          const statusBadges: Record<string, string> = {
            Running: "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800/60",
            Stopped: "bg-blue-50 text-blue-700 dark:bg-blue-950/40 dark:text-blue-400 border-blue-200 dark:border-blue-800/60",
            Idle: "bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400 border-amber-200 dark:border-amber-800/60",
            Offline: "bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-400 border-rose-200 dark:border-rose-800/60"
          };
          return (
            <span
              className={`inline-block text-[10px] uppercase font-bold tracking-wider px-2.5 py-0.5 rounded-full border ${
                statusBadges[params.value] || "bg-slate-100 text-slate-700"
              }`}
            >
              {params.value}
            </span>
          );
        }
      },
      {
        headerName: "Speed",
        field: "speedKmH",
        minWidth: 100,
        cellRenderer: (params: any) => (
          <span className="font-mono font-bold text-2xs text-slate-900 dark:text-white">
            {params.value} <span className="text-[10px] text-slate-400 font-normal">km/h</span>
          </span>
        )
      },
      {
        headerName: "Battery",
        field: "batteryVoltage",
        minWidth: 100,
        cellRenderer: (params: any) => (
          <span className="font-mono font-semibold text-2xs text-slate-700 dark:text-slate-300">
            {params.value}
          </span>
        )
      },
      {
        headerName: "Connectivity & SIM",
        field: "connectivity",
        minWidth: 150,
        cellRenderer: (params: any) => (
          <div>
            <div className="text-slate-800 dark:text-slate-200 font-mono text-[11px]">{params.value}</div>
            <div className="text-[10px] text-slate-400 font-mono">SIM: {params.data?.simNumber}</div>
          </div>
        )
      },
      {
        headerName: "Last Communication",
        field: "lastCommunication",
        minWidth: 180,
        cellRenderer: (params: any) => (
          <div>
            <div className="text-slate-800 dark:text-slate-200 text-xs font-medium">
              {params.value}
            </div>
            <div className="text-[11px] text-slate-400 truncate max-w-xs">{params.data?.location}</div>
          </div>
        )
      }
    ],
    []
  );

  return (
    <div className="space-y-6">
      <ReportBreadcrumbs items={[{ label: "Operations & Tracking" }, { label: "Vehicle Status Report" }]} />

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="space-y-1">
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            Vehicle Status Report
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Live vehicle, device, ignition, GPS, battery, and last communication status by organization.
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
        reportTitle="Vehicle_Status_Register"
        reportType="vehicle-status"
        filters={filters}
        dataToExport={rows}
      />

      {/* Responsive Data Table using AppDataTable */}
      <div className="-mx-4 sm:mx-0 overflow-x-auto">
        <AppDataTable<VehicleStatusRow>
          rowData={rows}
          columnDefs={columns}
          isLoading={isLoading}
          total={rows.length}
        />
      </div>
    </div>
  );
};

export default VehicleStatusReportPage;
