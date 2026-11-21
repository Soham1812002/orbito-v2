import React from "react";

export type StatusVariant =
  | "active"
  | "inactive"
  | "paused"
  | "archived"
  | "on_duty"
  | "standby"
  | "off_duty"
  | "critical"
  | "warning"
  | "info"
  | "success"
  | "due_soon"
  | "overdue"
  | "renewed"
  | "upcoming"
  | "scheduled"
  | boolean;

interface StatusBadgeProps {
  status: StatusVariant;
  label?: string;
  className?: string;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, label, className = "" }) => {
  let dotClass = "bg-slate-400";
  let textClass = "text-slate-500 dark:text-slate-400";
  let defaultLabel = "Inactive";

  if (status === true || status === "active" || status === "on_duty" || status === "success") {
    dotClass = "bg-emerald-500 shadow-xs";
    textClass = "text-emerald-600 dark:text-emerald-400";
    defaultLabel = status === "on_duty" ? "On Duty" : "Active";
  } else if (status === "standby" || status === "warning" || status === "paused" || status === "due_soon") {
    dotClass = "bg-amber-500 shadow-xs";
    textClass = "text-amber-600 dark:text-amber-400";
    defaultLabel = status === "standby" ? "On Standby" : status === "paused" ? "Paused" : status === "due_soon" ? "Due Soon" : "Warning";
  } else if (status === "critical" || status === "overdue") {
    dotClass = "bg-rose-500 shadow-xs";
    textClass = "text-rose-600 dark:text-rose-400";
    defaultLabel = status === "overdue" ? "Overdue" : "Critical";
  } else if (status === "renewed" || status === "info" || status === "upcoming") {
    dotClass = "bg-blue-500 shadow-xs";
    textClass = "text-blue-600 dark:text-blue-400";
    defaultLabel = status === "renewed" ? "Renewed" : status === "upcoming" ? "Upcoming" : "Info";
  } else if (status === "archived" || status === "scheduled") {
    dotClass = "bg-slate-400";
    textClass = "text-slate-500 dark:text-slate-400";
    defaultLabel = status === "scheduled" ? "Scheduled" : "Archived";
  } else if (status === "off_duty") {
    dotClass = "bg-slate-400";
    textClass = "text-slate-500 dark:text-slate-400";
    defaultLabel = "Off Duty";
  }

  return (
    <div className={`h-full flex items-center gap-1.5 font-medium text-xs ${className}`}>
      <span className={`w-2 h-2 rounded-full shrink-0 ${dotClass}`} />
      <span className={textClass}>{label || defaultLabel}</span>
    </div>
  );
};

export default StatusBadge;
