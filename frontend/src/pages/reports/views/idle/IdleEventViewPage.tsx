import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { ReportBreadcrumbs } from "@/pages/reports/components/ReportBreadcrumbs";
import { ReportKpiCards } from "@/pages/reports/components/ReportKpiCards";
import { ReportExportToolbar } from "@/pages/reports/components/ReportExportToolbar";
import { VehicleEventTimeline } from "@/pages/reports/components/VehicleEventTimeline";
import { reportsApi } from "@/api/reports.api";
import { IdleEvent, ReportKpiMetric } from "@/types/reports.types";

export const IdleEventViewPage: React.FC = () => {
  const { vehicleId = "GJ 01 RT 4821" } = useParams<{ vehicleId: string }>();
  const [events, setEvents] = useState<IdleEvent[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      setIsLoading(true);
      try {
        const data = await reportsApi.getIdleEvents(vehicleId);
        setEvents(data.events);
      } finally {
        setIsLoading(false);
      }
    };
    fetchEvents();
  }, [vehicleId]);

  const kpis: ReportKpiMetric[] = [
    { label: "RECORDED IDLE EVENTS", value: events.length || 18, unit: "EVENTS", status: "warning" },
    { label: "TOTAL IDLE TIME", value: "04h 26m", status: "warning" },
    { label: "ESTIMATED FUEL WASTED", value: "8.8", unit: "Litres", status: "danger" },
    { label: "LONGEST IDLE", value: "44m", subtext: "Odhav Ring Road", status: "danger" }
  ];

  const timelineItems = events.map((evt) => ({
    id: evt.id,
    title: evt.eventNumber,
    subtitle: `${evt.date} · ${evt.ignitionState}`,
    startTime: evt.startTime,
    endTime: evt.endTime,
    duration: evt.duration,
    durationStatus: (parseInt(evt.duration) > 30 ? "danger" : "warning") as "danger" | "warning",
    location: evt.location,
    tags: [
      { label: "State", value: evt.ignitionState },
      { label: "Battery", value: evt.batteryVoltage }
    ]
  }));

  return (
    <div className="space-y-6">
      <ReportBreadcrumbs
        items={[
          { label: "Fleet Activity", href: "/reports/idle-summary" },
          { label: "Idle Summary", href: "/reports/idle-summary" },
          { label: `All Idle Events — ${vehicleId}` }
        ]}
        backHref="/reports/idle-summary"
        backLabel="Back to Idle Summary"
      />

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="space-y-1">
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            All Idle Events — {vehicleId}
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Complete engine idle event history for {vehicleId} during the selected reporting period.
          </p>
        </div>
      </div>

      <ReportKpiCards metrics={kpis} />

      <ReportExportToolbar
        totalCount={events.length}
        reportTitle={`Idle_Events_${vehicleId}`}
        dataToExport={events}
      />

      <VehicleEventTimeline events={timelineItems} />
    </div>
  );
};

export default IdleEventViewPage;
