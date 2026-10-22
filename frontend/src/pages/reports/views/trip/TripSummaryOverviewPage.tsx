import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Navigation, ArrowUpRight, AlertTriangle } from "lucide-react";
import { ReportBreadcrumbs } from "@/pages/reports/components/ReportBreadcrumbs";
import { ReportKpiCards } from "@/pages/reports/components/ReportKpiCards";
import { ReportFilterBar } from "@/pages/reports/components/ReportFilterBar";
import { ReportExportToolbar } from "@/pages/reports/components/ReportExportToolbar";
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

      <div className="panel-card !p-0 overflow-hidden border border-slate-200/80 dark:border-[#1D293D]">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50/75 dark:bg-[#121B2E] text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider text-[10px]">
                <th className="py-3.5 px-4">Vehicle Details</th>
                <th className="py-3.5 px-4 text-center">Total Trips</th>
                <th className="py-3.5 px-4 text-right">Distance</th>
                <th className="py-3.5 px-4 text-center">Drive Time</th>
                <th className="py-3.5 px-4 text-center">Idle Time</th>
                <th className="py-3.5 px-4 text-center">Avg / Max Speed</th>
                <th className="py-3.5 px-4 text-center">Trip Alerts</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 font-medium">
              {rows.map((row) => (
                <tr
                  key={row.id}
                  className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors"
                >
                  <td className="py-3.5 px-4">
                    <div className="font-bold text-slate-900 dark:text-white font-mono text-xs">
                      {row.vehicleNo}
                    </div>
                    <div className="text-[11px] text-slate-500 dark:text-slate-400">
                      {row.vehicleType}
                    </div>
                  </td>

                  <td className="py-3.5 px-4 text-center">
                    <span className="px-2.5 py-0.5 rounded-full font-mono text-xs font-bold bg-blue-50 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800/60">
                      {row.totalTrips} Trips
                    </span>
                  </td>

                  <td className="py-3.5 px-4 text-right">
                    <span className="font-bold text-slate-900 dark:text-white font-mono text-sm">
                      {row.totalDistanceKm}
                    </span>
                    <span className="text-[10px] text-slate-400 ml-1">km</span>
                  </td>

                  <td className="py-3.5 px-4 text-center font-mono font-semibold text-emerald-600 dark:text-emerald-400">
                    {row.driveTime}
                  </td>

                  <td className="py-3.5 px-4 text-center font-mono font-medium text-amber-600 dark:text-amber-400">
                    {row.idleTime}
                  </td>

                  <td className="py-3.5 px-4 text-center font-mono">
                    <span className="font-semibold text-slate-800 dark:text-slate-200">
                      {row.avgSpeedKmH} km/h
                    </span>{" "}
                    <span className="text-[10px] text-slate-400">/ {row.maxSpeedKmH}</span>
                  </td>

                  <td className="py-3.5 px-4 text-center">
                    {row.alertsCount > 0 ? (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-400 border border-rose-200 dark:border-rose-800/60">
                        <AlertTriangle className="h-3 w-3" />
                        {row.alertsCount} Alerts
                      </span>
                    ) : (
                      <span className="text-slate-400 text-xs">—</span>
                    )}
                  </td>

                  <td className="py-3.5 px-4 text-right">
                    <Link
                      to={`/reports/trip-summary/${encodeURIComponent(row.vehicleNo)}`}
                      className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 hover:bg-blue-600 hover:text-white font-semibold text-xs transition-colors"
                    >
                      <span>Trip Details</span>
                      <ArrowUpRight className="h-3.5 w-3.5" />
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default TripSummaryOverviewPage;
