import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { SquareSlash, ArrowUpRight } from "lucide-react";
import { ReportBreadcrumbs } from "@/pages/reports/components/ReportBreadcrumbs";
import { ReportKpiCards } from "@/pages/reports/components/ReportKpiCards";
import { ReportFilterBar } from "@/pages/reports/components/ReportFilterBar";
import { ReportExportToolbar } from "@/pages/reports/components/ReportExportToolbar";
import { reportsApi } from "@/api/reports.api";
import { StoppageOverviewRow, ReportKpiMetric, ReportFilterState } from "@/types/reports.types";

export const StoppageSummaryOverviewPage: React.FC = () => {
  const [kpis, setKpis] = useState<ReportKpiMetric[]>([]);
  const [rows, setRows] = useState<StoppageOverviewRow[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filters, setFilters] = useState<ReportFilterState>({
    search: "",
    dateRange: "Today"
  });

  const loadData = async () => {
    setIsLoading(true);
    try {
      const data = await reportsApi.getStoppageOverview(filters);
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
      <ReportBreadcrumbs items={[{ label: "Fleet Activity" }, { label: "Stoppage Summary" }]} />

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="space-y-1">
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            Stoppage Summary
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Review vehicle stoppage events, duration trends, and complete stoppage activity by branch.
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
        reportTitle="Stoppage Summary Report"
        dataToExport={rows}
      />

      <div className="panel-card !p-0 overflow-hidden border border-slate-200/80 dark:border-[#1D293D]">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50/75 dark:bg-[#121B2E] text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider text-[10px]">
                <th className="py-3.5 px-4">Vehicle Details</th>
                <th className="py-3.5 px-4">Branch</th>
                <th className="py-3.5 px-4">Assigned Driver</th>
                <th className="py-3.5 px-4 text-center">Total Stoppages</th>
                <th className="py-3.5 px-4 text-center">Stoppage Time</th>
                <th className="py-3.5 px-4 text-center">Longest Stoppage</th>
                <th className="py-3.5 px-4 text-center">Avg Stoppage</th>
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
                    <div className="text-[11px] text-slate-400 truncate max-w-xs">
                      Last: {row.lastStoppageLocation}
                    </div>
                  </td>

                  <td className="py-3.5 px-4 text-slate-700 dark:text-slate-300 font-medium">
                    {row.branch}
                  </td>

                  <td className="py-3.5 px-4 font-semibold text-slate-800 dark:text-slate-200">
                    {row.driverName}
                  </td>

                  <td className="py-3.5 px-4 text-center">
                    <span className="px-2.5 py-0.5 rounded-full font-mono text-xs font-bold bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800/60">
                      {row.totalStoppages} Events
                    </span>
                  </td>

                  <td className="py-3.5 px-4 text-center font-mono font-bold text-rose-600 dark:text-rose-400">
                    {row.totalStoppageTime}
                  </td>

                  <td className="py-3.5 px-4 text-center font-mono text-slate-700 dark:text-slate-300">
                    {row.longestStoppage}
                  </td>

                  <td className="py-3.5 px-4 text-center font-mono text-slate-500">
                    {row.avgStoppageTime}
                  </td>

                  <td className="py-3.5 px-4 text-right">
                    <Link
                      to={`/reports/stoppage-summary/${encodeURIComponent(row.vehicleNo)}`}
                      className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-amber-50 dark:bg-amber-950/30 text-amber-700 dark:text-amber-400 hover:bg-amber-600 hover:text-white font-semibold text-xs transition-colors"
                    >
                      <span>View Events</span>
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

export default StoppageSummaryOverviewPage;
