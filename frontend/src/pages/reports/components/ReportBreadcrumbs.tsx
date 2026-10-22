import React from "react";
import { Link } from "react-router-dom";
import { ChevronRight, ArrowLeft } from "lucide-react";

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface ReportBreadcrumbsProps {
  items: BreadcrumbItem[];
  backHref?: string;
  backLabel?: string;
}

export const ReportBreadcrumbs: React.FC<ReportBreadcrumbsProps> = ({
  items,
  backHref,
  backLabel = "Back to Overview"
}) => {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
      {/* Breadcrumb path */}
      <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400">
        <Link
          to="/reports"
          className="font-semibold text-blue-600 dark:text-blue-400 hover:underline tracking-wide uppercase text-[11px]"
        >
          REPORTS
        </Link>
        {items.map((item, index) => (
          <React.Fragment key={index}>
            <ChevronRight className="h-3 w-3 text-slate-400" />
            {item.href ? (
              <Link
                to={item.href}
                className="hover:text-slate-900 dark:hover:text-white transition-colors uppercase tracking-wider text-[11px]"
              >
                {item.label}
              </Link>
            ) : (
              <span className="font-medium text-slate-800 dark:text-slate-200 uppercase tracking-wider text-[11px]">
                {item.label}
              </span>
            )}
          </React.Fragment>
        ))}
      </nav>

      {/* Optional quick back button for event drilldown views */}
      {backHref && (
        <Link
          to={backHref}
          className="inline-flex items-center gap-1.5 text-xs font-medium text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          <span>{backLabel}</span>
        </Link>
      )}
    </div>
  );
};
