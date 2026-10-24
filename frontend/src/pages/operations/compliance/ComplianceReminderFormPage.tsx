import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  FileText,
  ArrowLeft,
  Save,
  Truck,
  User,
  Warehouse,
  Calendar,
  Bell,
  Mail,
  Smartphone,
  ShieldCheck
} from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { Button } from "@/components/common/Button";
import { useComplianceReminders, useCreateComplianceReminder, useUpdateComplianceReminder } from "./compliance.queries";
import { ComplianceFormData } from "./compliance.types";
import { complianceSchema } from "./compliance.schema";
import { showToast } from "@/lib/toast";

const STANDARD_CATEGORIES = [
  "Comprehensive Commercial Insurance",
  "State Fitness Certificate",
  "Pollution Under Control (PUC)",
  "National All-India Goods Permit",
  "State Road Tax",
  "Heavy Transport Driving License",
  "Driver Annual Medical Clearance",
  "Hazardous Material Transport Endorsement",
  "Depot Fire Safety Inspection Certificate"
];

export const ComplianceReminderFormPage: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const isEdit = Boolean(id);

  const { data: remindersData } = useComplianceReminders();
  const createMutation = useCreateComplianceReminder();
  const updateMutation = useUpdateComplianceReminder();

  const [formData, setFormData] = useState<ComplianceFormData>({
    companyName: "inOrbit Logistics",
    branchName: "West Operations Hub",
    entityType: "vehicle",
    entityId: "veh-001",
    entityIdentifier: "",
    reminderCategory: STANDARD_CATEGORIES[0],
    documentNumber: "",
    issueDate: "",
    expiryDate: "",
    notifyBeforeDays: 30,
    notifyEmail: true,
    notifySms: false,
    notifyPush: true,
    status: "active",
    notes: ""
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (isEdit && remindersData?.rows) {
      const existing = remindersData.rows.find((r) => r.id === id);
      if (existing) {
        setFormData({
          companyName: existing.companyName || "inOrbit Logistics",
          branchName: existing.branchName || "West Operations Hub",
          entityType: existing.entityType,
          entityId: existing.entityId,
          entityIdentifier: existing.entityIdentifier,
          reminderCategory: existing.reminderCategory,
          documentNumber: existing.documentNumber || "",
          issueDate: existing.issueDate || "",
          expiryDate: existing.expiryDate,
          notifyBeforeDays: existing.notifyBeforeDays,
          notifyEmail: existing.notifyEmail,
          notifySms: existing.notifySms,
          notifyPush: existing.notifyPush,
          status: existing.status,
          notes: existing.notes || ""
        });
      }
    }
  }, [isEdit, id, remindersData]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    const result = complianceSchema.safeParse(formData);
    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.issues.forEach((issue) => {
        fieldErrors[issue.path.join(".")] = issue.message;
      });
      setErrors(fieldErrors);
      showToast.error("Please resolve the highlighted validation errors");
      return;
    }

    if (isEdit && id) {
      updateMutation.mutate(
        { id, data: formData },
        {
          onSuccess: () => navigate("/operations/compliance")
        }
      );
    } else {
      createMutation.mutate(formData, {
        onSuccess: () => navigate("/operations/compliance")
      });
    }
  };

  const isSaving = createMutation.isPending || updateMutation.isPending;

  return (
    <form onSubmit={handleSubmit} className="space-y-6 pb-20">
      <PageHeader
        title={isEdit ? `Edit Reminder: ${formData.reminderCategory}` : "Add Statutory Reminder"}
        description="Configure regulatory expiration dates, document archives, advance notice thresholds, and multichannel notifications"
        breadcrumbs={[
          { label: "Dashboard", href: "/" },
          { label: "Operations", href: "/operations/compliance" },
          { label: "Compliance Reminders", href: "/operations/compliance" },
          { label: isEdit ? "Edit Reminder" : "New Reminder" }
        ]}
        actions={
          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => navigate("/operations/compliance")}
              leftIcon={<ArrowLeft className="w-4 h-4" />}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              size="sm"
              isLoading={isSaving}
              leftIcon={<Save className="w-4 h-4" />}
            >
              {isEdit ? "Update Reminder" : "Save Reminder"}
            </Button>
          </div>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Panel 1: Target Entity & Document Category */}
        <div className="panel-card p-5 space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
            <FileText className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            <h3 className="text-sm font-semibold text-slate-900 dark:text-white">
              Target Entity & Document Classification
            </h3>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                Entity Type <span className="text-rose-500">*</span>
              </label>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { type: "vehicle", label: "Vehicle", icon: Truck },
                  { type: "driver", label: "Driver", icon: User },
                  { type: "depot", label: "Depot / Hub", icon: Warehouse }
                ].map(({ type, label, icon: Icon }) => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => setFormData({ ...formData, entityType: type as any })}
                    className={`py-2 px-3 rounded-lg text-xs font-medium flex items-center justify-center gap-1.5 border transition-all ${
                      formData.entityType === type
                        ? "bg-blue-50 dark:bg-blue-950/40 border-blue-500 text-blue-600 dark:text-blue-400 font-semibold"
                        : "border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50"
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    {label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                Entity Identifier (Plate / Name) <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                placeholder={
                  formData.entityType === "vehicle"
                    ? "e.g. GJ 05 AB 1234"
                    : formData.entityType === "driver"
                    ? "e.g. Rajesh Kumar Sharma"
                    : "e.g. Ahmedabad Central Depot"
                }
                value={formData.entityIdentifier}
                onChange={(e) => setFormData({ ...formData, entityIdentifier: e.target.value })}
                className="w-full text-xs py-2 px-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus-ring"
              />
              {errors.entityIdentifier && <p className="text-[11px] text-rose-500 mt-1">{errors.entityIdentifier}</p>}
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                Reminder Category <span className="text-rose-500">*</span>
              </label>
              <select
                value={formData.reminderCategory}
                onChange={(e) => setFormData({ ...formData, reminderCategory: e.target.value })}
                className="w-full text-xs py-2 px-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus-ring"
              >
                {STANDARD_CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Document / Policy Registration Number
                </label>
                <input
                  type="text"
                  placeholder="e.g. POL-ICICI-2025-99812"
                  value={formData.documentNumber || ""}
                  onChange={(e) => setFormData({ ...formData, documentNumber: e.target.value })}
                  className="w-full text-xs py-2 px-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 font-mono text-slate-900 dark:text-white focus-ring"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Branch / Operating Region
                </label>
                <input
                  type="text"
                  value={formData.branchName}
                  onChange={(e) => setFormData({ ...formData, branchName: e.target.value })}
                  className="w-full text-xs py-2 px-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus-ring"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Panel 2: Validity Dates & Multichannel Notification Settings */}
        <div className="panel-card p-5 space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
            <Calendar className="w-4 h-4 text-emerald-500" />
            <h3 className="text-sm font-semibold text-slate-900 dark:text-white">
              Validity Window & Notification Channels
            </h3>
          </div>

          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Issue / Renewal Date
                </label>
                <input
                  type="date"
                  value={formData.issueDate || ""}
                  onChange={(e) => setFormData({ ...formData, issueDate: e.target.value })}
                  className="w-full text-xs py-2 px-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 font-mono text-slate-900 dark:text-white focus-ring"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Expiry / Deadline Date <span className="text-rose-500">*</span>
                </label>
                <input
                  type="date"
                  value={formData.expiryDate}
                  onChange={(e) => setFormData({ ...formData, expiryDate: e.target.value })}
                  className="w-full text-xs py-2 px-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 font-mono text-slate-900 dark:text-white focus-ring"
                />
                {errors.expiryDate && <p className="text-[11px] text-rose-500 mt-1">{errors.expiryDate}</p>}
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                Advance Notice Alert Threshold (Days Before Expiry)
              </label>
              <div className="flex items-center gap-3">
                <input
                  type="number"
                  min={1}
                  max={180}
                  value={formData.notifyBeforeDays}
                  onChange={(e) => setFormData({ ...formData, notifyBeforeDays: parseInt(e.target.value, 10) || 30 })}
                  className="w-24 text-xs py-2 px-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 font-mono text-slate-900 dark:text-white focus-ring"
                />
                <span className="text-xs text-slate-500">
                  Alerts will trigger daily once within this countdown window
                </span>
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-2">
                Active Notification Dispatch Channels
              </label>
              <div className="grid grid-cols-3 gap-3">
                <label className="flex items-center gap-2 p-2.5 rounded-lg border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-850 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.notifyEmail}
                    onChange={(e) => setFormData({ ...formData, notifyEmail: e.target.checked })}
                    className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500"
                  />
                  <Mail className="w-3.5 h-3.5 text-blue-500" />
                  <span className="text-xs text-slate-700 dark:text-slate-300 font-medium">Email</span>
                </label>

                <label className="flex items-center gap-2 p-2.5 rounded-lg border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-850 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.notifySms}
                    onChange={(e) => setFormData({ ...formData, notifySms: e.target.checked })}
                    className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500"
                  />
                  <Smartphone className="w-3.5 h-3.5 text-emerald-500" />
                  <span className="text-xs text-slate-700 dark:text-slate-300 font-medium">SMS</span>
                </label>

                <label className="flex items-center gap-2 p-2.5 rounded-lg border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-850 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.notifyPush}
                    onChange={(e) => setFormData({ ...formData, notifyPush: e.target.checked })}
                    className="w-4 h-4 rounded text-amber-600 focus:ring-amber-500"
                  />
                  <Bell className="w-3.5 h-3.5 text-amber-500" />
                  <span className="text-xs text-slate-700 dark:text-slate-300 font-medium">Push</span>
                </label>
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                Operational Status
              </label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                className="w-full text-xs py-2 px-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus-ring"
              >
                <option value="active">Active & Valid</option>
                <option value="due_soon">Due Soon (&lt;30 Days)</option>
                <option value="overdue">Overdue Expired</option>
                <option value="renewed">Renewed (Archive)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Panel 3: Renewal Instructions & Notes */}
        <div className="panel-card p-5 space-y-4 lg:col-span-2">
          <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
            Renewal Procedure, Broker Contacts & Documentation Archive Notes
          </label>
          <textarea
            rows={3}
            placeholder="e.g. Annual policy renewal handled via National Insurance; broker contact: Sunil Sharma (+91 98200 12345)..."
            value={formData.notes || ""}
            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
            className="w-full text-xs py-2 px-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus-ring"
          />
        </div>
      </div>

      {/* Sticky Bottom Actions */}
      <div className="fixed bottom-0 left-0 right-0 py-3 px-6 bg-white/90 dark:bg-slate-900/90 backdrop-blur border-t border-slate-200 dark:border-slate-800 flex justify-end gap-3 z-30">
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => navigate("/operations/compliance")}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          variant="primary"
          size="sm"
          isLoading={isSaving}
          leftIcon={<Save className="w-4 h-4" />}
        >
          {isEdit ? "Update Statutory Reminder" : "Save Statutory Reminder"}
        </Button>
      </div>
    </form>
  );
};

export default ComplianceReminderFormPage;
