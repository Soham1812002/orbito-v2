import React, { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  ArrowLeft,
  Save,
  X,
  Network,
  Shield,
  CreditCard,
  Calendar,
  Layers,
  Bell
} from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { Button } from "@/components/common/Button";
import {
  resellerLicenseFormSchema,
  ResellerLicenseFormValues
} from "@/schemas/licensing.schema";
import {
  useResellerLicenseDetail,
  useCreateResellerLicense,
  useUpdateResellerLicense
} from "@/queries/licensing.queries";

const RESELLER_MODELS = [
  "Prepaid Enterprise Tier",
  "Revenue Share Distributor",
  "Authorized Reseller Standard",
  "White-Label Partner",
  "Regional Territory Franchisee"
];

export const ResellerLicenseFormPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const isEdit = !!id;
  const navigate = useNavigate();

  const { data: existingLicense, isLoading: licenseLoading } = useResellerLicenseDetail(id || "");
  const createMutation = useCreateResellerLicense();
  const updateMutation = useUpdateResellerLicense();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting }
  } = useForm<ResellerLicenseFormValues>({
    resolver: zodResolver(resellerLicenseFormSchema),
    defaultValues: {
      reseller: "",
      licenseStatus: "ACTIVE",
      licenseNumber: "",
      activationDate: new Date().toISOString().slice(0, 10),
      expiryDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10),
      noOfVehicles: 500,
      licenseModel: "Prepaid Enterprise Tier",
      paymentReference: "",
      notificationEmail: "",
      renewalReminder: "30 days before expiry",
      remarks: "",
      paymentCompleted: true,
      sendExpiryNotification: true,
      isActive: true
    }
  });

  useEffect(() => {
    if (existingLicense && isEdit) {
      reset({
        reseller: existingLicense.reseller,
        licenseStatus: existingLicense.status,
        licenseNumber: existingLicense.licenseNumber,
        activationDate: existingLicense.activationDate,
        expiryDate: existingLicense.expiryDate,
        extendedUntil: existingLicense.extendedDate && existingLicense.extendedDate !== "—" ? existingLicense.extendedDate : "",
        noOfVehicles: existingLicense.vehicleQuota || 500,
        licenseModel: existingLicense.licenseModel,
        paymentReference: existingLicense.paymentReference || "",
        notificationEmail: existingLicense.notificationEmail || "",
        renewalReminder: existingLicense.renewalReminder || "30 days before expiry",
        remarks: existingLicense.remark || "",
        paymentCompleted: existingLicense.paymentCompleted ?? true,
        sendExpiryNotification: existingLicense.sendExpiryNotification ?? true,
        isActive: existingLicense.isActive ?? true
      });
    }
  }, [existingLicense, isEdit, reset]);

  const onSubmit = async (values: ResellerLicenseFormValues) => {
    try {
      if (isEdit && id) {
        await updateMutation.mutateAsync({
          id,
          payload: {
            reseller: values.reseller,
            licenseNumber: values.licenseNumber,
            licenseModel: values.licenseModel,
            activationDate: values.activationDate,
            expiryDate: values.expiryDate,
            extendedDate: values.extendedUntil || "—",
            vehicleQuota: values.noOfVehicles,
            paymentReference: values.paymentReference,
            notificationEmail: values.notificationEmail,
            renewalReminder: values.renewalReminder,
            remark: values.remarks,
            paymentCompleted: values.paymentCompleted,
            sendExpiryNotification: values.sendExpiryNotification,
            status: values.licenseStatus,
            isActive: values.isActive
          }
        });
      } else {
        await createMutation.mutateAsync({
          reseller: values.reseller,
          contactPerson: "Channel Director",
          telephone: "+91 98200 11220",
          licenseNumber: values.licenseNumber,
          licenseModel: values.licenseModel,
          activationDate: values.activationDate,
          expiryDate: values.expiryDate,
          extendedDate: values.extendedUntil || "—",
          allocatedClients: 0,
          allocatedVehicles: 0,
          vehicleQuota: values.noOfVehicles,
          paymentReference: values.paymentReference,
          notificationEmail: values.notificationEmail,
          renewalReminder: values.renewalReminder,
          remark: values.remarks,
          paymentCompleted: values.paymentCompleted,
          sendExpiryNotification: values.sendExpiryNotification,
          status: values.licenseStatus,
          isActive: values.isActive
        });
      }
      navigate("/licensing/resellers");
    } catch {
      // Handled by mutation onError toast
    }
  };

  if (isEdit && licenseLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-indigo-600 border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12">
      <PageHeader
        breadcrumbs={[
          { label: "Operations", href: "/operations" },
          { label: "Licensing Module", href: "/licensing" },
          { label: "Reseller Licenses", href: "/licensing/resellers" },
          { label: isEdit ? "Edit Reseller License" : "New Reseller License" }
        ]}
        title={isEdit ? "Edit Reseller License" : "New Reseller License"}
        badge={isEdit ? "EDIT MODE" : "PARTNER ENROLLMENT"}
        badgeVariant="cyan"
        description="Configure channel partner vehicle capacity quota, commercial tier, and renewal schedules."
        actions={
          <Button
            variant="secondary"
            leftIcon={<ArrowLeft className="h-4 w-4" />}
            onClick={() => navigate("/licensing/resellers")}
          >
            Back to Reseller List
          </Button>
        }
      />

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Panel 1: Reseller Assignment */}
        <div className="panel-card p-6 space-y-5">
          <div className="flex items-center gap-3 pb-3 border-b border-slate-100 dark:border-slate-800">
            <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
              <Network className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-900 dark:text-white">
                Reseller Assignment & Identification
              </h2>
              <p className="text-2xs text-slate-500 dark:text-slate-400">
                Identify the channel distributor, partnership status, and commercial license key.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Reseller Organization Name <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                placeholder="e.g. Western Logistics Channel Partners"
                {...register("reseller")}
                className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 text-xs text-slate-900 dark:text-white placeholder:text-slate-400 focus-ring"
              />
              {errors.reseller && (
                <p className="text-2xs text-rose-500 mt-1">{errors.reseller.message}</p>
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                License Status <span className="text-rose-500">*</span>
              </label>
              <select
                {...register("licenseStatus")}
                className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 text-xs text-slate-900 dark:text-white focus-ring"
              >
                <option value="ACTIVE">Active</option>
                <option value="EXPIRING_SOON">11 days left / Expiring soon</option>
                <option value="EXPIRES_TODAY">Expires today</option>
                <option value="EXPIRED">Expired</option>
              </select>
            </div>
          </div>
        </div>

        {/* Panel 2: License Validity & Allocations */}
        <div className="panel-card p-6 space-y-5">
          <div className="flex items-center gap-3 pb-3 border-b border-slate-100 dark:border-slate-800">
            <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-600 dark:text-cyan-400">
              <Layers className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-900 dark:text-white">
                License Validity & Quota Allocations
              </h2>
              <p className="text-2xs text-slate-500 dark:text-slate-400">
                Define the commercial partnership tier, vehicle capacity limits, and term validity.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                License Number <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                placeholder="e.g. RSL-IND-2026-01"
                {...register("licenseNumber")}
                className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 text-xs font-mono font-semibold text-slate-900 dark:text-white placeholder:text-slate-400 focus-ring"
              />
              {errors.licenseNumber && (
                <p className="text-2xs text-rose-500 mt-1">{errors.licenseNumber.message}</p>
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                License Model <span className="text-rose-500">*</span>
              </label>
              <select
                {...register("licenseModel")}
                className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 text-xs text-slate-900 dark:text-white focus-ring"
              >
                {RESELLER_MODELS.map((m) => (
                  <option key={m} value={m}>
                    {m}
                  </option>
                ))}
              </select>
              {errors.licenseModel && (
                <p className="text-2xs text-rose-500 mt-1">{errors.licenseModel.message}</p>
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Vehicle Quota Capacity <span className="text-rose-500">*</span>
              </label>
              <input
                type="number"
                min={1}
                placeholder="e.g. 500"
                {...register("noOfVehicles")}
                className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 text-xs font-mono font-bold text-slate-900 dark:text-white focus-ring"
              />
              {errors.noOfVehicles && (
                <p className="text-2xs text-rose-500 mt-1">{errors.noOfVehicles.message}</p>
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Activation Date <span className="text-rose-500">*</span>
              </label>
              <input
                type="date"
                {...register("activationDate")}
                className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 text-xs font-mono text-slate-900 dark:text-white focus-ring"
              />
              {errors.activationDate && (
                <p className="text-2xs text-rose-500 mt-1">{errors.activationDate.message}</p>
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Expiry Date <span className="text-rose-500">*</span>
              </label>
              <input
                type="date"
                {...register("expiryDate")}
                className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 text-xs font-mono font-semibold text-slate-900 dark:text-white focus-ring"
              />
              {errors.expiryDate && (
                <p className="text-2xs text-rose-500 mt-1">{errors.expiryDate.message}</p>
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Extended Until (Optional)
              </label>
              <input
                type="date"
                {...register("extendedUntil")}
                className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 text-xs font-mono text-slate-900 dark:text-white focus-ring"
              />
            </div>
          </div>
        </div>

        {/* Panel 3: Payment & Notification Preferences */}
        <div className="panel-card p-6 space-y-5">
          <div className="flex items-center gap-3 pb-3 border-b border-slate-100 dark:border-slate-800">
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
              <CreditCard className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-900 dark:text-white">
                Payment & Notification Preferences
              </h2>
              <p className="text-2xs text-slate-500 dark:text-slate-400">
                Invoice reconciliations, quota warning thresholds, and reminder dispatch options.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Payment Reference / Billing Invoice
              </label>
              <input
                type="text"
                placeholder="e.g. RSL-INV-7721"
                {...register("paymentReference")}
                className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 text-xs font-mono text-slate-900 dark:text-white placeholder:text-slate-400 focus-ring"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Renewal Reminder Schedule
              </label>
              <select
                {...register("renewalReminder")}
                className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 text-xs text-slate-900 dark:text-white focus-ring"
              >
                <option value="15 days before expiry">15 days before expiry</option>
                <option value="30 days before expiry">30 days before expiry</option>
                <option value="60 days before expiry">60 days before expiry</option>
                <option value="90 days before expiry">90 days before expiry</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Notification & Quota Email
              </label>
              <input
                type="email"
                placeholder="e.g. partner@westernlogistics.com"
                {...register("notificationEmail")}
                className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 text-xs text-slate-900 dark:text-white placeholder:text-slate-400 focus-ring"
              />
              {errors.notificationEmail && (
                <p className="text-2xs text-rose-500 mt-1">{errors.notificationEmail.message}</p>
              )}
            </div>

            <div className="sm:col-span-2 lg:col-span-3">
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Remarks / Partner Agreement Notes
              </label>
              <textarea
                rows={3}
                placeholder="Commercial terms, tier benefits, revenue share provisions..."
                {...register("remarks")}
                className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 text-xs text-slate-900 dark:text-white placeholder:text-slate-400 focus-ring resize-none"
              />
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100 dark:border-slate-800 space-y-2">
            <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-700 dark:text-slate-300">
              <input
                type="checkbox"
                {...register("paymentCompleted")}
                className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 h-4 w-4"
              />
              <span>Payment received and cleared for this channel partner billing cycle</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-700 dark:text-slate-300">
              <input
                type="checkbox"
                {...register("sendExpiryNotification")}
                className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 h-4 w-4"
              />
              <span>Send automated expiry alerts and quota warnings to Partner Admin</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-700 dark:text-slate-300">
              <input
                type="checkbox"
                {...register("isActive")}
                className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 h-4 w-4"
              />
              <span>Keep reseller license active in telematics federation</span>
            </label>
          </div>
        </div>

        {/* Sticky Action Footer matching Figma Screen 9 */}
        <div className="sticky bottom-0 z-10 flex items-center justify-end gap-3 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md p-4 shadow-lg">
          <Button
            type="button"
            variant="secondary"
            leftIcon={<X className="h-4 w-4" />}
            onClick={() => navigate("/licensing/resellers")}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="primary"
            leftIcon={<Save className="h-4 w-4" />}
            disabled={isSubmitting}
          >
            {isSubmitting ? "Saving Partner License..." : isEdit ? "Update Reseller License" : "Save Reseller License"}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default ResellerLicenseFormPage;
