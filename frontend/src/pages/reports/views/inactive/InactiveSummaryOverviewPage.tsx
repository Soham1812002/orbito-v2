import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Radio, ArrowUpRight } from "lucide-react";
import { ReportBreadcrumbs } from "@/pages/reports/components/ReportBreadcrumbs";
import { ReportKpiCards } from "@/pages/reports/components/ReportKpiCards";
import { ReportFilterBar } from "@/pages/reports/components/ReportFilterBar";
import { ReportExportToolbar } from "@/pages/reports/components/ReportExportToolbar";
import { reportsApi } from "@/api/reports.api";
import { InactiveOverviewRow, ReportKpiMetric, ReportFilterState } from "@/types/reports.types";

export const InactiveSummaryOverviewPage: React.FC = () => {
  const [kpis, setKpis] = useState<ReportKpiMetric[]>([]);
  const [rows, setRows] = useState<InactiveOverviewRow[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filters, setFilters] = useState<ReportFilterState>({
    search: "",
    dateRange: "Today"
  });

  const loadData = async () => {
    setIsLoading(true);
    try {
      const data = await reportsApi.getInactiveOverview(filters);
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
      <ReportBreadcrumbs items={[{ label: "Telemetry & Sensors" }, { label: "Inactive Summary" }]} />

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="space-y-1">
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            Inactive Summary
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Review inactive vehicles, last communication times, and complete inactivity status by branch.
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
        reportTitle="Inactive Summary Report"
        dataToExport={rows}
      />

      <div className="panel-card !p-0 overflow-hidden border border-slate-200/80 dark:border-[#1D293D]">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50/75 dark:bg-[#121B2E] text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider text-[10px]">
                <th className="py-3.5 px-4">Vehicle Details</th>
                <th className="py-3.5 px-4">Branch</th>
                <th className="py-3.5 px-4">Inactive Since</th>
                <th className="py-3.5 px-4">Last Reported Location</th>
                <th className="py-3.5 px-4 text-center">Inactive Duration</th>
                <th className="py-3.5 px-4 text-center">GPS Status</th>
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
                    <div className="text-[11px] text-slate-400">{row.driverName}</div>
                  </td>

                  <td className="py-3.5 px-4 text-slate-700 dark:text-slate-300">
                    {row.branch}
                  </td>

                  <td className="py-3.5 px-4 font-mono text-slate-600 dark:text-slate-300">
                    {row.inactiveSince}
                  </td>

                  <td className="py-3.5 px-4 text-slate-600 dark:text-slate-300 truncate max-w-xs">
                    {row.lastLocation}
                  </td>

                  <td className="py-3.5 px-4 text-center font-mono font-bold text-rose-600 dark:text-rose-400">
                    {row.inactiveDuration}
                  </td>

                  <td className="py-3.5 px-4 text-center">
                    <span
                      className={`inline-block text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full border ${
                        row.gpsStatus === "OVER 24 HR"
                          ? "bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-400 border-rose-200 dark:border-rose-800/60"
                          : "bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400 border-amber-200 dark:border-amber-800/60"
                      }`}
                    >
                      {row.gpsStatus}
                    </span>
                  </td>

                  <td className="py-3.5 px-4 text-right">
                    <Link
                      to={`/reports/inactive-summary/${encodeURIComponent(row.vehicleNo)}`}
                      className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-rose-50 dark:bg-rose-950/30 text-rose-700 dark:text-rose-400 hover:bg-rose-600 hover:text-white font-semibold text-xs transition-colors"
                    >
                      <span>Events ({row.eventCount})</span>
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

export default InactiveSummaryOverviewPage;
