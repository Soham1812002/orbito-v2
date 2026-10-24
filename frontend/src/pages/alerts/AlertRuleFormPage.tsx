import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Bell,
  Save,
  ArrowLeft,
  Sliders,
  ShieldAlert,
  Flame,
  AlertTriangle,
  Clock,
  Radio,
  MapPin,
  Smartphone,
  Mail,
  Users,
  Check
} from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { Button } from "@/components/common/Button";
import { alertRuleFormSchema, AlertRuleFormSchema } from "./alerts.schema";
import { useAlertRuleDetail, useCreateAlertRule, useUpdateAlertRule } from "./alerts.queries";

const DAYS_OF_WEEK = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

const ALERT_TYPES = [
  { value: "overspeed", label: "Overspeeding Trigger", icon: Flame, defaultSeverity: "critical" },
  { value: "geofence_breach", label: "Geofence Boundary Breach", icon: MapPin, defaultSeverity: "warning" },
  { value: "power_cut", label: "GPS Hardware Power Disconnect", icon: Radio, defaultSeverity: "critical" },
  { value: "harsh_braking", label: "Harsh Braking & Deceleration", icon: AlertTriangle, defaultSeverity: "warning" },
  { value: "idle_timeout", label: "Excessive Engine Idling", icon: Clock, defaultSeverity: "info" },
  { value: "sos", label: "Emergency SOS Panic Button", icon: ShieldAlert, defaultSeverity: "critical" }
];

