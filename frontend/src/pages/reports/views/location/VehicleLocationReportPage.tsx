import React, { useState, useEffect } from "react";
import { MapPin, Navigation, Signal } from "lucide-react";
import { ReportBreadcrumbs } from "@/pages/reports/components/ReportBreadcrumbs";
import { ReportKpiCards } from "@/pages/reports/components/ReportKpiCards";
import { ReportFilterBar } from "@/pages/reports/components/ReportFilterBar";
import { ReportExportToolbar } from "@/pages/reports/components/ReportExportToolbar";
import { reportsApi } from "@/api/reports.api";
import { VehicleLocationRow, ReportKpiMetric, ReportFilterState } from "@/types/reports.types";

export const VehicleLocationReportPage: React.FC = () => {
  const [kpis, setKpis] = useState<ReportKpiMetric[]>([]);
  const [rows, setRows] = useState<VehicleLocationRow[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filters, setFilters] = useState<ReportFilterState>({
    search: "",
    dateRange: "Today"
  });

  const loadData = async () => {
    setIsLoading(true);
    try {
      const data = await reportsApi.getVehicleLocationReport(filters);
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
      <ReportBreadcrumbs items={[{ label: "Operations & Tracking" }, { label: "Vehicle Location Report" }]} />

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="space-y-1">
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            Vehicle Location Report
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Monitor the latest vehicle locations, driver details, telemetry status, and coordinates across your fleet.
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
        reportTitle="Vehicle_Location_Register"
        dataToExport={rows}
      />

      <div className="panel-card !p-0 overflow-hidden border border-slate-200/80 dark:border-[#1D293D]">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50/75 dark:bg-[#121B2E] text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider text-[10px]">
                <th className="py-3.5 px-4">Vehicle Details</th>
                <th className="py-3.5 px-4">Company & Branch</th>
                <th className="py-3.5 px-4">Assigned Driver</th>
                <th className="py-3.5 px-4">Current Geocoded Address</th>
                <th className="py-3.5 px-4">Coordinates</th>
                <th className="py-3.5 px-4 text-center">Speed & Heading</th>
                <th className="py-3.5 px-4 text-center">GPS Signal</th>
                <th className="py-3.5 px-4 text-right">Last Updated</th>
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
                    <div className="text-[10px] text-slate-400 font-mono">IMEI: {row.imei}</div>
                  </td>

                  <td className="py-3.5 px-4">
                    <div className="font-semibold text-slate-800 dark:text-slate-200">{row.company}</div>
                    <div className="text-[11px] text-slate-400">{row.branch}</div>
                  </td>

                  <td className="py-3.5 px-4">
                    <div className="font-semibold text-slate-800 dark:text-slate-200">{row.driverName}</div>
                    <div className="text-[11px] text-slate-400 font-mono">{row.driverPhone}</div>
                  </td>

                  <td className="py-3.5 px-4 max-w-sm">
                    <div className="flex items-center gap-1.5 text-slate-700 dark:text-slate-300">
                      <MapPin className="h-3.5 w-3.5 text-blue-500 shrink-0" />
                      <span className="truncate">{row.currentAddress}</span>
                    </div>
                  </td>

                  <td className="py-3.5 px-4 font-mono text-[11px] text-slate-500">
                    {row.latitude.toFixed(4)}°, {row.longitude.toFixed(4)}°
                  </td>

                  <td className="py-3.5 px-4 text-center font-mono">
                    <div className="font-bold text-slate-900 dark:text-white">
                      {row.speedKmH} <span className="text-[10px] text-slate-400 font-normal">km/h</span>
                    </div>
                    <div className="text-[10px] text-slate-400">{row.heading}</div>
                  </td>

                  <td className="py-3.5 px-4 text-center">
                    <span
                      className={`inline-flex items-center gap-1 text-[10px] uppercase font-bold tracking-wider px-2.5 py-0.5 rounded-full border ${
                        row.gpsSignal === "ONLINE"
                          ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800/60"
                          : "bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-400 border-rose-200 dark:border-rose-800/60"
                      }`}
                    >
                      <Signal className="h-3 w-3" />
                      {row.gpsSignal}
                    </span>
                  </td>

                  <td className="py-3.5 px-4 text-right font-mono text-slate-500 text-[11px]">
                    {row.lastUpdated}
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

export default VehicleLocationReportPage;
