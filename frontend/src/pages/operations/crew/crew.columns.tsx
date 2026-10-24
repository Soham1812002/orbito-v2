import React from "react";
import { ColDef, ICellRendererParams } from "ag-grid-community";
import { CrewAllocation } from "./crew.types";
import { Truck, User, Phone, Sparkles, Clock, Edit3, Trash2 } from "lucide-react";

export const getCrewAllocationColumns = (handlers: {
  onEdit: (crew: CrewAllocation) => void;
  onDelete: (crew: CrewAllocation) => void;
}): ColDef<CrewAllocation>[] => [
  {
    headerName: "VEHICLE PLATE",
    field: "vehiclePlate",
    width: 170,
    pinned: "left",
    cellRenderer: (params: ICellRendererParams<CrewAllocation>) => {
      const c = params.data;
      if (!c) return null;
      return (
        <div className="flex items-center gap-1.5 py-1">
          <Truck className="w-3.5 h-3.5 text-blue-500 shrink-0" />
          <span className="font-mono font-bold text-xs tracking-wider text-slate-900 dark:text-white">
            {c.vehiclePlate}
          </span>
        </div>
      );
    }
  },
  {
    headerName: "PRIMARY DRIVER",
    field: "primaryDriverName",
    width: 230,
    cellRenderer: (params: ICellRendererParams<CrewAllocation>) => {
      const c = params.data;
      if (!c) return null;
      return (
        <div className="leading-tight py-1">
          <div className="flex items-center gap-1 text-xs font-semibold text-slate-900 dark:text-white truncate">
            <User className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span className="truncate">{c.primaryDriverName}</span>
          </div>
          <div className="flex items-center gap-1 text-[11px] text-slate-500 font-mono mt-0.5">
            <Phone className="w-3 h-3 text-slate-400" />
            <span>{c.primaryDriverPhone}</span>
          </div>
        </div>
      );
    }
  },
  {
    headerName: "CO-DRIVER",
    field: "secondaryDriverName",
    width: 170,
    cellRenderer: (params: ICellRendererParams<CrewAllocation>) => {
      const name = params.data?.secondaryDriverName;
      if (!name) {
        return <span className="text-[11px] text-slate-400 italic">None</span>;
      }
      return (
        <span className="text-xs font-medium text-slate-700 dark:text-slate-300 truncate">
          {name}
        </span>
      );
    }
  },
  {
    headerName: "CLEANER / ATTENDANT",
    field: "cleanerName",
    width: 180,
    cellRenderer: (params: ICellRendererParams<CrewAllocation>) => {
      const name = params.data?.cleanerName;
      if (!name) {
        return (
          <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium bg-slate-100 dark:bg-slate-800 text-slate-400">
            Unassigned
          </span>
        );
      }
      return (
        <div className="flex items-center gap-1.5 py-1 text-xs font-medium text-slate-800 dark:text-slate-200">
          <Sparkles className="w-3 h-3 text-cyan-500 shrink-0" />
          <span className="truncate">{name}</span>
        </div>
      );
    }
  },
  {
    headerName: "SHIFT DESIGNATION",
    field: "shiftName",
    width: 210,
    cellRenderer: (params: ICellRendererParams<CrewAllocation>) => {
      const c = params.data;
      if (!c) return null;
      return (
        <div className="flex items-center gap-1.5 py-1 text-xs text-slate-700 dark:text-slate-300">
          <Clock className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
          <span className="truncate">{c.shiftName}</span>
        </div>
      );
    }
  },
  {
    headerName: "DUTY STATUS",
    field: "dutyStatus",
    width: 130,
    cellRenderer: (params: ICellRendererParams<CrewAllocation>) => {
      const status = params.data?.dutyStatus;
      const statusMap: Record<string, { label: string; textClass: string; dot: string }> = {
        on_duty: {
          label: "On Duty",
          textClass: "text-emerald-600 dark:text-emerald-400",
          dot: "bg-emerald-500 shadow-xs"
        },
        standby: {
          label: "On Standby",
          textClass: "text-amber-600 dark:text-amber-400",
          dot: "bg-amber-500 shadow-xs"
        },
        off_duty: {
          label: "Off Duty",
          textClass: "text-slate-500 dark:text-slate-400",
          dot: "bg-slate-400"
        }
      };
      const info = statusMap[status || ""] || statusMap.off_duty;
      return (
        <div className="h-full flex items-center gap-1.5 font-medium text-xs">
          <span className={`w-2 h-2 rounded-full shrink-0 ${info.dot}`} />
          <span className={info.textClass}>{info.label}</span>
        </div>
      );
    }
  },
  {
    headerName: "ROSTER DATES",
    width: 150,
    cellRenderer: (params: ICellRendererParams<CrewAllocation>) => {
      const c = params.data;
      if (!c) return null;
      return (
        <div className="text-[11px] font-mono text-slate-600 dark:text-slate-400 py-1">
          <span>{c.startDate}</span>
          {c.endDate ? <span> → {c.endDate}</span> : <span className="text-slate-400"> (Ongoing)</span>}
        </div>
      );
    }
  },
  {
    headerName: "ACTIONS",
    width: 110,
    pinned: "right",
    cellRenderer: (params: ICellRendererParams<CrewAllocation>) => {
      const c = params.data;
      if (!c) return null;
      return (
        <div className="flex items-center gap-1 py-1">
          <button
            onClick={() => handlers.onEdit(c)}
            title="Edit crew assignment"
            className="p-1 hover:bg-slate-100 dark:hover:bg-slate-800 rounded text-slate-500 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
          >
            <Edit3 className="w-4 h-4" />
          </button>
          <button
            onClick={() => handlers.onDelete(c)}
            title="Remove crew assignment"
            className="p-1 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 transition-colors"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      );
    }
  }
];
