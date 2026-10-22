import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Snowflake, CheckCircle2 } from "lucide-react";
import { ReportBreadcrumbs } from "@/pages/reports/components/ReportBreadcrumbs";
import { ReportKpiCards } from "@/pages/reports/components/ReportKpiCards";
import { ReportExportToolbar } from "@/pages/reports/components/ReportExportToolbar";
import { VehicleEventTimeline } from "@/pages/reports/components/VehicleEventTimeline";
import { reportsApi } from "@/api/reports.api";
import { AcEvent, ReportKpiMetric } from "@/types/reports.types";

export const AcEventViewPage: React.FC = () => {
  const { vehicleId = "GJ 01 RT 4821" } = useParams<{ vehicleId: string }>();
  const [events, setEvents] = useState<AcEvent[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      setIsLoading(true);
      try {
        const data = await reportsApi.getAcEvents(vehicleId);
        setEvents(data.events);
      } finally {
        setIsLoading(false);
      }
    };
    fetchEvents();
  }, [vehicleId]);

  const kpis: ReportKpiMetric[] = [
    { label: "CURRENT STATUS", value: "Active since 20:47", unit: "AC ON", status: "success" },
    { label: "AC RUNTIME TODAY", value: "05h 21m", status: "info" },
    { label: "ACTIVATION CYCLES", value: "3 cycles", status: "warning" },
    { label: "IGNITION OVERLAP", value: "5h 54m", subtext: "100% matched", status: "success" }
  ];

  const timelineItems = events.map((evt, idx) => ({
    id: evt.id,
    title: `AC Cycle ${String(idx + 1).padStart(2, "0")} · Status ${evt.acStatus}`,
    subtitle: `Ignition ${evt.ignitionStatus} · Overlap ${evt.overlapDuration}`,
    startTime: evt.eventTime,
    duration: evt.runtime,
    durationStatus: (evt.acStatus === "ON" ? "success" : "info") as "success" | "info",
    location: evt.location,
    tags: [
      { label: "AC State", value: evt.acStatus },
      { label: "Ignition", value: evt.ignitionStatus }
    ]
  }));

  return (
    <div className="space-y-6">
      <ReportBreadcrumbs
        items={[
          { label: "Telemetry & Sensors", href: "/reports/ac-summary" },
          { label: "AC Summary", href: "/reports/ac-summary" },
          { label: `AC Events — ${vehicleId}` }
        ]}
        backHref="/reports/ac-summary"
        backLabel="Back to AC Summary"
      />

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="space-y-1">
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            Air Conditioner Activity — {vehicleId}
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            AC utilization summary, runtime logs, and ignition overlap records for {vehicleId}.
          </p>
        </div>
      </div>

      <ReportKpiCards metrics={kpis} />

      <ReportExportToolbar
        totalCount={events.length}
        reportTitle={`AC_Events_${vehicleId}`}
        dataToExport={events}
      />

      <VehicleEventTimeline events={timelineItems} />
    </div>
  );
};

export default AcEventViewPage;
