import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  ArrowLeft,
  Save,
  X,
  Eye,
  EyeOff,
  User,
  Shield,
  Phone,
  Mail,
  Building,
  Globe,
  Clock,
  Sparkles,
  CheckCircle2
} from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { Button } from "@/components/common/Button";
import { Select } from "@/components/common/Select";
import { userFormSchema, UserFormData } from "@/schemas/users.schema";
import {
  useCreateUser,
  useUpdateUser,
  useUserDetail,
  useRolesList,
  useCompaniesList,
  useUserGroupList
} from "@/queries/users.queries";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { updateUserProfile } from "@/redux/userSlice";
import { showToast } from "@/lib/toast";

export const UserFormPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const isEdit = !!id;
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { currentUser } = useAppSelector((state) => state.user);

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const { data: existingUser, isLoading: userLoading } = useUserDetail(id || "");
  const { data: roles = [] } = useRolesList();
  const { data: companies = [] } = useCompaniesList();
  const { data: userGroups } = useUserGroupList();

  const createUserMutation = useCreateUser();
  const updateUserMutation = useUpdateUser();

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    setError,
    formState: { errors, isSubmitting }
  } = useForm<UserFormData>({
    mode: "onBlur",
    resolver: zodResolver(userFormSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "+91 ",
      password: "",
      confirmPassword: "",
      company: "InOrbit Fleet Logistics",
      branch: "Mumbai Central Hub",
      reseller: "Direct Enterprise",
      allocationGroup: "All India Logistics",
      groupId: "",
      role: "FLEET_MANAGER",
      isActive: true,
      language: "en",
      timezone: "Asia/Kolkata",
      dateFormat: "DD/MM/YYYY",
      measurementUnit: "km",
      features: {
        liveTracking: true,
        dashboardCharts: true,
        routePlayback: true,
        emailAlerts: true
      }
    }
  });

  const isActive = watch("isActive");
  const currentFeatures = watch("features") || {
    liveTracking: true,
    dashboardCharts: true,
    routePlayback: true,
    emailAlerts: true
  };

  useEffect(() => {
    if (existingUser && isEdit) {
      reset({
        firstName: existingUser.firstName,
        lastName: existingUser.lastName,
        email: existingUser.email,
        phone: existingUser.phone || "+91 98201 12345",
        password: "",
        confirmPassword: "",
        company: existingUser.company || "InOrbit Fleet Logistics",
        branch: existingUser.branch || "Mumbai Central Hub",
        reseller: existingUser.reseller || "Direct Enterprise",
        allocationGroup: existingUser.allocationGroup || "All India Logistics",
        groupId: existingUser.groupId || "",
        role: existingUser.role || "FLEET_MANAGER",
        isActive: existingUser.isActive,
        language: existingUser.language || "en",
        timezone: existingUser.timezone || "Asia/Kolkata",
        dateFormat: existingUser.dateFormat || "DD/MM/YYYY",
        measurementUnit: existingUser.measurementUnit || "km",
        features: existingUser.features || {
          liveTracking: true,
          dashboardCharts: true,
          routePlayback: true,
          emailAlerts: true
        }
      });
    }
  }, [existingUser, isEdit, reset]);

  const onSubmit = async (data: UserFormData) => {
    // In Create mode, password is required and must be at least 6 characters
    if (!isEdit) {
      if (!data.password || data.password.trim().length < 6) {
        setError("password", { message: "Password is required (minimum 6 characters)" });
        return;
      }
      if (!data.confirmPassword) {
        setError("confirmPassword", { message: "Please confirm your password" });
        return;
      }
      if (data.password !== data.confirmPassword) {
        setError("confirmPassword", { message: "Passwords do not match" });
        return;
      }
    }

    try {
      if (isEdit && id) {
        await updateUserMutation.mutateAsync({
          id,
          payload: {
            firstName: data.firstName,
            lastName: data.lastName,
            email: data.email,
            phone: data.phone,
            company: data.company,
            branch: data.branch,
            reseller: data.reseller,
            allocationGroup: data.allocationGroup,
            groupId: data.groupId || undefined,
            role: data.role,
            isActive: data.isActive,
            language: data.language,
            timezone: data.timezone,
            dateFormat: data.dateFormat,
            measurementUnit: data.measurementUnit,
            features: data.features,
            ...(data.password ? { password: data.password } : {})
          }
        });

        // Sync Redux currentUser in real-time if editing currently logged-in account
        if (
          currentUser &&
          (currentUser.id === id || currentUser.email?.toLowerCase() === existingUser?.email?.toLowerCase())
        ) {
          dispatch(
            updateUserProfile({
              firstName: data.firstName,
              lastName: data.lastName,
              email: data.email
            })
          );
        }
      } else {
        await createUserMutation.mutateAsync({
          firstName: data.firstName,
          lastName: data.lastName,
          email: data.email,
          phone: data.phone,
          password: data.password!,
          company: data.company,
          branch: data.branch,
          reseller: data.reseller,
          allocationGroup: data.allocationGroup,
          groupId: data.groupId || undefined,
          role: data.role,
          isActive: data.isActive,
          language: data.language,
          timezone: data.timezone,
          dateFormat: data.dateFormat,
          measurementUnit: data.measurementUnit,
          features: data.features
        });
      }
      navigate("/users/list");
    } catch (err: any) {
      const resData = err?.response?.data;
      const rawMsg =
        (Array.isArray(resData?.errors) ? resData.errors.join(", ") : null) ||
        resData?.message ||
        resData?.error ||
        err?.message ||
        "Failed to save user";

      const formattedMsg = rawMsg.toLowerCase().includes("duplicate value for field email")
        ? "User with this email already exists"
        : rawMsg;

      if (formattedMsg.toLowerCase().includes("email") || formattedMsg.toLowerCase().includes("duplicate")) {
        setError("email", { message: formattedMsg });
        showToast.error(formattedMsg);
      } else if (formattedMsg.toLowerCase().includes("phone")) {
        setError("phone", { message: formattedMsg });
        showToast.error(formattedMsg);
      } else {
        showToast.error(formattedMsg);
      }
    }
  };

  if (isEdit && userLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="text-center space-y-2">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent mx-auto"></div>
          <p className="text-xs text-slate-500">Loading user profile...</p>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 pb-20">
      <PageHeader
        breadcrumbs={[
          { label: "User Rights", href: "/users" },
          { label: "Users Directory", href: "/users/list" }
        ]}
        title={isEdit ? `Edit User: ${existingUser?.fullName || ""}` : "Add User Detail"}
        badge={isEdit ? "EXISTING ACCOUNT" : "NEW USER"}
        badgeVariant="cyan"
        description="Configure account credentials, organizational allocation groups, and telematics portal feature access."
        actions={
          <Button
            type="button"
            variant="secondary"
            leftIcon={<ArrowLeft className="h-4 w-4" />}
            onClick={() => navigate("/users/list")}
          >
            Back to List
          </Button>
        }
      />
      {/* SECTION 1: User Information & Allocation (Figma Node 3039:200 Frame 3 Section 1) */}
      <div className="panel-card space-y-5">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400 font-bold text-xs">
              1
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                User Information and Allocation
              </h3>
              <p className="text-2xs text-slate-500 dark:text-slate-400">
                Corporate reseller, organization branch, and administrative system role
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-slate-600 dark:text-slate-300">
              Account Status:
            </span>
            <button
              type="button"
              onClick={() => setValue("isActive", !isActive)}
              className={`px-3 py-1 rounded-full text-2xs font-bold transition-all focus-ring ${isActive
                ? "bg-emerald-500/15 text-emerald-600 border border-emerald-500/30"
                : "bg-slate-200 text-slate-600 dark:bg-slate-800 dark:text-slate-400 border border-slate-300 dark:border-slate-700"
                }`}
            >
              {isActive ? "ACTIVE" : "SUSPENDED"}
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {/* Reseller */}
          <Select
            label="Reseller / Distributor"
            {...register("reseller")}
            sizeVariant="md"
            options={[
              { label: "Direct Enterprise", value: "Direct Enterprise" },
              { label: "Apex Telecom Reseller", value: "Apex Telecom Reseller" },
              { label: "Velocity Distribution India", value: "Velocity Distribution India" }
            ]}
          />

          {/* Company */}
          <Select
            label="Company Organization"
            {...register("company")}
            error={errors.company?.message}
            sizeVariant="md"
            options={companies
              .filter((c) => c !== "All Companies")
              .map((c) => ({ label: c, value: c }))}
          />

          {/* Branch */}
          <Select
            label="Operating Branch"
            {...register("branch")}
            sizeVariant="md"
            options={[
              { label: "Mumbai Central Hub", value: "Mumbai Central Hub" },
              { label: "Delhi NCR Depot", value: "Delhi NCR Depot" },
              { label: "Bengaluru Tech Park", value: "Bengaluru Tech Park" },
              { label: "Ahmedabad Transit Hub", value: "Ahmedabad Transit Hub" },
              { label: "Chennai Port Depot", value: "Chennai Port Depot" }
            ]}
          />

          {/* Allocation Group */}
          <Select
            label="Allocation Group"
            {...register("allocationGroup")}
            error={errors.allocationGroup?.message}
            sizeVariant="md"
            options={[
              { label: "All India Logistics", value: "All India Logistics" },
              { label: "Western Express Corridor", value: "Western Express Corridor" },
              { label: "Northern Logistics Corridor", value: "Northern Logistics Corridor" },
              { label: "Southern Fleet Ring", value: "Southern Fleet Ring" },
              { label: "Gujarat Corridor Express", value: "Gujarat Corridor Express" },
              { label: "Eastern Freight Corridor", value: "Eastern Freight Corridor" }
            ]}
          />

          {/* Security Group (RBAC Policy) */}
          <Select
            label="Security Group (RBAC Policy)"
            {...register("groupId")}
            sizeVariant="md"
            options={[
              { label: "No Group Assigned (Default View Only)", value: "" },
              ...(userGroups?.rows || []).map((g) => ({
                label: `${g.name} (${g.company})`,
                value: g.id
              }))
            ]}
          />

          {/* System Role */}
          <Select
            label="System Role / Permissions"
            {...register("role")}
            error={errors.role?.message}
            sizeVariant="md"
            options={roles.map((r) => ({
              label: `${r.name.replace(/_/g, " ").toLowerCase().replace(/\b\w/g, (l) => l.toUpperCase())} - ${r.description}`,
              value: r.name
            }))}
          />
        </div>
      </div>

      {/* SECTION 2: Personal and Contact Details (Figma Node 3039:200 Frame 3 Section 2) */}
      <div className="panel-card space-y-5">
        <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100 dark:border-slate-800">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400 font-bold text-xs">
            2
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              Personal and Contact Details
            </h3>
            <p className="text-2xs text-slate-500 dark:text-slate-400">
              Legal name, authorized telematics email, mobile contact, and portal login credentials
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* First Name */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
              First Name <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              placeholder="e.g. Aarav"
              {...register("firstName")}
              className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-3.5 py-2.5 text-xs text-slate-900 dark:text-white placeholder:text-slate-400 focus-ring"
            />
            {errors.firstName && (
              <p className="text-2xs text-rose-500">{errors.firstName.message}</p>
            )}
          </div>

          {/* Last Name */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
              Last Name <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              placeholder="e.g. Patel"
              {...register("lastName")}
              className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-3.5 py-2.5 text-xs text-slate-900 dark:text-white placeholder:text-slate-400 focus-ring"
            />
            {errors.lastName && (
              <p className="text-2xs text-rose-500">{errors.lastName.message}</p>
            )}
          </div>

          {/* Email Address */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
              Email Address (Login Username) <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input
                type="email"
                placeholder="aarav.patel@orbito.io"
                autoComplete="email"
                {...register("email")}
                className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 pl-10 pr-3.5 py-2.5 text-xs text-slate-900 dark:text-white placeholder:text-slate-400 focus-ring font-mono"
              />
            </div>
            {errors.email && (
              <p className="text-2xs text-rose-500">{errors.email.message}</p>
            )}
          </div>

          {/* Mobile Number */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
              Mobile Contact Number <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input
                type="tel"
                placeholder="+91 98201 12345"
                autoComplete="tel"
                {...register("phone")}
                className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 pl-10 pr-3.5 py-2.5 text-xs text-slate-900 dark:text-white placeholder:text-slate-400 focus-ring font-mono"
              />
            </div>
            {errors.phone && (
              <p className="text-2xs text-rose-500">{errors.phone.message}</p>
            )}
          </div>

          {/* Password */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
              {isEdit ? "New Password" : "Password"} <span className={isEdit ? "text-slate-400 font-normal" : "text-rose-500"}>{isEdit ? "(Leave blank to keep existing)" : "*"}</span>
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="••••••••••••"
                autoComplete="new-password"
                {...register("password")}
                className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 pr-10 pl-3.5 py-2.5 text-xs text-slate-900 dark:text-white placeholder:text-slate-400 focus-ring font-mono"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 focus-ring p-1 rounded"
                aria-label={showPassword ? "Hide password" : "Show password"}
                aria-pressed={showPassword}
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            {errors.password && (
              <p className="text-2xs text-rose-500">{errors.password.message}</p>
            )}
          </div>

          {/* Confirm Password */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
              {isEdit ? "Confirm New Password" : "Confirm Password"} {!isEdit && <span className="text-rose-500">*</span>}
            </label>
            <div className="relative">
              <input
                type={showConfirmPassword ? "text" : "password"}
                placeholder="••••••••••••"
                autoComplete="new-password"
                {...register("confirmPassword")}
                className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 pr-10 pl-3.5 py-2.5 text-xs text-slate-900 dark:text-white placeholder:text-slate-400 focus-ring font-mono"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 focus-ring p-1 rounded"
                aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                aria-pressed={showConfirmPassword}
              >
                {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            {errors.confirmPassword && (
              <p className="text-2xs text-rose-500">{errors.confirmPassword.message}</p>
            )}
          </div>
        </div>
      </div>

      {/* SECTION 3: Localization and Application Preferences (Figma Node 3039:200 Frame 3 Section 3) */}
      <div className="panel-card space-y-5">
        <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100 dark:border-slate-800">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400 font-bold text-xs">
            3
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              Localization and Application Preferences
            </h3>
            <p className="text-2xs text-slate-500 dark:text-slate-400">
              Display language, regional telematics timezone, measurement units, and portal view toggles
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {/* Language */}
          <Select
            label="Language"
            {...register("language")}
            sizeVariant="md"
            options={[
              { label: "English (India / US)", value: "en" },
              { label: "Hindi (हिन्दी)", value: "hi" },
              { label: "Gujarati (ગુજરાતી)", value: "gu" },
              { label: "Marathi (मराठी)", value: "mr" }
            ]}
          />

          {/* Time Zone */}
          <Select
            label="Time Zone"
            {...register("timezone")}
            sizeVariant="md"
            options={[
              { label: "UTC+05:30 (IST - Indian Standard Time)", value: "Asia/Kolkata" },
              { label: "UTC+04:00 (GST - Gulf Standard Time)", value: "Asia/Dubai" },
              { label: "UTC+00:00 (Coordinated Universal Time)", value: "UTC" }
            ]}
          />

          {/* Date Format */}
          <Select
            label="Date Format"
            {...register("dateFormat")}
            sizeVariant="md"
            options={[
              { label: "DD/MM/YYYY (Indian Standard)", value: "DD/MM/YYYY" },
              { label: "YYYY-MM-DD (ISO Format)", value: "YYYY-MM-DD" },
              { label: "MM/DD/YYYY (US Format)", value: "MM/DD/YYYY" }
            ]}
          />

          {/* Measurement Unit */}
          <Select
            label="Speed & Distance Unit"
            {...register("measurementUnit")}
            sizeVariant="md"
            options={[
              { label: "Kilometers (km, km/h)", value: "km" },
              { label: "Miles (mi, mph)", value: "mph" }
            ]}
          />
        </div>

        {/* Feature Permissions Checkboxes (Figma Frame 3) */}
        <div className="mt-5 pt-4 border-t border-slate-100 dark:border-slate-800">
          <label className="text-xs font-bold text-slate-900 dark:text-white block mb-3">
            Enabled Portal Feature Modules
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            <label className="flex items-center gap-2.5 p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/40 cursor-pointer hover:border-blue-500/40 transition-colors">
              <input
                type="checkbox"
                checked={currentFeatures.liveTracking}
                onChange={(e) =>
                  setValue("features.liveTracking", e.target.checked)
                }
                className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer dark:border-slate-600 dark:bg-slate-800"
              />
              <span className="text-xs font-medium text-slate-800 dark:text-slate-200">
                Live Map Tracking
              </span>
            </label>

            <label className="flex items-center gap-2.5 p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/40 cursor-pointer hover:border-blue-500/40 transition-colors">
              <input
                type="checkbox"
                checked={currentFeatures.dashboardCharts}
                onChange={(e) =>
                  setValue("features.dashboardCharts", e.target.checked)
                }
                className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer dark:border-slate-600 dark:bg-slate-800"
              />
              <span className="text-xs font-medium text-slate-800 dark:text-slate-200">
                Dashboard Charts
              </span>
            </label>

            <label className="flex items-center gap-2.5 p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/40 cursor-pointer hover:border-blue-500/40 transition-colors">
              <input
                type="checkbox"
                checked={currentFeatures.routePlayback}
                onChange={(e) =>
                  setValue("features.routePlayback", e.target.checked)
                }
                className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer dark:border-slate-600 dark:bg-slate-800"
              />
              <span className="text-xs font-medium text-slate-800 dark:text-slate-200">
                Route Replay Engine
              </span>
            </label>

            <label className="flex items-center gap-2.5 p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/40 cursor-pointer hover:border-blue-500/40 transition-colors">
              <input
                type="checkbox"
                checked={currentFeatures.emailAlerts}
                onChange={(e) =>
                  setValue("features.emailAlerts", e.target.checked)
                }
                className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer dark:border-slate-600 dark:bg-slate-800"
              />
              <span className="text-xs font-medium text-slate-800 dark:text-slate-200">
                Receive Email Alerts
              </span>
            </label>
          </div>
        </div>
      </div>

      {/* Floating / Sticky Action Footer */}
      <div className="fixed bottom-0 left-0 right-0 z-40 border-t border-slate-200/80 dark:border-slate-800 bg-white/90 dark:bg-[#0F172B]/90 backdrop-blur-md px-6 py-3.5 shadow-lg">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <p className="text-2xs text-slate-500 dark:text-slate-400 hidden sm:block">
            All account creations are signed and recorded in compliance with ISO 27001 Access Control guidelines.
          </p>
          <div className="flex items-center gap-3 ml-auto">
            <Button
              type="button"
              variant="secondary"
              onClick={() => navigate("/users/list")}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              leftIcon={<Save className="h-4 w-4" />}
              disabled={isSubmitting || createUserMutation.isPending || updateUserMutation.isPending}
            >
              {isSubmitting ? "Saving Account..." : isEdit ? "Update User Detail" : "Save User Account"}
            </Button>
          </div>
        </div>
      </div>
    </form>
  );
};

export default UserFormPage;
