import React from "react";
import { ColDef, ICellRendererParams } from "ag-grid-community";
import { RoutePathAllocation } from "./allocations.types";
import { Truck, Compass, Clock, AlertTriangle, ShieldCheck, Edit3, Trash2 } from "lucide-react";

export const getRouteAllocationColumns = (handlers: {
  onEdit: (alloc: RoutePathAllocation) => void;
  onDelete: (alloc: RoutePathAllocation) => void;
}): ColDef<RoutePathAllocation>[] => [
  {
    headerName: "VEHICLE PLATE",
    field: "vehiclePlate",
    width: 170,
    pinned: "left",
    cellRenderer: (params: ICellRendererParams<RoutePathAllocation>) => {
      const a = params.data;
      if (!a) return null;
      return (
        <div className="flex items-center gap-1.5 py-1">
          <Truck className="w-3.5 h-3.5 text-blue-500 shrink-0" />
          <span className="font-mono font-bold text-xs tracking-wider text-slate-900 dark:text-white">
            {a.vehiclePlate}
          </span>
        </div>
      );
    }
  },
  {
    headerName: "ALLOCATION GROUP",
    field: "allocationName",
    width: 230,
    cellRenderer: (params: ICellRendererParams<RoutePathAllocation>) => {
      const a = params.data;
      if (!a) return null;
      return (
        <div className="leading-tight py-1">
          <p className="text-xs font-semibold text-slate-900 dark:text-white truncate">
            {a.allocationName}
          </p>
          <p className="text-[11px] text-slate-500 truncate">{a.branchName || "Main Hub"}</p>
        </div>
      );
    }
  },
  {
    headerName: "ROUTE CORRIDOR",
    field: "routeCode",
    width: 220,
    cellRenderer: (params: ICellRendererParams<RoutePathAllocation>) => {
      const a = params.data;
      if (!a) return null;
      return (
        <div className="flex items-center gap-1.5 py-1">
          <Compass className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
          <div className="truncate">
            <span className="font-mono text-xs font-semibold text-indigo-600 dark:text-indigo-400">
              {a.routeCode || "COR-ASSIGNED"}
            </span>
            <p className="text-[11px] text-slate-500 truncate">{a.routeName || "Express Freight"}</p>
          </div>
        </div>
      );
    }
  },
  {
    headerName: "SCHEDULE",
    field: "scheduleType",
    width: 130,
    cellRenderer: (params: ICellRendererParams<RoutePathAllocation>) => {
      const a = params.data;
      if (!a) return null;
      const typeLabels: Record<string, string> = {
        daily: "Daily 24/7",
        weekdays: "Mon - Fri",
        custom: "Custom Days",
        on_demand: "On Demand"
      };
      return (
        <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
          {typeLabels[a.scheduleType] || a.scheduleType}
        </span>
      );
    }
  },
  {
    headerName: "DEPARTURE & TRANSIT",
    width: 170,
    cellRenderer: (params: ICellRendererParams<RoutePathAllocation>) => {
      const a = params.data;
      if (!a) return null;
      return (
        <div className="flex items-center gap-2 text-xs py-1 text-slate-700 dark:text-slate-300">
          <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
          <span className="font-mono">{a.departureTime || "--:--"}</span>
          <span className="text-slate-400">|</span>
          <span className="text-[11px] text-slate-500">Max {a.maxTransitHours || 12}h</span>
        </div>
      );
    }
  },
  {
    headerName: "DEVIATION SAFEGUARD",
    field: "allowDeviation",
    width: 160,
    cellRenderer: (params: ICellRendererParams<RoutePathAllocation>) => {
      const a = params.data;
      if (!a) return null;
      return (
        <div className="flex items-center gap-1.5 py-1 text-xs">
          {a.allowDeviation ? (
            <span className="inline-flex items-center gap-1 text-amber-600 dark:text-amber-400 text-[11px]">
              <AlertTriangle className="w-3 h-3" />
              Allowed ({a.deviationAlertThresholdMeters}m)
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 text-emerald-600 dark:text-emerald-400 text-[11px]">
              <ShieldCheck className="w-3 h-3" />
              Strict (&lt;{a.deviationAlertThresholdMeters}m)
            </span>
          )}
        </div>
      );
    }
  },
  {
    headerName: "STATUS",
    field: "isActive",
    width: 100,
    cellRenderer: (params: ICellRendererParams<RoutePathAllocation>) => {
      const isActive = params.data?.isActive;
      return (
        <div className="h-full flex items-center gap-1.5 font-medium text-xs">
          <span className={`w-2 h-2 rounded-full shrink-0 ${isActive ? "bg-emerald-500 shadow-xs" : "bg-slate-400"}`} />
          <span className={isActive ? "text-emerald-600 dark:text-emerald-400" : "text-slate-500 dark:text-slate-400"}>
            {isActive ? "Active" : "Paused"}
          </span>
        </div>
      );
    }
  },
  {
    headerName: "ACTIONS",
    width: 110,
    pinned: "right",
    cellRenderer: (params: ICellRendererParams<RoutePathAllocation>) => {
      const a = params.data;
      if (!a) return null;
      return (
        <div className="flex items-center gap-1 py-1">
          <button
            onClick={() => handlers.onEdit(a)}
            title="Edit allocation"
            className="p-1 hover:bg-slate-100 dark:hover:bg-slate-800 rounded text-slate-500 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
          >
            <Edit3 className="w-4 h-4" />
          </button>
          <button
            onClick={() => handlers.onDelete(a)}
            title="Remove allocation"
            className="p-1 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 transition-colors"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      );
    }
  }
];
