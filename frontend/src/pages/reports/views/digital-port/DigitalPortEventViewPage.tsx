import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Cpu, CheckCircle2, AlertCircle } from "lucide-react";
import { ReportBreadcrumbs } from "@/pages/reports/components/ReportBreadcrumbs";
import { ReportKpiCards } from "@/pages/reports/components/ReportKpiCards";
import { ReportExportToolbar } from "@/pages/reports/components/ReportExportToolbar";
import { reportsApi } from "@/api/reports.api";
import { DigitalPortEvent, ReportKpiMetric } from "@/types/reports.types";

export const DigitalPortEventViewPage: React.FC = () => {
  const { vehicleId = "GJ 01 RT 4821" } = useParams<{ vehicleId: string }>();
  const [events, setEvents] = useState<DigitalPortEvent[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      setIsLoading(true);
      try {
        const data = await reportsApi.getDigitalPortEvents(vehicleId);
        setEvents(data.events);
      } finally {
        setIsLoading(false);
      }
    };
    fetchEvents();
  }, [vehicleId]);

  const kpis: ReportKpiMetric[] = [
    { label: "MONITORED PORTS", value: "5 active", unit: "PORTS", status: "info" },
    { label: "GPS STATUS", value: "GPS ONLINE", subtext: "23h 58m uptime", status: "success" },
    { label: "DOOR SENSOR DURATION", value: "01h 14m", subtext: "6 open cycles", status: "warning" },
    { label: "PTO UTILIZATION", value: "02h 35m", subtext: "4 switch cycles", status: "info" }
  ];

  return (
    <div className="space-y-6">
      <ReportBreadcrumbs
        items={[
          { label: "Telemetry & Sensors", href: "/reports/digital-port-summary" },
          { label: "Digital Port Summary", href: "/reports/digital-port-summary" },
          { label: `Port Activity — ${vehicleId}` }
        ]}
        backHref="/reports/digital-port-summary"
        backLabel="Back to Digital Port Summary"
      />

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="space-y-1">
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            Digital Port Activity — {vehicleId}
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Digital input activity and port sensor utilization for {vehicleId} during the reporting period.
          </p>
        </div>
      </div>

      <ReportKpiCards metrics={kpis} />

      <ReportExportToolbar
        totalCount={events.length}
        reportTitle={`Digital_Port_Events_${vehicleId}`}
        dataToExport={events}
      />

      <div className="panel-card !p-0 overflow-hidden border border-slate-200/80 dark:border-[#1D293D]">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50/75 dark:bg-[#121B2E] text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider text-[10px]">
                <th className="py-3.5 px-4">Port Number</th>
                <th className="py-3.5 px-4">Assigned Sensor</th>
                <th className="py-3.5 px-4">IMEI Number</th>
                <th className="py-3.5 px-4 text-center">ON / Open Duration</th>
                <th className="py-3.5 px-4 text-center">Times Open</th>
                <th className="py-3.5 px-4 text-center">OFF / Close Duration</th>
                <th className="py-3.5 px-4 text-center">Times Closed</th>
                <th className="py-3.5 px-4 text-center">Current Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 font-medium">
              {events.map((port, idx) => (
                <tr
                  key={idx}
                  className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors"
                >
                  <td className="py-3.5 px-4">
                    <span className="font-mono font-bold text-xs text-blue-600 dark:text-blue-400 px-2 py-0.5 rounded bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800/60">
                      {port.portNumber}
                    </span>
                  </td>

                  <td className="py-3.5 px-4 font-semibold text-slate-800 dark:text-slate-200">
                    {port.portName}
                  </td>

                  <td className="py-3.5 px-4 font-mono text-slate-500">
                    {port.imei}
                  </td>

                  <td className="py-3.5 px-4 text-center font-mono font-semibold text-emerald-600 dark:text-emerald-400">
                    {port.onDuration}
                  </td>

                  <td className="py-3.5 px-4 text-center font-mono font-bold text-slate-700 dark:text-slate-300">
                    {port.timesOn}
                  </td>

                  <td className="py-3.5 px-4 text-center font-mono font-semibold text-slate-600 dark:text-slate-400">
                    {port.offDuration}
                  </td>

                  <td className="py-3.5 px-4 text-center font-mono font-bold text-slate-700 dark:text-slate-300">
                    {port.timesOff}
                  </td>

                  <td className="py-3.5 px-4 text-center">
                    <span
                      className={`inline-flex items-center gap-1 text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full border ${
                        port.currentStatus === "Open"
                          ? "bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400 border-amber-200 dark:border-amber-800/60"
                          : "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800/60"
                      }`}
                    >
                      <CheckCircle2 className="h-3 w-3" />
                      {port.currentStatus}
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

export default DigitalPortEventViewPage;
