import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Navigation, Clock, MapPin, ArrowLeft, CheckCircle2 } from "lucide-react";
import { ReportBreadcrumbs } from "@/pages/reports/components/ReportBreadcrumbs";
import { ReportKpiCards } from "@/pages/reports/components/ReportKpiCards";
import { ReportExportToolbar } from "@/pages/reports/components/ReportExportToolbar";
import { reportsApi } from "@/api/reports.api";
import { TripDetailEvent, ReportKpiMetric } from "@/types/reports.types";

export const TripDetailsPage: React.FC = () => {
  const { vehicleId = "GJ 01 TX 2045" } = useParams<{ vehicleId: string }>();
  const [trips, setTrips] = useState<TripDetailEvent[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDetails = async () => {
      setIsLoading(true);
      try {
        const data = await reportsApi.getVehicleTripDetails(vehicleId);
        setTrips(data.trips);
      } finally {
        setIsLoading(false);
      }
    };
    fetchDetails();
  }, [vehicleId]);

  const kpis: ReportKpiMetric[] = [
    { label: "RECORDED TRIPS", value: trips.length, unit: "TRIPS", status: "info" },
    { label: "TOTAL DISTANCE", value: "184.6", unit: "km", status: "success" },
    { label: "TOTAL DRIVE TIME", value: "4h 52m", status: "warning" },
    { label: "AVERAGE SPEED", value: "46", unit: "km/h", status: "info" },
    { label: "TRIP ALERTS", value: "2", unit: "ALERTS", status: "danger" }
  ];

  return (
    <div className="space-y-6">
      <ReportBreadcrumbs
        items={[
          { label: "Fleet Activity", href: "/reports/trip-summary" },
          { label: "Trip Summary", href: "/reports/trip-summary" },
          { label: vehicleId }
        ]}
        backHref="/reports/trip-summary"
        backLabel="Back to Trip Summary"
      />

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="space-y-1">
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            Vehicle Trip History {vehicleId && <span className="text-slate-400 font-normal">({vehicleId})</span>}
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            A complete record of completed trips, duration, route milestones and speed performance for this vehicle.
          </p>
        </div>
      </div>

      <ReportKpiCards metrics={kpis} />

      <ReportExportToolbar
        totalCount={trips.length}
        reportTitle={`Trip_History_${vehicleId}`}
        dataToExport={trips}
      />

      {/* Chronological Trip Cards */}
      <div className="space-y-3.5">
        {trips.map((trip, idx) => (
          <div
            key={trip.tripId}
            className="panel-card !p-5 border border-slate-200/80 dark:border-[#1D293D] hover:border-blue-500/40 transition-colors"
          >
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              {/* Trip Index, Title & Time */}
              <div className="flex items-start gap-3.5 min-w-0 flex-1">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 font-mono text-xs font-bold border border-blue-200 dark:border-blue-800/60">
                  {String(idx + 1).padStart(2, "0")}
                </div>

                <div className="space-y-1.5 min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2.5">
                    <span className="font-mono text-xs font-bold text-slate-900 dark:text-white">
                      {trip.tripId}
                    </span>
                    <span className="text-slate-300 dark:text-slate-700">•</span>
                    <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                      {trip.date}
                    </span>
                    <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/60">
                      <CheckCircle2 className="h-3 w-3" />
                      {trip.status}
                    </span>
                  </div>

                  {/* Route: Start -> End */}
                  <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-xs text-slate-700 dark:text-slate-300">
                    <div className="flex items-center gap-1.5 truncate">
                      <MapPin className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
                      <span className="truncate">{trip.startLocation}</span>
                    </div>
                    <span className="hidden sm:inline text-slate-400">→</span>
                    <div className="flex items-center gap-1.5 truncate">
                      <MapPin className="h-3.5 w-3.5 text-rose-500 shrink-0" />
                      <span className="truncate">{trip.endLocation}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Trip Telemetry Metrics */}
              <div className="flex flex-wrap items-center justify-between sm:justify-end w-full md:w-auto gap-4 pt-3 md:pt-0 border-t md:border-t-0 border-slate-100 dark:border-slate-800/60 font-mono">
                {/* Distance */}
                <div className="text-right">
                  <div className="text-[10px] text-slate-400 uppercase font-sans">Distance</div>
                  <div className="text-sm font-bold text-slate-900 dark:text-white">
                    {trip.distanceKm} <span className="text-[10px] font-normal text-slate-400">km</span>
                  </div>
                </div>

                {/* Duration */}
                <div className="text-right">
                  <div className="text-[10px] text-slate-400 uppercase font-sans">Duration</div>
                  <div className="text-sm font-bold text-slate-900 dark:text-white">
                    {trip.duration}
                  </div>
                </div>

                {/* Drive / Idle */}
                <div className="text-right">
                  <div className="text-[10px] text-slate-400 uppercase font-sans">Drive / Idle</div>
                  <div className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                    {trip.driveTime} <span className="text-amber-500">· {trip.idleTime}</span>
                  </div>
                </div>

                {/* Avg Speed */}
                <div className="text-right">
                  <div className="text-[10px] text-slate-400 uppercase font-sans">Avg Speed</div>
                  <div className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                    {trip.avgSpeedKmH} km/h
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TripDetailsPage;
