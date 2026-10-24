import React, { useState, useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Edit2,
  Trash2,
  Copy
} from "lucide-react";
import { ColDef } from "ag-grid-community";
import { PageHeader } from "@/components/layout/PageHeader";
import { Button } from "@/components/common/Button";
import { Modal } from "@/components/common/Modal";
import { AppDataTable, StatusBadgeCell } from "@/components/common/AppDataTable";
import { TableFilterBar } from "@/components/common/TableFilterBar";
import { showToast } from "@/lib/toast";
import { appConfigApi, AppConfigItem } from "@/api/appConfig.api";
import { ConfigEntityConfig } from "@/types/config.types";
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

  // Build AG Grid Column Definitions with Center-Aligned Badges & Actions
  const gridColumns = useMemo<ColDef<AppConfigItem>[]>(() => {
    const cols: ColDef<AppConfigItem>[] = config.columns.map((c) => {
      const isStatus = c.key === "status" || c.key === "isActive";
      const isHealth = c.key === "health";
      const isMono = ["code", "plateNumber", "imei", "iccid", "phone"].includes(c.key);

      return {
        headerName: c.label,
        field: c.key as any,
        minWidth: isStatus ? 130 : 150,
        flex: 1,
        cellRenderer: (params: any) => {
          if (!params.data) return null;
          const val = params.value;

          if (isStatus) {
            return <StatusBadgeCell status={val} />;
          }

          if (isHealth) {
            const isOnline = val === "Online";
            return (
              <div className="flex items-center justify-center h-full w-full">
                <span
                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs-compact font-bold uppercase tracking-wider ${
                    isOnline
                      ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20"
                      : "bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20"
                  }`}
                >
                  {val || "Offline"}
                </span>
              </div>
            );
          }

          if (isMono) {
            return (
              <span className="font-mono text-xs font-semibold text-slate-800 dark:text-slate-200 truncate" title={String(val ?? "")}>
                {val ?? "—"}
              </span>
            );
          }

          return (
            <span className="text-xs font-medium text-slate-800 dark:text-slate-200 truncate" title={String(val ?? "")}>
              {val ?? "—"}
            </span>
          );
        }
      };
    });

    cols.push({
      headerName: "Actions",
      field: "id" as any,
      minWidth: 120,
      width: 120,
      sortable: false,
      filter: false,
      pinned: "right",
      cellRenderer: (params: any) => {
        const item = params.data;
        if (!item) return null;
        return (
          <div className="flex items-center justify-end gap-1 h-full w-full py-1">
            <button
              type="button"
              onClick={() => handleOpenCopy(item)}
              className="p-1.5 rounded-lg text-slate-400 hover:text-blue-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              title="Duplicate record"
            >
              <Copy className="h-3.5 w-3.5" />
            </button>
            <button
              type="button"
              onClick={() => handleOpenEdit(item)}
              className="p-1.5 rounded-lg text-slate-400 hover:text-emerald-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
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
              className="p-1.5 rounded-lg text-slate-400 hover:text-rose-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
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
        title={config.title}
        description={config.description}
      />

      {/* POI-Standard Unified Filter Bar */}
      <TableFilterBar
        search={searchTerm}
        onSearchChange={setSearchTerm}
        searchPlaceholder={`Search ${config.title}...`}
        statusFilter={statusFilter}
        onStatusFilterChange={setStatusFilter}
        statusOptions={["ALL", "ACTIVE", "INACTIVE"]}
        onRefresh={() => refetch()}
        isRefreshing={isFetching}
        onExport={handleExportCsv}
        exportLabel="Export CSV"
        onCreateNew={handleOpenCreate}
        createLabel={`Add ${config.singularTitle}`}
      />

      {/* AG Grid Data Table Container with Standard Panel-Card Padding */}
      <div className="panel-card p-4 sm:p-5 overflow-hidden">
        <AppDataTable
          rowData={filteredItems}
          columnDefs={gridColumns}
          isLoading={isLoading}
          total={filteredItems.length}
          height="520px"
        />
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
