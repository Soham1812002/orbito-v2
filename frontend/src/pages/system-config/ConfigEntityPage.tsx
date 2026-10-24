import React, { useState, useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Plus,
  RefreshCw,
  Search,
  Download,
  Edit2,
  Trash2,
  Copy,
  AlertCircle,
  Loader2
} from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { Button } from "@/components/common/Button";
import { Modal } from "@/components/common/Modal";
import { AppDataTable, StatusBadgeCell } from "@/components/common/AppDataTable";
import { TableFilterBar } from "@/components/common/TableFilterBar";
import type { ColDef } from "ag-grid-community";
import { showToast } from "@/lib/toast";
import { systemConfigApi, SystemConfigItem } from "@/api/systemConfig.api";

export interface ConfigFieldDef {
  key: string;
  label: string;
  type: "text" | "number" | "select" | "textarea" | "checkbox" | "password";
  required?: boolean;
  placeholder?: string;
  options?: { label: string; value: string }[];
  helperText?: string;
}

export interface ConfigEntityConfig {
  moduleKey: string;
  title: string;
  singularTitle: string;
  category: string;
  badge: string;
  description: string;
  initialItems?: Record<string, any>[];
  columns: {
    key: string;
    label: string;
    render?: (val: any, row: any) => React.ReactNode;
  }[];
  fields: ConfigFieldDef[];
}

