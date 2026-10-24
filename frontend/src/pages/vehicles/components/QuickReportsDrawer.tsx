import React from "react";
import { useNavigate } from "react-router-dom";
import {
  X,
  FileText,
  ChevronRight,
  Clock,
  Compass,
  MapPin,
  Calendar,
  AlertCircle,
  Activity,
  Layers,
  Sparkles
} from "lucide-react";
import { VehicleTelemetry } from "../vehicles.types";
import { showToast } from "@/lib/toast";

interface QuickReportsDrawerProps {
  vehicle: VehicleTelemetry | null;
  isOpen: boolean;
  onClose: () => void;
}

const REPORT_CATEGORIES = [
  {
    id: "trip-summary",
    title: "Trip Summary",
    desc: "Distance, driving duration, and route summary",
    path: "/reports/trip/summary",
    icon: Compass,
    badge: "DAILY"
  },
  {
    id: "trip-details",
    title: "Trip Details",
    desc: "Turn-by-turn trajectory logs and timestamps",
    path: "/reports/trip/details",
    icon: Layers
  },
  {
    id: "stoppage",
    title: "Stoppage Summary",
    desc: "Unplanned dwell times and parking duration",
    path: "/reports/trip/stoppage",
    icon: Clock
  },
  {
    id: "idle",
    title: "Engine Idle Summary",
    desc: "Excessive fuel-wasting idle intervals",
    path: "/reports/trip/idle",
    icon: Activity
  },
  {
    id: "work-hour",
    title: "Work Hour Summary",
    desc: "Operating shift hours and driver duty times",
    path: "/reports/trip/work-hour",
    icon: Calendar
  },
  {
    id: "poi-summary",
    title: "POI Summary A",
    desc: "Point of Interest customer stop visits",
    path: "/reports/poi/summary-a",
    icon: MapPin
  },
  {
    id: "missed-poi",
    title: "Missed POI Summary",
    desc: "Customer dispatch points that were skipped",
    path: "/reports/poi/missed",
    icon: AlertCircle
  }
];

export const QuickReportsDrawer: React.FC<QuickReportsDrawerProps> = ({
  vehicle,
  isOpen,
  onClose
}) => {
  const navigate = useNavigate();

  if (!isOpen || !vehicle) return null;

  const handleOpenReport = (path: string, reportTitle?: string) => {
    showToast.info(`Opening ${reportTitle || "Report"} for ${vehicle.plateNumber}`);
    onClose();
    navigate(`${path}?vehicle=${encodeURIComponent(vehicle.plateNumber)}`);
  };

  return (
    <aside
      aria-label="Quick Reports Drawer"
      className="absolute top-4 right-4 bottom-4 z-30 w-full sm:w-96 max-w-[calc(100vw-2rem)] flex flex-col rounded-2xl border border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md shadow-2xl overflow-hidden transition-all duration-300"
    >
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 p-4 bg-slate-50/50 dark:bg-slate-950/40">
        <div className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-600/10 text-blue-600">
            <FileText className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
              Quick Reports
            </h2>
            <p className="font-mono text-xs font-bold text-blue-600 dark:text-blue-400">
              {vehicle.plateNumber}
            </p>
          </div>
        </div>
        <button
          onClick={onClose}
          aria-label="Close reports drawer"
          className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-800 dark:hover:text-slate-200 transition-colors"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      {/* Auto-applied vehicle banner matching Figma */}
      <div className="p-3 bg-blue-50/60 dark:bg-blue-950/30 border-b border-blue-100 dark:border-blue-900/40 flex items-center gap-2.5 text-xs text-blue-700 dark:text-blue-300">
        <Sparkles className="h-4 w-4 text-blue-600 dark:text-blue-400 shrink-0" />
        <span className="text-[11px] font-medium leading-relaxed">
          The selected vehicle is automatically applied when opening any report.
        </span>
      </div>

      {/* Report Links List */}
      <div className="flex-1 overflow-y-auto p-3 space-y-2">
        {REPORT_CATEGORIES.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              onClick={() => handleOpenReport(item.path, item.title)}
              className="w-full text-left p-3 rounded-xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-950/60 hover:bg-slate-50 dark:hover:bg-slate-800/60 hover:border-slate-300 dark:hover:border-slate-700 transition-all flex items-center justify-between group shadow-xs"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 group-hover:text-blue-600 transition-colors">
                  <Icon className="h-4 w-4" />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-xs font-bold text-slate-900 dark:text-white truncate">
                      {item.title}
                    </p>
                    {item.badge && (
                      <span className="px-1.5 py-0.2 rounded text-[9px] font-semibold bg-blue-500/10 text-blue-600">
                        {item.badge}
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-slate-500 truncate mt-0.5">
                    {item.desc}
                  </p>
                </div>
              </div>
              <ChevronRight className="h-4 w-4 text-slate-400 group-hover:translate-x-0.5 transition-transform shrink-0 ml-2" />
            </button>
          );
        })}
      </div>

      {/* Footer */}
      <div className="p-3 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/40">
        <button
          onClick={() => {
            showToast.info("Navigating to Fleet Reports Hub");
            onClose();
            navigate("/reports");
          }}
          className="w-full flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-bold transition-colors"
        >
          <span>All Fleet Reports Navigator</span>
        </button>
      </div>
    </aside>
  );
};

export default QuickReportsDrawer;
