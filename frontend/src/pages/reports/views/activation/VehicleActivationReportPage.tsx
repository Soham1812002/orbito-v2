import React, { useState, useEffect } from "react";
import { ShieldCheck, CheckCircle2, Clock, AlertTriangle } from "lucide-react";
import { ReportBreadcrumbs } from "@/pages/reports/components/ReportBreadcrumbs";
import { ReportKpiCards } from "@/pages/reports/components/ReportKpiCards";
import { ReportFilterBar } from "@/pages/reports/components/ReportFilterBar";
import { ReportExportToolbar } from "@/pages/reports/components/ReportExportToolbar";
import { reportsApi } from "@/api/reports.api";
import { VehicleActivationRow, ReportKpiMetric, ReportFilterState } from "@/types/reports.types";

export const VehicleActivationReportPage: React.FC = () => {
  const [kpis, setKpis] = useState<ReportKpiMetric[]>([]);
  const [rows, setRows] = useState<VehicleActivationRow[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filters, setFilters] = useState<ReportFilterState>({
    search: "",
    dateRange: "Today"
  });

  const loadData = async () => {
    setIsLoading(true);
    try {
      const data = await reportsApi.getVehicleActivationReport(filters);
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
      <ReportBreadcrumbs items={[{ label: "Operations & Tracking" }, { label: "Vehicle Activation Report" }]} />

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="space-y-1">
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            Vehicle Activation Report
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Track vehicle setup, GPS hardware provisioning, SIM assignment, and activation ownership.
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
        reportTitle="Vehicle_Activation_Register"
        dataToExport={rows}
      />

      <div className="panel-card !p-0 overflow-hidden border border-slate-200/80 dark:border-[#1D293D]">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50/75 dark:bg-[#121B2E] text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider text-[10px]">
                <th className="py-3.5 px-4">Vehicle Details</th>
                <th className="py-3.5 px-4">Company & Branch</th>
                <th className="py-3.5 px-4">IMEI & SIM Hardware</th>
                <th className="py-3.5 px-4">Vehicle Creation</th>
                <th className="py-3.5 px-4">GPS Provisioned</th>
                <th className="py-3.5 px-4">Activation Date</th>
                <th className="py-3.5 px-4">Activated By</th>
                <th className="py-3.5 px-4 text-center">Status</th>
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
                    <div className="text-[11px] text-slate-400">{row.vehicleType}</div>
                  </td>

                  <td className="py-3.5 px-4">
                    <div className="font-semibold text-slate-800 dark:text-slate-200">{row.company}</div>
                    <div className="text-[11px] text-slate-400">{row.branch}</div>
                  </td>

                  <td className="py-3.5 px-4 font-mono text-[11px]">
                    <div className="text-slate-800 dark:text-slate-200">IMEI: {row.imei}</div>
                    <div className="text-slate-400">SIM: {row.simNo}</div>
                  </td>

                  <td className="py-3.5 px-4 text-slate-600 dark:text-slate-300">
                    {row.vehicleCreationDate}
                  </td>

                  <td className="py-3.5 px-4 text-slate-600 dark:text-slate-300">
                    {row.gpsCreationDate}
                  </td>

                  <td className="py-3.5 px-4 font-semibold text-slate-900 dark:text-white">
                    {row.vehicleActivationDate}
                  </td>

                  <td className="py-3.5 px-4 text-slate-700 dark:text-slate-300">
                    {row.activatedBy}
                  </td>

                  <td className="py-3.5 px-4 text-center">
                    <span
                      className={`inline-flex items-center gap-1 text-[10px] uppercase font-bold tracking-wider px-2.5 py-0.5 rounded-full border ${
                        row.status === "ACTIVATED"
                          ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800/60"
                          : row.status === "PENDING"
                          ? "bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400 border-amber-200 dark:border-amber-800/60"
                          : "bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-400 border-rose-200 dark:border-rose-800/60"
                      }`}
                    >
                      {row.status === "ACTIVATED" && <CheckCircle2 className="h-3 w-3" />}
                      {row.status === "PENDING" && <Clock className="h-3 w-3" />}
                      {row.status === "ATTENTION" && <AlertTriangle className="h-3 w-3" />}
                      {row.status}
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

export default VehicleActivationReportPage;
