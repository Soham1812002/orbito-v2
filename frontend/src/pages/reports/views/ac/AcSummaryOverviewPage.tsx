import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Snowflake, ArrowUpRight } from "lucide-react";
import { ReportBreadcrumbs } from "@/pages/reports/components/ReportBreadcrumbs";
import { ReportKpiCards } from "@/pages/reports/components/ReportKpiCards";
import { ReportFilterBar } from "@/pages/reports/components/ReportFilterBar";
import { ReportExportToolbar } from "@/pages/reports/components/ReportExportToolbar";
import { reportsApi } from "@/api/reports.api";
import { AcSummaryOverviewRow, ReportKpiMetric, ReportFilterState } from "@/types/reports.types";

export const AcSummaryOverviewPage: React.FC = () => {
  const [kpis, setKpis] = useState<ReportKpiMetric[]>([]);
  const [rows, setRows] = useState<AcSummaryOverviewRow[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filters, setFilters] = useState<ReportFilterState>({
    search: "",
    dateRange: "Today"
  });

  const loadData = async () => {
    setIsLoading(true);
    try {
      const data = await reportsApi.getAcSummaryOverview(filters);
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
      <ReportBreadcrumbs items={[{ label: "Telemetry & Sensors" }, { label: "AC Summary" }]} />

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="space-y-1">
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            AC Summary
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Review air-conditioning usage, distance, operating durations, and vehicle cooling cycles.
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
        reportTitle="AC_Summary_Report"
        dataToExport={rows}
      />

      <div className="panel-card !p-0 overflow-hidden border border-slate-200/80 dark:border-[#1D293D]">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50/75 dark:bg-[#121B2E] text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider text-[10px]">
                <th className="py-3.5 px-4">Vehicle Details</th>
                <th className="py-3.5 px-4">Branch</th>
                <th className="py-3.5 px-4">Driver</th>
                <th className="py-3.5 px-4 text-right">AC Distance</th>
                <th className="py-3.5 px-4 text-center">AC ON Duration</th>
                <th className="py-3.5 px-4 text-center">AC OFF Duration</th>
                <th className="py-3.5 px-4 text-center">AC Cycles</th>
                <th className="py-3.5 px-4 text-center">Current State</th>
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
                      {row.vehicleName} · {row.model}
                    </div>
                  </td>

                  <td className="py-3.5 px-4 text-slate-700 dark:text-slate-300">
                    {row.branch}
                  </td>

                  <td className="py-3.5 px-4 font-semibold text-slate-800 dark:text-slate-200">
                    {row.driverName}
                  </td>

                  <td className="py-3.5 px-4 text-right font-mono font-bold text-slate-900 dark:text-white">
                    {row.acOnDistanceKm.toLocaleString()}{" "}
                    <span className="text-[10px] text-slate-400 font-normal">km</span>
                  </td>

                  <td className="py-3.5 px-4 text-center font-mono font-bold text-cyan-600 dark:text-cyan-400">
                    {row.acOnDuration}
                  </td>

                  <td className="py-3.5 px-4 text-center font-mono text-slate-500">
                    {row.acOffDuration}
                  </td>

                  <td className="py-3.5 px-4 text-center font-mono font-bold text-slate-700 dark:text-slate-300">
                    {row.acCycles}
                  </td>

                  <td className="py-3.5 px-4 text-center">
                    <span
                      className={`inline-block text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full border ${
                        row.currentStatus === "AC ON"
                          ? "bg-cyan-50 text-cyan-700 dark:bg-cyan-950/40 dark:text-cyan-300 border-cyan-200 dark:border-cyan-800/60 font-mono"
                          : "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300 border-slate-200 dark:border-slate-700 font-mono"
                      }`}
                    >
                      {row.currentStatus}
                    </span>
                  </td>

                  <td className="py-3.5 px-4 text-right">
                    <Link
                      to={`/reports/ac-summary/${encodeURIComponent(row.vehicleNo)}`}
                      className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-cyan-50 dark:bg-cyan-950/30 text-cyan-700 dark:text-cyan-400 hover:bg-cyan-600 hover:text-white font-semibold text-xs transition-colors"
                    >
                      <span>AC Events</span>
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

export default AcSummaryOverviewPage;
