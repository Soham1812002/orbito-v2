import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  ArrowLeft,
  Save,
  X,
  ShieldCheck,
  Building2,
  Copy,
  Layers,
  Sparkles,
  Info
} from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { Button } from "@/components/common/Button";
import { Select } from "@/components/common/Select";
import { PermissionMatrixTable } from "./components/PermissionMatrixTable";
import { userGroupFormSchema, UserGroupFormData } from "@/schemas/users.schema";
import {
  useUserGroupDetail,
  useUserGroupList,
  useCreateUserGroup,
  useUpdateUserGroup,
  useRolesList,
  useCompaniesList
} from "@/queries/users.queries";
import { DEFAULT_PERMISSION_MATRIX } from "@/api/users.api";
import { ModulePermission } from "@/types/users.types";
import { showToast } from "@/lib/toast";

export const UserGroupFormPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const isEdit = !!id;
  const navigate = useNavigate();

  const { data: existingGroup, isLoading: groupLoading } = useUserGroupDetail(id || "");
  const { data: allGroups } = useUserGroupList();
  const { data: roles = [] } = useRolesList();
  const { data: companies = [] } = useCompaniesList();

  const createGroupMutation = useCreateUserGroup();
  const updateGroupMutation = useUpdateUserGroup();

  const [permissionsState, setPermissionsState] = useState<ModulePermission[]>(DEFAULT_PERMISSION_MATRIX);

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors, isSubmitting }
  } = useForm<UserGroupFormData>({
    resolver: zodResolver(userGroupFormSchema),
    defaultValues: {
      name: "",
      description: "",
      company: "InOrbit Fleet Logistics",
      branch: "Mumbai Central Hub",
      reseller: "Direct Enterprise",
      adminRole: "FLEET_MANAGER",
      isActive: true,
      allowExcelExport: true,
      allowOperationalManage: false,
      isSystemAdmin: false,
      permissions: DEFAULT_PERMISSION_MATRIX
    }
  });

  const isActive = watch("isActive");
  const allowExcelExport = watch("allowExcelExport");
  const allowOperationalManage = watch("allowOperationalManage");
  const isSystemAdmin = watch("isSystemAdmin");

  useEffect(() => {
    if (existingGroup && isEdit) {
      reset({
        name: existingGroup.name,
        description: existingGroup.description,
        company: existingGroup.company || "InOrbit Fleet Logistics",
        branch: existingGroup.branch || "Mumbai Central Hub",
        reseller: existingGroup.reseller || "Direct Enterprise",
        adminRole: existingGroup.adminRole || "FLEET_MANAGER",
        isActive: existingGroup.isActive,
        allowExcelExport: existingGroup.allowExcelExport,
        allowOperationalManage: existingGroup.allowOperationalManage,
        isSystemAdmin: existingGroup.isSystemAdmin,
        permissions: existingGroup.permissions?.length ? existingGroup.permissions : DEFAULT_PERMISSION_MATRIX
      });
      if (existingGroup.permissions?.length) {
        setPermissionsState(existingGroup.permissions);
      }
    }
  }, [existingGroup, isEdit, reset]);

  const handleDuplicateTemplate = (groupId: string) => {
    if (!groupId) return;
    const source = allGroups?.rows?.find((g) => g.id === groupId);
    if (source) {
      setValue("company", source.company);
      setValue("adminRole", source.adminRole);
      setValue("allowExcelExport", source.allowExcelExport);
      setValue("allowOperationalManage", source.allowOperationalManage);
      setValue("isSystemAdmin", source.isSystemAdmin);
      if (source.permissions?.length) {
        setPermissionsState(source.permissions);
        setValue("permissions", source.permissions);
      }
      showToast.info(`Copied permissions and policy template from "${source.name}"`);
    }
  };

  const handlePermissionsChange = (updated: ModulePermission[]) => {
    setPermissionsState(updated);
    setValue("permissions", updated);
  };

  const onSubmit = async (data: UserGroupFormData) => {
    try {
      const payload = {
        name: data.name,
        description: data.description,
        company: data.company,
        branch: data.branch,
        reseller: data.reseller,
        adminRole: data.adminRole,
        isActive: data.isActive,
        allowExcelExport: data.allowExcelExport,
        allowOperationalManage: data.allowOperationalManage,
        isSystemAdmin: data.isSystemAdmin,
        permissions: permissionsState
      };

      if (isEdit && id) {
        await updateGroupMutation.mutateAsync({ id, payload });
      } else {
        await createGroupMutation.mutateAsync(payload);
      }
      navigate("/users/groups");
    } catch {
      // Error handled by mutation
    }
  };

  if (isEdit && groupLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="text-center space-y-2">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent mx-auto"></div>
          <p className="text-xs text-slate-500">Loading user group...</p>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 pb-20">
      <PageHeader
        breadcrumbs={[
          { label: "User Rights", href: "/users" },
          { label: "User Groups", href: "/users/groups" },
          { label: isEdit ? "Edit Group Detail" : "User Group Detail" }
        ]}
        title={isEdit ? `Edit Group: ${existingGroup?.name || ""}` : "User Group Detail"}
        badge={isEdit ? "EXISTING GROUP" : "NEW GROUP"}
        badgeVariant="cyan"
        description="Configure role inheritance, policy privileges, and granular CRUD permissions across fleet modules."
        actions={
          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="secondary"
              size="sm"
              leftIcon={<ArrowLeft className="h-4 w-4" />}
              onClick={() => navigate("/users/groups")}
            >
              Back to Groups
            </Button>
            <Button
              type="button"
              variant="secondary"
              size="sm"
              leftIcon={<X className="h-4 w-4" />}
              onClick={() => navigate("/users/groups")}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              size="sm"
              leftIcon={<Save className="h-4 w-4" />}
              disabled={isSubmitting || createGroupMutation.isPending || updateGroupMutation.isPending}
            >
              {isSubmitting ? "Saving Group..." : isEdit ? "Update User Group" : "Save Group"}
            </Button>
          </div>
        }
      />

      {/* SECTION 1: Group Information & Permissions (Figma Node 3039:200 Frame 5 Section 1) */}
      <div className="panel-card space-y-5">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 font-bold text-xs">
              1
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Group Information and Permissions
              </h3>
              <p className="text-2xs text-slate-500 dark:text-slate-400">
                Define the security perimeter, company assignment, and administrative role boundaries
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-slate-600 dark:text-slate-300">
              Group Status:
            </span>
            <button
              type="button"
              onClick={() => setValue("isActive", !isActive)}
              className={`px-3 py-1 rounded-full text-2xs font-bold transition-all focus-ring ${
                isActive
                  ? "bg-emerald-500/15 text-emerald-600 border border-emerald-500/30"
                  : "bg-slate-200 text-slate-600 dark:bg-slate-800 dark:text-slate-400 border border-slate-300 dark:border-slate-700"
              }`}
            >
              {isActive ? "ACTIVE" : "INACTIVE"}
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {/* Reseller */}
          <Select
            label="Reseller / Distributor"
            {...register("reseller")}
            sizeVariant="md"
          >
            <option value="Direct Enterprise">Direct Enterprise</option>
            <option value="Apex Telecom Reseller">Apex Telecom Reseller</option>
            <option value="Velocity Distribution India">Velocity Distribution India</option>
          </Select>

          {/* Company */}
          <Select
            label="Company Organization"
            {...register("company")}
            error={errors.company?.message}
            sizeVariant="md"
          >
            {companies.filter((c) => c !== "All Companies").map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </Select>

          {/* Branch */}
          <Select
            label="Operating Branch"
            {...register("branch")}
            sizeVariant="md"
          >
            <option value="Mumbai Central Hub">Mumbai Central Hub</option>
            <option value="Delhi NCR Depot">Delhi NCR Depot</option>
            <option value="Bengaluru Tech Park">Bengaluru Tech Park</option>
            <option value="Ahmedabad Transit Hub">Ahmedabad Transit Hub</option>
            <option value="Chennai Port Depot">Chennai Port Depot</option>
          </Select>

          {/* Group Name */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300">
              Group Name <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              placeholder="e.g. Fleet Operations Core"
              {...register("name")}
              className="h-10 w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-3.5 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus-ring"
            />
            {errors.name && (
              <p className="text-2xs text-rose-500">{errors.name.message}</p>
            )}
          </div>

          {/* Admin Role */}
          <Select
            label="Base Administrative Role"
            {...register("adminRole")}
            error={errors.adminRole?.message}
            sizeVariant="md"
          >
            {roles.map((r) => (
              <option key={r.id} value={r.name}>
                {r.name}
              </option>
            ))}
          </Select>

          {/* Duplicate Group Template Selector (Figma Node 3039:200 Frame 5) */}
          <Select
            label="Duplicate from Existing Group"
            onChange={(e) => handleDuplicateTemplate(e.target.value)}
            sizeVariant="md"
          >
            <option value="">Select template to copy...</option>
            {allGroups?.rows?.map((g) => (
              <option key={g.id} value={g.id}>
                {g.name} ({g.company})
              </option>
            ))}
          </Select>

          {/* Description */}
          <div className="space-y-1.5 md:col-span-2 lg:col-span-3">
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
              Group Operational Description <span className="text-rose-500">*</span>
            </label>
            <textarea
              rows={2}
              placeholder="Describe the operational mandate, department, or fleet region this security group governs..."
              {...register("description")}
              className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-3 text-xs text-slate-900 dark:text-white placeholder:text-slate-400 focus-ring"
            />
            {errors.description && (
              <p className="text-2xs text-rose-500">{errors.description.message}</p>
            )}
          </div>
        </div>

        {/* Governance Policy Checkboxes (Figma Frame 5) */}
        <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
          <label className="text-xs font-bold text-slate-900 dark:text-white block mb-3">
            Global Administrative Governance Policies
          </label>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <label className="flex items-center gap-2.5 p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/40 cursor-pointer hover:border-blue-500/40 transition-colors">
              <input
                type="checkbox"
                checked={allowExcelExport}
                onChange={(e) => setValue("allowExcelExport", e.target.checked)}
                className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer dark:border-slate-600 dark:bg-slate-800"
              />
              <div>
                <span className="text-xs font-bold text-slate-900 dark:text-white block">
                  Allow Export to Excel
                </span>
                <span className="text-2xs text-slate-500">
                  Permit CSV and XLSX downloads of telematics logs
                </span>
              </div>
            </label>

            <label className="flex items-center gap-2.5 p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/40 cursor-pointer hover:border-blue-500/40 transition-colors">
              <input
                type="checkbox"
                checked={allowOperationalManage}
                onChange={(e) => setValue("allowOperationalManage", e.target.checked)}
                className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer dark:border-slate-600 dark:bg-slate-800"
              />
              <div>
                <span className="text-xs font-bold text-slate-900 dark:text-white block">
                  Allow User Provisioning
                </span>
                <span className="text-2xs text-slate-500">
                  Allow members to invite and manage lower-tier users
                </span>
              </div>
            </label>

            <label className="flex items-center gap-2.5 p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/40 cursor-pointer hover:border-blue-500/40 transition-colors">
              <input
                type="checkbox"
                checked={isSystemAdmin}
                onChange={(e) => setValue("isSystemAdmin", e.target.checked)}
                className="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer dark:border-slate-600 dark:bg-slate-800"
              />
              <div>
                <span className="text-xs font-bold text-slate-900 dark:text-white block">
                  System Administrative Root
                </span>
                <span className="text-2xs text-slate-500">
                  Designate as root security group with super-user override
                </span>
              </div>
            </label>
          </div>
        </div>
      </div>

      {/* SECTION 2: Granular Module Permission Matrix (Figma Node 3039:200 Frame 5 Section 2) */}
      <div className="panel-card space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400 font-bold text-xs">
              2
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Role Matrix & Granular Module Permissions
              </h3>
              <p className="text-2xs text-slate-500 dark:text-slate-400">
                Grant or restrict exact CRUD operations (View, Add, Edit, Delete, Export, Control) per feature
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-2xs font-semibold text-slate-500">
              Quick presets: Full Access, View Only, Custom, No Access
            </span>
          </div>
        </div>

        {/* Matrix Component */}
        <PermissionMatrixTable
          permissions={permissionsState}
          onChange={handlePermissionsChange}
        />
      </div>

      {/* Floating Sticky Action Bar */}
      <div className="fixed bottom-0 left-0 right-0 z-40 border-t border-slate-200/80 dark:border-slate-800 bg-white/90 dark:bg-[#0F172B]/90 backdrop-blur-md px-6 py-3.5 shadow-lg">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <p className="text-2xs text-slate-500 dark:text-slate-400 hidden sm:block">
            Modifications to RBAC matrices apply in real-time across all authenticated users in this security group.
          </p>
          <div className="flex items-center gap-3 ml-auto">
            <Button
              type="button"
              variant="secondary"
              size="sm"
              onClick={() => navigate("/users/groups")}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              size="sm"
              leftIcon={<Save className="h-4 w-4" />}
              disabled={isSubmitting || createGroupMutation.isPending || updateGroupMutation.isPending}
            >
              {isSubmitting ? "Saving Group..." : isEdit ? "Update User Group" : "Save User Group"}
            </Button>
          </div>
        </div>
      </div>
    </form>
  );
};

export default UserGroupFormPage;