export const ConfigEntityPage: React.FC<{ config: ConfigEntityConfig }> = ({ config }) => {
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");

  // Fetch real data from PostgreSQL via backend REST API
  const {
    data: items = [],
    isLoading,
    isFetching,
    refetch
  } = useQuery({
    queryKey: ["system-config", config.moduleKey],
    queryFn: ({ signal }) => systemConfigApi.getConfigs(config.moduleKey, signal),
    staleTime: 30000
  });

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"create" | "edit" | "copy">("create");
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [editingId, setEditingId] = useState<string | null>(null);

  // Delete State
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<Record<string, any> | null>(null);

  // React Query Mutations for database persistence
  const createMutation = useMutation({
    mutationFn: (data: Record<string, any>) => systemConfigApi.createConfig(config.moduleKey, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["system-config", config.moduleKey] });
      showToast.success(`${config.singularTitle} created successfully!`);
      setIsModalOpen(false);
    },
    onError: (err: any) => {
      showToast.error(err?.response?.data?.message || `Failed to create ${config.singularTitle}`);
    }
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Record<string, any> }) =>
      systemConfigApi.updateConfig(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["system-config", config.moduleKey] });
      showToast.success(`${config.singularTitle} updated successfully!`);
      setIsModalOpen(false);
    },
    onError: (err: any) => {
      showToast.error(err?.response?.data?.message || `Failed to update ${config.singularTitle}`);
    }
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => systemConfigApi.deleteConfig(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["system-config", config.moduleKey] });
      showToast.success(`${config.singularTitle} removed successfully.`);
      setDeleteModalOpen(false);
      setItemToDelete(null);
    },
    onError: (err: any) => {
      showToast.error(err?.response?.data?.message || `Failed to delete ${config.singularTitle}`);
    }
  });

  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      const matchSearch = Object.values(item).some((v) =>
        typeof v === "object" && v !== null
          ? JSON.stringify(v).toLowerCase().includes(searchTerm.toLowerCase())
          : String(v).toLowerCase().includes(searchTerm.toLowerCase())
      );
      const matchStatus =
        statusFilter === "ALL" ||
        (statusFilter === "ACTIVE" && item.isActive !== false) ||
        (statusFilter === "INACTIVE" && item.isActive === false);
      return matchSearch && matchStatus;
    });
  }, [items, searchTerm, statusFilter]);

  const activeCount = useMemo(
    () => items.filter((i) => i.isActive !== false).length,
    [items]
  );
  const inactiveCount = items.length - activeCount;

  const handleOpenCreate = () => {
    const initialForm: Record<string, any> = { isActive: true };
    config.fields.forEach((f) => {
      initialForm[f.key] = f.type === "checkbox" ? false : "";
    });
    setFormData(initialForm);
    setFieldErrors({});
    setModalMode("create");
    setEditingId(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (item: Record<string, any>) => {
    setFormData({ ...item });
    setFieldErrors({});
    setModalMode("edit");
    setEditingId(item.id || item._id);
    setIsModalOpen(true);
  };

  const handleOpenCopy = (item: Record<string, any>) => {
    const copyData: Record<string, any> = { ...item, id: undefined, _id: undefined };

    const primaryNameKeys = [
      "name",
      "planName",
      "resellerName",
      "providerName",
      "modelName",
      "featureName",
      "typeName",
      "title"
    ];
    const foundNameKey = primaryNameKeys.find(
      (k) => typeof copyData[k] === "string" && copyData[k].trim()
    );

    if (foundNameKey) {
      copyData[foundNameKey] = `${copyData[foundNameKey]} (Copy)`;
    } else {
      const firstTextField = config.fields.find(
        (f) => f.type === "text" && typeof copyData[f.key] === "string"
      );
      if (firstTextField) {
        copyData[firstTextField.key] = `${copyData[firstTextField.key]} (Copy)`;
      }
    }

    const codeKeys = ["code", "modelCode", "groupCode", "planCode"];
    const foundCodeKey = codeKeys.find(
      (k) => typeof copyData[k] === "string" && copyData[k].trim()
    );
    if (foundCodeKey) {
      copyData[foundCodeKey] = `${copyData[foundCodeKey]}-COPY`;
    }

    setFormData(copyData);
    setFieldErrors({});
    setModalMode("copy");
    setEditingId(null);
    setIsModalOpen(true);
  };

  const handleFieldChange = (key: string, value: any) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
    if (fieldErrors[key]) {
      setFieldErrors((prev) => {
        const next = { ...prev };
        delete next[key];
        return next;
      });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const errors: Record<string, string> = {};

    for (const f of config.fields) {
      const val = formData[f.key];
      if (f.required && (val === undefined || val === null || String(val).trim() === "")) {
        errors[f.key] = `${f.label} is required`;
      } else if (f.type === "number" && val !== undefined && val !== "") {
        const num = Number(val);
        if (Number.isNaN(num)) {
          errors[f.key] = `${f.label} must be a valid number`;
        } else if (num < 0) {
          errors[f.key] = `${f.label} cannot be negative`;
        }
      }
    }

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      const firstError = Object.values(errors)[0];
      showToast.error(firstError);
      return;
    }

    setFieldErrors({});

    if (modalMode === "edit" && editingId) {
      updateMutation.mutate({ id: editingId, data: formData });
    } else {
      createMutation.mutate(formData);
    }
  };

  const handleDeleteConfirm = () => {
    if (itemToDelete) {
      const id = itemToDelete.id || itemToDelete._id;
      deleteMutation.mutate(id);
    }
  };

  const handleExport = () => {
    if (filteredItems.length === 0) {
      showToast.error("No records to export");
      return;
    }
    const headers = config.columns.map((c) => `"${c.label.replace(/"/g, '""')}"`).join(",");
    const rows = filteredItems.map((item) =>
      config.columns
        .map((c) => `"${String(item[c.key] ?? "").replace(/"/g, '""')}"`)
        .join(",")
    );
    const csvContent = [headers, ...rows].join("\r\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `${config.moduleKey}-export.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    showToast.success("Export downloaded successfully!");
  };

  const isSubmitting = createMutation.isPending || updateMutation.isPending;

  const gridColumns = useMemo<ColDef<SystemConfigItem>[]>(() => {
    const cols: ColDef<SystemConfigItem>[] = config.columns.map((c) => ({
      headerName: c.label,
      field: c.key as any,
      minWidth: 140,
      flex: 1,
      cellRenderer: (params: any) => {
        if (!params.data) return null;
        if (c.render) {
          return c.render(params.value, params.data);
        }
        return (
          <span className="text-xs text-slate-700 dark:text-slate-300">
            {String(params.value ?? "-")}
          </span>
        );
      }
    }));

    cols.push({
      headerName: "Actions",
      field: "id" as any,
      minWidth: 120,
      sortable: false,
      filter: false,
      cellRenderer: (params: any) => {
        const item = params.data;
        if (!item) return null;
        return (
          <div className="flex items-center justify-end gap-1 py-1">
            <button
              type="button"
              onClick={() => handleOpenCopy(item)}
              className="p-1.5 rounded-lg text-slate-400 hover:text-blue-500 hover:bg-slate-100 dark:hover:bg-[#1D293D] transition-colors"
              title="Duplicate record"
            >
              <Copy className="h-3.5 w-3.5" />
            </button>
            <button
              type="button"
              onClick={() => handleOpenEdit(item)}
              className="p-1.5 rounded-lg text-slate-400 hover:text-emerald-500 hover:bg-slate-100 dark:hover:bg-[#1D293D] transition-colors"
              title="Edit record"
            >
              <Edit2 className="h-3.5 w-3.5" />
            </button>
            <button
              type="button"
              onClick={() => {
                setItemToDelete(item);
                setDeleteModalOpen(true);
              }}
              className="p-1.5 rounded-lg text-slate-400 hover:text-rose-500 hover:bg-slate-100 dark:hover:bg-[#1D293D] transition-colors"
              title="Delete record"
            >
              <Trash2 className="h-3.5 w-3.5" />
            </button>
          </div>
        );
      }
    });

    return cols;
  }, [config.columns]);

  return (
    <div className="space-y-6">
      <PageHeader
        breadcrumbs={[
          { label: "Dashboard", href: "/dashboard" },
          { label: "System Config", href: "/system-config" },
          { label: config.title }
        ]}
        title={config.title}
        description={config.description}
      />

      {/* Metric Counters Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="panel-card p-4">
          <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Total Records</p>
          <h3 className="text-xl font-bold text-slate-900 dark:text-white mt-1">{items.length}</h3>
          <span className="text-[10px] text-blue-500 font-medium mt-0.5 inline-block">Database Persisted</span>
        </div>
        <div className="panel-card p-4">
          <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Active</p>
          <h3 className="text-xl font-bold text-emerald-600 dark:text-emerald-400 mt-1">{activeCount}</h3>
          <span className="text-[10px] text-emerald-500 font-medium mt-0.5 inline-block">Operational</span>
        </div>
        <div className="panel-card p-4">
          <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Inactive</p>
          <h3 className="text-xl font-bold text-slate-400 mt-1">{inactiveCount}</h3>
          <span className="text-[10px] text-slate-400 font-medium mt-0.5 inline-block">Disabled / Paused</span>
        </div>
        <div className="panel-card p-4">
          <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Category</p>
          <h3 className="text-sm font-bold text-blue-500 mt-1.5 truncate">{config.category}</h3>
          <span className="text-[10px] text-slate-400 mt-0.5 inline-block">InOrbit Fleet Spec</span>
        </div>
      </div>

      {/* Unified TableFilterBar matching POI Standards */}
      <TableFilterBar
        search={searchTerm}
        onSearchChange={setSearchTerm}
        searchPlaceholder={`Search ${config.title.toLowerCase()}...`}
        statusFilter={statusFilter}
        onStatusFilterChange={setStatusFilter}
        statusOptions={["ALL", "ACTIVE", "INACTIVE"]}
        onRefresh={() => refetch()}
        isRefreshing={isFetching}
        onExport={handleExport}
        exportLabel="Export"
        onCreateNew={handleOpenCreate}
        createLabel={`Add ${config.singularTitle}`}
      />

      {/* Main Data Table with Standard Panel-Card Padding */}
      <div className="panel-card p-4 sm:p-5 overflow-hidden">
        <AppDataTable<SystemConfigItem>
          rowData={filteredItems}
          columnDefs={gridColumns}
          isLoading={isLoading}
          total={filteredItems.length}
        />
      </div>

      {/* Create / Edit / Copy Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={`${modalMode === "create" ? "Create New" : modalMode === "edit" ? "Edit" : "Duplicate"} ${config.singularTitle}`}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <p className="text-xs text-slate-500">
            Fields marked with an asterisk (<span className="text-rose-500">*</span>) are required.
          </p>

          <div className="space-y-3">
            {config.fields.map((f) => {
              const hasError = !!fieldErrors[f.key];
              return (
                <div key={f.key} className="space-y-1">
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                    {f.label} {f.required && <span className="text-rose-500">*</span>}
                  </label>

                  {f.type === "select" ? (
                    <select
                      value={formData[f.key] ?? ""}
                      onChange={(e) => handleFieldChange(f.key, e.target.value)}
                      aria-invalid={hasError}
                      className={`w-full rounded-xl bg-slate-50 dark:bg-[#162032] border px-3 py-2 text-xs text-slate-800 dark:text-white focus:outline-none transition-colors ${
                        hasError
                          ? "border-rose-500 dark:border-rose-500 focus:border-rose-500 focus:ring-1 focus:ring-rose-500"
                          : "border-slate-200 dark:border-[#1D293D] focus:border-blue-500"
                      }`}
                    >
                      <option value="">-- Select {f.label.toLowerCase()} --</option>
                      {f.options?.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                          {opt.label}
                        </option>
                      ))}
                    </select>
                  ) : f.type === "textarea" ? (
                    <textarea
                      rows={3}
                      value={formData[f.key] ?? ""}
                      onChange={(e) => handleFieldChange(f.key, e.target.value)}
                      placeholder={f.placeholder}
                      aria-invalid={hasError}
                      className={`w-full rounded-xl bg-slate-50 dark:bg-[#162032] border p-3 text-xs text-slate-800 dark:text-white placeholder-slate-400 focus:outline-none transition-colors ${
                        hasError
                          ? "border-rose-500 dark:border-rose-500 focus:border-rose-500 focus:ring-1 focus:ring-rose-500"
                          : "border-slate-200 dark:border-[#1D293D] focus:border-blue-500"
                      }`}
                    />
                  ) : f.type === "checkbox" ? (
                    <label className="flex items-center gap-2 cursor-pointer mt-1">
                      <input
                        type="checkbox"
                        checked={!!formData[f.key]}
                        onChange={(e) => handleFieldChange(f.key, e.target.checked)}
                        className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="text-xs text-slate-600 dark:text-slate-400">
                        {f.helperText || `Enable ${f.label}`}
                      </span>
                    </label>
                  ) : (
                    <input
                      type={f.type}
                      value={formData[f.key] ?? ""}
                      onChange={(e) =>
                        handleFieldChange(
                          f.key,
                          f.type === "number" && e.target.value !== ""
                            ? Number(e.target.value)
                            : e.target.value
                        )
                      }
                      placeholder={f.placeholder}
                      aria-invalid={hasError}
                      className={`w-full rounded-xl bg-slate-50 dark:bg-[#162032] border px-3 py-2 text-xs text-slate-800 dark:text-white placeholder-slate-400 focus:outline-none transition-colors ${
                        hasError
                          ? "border-rose-500 dark:border-rose-500 focus:border-rose-500 focus:ring-1 focus:ring-rose-500"
                          : "border-slate-200 dark:border-[#1D293D] focus:border-blue-500"
                      }`}
                    />
                  )}

                  {hasError && (
                    <p className="text-[11px] font-medium text-rose-500 animate-in fade-in duration-150">
                      {fieldErrors[f.key]}
                    </p>
                  )}
                </div>
              );
            })}

            {/* Active Toggle */}
            <div className="pt-2 border-t border-slate-100 dark:border-[#1D293D]">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.isActive !== false}
                  onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                  className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Active (Entity operational across fleet services)
                </span>
              </label>
            </div>
          </div>

          <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-100 dark:border-[#1D293D]">
            <Button variant="secondary" type="button" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" type="submit" isLoading={isSubmitting}>
              {modalMode === "create" ? "Create Record" : "Save Changes"}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        title="Confirm Deletion"
      >
        <div className="space-y-4">
          <div className="flex items-center gap-3 text-rose-500">
            <AlertCircle className="h-6 w-6 shrink-0" />
            <p className="text-xs text-slate-700 dark:text-slate-300">
              Are you sure you want to delete this {config.singularTitle.toLowerCase()}? This action cannot be undone.
            </p>
          </div>

          <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-100 dark:border-[#1D293D]">
            <Button variant="secondary" onClick={() => setDeleteModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="danger" onClick={handleDeleteConfirm} isLoading={deleteMutation.isPending}>
              Confirm Delete
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
