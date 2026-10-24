import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  FileText,
  CheckCircle2,
  AlertTriangle,
  XCircle
} from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { Button } from "@/components/common/Button";
import { AppDataTable } from "@/components/common/AppDataTable";
import { TableFilterBar } from "@/components/common/TableFilterBar";
import { Select } from "@/components/common/Select";
import { Modal } from "@/components/common/Modal";
import { useComplianceReminders, useDeleteComplianceReminder } from "./compliance.queries";
import { getComplianceColumns } from "./compliance.columns";
import { ComplianceReminder } from "./compliance.types";
import dayjs from "dayjs";

export const ComplianceReminderListPage: React.FC = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [entityFilter, setEntityFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [deleteTarget, setDeleteTarget] = useState<ComplianceReminder | null>(null);

  const { data, isLoading, refetch, isFetching } = useComplianceReminders({
    search: search || undefined,
    entityType: entityFilter === "all" ? undefined : entityFilter,
    status: statusFilter === "all" ? undefined : statusFilter
  });

  const deleteMutation = useDeleteComplianceReminder();
  const reminders = data?.rows || [];

  const metrics = useMemo(() => {
    const total = reminders.length;
    const now = dayjs();
    let overdue = 0;
    let dueSoon = 0;
    let valid = 0;

    reminders.forEach((r) => {
      const diff = dayjs(r.expiryDate).diff(now, "day");
      if (diff < 0 || r.status === "overdue") overdue++;
      else if (diff <= r.notifyBeforeDays || r.status === "due_soon") dueSoon++;
      else valid++;
    });

    return { total, overdue, dueSoon, valid };
  }, [reminders]);

  const handleExportCsv = () => {
    if (reminders.length === 0) return;
    const headers = [
      "Entity Type",
      "Entity Identifier",
      "Reminder Category",
      "Document #",
      "Expiry Date",
      "Advance Notice (days)",
      "Status"
    ];
    const csvRows = reminders.map((r) => [
      r.entityType,
      `"${r.entityIdentifier}"`,
      `"${r.reminderCategory}"`,
      `"${r.documentNumber || ""}"`,
      r.expiryDate,
      r.notifyBeforeDays,
      r.status
    ]);
    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...csvRows.map((e) => e.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `compliance_reminders_${new Date().toISOString().split("T")[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const columns = useMemo(
    () =>
      getComplianceColumns({
        onEdit: (rem) => navigate(`/operations/compliance/${rem.id}/edit`),
        onDelete: (rem) => setDeleteTarget(rem)
      }),
    [navigate]
  );

  return (
    <div className="space-y-6">
      <PageHeader
        title="Statutory & General Reminders"
        description="Manage upcoming renewals, road permits, commercial insurance, fitness tests, and driver certifications"
        breadcrumbs={[
          { label: "Dashboard", href: "/" },
          { label: "Operations", href: "/operations/compliance" },
          { label: "Compliance Reminders" }
        ]}
      />

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="panel-card p-4 flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-slate-500 dark:text-slate-400">Total Tracked</p>
            <p className="text-2xl font-bold font-mono text-slate-900 dark:text-white mt-1">
              {metrics.total}
            </p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950/50 flex items-center justify-center text-blue-600 dark:text-blue-400">
            <FileText className="w-5 h-5" />
          </div>
        </div>

        <div className="panel-card p-4 flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-slate-500 dark:text-slate-400">Overdue Expirations</p>
            <p className="text-2xl font-bold font-mono text-rose-600 dark:text-rose-400 mt-1">
              {metrics.overdue}
            </p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-rose-50 dark:bg-rose-950/50 flex items-center justify-center text-rose-600 dark:text-rose-400">
            <XCircle className="w-5 h-5" />
          </div>
        </div>

        <div className="panel-card p-4 flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-slate-500 dark:text-slate-400">Due in Next 30 Days</p>
            <p className="text-2xl font-bold font-mono text-amber-600 dark:text-amber-400 mt-1">
              {metrics.dueSoon}
            </p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-950/50 flex items-center justify-center text-amber-600 dark:text-amber-400">
            <AlertTriangle className="w-5 h-5" />
          </div>
        </div>

        <div className="panel-card p-4 flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-slate-500 dark:text-slate-400">Compliant & Valid</p>
            <p className="text-2xl font-bold font-mono text-emerald-600 dark:text-emerald-400 mt-1">
              {metrics.valid}
            </p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
            <CheckCircle2 className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Standard TableFilterBar */}
      <TableFilterBar
        search={search}
        onSearchChange={setSearch}
        searchPlaceholder="Search by entity plate, document number, or category..."
        statusFilter={statusFilter}
        onStatusFilterChange={setStatusFilter}
        statusOptions={[
          { label: "All Statuses", value: "all" },
          { label: "Active & Valid", value: "active" },
          { label: "Due Soon (<30d)", value: "due_soon" },
          { label: "Overdue Expired", value: "overdue" },
          { label: "Renewed", value: "renewed" }
        ]}
        filters={
          <div className="w-full sm:w-40">
            <Select
              value={entityFilter}
              onChange={(e) => setEntityFilter(e.target.value)}
              options={[
                { label: "All Entities", value: "all" },
                { label: "Vehicles", value: "vehicle" },
                { label: "Drivers", value: "driver" },
                { label: "Depots / Hubs", value: "depot" }
              ]}
            />
          </div>
        }
        onRefresh={() => refetch()}
        isRefreshing={isFetching}
        onExport={handleExportCsv}
        exportLabel="Export CSV"
        onCreateNew={() => navigate("/operations/compliance/new")}
        createLabel="Add Reminder"
      />

      {/* Main Table Card with Standard Panel-Card Padding */}
      <div className="panel-card p-4 sm:p-5 overflow-hidden">
        <AppDataTable
          rowData={reminders}
          columnDefs={columns}
          isLoading={isLoading}
        />
      </div>

      {/* Delete Confirmation Modal */}
      {deleteTarget && (
        <Modal
          isOpen={Boolean(deleteTarget)}
          onClose={() => setDeleteTarget(null)}
          title="Remove Compliance Reminder"
        >
          <div className="space-y-4">
            <p className="text-sm text-slate-600 dark:text-slate-300">
              Are you sure you want to remove the reminder for{" "}
              <strong className="text-slate-900 dark:text-white">
                {deleteTarget.entityIdentifier}
              </strong>{" "}
              ({deleteTarget.reminderCategory})?
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
                Remove Reminder
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default ComplianceReminderListPage;
