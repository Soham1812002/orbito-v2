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
import { PageHeader } from "../../components/layout/PageHeader";
import { Button } from "../../components/common/Button";
import { Modal } from "../../components/common/Modal";
import { showToast } from "../../lib/toast";
import { appConfigApi, AppConfigItem } from "./appConfig.api";
import { ConfigEntityConfig } from "./configs";
import { AppConfigFormModal } from "./AppConfigFormModal";

export const AppConfigEntityPage: React.FC<{ config: ConfigEntityConfig }> = ({ config }) => {
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
    queryKey: ["app-config", config.moduleKey],
    queryFn: ({ signal }) => appConfigApi.getConfigs(config.moduleKey, signal),
    staleTime: 30000
  });

  // Modal State for Create/Edit/Copy
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"create" | "edit" | "copy">("create");
  const [activeItem, setActiveItem] = useState<AppConfigItem | null>(null);

  // Delete State
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<AppConfigItem | null>(null);

  // Mutations
  const createMutation = useMutation({
    mutationFn: (data: Record<string, any>) => appConfigApi.createConfig(config.moduleKey, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["app-config", config.moduleKey] });
      queryClient.invalidateQueries({ queryKey: ["app-config", "stats"] });
      showToast.success(`${config.singularTitle} created successfully!`);
      setIsModalOpen(false);
    },
    onError: (err: any) => {
      showToast.error(err.response?.data?.message || `Failed to create ${config.singularTitle}`);
    }
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Record<string, any> }) =>
      appConfigApi.updateConfig(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["app-config", config.moduleKey] });
      queryClient.invalidateQueries({ queryKey: ["app-config", "stats"] });
      showToast.success(`${config.singularTitle} updated successfully!`);
      setIsModalOpen(false);
    },
    onError: (err: any) => {
      showToast.error(err.response?.data?.message || `Failed to update ${config.singularTitle}`);
    }
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => appConfigApi.deleteConfig(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["app-config", config.moduleKey] });
      queryClient.invalidateQueries({ queryKey: ["app-config", "stats"] });
      showToast.success(`${config.singularTitle} deleted successfully!`);
      setDeleteModalOpen(false);
    },
    onError: (err: any) => {
      showToast.error(err.response?.data?.message || `Failed to delete ${config.singularTitle}`);
    }
  });

  // Filtered Items
  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      if (statusFilter !== "ALL") {
        const itemStatus = String(item.status || (item.isActive ? "Active" : "Inactive")).toUpperCase();
        if (statusFilter === "ACTIVE" && itemStatus !== "ACTIVE") return false;
        if (statusFilter === "INACTIVE" && itemStatus !== "INACTIVE") return false;
      }

      if (!searchTerm) return true;
      const q = searchTerm.toLowerCase();
      return Object.values(item).some((val) =>
        typeof val === "object" && val !== null
          ? JSON.stringify(val).toLowerCase().includes(q)
          : String(val).toLowerCase().includes(q)
      );
    });
  }, [items, searchTerm, statusFilter]);

  // CSV Export
  const handleExportCsv = () => {
    if (filteredItems.length === 0) {
      showToast.info("No records to export.");
      return;
    }
    const headers = config.columns.map((c) => c.label);
    const keys = config.columns.map((c) => c.key);
    const rows = filteredItems.map((item) =>
      keys.map((k) => `"${String(item[k] ?? "").replace(/"/g, '""')}"`).join(",")
    );
    const csvContent = [headers.join(","), ...rows].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `${config.moduleKey}_export_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast.success("Export completed!");
  };

  const handleOpenCreate = () => {
    setActiveItem(null);
    setModalMode("create");
    setIsModalOpen(true);
  };

  const handleOpenEdit = (item: AppConfigItem) => {
    setActiveItem(item);
    setModalMode("edit");
    setIsModalOpen(true);
  };

  const handleOpenCopy = (item: AppConfigItem) => {
    setActiveItem(item);
    setModalMode("copy");
    setIsModalOpen(true);
  };

  const handleFormSubmit = (data: Record<string, any>) => {
    if (modalMode === "edit" && activeItem?.id) {
      updateMutation.mutate({ id: activeItem.id, data });
    } else {
      createMutation.mutate(data);
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title={config.title}
        description={config.description}
        badge={config.badge}
        actions={
          <div className="flex items-center space-x-3">
            <Button variant="secondary" onClick={handleExportCsv} className="hidden sm:inline-flex">
              <Download className="w-4 h-4 mr-2" />
              Export CSV
            </Button>
            <Button variant="primary" onClick={handleOpenCreate}>
              <Plus className="w-4 h-4 mr-2" />
              Add {config.singularTitle}
            </Button>
          </div>
        }
      />

      {/* Filter and Search Toolbar */}
      <div className="panel-card p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder={`Search ${config.title}...`}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-sm rounded-lg border border-slate-200 dark:border-[#1D293D] bg-white dark:bg-[#111C38] text-slate-900 dark:text-white focus-ring transition-colors"
          />
        </div>

        <div className="flex items-center space-x-2 w-full sm:w-auto justify-end">
          <div className="flex rounded-lg border border-slate-200 dark:border-[#1D293D] p-0.5 bg-slate-50 dark:bg-[#0b1329]">
            {["ALL", "ACTIVE", "INACTIVE"].map((st) => (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors ${
                  statusFilter === st
                    ? "bg-white dark:bg-[#162244] text-[#007AFF] shadow-sm"
                    : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                }`}
              >
                {st}
              </button>
            ))}
          </div>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => refetch()}
            disabled={isFetching}
            className="h-9 w-9 p-0 flex items-center justify-center text-slate-500 hover:text-slate-900 dark:hover:text-white"
            title="Refresh Table"
          >
            <RefreshCw className={`w-4 h-4 ${isFetching ? "animate-spin text-blue-500" : ""}`} />
          </Button>
        </div>
      </div>

      {/* Data Table */}
      <div className="panel-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 dark:border-[#1D293D] bg-slate-50/75 dark:bg-[#0b1329]/50 text-slate-500 dark:text-slate-400 text-xs font-semibold uppercase tracking-wider">
                {config.columns.map((col) => (
                  <th key={col.key} className="px-5 py-3.5 whitespace-nowrap">
                    {col.label}
                  </th>
                ))}
                <th className="px-5 py-3.5 text-right whitespace-nowrap">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-[#1D293D]/60 text-sm">
              {isLoading ? (
                <tr>
                  <td colSpan={config.columns.length + 1} className="py-16 text-center text-slate-400">
                    <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2 text-[#007AFF]" />
                    <span>Loading {config.title}...</span>
                  </td>
                </tr>
              ) : filteredItems.length === 0 ? (
                <tr>
                  <td colSpan={config.columns.length + 1} className="py-16 text-center text-slate-400">
                    <AlertCircle className="w-8 h-8 mx-auto mb-2 opacity-40 text-slate-500" />
                    <p className="font-medium text-slate-700 dark:text-slate-300">No records found</p>
                    <p className="text-xs text-slate-500 mt-1">
                      {searchTerm ? "Try adjusting your search criteria" : `Click 'Add ${config.singularTitle}' to create the first record.`}
                    </p>
                  </td>
                </tr>
              ) : (
                filteredItems.map((item) => (
                  <tr
                    key={item.id}
                    className="hover:bg-slate-50/80 dark:hover:bg-[#162244]/40 transition-colors group"
                  >
                    {config.columns.map((col) => {
                      const val = item[col.key];
                      if (col.key === "status" || col.key === "isActive") {
                        const isAct = val === "Active" || val === true || item.isActive;
                        return (
                          <td key={col.key} className="px-5 py-3.5 whitespace-nowrap">
                            <span className={isAct ? "badge-emerald" : "badge-rose"}>
                              {isAct ? "Active" : "Inactive"}
                            </span>
                          </td>
                        );
                      }
                      if (col.key === "health") {
                        const isOnline = val === "Online";
                        return (
                          <td key={col.key} className="px-5 py-3.5 whitespace-nowrap">
                            <span className={isOnline ? "badge-emerald" : "badge-amber"}>
                              {val || "Offline"}
                            </span>
                          </td>
                        );
                      }
                      if (col.key === "code" || col.key === "plateNumber" || col.key === "imei" || col.key === "iccid") {
                        return (
                          <td key={col.key} className="px-5 py-3.5 font-mono text-xs font-semibold text-slate-800 dark:text-slate-200 whitespace-nowrap">
                            {val ?? "—"}
                          </td>
                        );
                      }
                      return (
                        <td key={col.key} className="px-5 py-3.5 text-slate-700 dark:text-slate-300 whitespace-nowrap">
                          {val ?? "—"}
                        </td>
                      );
                    })}
                    <td className="px-5 py-3.5 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end space-x-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleOpenCopy(item)}
                          className="h-8 w-8 p-0 text-slate-400 hover:text-blue-500"
                          title="Duplicate Record"
                        >
                          <Copy className="w-3.5 h-3.5" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleOpenEdit(item)}
                          className="h-8 w-8 p-0 text-slate-400 hover:text-amber-500"
                          title="Edit Record"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setItemToDelete(item);
                            setDeleteModalOpen(true);
                          }}
                          className="h-8 w-8 p-0 text-slate-400 hover:text-rose-500"
                          title="Delete Record"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Form Modal */}
      <AppConfigFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        mode={modalMode}
        config={config}
        initialData={activeItem || undefined}
        onSubmit={handleFormSubmit}
        isSubmitting={createMutation.isPending || updateMutation.isPending}
      />

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        title={`Delete ${config.singularTitle}`}
        maxWidth="md"
      >
        <div className="space-y-4">
          <p className="text-sm text-slate-600 dark:text-slate-300">
            Are you sure you want to delete this {config.singularTitle.toLowerCase()}? This action will safely archive the record and unbind active linkages.
          </p>
          <div className="flex items-center justify-end space-x-3 pt-4 border-t border-slate-200 dark:border-[#1D293D]">
            <Button variant="ghost" onClick={() => setDeleteModalOpen(false)} disabled={deleteMutation.isPending}>
              Cancel
            </Button>
            <Button
              variant="danger"
              isLoading={deleteMutation.isPending}
              onClick={() => {
                if (itemToDelete?.id) {
                  deleteMutation.mutate(itemToDelete.id);
                }
              }}
            >
              Confirm Delete
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default AppConfigEntityPage;
