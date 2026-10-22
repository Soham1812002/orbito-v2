import React from "react";
import { Clock, MapPin, Navigation, AlertCircle } from "lucide-react";

export interface TimelineEventItem {
  id: string;
  title: string;
  subtitle?: string;
  startTime: string;
  endTime?: string;
  duration: string;
  durationStatus?: "success" | "warning" | "danger" | "info";
  location: string;
  coordinates?: string;
  nearbyPoi?: string;
  tags?: { label: string; value: string | number }[];
}

interface VehicleEventTimelineProps {
  events: TimelineEventItem[];
  emptyMessage?: string;
}

export const VehicleEventTimeline: React.FC<VehicleEventTimelineProps> = ({
  events,
  emptyMessage = "No recorded events for this reporting period."
}) => {
  if (!events || events.length === 0) {
    return (
      <div className="panel-card flex flex-col items-center justify-center p-12 text-center text-slate-400">
        <AlertCircle className="h-8 w-8 mb-2 text-slate-300 dark:text-slate-600" />
        <p className="text-sm font-medium">{emptyMessage}</p>
      </div>
    );
  }

  const durationClasses = {
    success: "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800/60",
    warning: "bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300 border-amber-200 dark:border-amber-800/60",
    danger: "bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-300 border-rose-200 dark:border-rose-800/60",
    info: "bg-blue-50 text-blue-700 dark:bg-blue-950/40 dark:text-blue-300 border-blue-200 dark:border-blue-800/60"
  };

  return (
    <div className="space-y-3">
      {events.map((evt, idx) => {
        const statusClass = evt.durationStatus ? durationClasses[evt.durationStatus] : durationClasses.info;

        return (
          <div
            key={evt.id || idx}
            className="panel-card !p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border border-slate-200/80 dark:border-[#1D293D] hover:border-blue-500/30 transition-colors"
          >
            {/* Left: Event sequence & details */}
            <div className="flex items-start gap-3.5 flex-1 min-w-0">
              {/* Event step indicator */}
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-mono text-xs font-bold border border-slate-200 dark:border-slate-700">
                {String(idx + 1).padStart(2, "0")}
              </div>

              {/* Title & Location details */}
              <div className="space-y-1 min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h4 className="text-sm font-semibold text-slate-900 dark:text-white truncate">
                    {evt.title}
                  </h4>
                  {evt.subtitle && (
                    <span className="text-xs text-slate-500 dark:text-slate-400">
                      · {evt.subtitle}
                    </span>
                  )}
                </div>

                {/* Location address */}
                <div className="flex items-center gap-1.5 text-xs text-slate-600 dark:text-slate-300">
                  <MapPin className="h-3.5 w-3.5 text-blue-500 shrink-0" />
                  <span className="truncate">{evt.location}</span>
                </div>

                {/* Nearby POI / Coordinates */}
                {(evt.nearbyPoi || evt.coordinates) && (
                  <div className="flex flex-wrap items-center gap-2 text-[11px] text-slate-400 dark:text-slate-500">
                    {evt.nearbyPoi && <span>POI: {evt.nearbyPoi}</span>}
                    {evt.nearbyPoi && evt.coordinates && <span>•</span>}
                    {evt.coordinates && <span className="font-mono">{evt.coordinates}</span>}
                  </div>
                )}
              </div>
            </div>

            {/* Right: Timestamps & Duration capsule */}
            <div className="flex sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto gap-2 border-t sm:border-t-0 pt-2 sm:pt-0 border-slate-100 dark:border-slate-800/60 shrink-0">
              {/* Time window */}
              <div className="flex items-center gap-1 text-xs font-mono font-medium text-slate-600 dark:text-slate-300">
                <Clock className="h-3.5 w-3.5 text-slate-400" />
                <span>{evt.startTime}</span>
                {evt.endTime && <span>— {evt.endTime}</span>}
              </div>

              {/* Duration badge */}
              <div className="flex items-center gap-2">
                <span
                  className={`px-2.5 py-0.5 rounded-full text-xs font-bold border font-mono ${statusClass}`}
                >
                  {evt.duration}
                </span>
              </div>

              {/* Custom tags */}
              {evt.tags && evt.tags.length > 0 && (
                <div className="hidden lg:flex items-center gap-2 mt-1">
                  {evt.tags.map((t, i) => (
                    <span
                      key={i}
                      className="text-[10px] px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400"
                    >
                      {t.label}: <strong className="font-semibold text-slate-800 dark:text-slate-200">{t.value}</strong>
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};
