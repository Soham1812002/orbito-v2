import React, { useState, useMemo } from "react";
import {
  ShieldAlert,
  PowerOff,
  Power,
  RefreshCw,
  Download,
  Search,
  CheckCircle2,
  AlertTriangle,
  Send,
  Lock,
  Cpu
} from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { Button } from "@/components/common/Button";
import { AppDataTable } from "@/components/common/AppDataTable";
import { Modal } from "@/components/common/Modal";
import { useImmobilizerAudits, useLogImmobilizerCommand } from "./immobilizer.queries";
import { getImmobilizerColumns } from "./immobilizer.columns";
import { ImmobilizerAudit, LogImmobilizerCommandData } from "./immobilizer.types";
import { showToast } from "@/lib/toast";

export const ImmobilizerAuditListPage: React.FC = () => {
  const [search, setSearch] = useState("");
  const [commandFilter, setCommandFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [isCommandModalOpen, setIsCommandModalOpen] = useState(false);

  // Command modal form state
  const [cmdVehiclePlate, setCmdVehiclePlate] = useState("GJ 05 AB 1234");
  const [cmdType, setCmdType] = useState<"STOP_ENGINE" | "RESUME_ENGINE">("STOP_ENGINE");
  const [cmdReason, setCmdReason] = useState("");
  const [securityAcknowledged, setSecurityAcknowledged] = useState(false);

  const { data, isLoading, refetch, isFetching } = useImmobilizerAudits({
    search: search || undefined,
    command: commandFilter === "all" ? undefined : commandFilter,
    status: statusFilter === "all" ? undefined : statusFilter
  });

  const commandMutation = useLogImmobilizerCommand();
  const logs = data?.rows || [];

  const metrics = useMemo(() => {
    const total = logs.length;
    const cuts = logs.filter((l) => l.command === "STOP_ENGINE").length;
    const resumes = logs.filter((l) => l.command === "RESUME_ENGINE").length;
    const executed = logs.filter((l) => l.status === "executed").length;
    const successRate = total > 0 ? ((executed / total) * 100).toFixed(1) : "100";
    return { total, cuts, resumes, successRate };
  }, [logs]);

  const handleExportCsv = () => {
    if (logs.length === 0) return;
    const headers = [
      "Vehicle Plate",
      "Command",
      "Status",
      "Operator",
      "Timestamp",
      "Voltage (V)",
      "Speed (km/h)",
      "Response (ms)",
      "Location",
      "Reason"
    ];
    const csvRows = logs.map((l) => [
      `"${l.vehiclePlate}"`,
      l.command,
      l.status,
      `"${l.operatorName}"`,
      l.createdAt,
      l.relayVoltage || "--",
      l.speedAtExecution !== undefined ? l.speedAtExecution : "--",
      l.responseTimeMs || "--",
      `"${l.locationAddress || ""}"`,
      `"${l.reason.replace(/"/g, '""')}"`
    ]);
    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...csvRows.map((e) => e.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `immobilizer_audit_log_${new Date().toISOString().split("T")[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleSendCommand = (e: React.FormEvent) => {
    e.preventDefault();
    if (!cmdVehiclePlate.trim()) {
      showToast.error("Vehicle registration plate is required");
      return;
    }
    if (!cmdReason.trim()) {
      showToast.error("Mandatory audit reason required for remote relay trigger");
      return;
    }
    if (!securityAcknowledged) {
      showToast.error("Please confirm the safety safeguard protocol");
      return;
    }

    const payload: LogImmobilizerCommandData = {
      vehicleId: "veh-test",
      vehiclePlate: cmdVehiclePlate.trim().toUpperCase(),
      command: cmdType,
      status: "executed",
      operatorId: "usr-current",
      operatorName: "Super Admin",
      reason: cmdReason.trim(),
      latitude: 23.0225,
      longitude: 72.5714,
      locationAddress: "Command Dispatched via Telematics Gateway",
      relayVoltage: 12.5,
      speedAtExecution: 0,
      responseTimeMs: 720
    };

    commandMutation.mutate(payload, {
      onSuccess: () => {
        setIsCommandModalOpen(false);
        setCmdReason("");
        setSecurityAcknowledged(false);
      }
    });
  };

  const columns = useMemo(() => getImmobilizerColumns({}), []);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Engine Immobilizer Audit Log"
        description="Security audit trail of electronic starter cuts, fuel valve interruptions, and ignition restoration relay commands"
        breadcrumbs={[
          { label: "Dashboard", href: "/" },
          { label: "Operations", href: "/operations/immobilizer" },
          { label: "Immobilizer Log" }
        ]}
        actions={
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => refetch()}
              isLoading={isFetching}
              leftIcon={<RefreshCw className={`w-4 h-4 ${isFetching ? "animate-spin" : ""}`} />}
            >
              Refresh
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleExportCsv}
              leftIcon={<Download className="w-4 h-4" />}
            >
              Export CSV
            </Button>
            <Button
              variant="danger"
              size="sm"
              onClick={() => setIsCommandModalOpen(true)}
              leftIcon={<PowerOff className="w-4 h-4" />}
            >
              Dispatch Command
            </Button>
          </div>
        }
      />

      {/* KPI Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="panel-card p-4 flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-slate-500 dark:text-slate-400">Total Commands</p>
            <p className="text-2xl font-bold font-mono text-slate-900 dark:text-white mt-1">
              {metrics.total}
            </p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950/50 flex items-center justify-center text-blue-600 dark:text-blue-400">
            <Cpu className="w-5 h-5" />
          </div>
        </div>

        <div className="panel-card p-4 flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-slate-500 dark:text-slate-400">Engine Cuts (Stops)</p>
            <p className="text-2xl font-bold font-mono text-rose-600 dark:text-rose-400 mt-1">
              {metrics.cuts}
            </p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-rose-50 dark:bg-rose-950/50 flex items-center justify-center text-rose-600 dark:text-rose-400">
            <PowerOff className="w-5 h-5" />
          </div>
        </div>

        <div className="panel-card p-4 flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-slate-500 dark:text-slate-400">Restorations Completed</p>
            <p className="text-2xl font-bold font-mono text-emerald-600 dark:text-emerald-400 mt-1">
              {metrics.resumes}
            </p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
            <Power className="w-5 h-5" />
          </div>
        </div>

        <div className="panel-card p-4 flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-slate-500 dark:text-slate-400">Execution Success</p>
            <p className="text-2xl font-bold font-mono text-indigo-600 dark:text-indigo-400 mt-1">
              {metrics.successRate}%
            </p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950/50 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
            <CheckCircle2 className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="panel-card p-4 space-y-3">
        {/* Quick Filter Chips */}
        <div className="flex flex-wrap items-center gap-2 pb-2 border-b border-slate-100 dark:border-slate-800">
          <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 mr-1">Quick Filters:</span>
          <button
            type="button"
            onClick={() => {
              setCommandFilter("all");
              setStatusFilter("all");
            }}
            className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${
              commandFilter === "all" && statusFilter === "all"
                ? "bg-blue-600 text-white shadow-xs"
                : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700"
            }`}
          >
            All Commands
          </button>
          <button
            type="button"
            onClick={() => {
              setCommandFilter("STOP_ENGINE");
              setStatusFilter("all");
            }}
            className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${
              commandFilter === "STOP_ENGINE"
                ? "bg-rose-600 text-white shadow-xs"
                : "bg-slate-100 dark:bg-slate-800 text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40"
            }`}
          >
            Engine Cuts Only ({metrics.cuts})
          </button>
          <button
            type="button"
            onClick={() => {
              setCommandFilter("RESUME_ENGINE");
              setStatusFilter("all");
            }}
            className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${
              commandFilter === "RESUME_ENGINE"
                ? "bg-emerald-600 text-white shadow-xs"
                : "bg-slate-100 dark:bg-slate-800 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-950/40"
            }`}
          >
            Restorations Only ({metrics.resumes})
          </button>
          <button
            type="button"
            onClick={() => {
              setCommandFilter("all");
              setStatusFilter("failed");
            }}
            className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${
              statusFilter === "failed"
                ? "bg-amber-600 text-white shadow-xs"
                : "bg-slate-100 dark:bg-slate-800 text-amber-600 dark:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-950/40"
            }`}
          >
            Failed Relays Only
          </button>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search by vehicle plate, operator, reason, or location..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white placeholder:text-slate-400 focus-ring"
            />
          </div>

          <div className="flex items-center gap-2">
            <select
              value={commandFilter}
              onChange={(e) => setCommandFilter(e.target.value)}
              className="text-xs py-2 px-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 focus-ring"
            >
              <option value="all">All Commands</option>
              <option value="STOP_ENGINE">STOP_ENGINE Only</option>
              <option value="RESUME_ENGINE">RESUME_ENGINE Only</option>
            </select>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="text-xs py-2 px-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 focus-ring"
            >
              <option value="all">All Relay Statuses</option>
              <option value="executed">Executed Successfully</option>
              <option value="failed">Interlock Failed</option>
              <option value="pending">Command Pending</option>
            </select>
          </div>
        </div>
      </div>

      {/* Table Card */}
      <div className="panel-card p-4 sm:p-5 overflow-hidden">
        <AppDataTable
          rowData={logs}
          columnDefs={columns}
          isLoading={isLoading}
        />
      </div>

      {/* Dispatch Remote Command Dialog */}
      <Modal
        isOpen={isCommandModalOpen}
        onClose={() => setIsCommandModalOpen(false)}
        title="Dispatch Remote Relay Command"
      >
        <form onSubmit={handleSendCommand} className="space-y-4">
          <div className="p-3 rounded-xl border border-rose-200 dark:border-rose-900/60 bg-rose-50/30 dark:bg-rose-950/20 flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
            <div className="text-xs text-rose-900 dark:text-rose-200 leading-relaxed">
              <span className="font-semibold block">High-Risk Operation Protocol</span>
              Engine cut commands will immediately disable fuel relay injection once vehicle speed drops below 15 km/h. All commands are logged to permanent audit storage.
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
              Vehicle Registration Plate <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              placeholder="e.g. GJ 05 AB 1234"
              value={cmdVehiclePlate}
              onChange={(e) => setCmdVehiclePlate(e.target.value.toUpperCase())}
              className="w-full text-xs py-2 px-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 font-mono text-slate-900 dark:text-white focus-ring"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
              Select Command Action <span className="text-rose-500">*</span>
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setCmdType("STOP_ENGINE")}
                className={`py-2 px-3 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 border transition-all ${
                  cmdType === "STOP_ENGINE"
                    ? "bg-rose-600 text-white border-rose-600 shadow-sm"
                    : "border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50"
                }`}
              >
                <PowerOff className="w-3.5 h-3.5" />
                STOP ENGINE (CUT)
              </button>

              <button
                type="button"
                onClick={() => setCmdType("RESUME_ENGINE")}
                className={`py-2 px-3 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 border transition-all ${
                  cmdType === "RESUME_ENGINE"
                    ? "bg-emerald-600 text-white border-emerald-600 shadow-sm"
                    : "border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50"
                }`}
              >
                <Power className="w-3.5 h-3.5" />
                RESUME ENGINE
              </button>
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
              Mandatory Audit Reason / Justification <span className="text-rose-500">*</span>
            </label>
            <textarea
              rows={3}
              placeholder="e.g. Geofence breach after curfew / Verified theft attempt / Scheduled workshop test..."
              value={cmdReason}
              onChange={(e) => setCmdReason(e.target.value)}
              className="w-full text-xs py-2 px-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus-ring"
            />
          </div>

          <div className="flex items-start gap-2.5 pt-1">
            <input
              type="checkbox"
              id="securityAck"
              checked={securityAcknowledged}
              onChange={(e) => setSecurityAcknowledged(e.target.checked)}
              className="mt-1 w-4 h-4 rounded border-slate-300 text-rose-600 focus:ring-rose-500"
            />
            <label htmlFor="securityAck" className="text-xs text-slate-600 dark:text-slate-400 cursor-pointer">
              I certify that vehicle safety conditions have been verified and I authorize transmission of this telematics relay trigger.
            </label>
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setIsCommandModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant={cmdType === "STOP_ENGINE" ? "danger" : "primary"}
              size="sm"
              isLoading={commandMutation.isPending}
              leftIcon={<Send className="w-4 h-4" />}
            >
              Transmit Command
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default ImmobilizerAuditListPage;
