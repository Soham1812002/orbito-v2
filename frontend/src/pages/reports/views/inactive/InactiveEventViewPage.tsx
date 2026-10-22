import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { ReportBreadcrumbs } from "@/pages/reports/components/ReportBreadcrumbs";
import { ReportKpiCards } from "@/pages/reports/components/ReportKpiCards";
import { ReportExportToolbar } from "@/pages/reports/components/ReportExportToolbar";
import { VehicleEventTimeline } from "@/pages/reports/components/VehicleEventTimeline";
import { reportsApi } from "@/api/reports.api";
import { InactiveEvent, ReportKpiMetric } from "@/types/reports.types";

export const InactiveEventViewPage: React.FC = () => {
  const { vehicleId = "GJ 01 RT 4821" } = useParams<{ vehicleId: string }>();
  const [events, setEvents] = useState<InactiveEvent[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      setIsLoading(true);
      try {
        const data = await reportsApi.getInactiveEvents(vehicleId);
        setEvents(data.events);
      } finally {
        setIsLoading(false);
      }
    };
    fetchEvents();
  }, [vehicleId]);

  const kpis: ReportKpiMetric[] = [
    { label: "TOTAL INACTIVE EVENTS", value: events.length || 12, unit: "EVENTS", status: "danger" },
    { label: "TOTAL INACTIVE DURATION", value: "9h 18m", status: "warning" },
    { label: "LONGEST INACTIVITY", value: "5h 34m", subtext: "Overnight Depot Stay", status: "info" },
    { label: "OVER 2 HR PERIODS", value: "2", unit: "PERIODS", status: "danger" }
  ];

  const timelineItems = events.map((evt, idx) => ({
    id: evt.id,
    title: `Inactivity Window ${String(idx + 1).padStart(2, "0")}`,
    subtitle: `${evt.date} · ${evt.reason}`,
    startTime: evt.startTime,
    endTime: evt.endTime,
    duration: evt.duration,
    durationStatus: (parseInt(evt.duration) > 60 ? "danger" : "warning") as "danger" | "warning",
    location: evt.lastKnownLocation,
    tags: [
      { label: "Reason", value: evt.reason },
      { label: "Battery", value: evt.batteryStatus }
    ]
  }));

  return (
    <div className="space-y-6">
      <ReportBreadcrumbs
        items={[
          { label: "Telemetry & Sensors", href: "/reports/inactive-summary" },
          { label: "Inactive Summary", href: "/reports/inactive-summary" },
          { label: `Inactive Events — ${vehicleId}` }
        ]}
        backHref="/reports/inactive-summary"
        backLabel="Back to Inactive Summary"
      />

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="space-y-1">
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            All Inactive Events — {vehicleId}
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Chronological log of GPS signal drops, depot stops, and offline periods for {vehicleId}.
          </p>
        </div>
      </div>

      <ReportKpiCards metrics={kpis} />

      <ReportExportToolbar
        totalCount={events.length}
        reportTitle={`Inactive_Events_${vehicleId}`}
        dataToExport={events}
      />

      <VehicleEventTimeline events={timelineItems} />
    </div>
  );
};

export default InactiveEventViewPage;
