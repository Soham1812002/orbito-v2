import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  Users,
  CheckCircle2,
  Clock,
  Sparkles,
  Truck
} from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { Button } from "@/components/common/Button";
import { AppDataTable } from "@/components/common/AppDataTable";
import { TableFilterBar } from "@/components/common/TableFilterBar";
import { Modal } from "@/components/common/Modal";
import { useCrewAllocations, useDeleteCrewAllocation } from "./crew.queries";
import { getCrewAllocationColumns } from "./crew.columns";
import { CrewAllocation } from "./crew.types";

export const CrewAllocationListPage: React.FC = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [dutyFilter, setDutyFilter] = useState("all");
  const [deleteTarget, setDeleteTarget] = useState<CrewAllocation | null>(null);

  const { data, isLoading, refetch, isFetching } = useCrewAllocations({
    search: search || undefined,
    dutyStatus: dutyFilter === "all" ? undefined : dutyFilter
  });

  const deleteMutation = useDeleteCrewAllocation();
  const crewList = data?.rows || [];

  const metrics = useMemo(() => {
    const totalVehicles = crewList.length;
    const onDuty = crewList.filter((c) => c.dutyStatus === "on_duty").length;
    const standby = crewList.filter((c) => c.dutyStatus === "standby").length;
    const cleaners = crewList.filter((c) => Boolean(c.cleanerName)).length;
    return { totalVehicles, onDuty, standby, cleaners };
  }, [crewList]);

  const handleExportCsv = () => {
    if (crewList.length === 0) return;
    const headers = [
      "Vehicle Plate",
      "Primary Driver",
      "Driver Phone",
      "Co-Driver",
      "Cleaner",
      "Shift",
      "Start Date",
      "Duty Status"
    ];
    const csvRows = crewList.map((c) => [
      `"${c.vehiclePlate}"`,
      `"${c.primaryDriverName}"`,
      `"${c.primaryDriverPhone}"`,
      `"${c.secondaryDriverName || "None"}"`,
      `"${c.cleanerName || "Unassigned"}"`,
      `"${c.shiftName}"`,
      c.startDate,
      c.dutyStatus
    ]);
    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...csvRows.map((e) => e.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `crew_allocations_${new Date().toISOString().split("T")[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const columns = useMemo(
    () =>
      getCrewAllocationColumns({
        onEdit: (c) => navigate(`/operations/crew/${c.id}/edit`),
        onDelete: (c) => setDeleteTarget(c)
      }),
    [navigate]
  );

  return (
    <div className="space-y-6">
      <PageHeader
        title="Driver - Cleaner Allocation"
        description="Manage fleet personnel rosters, multi-driver pairing, attendant allocations, and shift schedules"
        breadcrumbs={[
          { label: "Dashboard", href: "/" },
          { label: "Operations", href: "/operations/crew" },
          { label: "Crew Rosters" }
        ]}
      />

      {/* KPI Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="panel-card p-4 flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-slate-500 dark:text-slate-400">Assigned Vehicles</p>
            <p className="text-2xl font-bold font-mono text-slate-900 dark:text-white mt-1">
              {metrics.totalVehicles}
            </p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950/50 flex items-center justify-center text-blue-600 dark:text-blue-400">
            <Truck className="w-5 h-5" />
          </div>
        </div>

        <div className="panel-card p-4 flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-slate-500 dark:text-slate-400">Drivers On Duty</p>
            <p className="text-2xl font-bold font-mono text-emerald-600 dark:text-emerald-400 mt-1">
              {metrics.onDuty}
            </p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
            <CheckCircle2 className="w-5 h-5" />
          </div>
        </div>

        <div className="panel-card p-4 flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-slate-500 dark:text-slate-400">Standby Personnel</p>
            <p className="text-2xl font-bold font-mono text-amber-600 dark:text-amber-400 mt-1">
              {metrics.standby}
            </p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-950/50 flex items-center justify-center text-amber-600 dark:text-amber-400">
            <Clock className="w-5 h-5" />
          </div>
        </div>

        <div className="panel-card p-4 flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-slate-500 dark:text-slate-400">Active Cleaners</p>
            <p className="text-2xl font-bold font-mono text-cyan-600 dark:text-cyan-400 mt-1">
              {metrics.cleaners}
            </p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-cyan-50 dark:bg-cyan-950/50 flex items-center justify-center text-cyan-600 dark:text-cyan-400">
            <Sparkles className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Standard TableFilterBar */}
      <TableFilterBar
        search={search}
        onSearchChange={setSearch}
        searchPlaceholder="Search by vehicle plate, driver name, cleaner, or shift..."
        statusFilter={dutyFilter}
        onStatusFilterChange={setDutyFilter}
        statusOptions={[
          { label: "All Duty Statuses", value: "all" },
          { label: "On Duty", value: "on_duty" },
          { label: "On Standby", value: "standby" },
          { label: "Off Duty", value: "off_duty" }
        ]}
        onRefresh={() => refetch()}
        isRefreshing={isFetching}
        onExport={handleExportCsv}
        exportLabel="Export CSV"
        onCreateNew={() => navigate("/operations/crew/new")}
        createLabel="Assign Crew"
      />

      {/* Main Table Card with Standard Panel-Card Padding */}
      <div className="panel-card p-4 sm:p-5 overflow-hidden">
        <AppDataTable
          rowData={crewList}
          columnDefs={columns}
          isLoading={isLoading}
        />
      </div>

      {/* Delete Confirmation Modal */}
      {deleteTarget && (
        <Modal
          isOpen={Boolean(deleteTarget)}
          onClose={() => setDeleteTarget(null)}
          title="Remove Crew Assignment"
        >
          <div className="space-y-4">
            <p className="text-sm text-slate-600 dark:text-slate-300">
              Are you sure you want to remove the crew roster for vehicle{" "}
              <strong className="text-slate-900 dark:text-white font-mono">
                {deleteTarget.vehiclePlate}
              </strong>{" "}
              (Driver: {deleteTarget.primaryDriverName})?
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
                Remove Crew
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default CrewAllocationListPage;
