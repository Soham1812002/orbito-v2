import React, { useState, useEffect } from "react";
import { Activity, Radio, CheckCircle2, AlertTriangle, ShieldAlert } from "lucide-react";
import { ReportBreadcrumbs } from "@/pages/reports/components/ReportBreadcrumbs";
import { ReportKpiCards } from "@/pages/reports/components/ReportKpiCards";
import { ReportFilterBar } from "@/pages/reports/components/ReportFilterBar";
import { ReportExportToolbar } from "@/pages/reports/components/ReportExportToolbar";
import { reportsApi } from "@/api/reports.api";
import { SystemLogRow, ReportKpiMetric, ReportFilterState } from "@/types/reports.types";

export const SystemLogPage: React.FC = () => {
  const [kpis, setKpis] = useState<ReportKpiMetric[]>([]);
  const [logs, setLogs] = useState<SystemLogRow[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filters, setFilters] = useState<ReportFilterState>({
    search: "",
    dateRange: "Today"
  });

  const loadData = async () => {
    setIsLoading(true);
    try {
      const data = await reportsApi.getSystemLogs(filters);
      setKpis(data.kpis);
      setLogs(data.logs);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [filters.search, filters.dateRange]);

  return (
    <div className="space-y-6">
      <ReportBreadcrumbs items={[{ label: "Communications & Logs" }, { label: "System Log" }]} />

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="space-y-1">
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            System Log
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Monitor incoming device packets, GPS validity, vehicle signals, power status, and firmware details.
          </p>
        </div>
      </div>

      <ReportKpiCards metrics={kpis} />

      <ReportFilterBar
        filters={filters}
        onFilterChange={setFilters}
        onRefresh={loadData}
        isLoading={isLoading}
        showVehicleFilter={false}
      />

      <ReportExportToolbar
        totalCount={logs.length}
        reportTitle="System_Diagnostics_Log"
        dataToExport={logs}
      />

      <div className="panel-card !p-0 overflow-hidden border border-slate-200/80 dark:border-[#1D293D]">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50/75 dark:bg-[#121B2E] text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider text-[10px]">
                <th className="py-3.5 px-4">Receipt Timestamp</th>
                <th className="py-3.5 px-4">Company / Branch</th>
                <th className="py-3.5 px-4">Device IMEI / SIM</th>
                <th className="py-3.5 px-4">Coordinates</th>
                <th className="py-3.5 px-4">Signals & Sats</th>
                <th className="py-3.5 px-4">Movement State</th>
                <th className="py-3.5 px-4 text-center">Latency</th>
                <th className="py-3.5 px-4">Firmware</th>
                <th className="py-3.5 px-4 text-center">Severity</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 font-medium font-mono text-[11px]">
              {logs.map((log) => (
                <tr
                  key={log.id}
                  className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors"
                >
                  <td className="py-3.5 px-4 text-slate-600 dark:text-slate-300">
                    {log.timestamp}
                  </td>

                  <td className="py-3.5 px-4 font-sans">
                    <div className="font-semibold text-slate-800 dark:text-slate-200">{log.company}</div>
                    <div className="text-[10px] text-slate-400">{log.branch}</div>
                  </td>

                  <td className="py-3.5 px-4">
                    <div className="font-semibold text-slate-900 dark:text-white">{log.deviceImei}</div>
                    <div className="text-[10px] text-slate-400 font-sans">SIM: {log.simNumber}</div>
                  </td>

                  <td className="py-3.5 px-4 text-slate-600 dark:text-slate-300">
                    {log.coordinates}
                  </td>

                  <td className="py-3.5 px-4 text-slate-700 dark:text-slate-300">
                    {log.signals}
                  </td>

                  <td className="py-3.5 px-4 font-sans text-slate-700 dark:text-slate-300 font-medium">
                    {log.movementStatus}
                  </td>

                  <td className="py-3.5 px-4 text-center">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        log.packetTimingMs < 100
                          ? "text-emerald-600 bg-emerald-50 dark:bg-emerald-950/40"
                          : "text-amber-600 bg-amber-50 dark:bg-amber-950/40"
                      }`}
                    >
                      {log.packetTimingMs} ms
                    </span>
                  </td>

                  <td className="py-3.5 px-4 text-slate-500">
                    {log.firmware}
                  </td>

                  <td className="py-3.5 px-4 text-center font-sans">
                    <span
                      className={`inline-flex items-center gap-1 text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full border ${
                        log.severity === "INFO"
                          ? "bg-blue-50 text-blue-700 dark:bg-blue-950/40 dark:text-blue-400 border-blue-200 dark:border-blue-800/60"
                          : log.severity === "WARN"
                          ? "bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400 border-amber-200 dark:border-amber-800/60"
                          : "bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-400 border-rose-200 dark:border-rose-800/60"
                      }`}
                    >
                      {log.severity === "INFO" && <CheckCircle2 className="h-3 w-3" />}
                      {log.severity === "WARN" && <AlertTriangle className="h-3 w-3" />}
                      {log.severity}
                    </span>
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

export default SystemLogPage;
