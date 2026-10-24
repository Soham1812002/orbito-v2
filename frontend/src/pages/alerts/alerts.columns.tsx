import React from "react";
import { ColDef, ICellRendererParams } from "ag-grid-community";
import { AlertLog, AlertRule } from "./alerts.types";
import { TwoLineCell } from "@/components/common/AppDataTable";
import {
  AlertTriangle,
  Flame,
  Radio,
  MapPin,
  Clock,
  CheckCircle,
  Eye,
  Mail,
  Smartphone,
  Bell,
  Trash2,
  Edit,
  ShieldAlert
} from "lucide-react";
import dayjs from "dayjs";

export const getAlertLogColumns = (handlers: {
  onAcknowledge: (log: AlertLog) => void;
  onViewMap: (log: AlertLog) => void;
}): ColDef<AlertLog>[] => [
  {
    headerName: "VEHICLE",
    field: "plateNumber",
    width: 170,
    pinned: "left",
    cellRenderer: (params: ICellRendererParams<AlertLog>) => {
      const log = params.data;
      if (!log) return null;
      return (
        <div className="flex items-center gap-2 py-1">
          <span className="font-mono font-bold text-slate-900 dark:text-white tracking-wider text-xs">
            {log.plateNumber}
          </span>
        </div>
      );
    }
  },
  {
    headerName: "COMPANY / BRANCH",
    field: "companyName",
    width: 200,
    cellRenderer: (params: ICellRendererParams<AlertLog>) => {
      const log = params.data;
      if (!log) return null;
      return (
        <div className="leading-tight">
          <p className="text-xs font-semibold text-slate-800 dark:text-slate-200 truncate">
            {log.companyName}
          </p>
          <p className="text-[11px] text-slate-500 truncate">{log.branchName}</p>
        </div>
      );
    }
  },
  {
    headerName: "ALERT NAME & TYPE",
    field: "alertName",
    width: 260,
    cellRenderer: (params: ICellRendererParams<AlertLog>) => {
      const log = params.data;
      if (!log) return null;
      return (
        <div className="flex items-center gap-2.5">
          <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
            {log.alertType === "overspeed" && <Flame className="h-4 w-4 text-rose-500" />}
            {log.alertType === "geofence_breach" && <MapPin className="h-4 w-4 text-amber-500" />}
            {log.alertType === "power_cut" && <Radio className="h-4 w-4 text-red-500" />}
            {log.alertType === "harsh_braking" && <AlertTriangle className="h-4 w-4 text-amber-500" />}
            {log.alertType === "idle_timeout" && <Clock className="h-4 w-4 text-blue-500" />}
            {log.alertType === "sos" && <ShieldAlert className="h-4 w-4 text-red-500" />}
            {!["overspeed", "geofence_breach", "power_cut", "harsh_braking", "idle_timeout", "sos"].includes(log.alertType) && (
              <Bell className="h-4 w-4 text-slate-500" />
            )}
          </div>
          <div className="truncate leading-tight">
            <p className="text-xs font-semibold text-slate-900 dark:text-white truncate">
              {log.alertName}
            </p>
            <p className="text-[10px] text-slate-500 uppercase tracking-wider">{log.alertType.replace("_", " ")}</p>
          </div>
        </div>
      );
    }
  },
  {
    headerName: "SEVERITY",
    field: "severity",
    width: 130,
    cellRenderer: (params: ICellRendererParams<AlertLog>) => {
      const sev = params.value;
      if (sev === "critical") {
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20">
            <span className="h-1.5 w-1.5 rounded-full bg-rose-500 animate-pulse" />
            CRITICAL
          </span>
        );
      }
      if (sev === "warning") {
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
            <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
            WARNING
          </span>
        );
      }
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20">
          <span className="h-1.5 w-1.5 rounded-full bg-blue-500" />
          INFO
        </span>
      );
    }
  },
  {
    headerName: "TRIGGER VALUE",
    field: "triggerValue",
    width: 140,
    cellRenderer: (params: ICellRendererParams<AlertLog>) => (
      <span className="font-mono text-xs font-semibold text-slate-800 dark:text-slate-200">
        {params.value || "—"}
      </span>
    )
  },
  {
    headerName: "LOCATION",
    field: "address",
    width: 280,
    cellRenderer: (params: ICellRendererParams<AlertLog>) => {
      const log = params.data;
      if (!log) return null;
      return (
        <div className="truncate leading-tight">
          <p className="text-xs text-slate-700 dark:text-slate-300 truncate font-medium">{log.address}</p>
          <p className="font-mono text-[10px] text-slate-500">{log.latitude.toFixed(4)}°, {log.longitude.toFixed(4)}°</p>
        </div>
      );
    }
  },
  {
    headerName: "TIMESTAMP",
    field: "createdAt",
    width: 170,
    cellRenderer: (params: ICellRendererParams<AlertLog>) => (
      <span className="font-mono text-xs text-slate-600 dark:text-slate-400">
        {dayjs(params.value).format("DD MMM YYYY, HH:mm")}
      </span>
    )
  },
  {
    headerName: "STATUS",
    field: "status",
    width: 150,
    cellRenderer: (params: ICellRendererParams<AlertLog>) => {
      const status = params.value;
      if (status === "acknowledged") {
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
            <CheckCircle className="h-3 w-3" /> ACKNOWLEDGED
          </span>
        );
      }
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20">
          <span className="h-1.5 w-1.5 rounded-full bg-rose-500 animate-ping" /> PENDING
        </span>
      );
    }
  },
  {
    headerName: "ACTIONS",
    width: 170,
    pinned: "right",
    cellRenderer: (params: ICellRendererParams<AlertLog>) => {
      const log = params.data;
      if (!log) return null;
      return (
        <div className="flex items-center gap-1.5 py-1">
          {log.status === "pending" && (
            <button
              onClick={() => handlers.onAcknowledge(log)}
              className="inline-flex items-center gap-1 px-2 py-1 text-[11px] font-semibold text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 rounded-lg transition-colors border border-emerald-500/20"
              title="Acknowledge Alert"
            >
              <CheckCircle className="h-3.5 w-3.5" />
              Ack
            </button>
          )}
          <button
            onClick={() => handlers.onViewMap(log)}
            className="inline-flex items-center gap-1 px-2 py-1 text-[11px] font-semibold text-blue-600 hover:text-blue-700 hover:bg-blue-50 dark:hover:bg-blue-950/40 rounded-lg transition-colors border border-blue-500/20"
            title="View on Map"
          >
            <Eye className="h-3.5 w-3.5" />
            Map
          </button>
        </div>
      );
    }
  }
];

