import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { ReportBreadcrumbs } from "@/pages/reports/components/ReportBreadcrumbs";
import { ReportKpiCards } from "@/pages/reports/components/ReportKpiCards";
import { ReportExportToolbar } from "@/pages/reports/components/ReportExportToolbar";
import { VehicleEventTimeline } from "@/pages/reports/components/VehicleEventTimeline";
import { reportsApi } from "@/api/reports.api";
import { StoppageEvent, ReportKpiMetric } from "@/types/reports.types";

export const StoppageEventViewPage: React.FC = () => {
  const { vehicleId = "GJ 01 RT 4821" } = useParams<{ vehicleId: string }>();
  const [events, setEvents] = useState<StoppageEvent[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      setIsLoading(true);
      try {
        const data = await reportsApi.getStoppageEvents(vehicleId);
        setEvents(data.events);
      } finally {
        setIsLoading(false);
      }
    };
    fetchEvents();
  }, [vehicleId]);

  const kpis: ReportKpiMetric[] = [
    { label: "RECORDED EVENTS", value: events.length || 18, unit: "EVENTS", status: "warning" },
    { label: "TOTAL STOPPAGE TIME", value: "06h 42m", status: "danger" },
    { label: "LONGEST EVENT", value: "51m", subtext: "Odhav Ring Road", status: "warning" },
    { label: "DRIVER", value: "Ramesh Patel", subtext: "Ahmedabad Central", status: "info" }
  ];

  const timelineItems = events.map((evt) => ({
    id: evt.id,
    title: evt.eventNumber,
    subtitle: `${evt.date} · Ignition ${evt.ignitionState}`,
    startTime: evt.startTime,
    endTime: evt.endTime,
    duration: evt.duration,
    durationStatus: (parseInt(evt.duration) > 30 ? "danger" : "warning") as "danger" | "warning",
    location: evt.location,
    coordinates: evt.coordinates,
    nearbyPoi: evt.nearbyPoi,
    tags: [
      { label: "Ignition", value: evt.ignitionState },
      { label: "Duration", value: evt.duration }
    ]
  }));

  return (
    <div className="space-y-6">
      <ReportBreadcrumbs
        items={[
          { label: "Fleet Activity", href: "/reports/stoppage-summary" },
          { label: "Stoppage Summary", href: "/reports/stoppage-summary" },
          { label: `All Stoppage Events — ${vehicleId}` }
        ]}
        backHref="/reports/stoppage-summary"
        backLabel="Back to Stoppage Summary"
      />

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="space-y-1">
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            All Stoppage Events — {vehicleId}
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Complete stoppage event history for {vehicleId} during the selected reporting period.
          </p>
        </div>
      </div>

      <ReportKpiCards metrics={kpis} />

      <ReportExportToolbar
        totalCount={events.length}
        reportTitle={`Stoppage_Events_${vehicleId}`}
        dataToExport={events}
      />

      <VehicleEventTimeline events={timelineItems} />
    </div>
  );
};

export default StoppageEventViewPage;
