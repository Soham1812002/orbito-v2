import React, { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  ArrowLeft,
  Save,
  X,
  User,
  Shield,
  CreditCard,
  Calendar,
  Bell
} from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { Button } from "@/components/common/Button";
import {
  userLicenseFormSchema,
  UserLicenseFormValues
} from "@/schemas/licensing.schema";
import {
  useUserLicenseDetail,
  useCreateUserLicense,
  useUpdateUserLicense
} from "@/queries/licensing.queries";

const COMPANY_OPTIONS = [
  "InOrbit Logistics",
  "Metro Transport",
  "North Star Freight",
  "Central Fleet Services"
];

const USER_OPTIONS = [
  { name: "Rohan Mehta", email: "rohan.mehta@inorbitlogistics.in", role: "Operations Lead" },
  { name: "Kavita Shah", email: "kavita.shah@metrotransport.com", role: "Regional Fleet Controller" },
  { name: "Arjun Patel", email: "arjun.patel@northstarfreight.in", role: "Depot Supervisor" },
  { name: "Neha Joshi", email: "neha.joshi@centralfleet.in", role: "Route Compliance Officer" }
];

const USER_LICENSE_TYPES = [
  "Fleet Dispatcher Standard",
  "Enterprise Dispatcher License",
  "Cold Chain Supervisor License",
  "Compliance Monitor License",
  "Driver Terminal Operator"
];

