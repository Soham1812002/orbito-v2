import React from "react";
import { ReportKpiMetric } from "@/types/reports.types";

interface ReportKpiCardsProps {
  metrics: ReportKpiMetric[];
}

export const ReportKpiCards: React.FC<ReportKpiCardsProps> = ({ metrics }) => {
  if (!metrics || metrics.length === 0) return null;

  return (
    <div
      className={`grid gap-3.5 ${
        metrics.length <= 4
          ? "grid-cols-2 lg:grid-cols-4"
          : metrics.length === 5
          ? "grid-cols-2 md:grid-cols-3 lg:grid-cols-5"
          : "grid-cols-2 md:grid-cols-3 lg:grid-cols-6"
      }`}
    >
      {metrics.map((metric, idx) => {
        const statusColors = {
          success: "text-emerald-600 dark:text-emerald-400 border-emerald-500/20 bg-emerald-500/5",
          warning: "text-amber-600 dark:text-amber-400 border-amber-500/20 bg-amber-500/5",
          danger: "text-rose-600 dark:text-rose-400 border-rose-500/20 bg-rose-500/5",
          info: "text-blue-600 dark:text-blue-400 border-blue-500/20 bg-blue-500/5"
        };

        const activeStatusClass = metric.status ? statusColors[metric.status] : "text-slate-700 dark:text-slate-300";

        return (
          <div
            key={idx}
            className="panel-card flex flex-col justify-between !p-4 border border-slate-200/80 dark:border-[#1D293D] hover:border-blue-500/40 transition-colors"
          >
            {/* Header label & status dot */}
            <div className="flex items-center justify-between gap-2 mb-2">
              <span className="text-[10px] font-bold tracking-wider uppercase text-slate-500 dark:text-slate-400">
                {metric.label}
              </span>
              {metric.status && (
                <span
                  className={`h-2 w-2 rounded-full ${
                    metric.status === "success"
                      ? "bg-emerald-500 shadow-xs shadow-emerald-500/50"
                      : metric.status === "warning"
                      ? "bg-amber-500"
                      : metric.status === "danger"
                      ? "bg-rose-500 animate-pulse"
                      : "bg-blue-500"
                  }`}
                />
              )}
            </div>

            {/* Metric Value */}
            <div className="flex items-baseline gap-1.5 my-0.5">
              <span className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
                {metric.value}
              </span>
              {metric.unit && (
                <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase">
                  {metric.unit}
                </span>
              )}
            </div>

            {/* Optional subtext */}
            {metric.subtext && (
              <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate mt-1">
                {metric.subtext}
              </p>
            )}
          </div>
        );
      })}
    </div>
  );
};
