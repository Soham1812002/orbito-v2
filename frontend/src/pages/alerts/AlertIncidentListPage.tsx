import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  Bell,
  Plus,
  SlidersHorizontal,
  Flame,
  AlertTriangle,
  ShieldAlert
} from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { Button } from "@/components/common/Button";
import { AppDataTable } from "@/components/common/AppDataTable";
import { TableFilterBar } from "@/components/common/TableFilterBar";
import { Select } from "@/components/common/Select";
import { useAlertLogs, useAcknowledgeAlert } from "./alerts.queries";
import { getAlertLogColumns } from "./alerts.columns";
import { AlertLog } from "./alerts.types";

export const AlertIncidentListPage: React.FC = () => {
  const navigate = useNavigate();

  // Filter states
  const [search, setSearch] = useState("");
  const [severityFilter, setSeverityFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  const { data, isLoading, refetch, isFetching } = useAlertLogs({
    search: search || undefined,
    severity: severityFilter,
    alertType: typeFilter,
    status: statusFilter
  });

  const ackMutation = useAcknowledgeAlert();

  const handleAcknowledge = (log: AlertLog) => {
    ackMutation.mutate({ id: log.id });
  };

  const handleViewMap = (log: AlertLog) => {
    navigate(`/live-tracking?vehicleId=${log.vehicleId}`);
  };

  const columns = useMemo(
    () =>
      getAlertLogColumns({
        onAcknowledge: handleAcknowledge,
        onViewMap: handleViewMap
      }),
    []
  );

  const logs = data?.rows || [];

  // Summary statistics
  const totalCount = logs.length;
  const criticalCount = logs.filter((l) => l.severity === "critical").length;
  const pendingCount = logs.filter((l) => l.status === "pending").length;
  const acknowledgedCount = logs.filter((l) => l.status === "acknowledged").length;

  const handleExportCsv = () => {
    if (logs.length === 0) return;
    const headers = ["Vehicle Plate", "Company", "Branch", "Alert Name", "Alert Type", "Severity", "Trigger Value", "Location", "Coordinates", "Timestamp", "Status"];
    const rows = logs.map((l) => [
      `"${l.plateNumber}"`,
      `"${l.companyName}"`,
      `"${l.branchName}"`,
      `"${l.alertName}"`,
      `"${l.alertType}"`,
      `"${l.severity.toUpperCase()}"`,
      `"${l.triggerValue || ""}"`,
      `"${l.address.replace(/"/g, '""')}"`,
      `"${l.latitude}, ${l.longitude}"`,
      `"${l.createdAt}"`,
      `"${l.status.toUpperCase()}"`
    ]);
    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `fleet_alerts_report_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        breadcrumbs={[
          { label: "Dashboard", href: "/dashboard" },
          { label: "Alerts" }
        ]}
        title="Vehicle Alerts Incident Log"
        description="Monitor real-time critical telematics exceptions, speed triggers, geofence breaches, and hardware events across your active fleet."
        actions={
          <div className="flex flex-wrap items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              leftIcon={<SlidersHorizontal className="h-3.5 w-3.5" />}
              onClick={() => navigate("/alerts/rules")}
            >
              Manage Rules
            </Button>
            <Button
              variant="primary"
              size="sm"
              leftIcon={<Plus className="h-3.5 w-3.5" />}
              onClick={() => navigate("/alerts/new")}
            >
              New Rule
            </Button>
          </div>
        }
      />

      {/* Top 4 KPI Metrics Cards */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 shadow-sm">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-500">
            <span>Total Incidents</span>
            <Bell className="h-4 w-4 text-blue-500" />
          </div>
          <p className="mt-2 text-2xl font-black tracking-tight text-slate-900 dark:text-white">
            {totalCount}
          </p>
          <span className="text-[11px] text-slate-400">All recorded incidents</span>
        </div>

        <div className="rounded-2xl border border-rose-200 dark:border-rose-900/50 bg-rose-50/40 dark:bg-rose-950/20 p-4 shadow-sm">
          <div className="flex items-center justify-between text-xs font-semibold text-rose-600 dark:text-rose-400">
            <span>Critical Severity</span>
            <Flame className="h-4 w-4 text-rose-500" />
          </div>
          <p className="mt-2 text-2xl font-black tracking-tight text-rose-600 dark:text-rose-400">
            {criticalCount}
          </p>
          <span className="text-[11px] text-rose-500/80">Immediate attention needed</span>
        </div>

        <div className="rounded-2xl border border-amber-200 dark:border-amber-900/50 bg-amber-50/40 dark:bg-amber-950/20 p-4 shadow-sm">
          <div className="flex items-center justify-between text-xs font-semibold text-amber-600 dark:text-amber-400">
            <span>Pending Ack</span>
            <AlertTriangle className="h-4 w-4 text-amber-500" />
          </div>
          <p className="mt-2 text-2xl font-black tracking-tight text-amber-600 dark:text-amber-400">
            {pendingCount}
          </p>
          <span className="text-[11px] text-amber-500/80">Awaiting operator sign-off</span>
        </div>

        <div className="rounded-2xl border border-emerald-200 dark:border-emerald-900/50 bg-emerald-50/40 dark:bg-emerald-950/20 p-4 shadow-sm">
          <div className="flex items-center justify-between text-xs font-semibold text-emerald-600 dark:text-emerald-400">
            <span>Acknowledged</span>
            <ShieldAlert className="h-4 w-4 text-emerald-500" />
          </div>
          <p className="mt-2 text-2xl font-black tracking-tight text-emerald-600 dark:text-emerald-400">
            {acknowledgedCount}
          </p>
          <span className="text-[11px] text-emerald-500/80">Resolved or addressed</span>
        </div>
      </div>

      {/* Standardized TableFilterBar */}
      <TableFilterBar
        search={search}
        onSearchChange={setSearch}
        searchPlaceholder="Search vehicle plate, alert, address..."
        onRefresh={() => refetch()}
        isRefreshing={isFetching}
        onExport={handleExportCsv}
        exportLabel="Export CSV"
        filters={
          <div className="flex flex-wrap items-center gap-2">
            <div className="w-full sm:w-36">
              <Select
                value={severityFilter}
                onChange={(e) => setSeverityFilter(e.target.value)}
                options={[
                  { value: "all", label: "All Severities" },
                  { value: "critical", label: "Critical" },
                  { value: "warning", label: "Warning" },
                  { value: "info", label: "Info" }
                ]}
              />
            </div>
            <div className="w-full sm:w-40">
              <Select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                options={[
                  { value: "all", label: "All Alert Types" },
                  { value: "overspeed", label: "Overspeed" },
                  { value: "geofence_breach", label: "Geofence Breach" },
                  { value: "power_cut", label: "Power Cut" },
                  { value: "harsh_braking", label: "Harsh Braking" },
                  { value: "idle_timeout", label: "Excessive Idle" },
                  { value: "sos", label: "Emergency SOS" }
                ]}
              />
            </div>
            <div className="w-full sm:w-36">
              <Select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                options={[
                  { value: "all", label: "All Statuses" },
                  { value: "pending", label: "Pending Ack" },
                  { value: "acknowledged", label: "Acknowledged" }
                ]}
              />
            </div>
          </div>
        }
      />

      {/* AG Grid Data Table in panel-card */}
      <div className="panel-card p-4 sm:p-5 overflow-hidden">
        <AppDataTable
          rowData={logs}
          columnDefs={columns}
          isLoading={isLoading}
          total={data?.totalCount || logs.length}
          page={1}
          pageSize={10}
          totalPages={data?.totalPages || 1}
          onRefresh={() => refetch()}
        />
      </div>
    </div>
  );
};

export default AlertIncidentListPage;
