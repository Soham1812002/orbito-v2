import React from "react";
import type { ColDef } from "ag-grid-community";
import { Check, X } from "lucide-react";
import { MaintenanceReminder } from "./reminders.types";

export const getReminderStatusColDefs = (): ColDef<MaintenanceReminder>[] => [
  {
    headerName: "COMPANY",
    field: "companyName",
    minWidth: 150,
    flex: 1.2
  },
  {
    headerName: "BRANCH",
    field: "branchName",
    minWidth: 140,
    flex: 1
  },
  {
    headerName: "VEHICLE",
    field: "vehiclePlate",
    minWidth: 130,
    flex: 1,
    cellClass: "font-mono font-medium text-slate-900 dark:text-slate-100"
  },
  {
    headerName: "MAINTENANCE TYPE",
    field: "reminderType",
    minWidth: 140,
    flex: 1.1
  },
  {
    headerName: "DESCRIPTION",
    field: "description",
    minWidth: 200,
    flex: 1.5,
    valueGetter: (params) => params.data?.description || params.data?.reminderName || "—"
  },
  {
    headerName: "LAST SERVICE",
    field: "lastServiceDate",
    minWidth: 120,
    flex: 1,
    cellClass: "font-mono",
    valueFormatter: (params) => params.value || "—"
  },
  {
    headerName: "LAST MILEAGE",
    field: "lastMileage",
    minWidth: 120,
    flex: 1,
    cellClass: "font-mono",
    valueFormatter: (params) => (params.value ? `${Number(params.value).toLocaleString()} km` : "—")
  },
  {
    headerName: "NEXT MILEAGE",
    field: "nextMileage",
    minWidth: 120,
    flex: 1,
    cellRenderer: (params: any) => {
      const isOverdue = params.data?.status === "Overdue";
      const val = params.value ? `${Number(params.value).toLocaleString()} km` : "—";
      return (
        <span className={`font-mono font-medium ${isOverdue ? "text-red-600 dark:text-red-400" : ""}`}>
          {val}
        </span>
      );
    }
  },
  {
    headerName: "NEXT DAYS",
    field: "nextDays",
    minWidth: 120,
    flex: 1,
    cellRenderer: (params: any) => {
      const isOverdue = params.data?.status === "Overdue";
      return (
        <span className={`font-mono font-medium ${isOverdue ? "text-red-600 dark:text-red-400" : ""}`}>
          {params.value || "—"}
        </span>
      );
    }
  },
  {
    headerName: "NOTIFICATION",
    minWidth: 130,
    flex: 1,
    valueGetter: (params) => {
      const channels = [];
      if (params.data?.notifyEmail) channels.push("Email");
      if (params.data?.notifySms) channels.push("SMS");
      if (params.data?.notifyApp) channels.push("App");
      return channels.length ? channels.join(" and ") : "None";
    }
  },
  {
    headerName: "STATUS",
    field: "status",
    minWidth: 120,
    flex: 0.9,
    cellRenderer: (params: any) => {
      const status = params.value;
      if (status === "Upcoming") {
        return (
          <div className="h-full flex items-center gap-1.5 font-medium text-xs text-blue-600 dark:text-blue-400">
            <span className="h-2 w-2 rounded-full bg-blue-500 shrink-0 shadow-xs" />
            Upcoming
          </div>
        );
      }
      if (status === "Scheduled") {
        return (
          <div className="h-full flex items-center gap-1.5 font-medium text-xs text-slate-600 dark:text-slate-400">
            <span className="h-2 w-2 rounded-full bg-slate-400 shrink-0" />
            Scheduled
          </div>
        );
      }
      if (status === "Overdue") {
        return (
          <div className="h-full flex items-center gap-1.5 font-medium text-xs text-rose-600 dark:text-rose-400">
            <span className="h-2 w-2 rounded-full bg-rose-500 shrink-0 animate-pulse" />
            Overdue
          </div>
        );
      }
      return (
        <div className="h-full flex items-center gap-1.5 font-medium text-xs text-emerald-600 dark:text-emerald-400">
          <span className="h-2 w-2 rounded-full bg-emerald-500 shrink-0" />
          {status}
        </div>
      );
    }
  }
];

export const getReminderOverviewColDefs = (): ColDef<MaintenanceReminder>[] => [
  {
    headerName: "COMPANY",
    field: "companyName",
    minWidth: 150,
    flex: 1.2
  },
  {
    headerName: "BRANCH",
    field: "branchName",
    minWidth: 140,
    flex: 1
  },
  {
    headerName: "VEHICLE",
    field: "vehiclePlate",
    minWidth: 130,
    flex: 1,
    cellClass: "font-mono font-medium text-slate-900 dark:text-slate-100"
  },
  {
    headerName: "MAINTENANCE TYPE",
    field: "reminderType",
    minWidth: 140,
    flex: 1.1
  },
  {
    headerName: "EVERY (X) MONTH",
    field: "repeatIntervalMonths",
    minWidth: 130,
    flex: 1,
    valueFormatter: (params) => (params.value ? `${params.value} months` : "—")
  },
  {
    headerName: "EVERY (X) DISTANCE",
    field: "repeatIntervalKm",
    minWidth: 140,
    flex: 1,
    cellClass: "font-mono",
    valueFormatter: (params) => (params.value ? `${Number(params.value).toLocaleString()} km` : "—")
  },
  {
    headerName: "NOTIFY BEFORE (X) DAYS",
    field: "notifyBeforeDays",
    minWidth: 150,
    flex: 1,
    valueFormatter: (params) => (params.value ? `${params.value} days` : "—")
  },
  {
    headerName: "NOTIFY BEFORE (X) DISTANCE",
    field: "notifyBeforeKm",
    minWidth: 160,
    flex: 1,
    cellClass: "font-mono",
    valueFormatter: (params) => (params.value ? `${Number(params.value).toLocaleString()} km` : "—")
  },
  {
    headerName: "SMS",
    field: "notifySms",
    minWidth: 80,
    cellRenderer: (params: any) =>
      params.value ? (
        <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400 inline" />
      ) : (
        <X className="w-4 h-4 text-slate-400 inline" />
      )
  },
  {
    headerName: "EMAIL",
    field: "notifyEmail",
    minWidth: 80,
    cellRenderer: (params: any) =>
      params.value ? (
        <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400 inline" />
      ) : (
        <X className="w-4 h-4 text-slate-400 inline" />
      )
  },
  {
    headerName: "MOBILE APP",
    field: "notifyApp",
    minWidth: 95,
    cellRenderer: (params: any) =>
      params.value ? (
        <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400 inline" />
      ) : (
        <X className="w-4 h-4 text-slate-400 inline" />
      )
  }
];
