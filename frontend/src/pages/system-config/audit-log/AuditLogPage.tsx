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
import { PageHeader } from "../../../components/layout/PageHeader";
import { Button } from "../../../components/common/Button";
import { showToast } from "../../../lib/toast";
import { auditLogApi, AuditLogItem } from "./AuditLog.api";

export const AuditLogPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [page, setPage] = useState(1);
  const pageSize = 50;

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
    staleTime: 30000
  });

  const logs: AuditLogItem[] = data?.rows || [];
  const totalCount = data?.total || 0;

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
    const headers = "ID,Timestamp,User,Role,Action,Module,IP Address,Status,Details";
    const rows = logs.map(
      (l) =>
        `"${l.id}","${l.timestamp}","${(l.userName || "").replace(/"/g, '""')}","${(l.userRole || "").replace(/"/g, '""')}","${l.action}","${(l.module || "").replace(/"/g, '""')}","${l.ipAddress}","${l.status}","${(l.details || "").replace(/"/g, '""')}"`
    );
    const csvContent = [headers, ...rows].join("\r\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `audit-log-${new Date().toISOString().split("T")[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    showToast.success("Audit log export downloaded successfully!");
  };

  return (
    <div className="space-y-6">
      <PageHeader
        breadcrumbs={[
          { label: "Dashboard", href: "/dashboard" },
          { label: "System Config", href: "/system-config" },
          { label: "Audit Log" }
        ]}
        title="Audit Log"
        badge={`${metrics.total} EVENTS`}
        badgeVariant="cyan"
        description="Review user activity, configuration changes, access events, and operational records across your fleet workspace."
        actions={
          <div className="flex items-center gap-2">
            <Button
              variant="secondary"
              leftIcon={<RefreshCw className={`h-4 w-4 ${isFetching ? "animate-spin" : ""}`} />}
              onClick={() => refetch()}
              disabled={isFetching}
            >
              Refresh
            </Button>
            <Button
              variant="secondary"
              leftIcon={<Download className="h-4 w-4" />}
              onClick={handleExport}
            >
              Export CSV
            </Button>
          </div>
        }
      />

      {/* Metric Counters Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="panel-card p-4">
          <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Total Recorded</p>
          <h3 className="text-xl font-bold text-slate-900 dark:text-white mt-1">{metrics.total}</h3>
          <span className="text-[10px] text-blue-500 font-semibold mt-1 inline-block">PostgreSQL Audit Trail</span>
        </div>
        <div className="panel-card p-4">
          <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Successful</p>
          <h3 className="text-xl font-bold text-emerald-600 dark:text-emerald-400 mt-1">{metrics.successCount}</h3>
          <span className="text-[10px] text-slate-400 font-medium mt-1 inline-block">{metrics.rate}% success rate</span>
        </div>
        <div className="panel-card p-4">
          <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Alerts & Warnings</p>
          <h3 className="text-xl font-bold text-amber-500 mt-1">{metrics.warningCount}</h3>
          <span className="text-[10px] text-amber-500 font-medium mt-1 inline-block">Operational review</span>
        </div>
        <div className="panel-card p-4">
          <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Failed Events</p>
          <h3 className="text-xl font-bold text-rose-500 mt-1">{metrics.failedCount}</h3>
          <span className="text-[10px] text-rose-500 font-medium mt-1 inline-block">Security flag check</span>
        </div>
      </div>

      {/* Search & Filter Toolbar */}
      <div className="panel-card p-4 space-y-3">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by user, action, IP, or details..."
              className="w-full rounded-xl bg-slate-50 dark:bg-[#162032] border border-slate-200 dark:border-[#1D293D] pl-9 pr-4 py-2 text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-blue-500"
            />
          </div>

          <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
            {["ALL", "SUCCESS", "WARNING", "FAILED"].map((status) => (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                  statusFilter === status
                    ? "bg-blue-600 text-white shadow-xs"
                    : "bg-slate-100 dark:bg-[#162032] text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                }`}
              >
                {status}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Audit Log Table */}
      <div className="panel-card overflow-hidden">
        {isLoading ? (
          <div className="flex items-center justify-center py-16 text-slate-400">
            <Loader2 className="h-6 w-6 animate-spin mr-2 text-blue-500" />
            <span className="text-xs font-medium">Loading audit trail from database...</span>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-600 dark:text-slate-300">
              <thead className="bg-slate-50 dark:bg-[#162032] border-b border-slate-200 dark:border-[#1D293D] text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-400">
                <tr>
                  <th className="px-4 py-3">Timestamp</th>
                  <th className="px-4 py-3">User</th>
                  <th className="px-4 py-3">Action & Module</th>
                  <th className="px-4 py-3">Details</th>
                  <th className="px-4 py-3">IP Address</th>
                  <th className="px-4 py-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-[#1D293D]">
                {logs.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-4 py-12 text-center text-slate-400">
                      No matching audit log records found.
                    </td>
                  </tr>
                ) : (
                  logs.map((log) => (
                    <tr key={log.id} className="hover:bg-slate-50/50 dark:hover:bg-[#162032]/40 transition-colors">
                      <td className="px-4 py-3.5 whitespace-nowrap font-mono text-[11px] text-slate-500 dark:text-slate-400">
                        {new Date(log.timestamp).toLocaleString("en-GB", {
                          year: "numeric",
                          month: "2-digit",
                          day: "2-digit",
                          hour: "2-digit",
                          minute: "2-digit",
                          second: "2-digit"
                        })}
                      </td>
                      <td className="px-4 py-3.5 whitespace-nowrap">
                        <div className="flex items-center gap-2.5">
                          <div className="flex h-7 w-7 items-center justify-center rounded-full bg-blue-600 text-white font-bold text-[10px]">
                            {log.userInitials || log.userName?.slice(0, 2).toUpperCase() || "US"}
                          </div>
                          <div>
                            <p className="font-semibold text-slate-900 dark:text-white leading-tight">{log.userName}</p>
                            <p className="text-[10px] text-slate-400 leading-tight">{log.userRole}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3.5 whitespace-nowrap">
                        <div>
                          <span className="font-mono font-bold text-slate-800 dark:text-white text-[11px]">
                            {log.action}
                          </span>
                          <p className="text-[10px] text-blue-500 font-medium">{log.module}</p>
                        </div>
                      </td>
                      <td className="px-4 py-3.5 text-slate-700 dark:text-slate-300 max-w-md">
                        <span className="line-clamp-2">{log.details}</span>
                      </td>
                      <td className="px-4 py-3.5 whitespace-nowrap font-mono text-slate-500 dark:text-slate-400 text-[11px]">
                        {log.ipAddress}
                      </td>
                      <td className="px-4 py-3.5 whitespace-nowrap">
                        {log.status === "SUCCESS" && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/40">
                            <CheckCircle2 className="h-3 w-3" />
                            SUCCESS
                          </span>
                        )}
                        {log.status === "WARNING" && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 border border-amber-200 dark:border-amber-800/40">
                            <AlertTriangle className="h-3 w-3" />
                            WARNING
                          </span>
                        )}
                        {log.status === "FAILED" && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-800/40">
                            <XCircle className="h-3 w-3" />
                            FAILED
                          </span>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AuditLogPage;
