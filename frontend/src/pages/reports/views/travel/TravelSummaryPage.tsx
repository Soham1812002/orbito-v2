import React, { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import type { ColDef } from "ag-grid-community";
import { Compass, Navigation, ArrowUpRight } from "lucide-react";
import { ReportBreadcrumbs } from "@/pages/reports/components/ReportBreadcrumbs";
import { ReportKpiCards } from "@/pages/reports/components/ReportKpiCards";
import { ReportFilterBar } from "@/pages/reports/components/ReportFilterBar";
import { ReportExportToolbar } from "@/pages/reports/components/ReportExportToolbar";
import { AppDataTable } from "@/components/common/AppDataTable";
import { reportsApi } from "@/api/reports.api";
import { TravelSummaryRow, ReportKpiMetric, ReportFilterState } from "@/types/reports.types";

export const TravelSummaryPage: React.FC = () => {
  const [kpis, setKpis] = useState<ReportKpiMetric[]>([]);
  const [rows, setRows] = useState<TravelSummaryRow[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filters, setFilters] = useState<ReportFilterState>({
    search: "",
    dateRange: "Today"
  });

  const loadData = async () => {
    setIsLoading(true);
    try {
      const data = await reportsApi.getTravelSummary(filters);
      setKpis(data.kpis);
      setRows(data.rows);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [filters.search, filters.dateRange, filters.vehicle]);

  const columns = useMemo<ColDef<TravelSummaryRow>[]>(
    () => [
      {
        headerName: "Vehicle Details",
        field: "vehicleNo",
        minWidth: 160,
        cellRenderer: (params: any) => {
          const row: TravelSummaryRow = params.data;
          if (!row) return null;
          return (
            <div>
              <div className="font-bold text-slate-900 dark:text-white font-mono text-xs">
                {row.vehicleNo}
              </div>
              <div className="text-2xs text-slate-500 dark:text-slate-400">
                {row.group}
              </div>
            </div>
          );
        }
      },
      {
        headerName: "Driver",
        field: "driverName",
        minWidth: 150,
        cellRenderer: (params: any) => {
          const row: TravelSummaryRow = params.data;
          if (!row) return null;
          return (
            <div>
              <div className="font-semibold text-xs text-slate-800 dark:text-slate-200">
                {row.driverName}
              </div>
              <div className="text-2xs text-slate-400 font-mono">{row.driverPhone}</div>
            </div>
          );
        }
      },
      {
        headerName: "Route (Start → End)",
        field: "startLocation",
        minWidth: 240,
        flex: 1.3,
        cellRenderer: (params: any) => {
          const row: TravelSummaryRow = params.data;
          if (!row) return null;
          return (
            <div className="max-w-xs">
              <div className="flex items-center gap-1.5 truncate text-xs text-slate-700 dark:text-slate-300">
                <span className="truncate">{row.startLocation}</span>
                <span className="text-slate-400">→</span>
                <span className="truncate">{row.endLocation}</span>
              </div>
              <div className="text-2xs font-mono text-slate-400">
                Odo: {row.startOdometer.toLocaleString()} → {row.endOdometer.toLocaleString()} km
              </div>
            </div>
          );
        }
      },
      {
        headerName: "Distance",
        field: "totalDistanceKm",
        minWidth: 110,
        cellRenderer: (params: any) => (
          <div>
            <span className="font-bold text-slate-900 dark:text-white font-mono text-xs">
              {params.value}
            </span>
            <span className="text-2xs text-slate-400 ml-1">km</span>
          </div>
        )
      },
      {
        headerName: "Operating Time",
        field: "operatingDuration",
        minWidth: 120,
        cellRenderer: (params: any) => (
          <span className="px-2 py-0.5 rounded-full font-mono text-2xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200">
            {params.value}
          </span>
        )
      },
      {
        headerName: "Status Duration Breakdown",
        field: "driveDuration",
        minWidth: 200,
        cellRenderer: (params: any) => {
          const row: TravelSummaryRow = params.data;
          if (!row) return null;
          return (
            <div className="flex items-center gap-1.5 text-2xs font-mono">
              <span className="text-emerald-600 dark:text-emerald-400 font-semibold">
                Drive {row.driveDuration}
              </span>
              <span className="text-slate-300 dark:text-slate-700">•</span>
              <span className="text-amber-600 dark:text-amber-400">
                Stop {row.stoppageDuration}
              </span>
              <span className="text-slate-300 dark:text-slate-700">•</span>
              <span className="text-rose-500">Idle {row.idleDuration}</span>
            </div>
          );
        }
      },
      {
        headerName: "Speed Profile",
        field: "avgSpeedKmH",
        minWidth: 140,
        cellRenderer: (params: any) => {
          const row: TravelSummaryRow = params.data;
          if (!row) return null;
          return (
            <div>
              <div className="font-mono text-xs font-semibold text-slate-800 dark:text-slate-200">
                {row.avgSpeedKmH} km/h{" "}
                <span className="text-slate-400 text-2xs">(Max {row.maxSpeedKmH})</span>
              </div>
              <span
                className={`inline-block mt-0.5 text-[9px] uppercase tracking-wider font-bold px-1.5 py-0.2 rounded ${
                  row.speedStatus === "Verified"
                    ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400"
                    : "bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-400"
                }`}
              >
                {row.speedStatus}
              </span>
            </div>
          );
        }
      },
      {
        headerName: "Actions",
        field: "vehicleNo",
        minWidth: 90,
        sortable: false,
        filter: false,
        cellRenderer: (params: any) => (
          <Link
            to={`/reports/trip-summary/${encodeURIComponent(params.value)}`}
            className="inline-flex items-center gap-1 text-xs font-semibold text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors"
          >
            <span>Trips</span>
            <ArrowUpRight className="h-3.5 w-3.5" />
          </Link>
        )
      }
    ],
    []
  );

  return (
    <div className="space-y-6">
      {/* Breadcrumbs */}
      <ReportBreadcrumbs items={[{ label: "Fleet Activity" }, { label: "Travel Summary" }]} />

      {/* Page Title & Status Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="space-y-1">
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            Travel Summary
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Review distance, driving duration, route milestones and speed performance across your fleet.
          </p>
        </div>
      </div>

      {/* KPI Metric Tiles */}
      <ReportKpiCards metrics={kpis} />

      {/* Filter Toolbar */}
      <ReportFilterBar
        filters={filters}
        onFilterChange={setFilters}
        onRefresh={loadData}
        isLoading={isLoading}
      />

      {/* Export Toolbar */}
      <ReportExportToolbar
        totalCount={rows.length}
        reportTitle="Travel Summary Report"
        reportType="travel-summary"
        filters={filters}
        dataToExport={rows}
      />

      {/* Responsive Data Table using AppDataTable */}
      <div className="-mx-4 sm:mx-0 overflow-x-auto">
        <AppDataTable<TravelSummaryRow>
          rowData={rows}
          columnDefs={columns}
          isLoading={isLoading}
          total={rows.length}
        />
      </div>
    </div>
  );
};

export default TravelSummaryPage;
