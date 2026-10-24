import React from "react";
import { ColDef, ICellRendererParams } from "ag-grid-community";
import { RoutePath } from "./routes.types";
import { MapPin, ArrowRight, Gauge, Clock, ShieldCheck, Edit3, Trash2, Eye } from "lucide-react";

export const getRoutePathColumns = (handlers: {
  onView: (route: RoutePath) => void;
  onEdit: (route: RoutePath) => void;
  onDelete: (route: RoutePath) => void;
}): ColDef<RoutePath>[] => [
  {
    headerName: "ROUTE CODE",
    field: "routeCode",
    width: 170,
    pinned: "left",
    cellRenderer: (params: ICellRendererParams<RoutePath>) => {
      const route = params.data;
      if (!route) return null;
      return (
        <div className="flex items-center gap-1.5 py-1">
          <span className="font-mono font-bold text-xs tracking-wider text-blue-600 dark:text-blue-400">
            {route.routeCode}
          </span>
        </div>
      );
    }
  },
  {
    headerName: "CORRIDOR NAME",
    field: "routeName",
    width: 240,
    cellRenderer: (params: ICellRendererParams<RoutePath>) => {
      const route = params.data;
      if (!route) return null;
      return (
        <div className="leading-tight py-1">
          <p className="text-xs font-semibold text-slate-900 dark:text-white truncate">
            {route.routeName}
          </p>
          <p className="text-[11px] text-slate-500 truncate">
            {route.branchName || "Main Hub"}
          </p>
        </div>
      );
    }
  },
  {
    headerName: "ORIGIN & DESTINATION",
    width: 320,
    cellRenderer: (params: ICellRendererParams<RoutePath>) => {
      const route = params.data;
      if (!route) return null;
      return (
        <div className="flex items-center gap-2 text-xs py-1">
          <div className="flex items-center gap-1 text-slate-800 dark:text-slate-200 truncate max-w-[130px]">
            <MapPin className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
            <span className="truncate">{route.originName}</span>
          </div>
          <ArrowRight className="w-3 h-3 text-slate-400 shrink-0" />
          <div className="flex items-center gap-1 text-slate-800 dark:text-slate-200 truncate max-w-[130px]">
            <MapPin className="w-3.5 h-3.5 text-rose-500 shrink-0" />
            <span className="truncate">{route.destinationName}</span>
          </div>
        </div>
      );
    }
  },
  {
    headerName: "DISTANCE",
    field: "distanceKm",
    width: 130,
    cellRenderer: (params: ICellRendererParams<RoutePath>) => {
      const route = params.data;
      if (!route) return null;
      return (
        <div className="flex items-center gap-1 text-xs py-1">
          <span className="font-mono font-medium text-slate-900 dark:text-white">
            {route.distanceKm.toFixed(1)}
          </span>
          <span className="text-[11px] text-slate-500">km</span>
        </div>
      );
    }
  },
  {
    headerName: "EST. DURATION",
    field: "estimatedDurationMins",
    width: 140,
    cellRenderer: (params: ICellRendererParams<RoutePath>) => {
      const route = params.data;
      if (!route) return null;
      const hours = Math.floor(route.estimatedDurationMins / 60);
      const mins = route.estimatedDurationMins % 60;
      return (
        <div className="flex items-center gap-1 text-xs py-1 text-slate-700 dark:text-slate-300">
          <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
          <span className="font-mono">
            {hours > 0 ? `${hours}h ` : ""}
            {mins}m
          </span>
        </div>
      );
    }
  },
  {
    headerName: "SPEED CAP",
    field: "maxAllowedSpeed",
    width: 120,
    cellRenderer: (params: ICellRendererParams<RoutePath>) => {
      const route = params.data;
      if (!route) return null;
      return (
        <div className="flex items-center gap-1 text-xs py-1">
          <Gauge className="w-3.5 h-3.5 text-amber-500 shrink-0" />
          <span className="font-mono font-semibold text-slate-900 dark:text-white">
            {route.maxAllowedSpeed}
          </span>
          <span className="text-[11px] text-slate-500">km/h</span>
        </div>
      );
    }
  },
  {
    headerName: "WAYPOINTS",
    width: 110,
    cellRenderer: (params: ICellRendererParams<RoutePath>) => {
      const count = params.data?.waypoints?.length || 0;
      return (
        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-mono font-medium bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
          {count} stops
        </span>
      );
    }
  },
  {
    headerName: "STATUS",
    field: "isActive",
    width: 110,
    cellRenderer: (params: ICellRendererParams<RoutePath>) => {
      const isActive = params.data?.isActive;
      return (
        <div className="h-full flex items-center gap-1.5 font-medium text-xs">
          <span className={`w-2 h-2 rounded-full shrink-0 ${isActive ? "bg-emerald-500 shadow-xs" : "bg-slate-400"}`} />
          <span className={isActive ? "text-emerald-600 dark:text-emerald-400" : "text-slate-500 dark:text-slate-400"}>
            {isActive ? "Active" : "Archived"}
          </span>
        </div>
      );
    }
  },
  {
    headerName: "ACTIONS",
    width: 120,
    pinned: "right",
    cellRenderer: (params: ICellRendererParams<RoutePath>) => {
      const route = params.data;
      if (!route) return null;
      return (
        <div className="flex items-center gap-1 py-1">
          <button
            onClick={() => handlers.onView(route)}
            title="View corridor details"
            className="p-1 hover:bg-slate-100 dark:hover:bg-slate-800 rounded text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 transition-colors"
          >
            <Eye className="w-4 h-4" />
          </button>
          <button
            onClick={() => handlers.onEdit(route)}
            title="Edit route corridor"
            className="p-1 hover:bg-slate-100 dark:hover:bg-slate-800 rounded text-slate-500 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
          >
            <Edit3 className="w-4 h-4" />
          </button>
          <button
            onClick={() => handlers.onDelete(route)}
            title="Delete corridor"
            className="p-1 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 transition-colors"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      );
    }
  }
];