export const getAlertRuleColumns = (handlers: {
  onToggle: (rule: AlertRule) => void;
  onEdit: (rule: AlertRule) => void;
  onDelete: (rule: AlertRule) => void;
}): ColDef<AlertRule>[] => [
  {
    headerName: "RULE NAME",
    field: "name",
    width: 240,
    pinned: "left",
    cellRenderer: (params: ICellRendererParams<AlertRule>) => {
      const rule = params.data;
      if (!rule) return null;
      return (
        <TwoLineCell
          primary={rule.name}
          secondary={rule.branchName}
        />
      );
    }
  },
  {
    headerName: "ALERT TYPE",
    field: "alertType",
    width: 170,
    cellRenderer: (params: ICellRendererParams<AlertRule>) => (
      <span className="font-semibold text-xs text-slate-800 dark:text-slate-200 uppercase tracking-wide">
        {params.value.replace("_", " ")}
      </span>
    )
  },
  {
    headerName: "SEVERITY",
    field: "severity",
    width: 130,
    cellRenderer: (params: ICellRendererParams<AlertRule>) => {
      const sev = params.value;
      if (sev === "critical") {
        return (
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-rose-500/10 text-rose-600 border border-rose-500/20">
            CRITICAL
          </span>
        );
      }
      if (sev === "warning") {
        return (
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-amber-500/10 text-amber-600 border border-amber-500/20">
            WARNING
          </span>
        );
      }
      return (
        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-blue-500/10 text-blue-600 border border-blue-500/20">
          INFO
        </span>
      );
    }
  },
  {
    headerName: "TARGET FLEET",
    field: "vehicleScope",
    width: 150,
    cellRenderer: (params: ICellRendererParams<AlertRule>) => {
      const scope = params.value;
      if (scope === "all") return <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">All Vehicles</span>;
      if (scope === "group") return <span className="text-xs font-semibold text-indigo-600 dark:text-indigo-400">Vehicle Group</span>;
      return <span className="text-xs font-semibold text-slate-600">Specific ({params.data?.vehicleIds.length || 0})</span>;
    }
  },
  {
    headerName: "CHANNELS",
    field: "channels",
    width: 140,
    cellRenderer: (params: ICellRendererParams<AlertRule>) => {
      const ch = params.value;
      if (!ch) return null;
      return (
        <div className="flex items-center gap-1.5 py-1">
          {ch.sms && (
            <span title="SMS">
              <Smartphone className="h-3.5 w-3.5 text-blue-500" />
            </span>
          )}
          {ch.email && (
            <span title="Email">
              <Mail className="h-3.5 w-3.5 text-indigo-500" />
            </span>
          )}
          {ch.push && (
            <span title="Push Notification">
              <Bell className="h-3.5 w-3.5 text-amber-500" />
            </span>
          )}
        </div>
      );
    }
  },
  {
    headerName: "STATUS",
    field: "isActive",
    width: 130,
    cellRenderer: (params: ICellRendererParams<AlertRule>) => {
      const rule = params.data;
      if (!rule) return null;
      return (
        <button
          onClick={() => handlers.onToggle(rule)}
          className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider transition-colors ${
            rule.isActive
              ? "bg-emerald-500/10 text-emerald-600 border border-emerald-500/20 hover:bg-emerald-500/20"
              : "bg-slate-500/10 text-slate-500 border border-slate-500/20 hover:bg-slate-500/20"
          }`}
        >
          <span className={`h-1.5 w-1.5 rounded-full ${rule.isActive ? "bg-emerald-500" : "bg-slate-400"}`} />
          {rule.isActive ? "ACTIVE" : "INACTIVE"}
        </button>
      );
    }
  },
  {
    headerName: "ACTIONS",
    width: 120,
    pinned: "right",
    cellRenderer: (params: ICellRendererParams<AlertRule>) => {
      const rule = params.data;
      if (!rule) return null;
      return (
        <div className="flex items-center gap-2 py-1">
          <button
            onClick={() => handlers.onEdit(rule)}
            className="flex h-7 w-7 items-center justify-center rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            title="Edit Rule"
          >
            <Edit className="h-3.5 w-3.5" />
          </button>
          <button
            onClick={() => handlers.onDelete(rule)}
            className="flex h-7 w-7 items-center justify-center rounded-lg text-rose-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
            title="Delete Rule"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </button>
        </div>
      );
    }
  }
];
