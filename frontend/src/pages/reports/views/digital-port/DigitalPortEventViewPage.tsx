import React, { useState, useEffect, useMemo } from "react";
import { useParams } from "react-router-dom";
import type { ColDef } from "ag-grid-community";
import { Cpu, CheckCircle2, AlertCircle } from "lucide-react";
import { ReportBreadcrumbs } from "@/pages/reports/components/ReportBreadcrumbs";
import { ReportKpiCards } from "@/pages/reports/components/ReportKpiCards";
import { ReportExportToolbar } from "@/pages/reports/components/ReportExportToolbar";
import { AppDataTable } from "@/components/common/AppDataTable";
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

  const columns = useMemo<ColDef<DigitalPortEvent>[]>(
    () => [
      {
        headerName: "Port Number",
        field: "portNumber",
        minWidth: 120,
        cellRenderer: (params: any) => (
          <span className="font-mono font-bold text-xs text-blue-600 dark:text-blue-400 px-2 py-0.5 rounded bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800/60">
            {params.value}
          </span>
        )
      },
      {
        headerName: "Assigned Sensor",
        field: "portName",
        minWidth: 150,
        cellRenderer: (params: any) => (
          <span className="font-semibold text-slate-800 dark:text-slate-200">
            {params.value}
          </span>
        )
      },
      {
        headerName: "IMEI Number",
        field: "imei",
        minWidth: 150,
        cellRenderer: (params: any) => (
          <span className="font-mono text-slate-500 text-xs">
            {params.value}
          </span>
        )
      },
      {
        headerName: "ON / Open Duration",
        field: "onDuration",
        minWidth: 140,
        cellRenderer: (params: any) => (
          <span className="font-mono font-semibold text-2xs text-emerald-600 dark:text-emerald-400">
            {params.value}
          </span>
        )
      },
      {
        headerName: "Times Open",
        field: "timesOn",
        minWidth: 110,
        cellRenderer: (params: any) => (
          <span className="font-mono font-bold text-2xs text-slate-700 dark:text-slate-300">
            {params.value}
          </span>
        )
      },
      {
        headerName: "OFF / Close Duration",
        field: "offDuration",
        minWidth: 140,
        cellRenderer: (params: any) => (
          <span className="font-mono font-semibold text-2xs text-slate-600 dark:text-slate-400">
            {params.value}
          </span>
        )
      },
      {
        headerName: "Times Closed",
        field: "timesOff",
        minWidth: 110,
        cellRenderer: (params: any) => (
          <span className="font-mono font-bold text-2xs text-slate-700 dark:text-slate-300">
            {params.value}
          </span>
        )
      },
      {
        headerName: "Current Status",
        field: "currentStatus",
        minWidth: 130,
        cellRenderer: (params: any) => (
          <span
            className={`inline-flex items-center gap-1 text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full border ${
              params.value === "Open"
                ? "bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400 border-amber-200 dark:border-amber-800/60"
                : "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800/60"
            }`}
          >
            <CheckCircle2 className="h-3 w-3" />
            {params.value}
          </span>
        )
      }
    ],
    []
  );

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

      {/* Responsive Data Table using AppDataTable */}
      <div className="-mx-4 sm:mx-0 overflow-x-auto">
        <AppDataTable<DigitalPortEvent>
          rowData={events}
          columnDefs={columns}
          isLoading={isLoading}
          total={events.length}
        />
      </div>
    </div>
  );
};

export default DigitalPortEventViewPage;
