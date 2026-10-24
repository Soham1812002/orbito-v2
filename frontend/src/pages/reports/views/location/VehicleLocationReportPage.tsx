import React, { useState, useEffect, useMemo } from "react";
import type { ColDef } from "ag-grid-community";
import { MapPin, Navigation, Signal } from "lucide-react";
import { ReportBreadcrumbs } from "@/pages/reports/components/ReportBreadcrumbs";
import { ReportKpiCards } from "@/pages/reports/components/ReportKpiCards";
import { ReportFilterBar } from "@/pages/reports/components/ReportFilterBar";
import { ReportExportToolbar } from "@/pages/reports/components/ReportExportToolbar";
import { AppDataTable } from "@/components/common/AppDataTable";
import { reportsApi } from "@/api/reports.api";
import { VehicleLocationRow, ReportKpiMetric, ReportFilterState } from "@/types/reports.types";

export const VehicleLocationReportPage: React.FC = () => {
  const [kpis, setKpis] = useState<ReportKpiMetric[]>([]);
  const [rows, setRows] = useState<VehicleLocationRow[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filters, setFilters] = useState<ReportFilterState>({
    search: "",
    dateRange: "Today"
  });

  const loadData = async () => {
    setIsLoading(true);
    try {
      const data = await reportsApi.getVehicleLocationReport(filters);
      setKpis(data.kpis);
      setRows(data.rows);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [filters.search, filters.dateRange, filters.vehicle]);

  const columns = useMemo<ColDef<VehicleLocationRow>[]>(
    () => [
      {
        headerName: "Vehicle Details",
        field: "vehicleNo",
        minWidth: 160,
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
        minWidth: 150,
        cellRenderer: (params: any) => (
          <div>
            <div className="font-semibold text-slate-800 dark:text-slate-200">{params.value}</div>
            <div className="text-[11px] text-slate-400">{params.data?.branch}</div>
          </div>
        )
      },
      {
        headerName: "Assigned Driver",
        field: "driverName",
        minWidth: 140,
        cellRenderer: (params: any) => (
          <div>
            <div className="font-semibold text-slate-800 dark:text-slate-200">{params.value}</div>
            <div className="text-[11px] text-slate-400 font-mono">{params.data?.driverPhone}</div>
          </div>
        )
      },
      {
        headerName: "Current Geocoded Address",
        field: "currentAddress",
        minWidth: 260,
        cellRenderer: (params: any) => (
          <div className="flex items-center gap-1.5 text-slate-700 dark:text-slate-300">
            <MapPin className="h-3.5 w-3.5 text-blue-500 shrink-0" />
            <span className="truncate" title={params.value}>{params.value}</span>
          </div>
        )
      },
      {
        headerName: "Coordinates",
        field: "latitude",
        minWidth: 160,
        cellRenderer: (params: any) => (
          <span className="font-mono text-[11px] text-slate-500">
            {params.data?.latitude?.toFixed(4)}°, {params.data?.longitude?.toFixed(4)}°
          </span>
        )
      },
      {
        headerName: "Speed & Heading",
        field: "speedKmH",
        minWidth: 130,
        cellRenderer: (params: any) => (
          <div className="font-mono text-center">
            <div className="font-bold text-slate-900 dark:text-white text-2xs">
              {params.value} <span className="text-[10px] text-slate-400 font-normal">km/h</span>
            </div>
            <div className="text-[10px] text-slate-400">{params.data?.heading}</div>
          </div>
        )
      },
      {
        headerName: "GPS Signal",
        field: "gpsSignal",
        minWidth: 120,
        cellRenderer: (params: any) => (
          <span
            className={`inline-flex items-center gap-1 text-[10px] uppercase font-bold tracking-wider px-2.5 py-0.5 rounded-full border ${
              params.value === "ONLINE"
                ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800/60"
                : "bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-400 border-rose-200 dark:border-rose-800/60"
            }`}
          >
            <Signal className="h-3 w-3" />
            {params.value}
          </span>
        )
      },
      {
        headerName: "Last Updated",
        field: "lastUpdated",
        minWidth: 130,
        cellRenderer: (params: any) => (
          <span className="font-mono text-slate-500 text-[11px]">
            {params.value}
          </span>
        )
      }
    ],
    []
  );

  return (
    <div className="space-y-6">
      <ReportBreadcrumbs items={[{ label: "Operations & Tracking" }, { label: "Vehicle Location Report" }]} />

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="space-y-1">
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            Vehicle Location Report
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Monitor the latest vehicle locations, driver details, telemetry status, and coordinates across your fleet.
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
        reportTitle="Vehicle_Location_Register"
        dataToExport={rows}
      />

      {/* Responsive Data Table using AppDataTable */}
      <div className="-mx-4 sm:mx-0 overflow-x-auto">
        <AppDataTable<VehicleLocationRow>
          rowData={rows}
          columnDefs={columns}
          isLoading={isLoading}
          total={rows.length}
        />
      </div>
    </div>
  );
};

export default VehicleLocationReportPage;
