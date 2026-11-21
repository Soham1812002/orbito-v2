import React, { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  Download,
  Search,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  RefreshCw,
  Loader2
} from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { AppDataTable } from "@/components/common/AppDataTable";
import { TableFilterBar } from "@/components/common/TableFilterBar";
import type { ColDef } from "ag-grid-community";
import { showToast } from "@/lib/toast";
import { exportToCsv } from "@/utils/streamingExport";
import { auditLogApi, AuditLogItem } from "@/api/auditLog.api";

export const AuditLogPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(50);

  // Query audit logs directly from backend PostgreSQL API
  const { data, isLoading, isFetching, refetch } = useQuery({
    queryKey: ["audit-logs", { page, limit: pageSize, search: searchTerm, statusFilter }],
    queryFn: ({ signal }) =>
      auditLogApi.getAuditLogs(
        {
          page,
          limit: pageSize,
          search: searchTerm || undefined,
          filter: statusFilter !== "ALL" ? { status: statusFilter } : undefined
        },
        signal
      ),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    placeholderData: (previousData) => previousData
  });

  const logs: AuditLogItem[] = data?.rows || [];
  const totalCount = data?.total || 0;
  const totalPages = data?.totalPages || Math.ceil(totalCount / pageSize) || 1;

  // Real Metric Counters from query results
  const metrics = useMemo(() => {
    const successCount = logs.filter((l) => l.status === "SUCCESS").length;
    const warningCount = logs.filter((l) => l.status === "WARNING").length;
    const failedCount = logs.filter((l) => l.status === "FAILED").length;
    const rate = logs.length > 0 ? Math.round((successCount / logs.length) * 100) : 100;

    return {
      total: totalCount || logs.length,
      successCount,
      warningCount,
      failedCount,
      rate
    };
  }, [logs, totalCount]);

  const handleExport = () => {
    if (logs.length === 0) {
      showToast.error("No audit logs to export");
      return;
    }
    const headers = ["ID", "Timestamp", "User", "Role", "Action", "Module", "IP Address", "Status", "Details"];
    const rows = logs.map((l) => [
      l.id,
      l.timestamp,
      l.userName || "",
      l.userRole || "",
      l.action,
      l.module || "",
      l.ipAddress,
      l.status,
      l.details || ""
    ]);
    exportToCsv("audit_log", headers, rows);
    showToast.success("Audit log export downloaded successfully!");
  };

  const columns = useMemo<ColDef<AuditLogItem>[]>(
    () => [
      {
        headerName: "Timestamp",
        field: "timestamp",
        minWidth: 170,
        cellRenderer: (params: any) => (
          <span className="font-mono text-2xs text-slate-500 dark:text-slate-400">
            {new Date(params.value).toLocaleString("en-GB", {
              year: "numeric",
              month: "2-digit",
              day: "2-digit",
              hour: "2-digit",
              minute: "2-digit",
              second: "2-digit"
            })}
          </span>
        )
      },
      {
        headerName: "User",
        field: "userName",
        minWidth: 190,
        cellRenderer: (params: any) => {
          const log: AuditLogItem = params.data;
          if (!log) return null;
          const initials = log.userInitials || log.userName?.slice(0, 2).toUpperCase() || "US";
          return (
            <div className="h-full flex items-center gap-2.5 min-w-0">
              <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-blue-600 text-white font-bold text-[10px]">
                {initials}
              </div>
              <div className="min-w-0">
                <p className="font-semibold text-xs text-slate-900 dark:text-white leading-tight truncate">
                  {log.userName}
                </p>
                <p className="text-2xs text-slate-400 leading-tight truncate">
                  {log.userRole}
                </p>
              </div>
            </div>
          );
        }
      },
      {
        headerName: "Action & Module",
        field: "action",
        minWidth: 170,
        cellRenderer: (params: any) => {
          const log: AuditLogItem = params.data;
          if (!log) return null;
          return (
            <div className="min-w-0">
              <span className="font-mono font-bold text-slate-800 dark:text-white text-xs block truncate">
                {log.action}
              </span>
              <p className="text-2xs text-blue-500 font-medium truncate">
                {log.module}
              </p>
            </div>
          );
        }
      },
      {
        headerName: "Details",
        field: "details",
        minWidth: 260,
        flex: 1.5,
        cellRenderer: (params: any) => (
          <span className="text-xs text-slate-700 dark:text-slate-300 line-clamp-2" title={params.value}>
            {params.value}
          </span>
        )
      },
      {
        headerName: "IP Address",
        field: "ipAddress",
        minWidth: 130,
        cellRenderer: (params: any) => (
          <span className="font-mono text-2xs text-slate-500 dark:text-slate-400">
            {params.value}
          </span>
        )
      },
      {
        headerName: "Status",
        field: "status",
        minWidth: 130,
        cellRenderer: (params: any) => {
          const status = params.value;
          if (status === "SUCCESS") {
            return (
              <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                <CheckCircle2 className="h-3.5 w-3.5 shrink-0" />
                Success
              </span>
            );
          }
          if (status === "WARNING") {
            return (
              <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-amber-600 dark:text-amber-400">
                <AlertTriangle className="h-3.5 w-3.5 shrink-0" />
                Warning
              </span>
            );
          }
          return (
            <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-rose-600 dark:text-rose-400">
              <XCircle className="h-3.5 w-3.5 shrink-0" />
              Failed
            </span>
          );
        }
      }
    ],
    []
  );

  return (
    <div className="space-y-6">
      <PageHeader
        breadcrumbs={[
          { label: "Dashboard", href: "/dashboard" },
          { label: "System Config", href: "/system-config" },
          { label: "Audit Log" }
        ]}
        title="Audit Log"
        description="Review user activity, configuration changes, access events, and operational records across your fleet workspace."
      />

      {/* Metric Counters Strip with Smooth Cross-Fade */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="panel-card p-4">
          <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Total Recorded</p>
          <div className="h-7 flex items-center mt-1 relative">
            <span
              aria-hidden="true"
              className={`absolute inset-y-0 left-0 flex items-center transition-opacity duration-300 ease-out ${
                isLoading ? "opacity-100" : "opacity-0 pointer-events-none"
              }`}
            >
              <span className="w-9 h-5 bg-slate-200/80 dark:bg-slate-700/60 rounded animate-pulse" />
            </span>
            <h3
              className={`text-xl font-bold text-slate-900 dark:text-white transition-opacity duration-300 ease-out ${
                isLoading ? "opacity-0" : "opacity-100"
              }`}
            >
              {metrics.total}
            </h3>
          </div>
          <span className="text-[10px] text-blue-500 font-semibold mt-1 inline-block">PostgreSQL Audit Trail</span>
        </div>
        <div className="panel-card p-4">
          <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Successful</p>
          <div className="h-7 flex items-center mt-1 relative">
            <span
              aria-hidden="true"
              className={`absolute inset-y-0 left-0 flex items-center transition-opacity duration-300 ease-out ${
                isLoading ? "opacity-100" : "opacity-0 pointer-events-none"
              }`}
            >
              <span className="w-9 h-5 bg-emerald-100/80 dark:bg-emerald-950/60 rounded animate-pulse" />
            </span>
            <h3
              className={`text-xl font-bold text-emerald-600 dark:text-emerald-400 transition-opacity duration-300 ease-out ${
                isLoading ? "opacity-0" : "opacity-100"
              }`}
            >
              {metrics.successCount}
            </h3>
          </div>
          <span className="text-[10px] text-slate-400 font-medium mt-1 inline-block">{metrics.rate}% success rate</span>
        </div>
        <div className="panel-card p-4">
          <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Alerts & Warnings</p>
          <div className="h-7 flex items-center mt-1 relative">
            <span
              aria-hidden="true"
              className={`absolute inset-y-0 left-0 flex items-center transition-opacity duration-300 ease-out ${
                isLoading ? "opacity-100" : "opacity-0 pointer-events-none"
              }`}
            >
              <span className="w-9 h-5 bg-amber-100/80 dark:bg-amber-950/60 rounded animate-pulse" />
            </span>
            <h3
              className={`text-xl font-bold text-amber-500 transition-opacity duration-300 ease-out ${
                isLoading ? "opacity-0" : "opacity-100"
              }`}
            >
              {metrics.warningCount}
            </h3>
          </div>
          <span className="text-[10px] text-amber-500 font-medium mt-1 inline-block">Operational review</span>
        </div>
        <div className="panel-card p-4">
          <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Failed Events</p>
          <div className="h-7 flex items-center mt-1 relative">
            <span
              aria-hidden="true"
              className={`absolute inset-y-0 left-0 flex items-center transition-opacity duration-300 ease-out ${
                isLoading ? "opacity-100" : "opacity-0 pointer-events-none"
              }`}
            >
              <span className="w-9 h-5 bg-rose-100/80 dark:bg-rose-950/60 rounded animate-pulse" />
            </span>
            <h3
              className={`text-xl font-bold text-rose-500 transition-opacity duration-300 ease-out ${
                isLoading ? "opacity-0" : "opacity-100"
              }`}
            >
              {metrics.failedCount}
            </h3>
          </div>
          <span className="text-[10px] text-rose-500 font-medium mt-1 inline-block">Security flag check</span>
        </div>
      </div>

      {/* Unified TableFilterBar */}
      <TableFilterBar
        search={searchTerm}
        onSearchChange={setSearchTerm}
        searchPlaceholder="Search by user, action, IP, or details..."
        statusFilter={statusFilter}
        onStatusFilterChange={setStatusFilter}
        statusOptions={["ALL", "SUCCESS", "WARNING", "FAILED"]}
        onRefresh={() => refetch()}
        isRefreshing={isFetching}
        onExport={handleExport}
        exportLabel="Export CSV"
      />

      {/* Main Data Table with Standard Panel-Card Padding */}
      <div className="panel-card p-4 sm:p-5 overflow-hidden">
        <AppDataTable<AuditLogItem>
          rowData={logs}
          columnDefs={columns}
          isLoading={isLoading}
          total={totalCount}
          page={page}
          pageSize={pageSize}
          totalPages={totalPages}
          onPageChange={(p) => setPage(p)}
          onPageSizeChange={(newSize) => {
            setPageSize(newSize);
            setPage(1);
          }}
        />
      </div>
    </div>
  );
};

export default AuditLogPage;
