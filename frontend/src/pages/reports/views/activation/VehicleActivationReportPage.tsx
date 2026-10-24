import React, { useState, useEffect, useMemo } from "react";
import type { ColDef } from "ag-grid-community";
import { ShieldCheck, CheckCircle2, Clock, AlertTriangle } from "lucide-react";
import { ReportBreadcrumbs } from "@/pages/reports/components/ReportBreadcrumbs";
import { ReportKpiCards } from "@/pages/reports/components/ReportKpiCards";
import { ReportFilterBar } from "@/pages/reports/components/ReportFilterBar";
import { ReportExportToolbar } from "@/pages/reports/components/ReportExportToolbar";
import { AppDataTable } from "@/components/common/AppDataTable";
import { reportsApi } from "@/api/reports.api";
import { VehicleActivationRow, ReportKpiMetric, ReportFilterState } from "@/types/reports.types";

export const VehicleActivationReportPage: React.FC = () => {
  const [kpis, setKpis] = useState<ReportKpiMetric[]>([]);
  const [rows, setRows] = useState<VehicleActivationRow[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filters, setFilters] = useState<ReportFilterState>({
    search: "",
    dateRange: "Today"
  });

  const loadData = async () => {
    setIsLoading(true);
    try {
      const data = await reportsApi.getVehicleActivationReport(filters);
      setKpis(data.kpis);
      setRows(data.rows);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [filters.search, filters.dateRange, filters.vehicle]);

  const columns = useMemo<ColDef<VehicleActivationRow>[]>(
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
            <div className="text-[11px] text-slate-400">{params.data?.vehicleType}</div>
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
        headerName: "IMEI & SIM Hardware",
        field: "imei",
        minWidth: 160,
        cellRenderer: (params: any) => (
          <div className="font-mono text-[11px]">
            <div className="text-slate-800 dark:text-slate-200">IMEI: {params.value}</div>
            <div className="text-slate-400">SIM: {params.data?.simNo}</div>
          </div>
        )
      },
      {
        headerName: "Vehicle Creation",
        field: "vehicleCreationDate",
        minWidth: 130,
        cellRenderer: (params: any) => (
          <span className="text-slate-600 dark:text-slate-300 text-xs">
            {params.value}
          </span>
        )
      },
      {
        headerName: "GPS Provisioned",
        field: "gpsCreationDate",
        minWidth: 130,
        cellRenderer: (params: any) => (
          <span className="text-slate-600 dark:text-slate-300 text-xs">
            {params.value}
          </span>
        )
      },
      {
        headerName: "Activation Date",
        field: "vehicleActivationDate",
        minWidth: 130,
        cellRenderer: (params: any) => (
          <span className="font-semibold text-slate-900 dark:text-white text-xs">
            {params.value}
          </span>
        )
      },
      {
        headerName: "Activated By",
        field: "activatedBy",
        minWidth: 130,
        cellRenderer: (params: any) => (
          <span className="text-slate-700 dark:text-slate-300 text-xs">
            {params.value}
          </span>
        )
      },
      {
        headerName: "Status",
        field: "status",
        minWidth: 130,
        cellRenderer: (params: any) => (
          <span
            className={`inline-flex items-center gap-1 text-[10px] uppercase font-bold tracking-wider px-2.5 py-0.5 rounded-full border ${
              params.value === "ACTIVATED"
                ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800/60"
                : params.value === "PENDING"
                ? "bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400 border-amber-200 dark:border-amber-800/60"
                : "bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-400 border-rose-200 dark:border-rose-800/60"
            }`}
          >
            {params.value === "ACTIVATED" && <CheckCircle2 className="h-3 w-3" />}
            {params.value === "PENDING" && <Clock className="h-3 w-3" />}
            {params.value === "ATTENTION" && <AlertTriangle className="h-3 w-3" />}
            {params.value}
          </span>
        )
      }
    ],
    []
  );

  return (
    <div className="space-y-6">
      <ReportBreadcrumbs items={[{ label: "Operations & Tracking" }, { label: "Vehicle Activation Report" }]} />

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="space-y-1">
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            Vehicle Activation Report
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Track vehicle setup, GPS hardware provisioning, SIM assignment, and activation ownership.
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
        reportTitle="Vehicle_Activation_Register"
        dataToExport={rows}
      />

      {/* Responsive Data Table using AppDataTable */}
      <div className="-mx-4 sm:mx-0 overflow-x-auto">
        <AppDataTable<VehicleActivationRow>
          rowData={rows}
          columnDefs={columns}
          isLoading={isLoading}
          total={rows.length}
        />
      </div>
    </div>
  );
};

export default VehicleActivationReportPage;