export const AlertRuleFormPage: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const isEdit = Boolean(id);

  const { data: existingRule, isLoading: isLoadingRule } = useAlertRuleDetail(id);
  const createMutation = useCreateAlertRule();
  const updateMutation = useUpdateAlertRule();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors }
  } = useForm<AlertRuleFormSchema>({
    resolver: zodResolver(alertRuleFormSchema),
    defaultValues: {
      name: "",
      alertType: "overspeed",
      severity: "critical",
      vehicleScope: "all",
      vehicleIds: [],
      speedLimit: 80,
      durationSeconds: 15,
      idleMinutes: 30,
      activeDays: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
      startTime: "00:00",
      endTime: "23:59",
      notifySms: false,
      notifyEmail: true,
      notifyPush: true,
      recipients: ["Super Admin", "Fleet Dispatch"],
      isActive: true
    }
  });

  const alertType = watch("alertType");
  const severity = watch("severity");
  const vehicleScope = watch("vehicleScope");
  const activeDays = watch("activeDays");
  const notifySms = watch("notifySms");
  const notifyEmail = watch("notifyEmail");
  const notifyPush = watch("notifyPush");
  const isActive = watch("isActive");

  useEffect(() => {
    if (existingRule) {
      setValue("name", existingRule.name);
      setValue("alertType", existingRule.alertType);
      setValue("severity", existingRule.severity);
      setValue("vehicleScope", existingRule.vehicleScope);
      setValue("vehicleIds", existingRule.vehicleIds || []);
      if (existingRule.conditions?.speedLimit) setValue("speedLimit", existingRule.conditions.speedLimit);
      if (existingRule.conditions?.durationSeconds) setValue("durationSeconds", existingRule.conditions.durationSeconds);
      if (existingRule.conditions?.idleMinutes) setValue("idleMinutes", existingRule.conditions.idleMinutes);
      if (existingRule.schedule?.days) setValue("activeDays", existingRule.schedule.days);
      if (existingRule.schedule?.start) setValue("startTime", existingRule.schedule.start);
      if (existingRule.schedule?.end) setValue("endTime", existingRule.schedule.end);
      setValue("notifySms", Boolean(existingRule.channels?.sms));
      setValue("notifyEmail", Boolean(existingRule.channels?.email));
      setValue("notifyPush", Boolean(existingRule.channels?.push));
      setValue("recipients", existingRule.recipients || []);
      setValue("isActive", existingRule.isActive);
    }
  }, [existingRule, setValue]);

  const toggleDay = (day: string) => {
    if (activeDays.includes(day)) {
      if (activeDays.length > 1) {
        setValue("activeDays", activeDays.filter((d) => d !== day));
      }
    } else {
      setValue("activeDays", [...activeDays, day]);
    }
  };

  const onSubmit = async (values: AlertRuleFormSchema) => {
    if (isEdit && id) {
      await updateMutation.mutateAsync({ id, payload: values });
    } else {
      await createMutation.mutateAsync(values);
    }
    navigate("/alerts/rules");
  };

  const isSubmitting = createMutation.isPending || updateMutation.isPending;

  return (
    <div className="space-y-6 pb-24">
      <PageHeader
        breadcrumbs={[
          { label: "Dashboard", href: "/dashboard" },
          { label: "Alerts", href: "/alerts" },
          { label: "Rules", href: "/alerts/rules" },
          { label: isEdit ? "Edit Rule" : "New Rule" }
        ]}
        title={isEdit ? "Edit Alert Policy" : "Configure New Alert Policy"}
        badge={isEdit ? "EDIT POLICY" : "NEW POLICY"}
        badgeVariant="cyan"
        description="Establish automated real-time thresholds, scheduled monitoring windows, and multi-channel recipient alerts."
        actions={
          <Button
            variant="outline"
            size="sm"
            leftIcon={<ArrowLeft className="h-3.5 w-3.5" />}
            onClick={() => navigate("/alerts/rules")}
          >
            Cancel
          </Button>
        }
      />

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 max-w-5xl">
        {/* Panel 1: Rule Identity & Classification */}
        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm space-y-5">
          <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
            <Bell className="h-5 w-5 text-blue-500" />
            <h2 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
              1. Policy Identity & Severity Classification
            </h2>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-1.5 sm:col-span-2">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                Rule Name <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                placeholder="e.g. Yamuna Expressway High Speed Threshold (>80 km/h)"
                {...register("name")}
                className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/60 px-3.5 py-2.5 text-xs font-medium text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {errors.name && <p className="text-[11px] text-rose-500">{errors.name.message}</p>}
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                Alert Type <span className="text-rose-500">*</span>
              </label>
              <select
                {...register("alertType")}
                className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/60 px-3.5 py-2.5 text-xs font-medium text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {ALERT_TYPES.map((t) => (
                  <option key={t.value} value={t.value}>
                    {t.label}
                  </option>
                ))}
              </select>
              {errors.alertType && <p className="text-[11px] text-rose-500">{errors.alertType.message}</p>}
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                Severity Level <span className="text-rose-500">*</span>
              </label>
              <div className="grid grid-cols-3 gap-2">
                {(["critical", "warning", "info"] as const).map((sev) => (
                  <button
                    key={sev}
                    type="button"
                    onClick={() => setValue("severity", sev)}
                    className={`py-2 px-3 rounded-xl text-xs font-bold uppercase tracking-wider transition-all border ${
                      severity === sev
                        ? sev === "critical"
                          ? "bg-rose-500/20 text-rose-600 border-rose-500 shadow-sm"
                          : sev === "warning"
                          ? "bg-amber-500/20 text-amber-600 border-amber-500 shadow-sm"
                          : "bg-blue-500/20 text-blue-600 border-blue-500 shadow-sm"
                        : "bg-slate-50 dark:bg-slate-800/60 text-slate-500 border-slate-200 dark:border-slate-800 hover:bg-slate-100"
                    }`}
                  >
                    {sev}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Panel 2: Target Vehicle Scope */}
        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm space-y-5">
          <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
            <Users className="h-5 w-5 text-indigo-500" />
            <h2 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
              2. Vehicle Fleet Assignment
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {[
              { id: "all", label: "Entire Fleet", desc: "Apply rule across all 25 active vehicles" },
              { id: "group", label: "Vehicle Group", desc: "Apply rule to specific branch or category" },
              { id: "specific", label: "Individual Vehicles", desc: "Select specific registration plates" }
            ].map((option) => (
              <div
                key={option.id}
                onClick={() => setValue("vehicleScope", option.id as any)}
                className={`p-4 rounded-xl border cursor-pointer transition-all ${
                  vehicleScope === option.id
                    ? "border-blue-500 bg-blue-50/50 dark:bg-blue-950/20 shadow-sm"
                    : "border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/40 hover:border-slate-300"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-900 dark:text-white">{option.label}</span>
                  {vehicleScope === option.id && <Check className="h-4 w-4 text-blue-500" />}
                </div>
                <p className="mt-1 text-[11px] text-slate-500 leading-relaxed">{option.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Panel 3: Trigger Conditions & Thresholds */}
        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm space-y-5">
          <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
            <Sliders className="h-5 w-5 text-amber-500" />
            <h2 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
              3. Trigger Conditions & Operational Thresholds
            </h2>
          </div>

          {alertType === "overspeed" && (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Speed Limit Trigger (km/h)
                </label>
                <div className="relative">
                  <input
                    type="number"
                    min="20"
                    max="160"
                    {...register("speedLimit", { valueAsNumber: true })}
                    className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/60 px-3.5 py-2.5 text-xs font-mono font-bold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <span className="absolute right-3.5 top-2.5 text-xs font-semibold text-slate-400">KM/H</span>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Duration Threshold (Seconds)
                </label>
                <div className="relative">
                  <input
                    type="number"
                    min="1"
                    max="300"
                    {...register("durationSeconds", { valueAsNumber: true })}
                    className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/60 px-3.5 py-2.5 text-xs font-mono font-bold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <span className="absolute right-3.5 top-2.5 text-xs font-semibold text-slate-400">SECS</span>
                </div>
              </div>
            </div>
          )}

          {alertType === "idle_timeout" && (
            <div className="space-y-1.5 max-w-sm">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                Max Allowed Engine Idling (Minutes)
              </label>
              <div className="relative">
                <input
                  type="number"
                  min="5"
                  max="120"
                  {...register("idleMinutes", { valueAsNumber: true })}
                  className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/60 px-3.5 py-2.5 text-xs font-mono font-bold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <span className="absolute right-3.5 top-2.5 text-xs font-semibold text-slate-400">MINS</span>
              </div>
            </div>
          )}

          {alertType === "geofence_breach" && (
            <div className="space-y-1.5 max-w-sm">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                Monitored Geofence Zone
              </label>
              <select
                {...register("geofenceId")}
                className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/60 px-3.5 py-2.5 text-xs font-medium text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="geo-ahmedabad">Ahmedabad Hub Perimeter</option>
                <option value="geo-delhi">Delhi NCR Logistics Corridor</option>
                <option value="geo-mumbai">JNPT Port Terminal Yard</option>
              </select>
            </div>
          )}

          {["power_cut", "harsh_braking", "sos"].includes(alertType) && (
            <p className="text-xs text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-950/60 p-3.5 rounded-xl border border-slate-200/80 dark:border-slate-800">
              Hardware sensor event is triggered instantaneously upon telemetry packet transmission from the on-board GPS telematics unit.
            </p>
          )}
        </div>

        {/* Panel 4: Schedule & Delivery Channels */}
        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm space-y-5">
          <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
            <Clock className="h-5 w-5 text-emerald-500" />
            <h2 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
              4. Monitoring Schedule & Delivery Channels
            </h2>
          </div>

          <div className="space-y-4">
            <div>
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-2">
                Active Monitoring Days
              </label>
              <div className="flex flex-wrap gap-2">
                {DAYS_OF_WEEK.map((day) => {
                  const isSelected = activeDays.includes(day);
                  return (
                    <button
                      key={day}
                      type="button"
                      onClick={() => toggleDay(day)}
                      className={`h-9 px-3.5 rounded-xl text-xs font-bold transition-all border ${
                        isSelected
                          ? "bg-blue-600 text-white border-blue-600 shadow-sm"
                          : "bg-slate-50 dark:bg-slate-800/60 text-slate-500 border-slate-200 dark:border-slate-800 hover:bg-slate-100"
                      }`}
                    >
                      {day}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 max-w-sm">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Start Time</label>
                <input
                  type="time"
                  {...register("startTime")}
                  className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/60 px-3 py-2 text-xs font-mono font-medium text-slate-900 dark:text-white"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">End Time</label>
                <input
                  type="time"
                  {...register("endTime")}
                  className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/60 px-3 py-2 text-xs font-mono font-medium text-slate-900 dark:text-white"
                />
              </div>
            </div>

            <div className="border-t border-slate-100 dark:border-slate-800 pt-4">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-2">
                Notification Delivery Channels
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <label className="flex items-center gap-3 p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/40 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={notifyPush}
                    onChange={(e) => setValue("notifyPush", e.target.checked)}
                    className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                  />
                  <div className="flex items-center gap-2 text-xs font-semibold text-slate-800 dark:text-slate-200">
                    <Bell className="h-4 w-4 text-amber-500" />
                    <span>In-App Push</span>
                  </div>
                </label>

                <label className="flex items-center gap-3 p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/40 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={notifyEmail}
                    onChange={(e) => setValue("notifyEmail", e.target.checked)}
                    className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                  />
                  <div className="flex items-center gap-2 text-xs font-semibold text-slate-800 dark:text-slate-200">
                    <Mail className="h-4 w-4 text-indigo-500" />
                    <span>Email Digest</span>
                  </div>
                </label>

                <label className="flex items-center gap-3 p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/40 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={notifySms}
                    onChange={(e) => setValue("notifySms", e.target.checked)}
                    className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                  />
                  <div className="flex items-center gap-2 text-xs font-semibold text-slate-800 dark:text-slate-200">
                    <Smartphone className="h-4 w-4 text-blue-500" />
                    <span>Urgent SMS</span>
                  </div>
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* Floating Sticky Action Footer */}
        <div className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-t border-slate-200 dark:border-slate-800 p-4">
          <div className="max-w-5xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className={`h-2.5 w-2.5 rounded-full ${isActive ? "bg-emerald-500" : "bg-slate-400"}`} />
              <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                Policy Status: {isActive ? "Active (Monitoring)" : "Inactive (Muted)"}
              </span>
            </div>

            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                size="md"
                onClick={() => navigate("/alerts/rules")}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="primary"
                size="md"
                leftIcon={<Save className="h-4 w-4" />}
                isLoading={isSubmitting}
              >
                {isEdit ? "Update Policy" : "Save Policy"}
              </Button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default AlertRuleFormPage;
