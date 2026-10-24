import React from "react";
import { useNavigate } from "react-router-dom";
import {
  X,
  Wrench,
  AlertTriangle,
  Calendar,
  Gauge,
  Plus,
  ExternalLink,
  CheckCircle2,
  Clock
} from "lucide-react";
import { useMaintenanceReminders } from "@/pages/maintenance/reminders/reminders.queries";
import { MaintenanceReminder } from "@/pages/maintenance/reminders/reminders.types";
import { VehicleTelemetry } from "../vehicles.types";

interface VehicleRemindersDrawerProps {
  vehicle: VehicleTelemetry | null;
  isOpen: boolean;
  onClose: () => void;
}

export const VehicleRemindersDrawer: React.FC<VehicleRemindersDrawerProps> = ({
  vehicle,
  isOpen,
  onClose
}) => {
  const navigate = useNavigate();

  const { data, isLoading } = useMaintenanceReminders({
    vehicle: vehicle?.plateNumber || undefined
  });

  if (!isOpen || !vehicle) return null;

  const reminders = data?.rows || [];

  return (
    <aside
      aria-label="Vehicle Reminders Context Drawer"
      className="absolute top-4 right-4 bottom-4 z-30 w-full sm:w-96 max-w-[calc(100vw-2rem)] flex flex-col rounded-2xl border border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md shadow-2xl overflow-hidden transition-all duration-300"
    >
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 p-4 bg-slate-50/50 dark:bg-slate-950/40">
        <div className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-600/10 text-blue-600">
            <Wrench className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
              Vehicle Reminders
            </h2>
            <p className="font-mono text-xs font-bold text-blue-600 dark:text-blue-400">
              {vehicle.plateNumber}
            </p>
          </div>
        </div>
        <button
          onClick={onClose}
          aria-label="Close reminders drawer"
          className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-800 dark:hover:text-slate-200 transition-colors"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-3 space-y-3">
        <div className="rounded-xl border border-slate-200/80 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-950/60 p-3 flex items-center justify-between">
          <div>
            <span className="text-[10px] text-slate-500 uppercase tracking-wider block">Current Odometer</span>
            <span className="font-mono text-sm font-bold text-slate-900 dark:text-white">
              {vehicle.odometer.toLocaleString()} km
            </span>
          </div>
          <button
            onClick={() => {
              onClose();
              navigate(`/maintenance/reminders/new?vehicle=${vehicle.plateNumber}`);
            }}
            className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-[11px] font-bold transition-colors shadow-xs"
          >
            <Plus className="h-3.5 w-3.5" />
            Add Reminder
          </button>
        </div>

        {isLoading ? (
          <div className="py-12 text-center text-xs text-slate-400">Loading service schedules...</div>
        ) : reminders.length === 0 ? (
          <div className="py-12 text-center text-xs text-slate-400 space-y-2">
            <p>No active reminders configured for this asset.</p>
            <button
              onClick={() => {
                onClose();
                navigate(`/maintenance/reminders/new?vehicle=${vehicle.plateNumber}`);
              }}
              className="text-blue-600 dark:text-blue-400 font-semibold hover:underline text-xs"
            >
              + Create first reminder
            </button>
          </div>
        ) : (
          reminders.map((r: MaintenanceReminder) => {
            const isOverdue = r.status === "Overdue";
            const isUpcoming = r.status === "Upcoming";

            return (
              <div
                key={r.id}
                className="rounded-xl border border-slate-200 dark:border-slate-800/80 bg-white dark:bg-slate-950/60 p-3 shadow-xs space-y-2"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-900 dark:text-white truncate">
                    {r.reminderName}
                  </span>
                  <span
                    className={`px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider ${
                      isOverdue
                        ? "bg-rose-500/10 text-rose-600 border border-rose-500/20"
                        : isUpcoming
                        ? "bg-amber-500/10 text-amber-600 border border-amber-500/20"
                        : "bg-emerald-500/10 text-emerald-600 border border-emerald-500/20"
                    }`}
                  >
                    {r.status}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-[11px] pt-1">
                  <div className="flex items-center gap-1.5 text-slate-500">
                    <Calendar className="h-3.5 w-3.5 text-blue-500" />
                    <span className="font-mono">{r.nextServiceDate}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-slate-500">
                    <Gauge className="h-3.5 w-3.5 text-emerald-500" />
                    <span className="font-mono">{r.nextMileage.toLocaleString()} km</span>
                  </div>
                </div>

                {r.description && (
                  <p className="text-[11px] text-slate-400 line-clamp-1 italic">
                    {r.description}
                  </p>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Footer */}
      <div className="p-3 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/40">
        <button
          onClick={() => {
            onClose();
            navigate("/maintenance/reminders/status");
          }}
          className="w-full flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-bold transition-colors"
        >
          <span>View All Fleet Reminders</span>
          <ExternalLink className="h-3.5 w-3.5" />
        </button>
      </div>
    </aside>
  );
};

export default VehicleRemindersDrawer;
