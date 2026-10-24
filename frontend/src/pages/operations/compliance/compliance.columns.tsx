import React from "react";
import { ColDef, ICellRendererParams } from "ag-grid-community";
import { ComplianceReminder } from "./compliance.types";
import {
  FileText,
  Truck,
  User,
  Warehouse,
  Mail,
  Smartphone,
  Bell,
  Clock,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Edit3,
  Trash2
} from "lucide-react";
import dayjs from "dayjs";

export const getComplianceColumns = (handlers: {
  onEdit: (rem: ComplianceReminder) => void;
  onDelete: (rem: ComplianceReminder) => void;
}): ColDef<ComplianceReminder>[] => [
  {
    headerName: "ENTITY",
    field: "entityIdentifier",
    width: 200,
    pinned: "left",
    cellRenderer: (params: ICellRendererParams<ComplianceReminder>) => {
      const rem = params.data;
      if (!rem) return null;
      const typeIcons: Record<string, any> = {
        vehicle: Truck,
        driver: User,
        depot: Warehouse
      };
      const Icon = typeIcons[rem.entityType] || Truck;
      return (
        <div className="flex items-center gap-1.5 py-1">
          <Icon className="w-3.5 h-3.5 text-blue-500 shrink-0" />
          <div className="truncate">
            <span className={`text-xs font-bold text-slate-900 dark:text-white truncate ${rem.entityType === "vehicle" ? "font-mono" : ""}`}>
              {rem.entityIdentifier}
            </span>
            <p className="text-[10px] text-slate-400 uppercase tracking-wider">{rem.entityType}</p>
          </div>
        </div>
      );
    }
  },
  {
    headerName: "REMINDER CATEGORY & DOC #",
    field: "reminderCategory",
    width: 260,
    cellRenderer: (params: ICellRendererParams<ComplianceReminder>) => {
      const rem = params.data;
      if (!rem) return null;
      return (
        <div className="leading-tight py-1">
          <p className="text-xs font-semibold text-slate-900 dark:text-white truncate">
            {rem.reminderCategory}
          </p>
          {rem.documentNumber && (
            <p className="text-[11px] font-mono text-slate-500 truncate mt-0.5">
              Doc: {rem.documentNumber}
            </p>
          )}
        </div>
      );
    }
  },
  {
    headerName: "EXPIRY DATE",
    field: "expiryDate",
    width: 130,
    cellRenderer: (params: ICellRendererParams<ComplianceReminder>) => {
      const rem = params.data;
      if (!rem) return null;
      return (
        <div className="text-xs font-mono py-1 text-slate-800 dark:text-slate-200">
          {dayjs(rem.expiryDate).format("DD MMM YYYY")}
        </div>
      );
    }
  },
  {
    headerName: "REMAINING / URGENCY",
    width: 170,
    cellRenderer: (params: ICellRendererParams<ComplianceReminder>) => {
      const rem = params.data;
      if (!rem) return null;
      const now = dayjs();
      const expiry = dayjs(rem.expiryDate);
      const diffDays = expiry.diff(now, "day");

      if (diffDays < 0) {
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-400 border border-rose-200 dark:border-rose-900/50">
            <XCircle className="w-3 h-3" />
            Overdue ({Math.abs(diffDays)}d)
          </span>
        );
      } else if (diffDays <= rem.notifyBeforeDays) {
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400 border border-amber-200 dark:border-amber-900/50">
            <AlertTriangle className="w-3 h-3" />
            Due in {diffDays} days
          </span>
        );
      } else {
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400">
            <CheckCircle2 className="w-3 h-3" />
            Valid ({diffDays}d)
          </span>
        );
      }
    }
  },
  {
    headerName: "CHANNELS",
    width: 120,
    cellRenderer: (params: ICellRendererParams<ComplianceReminder>) => {
      const rem = params.data;
      if (!rem) return null;
      return (
        <div className="flex items-center gap-1.5 py-1 text-slate-400">
          <span title={rem.notifyEmail ? "Email enabled" : "Email disabled"}>
            <Mail className={`w-3.5 h-3.5 ${rem.notifyEmail ? "text-blue-500" : "opacity-30"}`} />
          </span>
          <span title={rem.notifySms ? "SMS enabled" : "SMS disabled"}>
            <Smartphone className={`w-3.5 h-3.5 ${rem.notifySms ? "text-emerald-500" : "opacity-30"}`} />
          </span>
          <span title={rem.notifyPush ? "Push notification enabled" : "Push disabled"}>
            <Bell className={`w-3.5 h-3.5 ${rem.notifyPush ? "text-amber-500" : "opacity-30"}`} />
          </span>
        </div>
      );
    }
  },
  {
    headerName: "STATUS",
    field: "status",
    width: 110,
    cellRenderer: (params: ICellRendererParams<ComplianceReminder>) => {
      const s = params.data?.status || "active";
      const statusMap: Record<string, { label: string; textClass: string; dot: string }> = {
        active: { label: "Active", textClass: "text-emerald-600 dark:text-emerald-400", dot: "bg-emerald-500 shadow-xs" },
        due_soon: { label: "Due Soon", textClass: "text-amber-600 dark:text-amber-400", dot: "bg-amber-500 shadow-xs" },
        overdue: { label: "Overdue", textClass: "text-rose-600 dark:text-rose-400", dot: "bg-rose-500 animate-pulse" },
        renewed: { label: "Renewed", textClass: "text-blue-600 dark:text-blue-400", dot: "bg-blue-500 shadow-xs" }
      };
      const info = statusMap[s] || statusMap.active;
      return (
        <div className="h-full flex items-center gap-1.5 font-medium text-xs">
          <span className={`w-2 h-2 rounded-full shrink-0 ${info.dot}`} />
          <span className={info.textClass}>{info.label}</span>
        </div>
      );
    }
  },
  {
    headerName: "ACTIONS",
    width: 110,
    pinned: "right",
    cellRenderer: (params: ICellRendererParams<ComplianceReminder>) => {
      const rem = params.data;
      if (!rem) return null;
      return (
        <div className="flex items-center gap-1 py-1">
          <button
            onClick={() => handlers.onEdit(rem)}
            title="Edit reminder"
            className="p-1 hover:bg-slate-100 dark:hover:bg-slate-800 rounded text-slate-500 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
          >
            <Edit3 className="w-4 h-4" />
          </button>
          <button
            onClick={() => handlers.onDelete(rem)}
            title="Remove reminder"
            className="p-1 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 transition-colors"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      );
    }
  }
];
