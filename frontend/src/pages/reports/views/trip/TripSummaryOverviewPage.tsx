import React, { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import type { ColDef } from "ag-grid-community";
import { Navigation, ArrowUpRight, AlertTriangle } from "lucide-react";
import { ReportBreadcrumbs } from "@/pages/reports/components/ReportBreadcrumbs";
import { ReportKpiCards } from "@/pages/reports/components/ReportKpiCards";
import { ReportFilterBar } from "@/pages/reports/components/ReportFilterBar";
import { ReportExportToolbar } from "@/pages/reports/components/ReportExportToolbar";
import { AppDataTable } from "@/components/common/AppDataTable";
import { reportsApi } from "@/api/reports.api";
import { TripOverviewRow, ReportKpiMetric, ReportFilterState } from "@/types/reports.types";

export const TripSummaryOverviewPage: React.FC = () => {
  const [kpis, setKpis] = useState<ReportKpiMetric[]>([]);
  const [rows, setRows] = useState<TripOverviewRow[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filters, setFilters] = useState<ReportFilterState>({
    search: "",
    dateRange: "Today"
  });

  const loadData = async () => {
    setIsLoading(true);
    try {
      const data = await reportsApi.getTripOverview(filters);
      setKpis(data.kpis);
      setRows(data.rows);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [filters.search, filters.dateRange, filters.vehicle]);

  const columns = useMemo<ColDef<TripOverviewRow>[]>(
    () => [
      {
        headerName: "Vehicle Details",
        field: "vehicleNo",
        minWidth: 160,
        cellRenderer: (params: any) => {
          const row: TripOverviewRow = params.data;
          if (!row) return null;
          return (
            <div>
              <div className="font-bold text-slate-900 dark:text-white font-mono text-xs">
                {row.vehicleNo}
              </div>
              <div className="text-2xs text-slate-500 dark:text-slate-400">
                {row.vehicleType}
              </div>
            </div>
          );
        }
      },
      {
        headerName: "Total Trips",
        field: "totalTrips",
        minWidth: 120,
        cellRenderer: (params: any) => (
          <span className="px-2.5 py-0.5 rounded-full font-mono text-2xs font-bold bg-blue-50 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800/60">
            {params.value} Trips
          </span>
        )
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
        headerName: "Drive Time",
        field: "driveTime",
        minWidth: 110,
        cellRenderer: (params: any) => (
          <span className="font-mono font-semibold text-2xs text-emerald-600 dark:text-emerald-400">
            {params.value}
          </span>
        )
      },
      {
        headerName: "Idle Time",
        field: "idleTime",
        minWidth: 110,
        cellRenderer: (params: any) => (
          <span className="font-mono font-medium text-2xs text-amber-600 dark:text-amber-400">
            {params.value}
          </span>
        )
      },
      {
        headerName: "Avg / Max Speed",
        field: "avgSpeedKmH",
        minWidth: 140,
        cellRenderer: (params: any) => {
          const row: TripOverviewRow = params.data;
          if (!row) return null;
          return (
            <span className="font-mono text-2xs">
              <span className="font-semibold text-slate-800 dark:text-slate-200">
                {row.avgSpeedKmH} km/h
              </span>{" "}
              <span className="text-slate-400">/ {row.maxSpeedKmH}</span>
            </span>
          );
        }
      },
      {
        headerName: "Trip Alerts",
        field: "alertsCount",
        minWidth: 120,
        cellRenderer: (params: any) => {
          const count = params.value;
          if (count > 0) {
            return (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-2xs font-bold bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-400 border border-rose-200 dark:border-rose-800/60">
                <AlertTriangle className="h-3 w-3" />
                {count} Alerts
              </span>
            );
          }
          return <span className="text-slate-400 text-xs">—</span>;
        }
      },
      {
        headerName: "Actions",
        field: "vehicleNo",
        minWidth: 120,
        sortable: false,
        filter: false,
        cellRenderer: (params: any) => (
          <Link
            to={`/reports/trip-summary/${encodeURIComponent(params.value)}`}
            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 hover:bg-blue-600 hover:text-white font-semibold text-2xs transition-colors"
          >
            <span>Trip Details</span>
            <ArrowUpRight className="h-3.5 w-3.5" />
          </Link>
        )
      }
    ],
    []
  );

  return (
    <div className="space-y-6">
      <ReportBreadcrumbs items={[{ label: "Fleet Activity" }, { label: "Trip Summary" }]} />

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="space-y-1">
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            Trip Summary Overview
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            A concise view of completed trips, travel distance, drive time, and trip alerts by vehicle.
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
        reportTitle="Trip Summary Report"
        dataToExport={rows}
      />

      {/* Responsive Data Table using AppDataTable */}
      <div className="-mx-4 sm:mx-0 overflow-x-auto">
        <AppDataTable<TripOverviewRow>
          rowData={rows}
          columnDefs={columns}
          isLoading={isLoading}
          total={rows.length}
        />
      </div>
    </div>
  );
};

export default TripSummaryOverviewPage;
