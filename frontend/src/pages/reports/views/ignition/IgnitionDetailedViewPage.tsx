import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { ReportBreadcrumbs } from "@/pages/reports/components/ReportBreadcrumbs";
import { ReportKpiCards } from "@/pages/reports/components/ReportKpiCards";
import { ReportExportToolbar } from "@/pages/reports/components/ReportExportToolbar";
import { VehicleEventTimeline } from "@/pages/reports/components/VehicleEventTimeline";
import { reportsApi } from "@/api/reports.api";
import { IgnitionEvent, ReportKpiMetric } from "@/types/reports.types";

export const IgnitionDetailedViewPage: React.FC = () => {
  const { vehicleId = "GJ 01 RT 4821" } = useParams<{ vehicleId: string }>();
  const [events, setEvents] = useState<IgnitionEvent[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      setIsLoading(true);
      try {
        const data = await reportsApi.getIgnitionEvents(vehicleId);
        setEvents(data.events);
      } finally {
        setIsLoading(false);
      }
    };
    fetchEvents();
  }, [vehicleId]);

  const kpis: ReportKpiMetric[] = [
    { label: "IGNITION CYCLES", value: events.length || 8, unit: "CYCLES", status: "info" },
    { label: "ENGINE RUNNING", value: "4h 52m", status: "success" },
    { label: "IDLE TIME", value: "1h 26m", status: "warning" },
    { label: "DISTANCE TODAY", value: "186.4 km", status: "info" },
    { label: "AVG SPEED", value: "38 km/h", status: "success" }
  ];

  const timelineItems = events.map((evt) => ({
    id: evt.id,
    title: evt.eventNumber,
    subtitle: evt.routeName,
    startTime: evt.ignitionOnTime,
    endTime: evt.ignitionOffTime,
    duration: evt.runningTime,
    durationStatus: "success" as const,
    location: `${evt.startAddress} → ${evt.endAddress}`,
    tags: [
      { label: "Distance", value: `${evt.distanceKm} km` },
      { label: "Idle", value: evt.idleTime },
      { label: "Speed", value: `${evt.avgSpeedKmH} km/h` }
    ]
  }));

  return (
    <div className="space-y-6">
      <ReportBreadcrumbs
        items={[
          { label: "Telemetry & Sensors", href: "/reports/ignition-summary" },
          { label: "Ignition Summary", href: "/reports/ignition-summary" },
          { label: `Ignition Events — ${vehicleId}` }
        ]}
        backHref="/reports/ignition-summary"
        backLabel="Back to Ignition Summary"
      />

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="space-y-1">
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            Ignition Events Timeline — {vehicleId}
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Chronological breakdown of engine startup, route runtime, idle overlap, and distance covered.
          </p>
        </div>
      </div>

      <ReportKpiCards metrics={kpis} />

      <ReportExportToolbar
        totalCount={events.length}
        reportTitle={`Ignition_Events_${vehicleId}`}
        dataToExport={events}
      />

      <VehicleEventTimeline events={timelineItems} />
    </div>
  );
};

export default IgnitionDetailedViewPage;
