import React, { useState, useMemo, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Edit2,
  Trash2,
  Copy,
  AlertCircle,
  ArrowRight,
  RefreshCw,
  Layers,
  ShieldAlert,
  Building2
} from "lucide-react";
import { ColDef } from "ag-grid-community";
import { PageHeader } from "@/components/layout/PageHeader";
import { Button } from "@/components/common/Button";
import { Modal } from "@/components/common/Modal";
import { AppDataTable, StatusBadgeCell } from "@/components/common/AppDataTable";
import { TableFilterBar } from "@/components/common/TableFilterBar";
import { showToast } from "@/lib/toast";
import { exportToCsv } from "@/utils/streamingExport";
import { appConfigApi, AppConfigItem } from "@/api/appConfig.api";
import { ConfigEntityConfig } from "@/types/config.types";
import { AppConfigFormModal } from "./AppConfigFormModal";

export const AppConfigEntityPage: React.FC<{ config: ConfigEntityConfig }> = ({ config }) => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [page, setPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);

  // Sync search filter with URL search param if present (e.g. from Go to Branches)
  useEffect(() => {
    const q = searchParams.get("search");
    if (q) {
      setSearchTerm(q);
    }
  }, [searchParams]);

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

  // Child dependency navigation target with pre-filtered search
  const childTarget = useMemo(() => {
    const compName = itemToDelete?.name || itemToDelete?.companyName || "";
    if (config.moduleKey === "companies") {
      const searchParam = compName ? `?search=${encodeURIComponent(compName)}` : "";
      return {
        childName: "Branches",
        label: "View Branches",
        path: `/app-config/branches${searchParam}`,
        manageTitle: "Manage Branches",
        manageDesc: "Review or move branches individually.",
        cascadeTitle: "Delete Company & Branches",
        cascadeDesc: "This will also delete all linked branches.",
        cascadeBtn: "Delete All"
      };
    }
    if (config.moduleKey === "branches") {
      const branchName = itemToDelete?.name || itemToDelete?.branchName || "";
      const searchParam = branchName ? `?search=${encodeURIComponent(branchName)}` : "";
      return {
        childName: "Vehicles",
        label: "View Vehicles",
        path: `/app-config/vehicles${searchParam}`,
        manageTitle: "Manage Vehicles",
        manageDesc: "Review or move vehicles individually.",
        cascadeTitle: "Delete Branch & Vehicles",
        cascadeDesc: "This will also delete all linked vehicles.",
        cascadeBtn: "Delete All"
      };
    }
    if (config.moduleKey === "vehicles") {
      const plate = itemToDelete?.plateNumber || itemToDelete?.vehiclePlate || "";
      const searchParam = plate ? `?search=${encodeURIComponent(plate)}` : "";
      return {
        childName: "Devices",
        label: "View Devices",
        path: `/app-config/added-devices${searchParam}`,
        manageTitle: "Manage Devices",
        manageDesc: "Review or detach devices individually.",
        cascadeTitle: "Delete Vehicle & Devices",
        cascadeDesc: "This will also detach attached GPS device.",
        cascadeBtn: "Delete Vehicle"
      };
    }
    return null;
  }, [config.moduleKey, itemToDelete]);

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
    mutationFn: ({ id, cascade = false }: { id: string; cascade?: boolean }) =>
      appConfigApi.deleteConfig(id, cascade),
    onSuccess: (data: any) => {
      queryClient.invalidateQueries({ queryKey: ["app-config", config.moduleKey] });
      queryClient.invalidateQueries({ queryKey: ["app-config", "stats"] });
      if (data?.cascaded) {
        showToast.success(
          `${config.singularTitle} and all linked items were safely deleted!`
        );
      } else {
        showToast.success(`${config.singularTitle} deleted successfully!`);
      }
      setDeleteModalOpen(false);
    },
    onError: (err: any) => {
      // Do not duplicate red toast error when modal already displays the hierarchy blocked choices
      if (!childTarget) {
        const msg = err.response?.data?.message || err.message || `Failed to delete ${config.singularTitle}`;
        showToast.error(msg);
      }
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

  // Reset to first page when search or status filter changes
  useEffect(() => {
    setPage(1);
  }, [searchTerm, statusFilter]);

  const totalPages = Math.ceil(filteredItems.length / pageSize) || 1;
  const paginatedItems = useMemo(() => {
    const start = (page - 1) * pageSize;
    return filteredItems.slice(start, start + pageSize);
  }, [filteredItems, page, pageSize]);

  // CSV Export
  const handleExportCsv = () => {
    if (filteredItems.length === 0) {
      showToast.info("No records to export.");
      return;
    }
    const headers = config.columns.map((c) => c.label);
    const keys = config.columns.map((c) => c.key);
    const rows = filteredItems.map((item) => keys.map((k) => item[k]));
    exportToCsv(`${config.moduleKey}_export`, headers, rows);
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
                deleteMutation.reset();
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
          rowData={paginatedItems}
          columnDefs={gridColumns}
          isLoading={isLoading}
          total={filteredItems.length}
          page={page}
          pageSize={pageSize}
          totalPages={totalPages}
          onPageChange={setPage}
          onPageSizeChange={(newSize) => {
            setPageSize(newSize);
            setPage(1);
          }}
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
        onClose={() => {
          deleteMutation.reset();
          setDeleteModalOpen(false);
          setItemToDelete(null);
        }}
        title={
          deleteMutation.isError && childTarget ? (
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-rose-50 dark:bg-rose-950/60 text-rose-500 dark:text-rose-400 flex items-center justify-center shrink-0">
                <Trash2 className="w-4 h-4" />
              </div>
              <span className="text-base font-bold text-slate-900 dark:text-slate-100">
                Cannot Delete {config.singularTitle}
              </span>
            </div>
          ) : (
            `Delete ${config.singularTitle}`
          )
        }
        maxWidth="lg"
      >
        <div className="space-y-3.5 pt-1">
          {/* Entity Summary Card (Light Blue Tint with Building Icon) */}
          <div className="flex items-center justify-between p-3 rounded-2xl bg-blue-50/50 dark:bg-slate-900/60 border border-blue-100/70 dark:border-slate-800">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-9 h-9 rounded-xl bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-300 flex items-center justify-center shrink-0">
                <Building2 className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <p className="text-sm font-semibold text-slate-900 dark:text-slate-100 truncate">
                  {itemToDelete?.name || itemToDelete?.companyName || itemToDelete?.plateNumber || config.singularTitle}
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-mono">
                  {itemToDelete?.code || itemToDelete?.city || itemToDelete?.vehicleType || itemToDelete?.imei || `ID: ${itemToDelete?.id?.slice(0, 8)}...`}
                </p>
              </div>
            </div>
            {itemToDelete?.status && (
              <span className="inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                {itemToDelete.status}
              </span>
            )}
          </div>

          {deleteMutation.isError && childTarget ? (
            /* Premium Side-by-Side Two-Card Choice Layout when Blocked */
            <div className="space-y-3.5">
              {/* Warning Banner */}
              {(() => {
                const rawMsg =
                  (deleteMutation.error as any)?.response?.data?.message ||
                  (deleteMutation.error as any)?.message ||
                  "";
                const match = rawMsg.match(/(\d+)\s+(branch|branches|vehicle|vehicles|device|devices)/i);
                const count = match ? match[1] : "";

                return (
                  <div className="rounded-2xl border border-rose-200/80 dark:border-rose-900/50 bg-rose-50/80 dark:bg-rose-950/30 p-3 px-3.5 flex items-center gap-3">
                    <div className="w-7 h-7 rounded-full bg-rose-500 text-white flex items-center justify-center shrink-0 font-bold text-xs shadow-xs">
                      !
                    </div>
                    <p className="text-xs font-semibold text-slate-900 dark:text-slate-100">
                      This {config.singularTitle.toLowerCase()} has{" "}
                      {count ? (
                        <span className="text-rose-600 dark:text-rose-400 font-bold">{count}</span>
                      ) : null}{" "}
                      linked {childTarget.childName.toLowerCase()}.
                    </p>
                  </div>
                );
              })()}

              {/* Side-by-Side Action Cards (2 Columns) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {/* Left Card: Manage Branches */}
                <div className="rounded-2xl border border-blue-200/80 dark:border-blue-900/50 bg-blue-50/40 dark:bg-slate-900/70 p-4 flex flex-col justify-between">
                  <div className="space-y-2.5">
                    <div className="w-9 h-9 rounded-xl bg-blue-100 dark:bg-blue-950 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
                      <Layers className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100">
                        {childTarget.manageTitle}
                      </h4>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-snug mt-1">
                        {childTarget.manageDesc}
                      </p>
                    </div>
                  </div>
                  <div className="pt-3.5">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
                      onClick={() => {
                        deleteMutation.reset();
                        setDeleteModalOpen(false);
                        navigate(childTarget.path);
                      }}
                      className="w-full justify-center bg-white dark:bg-slate-800 text-blue-600 dark:text-blue-300 border-blue-200 dark:border-blue-800 hover:bg-blue-50 dark:hover:bg-blue-900/30 font-medium"
                    >
                      {childTarget.label}
                    </Button>
                  </div>
                </div>

                {/* Right Card: Delete Company & Branches */}
                <div className="rounded-2xl border border-rose-200/80 dark:border-rose-900/50 bg-rose-50/40 dark:bg-slate-900/70 p-4 flex flex-col justify-between">
                  <div className="space-y-2.5">
                    <div className="w-9 h-9 rounded-xl bg-rose-100 dark:bg-rose-950 text-rose-600 dark:text-rose-400 flex items-center justify-center shrink-0">
                      <Trash2 className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100">
                        {childTarget.cascadeTitle}
                      </h4>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-snug mt-1">
                        {childTarget.cascadeDesc}
                      </p>
                    </div>
                  </div>
                  <div className="pt-3.5">
                    <Button
                      type="button"
                      variant="danger"
                      size="sm"
                      leftIcon={<Trash2 className="w-3.5 h-3.5" />}
                      isLoading={deleteMutation.isPending}
                      onClick={() => {
                        if (itemToDelete?.id) {
                          deleteMutation.mutate({ id: itemToDelete.id, cascade: true });
                        }
                      }}
                      className="w-full justify-center shadow-xs font-medium"
                    >
                      {childTarget.cascadeBtn}
                    </Button>
                  </div>
                </div>
              </div>

              {/* Centered Cancel Link */}
              <div className="pt-2 text-center">
                <button
                  type="button"
                  onClick={() => {
                    deleteMutation.reset();
                    setDeleteModalOpen(false);
                  }}
                  disabled={deleteMutation.isPending}
                  className="text-xs font-medium text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 transition-colors"
                >
                  Cancel and Keep Everything
                </button>
              </div>
            </div>
          ) : (
            /* Normal Delete Confirmation (No Hierarchy Conflict) */
            <div className="space-y-3">
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                Are you sure you want to delete this {config.singularTitle.toLowerCase()}? This record will be safely soft-deleted from the active fleet.
              </p>

              {deleteMutation.isError && (
                <div className="rounded-xl border border-rose-200 bg-rose-50/80 dark:border-rose-900/50 dark:bg-rose-950/40 p-3.5 space-y-2">
                  <div className="flex items-start gap-2.5">
                    <AlertCircle className="w-4 h-4 shrink-0 text-rose-500 mt-0.5" />
                    <p className="text-xs text-rose-700 dark:text-rose-300 leading-relaxed">
                      {(deleteMutation.error as any)?.response?.data?.message ||
                        (deleteMutation.error as any)?.message ||
                        `Failed to delete ${config.singularTitle.toLowerCase()}.`}
                    </p>
                  </div>
                </div>
              )}

              <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-200 dark:border-[#1D293D]">
                <Button
                  variant="ghost"
                  onClick={() => {
                    deleteMutation.reset();
                    setDeleteModalOpen(false);
                  }}
                  disabled={deleteMutation.isPending}
                >
                  Cancel
                </Button>
                <Button
                  variant="danger"
                  isLoading={deleteMutation.isPending}
                  onClick={() => {
                    if (itemToDelete?.id) {
                      deleteMutation.mutate({ id: itemToDelete.id, cascade: false });
                    }
                  }}
                >
                  Confirm Delete
                </Button>
              </div>
            </div>
          )}
        </div>
      </Modal>
    </div>
  );
};

export default AppConfigEntityPage;
