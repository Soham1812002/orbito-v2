import React from "react";
import { Loader2 } from "lucide-react";

export interface PageLoadingFallbackProps {
  message?: string;
  variant?: "full" | "page";
}

export const PageLoadingFallback: React.FC<PageLoadingFallbackProps> = ({
  message = "Loading view...",
  variant = "page"
}) => {
  if (variant === "full") {
    return (
      <div
        role="status"
        aria-live="polite"
        className="flex h-screen w-screen items-center justify-center bg-slate-50 dark:bg-[#070B14] transition-colors"
      >
        <div className="flex flex-col items-center gap-3">
          <div className="relative flex items-center justify-center">
            <div className="h-10 w-10 animate-spin rounded-full border-3 border-[#2563EB]/20 border-t-[#2563EB] dark:border-blue-400/20 dark:border-t-blue-400" />
            <Loader2 className="absolute h-5 w-5 animate-pulse text-[#2563EB] dark:text-blue-400" />
          </div>
          <p className="text-xs font-semibold tracking-wide text-slate-500 dark:text-slate-400 animate-pulse">
            {message}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div
      role="status"
      aria-live="polite"
      className="w-full space-y-6 py-6 animate-in fade-in duration-150"
    >
      {/* Skeleton Header */}
      <div className="space-y-2">
        <div className="h-4 w-32 rounded bg-slate-200 dark:bg-slate-800/80 animate-pulse" />
        <div className="h-8 w-64 rounded-lg bg-slate-200 dark:bg-slate-800/80 animate-pulse" />
        <div className="h-3.5 w-96 max-w-full rounded bg-slate-100 dark:bg-slate-800/50 animate-pulse" />
      </div>

      {/* Skeleton KPI / Metric Row */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5">
        {[1, 2, 3, 4, 5].map((i) => (
          <div
            key={i}
            className="h-24 rounded-xl border border-slate-200/80 dark:border-[#1D293D] bg-white/70 dark:bg-[#121B2E]/60 p-4 space-y-2.5 animate-pulse"
          >
            <div className="h-3 w-20 rounded bg-slate-200 dark:bg-slate-800" />
            <div className="h-6 w-16 rounded bg-slate-300 dark:bg-slate-700" />
          </div>
        ))}
      </div>

      {/* Skeleton Main Panel Table */}
      <div className="rounded-2xl border border-slate-200/80 dark:border-[#1D293D] bg-white dark:bg-[#0F172B] p-6 space-y-4 shadow-xs">
        <div className="flex items-center justify-between pb-2">
          <div className="h-5 w-40 rounded bg-slate-200 dark:bg-slate-800 animate-pulse" />
          <div className="flex items-center gap-2">
            <Loader2 className="h-4 w-4 animate-spin text-[#2563EB] dark:text-blue-400" />
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
              {message}
            </span>
          </div>
        </div>
        <div className="space-y-3">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div
              key={i}
              className="h-10 w-full rounded-lg bg-slate-100 dark:bg-[#121B2E]/50 animate-pulse"
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default PageLoadingFallback;
