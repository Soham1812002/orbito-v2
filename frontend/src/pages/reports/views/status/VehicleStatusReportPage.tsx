import React, { useState, useEffect } from "react";
import { Car, Zap, Wifi } from "lucide-react";
import { ReportBreadcrumbs } from "@/pages/reports/components/ReportBreadcrumbs";
import { ReportKpiCards } from "@/pages/reports/components/ReportKpiCards";
import { ReportFilterBar } from "@/pages/reports/components/ReportFilterBar";
import { ReportExportToolbar } from "@/pages/reports/components/ReportExportToolbar";
import { reportsApi } from "@/api/reports.api";
import { VehicleStatusRow, ReportKpiMetric, ReportFilterState } from "@/types/reports.types";

export const VehicleStatusReportPage: React.FC = () => {
  const [kpis, setKpis] = useState<ReportKpiMetric[]>([]);
  const [rows, setRows] = useState<VehicleStatusRow[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filters, setFilters] = useState<ReportFilterState>({
    search: "",
    dateRange: "Today"
  });

  const loadData = async () => {
    setIsLoading(true);
    try {
      const data = await reportsApi.getVehicleStatusReport(filters);
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
      <ReportBreadcrumbs items={[{ label: "Operations & Tracking" }, { label: "Vehicle Status Report" }]} />

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="space-y-1">
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            Vehicle Status Report
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Live vehicle, device, ignition, GPS, battery, and last communication status by organization.
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
        reportTitle="Vehicle_Status_Register"
        dataToExport={rows}
      />

      <div className="panel-card !p-0 overflow-hidden border border-slate-200/80 dark:border-[#1D293D]">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50/75 dark:bg-[#121B2E] text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider text-[10px]">
                <th className="py-3.5 px-4">Organization & Vehicle</th>
                <th className="py-3.5 px-4">Body & Model</th>
                <th className="py-3.5 px-4 text-center">Power & Ignition</th>
                <th className="py-3.5 px-4 text-center">Telemetry Status</th>
                <th className="py-3.5 px-4 text-center">Speed</th>
                <th className="py-3.5 px-4 text-center">Battery</th>
                <th className="py-3.5 px-4">Connectivity & SIM</th>
                <th className="py-3.5 px-4">Last Communication</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 font-medium">
              {rows.map((row) => {
                const statusBadges = {
                  Running: "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800/60",
                  Stopped: "bg-blue-50 text-blue-700 dark:bg-blue-950/40 dark:text-blue-400 border-blue-200 dark:border-blue-800/60",
                  Idle: "bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400 border-amber-200 dark:border-amber-800/60",
                  Offline: "bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-400 border-rose-200 dark:border-rose-800/60"
                };

                return (
                  <tr
                    key={row.id}
                    className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors"
                  >
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-slate-900 dark:text-white font-mono text-xs">
                        {row.vehicleNo}
                      </div>
                      <div className="text-[11px] text-slate-500 truncate max-w-xs">{row.organization}</div>
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-slate-800 dark:text-slate-200">{row.vehicleType}</div>
                      <div className="text-[11px] text-slate-400">{row.model}</div>
                    </td>

                    <td className="py-3.5 px-4 text-center font-mono">
                      <span
                        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold ${
                          row.powerIgnition === "ON"
                            ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300"
                            : "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400"
                        }`}
                      >
                        <Zap className="h-3 w-3" />
                        {row.powerIgnition}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-center">
                      <span
                        className={`inline-block text-[10px] uppercase font-bold tracking-wider px-2.5 py-0.5 rounded-full border ${
                          statusBadges[row.status]
                        }`}
                      >
                        {row.status}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-center font-mono font-bold text-slate-900 dark:text-white">
                      {row.speedKmH} <span className="text-[10px] text-slate-400 font-normal">km/h</span>
                    </td>

                    <td className="py-3.5 px-4 text-center font-mono font-semibold text-slate-700 dark:text-slate-300">
                      {row.batteryVoltage}
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="text-slate-800 dark:text-slate-200 font-mono text-[11px]">{row.connectivity}</div>
                      <div className="text-[10px] text-slate-400 font-mono">SIM: {row.simNumber}</div>
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="text-slate-800 dark:text-slate-200 text-xs font-medium">
                        {row.lastCommunication}
                      </div>
                      <div className="text-[11px] text-slate-400 truncate max-w-xs">{row.location}</div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default VehicleStatusReportPage;
