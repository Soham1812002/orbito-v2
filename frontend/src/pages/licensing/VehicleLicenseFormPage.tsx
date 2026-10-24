import React, { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  ArrowLeft,
  Save,
  X,
  Truck,
  Cpu,
  Shield,
  CreditCard,
  Calendar,
  Bell
} from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { Button } from "@/components/common/Button";
import {
  vehicleLicenseFormSchema,
  VehicleLicenseFormValues
} from "@/schemas/licensing.schema";
import {
  useVehicleLicenseDetail,
  useCreateVehicleLicense,
  useUpdateVehicleLicense
} from "@/queries/licensing.queries";

const COMPANY_OPTIONS = [
  "InOrbit Logistics",
  "Metro Transport",
  "North Star Freight",
  "Central Fleet Services"
];

const GPS_DEVICE_OPTIONS = [
  "Teltonika FMT100",
  "Queclink GV300",
  "Teltonika FMB920",
  "Concox AT4 Asset Tracker",
  "Meitrack T333"
];

export const VehicleLicenseFormPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const isEdit = !!id;
  const navigate = useNavigate();

  const { data: existingLicense, isLoading: licenseLoading } = useVehicleLicenseDetail(id || "");
  const createMutation = useCreateVehicleLicense();
  const updateMutation = useUpdateVehicleLicense();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting }
  } = useForm<VehicleLicenseFormValues>({
    resolver: zodResolver(vehicleLicenseFormSchema),
    defaultValues: {
      company: "InOrbit Logistics",
      branch: "Mumbai Central",
      vehicle: "",
      registrationNumber: "",
      licenseNumber: "",
      issuingAuthority: "State Transport Authority Maharashtra",
      issueDate: new Date().toISOString().slice(0, 10),
      activationDate: new Date().toISOString().slice(0, 10),
      expiryDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10),
      status: "ACTIVE",
      licenseAmount: "₹ 8,400",
      paymentReference: "",
      renewalReminder: "30 days before expiry",
      notificationEmail: "",
      remarks: "",
      paymentCompleted: true,
      sendExpiryNotification: true,
      isActive: true
    }
  });

  useEffect(() => {
    if (existingLicense && isEdit) {
      reset({
        company: existingLicense.company,
        branch: existingLicense.branch,
        vehicle: existingLicense.vehicle,
        registrationNumber: existingLicense.registrationNumber || existingLicense.vehicle,
        licenseNumber: existingLicense.licenseNumber,
        issuingAuthority: existingLicense.issuingAuthority || "State Transport Authority Maharashtra",
        issueDate: existingLicense.licenseIssueDate || new Date().toISOString().slice(0, 10),
        activationDate: existingLicense.activationDate,
        expiryDate: existingLicense.expiryDate,
        extendedUntil: existingLicense.extendedDate && existingLicense.extendedDate !== "—" ? existingLicense.extendedDate : "",
        status: existingLicense.status,
        licenseAmount: existingLicense.licenseAmount || "₹ 8,400",
        paymentReference: existingLicense.paymentReference || "",
        renewalReminder: existingLicense.renewalReminder || "30 days before expiry",
        notificationEmail: existingLicense.notificationEmail || "",
        remarks: "",
        paymentCompleted: existingLicense.paymentCompleted ?? true,
        sendExpiryNotification: existingLicense.sendExpiryNotification ?? true,
        isActive: existingLicense.isActive ?? true
      });
    }
  }, [existingLicense, isEdit, reset]);

  const onSubmit = async (values: VehicleLicenseFormValues) => {
    try {
      if (isEdit && id) {
        await updateMutation.mutateAsync({
          id,
          payload: {
            company: values.company,
            branch: values.branch,
            vehicle: values.vehicle,
            registrationNumber: values.registrationNumber,
            licenseNumber: values.licenseNumber,
            issuingAuthority: values.issuingAuthority,
            licenseIssueDate: values.issueDate,
            activationDate: values.activationDate || values.issueDate,
            expiryDate: values.expiryDate,
            extendedDate: values.extendedUntil || "—",
            status: values.status,
            licenseAmount: values.licenseAmount,
            paymentReference: values.paymentReference,
            renewalReminder: values.renewalReminder,
            notificationEmail: values.notificationEmail,
            paymentCompleted: values.paymentCompleted,
            sendExpiryNotification: values.sendExpiryNotification,
            isActive: values.isActive
          }
        });
      } else {
        await createMutation.mutateAsync({
          company: values.company,
          branch: values.branch,
          vehicle: values.vehicle,
          registrationNumber: values.registrationNumber,
          gpsDevice: "Teltonika FMT100",
          imei: `86${Math.floor(1000000000000 + Math.random() * 9000000000000)}`,
          simNumber: `+91 ${Math.floor(90000 + Math.random() * 10000)} ${Math.floor(10000 + Math.random() * 90000)}`,
          licenseNumber: values.licenseNumber,
          issuingAuthority: values.issuingAuthority,
          licenseIssueDate: values.issueDate,
          activationDate: values.activationDate || values.issueDate,
          expiryDate: values.expiryDate,
          extendedDate: values.extendedUntil || "—",
          assignedUser: "Fleet Operations Admin",
          licenseAmount: values.licenseAmount,
          paymentReference: values.paymentReference,
          renewalReminder: values.renewalReminder,
          notificationEmail: values.notificationEmail,
          paymentCompleted: values.paymentCompleted,
          sendExpiryNotification: values.sendExpiryNotification,
          status: values.status,
          isActive: values.isActive
        });
      }
      navigate("/licensing/vehicles");
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
          { label: "Vehicle Licenses", href: "/licensing/vehicles" },
          { label: isEdit ? "Edit Vehicle License" : "New Vehicle License" }
        ]}
        title={isEdit ? "Edit Vehicle License" : "New Vehicle License"}
        badge={isEdit ? "EDIT MODE" : "CREATION"}
        badgeVariant="cyan"
        description="Configure telematics device authorizations, GPS SIM allocations, and operating validity periods."
        actions={
          <Button
            variant="secondary"
            leftIcon={<ArrowLeft className="h-4 w-4" />}
            onClick={() => navigate("/licensing/vehicles")}
          >
            Back to Vehicle List
          </Button>
        }
      />

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Panel 1: Vehicle & Fleet Assignment */}
        <div className="panel-card p-6 space-y-5">
          <div className="flex items-center gap-3 pb-3 border-b border-slate-100 dark:border-slate-800">
            <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
              <Truck className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-900 dark:text-white">
                Vehicle Assignment & Identification
              </h2>
              <p className="text-2xs text-slate-500 dark:text-slate-400">
                Identify the fleet vehicle, enterprise owner, and operational branch.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Company <span className="text-rose-500">*</span>
              </label>
              <select
                {...register("company")}
                className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 text-xs text-slate-900 dark:text-white focus-ring"
              >
                {COMPANY_OPTIONS.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
              {errors.company && (
                <p className="text-2xs text-rose-500 mt-1">{errors.company.message}</p>
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Branch / Depot
              </label>
              <input
                type="text"
                placeholder="e.g. Mumbai Central Depot"
                {...register("branch")}
                className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 text-xs text-slate-900 dark:text-white placeholder:text-slate-400 focus-ring"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Vehicle Registration Plate <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                placeholder="e.g. MH 01 AB 2890"
                {...register("vehicle")}
                className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 text-xs font-mono font-bold text-slate-900 dark:text-white placeholder:text-slate-400 focus-ring"
              />
              {errors.vehicle && (
                <p className="text-2xs text-rose-500 mt-1">{errors.vehicle.message}</p>
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Registration / Chassis Number <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                placeholder="e.g. MH-01-AB-2890 or Chassis Vin"
                {...register("registrationNumber")}
                className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 text-xs font-mono text-slate-900 dark:text-white placeholder:text-slate-400 focus-ring"
              />
              {errors.registrationNumber && (
                <p className="text-2xs text-rose-500 mt-1">{errors.registrationNumber.message}</p>
              )}
            </div>
          </div>
        </div>

        {/* Panel 2: License Validity & Telematics Linkage */}
        <div className="panel-card p-6 space-y-5">
          <div className="flex items-center gap-3 pb-3 border-b border-slate-100 dark:border-slate-800">
            <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-600 dark:text-cyan-400">
              <Shield className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-900 dark:text-white">
                License Validity & Device Authorization
              </h2>
              <p className="text-2xs text-slate-500 dark:text-slate-400">
                Specify license entitlement numbers, authority approvals, and validity ranges.
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
                placeholder="e.g. VEH-LIC-2026-901"
                {...register("licenseNumber")}
                className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 text-xs font-mono font-semibold text-slate-900 dark:text-white placeholder:text-slate-400 focus-ring"
              />
              {errors.licenseNumber && (
                <p className="text-2xs text-rose-500 mt-1">{errors.licenseNumber.message}</p>
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Issuing Authority <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                placeholder="e.g. State Transport Authority"
                {...register("issuingAuthority")}
                className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 text-xs text-slate-900 dark:text-white placeholder:text-slate-400 focus-ring"
              />
              {errors.issuingAuthority && (
                <p className="text-2xs text-rose-500 mt-1">{errors.issuingAuthority.message}</p>
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                License Status <span className="text-rose-500">*</span>
              </label>
              <select
                {...register("status")}
                className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 text-xs text-slate-900 dark:text-white focus-ring"
              >
                <option value="ACTIVE">Active</option>
                <option value="EXPIRING_SOON">11 days left / Expiring soon</option>
                <option value="EXPIRES_TODAY">Expires today</option>
                <option value="EXPIRED">Expired</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                License Issue Date <span className="text-rose-500">*</span>
              </label>
              <input
                type="date"
                {...register("issueDate")}
                className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 text-xs font-mono text-slate-900 dark:text-white focus-ring"
              />
              {errors.issueDate && (
                <p className="text-2xs text-rose-500 mt-1">{errors.issueDate.message}</p>
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Activation Date
              </label>
              <input
                type="date"
                {...register("activationDate")}
                className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 text-xs font-mono text-slate-900 dark:text-white focus-ring"
              />
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
                Extended Date (Optional)
              </label>
              <input
                type="date"
                {...register("extendedUntil")}
                className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 text-xs font-mono text-slate-900 dark:text-white focus-ring"
              />
            </div>
          </div>
        </div>

        {/* Panel 3: Payment, Telematics Quota & Notification */}
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
                Track annual billing, invoice references, and automated renewal notification triggers.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                License Amount
              </label>
              <input
                type="text"
                placeholder="e.g. ₹ 8,400"
                {...register("licenseAmount")}
                className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 text-xs text-slate-900 dark:text-white placeholder:text-slate-400 focus-ring"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Payment Reference / Transaction ID
              </label>
              <input
                type="text"
                placeholder="e.g. V-TXN-99120"
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

            <div className="sm:col-span-2 lg:col-span-3">
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Notification Email
              </label>
              <input
                type="email"
                placeholder="e.g. fleet.alerts@inorbitlogistics.in"
                {...register("notificationEmail")}
                className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 text-xs text-slate-900 dark:text-white placeholder:text-slate-400 focus-ring"
              />
              {errors.notificationEmail && (
                <p className="text-2xs text-rose-500 mt-1">{errors.notificationEmail.message}</p>
              )}
            </div>

            <div className="sm:col-span-2 lg:col-span-3">
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Remarks / Fleet Compliance Notes
              </label>
              <textarea
                rows={3}
                placeholder="Additional notes about device serials, vehicle telemetry calibration or renewal terms..."
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
              <span>Payment received and validated for this vehicle cycle</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-700 dark:text-slate-300">
              <input
                type="checkbox"
                {...register("sendExpiryNotification")}
                className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 h-4 w-4"
              />
              <span>Send automated expiry alerts and renewal warnings to fleet admin</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-700 dark:text-slate-300">
              <input
                type="checkbox"
                {...register("isActive")}
                className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 h-4 w-4"
              />
              <span>Keep vehicle license active and receiving telematics streams</span>
            </label>
          </div>
        </div>

        {/* Sticky Action Footer matching Figma Screen 7 */}
        <div className="sticky bottom-0 z-10 flex items-center justify-end gap-3 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md p-4 shadow-lg">
          <Button
            type="button"
            variant="secondary"
            leftIcon={<X className="h-4 w-4" />}
            onClick={() => navigate("/licensing/vehicles")}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="primary"
            leftIcon={<Save className="h-4 w-4" />}
            disabled={isSubmitting}
          >
            {isSubmitting ? "Saving License..." : isEdit ? "Update Vehicle License" : "Save Vehicle License"}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default VehicleLicenseFormPage;