export const UserLicenseFormPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const isEdit = !!id;
  const navigate = useNavigate();

  const { data: existingLicense, isLoading: licenseLoading } = useUserLicenseDetail(id || "");
  const createMutation = useCreateUserLicense();
  const updateMutation = useUpdateUserLicense();

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors, isSubmitting }
  } = useForm<UserLicenseFormValues>({
    resolver: zodResolver(userLicenseFormSchema),
    defaultValues: {
      company: "InOrbit Logistics",
      branch: "Mumbai Central Hub",
      user: "Rohan Mehta",
      userRole: "Operations Lead",
      licenseType: "Fleet Dispatcher Standard",
      licenseNumber: "",
      licenseKey: "",
      startDate: new Date().toISOString().slice(0, 10),
      expiryDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10),
      status: "ACTIVE",
      licenseAmount: "₹ 15,000",
      paymentStatus: "Paid",
      paymentReference: "",
      renewalReminder: "30 days before expiry",
      remarks: "",
      sendActivationEmail: true,
      sendRenewalNotification: true,
      isActive: true
    }
  });

  useEffect(() => {
    if (existingLicense && isEdit) {
      reset({
        company: existingLicense.company,
        branch: existingLicense.branch,
        user: existingLicense.user,
        userRole: existingLicense.userRole,
        licenseType: existingLicense.licenseType,
        licenseNumber: existingLicense.licenseNumber,
        licenseKey: existingLicense.licenseKey || "",
        startDate: existingLicense.activationDate,
        expiryDate: existingLicense.expiryDate,
        status: existingLicense.status,
        licenseAmount: existingLicense.licenseAmount || "₹ 15,000",
        paymentStatus: existingLicense.paymentStatus || "Paid",
        paymentReference: existingLicense.paymentReference || "",
        renewalReminder: existingLicense.renewalReminder || "30 days before expiry",
        remarks: existingLicense.remark || "",
        sendActivationEmail: existingLicense.sendActivationEmail ?? true,
        sendRenewalNotification: existingLicense.sendRenewalNotification ?? true,
        isActive: existingLicense.isActive ?? true
      });
    }
  }, [existingLicense, isEdit, reset]);

  const handleUserSelect = (selectedName: string) => {
    const matched = USER_OPTIONS.find((u) => u.name === selectedName);
    if (matched) {
      setValue("user", matched.name);
      setValue("userRole", matched.role);
    }
  };

  const onSubmit = async (values: UserLicenseFormValues) => {
    try {
      if (isEdit && id) {
        await updateMutation.mutateAsync({
          id,
          payload: {
            ...values,
            activationDate: values.startDate,
            remark: values.remarks
          }
        });
      } else {
        await createMutation.mutateAsync({
          ...values,
          activationDate: values.startDate,
          remark: values.remarks,
          allocatedVehicles: 15,
          telephone: "+91 98765 41230"
        });
      }
      navigate("/licensing/users");
    } catch {
      // Handled by toast
    }
  };

  if (isEdit && licenseLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="text-center space-y-2">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent mx-auto"></div>
          <p className="text-xs text-slate-500">Loading user license details...</p>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 pb-20">
      <PageHeader
        breadcrumbs={[
          { label: "Operations", href: "/operations" },
          { label: "Licensing Module", href: "/licensing" },
          { label: "User Licenses", href: "/licensing/users" },
          { label: isEdit ? "Edit License" : "User License Detail" }
        ]}
        title={isEdit ? `Edit License: ${existingLicense?.user || ""}` : "User License Detail"}
        badge={isEdit ? "EXISTING USER LICENSE" : "NEW USER LICENSE"}
        badgeVariant="cyan"
        description="Assign and manage individual user access, license validity, payment, and renewal settings."
        actions={
          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="secondary"
              leftIcon={<ArrowLeft className="h-4 w-4" />}
              onClick={() => navigate("/licensing/users")}
            >
              Back to List
            </Button>
            <Button
              type="button"
              variant="secondary"
              leftIcon={<X className="h-4 w-4" />}
              onClick={() => navigate("/licensing/users")}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              leftIcon={<Save className="h-4 w-4" />}
              disabled={isSubmitting || createMutation.isPending || updateMutation.isPending}
            >
              {isSubmitting ? "Saving..." : isEdit ? "Update User License" : "Save User License"}
            </Button>
          </div>
        }
      />

      {/* SECTION 1: User Assignment (Figma Screen 5) */}
      <div className="panel-card space-y-5">
        <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100 dark:border-slate-800">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 font-bold text-xs">
            1
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <User className="h-4 w-4 text-indigo-500" />
              User Assignment
            </h3>
            <p className="text-2xs text-slate-500 dark:text-slate-400">
              Bind the license seat to a registered corporate enterprise user.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
              Company <span className="text-rose-500">*</span>
            </label>
            <select
              {...register("company")}
              className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-3.5 py-2.5 text-xs text-slate-900 dark:text-white focus-ring"
            >
              {COMPANY_OPTIONS.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
              Branch <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              placeholder="e.g. Mumbai Central"
              {...register("branch")}
              className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-3.5 py-2.5 text-xs text-slate-900 dark:text-white focus-ring"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
              Target User <span className="text-rose-500">*</span>
            </label>
            <select
              {...register("user")}
              onChange={(e) => handleUserSelect(e.target.value)}
              className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-3.5 py-2.5 text-xs text-slate-900 dark:text-white focus-ring"
            >
              {USER_OPTIONS.map((u) => (
                <option key={u.name} value={u.name}>
                  {u.name} ({u.role})
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
              User Role <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              {...register("userRole")}
              className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-3.5 py-2.5 text-xs text-slate-900 dark:text-white focus-ring"
            />
          </div>
        </div>
      </div>

      {/* SECTION 2: License Details (Figma Screen 5) */}
      <div className="panel-card space-y-5">
        <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100 dark:border-slate-800">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400 font-bold text-xs">
            2
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Shield className="h-4 w-4 text-blue-500" />
              License Details
            </h3>
            <p className="text-2xs text-slate-500 dark:text-slate-400">
              Define the license identifier, cryptography key, and access validity period.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
              License Type <span className="text-rose-500">*</span>
            </label>
            <select
              {...register("licenseType")}
              className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-3.5 py-2.5 text-xs text-slate-900 dark:text-white focus-ring"
            >
              {USER_LICENSE_TYPES.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
              License Number <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              placeholder="e.g. USR-LIC-2025-01"
              {...register("licenseNumber")}
              className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-3.5 py-2.5 text-xs text-slate-900 dark:text-white font-mono focus-ring"
            />
            {errors.licenseNumber && (
              <p className="text-2xs text-rose-500">{errors.licenseNumber.message}</p>
            )}
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
              License Key
            </label>
            <input
              type="text"
              placeholder="e.g. KEY-IND-8849-ROH"
              {...register("licenseKey")}
              className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-3.5 py-2.5 text-xs text-slate-900 dark:text-white font-mono focus-ring"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
              Start Date <span className="text-rose-500">*</span>
            </label>
            <input
              type="date"
              {...register("startDate")}
              className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-3.5 py-2.5 text-xs text-slate-900 dark:text-white focus-ring"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
              Expiry Date <span className="text-rose-500">*</span>
            </label>
            <input
              type="date"
              {...register("expiryDate")}
              className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-3.5 py-2.5 text-xs text-slate-900 dark:text-white focus-ring"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
              Status <span className="text-rose-500">*</span>
            </label>
            <select
              {...register("status")}
              className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-3.5 py-2.5 text-xs text-slate-900 dark:text-white focus-ring"
            >
              <option value="ACTIVE">Active</option>
              <option value="EXPIRES_TODAY">Expires today</option>
              <option value="EXPIRING_SOON">Expiring soon</option>
              <option value="EXPIRED">Expired</option>
            </select>
          </div>
        </div>
      </div>

      {/* SECTION 3: Payment and Renewal (Figma Screen 5) */}
      <div className="panel-card space-y-5">
        <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100 dark:border-slate-800">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold text-xs">
            3
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <CreditCard className="h-4 w-4 text-emerald-500" />
              Payment and Renewal
            </h3>
            <p className="text-2xs text-slate-500 dark:text-slate-400">
              Financial reconciliation, transaction invoice references, and renewal reminder schedule.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
              License Amount
            </label>
            <input
              type="text"
              placeholder="e.g. ₹ 15,000"
              {...register("licenseAmount")}
              className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-3.5 py-2.5 text-xs text-slate-900 dark:text-white font-mono focus-ring"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
              Payment Status
            </label>
            <select
              {...register("paymentStatus")}
              className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-3.5 py-2.5 text-xs text-slate-900 dark:text-white focus-ring"
            >
              <option value="Paid">Paid</option>
              <option value="Pending">Pending</option>
              <option value="Waived">Waived</option>
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
              Payment Reference
            </label>
            <input
              type="text"
              placeholder="e.g. INV-2025-9982"
              {...register("paymentReference")}
              className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-3.5 py-2.5 text-xs text-slate-900 dark:text-white font-mono focus-ring"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
              Renewal Reminder
            </label>
            <select
              {...register("renewalReminder")}
              className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-3.5 py-2.5 text-xs text-slate-900 dark:text-white focus-ring"
            >
              <option value="15 days before expiry">15 days before expiry</option>
              <option value="30 days before expiry">30 days before expiry</option>
              <option value="60 days before expiry">60 days before expiry</option>
            </select>
          </div>

          <div className="space-y-1.5 md:col-span-2 lg:col-span-4">
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
              Remarks
            </label>
            <textarea
              rows={2}
              placeholder="Add access notes, billing information, or internal renewal instructions..."
              {...register("remarks")}
              className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-3 text-xs text-slate-900 dark:text-white placeholder:text-slate-400 focus-ring"
            />
          </div>
        </div>

        <div className="pt-2 flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <label className="flex items-center gap-2.5 cursor-pointer text-xs text-slate-700 dark:text-slate-300">
            <input
              type="checkbox"
              {...register("sendActivationEmail")}
              className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
            />
            Send activation email to user
          </label>

          <label className="flex items-center gap-2.5 cursor-pointer text-xs text-slate-700 dark:text-slate-300">
            <input
              type="checkbox"
              {...register("sendRenewalNotification")}
              className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
            />
            Send renewal notification
          </label>

          <label className="flex items-center gap-2.5 cursor-pointer text-xs text-slate-700 dark:text-slate-300">
            <input
              type="checkbox"
              {...register("isActive")}
              className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
            />
            License is active
          </label>
        </div>

        <p className="text-2xs text-slate-400 dark:text-slate-500 italic">
          Activation and expiry notifications are sent to the licensed user and authorized administrators.
        </p>
      </div>

      {/* Floating Sticky Action Bar */}
      <div className="fixed bottom-0 left-0 right-0 z-40 border-t border-slate-200/80 dark:border-slate-800 bg-white/90 dark:bg-[#0F172B]/90 backdrop-blur-md px-6 py-3.5 shadow-lg">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <p className="text-2xs text-slate-500 dark:text-slate-400 hidden sm:block">
            User licenses define telematics console permissions and vehicle allocation quotas.
          </p>
          <div className="flex items-center gap-3 ml-auto">
            <Button
              type="button"
              variant="secondary"
              onClick={() => navigate("/licensing/users")}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              leftIcon={<Save className="h-4 w-4" />}
              disabled={isSubmitting || createMutation.isPending || updateMutation.isPending}
            >
              {isSubmitting ? "Saving..." : isEdit ? "Update User License" : "Save User License"}
            </Button>
          </div>
        </div>
      </div>
    </form>
  );
};

export default UserLicenseFormPage;
