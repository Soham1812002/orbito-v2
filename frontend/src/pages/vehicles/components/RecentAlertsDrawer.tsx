import React from "react";
import { useNavigate } from "react-router-dom";
import {
  X,
  Bell,
  Flame,
  AlertTriangle,
  Clock,
  Radio,
  MapPin,
  ShieldAlert,
  ArrowRight,
  CheckCircle,
  ExternalLink
} from "lucide-react";
import { useRecentAlertsFeed, useAcknowledgeAlert } from "@/pages/alerts/alerts.queries";
import { AlertLog } from "@/pages/alerts/alerts.types";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

dayjs.extend(relativeTime);

interface RecentAlertsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectVehicle: (vehicleId: string) => void;
}

export const RecentAlertsDrawer: React.FC<RecentAlertsDrawerProps> = ({
  isOpen,
  onClose,
  onSelectVehicle
}) => {
  const navigate = useNavigate();
  const { data: alerts = [], isLoading, refetch } = useRecentAlertsFeed(15);
  const ackMutation = useAcknowledgeAlert();

  if (!isOpen) return null;

  return (
    <aside
      aria-label="Recent Alerts Feed"
      className="absolute top-4 right-4 bottom-4 z-30 w-full sm:w-96 max-w-[calc(100vw-2rem)] flex flex-col rounded-2xl border border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md shadow-2xl overflow-hidden transition-all duration-300"
    >
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 p-4 bg-slate-50/50 dark:bg-slate-950/40">
        <div className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-rose-500/10 text-rose-500">
            <Bell className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                Recent Alerts Feed
              </h2>
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-500"></span>
              </span>
            </div>
            <p className="text-[11px] text-slate-500">Live telematics event stream</p>
          </div>
        </div>
        <button
          onClick={onClose}
          aria-label="Close alerts feed"
          className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-800 dark:hover:text-slate-200 transition-colors"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      {/* Feed List */}
      <div className="flex-1 overflow-y-auto p-3 space-y-2.5">
        {isLoading ? (
          <div className="py-12 text-center text-xs text-slate-400">Loading incoming alerts...</div>
        ) : alerts.length === 0 ? (
          <div className="py-12 text-center text-xs text-slate-400">No active alerts recorded.</div>
        ) : (
          alerts.map((alert: AlertLog) => (
            <div
              key={alert.id}
              className="rounded-xl border border-slate-200 dark:border-slate-800/80 bg-white dark:bg-slate-950/60 p-3 shadow-xs hover:border-slate-300 dark:hover:border-slate-700 transition-all space-y-2"
            >
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs font-bold text-slate-900 dark:text-white">
                  {alert.plateNumber}
                </span>
                <span
                  className={`px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider ${
                    alert.severity === "critical"
                      ? "bg-rose-500/10 text-rose-600 border border-rose-500/20"
                      : alert.severity === "warning"
                      ? "bg-amber-500/10 text-amber-600 border border-amber-500/20"
                      : "bg-blue-500/10 text-blue-600 border border-blue-500/20"
                  }`}
                >
                  {alert.severity}
                </span>
              </div>

              <div className="flex items-start gap-2">
                <div className="mt-0.5 shrink-0">
                  {alert.alertType === "overspeed" && <Flame className="h-4 w-4 text-rose-500" />}
                  {alert.alertType === "geofence_breach" && <MapPin className="h-4 w-4 text-amber-500" />}
                  {alert.alertType === "power_cut" && <Radio className="h-4 w-4 text-red-500" />}
                  {alert.alertType === "harsh_braking" && <AlertTriangle className="h-4 w-4 text-amber-500" />}
                  {alert.alertType === "idle_timeout" && <Clock className="h-4 w-4 text-blue-500" />}
                  {alert.alertType === "sos" && <ShieldAlert className="h-4 w-4 text-red-500" />}
                  {!["overspeed", "geofence_breach", "power_cut", "harsh_braking", "idle_timeout", "sos"].includes(alert.alertType) && (
                    <Bell className="h-4 w-4 text-slate-500" />
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-semibold text-slate-900 dark:text-slate-100 truncate">
                    {alert.alertName}
                  </p>
                  <p className="text-[11px] text-slate-500 line-clamp-2 leading-relaxed">
                    {alert.message}
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between pt-1 border-t border-slate-100 dark:border-slate-850 text-[10px] text-slate-400">
                <span className="font-mono">{dayjs(alert.createdAt).fromNow()}</span>
                <div className="flex items-center gap-2">
                  {alert.status === "pending" && (
                    <button
                      onClick={() => ackMutation.mutate({ id: alert.id })}
                      className="inline-flex items-center gap-1 text-emerald-600 hover:text-emerald-700 font-semibold"
                    >
                      <CheckCircle className="h-3 w-3" /> Ack
                    </button>
                  )}
                  <button
                    onClick={() => {
                      onSelectVehicle(alert.vehicleId);
                      onClose();
                    }}
                    className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-700 font-semibold"
                  >
                    Locate <ArrowRight className="h-3 w-3" />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Footer */}
      <div className="p-3 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/40">
        <button
          onClick={() => {
            onClose();
            navigate("/alerts");
          }}
          className="w-full flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-colors shadow-sm"
        >
          <span>Open Full Incident Log</span>
          <ExternalLink className="h-3.5 w-3.5" />
        </button>
      </div>
    </aside>
  );
};

export default RecentAlertsDrawer;
