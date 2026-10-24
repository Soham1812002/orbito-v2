import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Bell,
  ShieldCheck,
  Settings,
  Calendar,
  Clock,
  Gauge
} from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { Button } from "@/components/common/Button";
import { useCreateReminder } from "./reminders.queries";
import { reminderFormSchema, ReminderFormData } from "./reminders.schema";
import { showToast } from "@/lib/toast";

export const ReminderFormPage: React.FC = () => {
  const navigate = useNavigate();
  const createReminderMutation = useCreateReminder();

  const [formData, setFormData] = useState<Partial<ReminderFormData>>({
    companyName: "inOrbit Logistics",
    branchName: "West Operations",
    vehicleId: "veh-001",
    vehiclePlate: "GJ 05 AB 1234",
    vehicleGroup: "All groups",
    reminderType: "Engine Oil",
    reminderName: "",
    reminderDate: new Date().toISOString().split("T")[0],
    reminderTime: "09:00 AM",
    odometerDue: 50000,
    repeat: "Every 6 months",
    repeatIntervalMonths: 6,
    repeatIntervalKm: 10000,
    notifyBeforeDays: 7,
    notifyUser: "Fleet Manager",
    description: "",
    notifyEmail: true,
    notifySms: false,
    notifyApp: true,
    isActive: true
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleFieldChange = (field: keyof ReminderFormData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
  };

  const handleVehicleSelect = (plate: string) => {
    setFormData((prev) => ({
      ...prev,
      vehiclePlate: plate,
      vehicleId: plate.replace(/\s+/g, "-").toLowerCase()
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = reminderFormSchema.safeParse(formData);

    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.issues.forEach((issue) => {
        if (issue.path[0]) {
          fieldErrors[String(issue.path[0])] = issue.message;
        }
      });
      setErrors(fieldErrors);
      showToast.error("Please fill in all required fields correctly.");
      return;
    }

    try {
      await createReminderMutation.mutateAsync({
        companyName: result.data.companyName,
        branchName: result.data.branchName,
        vehicleId: result.data.vehicleId,
        vehiclePlate: result.data.vehiclePlate,
        vehicleGroup: result.data.vehicleGroup,
        reminderType: result.data.reminderType,
        reminderName: result.data.reminderName,
        nextServiceDate: result.data.reminderDate,
        nextMileage: result.data.odometerDue,
        reminderTime: result.data.reminderTime,
        repeatIntervalMonths: result.data.repeatIntervalMonths,
        repeatIntervalKm: result.data.repeatIntervalKm,
        notifyBeforeDays: result.data.notifyBeforeDays,
        notifyUser: result.data.notifyUser,
        description: result.data.description,
        notifyEmail: result.data.notifyEmail,
        notifySms: result.data.notifySms,
        notifyApp: result.data.notifyApp,
        status: "Upcoming",
        isActive: result.data.isActive
      });
      navigate("/maintenance/reminders/status");
    } catch {
      // toast is handled in mutation
    }
  };

  return (
    <div className="flex flex-col gap-6 w-full max-w-5xl mx-auto pb-12">
      {/* Page Header */}
      <PageHeader
        breadcrumbs={[
          { label: "Maintenance", href: "/maintenance" },
          { label: "Reminders", href: "/maintenance/reminders/status" },
          { label: "Add Reminder" }
        ]}
        title="Add Reminder"
        badge="NEW CONFIGURATION"
        badgeVariant="default"
        description="Schedule maintenance and operational reminders for a vehicle."
        actions={
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate("/maintenance/reminders/status")}
            className="gap-1.5 text-xs"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            BACK
          </Button>
        }
      />

      {/* Main Form Container */}
      <form onSubmit={handleSubmit} className="flex flex-col gap-6">
        <div className="panel-card p-6 border border-slate-200 dark:border-slate-800 rounded-xl bg-white dark:bg-slate-900 shadow-xs flex flex-col gap-6">
          {/* Card Header */}
          <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0 border border-blue-100 dark:border-blue-900/40">
                <Bell className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                  Reminder details
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Fields marked with an asterisk are required.
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => showToast.info("Notification rules are configured globally.")}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-600 dark:text-blue-400 hover:text-blue-700 cursor-pointer"
            >
              <Settings className="w-3.5 h-3.5" />
              NOTIFICATION SETTINGS
            </button>
          </div>

          {/* Section 1: Vehicle Assignment */}
          <div className="flex flex-col gap-4">
            <h3 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Vehicle Assignment
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Company */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-medium text-slate-700 dark:text-slate-300">
                  Company <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.companyName}
                  onChange={(e) => handleFieldChange("companyName", e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus-ring"
                >
                  <option value="inOrbit Logistics">inOrbit Logistics</option>
                  <option value="Metro Transport">Metro Transport</option>
                </select>
                {errors.companyName && <span className="text-2xs text-red-500">{errors.companyName}</span>}
              </div>

              {/* Branch */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-medium text-slate-700 dark:text-slate-300">
                  Branch <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.branchName}
                  onChange={(e) => handleFieldChange("branchName", e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus-ring"
                >
                  <option value="West Operations">West Operations</option>
                  <option value="North Operations">North Operations</option>
                  <option value="Central Fleet">Central Fleet</option>
                </select>
                {errors.branchName && <span className="text-2xs text-red-500">{errors.branchName}</span>}
              </div>

              {/* Vehicle */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-medium text-slate-700 dark:text-slate-300">
                  Vehicle <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.vehiclePlate}
                  onChange={(e) => handleVehicleSelect(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 font-mono focus-ring"
                >
                  <option value="GJ 05 AB 1234">GJ 05 AB 1234 — Tata Signa 4825</option>
                  <option value="GJ 01 KM 4821">GJ 01 KM 4821 — BharatBenz 3528C</option>
                  <option value="DL 01 AB 7532">DL 01 AB 7532 — Ashok Leyland 2820</option>
                  <option value="MH 14 DT 9087">MH 14 DT 9087 — Eicher Pro 3019</option>
                </select>
                {errors.vehiclePlate && <span className="text-2xs text-red-500">{errors.vehiclePlate}</span>}
              </div>

              {/* Vehicle Group */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-medium text-slate-700 dark:text-slate-300">
                  Vehicle group
                </label>
                <select
                  value={formData.vehicleGroup}
                  onChange={(e) => handleFieldChange("vehicleGroup", e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus-ring"
                >
                  <option value="All groups">All groups</option>
                  <option value="Heavy Haulage">Heavy Haulage</option>
                  <option value="Medium Freight">Medium Freight</option>
                  <option value="Interstate Linehaul">Interstate Linehaul</option>
                  <option value="City Delivery">City Delivery</option>
                </select>
              </div>
            </div>
          </div>

          {/* Section 2: Reminder Schedule */}
          <div className="flex flex-col gap-4 pt-4 border-t border-slate-100 dark:border-slate-800">
            <h3 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Reminder Schedule
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Reminder Type */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-medium text-slate-700 dark:text-slate-300">
                  Reminder type <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.reminderType}
                  onChange={(e) => handleFieldChange("reminderType", e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus-ring"
                >
                  <option value="Engine Oil">Engine Oil</option>
                  <option value="Tyre Rotation">Tyre Rotation</option>
                  <option value="Brake Inspection">Brake Inspection</option>
                  <option value="General Service">General Service</option>
                  <option value="Fitness Certificate">Fitness Certificate</option>
                  <option value="Insurance Renewal">Insurance Renewal</option>
                  <option value="Battery Check">Battery Check</option>
                </select>
                {errors.reminderType && <span className="text-2xs text-red-500">{errors.reminderType}</span>}
              </div>

              {/* Reminder Name */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-medium text-slate-700 dark:text-slate-300">
                  Reminder name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. Quarterly vehicle service"
                  value={formData.reminderName}
                  onChange={(e) => handleFieldChange("reminderName", e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus-ring"
                />
                {errors.reminderName && <span className="text-2xs text-red-500">{errors.reminderName}</span>}
              </div>

              {/* Reminder Date */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-medium text-slate-700 dark:text-slate-300">
                  Reminder date <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="date"
                    value={formData.reminderDate}
                    onChange={(e) => handleFieldChange("reminderDate", e.target.value)}
                    className="w-full pl-9 pr-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 font-mono focus-ring"
                  />
                </div>
                {errors.reminderDate && <span className="text-2xs text-red-500">{errors.reminderDate}</span>}
              </div>

              {/* Reminder Time */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-medium text-slate-700 dark:text-slate-300">
                  Reminder time
                </label>
                <div className="relative">
                  <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    placeholder="09:00 AM"
                    value={formData.reminderTime}
                    onChange={(e) => handleFieldChange("reminderTime", e.target.value)}
                    className="w-full pl-9 pr-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 font-mono focus-ring"
                  />
                </div>
              </div>

              {/* Odometer Due */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-medium text-slate-700 dark:text-slate-300">
                  Odometer due
                </label>
                <div className="relative">
                  <Gauge className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="number"
                    placeholder="Enter odometer value"
                    value={formData.odometerDue || ""}
                    onChange={(e) => handleFieldChange("odometerDue", Number(e.target.value))}
                    className="w-full pl-9 pr-12 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 font-mono focus-ring"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-2xs font-bold text-slate-400">
                    KM
                  </span>
                </div>
                {errors.odometerDue && <span className="text-2xs text-red-500">{errors.odometerDue}</span>}
              </div>

              {/* Repeat */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-medium text-slate-700 dark:text-slate-300">
                  Repeat
                </label>
                <select
                  value={formData.repeat}
                  onChange={(e) => {
                    const val = e.target.value;
                    handleFieldChange("repeat", val);
                    if (val.includes("3 months")) handleFieldChange("repeatIntervalMonths", 3);
                    if (val.includes("6 months")) handleFieldChange("repeatIntervalMonths", 6);
                    if (val.includes("12 months")) handleFieldChange("repeatIntervalMonths", 12);
                  }}
                  className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus-ring"
                >
                  <option value="Does not repeat">Does not repeat</option>
                  <option value="Every 3 months">Every 3 months</option>
                  <option value="Every 6 months">Every 6 months</option>
                  <option value="Every 12 months">Every 12 months</option>
                </select>
              </div>
            </div>
          </div>

          {/* Section 3: Notification Preferences */}
          <div className="flex flex-col gap-4 pt-4 border-t border-slate-100 dark:border-slate-800">
            <h3 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Notification Preferences
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Notify Before */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-medium text-slate-700 dark:text-slate-300">
                  Notify before
                </label>
                <select
                  value={formData.notifyBeforeDays}
                  onChange={(e) => handleFieldChange("notifyBeforeDays", Number(e.target.value))}
                  className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus-ring"
                >
                  <option value={1}>1 day before</option>
                  <option value={3}>3 days before</option>
                  <option value={7}>7 days before</option>
                  <option value={14}>14 days before</option>
                  <option value={30}>30 days before</option>
                </select>
              </div>

              {/* Notify User */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-medium text-slate-700 dark:text-slate-300">
                  Notify user
                </label>
                <select
                  value={formData.notifyUser}
                  onChange={(e) => handleFieldChange("notifyUser", e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus-ring"
                >
                  <option value="Fleet Manager">Fleet Manager (Kamal Patel)</option>
                  <option value="Operations Lead">Operations Lead</option>
                  <option value="Safety Compliance Desk">Safety Compliance Desk</option>
                </select>
              </div>

              {/* Description */}
              <div className="flex flex-col gap-1.5 md:col-span-2">
                <label className="text-xs font-medium text-slate-700 dark:text-slate-300">
                  Description
                </label>
                <textarea
                  rows={3}
                  placeholder="Add any reminder notes or maintenance instructions..."
                  value={formData.description}
                  onChange={(e) => handleFieldChange("description", e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus-ring resize-none"
                />
              </div>

              {/* Delivery Channels */}
              <div className="flex flex-wrap items-center gap-6 md:col-span-2 pt-2">
                <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-700 dark:text-slate-300">
                  <input
                    type="checkbox"
                    checked={formData.notifyEmail}
                    onChange={(e) => handleFieldChange("notifyEmail", e.target.checked)}
                    className="w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500"
                  />
                  Send email notification
                </label>

                <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-700 dark:text-slate-300">
                  <input
                    type="checkbox"
                    checked={formData.notifyApp}
                    onChange={(e) => handleFieldChange("notifyApp", e.target.checked)}
                    className="w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500"
                  />
                  Enable in-app alert
                </label>

                <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-700 dark:text-slate-300">
                  <input
                    type="checkbox"
                    checked={formData.isActive}
                    onChange={(e) => handleFieldChange("isActive", e.target.checked)}
                    className="w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500"
                  />
                  Reminder is active
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Actions Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs">
          <div className="flex items-center gap-2 text-2xs text-slate-500 dark:text-slate-400">
            <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            Notifications are sent according to your selected schedule.
          </div>
          <div className="flex items-center gap-3">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => navigate("/maintenance/reminders/status")}
              className="text-xs"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              size="sm"
              isLoading={createReminderMutation.isPending}
              className="text-xs"
            >
              Save Reminder
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default ReminderFormPage;
