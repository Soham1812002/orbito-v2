import React, { useState } from "react";
import { X, CalendarDays, Mail, FileSpreadsheet, Check } from "lucide-react";
import toast from "react-hot-toast";
import { ScheduledReportItem, ScheduledReportFormData } from "@/types/reports.types";
import { reportsApi } from "@/api/reports.api";

interface AddScheduledReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (newSchedule: ScheduledReportItem) => void;
}

export const AddScheduledReportModal: React.FC<AddScheduledReportModalProps> = ({
  isOpen,
  onClose,
  onSuccess
}) => {
  const [formData, setFormData] = useState<ScheduledReportFormData>({
    scheduleName: "Daily Operations Summary",
    reportType: "Travel Summary",
    fileFormat: "Excel (.xlsx)",
    company: "Apex Logistics",
    branch: "All Branches",
    vehicles: "All active vehicles (48)",
    frequency: "Daily",
    deliveryTime: "07:00 AM",
    recipients: "fleet-ops@apexlogistics.in, director@apexlogistics.in",
    subject: "Automated Daily Fleet Operations Summary"
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.scheduleName.trim()) {
      toast.error("Please enter a schedule name");
      return;
    }
    if (!formData.recipients.trim()) {
      toast.error("Please provide at least one recipient email");
      return;
    }

    setIsSubmitting(true);
    try {
      const created = await reportsApi.createScheduledReport({
        scheduleName: formData.scheduleName,
        reportType: formData.reportType,
        company: formData.company,
        branch: formData.branch,
        vehicleScope: formData.vehicles,
        frequency: formData.frequency,
        fileFormat: formData.fileFormat,
        recipients: formData.recipients.split(",").map((s) => s.trim())
      });

      toast.success("Scheduled report created successfully!");
      onSuccess(created);
      onClose();
    } catch {
      toast.error("Failed to create scheduled report");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      {/* Modal Dialog (Figma #1058:6336 layout) */}
      <div className="relative w-full max-w-2xl rounded-2xl bg-white dark:bg-[#0F172B] border border-slate-200 dark:border-[#1D293D] shadow-2xl overflow-hidden z-10 max-h-[90vh] flex flex-col">
        {/* Modal Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-100 dark:border-slate-800">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold tracking-widest uppercase text-blue-600 dark:text-cyan-400 bg-blue-50 dark:bg-blue-950/60 px-2 py-0.5 rounded-full border border-blue-200 dark:border-blue-800/60">
                AUTOMATION
              </span>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Add Scheduled Report
              </h3>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Configure an automated fleet report and deliver it to your operations team on a recurring schedule.
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Modal Form Body */}
        <form onSubmit={handleSubmit} className="overflow-y-auto p-5 space-y-5 text-xs flex-1">
          {/* Section 1: Report Details */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 border-b border-slate-100 dark:border-slate-800 pb-1">
              Report Configuration
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div>
                <label className="block text-[11px] font-bold uppercase text-slate-600 dark:text-slate-300 mb-1">
                  Schedule Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.scheduleName}
                  onChange={(e) => setFormData({ ...formData, scheduleName: e.target.value })}
                  placeholder="e.g. Daily operations summary"
                  className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 text-slate-900 dark:text-slate-100 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase text-slate-600 dark:text-slate-300 mb-1">
                  Report Type *
                </label>
                <select
                  value={formData.reportType}
                  onChange={(e) => setFormData({ ...formData, reportType: e.target.value })}
                  className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 text-slate-900 dark:text-slate-100 focus:outline-none focus:border-blue-500"
                >
                  <option value="Travel Summary">Travel Summary</option>
                  <option value="Trip Summary">Trip Summary</option>
                  <option value="Stoppage Summary">Stoppage Summary</option>
                  <option value="Ignition Summary">Ignition Summary</option>
                  <option value="AC Summary">AC Summary</option>
                  <option value="Idle Summary">Idle Summary</option>
                  <option value="Inactive Summary">Inactive Summary</option>
                  <option value="Digital Port Summary">Digital Port Summary</option>
                  <option value="Vehicle Status">Vehicle Status</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase text-slate-600 dark:text-slate-300 mb-1">
                  File Format *
                </label>
                <select
                  value={formData.fileFormat}
                  onChange={(e) => setFormData({ ...formData, fileFormat: e.target.value as any })}
                  className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 text-slate-900 dark:text-slate-100 focus:outline-none focus:border-blue-500"
                >
                  <option value="Excel (.xlsx)">Excel (.xlsx)</option>
                  <option value="PDF">PDF Document</option>
                  <option value="CSV">CSV Spreadsheet</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase text-slate-600 dark:text-slate-300 mb-1">
                  Fleet Scope
                </label>
                <input
                  type="text"
                  value={formData.vehicles}
                  onChange={(e) => setFormData({ ...formData, vehicles: e.target.value })}
                  placeholder="e.g. All active vehicles (48)"
                  className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 text-slate-900 dark:text-slate-100 focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>
          </div>

          {/* Section 2: Delivery Schedule */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 border-b border-slate-100 dark:border-slate-800 pb-1">
              Delivery Schedule & Recipients
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div>
                <label className="block text-[11px] font-bold uppercase text-slate-600 dark:text-slate-300 mb-1">
                  Delivery Frequency *
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {(["Daily", "Weekly", "Monthly"] as const).map((freq) => (
                    <button
                      type="button"
                      key={freq}
                      onClick={() => setFormData({ ...formData, frequency: freq })}
                      className={`py-2 px-3 rounded-xl font-semibold text-center border transition-all ${
                        formData.frequency === freq
                          ? "bg-blue-600 text-white border-blue-600 shadow-xs"
                          : "bg-slate-100 dark:bg-slate-800/80 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300"
                      }`}
                    >
                      {freq}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase text-slate-600 dark:text-slate-300 mb-1">
                  Delivery Time
                </label>
                <input
                  type="text"
                  value={formData.deliveryTime}
                  onChange={(e) => setFormData({ ...formData, deliveryTime: e.target.value })}
                  placeholder="e.g. 07:00 AM"
                  className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 text-slate-900 dark:text-slate-100 focus:outline-none focus:border-blue-500 font-mono"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-[11px] font-bold uppercase text-slate-600 dark:text-slate-300 mb-1">
                  Email Recipients * (comma-separated)
                </label>
                <input
                  type="text"
                  required
                  value={formData.recipients}
                  onChange={(e) => setFormData({ ...formData, recipients: e.target.value })}
                  placeholder="e.g. fleet-ops@apexlogistics.in, director@apexlogistics.in"
                  className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 text-slate-900 dark:text-slate-100 focus:outline-none focus:border-blue-500 font-mono"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-[11px] font-bold uppercase text-slate-600 dark:text-slate-300 mb-1">
                  Email Subject Line
                </label>
                <input
                  type="text"
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  placeholder="e.g. Daily operations summary"
                  className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 text-slate-900 dark:text-slate-100 focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>
          </div>

          {/* Modal Actions */}
          <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 font-medium transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-xs transition-colors flex items-center gap-1.5 disabled:opacity-50"
            >
              <Check className="h-4 w-4" />
              <span>{isSubmitting ? "Saving..." : "Save Schedule"}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
