import React from "react";
import { Link } from "react-router-dom";
import { ChevronRight, ArrowLeft } from "lucide-react";
import { AppIcon } from "../../common/icons/AppIcon";

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

export interface PageHeaderProps {
  title: string;
  badge?: string | number;
  badgeVariant?: "default" | "alert" | "cyan" | "success";
  description?: string;
  breadcrumbs?: BreadcrumbItem[];
  backHref?: string;
  backLabel?: string;
  actions?: React.ReactNode;
  className?: string;
}

export const PageHeader: React.FC<PageHeaderProps> = ({
  title,
  badge,
  badgeVariant = "default",
  description,
  breadcrumbs,
  backHref,
  backLabel = "Back",
  actions,
  className = ""
}) => {
  const getBadgeClass = () => {
    switch (badgeVariant) {
      case "alert":
        return "badge-alert";
      case "cyan":
        return "badge-cyan";
      case "success":
        return "badge-pill bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20";
      default:
        return "badge-counter";
    }
  };

  return (
    <div className={`mb-6 space-y-3 ${className}`}>
      {/* 1. Breadcrumbs / Mobile Back Link */}
      {breadcrumbs && breadcrumbs.length > 0 && (
        <nav aria-label="Breadcrumbs" className="flex items-center">
          {/* Mobile Back Link (<640px) */}
          <div className="sm:hidden">
            {breadcrumbs.length > 1 && (
              <Link
                to={breadcrumbs[breadcrumbs.length - 2].href || "/"}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-[#2563EB] dark:text-[#94A3B8] transition-colors focus-ring rounded"
              >
                <AppIcon icon={ArrowLeft} size="xs" />
                <span>{backLabel || breadcrumbs[breadcrumbs.length - 2].label}</span>
              </Link>
            )}
          </div>

          {/* Desktop Breadcrumbs (>=640px) */}
          <ol className="hidden sm:flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-[#7B7F8A]">
            {breadcrumbs.map((crumb, idx) => {
              const isLast = idx === breadcrumbs.length - 1;

              return (
                <li key={idx} className="flex items-center gap-1.5">
                  {crumb.href && !isLast ? (
                    <Link
                      to={crumb.href}
                      className="hover:text-slate-900 dark:hover:text-white transition-colors focus-ring rounded"
                    >
                      {crumb.label}
                    </Link>
                  ) : (
                    <span className={isLast ? "text-slate-700 dark:text-slate-300" : ""}>
                      {crumb.label}
                    </span>
                  )}
                  {!isLast && (
                    <ChevronRight className="h-3 w-3 text-slate-400 dark:text-slate-600 shrink-0" aria-hidden="true" />
                  )}
                </li>
              );
            })}
          </ol>
        </nav>
      )}

      {/* Explicit back button if specified without breadcrumbs */}
      {backHref && (!breadcrumbs || breadcrumbs.length === 0) && (
        <Link
          to={backHref}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-[#2563EB] dark:text-[#94A3B8] transition-colors focus-ring rounded"
        >
          <AppIcon icon={ArrowLeft} size="xs" />
          <span>{backLabel}</span>
        </Link>
      )}

      {/* 2. Main Title Row & Actions Toolbar */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="space-y-1">
          <div className="flex flex-wrap items-center gap-2.5">
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
              {title}
            </h1>
            {badge !== undefined && (
              <span className={getBadgeClass()}>{badge}</span>
            )}
          </div>

          {description && (
            <p className="text-xs sm:text-sm text-slate-500 dark:text-[#94A3B8] max-w-3xl leading-relaxed">
              {description}
            </p>
          )}
        </div>

        {/* Action Toolbar */}
        {actions && (
          <div className="toolbar-responsive shrink-0">
            {actions}
          </div>
        )}
      </div>
    </div>
  );
};
