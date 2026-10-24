import React, { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  ArrowLeft,
  Save,
  X,
  Building2,
  FileText,
  Calendar,
  Bell,
  CheckCircle2
} from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { Button } from "@/components/common/Button";
import {
  companyLicenseFormSchema,
  CompanyLicenseFormValues
} from "@/schemas/licensing.schema";
import {
  useCompanyLicenseDetail,
  useCreateCompanyLicense,
  useUpdateCompanyLicense
} from "@/queries/licensing.queries";

const COMPANY_OPTIONS = [
  "InOrbit Logistics",
  "Metro Transport",
  "North Star Freight",
  "Central Fleet Services",
  "Apex Global Logistics",
  "Deccan Express Logistics"
];

const LICENSE_TYPE_OPTIONS = [
  "Enterprise Commercial Fleet",
  "National Goods Transit Permit",
  "State Carrier License",
  "Cold Chain Specialized License",
  "Hazardous Materials Transit Clearance"
];

export const CompanyLicenseFormPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const isEdit = !!id;
  const navigate = useNavigate();

  const { data: existingLicense, isLoading: licenseLoading } = useCompanyLicenseDetail(id || "");
  const createMutation = useCreateCompanyLicense();
  const updateMutation = useUpdateCompanyLicense();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting }
  } = useForm<CompanyLicenseFormValues>({
    resolver: zodResolver(companyLicenseFormSchema),
    defaultValues: {
      company: "InOrbit Logistics",
      branch: "Mumbai Central Hub",
      licenseType: "Enterprise Commercial Fleet",
      licenseName: "",
      licenseNumber: "",
      issuingAuthority: "Ministry of Road Transport & Highways",
      licenseIssueDate: new Date().toISOString().slice(0, 10),
      expiryDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10),
      status: "ACTIVE",
      renewalReminder: "30 days before expiry",
      remarks: "",
      sendRenewalNotification: true,
      isActive: true
    }
  });

  useEffect(() => {
    if (existingLicense && isEdit) {
      reset({
        company: existingLicense.company,
        branch: existingLicense.branch,
        licenseType: existingLicense.licenseType,
        licenseName: existingLicense.licenseName,
        licenseNumber: existingLicense.licenseNumber,
        issuingAuthority: existingLicense.issuingAuthority,
        licenseIssueDate: existingLicense.licenseIssueDate,
        expiryDate: existingLicense.expiryDate,
        status: existingLicense.status,
        renewalReminder: existingLicense.renewalReminder || "30 days before expiry",
        remarks: existingLicense.remark || "",
        sendRenewalNotification: existingLicense.sendRenewalNotification ?? true,
        isActive: existingLicense.isActive ?? true
      });
    }
  }, [existingLicense, isEdit, reset]);

  const onSubmit = async (values: CompanyLicenseFormValues) => {
    try {
      if (isEdit && id) {
        await updateMutation.mutateAsync({
          id,
          payload: {
            ...values,
            remark: values.remarks
          }
        });
      } else {
        await createMutation.mutateAsync({
          ...values,
          remark: values.remarks,
          contactPerson: "Primary Admin",
          telephone: "+91 98000 00000",
          addedVehicles: 0,
          maxVehicles: 50
        });
      }
      navigate("/licensing/companies");
    } catch {
      // Handled by mutation toast
    }
  };

  if (isEdit && licenseLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="text-center space-y-2">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent mx-auto"></div>
          <p className="text-xs text-slate-500">Loading company license details...</p>
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
          { label: "Company Licenses", href: "/licensing/companies" },
          { label: isEdit ? "Edit License" : "Company License Detail" }
        ]}
        title={isEdit ? `Edit License: ${existingLicense?.licenseNumber || ""}` : "Company License Detail"}
        badge={isEdit ? "EXISTING LICENSE" : "NEW LICENSE"}
        badgeVariant="cyan"
        description="Register and monitor company licenses, permits, certificates, and renewal requirements."
        actions={
          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="secondary"
              leftIcon={<ArrowLeft className="h-4 w-4" />}
              onClick={() => navigate("/licensing/companies")}
            >
              Back to List
            </Button>
            <Button
              type="button"
              variant="secondary"
              leftIcon={<X className="h-4 w-4" />}
              onClick={() => navigate("/licensing/companies")}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              leftIcon={<Save className="h-4 w-4" />}
              disabled={isSubmitting || createMutation.isPending || updateMutation.isPending}
            >
              {isSubmitting ? "Saving..." : isEdit ? "Update License" : "Save License"}
            </Button>
          </div>
        }
      />

      {/* SECTION 1: Company Assignment (Figma Screen 3) */}
      <div className="panel-card space-y-5">
        <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100 dark:border-slate-800">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400 font-bold text-xs">
            1
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Building2 className="h-4 w-4 text-blue-500" />
              Company Assignment
            </h3>
            <p className="text-2xs text-slate-500 dark:text-slate-400">
              Select the parent fleet enterprise and designated operational branch for this license.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
            {errors.company && (
              <p className="text-2xs text-rose-500">{errors.company.message}</p>
            )}
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
              Branch Hub <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              placeholder="e.g. Mumbai Central Hub"
              {...register("branch")}
              className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-3.5 py-2.5 text-xs text-slate-900 dark:text-white focus-ring"
            />
            {errors.branch && (
              <p className="text-2xs text-rose-500">{errors.branch.message}</p>
            )}
          </div>
        </div>
      </div>

      {/* SECTION 2: License Details (Figma Screen 3) */}
      <div className="panel-card space-y-5">
        <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100 dark:border-slate-800">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 font-bold text-xs">
            2
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <FileText className="h-4 w-4 text-indigo-500" />
              License Details
            </h3>
            <p className="text-2xs text-slate-500 dark:text-slate-400">
              Specify the legal permit designation, registration code, and authority credentials.
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
              {LICENSE_TYPE_OPTIONS.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
              License Name <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              placeholder="e.g. National Cargo Operations Permit"
              {...register("licenseName")}
              className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-3.5 py-2.5 text-xs text-slate-900 dark:text-white focus-ring"
            />
            {errors.licenseName && (
              <p className="text-2xs text-rose-500">{errors.licenseName.message}</p>
            )}
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
              License Number <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              placeholder="e.g. LIC-IND-2025-0012"
              {...register("licenseNumber")}
              className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-3.5 py-2.5 text-xs text-slate-900 dark:text-white font-mono focus-ring"
            />
            {errors.licenseNumber && (
              <p className="text-2xs text-rose-500">{errors.licenseNumber.message}</p>
            )}
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
              Issuing Authority <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              placeholder="e.g. Ministry of Road Transport & Highways"
              {...register("issuingAuthority")}
              className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-3.5 py-2.5 text-xs text-slate-900 dark:text-white focus-ring"
            />
            {errors.issuingAuthority && (
              <p className="text-2xs text-rose-500">{errors.issuingAuthority.message}</p>
            )}
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
              Issue Date <span className="text-rose-500">*</span>
            </label>
            <input
              type="date"
              {...register("licenseIssueDate")}
              className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-3.5 py-2.5 text-xs text-slate-900 dark:text-white focus-ring"
            />
            {errors.licenseIssueDate && (
              <p className="text-2xs text-rose-500">{errors.licenseIssueDate.message}</p>
            )}
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
            {errors.expiryDate && (
              <p className="text-2xs text-rose-500">{errors.expiryDate.message}</p>
            )}
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

      {/* SECTION 3: Renewal & Documentation (Figma Screen 3) */}
      <div className="panel-card space-y-5">
        <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100 dark:border-slate-800">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold text-xs">
            3
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Bell className="h-4 w-4 text-emerald-500" />
              Renewal and Documentation
            </h3>
            <p className="text-2xs text-slate-500 dark:text-slate-400">
              Configure alert reminders, internal administrative notes, and policy triggers.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
              <option value="45 days before expiry">45 days before expiry</option>
              <option value="60 days before expiry">60 days before expiry</option>
            </select>
          </div>

          <div className="space-y-1.5 md:col-span-2">
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
              Administrative Remarks & Notes
            </label>
            <textarea
              rows={3}
              placeholder="Add compliance notes, renewal instructions, or internal department remarks..."
              {...register("remarks")}
              className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-3 text-xs text-slate-900 dark:text-white placeholder:text-slate-400 focus-ring"
            />
          </div>
        </div>

        <div className="pt-2 flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <label className="flex items-center gap-2.5 cursor-pointer text-xs text-slate-700 dark:text-slate-300">
            <input
              type="checkbox"
              {...register("sendRenewalNotification")}
              className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
            />
            Send renewal notification to registered company emails
          </label>

          <label className="flex items-center gap-2.5 cursor-pointer text-xs text-slate-700 dark:text-slate-300">
            <input
              type="checkbox"
              {...register("isActive")}
              className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
            />
            License is currently active and enforceable
          </label>
        </div>

        <p className="text-2xs text-slate-400 dark:text-slate-500 italic">
          Expiry reminders are automatically sent to authorized company administrators and compliance managers.
        </p>
      </div>

      {/* Floating Sticky Action Bar */}
      <div className="fixed bottom-0 left-0 right-0 z-40 border-t border-slate-200/80 dark:border-slate-800 bg-white/90 dark:bg-[#0F172B]/90 backdrop-blur-md px-6 py-3.5 shadow-lg">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <p className="text-2xs text-slate-500 dark:text-slate-400 hidden sm:block">
            Company licenses govern the total vehicle quota allocation across regional distribution centers.
          </p>
          <div className="flex items-center gap-3 ml-auto">
            <Button
              type="button"
              variant="secondary"
              onClick={() => navigate("/licensing/companies")}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              leftIcon={<Save className="h-4 w-4" />}
              disabled={isSubmitting || createMutation.isPending || updateMutation.isPending}
            >
              {isSubmitting ? "Saving..." : isEdit ? "Update Company License" : "Save Company License"}
            </Button>
          </div>
        </div>
      </div>
    </form>
  );
};

export default CompanyLicenseFormPage;
