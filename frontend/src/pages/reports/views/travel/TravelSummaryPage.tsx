import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Compass, Navigation, ArrowUpRight } from "lucide-react";
import { ReportBreadcrumbs } from "@/pages/reports/components/ReportBreadcrumbs";
import { ReportKpiCards } from "@/pages/reports/components/ReportKpiCards";
import { ReportFilterBar } from "@/pages/reports/components/ReportFilterBar";
import { ReportExportToolbar } from "@/pages/reports/components/ReportExportToolbar";
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
        dataToExport={rows}
      />

      {/* Responsive Data Table */}
      <div className="panel-card !p-0 overflow-hidden border border-slate-200/80 dark:border-[#1D293D]">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50/75 dark:bg-[#121B2E] text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider text-[10px]">
                <th className="py-3.5 px-4">Vehicle Details</th>
                <th className="py-3.5 px-4">Driver</th>
                <th className="py-3.5 px-4">Route (Start → End)</th>
                <th className="py-3.5 px-4 text-right">Distance</th>
                <th className="py-3.5 px-4 text-center">Operating Time</th>
                <th className="py-3.5 px-4">Status Duration Breakdown</th>
                <th className="py-3.5 px-4 text-center">Speed Profile</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 font-medium">
              {rows.map((row) => (
                <tr
                  key={row.id}
                  className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors"
                >
                  {/* Vehicle */}
                  <td className="py-3.5 px-4">
                    <div className="font-bold text-slate-900 dark:text-white font-mono text-xs">
                      {row.vehicleNo}
                    </div>
                    <div className="text-[11px] text-slate-500 dark:text-slate-400">
                      {row.group}
                    </div>
                  </td>

                  {/* Driver */}
                  <td className="py-3.5 px-4">
                    <div className="font-semibold text-slate-800 dark:text-slate-200">
                      {row.driverName}
                    </div>
                    <div className="text-[11px] text-slate-400 font-mono">{row.driverPhone}</div>
                  </td>

                  {/* Route */}
                  <td className="py-3.5 px-4 max-w-xs">
                    <div className="flex items-center gap-1.5 truncate text-slate-700 dark:text-slate-300">
                      <span className="truncate">{row.startLocation}</span>
                      <span className="text-slate-400">→</span>
                      <span className="truncate">{row.endLocation}</span>
                    </div>
                    <div className="text-[10px] font-mono text-slate-400">
                      Odo: {row.startOdometer.toLocaleString()} → {row.endOdometer.toLocaleString()} km
                    </div>
                  </td>

                  {/* Distance */}
                  <td className="py-3.5 px-4 text-right">
                    <span className="font-bold text-slate-900 dark:text-white font-mono text-sm">
                      {row.totalDistanceKm}
                    </span>
                    <span className="text-[10px] text-slate-400 ml-1">km</span>
                  </td>

                  {/* Operating Time */}
                  <td className="py-3.5 px-4 text-center">
                    <span className="px-2.5 py-0.5 rounded-full font-mono text-[11px] font-semibold bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200">
                      {row.operatingDuration}
                    </span>
                  </td>

                  {/* Duration Breakdown */}
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-2 text-[11px] font-mono">
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
                  </td>

                  {/* Speed */}
                  <td className="py-3.5 px-4 text-center">
                    <div className="font-mono text-xs font-semibold text-slate-800 dark:text-slate-200">
                      {row.avgSpeedKmH} km/h{" "}
                      <span className="text-slate-400 text-[10px]">(Max {row.maxSpeedKmH})</span>
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
                  </td>

                  {/* Actions */}
                  <td className="py-3.5 px-4 text-right">
                    <Link
                      to={`/reports/trip-summary/${encodeURIComponent(row.vehicleNo)}`}
                      className="inline-flex items-center gap-1 text-xs font-semibold text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors"
                    >
                      <span>Trips</span>
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

export default TravelSummaryPage;
