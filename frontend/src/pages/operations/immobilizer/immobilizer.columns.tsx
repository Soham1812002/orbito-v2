import React from "react";
import { ColDef, ICellRendererParams } from "ag-grid-community";
import { ImmobilizerAudit } from "./immobilizer.types";
import { Truck, PowerOff, Power, ShieldAlert, CheckCircle2, XCircle, Clock, MapPin } from "lucide-react";
import dayjs from "dayjs";

export const getImmobilizerColumns = (handlers: {
  onViewLocation?: (item: ImmobilizerAudit) => void;
}): ColDef<ImmobilizerAudit>[] => [
  {
    headerName: "VEHICLE PLATE",
    field: "vehiclePlate",
    width: 170,
    pinned: "left",
    cellRenderer: (params: ICellRendererParams<ImmobilizerAudit>) => {
      const item = params.data;
      if (!item) return null;
      return (
        <div className="flex items-center gap-1.5 py-1">
          <Truck className="w-3.5 h-3.5 text-blue-500 shrink-0" />
          <span className="font-mono font-bold text-xs tracking-wider text-slate-900 dark:text-white">
            {item.vehiclePlate}
          </span>
        </div>
      );
    }
  },
  {
    headerName: "COMMAND SENT",
    field: "command",
    width: 160,
    cellRenderer: (params: ICellRendererParams<ImmobilizerAudit>) => {
      const cmd = params.data?.command;
      const isCut = cmd === "STOP_ENGINE";
      return (
        <span
          className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold ${
            isCut
              ? "bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-400 border border-rose-200 dark:border-rose-900/50"
              : "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-900/50"
          }`}
        >
          {isCut ? <PowerOff className="w-3 h-3 shrink-0" /> : <Power className="w-3 h-3 shrink-0" />}
          {isCut ? "STOP ENGINE" : "RESUME ENGINE"}
        </span>
      );
    }
  },
  {
    headerName: "RELAY STATUS",
    field: "status",
    width: 120,
    cellRenderer: (params: ICellRendererParams<ImmobilizerAudit>) => {
      const status = params.data?.status;
      const statusConfig: Record<string, { label: string; class: string; icon: any }> = {
        executed: {
          label: "Executed",
          class: "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400",
          icon: CheckCircle2
        },
        failed: {
          label: "Failed",
          class: "bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-400",
          icon: XCircle
        },
        pending: {
          label: "Pending",
          class: "bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400",
          icon: Clock
        },
        cancelled: {
          label: "Cancelled",
          class: "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400",
          icon: XCircle
        }
      };
      const cfg = statusConfig[status || ""] || statusConfig.pending;
      const IconComp = cfg.icon;
      return (
        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-medium ${cfg.class}`}>
          <IconComp className="w-3 h-3" />
          {cfg.label}
        </span>
      );
    }
  },
  {
    headerName: "OPERATOR & TIME",
    field: "operatorName",
    width: 200,
    cellRenderer: (params: ICellRendererParams<ImmobilizerAudit>) => {
      const item = params.data;
      if (!item) return null;
      return (
        <div className="leading-tight py-1">
          <p className="text-xs font-semibold text-slate-900 dark:text-white truncate">
            {item.operatorName}
          </p>
          <p className="text-[11px] font-mono text-slate-500 truncate mt-0.5">
            {dayjs(item.createdAt).format("DD MMM YYYY, HH:mm:ss")}
          </p>
        </div>
      );
    }
  },
  {
    headerName: "DIAGNOSTIC METRICS",
    width: 190,
    cellRenderer: (params: ICellRendererParams<ImmobilizerAudit>) => {
      const item = params.data;
      if (!item) return null;
      return (
        <div className="flex items-center gap-2 text-xs py-1">
          <span className="font-mono text-slate-700 dark:text-slate-300">
            {item.relayVoltage ? `${item.relayVoltage}V` : "--"}
          </span>
          <span className="text-slate-300 dark:text-slate-700">|</span>
          <span className="font-mono text-slate-700 dark:text-slate-300">
            {item.speedAtExecution !== undefined ? `${item.speedAtExecution} km/h` : "0 km/h"}
          </span>
          <span className="text-slate-300 dark:text-slate-700">|</span>
          <span className="font-mono text-[11px] text-slate-500">
            {item.responseTimeMs ? `${item.responseTimeMs}ms` : "--"}
          </span>
        </div>
      );
    }
  },
  {
    headerName: "LOCATION AT COMMAND",
    field: "locationAddress",
    width: 260,
    cellRenderer: (params: ICellRendererParams<ImmobilizerAudit>) => {
      const item = params.data;
      if (!item) return null;
      return (
        <div className="flex items-center gap-1.5 py-1 text-xs text-slate-700 dark:text-slate-300 truncate">
          <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
          <span className="truncate">{item.locationAddress || `${item.latitude}, ${item.longitude}`}</span>
        </div>
      );
    }
  },
  {
    headerName: "AUDIT REASON",
    field: "reason",
    width: 280,
    cellRenderer: (params: ICellRendererParams<ImmobilizerAudit>) => {
      const reason = params.data?.reason;
      return (
        <span className="text-xs text-slate-600 dark:text-slate-400 truncate block py-1" title={reason}>
          {reason}
        </span>
      );
    }
  }
];
