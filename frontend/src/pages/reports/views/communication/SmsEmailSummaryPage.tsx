import React, { useState, useEffect } from "react";
import { Mail, MessageSquare, CheckCircle2, AlertCircle } from "lucide-react";
import { ReportBreadcrumbs } from "@/pages/reports/components/ReportBreadcrumbs";
import { ReportKpiCards } from "@/pages/reports/components/ReportKpiCards";
import { ReportFilterBar } from "@/pages/reports/components/ReportFilterBar";
import { ReportExportToolbar } from "@/pages/reports/components/ReportExportToolbar";
import { reportsApi } from "@/api/reports.api";
import { SmsEmailSummaryRow, ReportKpiMetric, ReportFilterState } from "@/types/reports.types";

export const SmsEmailSummaryPage: React.FC = () => {
  const [kpis, setKpis] = useState<ReportKpiMetric[]>([]);
  const [rows, setRows] = useState<SmsEmailSummaryRow[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filters, setFilters] = useState<ReportFilterState>({
    search: "",
    dateRange: "Today"
  });

  const loadData = async () => {
    setIsLoading(true);
    try {
      const data = await reportsApi.getSmsEmailSummary(filters);
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
      <ReportBreadcrumbs items={[{ label: "Communications & Logs" }, { label: "SMS & Email Summary" }]} />

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="space-y-1">
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            SMS and Email Summary
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Outbound communication totals, delivery status, and trigger events grouped by company and vehicle.
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
        reportTitle="SMS_Email_Delivery_Summary"
        dataToExport={rows}
      />

      <div className="panel-card !p-0 overflow-hidden border border-slate-200/80 dark:border-[#1D293D]">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50/75 dark:bg-[#121B2E] text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider text-[10px]">
                <th className="py-3.5 px-4">Vehicle Details</th>
                <th className="py-3.5 px-4">Company & Branch</th>
                <th className="py-3.5 px-4">Brand & Model</th>
                <th className="py-3.5 px-4 text-center">Sent SMS</th>
                <th className="py-3.5 px-4 text-center">Sent Email</th>
                <th className="py-3.5 px-4 text-center">Delivered SMS</th>
                <th className="py-3.5 px-4 text-center">Failed</th>
                <th className="py-3.5 px-4">Last Trigger Event</th>
                <th className="py-3.5 px-4 text-right">Timestamp</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 font-medium">
              {rows.map((row) => (
                <tr
                  key={row.id}
                  className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors"
                >
                  <td className="py-3.5 px-4 font-bold text-slate-900 dark:text-white font-mono text-xs">
                    {row.vehicleNo}
                  </td>

                  <td className="py-3.5 px-4">
                    <div className="font-semibold text-slate-800 dark:text-slate-200">{row.company}</div>
                    <div className="text-[11px] text-slate-400">{row.branch}</div>
                  </td>

                  <td className="py-3.5 px-4 text-slate-700 dark:text-slate-300">
                    {row.vehicleBrand} · {row.vehicleModel}
                  </td>

                  <td className="py-3.5 px-4 text-center font-mono font-bold text-slate-800 dark:text-slate-200">
                    {row.sentSms}
                  </td>

                  <td className="py-3.5 px-4 text-center font-mono font-bold text-blue-600 dark:text-blue-400">
                    {row.sentEmail}
                  </td>

                  <td className="py-3.5 px-4 text-center font-mono font-semibold text-emerald-600 dark:text-emerald-400">
                    {row.deliveredSms}
                  </td>

                  <td className="py-3.5 px-4 text-center font-mono">
                    {row.failedSms > 0 ? (
                      <span className="text-rose-600 font-bold">{row.failedSms}</span>
                    ) : (
                      <span className="text-slate-400">0</span>
                    )}
                  </td>

                  <td className="py-3.5 px-4 font-medium text-slate-800 dark:text-slate-200 truncate max-w-xs">
                    {row.lastTriggerType}
                  </td>

                  <td className="py-3.5 px-4 text-right font-mono text-[11px] text-slate-400">
                    {row.lastSentTimestamp}
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

export default SmsEmailSummaryPage;
