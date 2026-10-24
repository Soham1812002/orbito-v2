import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  Layers,
  CheckCircle2,
  Calendar,
  Truck,
  ShieldAlert
} from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { Button } from "@/components/common/Button";
import { AppDataTable } from "@/components/common/AppDataTable";
import { TableFilterBar } from "@/components/common/TableFilterBar";
import { Modal } from "@/components/common/Modal";
import { useRouteAllocations, useDeleteRouteAllocation } from "./allocations.queries";
import { getRouteAllocationColumns } from "./allocations.columns";
import { RoutePathAllocation } from "./allocations.types";

export const RouteAllocationListPage: React.FC = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [scheduleFilter, setScheduleFilter] = useState("all");
  const [deleteTarget, setDeleteTarget] = useState<RoutePathAllocation | null>(null);

  const { data, isLoading, refetch, isFetching } = useRouteAllocations({
    search: search || undefined,
    scheduleType: scheduleFilter === "all" ? undefined : scheduleFilter
  });

  const deleteMutation = useDeleteRouteAllocation();
  const allocations = data?.rows || [];

  const metrics = useMemo(() => {
    const total = allocations.length;
    const active = allocations.filter((a) => a.isActive).length;
    const daily = allocations.filter((a) => a.scheduleType === "daily").length;
    const uniqueVehicles = new Set(allocations.map((a) => a.vehiclePlate)).size;
    return { total, active, daily, uniqueVehicles };
  }, [allocations]);

  const handleExportCsv = () => {
    if (allocations.length === 0) return;
    const headers = [
      "Vehicle Plate",
      "Allocation Group",
      "Route Code",
      "Schedule Type",
      "Departure",
      "Max Transit (hrs)",
      "Deviation Allowed",
      "Status"
    ];
    const csvRows = allocations.map((a) => [
      `"${a.vehiclePlate}"`,
      `"${a.allocationName}"`,
      `"${a.routeCode || ""}"`,
      a.scheduleType,
      a.departureTime || "--",
      a.maxTransitHours || 12,
      a.allowDeviation ? "Yes" : "No",
      a.isActive ? "Active" : "Paused"
    ]);
    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...csvRows.map((e) => e.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `route_allocations_${new Date().toISOString().split("T")[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const columns = useMemo(
    () =>
      getRouteAllocationColumns({
        onEdit: (alloc) => navigate(`/operations/allocations/${alloc.id}/edit`),
        onDelete: (alloc) => setDeleteTarget(alloc)
      }),
    [navigate]
  );

  return (
    <div className="space-y-6">
      <PageHeader
        title="Route Path Allocations"
        description="Assign fleet vehicles to defined transit corridors with automated deviation alerts and schedule windows"
        breadcrumbs={[
          { label: "Dashboard", href: "/" },
          { label: "Operations", href: "/operations/allocations" },
          { label: "Corridor Allocations" }
        ]}
      />

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="panel-card p-4 flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-slate-500 dark:text-slate-400">Total Allocations</p>
            <p className="text-2xl font-bold font-mono text-slate-900 dark:text-white mt-1">
              {metrics.total}
            </p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950/50 flex items-center justify-center text-blue-600 dark:text-blue-400">
            <Layers className="w-5 h-5" />
          </div>
        </div>

        <div className="panel-card p-4 flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-slate-500 dark:text-slate-400">Active Allocations</p>
            <p className="text-2xl font-bold font-mono text-emerald-600 dark:text-emerald-400 mt-1">
              {metrics.active}
            </p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
            <CheckCircle2 className="w-5 h-5" />
          </div>
        </div>

        <div className="panel-card p-4 flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-slate-500 dark:text-slate-400">Daily Runs (24/7)</p>
            <p className="text-2xl font-bold font-mono text-indigo-600 dark:text-indigo-400 mt-1">
              {metrics.daily}
            </p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950/50 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
            <Calendar className="w-5 h-5" />
          </div>
        </div>

        <div className="panel-card p-4 flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-slate-500 dark:text-slate-400">Monitored Vehicles</p>
            <p className="text-2xl font-bold font-mono text-amber-600 dark:text-amber-400 mt-1">
              {metrics.uniqueVehicles}
            </p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-950/50 flex items-center justify-center text-amber-600 dark:text-amber-400">
            <Truck className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Standard TableFilterBar */}
      <TableFilterBar
        search={search}
        onSearchChange={setSearch}
        searchPlaceholder="Search by vehicle plate, allocation group, or corridor code..."
        statusFilter={scheduleFilter}
        onStatusFilterChange={setScheduleFilter}
        statusOptions={[
          { label: "All Schedules", value: "all" },
          { label: "Daily 24/7", value: "daily" },
          { label: "Weekdays (Mon-Fri)", value: "weekdays" },
          { label: "Custom Days", value: "custom" },
          { label: "On Demand", value: "on_demand" }
        ]}
        onRefresh={() => refetch()}
        isRefreshing={isFetching}
        onExport={handleExportCsv}
        exportLabel="Export CSV"
        onCreateNew={() => navigate("/operations/allocations/new")}
        createLabel="Add Allocation"
      />

      {/* Main Table Card with Standard Panel-Card Padding */}
      <div className="panel-card p-4 sm:p-5 overflow-hidden">
        <AppDataTable
          rowData={allocations}
          columnDefs={columns}
          isLoading={isLoading}
        />
      </div>

      {/* Delete Confirmation Modal */}
      {deleteTarget && (
        <Modal
          isOpen={Boolean(deleteTarget)}
          onClose={() => setDeleteTarget(null)}
          title="Remove Corridor Allocation"
        >
          <div className="space-y-4">
            <p className="text-sm text-slate-600 dark:text-slate-300">
              Are you sure you want to remove vehicle{" "}
              <strong className="text-slate-900 dark:text-white font-mono">
                {deleteTarget.vehiclePlate}
              </strong>{" "}
              from corridor{" "}
              <strong className="text-slate-900 dark:text-white font-mono">
                {deleteTarget.routeCode || "this corridor"}
              </strong>
              ?
            </p>
            <div className="flex justify-end gap-2 pt-2">
              <Button variant="outline" size="sm" onClick={() => setDeleteTarget(null)}>
                Cancel
              </Button>
              <Button
                variant="danger"
                size="sm"
                isLoading={deleteMutation.isPending}
                onClick={() => {
                  deleteMutation.mutate(deleteTarget.id, {
                    onSuccess: () => setDeleteTarget(null)
                  });
                }}
              >
                Remove Allocation
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default RouteAllocationListPage;
